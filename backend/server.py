from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta, date as date_cls
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from validation import validate_name, validate_email, validate_company, validate_free_text


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class AuditRequestCreate(BaseModel):
    name: str
    company: str
    country: str
    industry: str
    process: str
    contact_method: str
    email: Optional[str] = None
    slot_iso_utc: Optional[str] = None  # ISO 8601 UTC timestamp of chosen slot
    timezone: Optional[str] = None      # IANA tz of user's selection, e.g. "Asia/Dubai"

class AuditRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str
    country: str
    industry: str
    process: str
    contact_method: str
    email: Optional[str] = None
    slot_iso_utc: Optional[str] = None
    timezone: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# --- Booking config -----------------------------------------------------------
# All bookable slots are anchored to India Standard Time (IST) business hours and
# then converted (DST-aware) into whatever timezone the visitor selects.
#   - Window: IST 08:00 -> 20:00 (8 AM - 8 PM), EVERY day of the week.
#   - Start grid: every 15 minutes. A start is valid only if start + duration
#     still finishes by 20:00 IST.
#   - Durations: 15 minutes (default) or 30 minutes (visitor can extend).
IST_ZONE = ZoneInfo("Asia/Kolkata")
IST_WINDOW_START_HOUR = 8      # 08:00 IST
IST_WINDOW_END_HOUR = 20       # 20:00 IST (exclusive window end)
SLOT_GRID_MINUTES = 15         # spacing between consecutive start times
ALLOWED_DURATIONS = {15, 30}
DEFAULT_DURATION = 15
LEGACY_DURATION = 30           # bookings without a stored duration are assumed 30 min

ALLOWED_TIMEZONES = {
    "Asia/Dubai",            # UAE · GST
    "Asia/Kolkata",          # India · IST
    "Asia/Singapore",        # Singapore · SGT
    # United States
    "America/New_York",      # US Eastern · ET
    "America/Chicago",       # US Central · CT
    "America/Denver",        # US Mountain · MT
    "America/Phoenix",       # US Arizona · MST (no DST)
    "America/Los_Angeles",   # US Pacific · PT
    "America/Anchorage",     # US Alaska · AKT
    "Pacific/Honolulu",      # US Hawaii · HST
    # Australia
    "Australia/Sydney",      # AEST/AEDT
    "Australia/Brisbane",    # AEST (no DST)
    "Australia/Adelaide",    # ACST/ACDT
    "Australia/Darwin",      # ACST (no DST)
    "Australia/Perth",       # AWST
    "Australia/Hobart",      # AEDT (Tasmania)
}


class Slot(BaseModel):
    label: str       # display label in local tz, e.g. "09:30"
    iso_utc: str     # canonical ISO 8601 UTC string used as the slot key
    taken: bool


class PlaybookLeadCreate(BaseModel):
    name: str
    company: Optional[str] = None
    designation: Optional[str] = None
    email: EmailStr
    industry: Optional[str] = None
    country: Optional[str] = None
    session_interest: Optional[str] = None  # "Yes" | "Maybe" | "No"
    source: Optional[str] = None             # which page submitted
    asset_title: Optional[str] = None        # which asset was downloaded


class PlaybookLead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: Optional[str] = None
    designation: Optional[str] = None
    email: str
    industry: Optional[str] = None
    country: Optional[str] = None
    session_interest: Optional[str] = None
    source: Optional[str] = None
    asset_title: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "WeHA API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


def _ist_slot_starts(ist_date: date_cls, duration: int):
    """Aware IST start datetimes within the 08:00-20:00 window on `ist_date`."""
    starts = []
    day_start = datetime(ist_date.year, ist_date.month, ist_date.day,
                         IST_WINDOW_START_HOUR, 0, tzinfo=IST_ZONE)
    window_end = datetime(ist_date.year, ist_date.month, ist_date.day,
                          IST_WINDOW_END_HOUR, 0, tzinfo=IST_ZONE)
    step = timedelta(minutes=SLOT_GRID_MINUTES)
    cur = day_start
    while cur + timedelta(minutes=duration) <= window_end:
        starts.append(cur)
        cur += step
    return starts


async def _fetch_booked_intervals():
    """All booked (start_utc, end_utc) intervals across audit + booking records."""
    intervals = []
    for coll in (db.audit_requests, db.booking_requests):
        cursor = coll.find(
            {"slot_iso_utc": {"$ne": None}},
            {"_id": 0, "slot_iso_utc": 1, "duration_minutes": 1},
        )
        async for doc in cursor:
            iso = doc.get("slot_iso_utc")
            if not iso:
                continue
            try:
                start = datetime.fromisoformat(iso.replace("Z", "+00:00"))
            except Exception:
                continue
            dur = doc.get("duration_minutes") or LEGACY_DURATION
            intervals.append((start, start + timedelta(minutes=dur)))
    return intervals


