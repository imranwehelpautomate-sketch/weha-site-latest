# Changelog

> **Internal repository file — not published to the website.**
> This document lives in version control for team reference and GitHub history
> only. It is NOT served by the app, NOT part of any route, and NOT bundled into
> the frontend build (it is not under `frontend/public/` and is referenced by no
> component). Nothing here appears on wehelpautomate.com.

All notable changes made to the WeHA (We Help Automate) marketing site are
documented in this file. Entries are grouped by work session and listed in the
order the changes were made (top to bottom).

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/).
This project does not yet follow strict semantic versioning; this log is a
human-readable record intended for team handoff and GitHub history.

---

## [Session 2025-07-07] — Content, UX and section redesigns

Summary: Restored the local dev environment after a fresh repo import, then made
a series of copy, layout, and UX improvements across the Home, Services, AI
Workforce pages, the global header, and the booking modal. Introduced a new
"Systems We Help Automate" section on Services and a reusable trust-badge motif
used sitewide.

Files touched:
- `frontend/.env`, `backend/.env` (restored, gitignored — not committed)
- `frontend/src/pages/Home.jsx`
- `frontend/src/pages/Services.jsx`
- `frontend/src/pages/AIWorkforce.jsx`
- `frontend/src/components/Header.jsx`
- `frontend/src/components/BookingModal.jsx`
- `frontend/src/components/CountUp.jsx`

---

### 0. Environment restore (project bring-up)

- The `.env` files are gitignored and were missing after the repo import, which
  left the app unable to start.
- Recreated `backend/.env` with `MONGO_URL`, `DB_NAME` (`weha_database`), and
  `CORS_ORIGINS`.
- Recreated `frontend/.env` with `REACT_APP_BACKEND_URL` (preview URL) and
  `WDS_SOCKET_PORT`.
- Installed backend (pip) and frontend (yarn) dependencies and restarted all
  services via supervisor. Verified `/api/` responds and the site renders.
- Note: `.env` files remain gitignored and are NOT part of the repo. They must
  be provisioned per environment.

---

### 1. Home — "Why WeHA" dark section: corrected two absolute claims

File: `frontend/src/pages/Home.jsx` (`whyWeha`, `stats`)

- Changed the bullet
  `"We automate on top of the tools you already use. No rip-and-replace."`
  to
  `"We build on the tools you already use wherever we can. If something new is genuinely the right call, you buy it and own the account directly, no markup, no middleman."`
  (Rationale: the original over-promised a hard "no rip-and-replace" stance.)
- Changed the fourth stat caption from `"new software to buy"` to
  `"markup on any tool you need"` (the number "0" was preserved at this step).

### 2. Home — stat renders the word "Zero" instead of the numeral

Files: `frontend/src/components/CountUp.jsx`, `frontend/src/pages/Home.jsx`

- Added an optional `text` prop to the `CountUp` component. When provided,
  `CountUp` renders that string (e.g. "Zero") instead of animating a number;
  otherwise behavior is unchanged (backward compatible).
- Set the fourth "Why WeHA" stat to `text: "Zero"` so it reads "Zero" rather
  than "0". The other stats (90 min / 100% / 30 days) still animate as numbers.

### 3. Home — hero rotating pain points expanded

File: `frontend/src/pages/Home.jsx` (`rotatingWords`)

- Added nine new rotating items to the hero "WE HELP AUTOMATE …" line:
  your ads, your email marketing, your SEO, your content marketing,
  your proposals, your recruitment, your bookings, your client management,
  your worries.
- Ordered the two emotional items ("your worries", "your stress") at the end
  for a stronger closing beat.

---

### 4. Services — NEW section: "Systems We Help Automate"

File: `frontend/src/pages/Services.jsx`

- Added a brand-new section placed immediately before the existing
  "Who we build for" section.
- Introduced a `systems` data array with six cards:
  Marketing & Content Automation, Sales & Pipeline Automation,
  Cold Outreach & Lead Gen Automation, Customer Support Automation,
  Human Resources Automation, CRM & Lead Enrichment Automation.
