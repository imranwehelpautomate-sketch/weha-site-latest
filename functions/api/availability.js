// GET /api/availability?date=YYYY-MM-DD&tz=<IANA timezone>&duration=<15|30>
// Returns bookable slots for the requested local date, shaped as
// [{ label, iso_utc, taken }] to match BookingModal.jsx / fetchAvailability.
//
// Rules (kept in sync with the local dev backend in backend/server.py):
//   - All slots are anchored to India Standard Time (IST, UTC+5:30, no DST):
//     a window of 08:00 -> 20:00 (8 AM - 8 PM), EVERY day of the week.
//   - Start grid is every 15 minutes; a start is valid only if start+duration
//     still finishes by 20:00 IST.
//   - Durations: 15 minutes (default) or 30 minutes.
//   - IST starts are converted (DST-aware via Intl) into the visitor's selected
//     timezone; only the ones whose local wall-clock lands on the requested date
//     are returned, labelled in the visitor's local time.
//   - Past slots (and anything within the next 15 minutes) are dropped.
//   - A slot is taken:true if its interval overlaps an existing booking interval
//     in the booking_requests D1 table (duration considered; legacy rows = 30m).

const ALLOWED_TIMEZONES = new Set([
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  // United States
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  // Australia
  "Australia/Sydney",
  "Australia/Brisbane",
  "Australia/Adelaide",
  "Australia/Darwin",
  "Australia/Perth",
  "Australia/Hobart",
]);

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000; // IST = UTC+5:30 (fixed)
const IST_WINDOW_START_HOUR = 8; // 08:00 IST
const IST_WINDOW_END_HOUR = 20; // 20:00 IST (exclusive)
const SLOT_GRID_MINUTES = 15;
const ALLOWED_DURATIONS = new Set([15, 30]);
const DEFAULT_DURATION = 15;
const LEGACY_DURATION = 30; // bookings without a stored duration are assumed 30m

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Wall-clock parts of a UTC instant, rendered in `tz`.
function localPartsInTz(utcMs, tz) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const p = dtf.formatToParts(new Date(utcMs)).reduce((acc, x) => {
    acc[x.type] = x.value;
    return acc;
  }, {});
  return {
    y: Number(p.year),
    m: Number(p.month),
    d: Number(p.day),
    hh: Number(p.hour),
    mm: Number(p.minute),
  };
}

function label12(hh, mm) {
  const ampm = hh < 12 ? "AM" : "PM";
  let h = hh % 12;
  if (h === 0) h = 12;
  return `${h}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function isoUtcNoMillis(ms) {
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

// UTC ms for a given IST wall-clock date/time (IST is a fixed UTC+5:30 offset).
function istWallToUtcMs(y, m, d, hh, mm) {
  return Date.UTC(y, m - 1, d, hh, mm, 0) - IST_OFFSET_MS;
}

// All IST start instants (UTC ms) within the window on a given IST calendar date.
function istSlotStartsUtc(y, m, d, duration) {
  const starts = [];
  for (let total = IST_WINDOW_START_HOUR * 60; ; total += SLOT_GRID_MINUTES) {
    if (total + duration > IST_WINDOW_END_HOUR * 60) break;
    const hh = Math.floor(total / 60);
    const mm = total % 60;
    starts.push(istWallToUtcMs(y, m, d, hh, mm));
  }
  return starts;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const date = (url.searchParams.get("date") || "").trim();
  const tz = (url.searchParams.get("tz") || "").trim();
  let duration = Number(url.searchParams.get("duration") || DEFAULT_DURATION);
  if (!ALLOWED_DURATIONS.has(duration)) duration = DEFAULT_DURATION;

  // Unsupported timezone or malformed date -> graceful empty list.
  if (!ALLOWED_TIMEZONES.has(tz)) return json([]);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return json([]);
  const ty = Number(match[1]);
  const tm = Number(match[2]);
  const td = Number(match[3]);

  const nowMs = Date.now();
  const minMs = nowMs + 15 * 60 * 1000; // at least 15 minutes in the future

  // Build IST-anchored candidates from IST dates {D-1, D, D+1}, convert to the
  // visitor's tz, and keep the ones whose local date matches the requested date.
  const candidates = new Map(); // iso -> { label, startMs }
  for (let offset = -1; offset <= 1; offset++) {
    const base = new Date(Date.UTC(ty, tm - 1, td + offset, 12, 0, 0));
    const iy = base.getUTCFullYear();
    const im = base.getUTCMonth() + 1;
    const id = base.getUTCDate();
    for (const startMs of istSlotStartsUtc(iy, im, id, duration)) {
      const lp = localPartsInTz(startMs, tz);
      if (lp.y !== ty || lp.m !== tm || lp.d !== td) continue;
      if (startMs <= minMs) continue;
      const iso = isoUtcNoMillis(startMs);
      candidates.set(iso, { label: label12(lp.hh, lp.mm), startMs });
    }
  }

  if (candidates.size === 0) return json([]);

  // Existing booking intervals from D1. Try with duration_minutes; if the column
  // is missing, fall back to a query without it (treating each as LEGACY_DURATION).
  const intervals = [];
  const pushRows = (rows, hasDuration) => {
    for (const r of rows || []) {
      if (!r || !r.slot_iso_utc) continue;
      const t = Date.parse(r.slot_iso_utc);
      if (Number.isNaN(t)) continue;
      const dur = hasDuration && r.duration_minutes ? Number(r.duration_minutes) : LEGACY_DURATION;
      intervals.push([t, t + dur * 60 * 1000]);
    }
  };
  try {
    const { results } = await env.DB.prepare(
      `SELECT slot_iso_utc, duration_minutes FROM booking_requests WHERE slot_iso_utc IS NOT NULL`
    ).all();
    pushRows(results, true);
  } catch {
    try {
      const { results } = await env.DB.prepare(
        `SELECT slot_iso_utc FROM booking_requests WHERE slot_iso_utc IS NOT NULL`
      ).all();
      pushRows(results, false);
    } catch {
      // DB hiccup — never break the calendar; just show everything as open.
    }
  }

  const durMs = duration * 60 * 1000;
  const out = [...candidates.entries()]
    .map(([iso, c]) => ({ iso, ...c }))
    .sort((a, b) => a.startMs - b.startMs)
    .map((c) => {
      const candStart = c.startMs;
      const candEnd = c.startMs + durMs;
      const taken = intervals.some(([bStart, bEnd]) => bStart < candEnd && bEnd > candStart);
      return { label: c.label, iso_utc: c.iso, taken };
    });

  return json(out);
}
