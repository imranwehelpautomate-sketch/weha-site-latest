# Architecture

How the WeHA site is put together, end to end. This is the reference for
understanding data flow, the integration chain, and why things are structured
the way they are.

---

## High-level shape

```
Browser (React SPA, prerendered HTML per route)
      │
      │  fetch /api/*
      ▼
Cloudflare Pages Functions  (functions/api/*)  ── the API layer
      │
      ├── Cloudflare D1  (weha-db, binding DB)   ── persistence
      ├── Resend                                  ── email (notify + confirm)
      ├── Google Calendar API (OAuth)             ── Meet links (booking only)
      └── Google Apps Script webhook              ── Sheets lead mirror
                                                     (fire-and-forget)

Separate Cloudflare Worker (weha-reminders, own repo/project)
      │  cron every 15 min
      ├── reads Cloudflare D1 (same weha-db)
      └── Resend                                  ── 24h + 1h booking reminders
```

Key principle throughout: **the core write (saving the lead to D1) is the only
thing that can fail a submission.** Every downstream side effect (email, Meet,
Sheets) is fire-and-forget and wrapped so an outage there never blocks or errors
the user's form.

---

## Frontend

### Framework and rendering
- React 19, CRA + CRACO, React Router 7.
- Client-side rendered, then **prerendered to static HTML per route** at build
  time via `react-snap` (`scripts/prerender.js`, wired as `postbuild`). This
  gives crawlers and first paint real HTML instead of an empty shell.
- Lenis provides inertial smooth scroll; Framer Motion drives component motion;
  Three.js renders the hero `NetworkScene`.

### Design tokens (source of truth)
`frontend/src/index.css` defines the CSS custom properties that everything else
consumes. When documenting or theming, treat this file (and
`frontend/tailwind.config.js`) as canonical, not any prose description.

- Accent: `--weha-teal: #5b3fa6` (legacy variable name; the value is Ink Violet),
  light `#9b80e0`.
- Surfaces: bg `#f7f6f2`, surface `#f9f8f5`, elevated `#ffffff`, text `#28251d`.
- Fonts: Instrument Serif (display), Plus Jakarta Sans (body), General Sans
  (logo wordmark only), JetBrains Mono (meta).

### Component primitives
Reusable building blocks in `frontend/src/components/`:

- **Motion:** `Reveal`, `MaskReveal`, `Parallax`, `Magnetic`, `ScrollSection`
  (direction / depth / intensity / settle props), all reading shared easing and
  duration constants from `src/lib/motion.js`.
- **Interactive:** `FlowDiagram` (animated pipeline, DOM-measured connectors,
  `pathLength` draw, vertical on mobile, reduced-motion fallback), `TabSwitch`
  (sliding indicator via `layoutId`), `CountUp`, `CostSlider`, `ValueCalculator`,
  `Roadmap`.
- **Chrome:** `Header`, `Footer`, `Cursor`, `SmoothScroll`, `ScrollPill`,
  `FloatingWhatsApp`, `IndiaFlag`, `Logo`, `PageHero`, `IntegrationStrip`,
  `CTABanner`, `Seo`.
- **Conversion:** `BookingModal`, `LeadForm`, `PlaybookLeadForm`,
  `ResourceDownloadModal`, `CookieConsent`, `MarketingConsent`.

Accessibility is built in, not bolted on: 8 components respect
`prefers-reduced-motion`, and the codebase carries a large set of ARIA
attributes, explicit roles, and visible focus styles. The one deliberate
reduced-motion exception is the logo mark, which always animates (see brand
guidelines).

---

## Backend: Cloudflare Pages Functions

The production API is `functions/api/*`. Each file is an endpoint. There is no
separate server; Cloudflare runs these at the edge.

### Endpoints
- `booking-requests.js` — create/list bookings; triggers Meet + confirm + notify + Sheets.
- `contact-messages.js` — contact form.
- `playbook-requests.js` — gated resource / playbook leads.
- `calculator-leads.js` — ROI/value calculator leads.
- `availability.js` — `GET` returns business-hours slots for the booking modal.
- `audit-requests.js` — orphaned (its source component is not rendered).
- `index.js` — router/entry.

