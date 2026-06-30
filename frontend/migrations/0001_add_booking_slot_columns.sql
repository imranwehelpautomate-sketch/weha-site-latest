-- Migration 0001: ensure booking_requests has the calendar slot columns.
--
-- WHY: the booking modal sends `slot_iso_utc` and `timezone`, and
-- functions/api/booking-requests.js INSERTs them. `schema.sql` lists these
-- columns in its CREATE TABLE, but `CREATE TABLE IF NOT EXISTS` does NOT add
-- columns to a table that already exists. So a D1 database created BEFORE these
-- columns were introduced will still be missing them, and every booking POST
-- will fail with a 500 ("table booking_requests has no column named
-- slot_iso_utc") — which the UI shows as "nothing happens" on submit.
--
-- HOW TO RUN (once, against the live D1):
--   wrangler d1 execute <your-db-name> --remote --file=frontend/migrations/0001_add_booking_slot_columns.sql
--
-- SAFE TO IGNORE: if a column already exists, D1 returns
--   "duplicate column name: slot_iso_utc"
-- That simply means this migration was already applied. Nothing is harmed.

ALTER TABLE booking_requests ADD COLUMN slot_iso_utc TEXT;
ALTER TABLE booking_requests ADD COLUMN timezone TEXT;