@api_router.get("/availability", response_model=List[Slot])
async def get_availability(
    date: str = Query(..., description="YYYY-MM-DD in the chosen timezone"),
    tz: str = Query(..., description="IANA timezone, e.g. Asia/Dubai"),
    duration: int = Query(DEFAULT_DURATION, description="Call length in minutes (15 or 30)"),
):
    if tz not in ALLOWED_TIMEZONES:
        raise HTTPException(status_code=400, detail=f"Unsupported timezone: {tz}")
    try:
        zone = ZoneInfo(tz)
    except ZoneInfoNotFoundError:
        raise HTTPException(status_code=400, detail=f"Unknown timezone: {tz}")
    if duration not in ALLOWED_DURATIONS:
        duration = DEFAULT_DURATION
    try:
        y, m, d = (int(x) for x in date.split("-"))
        target_date = date_cls(y, m, d)
    except Exception:
        raise HTTPException(status_code=400, detail="Date must be YYYY-MM-DD")

    now_utc = datetime.now(timezone.utc)
    min_utc = now_utc + timedelta(minutes=15)

    # Build IST-anchored candidates, convert to the visitor's tz, keep the ones
    # whose local wall-clock falls on the requested date. Looking at IST dates
    # {D-1, D, D+1} guarantees we capture every slot that lands on date D for any
    # supported timezone, regardless of its UTC offset.
    candidates = {}  # iso_utc -> {"label", "start"}
    for offset in (-1, 0, 1):
        ist_date = target_date + timedelta(days=offset)
        for ist_start in _ist_slot_starts(ist_date, duration):
            utc_dt = ist_start.astimezone(timezone.utc)
            local_dt = utc_dt.astimezone(zone)
            if local_dt.date() != target_date:
                continue
            if utc_dt <= min_utc:
                continue
            iso = utc_dt.isoformat().replace("+00:00", "Z")
            candidates[iso] = {
                "label": local_dt.strftime("%-I:%M %p"),
                "start": utc_dt,
            }

    if not candidates:
        return []

    booked = await _fetch_booked_intervals()

    result = []
    for iso, c in sorted(candidates.items(), key=lambda kv: kv[1]["start"]):
        cand_start = c["start"]
        cand_end = cand_start + timedelta(minutes=duration)
        taken = any(b_start < cand_end and b_end > cand_start for (b_start, b_end) in booked)
        result.append(Slot(label=c["label"], iso_utc=iso, taken=taken))
    return result


