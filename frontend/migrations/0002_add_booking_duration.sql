-- Migration 0002: add the call-length column to booking_requests.
--
-- WHY: the booking modal now lets a visitor choose a 15-minute (default) or
-- 30-minute call. functions/api/booking-requests.js INSERTs `duration_minutes`
-- and functions/api/availability.js reads it to grey-out (block) overlapping
-- slots. `CREATE TABLE IF NOT EXISTS` will NOT add this column to a D1 database
-- that was created before this change, so apply this migration once.
--
-- HOW TO RUN (once, against the live D1):
--   wrangler d1 execute <your-db-name> --remote --file=frontend/migrations/0002_add_booking_duration.sql
--
-- SAFE TO IGNORE: if the column already exists, D1 returns
--   "duplicate column name: duration_minutes"
-- which simply means this migration was already applied. Nothing is harmed.

ALTER TABLE booking_requests ADD COLUMN duration_minutes INTEGER DEFAULT 15;