Each write endpoint also exposes a matching `GET` returning the most recent rows
of its table (handy for quick inspection).

### Shared libraries (`functions/_lib/`)
- **`validate.js`** — name/email/company/free-text validation, disposable-email
  blocking. The spam defense after the honeypot was removed (browser autofill
  was tripping the honeypot and silently blocking real users).
- **`notify.js`** — internal "new lead" alert email via Resend. Fires only when
  `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` are all set.
- **`sendConfirmation.js`** — branded confirmation email to the submitter.
  Booking confirmations include the Meet link and prep notes.
- **`googleMeet.js`** — creates a Google Calendar event with a Meet link on
  booking (never for other forms). Never throws; returns null on any failure so
  the booking still succeeds without a link.
- **`syncSheets.js`** — POSTs the lead to the Google Apps Script webhook,
  fire-and-forget, so a Sheets outage cannot break a submission.

---

## Data: Cloudflare D1

- Database: `weha-db`, bound as `DB` (accessed via `env.DB`).
- Schema: `frontend/schema.sql`, idempotent (`IF NOT EXISTS`), safe to re-run.
- Column migrations: `frontend/migrations/000{1,2,3}_*.sql`. These exist because
  `CREATE TABLE IF NOT EXISTS` does not add new columns to an already-existing
  table. Applied once each via Wrangler. A `duplicate column name` error means
  the column already exists and is safe to ignore.

Tables: `booking_requests`, `contact_messages`, `playbook_leads`,
`calculator_leads`, `audit_requests` (unused).

Booking-related columns added over time by the migrations: `slot_iso_utc`,
`timezone`, `duration_minutes`, `meet_link`, plus reminder-tracking columns
(`reminder_24h_sent_at`, `reminder_1h_sent_at`) used by the reminder worker.

---

## Integration: Google Meet (booking only)

`_lib/googleMeet.js` uses an OAuth refresh-token flow against the
`hello@wehelpautomate.com` Google account to create a Calendar event with a Meet
link. Requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`
(Cloudflare secrets). The client is deliberately NOT added as a calendar
attendee (that would send a duplicate Google-native invite alongside our own
branded email). The link is stored in the `meet_link` D1 column and rendered in
the confirmation email.

---

## Integration: Google Sheets lead mirror

`_lib/syncSheets.js` POSTs each lead to a Google Apps Script Web App
(`doPost`), guarded by a shared secret. The Apps Script routes each lead to a
dedicated tab by `form_name` (Booking / Contact / Playbook & Downloads /
Calculator, with an Other fallback). Requires `SHEETS_WEBHOOK_URL` and
`SHEETS_SECRET`. If either is unset, the function is a silent no-op.

Note: Apps Script Web Apps respond to a POST with a 302 redirect to a
`script.googleusercontent.com` result URL; this is normal. Diagnose via the
Apps Script Executions panel, not raw curl status codes.

---

## Integration: booking reminders (separate worker)

Cloudflare Pages Functions cannot run on a schedule, so reminders live in a
**separate** Cloudflare Worker named `weha-reminders` (its own project and
`wrangler.toml`, not in this repo). It runs on a `*/15 * * * *` cron, shares the
same D1 database, and sends 24h and 1h reminder emails via Resend, using the
`reminder_24h_sent_at` / `reminder_1h_sent_at` columns to avoid double-sending.
The 24h window is intentionally wide (22–26h) so a 15-minute cron never misses
it.

---

## Analytics and consent

- GTM loads unconditionally, but a **Consent Mode v2** default of "denied" is set
  before it. Tags inside GTM (GA4, Clarity, ad pixels) respect that signal.
- PostHog is gated: it only initializes if the visitor has explicitly accepted
  via `CookieConsent.jsx` (stored in `localStorage`).
- On accept, a `gtag('consent', 'update', ...)` call flips the relevant storage
  grants and PostHog initializes; on decline, everything stays denied and
  PostHog never loads.
- The remaining wiring (setting each GTM tag's consent requirement) is done in
  the GTM web UI, not in this repo.
