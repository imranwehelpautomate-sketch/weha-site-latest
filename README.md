# Here are your Instructions

## Forms & data

Production form submissions are handled by **Cloudflare Pages Functions** in
`functions/api/` and stored in **Cloudflare D1**. (The Python
`backend/server.py` is for local dev only — Cloudflare Pages cannot run Python,
so it is NOT the production backend.)

> **Functions location:** the `functions/` directory MUST live at the repository
> root (next to this README), NOT inside `frontend/`. Cloudflare Pages only
> auto-discovers Functions at the root of the project; with the build output set
> to `frontend/build`, a `frontend/functions` folder is never found ("No
> functions dir at /functions found. Skipping!") and no `/api/*` route deploys.

### D1 binding

The D1 database is bound in the Pages project as **`DB`** (accessed via `env.DB`
inside the functions).

### Applying the schema

The schema lives in `frontend/schema.sql` and is safe to re-run (every statement
uses `IF NOT EXISTS`). Apply it with Wrangler:

```bash
wrangler d1 execute <db-name> --remote --file=frontend/schema.sql
```

> **Important — column migrations on EXISTING databases.** `CREATE TABLE IF NOT
> EXISTS` only creates missing tables; it does **not** add new columns to a table
> that already exists. If your D1 database was created before the booking-slot
> columns were added, the `booking_requests` table will be missing
> `slot_iso_utc` / `timezone`, and every booking POST will fail with a 500
> (the booking modal then appears to "do nothing" on submit). Apply the
> migration once to add them:
>
> ```bash
> wrangler d1 execute <db-name> --remote --file=frontend/migrations/0001_add_booking_slot_columns.sql
> ```
>
> A `duplicate column name` error means the columns already exist — safe to ignore.

### Forms → tables → endpoints

Each form has its own `form_name`, D1 table, and API endpoint:

| form_name         | endpoint                     | D1 table           | source component        |
| ----------------- | ---------------------------- | ------------------ | ----------------------- |
| `audit_request`   | `POST /api/audit-requests`   | `audit_requests`   | `LeadForm.jsx`          |
| `booking_request` | `POST /api/booking-requests` | `booking_requests` | `BookingModal.jsx`      |
| `playbook_lead`   | `POST /api/playbook-requests`| `playbook_leads`   | `PlaybookLeadForm.jsx`  |
| `calculator_lead` | `POST /api/calculator-leads` | `calculator_leads` | `ValueCalculator.jsx`   |
| `contact_message` | `POST /api/contact-messages` | `contact_messages` | `Contact.jsx`           |

The booking flow also reads `GET /api/availability?date=YYYY-MM-DD&tz=<IANA>`
(`functions/api/availability.js`), which returns business-hours slots shaped as
`[{ label, iso_utc, taken }]` for `BookingModal.jsx`.

Each function also exposes a matching `GET` that returns the newest 1000 rows of
its table.

### Email notifications & secrets

Lead notification emails are sent via Resend by the shared helper
`functions/_lib/notify.js`, only when **all three** of these are set:

- `RESEND_API_KEY`
- `LEAD_TO_EMAIL`
- `LEAD_FROM_EMAIL`

A future Google Sheets / Zapier mirror is gated behind `SHEETS_WEBHOOK_URL`
(no-op until configured).

These values are configured as **Cloudflare Pages environment variables /
secrets** in the Cloudflare dashboard. They are read exclusively from `env` and
must **NEVER** be hardcoded or committed to the repo.
