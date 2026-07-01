-- Migration 0003: add the Google Meet link column to booking_requests.
--
-- WHY: functions/api/booking-requests.js now generates a Google Meet link for
-- each booking (via functions/_lib/googleMeet.js) and runs:
--   UPDATE booking_requests SET meet_link = ? WHERE id = ?
-- `CREATE TABLE IF NOT EXISTS` will NOT add this column to a D1 database that
-- was created before this change, so apply this migration once. Until then the
-- UPDATE would fail; the booking itself still succeeds because link creation is
-- best-effort, but the link would not be persisted.
--
-- HOW TO RUN (once, against the live D1):
--   wrangler d1 execute <your-db-name> --remote --file=frontend/migrations/0003_add_booking_meet_link.sql
--
-- SAFE TO IGNORE: if the column already exists, D1 returns
--   "duplicate column name: meet_link"
-- which simply means this migration was already applied. Nothing is harmed.

ALTER TABLE booking_requests ADD COLUMN meet_link TEXT;
