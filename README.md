# WeHA — We Help Automate

Marketing and lead-generation website for **WeHA (We Help Automate)**, an AI
process-automation agency serving digital-first businesses across the UAE,
Australia, and Singapore.

Live site: **https://wehelpautomate.com**

This is not a brochure site. It is a custom-designed React front end backed by a
real serverless application: live booking with calendar availability, four
validated lead-capture forms, branded transactional email, automatic Google Meet
link generation, scheduled booking reminders, a Google Sheets lead mirror, and
consent-gated analytics. Everything runs on Cloudflare's free tier plus Resend.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Pages](#pages)
- [Backend and data](#backend-and-data)
- [Local development](#local-development)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Known drift and cleanup notes](#known-drift-and-cleanup-notes)

---

## Tech stack

**Frontend**
- React 19 with Create React App + CRACO
- React Router 7
- Tailwind CSS + shadcn/ui (Radix primitives)
- Three.js (hero `NetworkScene`) + Lenis smooth scroll + Framer Motion
- Custom cursor, custom animation primitives (see `docs/ARCHITECTURE.md`)
- `react-snap` / `scripts/prerender.js` postbuild step for static prerendering

**Backend and infrastructure (all Cloudflare-native)**
- Cloudflare Pages (hosting + CI on push)
- Cloudflare Pages Functions (`functions/api/`) as the API layer
- Cloudflare D1 (SQLite) as the database (binding `DB`, database `weha-db`)
- Cloudflare Workers (standalone `weha-reminders` cron worker, separate project)
- Resend for transactional and notification email
- Google Calendar API (OAuth) for Meet link generation
- Google Apps Script webhook for the Sheets lead mirror
- PostHog + GTM (consent-gated) for analytics

**Design system**
- Accent: Ink Violet `#5b3fa6` (light `#9b80e0`) on off-white `#f7f6f2`
- Type: Instrument Serif (display), Plus Jakarta Sans (body), General Sans (logo)
- Full brand spec in `docs/BRAND-GUIDELINES.md` and `docs/WeHA-Brand-Guidelines.html`

---

## Repository layout

```
/
├── frontend/                 # React app (the deployed site lives here)
│   ├── src/
│   │   ├── pages/            # 13 route-level pages
│   │   ├── components/       # 30 reusable components + primitives
│   │   ├── lib/              # motion constants, helpers
│   │   └── index.css         # design tokens (source of truth for colors/type)
│   ├── migrations/           # D1 column migrations (0001–0003)
│   ├── schema.sql            # D1 schema (idempotent, IF NOT EXISTS)
│   ├── scripts/prerender.js  # postbuild static prerender
│   └── package.json
├── functions/                # Cloudflare Pages Functions (THE production API)
│   ├── api/                  # one file per endpoint
│   └── _lib/                 # shared helpers (email, Meet, Sheets, validation)
├── docs/                     # project documentation (this doc set)
├── backend/                  # LEGACY local-dev scaffold — NOT production (see notes)
├── future-development/       # scratch / planning space
└── README.md
```

> **Critical:** `functions/` MUST stay at the repository root, never inside
> `frontend/`. Cloudflare Pages only auto-discovers Functions at the project
> root. A `frontend/functions` folder is silently ignored ("No functions dir
> found. Skipping!") and no `/api/*` route deploys.

---

## Pages

13 route-level pages in `frontend/src/pages/`:

| Route | Page | Notes |
| --- | --- | --- |
| `/` | Home | Three.js hero, teardowns, calculators, FAQ |
| `/services` | Services | Three service pillars, ROI calculator |
| `/success-stories` | Work | Case studies (renamed from `/work`, which redirects) |
| `/ai-workforce` | AIWorkforce | Managed agentic-coworker offering |
| `/about` | About | Story, mission, founders, values |
| `/contact` | Contact | Contact form |
| `/resources` | Resources | Hub for the three resource types below |
| `/resources/ebooks` | ResourceEbooks | Gated lead magnets |
| `/resources/workbooks` | ResourceWorkbooks | Gated lead magnets |
| `/resources/workflow-automations` | ResourceWorkflows | Gated lead magnets |
| `/privacy-policy` | PrivacyPolicy | Consent + cookie disclosure |
| `/terms-of-service` | TermsOfService | Legal |
| `*` | NotFound | Custom 404 |

---

## Backend and data

Full detail in `docs/ARCHITECTURE.md`. In brief, each form maps to a
`form_name`, a D1 table, and an API endpoint:

| form_name | endpoint | D1 table | source component |
| --- | --- | --- | --- |
| `booking_request` | `POST /api/booking-requests` | `booking_requests` | `BookingModal.jsx` |
| `contact_message` | `POST /api/contact-messages` | `contact_messages` | `Contact.jsx` |
| `playbook_lead` | `POST /api/playbook-requests` | `playbook_leads` | `PlaybookLeadForm.jsx` |
| `calculator_lead` | `POST /api/calculator-leads` | `calculator_leads` | `ValueCalculator.jsx` |
| `audit_request` | `POST /api/audit-requests` | `audit_requests` | `LeadForm.jsx` (unused/orphaned) |

The booking flow also reads `GET /api/availability?date=YYYY-MM-DD&tz=<IANA>`.

On a successful booking, the backend additionally: generates a Google Meet link
(`_lib/googleMeet.js`), sends a branded confirmation (`_lib/sendConfirmation.js`),
alerts the team (`_lib/notify.js`), and mirrors the lead to Google Sheets
(`_lib/syncSheets.js`). All post-write side effects are fire-and-forget and can
never block or fail the core submission.

Booking reminders (24h and 1h before) are sent by a **separate** Cloudflare
Worker, `weha-reminders`, which is not in this repo (it is its own project with
its own `wrangler.toml`, running on a 15-minute cron and sharing the same D1
database).

---

## Local development

```bash
cd frontend
yarn install
yarn start          # dev server at http://localhost:3000
```

The React app runs standalone for UI work. The production API (Cloudflare
Functions + D1) does not run in plain `yarn start`; to exercise Functions
locally you would use `wrangler pages dev`, but most UI iteration does not need
it. See `docs/DEPLOYMENT.md`.

Environment variables and secrets: see `docs/ENVIRONMENT.md`. Never commit
secrets; they live only in the Cloudflare dashboard.

---

## Deployment

Push to `main` → Cloudflare Pages auto-builds and deploys. Full runbook,
including D1 migrations, secret configuration, the reminder worker, and the
Google integrations, is in `docs/DEPLOYMENT.md`.

Build command (configured in the Cloudflare Pages project):

```
cd frontend && yarn install && CI=false ./node_modules/.bin/craco build
```

Build output directory: `frontend/build`.

---

## Documentation

| Doc | What's in it |
| --- | --- |
| `docs/ARCHITECTURE.md` | Full system architecture: frontend, functions, data flow, integrations |
| `docs/DEPLOYMENT.md` | Deploy runbook, D1 migrations, reminder worker, Google setup |
| `docs/ENVIRONMENT.md` | Every environment variable and secret, and where it is used |
| `docs/BRAND-GUIDELINES.md` | Brand system in Markdown (colors, type, voice, motion, governance) |
| `docs/WeHA-Brand-Guidelines.html` | The same brand guidelines as a styled, self-contained HTML page |
| `CONTRIBUTING.md` | Conventions, the Emergent workflow, hard rules (e.g. no em-dashes) |

---

## Known drift and cleanup notes

Minor housekeeping items noted during the documentation pass. None affect the
live site; listed so they are not mistaken for intentional design later.

- **`backend/` is a legacy scaffold.** It is a FastAPI + MongoDB app from the
  original project template. Cloudflare Pages cannot run Python, so this is NOT
  the production backend (the real API is `functions/`). It is kept only as a
  local-dev reference and can be removed once no longer useful. The various
  `backend_test*.py` files at the repo root test this legacy scaffold, not the
  live Functions.
- **Prerender route list is slightly stale.** `frontend/package.json`
  (`reactSnap.include`) still lists `/work` rather than `/success-stories`, and
  does not list `/ai-workforce`. Update this list when convenient so the
  prerender step covers the current routes.
- **`audit_requests` is orphaned.** The `LeadForm.jsx` component that would POST
  to `/api/audit-requests` is not rendered anywhere, so that table never
  receives production data. Harmless; safe to remove in a future cleanup.