- Card grid uses brand icons; each card has an "Expand" affordance.
- Reused the exact "Who we build for" expand-modal pattern (portaled, dimmed
  backdrop, scale-in animation, Escape / click-to-close, body scroll lock) via
  new `expandedSystem` state.
- Each expanded card originally contained six sub-sections: What we automate
  here, How we automate it, Timeline of typical engagement, Typical Milestones
  (reusing the `FlowDiagram` component from the "Proof, not promises" section),
  Tech Stack Used (real logos via `StackLogo`), and a "Book your free audit"
  CTA.
- All copy is original, plain-English, and conversion-led (no wording copied
  from any reference); styling uses existing WeHA tokens and components.

### 5. Services — expanded cards made no-scroll + refinements

File: `frontend/src/pages/Services.jsx`

- Removed the "Typical Milestones" sub-section (and its `FlowDiagram` usage)
  from all expanded cards. `FlowDiagram` remains in use in "Proof, not promises".
- Restructured the modal into a compact 2×2 grid (What we automate / How we
  automate on the top row; Timeline / Tech stack on the bottom row) with
  reduced padding and spacing so the card fits without scrolling.
- Made the per-card "Timeline of typical engagement" copy more aggressive
  (e.g. "live in 48 hours", "inside 2 weeks").
- Added a WeHA-styled trust badge to every expanded card:
  heading "Outcome-guaranteed engagements." with a shield icon.

### 6. Trust badge — sitewide motif introduced and iterated

Files: `frontend/src/pages/Services.jsx`, `frontend/src/pages/Home.jsx`

- Added per-system `trust` sublines on Services, rotating three approved
  variations across the six cards:
  - "Realistic timelines, real deliverables, reviewed together at every stage."
  - "We define success together before you sign. No surprises, no scope creep."
  - "Fixed scope. Flexible pricing. No hidden hours."
  - (Note: Support and CRM cards were initially missing their `trust` field;
    this was caught and fixed so all six render a subline.)
- Removed the earlier "No outcome, no invoice." positioning everywhere.
- Added a compact trust badge to the Home hero.

### 7. Home hero trust badge — copy + wording updates

File: `frontend/src/pages/Home.jsx`

- Hero badge subline set to
  "Fixed scope. No surprises, Flexible pricing. No surprises."
- Sitewide replaced "Fixed price" with "Flexible pricing" (Cold Outreach and
  CRM Services cards).
- Hero badge subline then simplified to
  "Fixed scope. Flexible pricing. No surprises."

### 8. Home hero trust badge — repositioned above CTAs

File: `frontend/src/pages/Home.jsx`

- Moved the trust badge to sit ABOVE the two hero CTA buttons (previously
  below). Swapped top margins and staggered animation delays for a natural
  top-to-bottom flow.

---

### 9. Services — "Typical tech stack used" heading + disclaimer

File: `frontend/src/pages/Services.jsx`

- Renamed the expanded-card sub-section heading from "Tech stack used" to
  "Typical tech stack used".
- Added a small italic disclaimer below the logos:
  "*tech stacks generally vary as per the use case".

### 10. Services — section eyebrow rename

File: `frontend/src/pages/Services.jsx`

- Renamed the "What we build" eyebrow to "Our Engagement Models".

### 11. Services — removed redundant callout

File: `frontend/src/pages/Services.jsx`

- Removed the dashed "Not sure which system you need first? … Book my free
  audit" callout box that sat below the systems card grid.

---

### 12. Home — hero secondary CTA rename

File: `frontend/src/pages/Home.jsx`

- Renamed the secondary hero CTA from "See How It Works" to "Explore Services"
  (still links to `/services`).

### 13. Header — primary nav CTA rename

File: `frontend/src/components/Header.jsx`

- Renamed the nav CTA from "Book a Free Audit" to "Talk To Us" in both the
  desktop header and the mobile menu (still opens the booking flow).

---

### 14. Booking modal — title + trust badge

File: `frontend/src/components/BookingModal.jsx`