@api_router.post("/audit-requests", response_model=AuditRequest)
async def create_audit_request(input: AuditRequestCreate):
    # Anti-spam / junk-data validation (mirrors frontend spamGuard).
    validate_name(input.name)
    validate_company(input.company, required=True)
    validate_email(input.email, required=False)
    validate_free_text(input.process, "the process you want to fix")

    # If a slot was selected, validate it
    if input.slot_iso_utc:
        if input.timezone and input.timezone not in ALLOWED_TIMEZONES:
            raise HTTPException(status_code=422, detail="Unsupported timezone.")
        try:
            slot_dt = datetime.fromisoformat(input.slot_iso_utc.replace("Z", "+00:00"))
        except Exception:
            raise HTTPException(status_code=422, detail="Invalid slot_iso_utc format.")
        if slot_dt <= datetime.now(timezone.utc):
            raise HTTPException(status_code=422, detail="Selected slot is in the past.")
        # Atomically prevent double-booking
        existing = await db.audit_requests.find_one({"slot_iso_utc": input.slot_iso_utc}, {"_id": 1})
        if existing:
            raise HTTPException(status_code=409, detail="That slot was just taken. Please pick another.")

    obj = AuditRequest(**input.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.audit_requests.insert_one(doc)
    return obj

@api_router.get("/audit-requests", response_model=List[AuditRequest])
async def get_audit_requests():
    items = await db.audit_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for it in items:
        if isinstance(it['created_at'], str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


# --- Playbook lead capture (AI Transformation Playbook download form) ---------
@api_router.post("/playbook-requests", response_model=PlaybookLead)
async def create_playbook_request(input: PlaybookLeadCreate):
    # Anti-spam / junk-data validation (mirrors frontend spamGuard).
    validate_name(input.name)
    validate_email(input.email, required=True)
    validate_company(input.company, required=False)
    obj = PlaybookLead(**input.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.playbook_requests.insert_one(doc)
    return obj


@api_router.get("/playbook-requests", response_model=List[PlaybookLead])
async def get_playbook_requests():
    items = await db.playbook_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for it in items:
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


# --- Calculator lead capture (Services / Work hero ValueCalculators) ----------
class CalculatorLeadCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    source: Optional[str] = None
    inputs_json: Optional[str] = None     # selected calculator inputs, stringified JSON
    result_summary: Optional[str] = None  # computed headline, for context


class CalculatorLead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = None
    source: Optional[str] = None
    inputs_json: Optional[str] = None
    result_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.post("/calculator-leads", response_model=CalculatorLead)
async def create_calculator_lead(input: CalculatorLeadCreate):
    # Anti-spam / junk-data validation (mirrors frontend spamGuard).
    validate_name(input.name)
    validate_email(input.email, required=True)
    validate_company(input.company, required=False)

    data = input.model_dump()
    # Cap stored field lengths.
    if data.get('inputs_json'):
        data['inputs_json'] = data['inputs_json'][:4000]
    if data.get('result_summary'):
        data['result_summary'] = data['result_summary'][:500]

    obj = CalculatorLead(**data)
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.calculator_leads.insert_one(doc)
    return obj


@api_router.get("/calculator-leads", response_model=List[CalculatorLead])
async def get_calculator_leads():
    items = await db.calculator_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for it in items:
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


# --- Contact messages (Contact page audit-request form) ----------------------
# Mirrors functions/api/contact-messages.js so the form works in this dev/preview
# environment (where /api routes to FastAPI instead of the Cloudflare Function).
class ContactMessageCreate(BaseModel):
    name: str
    company: Optional[str] = None
    country: Optional[str] = None
    industry: Optional[str] = None
    process: Optional[str] = None
    contact_method: Optional[str] = None
    email: Optional[str] = None
    source: Optional[str] = None


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: Optional[str] = None
    country: Optional[str] = None
    industry: Optional[str] = None
    process: Optional[str] = None
    contact_method: Optional[str] = None
    email: Optional[str] = None
    source: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.post("/contact-messages", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    # Same validation order as the Cloudflare function.
    validate_name(input.name)
    validate_company(input.company, required=True)
    validate_email(input.email, required=False)
    validate_free_text(input.process, "the process you want to fix")

    obj = ContactMessage(**input.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return obj


@api_router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages():
    items = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for it in items:
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


# --- Booking requests (Book a Free Audit modal) ------------------------------
# Mirrors functions/api/booking-requests.js so the booking modal works in this
# dev/preview environment. Slots are de-duplicated against both audit_requests
# and booking_requests so /availability stays accurate.
class BookingRequestCreate(BaseModel):
    name: str
    company: Optional[str] = None
    country: Optional[str] = None
    industry: Optional[str] = None
    process: Optional[str] = None
    contact_method: Optional[str] = None
    email: Optional[str] = None
    slot_iso_utc: Optional[str] = None
    timezone: Optional[str] = None
    duration_minutes: Optional[int] = DEFAULT_DURATION
    source: Optional[str] = None


class BookingRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: Optional[str] = None
    country: Optional[str] = None
    industry: Optional[str] = None
    process: Optional[str] = None
    contact_method: Optional[str] = None
    email: Optional[str] = None
    slot_iso_utc: Optional[str] = None
    timezone: Optional[str] = None
    duration_minutes: Optional[int] = DEFAULT_DURATION
    source: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.post("/booking-requests", response_model=BookingRequest)
async def create_booking_request(input: BookingRequestCreate):
    validate_name(input.name)
    validate_company(input.company, required=True)
    validate_email(input.email, required=False)
    validate_free_text(input.process, "the process you want to fix")

    duration = input.duration_minutes if input.duration_minutes in ALLOWED_DURATIONS else DEFAULT_DURATION

    if input.slot_iso_utc:
        if input.timezone and input.timezone not in ALLOWED_TIMEZONES:
            raise HTTPException(status_code=422, detail="Unsupported timezone.")
        try:
            slot_dt = datetime.fromisoformat(input.slot_iso_utc.replace("Z", "+00:00"))
        except Exception:
            raise HTTPException(status_code=422, detail="Invalid slot_iso_utc format.")
        if slot_dt <= datetime.now(timezone.utc):
            raise HTTPException(status_code=422, detail="Selected slot is in the past.")
        # Prevent double-booking: reject if the chosen interval overlaps any
        # existing audit/booking interval (durations considered).
        cand_end = slot_dt + timedelta(minutes=duration)
        for b_start, b_end in await _fetch_booked_intervals():
            if b_start < cand_end and b_end > slot_dt:
                raise HTTPException(status_code=409, detail="That slot was just taken. Please pick another.")

    obj = BookingRequest(**{**input.model_dump(), "duration_minutes": duration})
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.booking_requests.insert_one(doc)
    return obj


@api_router.get("/booking-requests", response_model=List[BookingRequest])
async def get_booking_requests():
    items = await db.booking_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for it in items:
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


# Include the router in the main app

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
