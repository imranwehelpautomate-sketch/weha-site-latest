# Deployment runbook

Everything needed to deploy, migrate, and operate the WeHA site and its
integrations. Assumes Wrangler is installed and authenticated
(`wrangler login`).

---

## The deploy flow

The canonical workflow (Emergent is the code-authoring tool, but any editor
works):

1. Make changes and commit to `main` on
   `imranwehelpautomate-sketch/weha-site-latest`.
2. Cloudflare Pages detects the push and auto-builds.
3. On success, the new version is live at https://wehelpautomate.com.

Local mirror of the repo lives at `~/weha-LIVE`.

> **Verification discipline.** When using an AI code tool, always confirm changes
> actually landed in GitHub (not just the tool's sandbox) before trusting them.
> `git pull` the repo and inspect the files. A build that "succeeded" in a
> sandbox but was never pushed will not deploy.

### Cloudflare Pages project settings
- Production branch: `main`
- Build command: `cd frontend && yarn install && CI=false ./node_modules/.bin/craco build`
- Build output directory: `frontend/build`
- Functions: auto-discovered from the root `functions/` directory (do not move it)

---

## D1 database

Database: `weha-db`, bound as `DB`.

### Apply the schema (idempotent)
```bash
wrangler d1 execute weha-db --remote --file=frontend/schema.sql
```

### Apply column migrations (one-time each)
```bash
wrangler d1 execute weha-db --remote --file=frontend/migrations/0001_add_booking_slot_columns.sql
wrangler d1 execute weha-db --remote --file=frontend/migrations/0002_add_booking_duration.sql
wrangler d1 execute weha-db --remote --file=frontend/migrations/0003_add_booking_meet_link.sql
```
A `duplicate column name` error means it is already applied. Safe to ignore.

### Reminder-tracking columns (used by the reminder worker)
If not already present:
```bash
wrangler d1 execute weha-db --remote --command "ALTER TABLE booking_requests ADD COLUMN reminder_24h_sent_at TEXT;"
wrangler d1 execute weha-db --remote --command "ALTER TABLE booking_requests ADD COLUMN reminder_1h_sent_at TEXT;"
```

### Quick inspection
```bash
wrangler d1 execute weha-db --remote --command "SELECT id, name, email, meet_link FROM booking_requests ORDER BY created_at DESC LIMIT 5;"
```

---

## Secrets and environment variables

Set in the Cloudflare Pages project (Settings → Variables and secrets). Never
commit these. Full reference in `ENVIRONMENT.md`. Summary:

| Secret | Used by |
| --- | --- |
| `RESEND_API_KEY` | notify + confirmation email |
| `LEAD_TO_EMAIL` | internal lead alert recipient |
| `LEAD_FROM_EMAIL` | internal lead alert sender |
| `SHEETS_WEBHOOK_URL` | Google Sheets mirror |
| `SHEETS_SECRET` | Google Sheets mirror auth |
| `GOOGLE_CLIENT_ID` | Meet link generation |
| `GOOGLE_CLIENT_SECRET` | Meet link generation |
| `GOOGLE_REFRESH_TOKEN` | Meet link generation |

---

## Email (Resend)

- Domain `wehelpautomate.com` is verified in Resend via a `send.` subdomain
  (MX/SPF/DKIM), coexisting with Zoho Mail on the root domain.
- From address: `hello@wehelpautomate.com`.
- Recommended: publish a **DMARC** record on the root domain (Cloudflare flagged
  this). It is a five-minute DNS TXT record and improves deliverability as send
  volume grows.

---

## Google Meet (Calendar API)

One-time OAuth setup, then it runs on a refresh token:

1. Google Cloud project with the Calendar API enabled.
2. OAuth consent screen (External, Testing mode is fine), scope
   `https://www.googleapis.com/auth/calendar.events`, with
   `hello@wehelpautomate.com` added as a test user.
3. OAuth client (Web application) with redirect URI
   `https://developers.google.com/oauthplayground`.
4. Mint a refresh token via the OAuth Playground using your own client
   credentials.
5. Store `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` as
   Cloudflare secrets.

---

## Google Sheets mirror (Apps Script)

1. Create a Google Sheet, open Extensions → Apps Script.
2. Paste the routing `doPost` script (routes by `form_name` to per-form tabs,
   guarded by a shared secret).
3. Deploy as a Web app (Execute as: Me, Who has access: Anyone).
4. To update the script later without changing the URL: Deploy → Manage
   deployments → edit → New version. Do NOT create a brand-new deployment (that
   changes the `/exec` URL).
5. Store `SHEETS_WEBHOOK_URL` (the `/exec` URL) and `SHEETS_SECRET` as Cloudflare
   secrets.

---

## Reminder worker (separate project)

The `weha-reminders` worker is its own project, not in this repo.

```
reminder-worker/
├── wrangler.toml         # name=weha-reminders, crons=["*/15 * * * *"], D1 binding DB -> weha-db
└── src/index.js          # scheduled() handler: finds due bookings, sends via Resend, marks sent
```

Deploy from that project directory:
```bash
cd reminder-worker
wrangler secret put RESEND_API_KEY     # same key as the Pages project
wrangler deploy
```
Verify in the Cloudflare dashboard under the worker's Cron Events (can take up to
30 minutes to populate after first deploy).

---

## Optional static hosting: brand guidelines subdomain

To host the brand guidelines at `brand.wehelpautomate.com` (free, no code repo
needed):

1. Workers & Pages → Create → Pages → Upload assets.
2. Upload `docs/WeHA-Brand-Guidelines.html` renamed to `index.html`.
3. Name the project (e.g. `weha-brand`) and deploy.
4. Custom domains → add `brand.wehelpautomate.com` (Cloudflare auto-creates the
   DNS record since it manages the domain).

The HTML already includes `noindex` meta tags so it stays out of search.
