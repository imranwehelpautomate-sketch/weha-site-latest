# Contributing and conventions

Conventions for working on the WeHA site so future changes stay consistent with
the system already in place.

---

## Hard rules

These are not stylistic preferences; treat them as invariants.

1. **No em-dashes in user-facing copy.** Anywhere a visitor reads text (pages,
   emails, labels, FAQ answers), use periods, commas, or restructure. This is a
   brand rule. Em-dashes inside code comments are fine.
2. **`functions/` stays at the repo root.** Never move it under `frontend/`.
   Cloudflare Pages only discovers Functions at the project root.
3. **Never commit secrets.** All secrets live in the Cloudflare dashboard and are
   read from `env`. See `docs/ENVIRONMENT.md`.
4. **Forms must never fail silently.** Every early return on a submit path must
   surface a visible message. A dead submit button with no feedback is a lost
   lead. (This rule exists because a honeypot + browser autofill interaction
   silently blocked real users for a while.)
5. **Design tokens are the source of truth.** Colors, type, and spacing come from
   `frontend/src/index.css` and `frontend/tailwind.config.js`. Do not hardcode
   hex values that duplicate a token. When in doubt about a token value, read the
   CSS rather than trusting memory. See `docs/BRAND-GUIDELINES.md`.

---

## The authoring workflow

The site was largely built with Emergent (an AI site builder) authoring code and
pushing to GitHub, with Cloudflare Pages deploying on push. Whatever tool is
used:

- Commit to `main` on `imranwehelpautomate-sketch/weha-site-latest`.
- **Verify pushes actually reached GitHub** before trusting them. AI tools can
  report success while changes sit only in their sandbox. `git pull` and inspect.
- Cloudflare auto-deploys `main`. Confirm the deployment references the commit
  you expect.

---

## Motion and interactivity conventions

- Reuse the existing primitives (`Reveal`, `MaskReveal`, `Parallax`, `Magnetic`,
  `ScrollSection`, `FlowDiagram`, `TabSwitch`, `CountUp`, `CostSlider`) rather
  than inventing new ones. They all share easing/duration constants from
  `src/lib/motion.js`, which keeps the whole site's motion coherent.
- Every new animated component must handle `prefers-reduced-motion` with a
  complete static fallback (no hidden or dead content).
- Animate transforms and opacity only, never layout properties.
- Keep the violet accent rare (the 90/8/2 rule in the brand guidelines). Violet
  marks the one thing you want acted on, not backgrounds or large fills.
- The logo mark is the one deliberate exception that always animates, even under
  reduced motion.

---

## Content and positioning

- WeHA leads with sales and marketing automation for AI-adopting, digital-first
  businesses (agencies, ecommerce/D2C, SaaS, coaches/consultants, and adjacent
  segments). Copy should speak to those buyers.
- Voice: direct, honest, outcome-led, no buzzwords, no manufactured urgency.
  "No BS" is the brand's honesty condensed. See the Voice section of the brand
  guidelines.
- Do not invent metrics or testimonials. Use relative/directional framing for
  proof unless a figure is real and defensible.

---

## Documentation

Keep the docs in sync with reality. If you change the architecture, integrations,
or design tokens, update the relevant file in `docs/`. The brand guidelines
(`docs/BRAND-GUIDELINES.md` and the HTML version) should be regenerated if the
live design tokens change, since they are meant to mirror what actually ships.