- Changed the left context-column title from "Book your AI Audit." to
  "Lets Chat." (second word kept in italic teal, matching existing style).
- Added the WeHA trust badge below the "No BS." paragraph.
- Set the booking badge subline to
  "No obligation, no sales script. Just an honest look at where AI can save you time."
- Refined the badge visual for better balance: top-aligned, smaller shield
  icon, and a reduced subline font size (heading on its own line).

---

### 15. Home — moved "The real cost" section above FAQ

File: `frontend/src/pages/Home.jsx`

- Relocated the "The real cost" calculator section (the `CostSlider` module and
  "Small leaks. Serious math." heading) to sit directly above the FAQ section.
  Earlier content now flows Pains → The Flow without interruption.

---

### 16. Home — redesigned "Not a freelancer… Better placed than both." section

File: `frontend/src/pages/Home.jsx`

- Full visual redesign (inspired by a competitor layout, freshly designed in
  WeHA styling — not copied):
  - Two-column layout: left = eyebrow "The WeHA difference", headline, intro
    paragraph, a 2×2 checklist of ownership points (teal check chips), and a
    "Book a Free AI Audit" CTA.
  - Right = an animated circular "guarantee" medallion: concentric brand-purple
    rings, a slow-rotating dashed ring with an orbiting glowing dot, and a
    center medallion with a shield icon reading "Outcome-guaranteed
    engagements." — reinforcing the sitewide trust-badge theme.
  - Below both columns: the proof stats (90 min / 100% / 30 days / Zero)
    refined into a strip with a top border and vertical dividers.
- Added `Check` to the lucide import for the checklist chips.

### 17. Home — reduced redesigned section height (~40%)

File: `frontend/src/pages/Home.jsx`

- Reduced section vertical padding (`py-40` → `py-16`), headline size
  (`text-6xl` → `text-5xl`), paragraph/bullet text and spacing, circle size
  (440px → 360px), and the stats-strip margins. Section height dropped from
  ~1305px to ~870px while keeping the layout breathable.

### 18. Home — bullet + medallion copy tweaks

File: `frontend/src/pages/Home.jsx`

- Bullet shortened to "We build on the tools you already use wherever we can."
- Bullet updated to
  "Automations are documented and delivered, so you are in control."
- Medallion subtext set to
  "We only propose what we're confident we can deliver, and we put it in writing."
  (em-dash removed in favor of a comma).
- Reduced the whitespace between "…engagements." and the medallion subtext
  (divider/text margins tightened, roughly halved).

### 19. Home — CTA banner headline

File: `frontend/src/pages/Home.jsx`

- Changed "See your first automation built in 90 minutes." to
  "See your first automation built within hours post our call."

---

### 20. AI Workforce — reused "cost" calculator module

File: `frontend/src/pages/AIWorkforce.jsx`

- Imported and reused the shared `CostSlider` module in a new section titled
  "The case for a teammate that never clocks out" ("Hours your team should
  never touch again."), with AI-Workforce-relevant copy and slider labels
  ("People stuck on repetitive work" / "Hours each spends on it, per week").
- Placed the section AFTER the integration strip (per request).

### 21. AI Workforce — swapped section order

File: `frontend/src/pages/AIWorkforce.jsx`

- Swapped the positions of "A different category of AI" and the cost calculator
  section. New order after the hero:
  Integration strip → "A different category of AI" → cost calculator →
  comparison → …

---

## Notes for reviewers

- No backend/API changes were made this session; all edits are frontend copy,
  layout, and component logic.
- The reusable trust-badge motif (shield icon + "Outcome-guaranteed
  engagements." + a positioning subline) now appears in three places: the Home
  hero, every Services expanded card, and the booking modal.
- `CountUp` gained a backward-compatible `text` prop; `CostSlider` and
  `FlowDiagram` were reused as-is (no changes to those components' internals).
- All modified files passed ESLint with no issues; changes were verified
  visually via screenshots at each step.
- `.env` files are environment-provisioned and remain gitignored.
