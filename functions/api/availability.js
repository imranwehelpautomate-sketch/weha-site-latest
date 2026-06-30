// GET /api/availability?date=YYYY-MM-DD&tz=<IANA timezone>
// Returns business-hours booking slots for the requested local date, shaped as
// [{ label, iso_utc, taken }] to match what BookingModal.jsx / fetchAvailability expect.
//
// Rules (kept in sync with the local dev backend in backend/server.py):
//   - Monday to Friday only; weekends return an empty array.
//   - 30 minute slots from 09:00 to 18:00 (exclusive) in the visitor's timezone.
//   - Past slots (and anything within the next 15 minutes) are dropped.
//   - A slot is marked taken:true if its iso_utc already exists in either the
//     audit_requests or booking_requests D1 tables.

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

const BUSINESS_START_HOUR = 9; // local time
const BUSINESS_END_HOUR = 18; // local time (exclusive)
const SLOT_MINUTES = 30;
const WORK_DAYS = new Set([1, 2, 3, 4, 5]); // Mon..Fri (getUTCDay: 0=Sun..6=Sat)

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Offset (ms) between the given UTC instant and its wall-clock time in `tz`.
function tzOffsetMs(instant, tz) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(instant).reduce((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asUTC - instant.getTime();
}

// Convert a wall-clock time (y, m, d, hh, mm) in `tz` to the matching UTC instant (ms).
function wallTimeToUtcMs(y, m, d, hh, mm, tz) {
  const naiveUtc = Date.UTC(y, m - 1, d, hh, mm, 0);
  // First pass using the offset at the naive instant, then refine once for DST edges.
  let offset = tzOffsetMs(new Date(naiveUtc), tz);
  let utc = naiveUtc - offset;
  offset = tzOffsetMs(new Date(utc), tz);
  utc = naiveUtc - offset;
  return utc;
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

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const date = (url.searchParams.get("date") || "").trim();
  const tz = (url.searchParams.get("tz") || "").trim();

  // Unsupported timezone or malformed date -> graceful empty list (calendar shows "no slots").
  if (!ALLOWED_TIMEZONES.has(tz)) return json([]);

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return json([]);
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);

  // Weekday of the requested calendar date (noon UTC avoids any tz date-edge ambiguity).
  const weekday = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).getUTCDay();
  if (!WORK_DAYS.has(weekday)) return json([]);

  const nowMs = Date.now();
  const minMs = nowMs + 15 * 60 * 1000; // must be at least 15 minutes in the future

  const candidates = [];
  for (let hh = BUSINESS_START_HOUR; hh < BUSINESS_END_HOUR; hh++) {
    for (let mm = 0; mm < 60; mm += SLOT_MINUTES) {
      const utcMs = wallTimeToUtcMs(y, m, d, hh, mm, tz);
      if (utcMs > minMs) {
        candidates.push({
          label: label12(hh, mm),
          iso_utc: isoUtcNoMillis(utcMs),
        });
      }
    }
  }

  if (candidates.length === 0) return json([]);

  // Mark slots already booked. Query each table INDEPENDENTLY and guard each one
  // so a table that does not have a slot_iso_utc column (e.g. audit_requests in
  // the current D1 schema) cannot break the lookup for the table that does
  // (booking_requests). Best-effort: a DB hiccup never breaks the calendar.
  const booked = new Set();
  const isoKeys = candidates.map((s) => s.iso_utc);
  const placeholders = isoKeys.map(() => "?").join(", ");
  for (const table of ["booking_requests", "audit_requests"]) {
    try {
      const { results } = await env.DB.prepare(
        `SELECT slot_iso_utc FROM ${table} WHERE slot_iso_utc IN (${placeholders})`
      )
        .bind(...isoKeys)
        .all();
      for (const r of results || []) {
        if (r && r.slot_iso_utc) booked.add(r.slot_iso_utc);
      }
    } catch {
      // Table missing / lacks slot_iso_utc column — skip it, keep the rest.
    }
  }

  return json(
    candidates.map((s) => ({
      label: s.label,
      iso_utc: s.iso_utc,
      taken: booked.has(s.iso_utc),
    }))
  );
}
