# WeHA Brand Guidelines

The single source of truth for the WeHA identity: how the brand looks, sounds,
and behaves. A styled, self-contained version of this document is available as
`WeHA-Brand-Guidelines.html` in this same folder (open it in a browser, or host
it at `brand.wehelpautomate.com` per the deployment runbook).

> Design tokens are mirrored from the live site's `frontend/src/index.css` and
> `frontend/tailwind.config.js`. If those change, regenerate this document.

---

## 1. Brand identity

WeHA (We Help Automate) is an AI process-automation partner for small and
mid-sized, digital-first businesses. We map the manual work that quietly drains a
team, then build automation that runs without them.

**The essence:** automation that removes work, not attention. WeHA is the calm,
competent operator who shows up, understands the real problem, and quietly makes
it disappear. Not a flashy tech vendor. A partner who does the work and tells you
the truth about it.

**Pillars**
- **Honest.** We give our real opinion, even when it costs us the sale. No
  inflated promises, no manufactured urgency, no pitch decks. "No BS" is a rule,
  not a tagline.
- **Outcome-led.** We talk about the result (hours saved, deals not dropped)
  before the technology. The tool is never the headline.
- **Calm and precise.** Restraint over noise. Whitespace over clutter. Confidence
  through clarity, not volume.
- **Approachable expertise.** Deep capability in plain language. We never make the
  buyer feel behind.

---

## 2. Logo system

The wordmark is "The Cut": **We**, a vertical violet stroke, and **HA**. The
stroke is the signature.

- Typeface: General Sans, 700 weight.
- Letter-spacing: `-0.045em`.
- The stroke: 2–3px wide, height ~1.4em, radius 1–2px, offset
  `translateY(0.06em)`, in accent violet.
- Case: "We" and "HA" exactly as shown. Never all-caps, never all-lower.

**Animation states:** a one-time morph intro (full "We Help Automate" collapses
to the compact mark), a gentle infinite loop after that, and the footer's living
animated signature.

> **Motion rule:** the logo is deliberately exempt from `prefers-reduced-motion`.
> It is a small, essential brand mark and must animate on every OS/browser.
> Larger decorative motion elsewhere still respects reduced motion.

**Never:** recolor the stroke, add gradients/shadows/glows, stretch or re-space
the letters, place it on busy/low-contrast backgrounds, recreate it in another
typeface, or spell it "Weha" / "WEHA" / "weha".

---

## 3. Color system

A warm, restrained neutral base with a single decisive accent: Ink Violet.

**Light theme**

| Name | Value | Role | Token |
| --- | --- | --- | --- |
| Ink Violet | `#5b3fa6` | Primary accent: CTAs, links, focus, the stroke | `--weha-teal` |
| Canvas | `#f7f6f2` | Page background | `--weha-bg` |
| Surface | `#f9f8f5` | Raised sections | `--weha-surface` |
| Elevated | `#ffffff` | Cards, inputs, modals | `--weha-elevated` |
| Ink | `#28251d` | Primary text | `--weha-text` |
| Muted | 62% ink | Secondary text | `--weha-muted` |
| Faint | 40% ink | Placeholders, meta | `--weha-faint` |
| Border | 12% ink | Hairlines, dividers | `--weha-border` |

**Dark theme:** accent lifts to `#9b80e0` for contrast; canvas `#171614`, surface
`#1f1d1a`, elevated `#262421`, text `#f3f1ea`.

> The variable is named `--weha-teal` for legacy reasons; **the value is Ink
> Violet**. Coral (`#f0552d`) and teal (`#01696f`) were explored and retired.
> Never reintroduce them.

**The 90/8/2 rule:** roughly 90% of any surface is neutral, ~8% is structure
(borders, muted text), only ~2% is Ink Violet. If a screen looks purple, it is
wrong. The accent earns impact by being rare. Never use a second accent color.

---

## 4. Typography

Two voices: a warm editorial serif for expression, a clean humanist sans for
everything functional.

- **Display: Instrument Serif** (regular + italic). Headlines, pull quotes. The
  italic-in-violet is the signature emphasis (e.g. *No BS.*).
- **Body: Plus Jakarta Sans** (300/400/600). Body copy, sub-heads, buttons.
- **Mono: JetBrains Mono.** Eyebrows, meta, timestamps, technical labels. Always
  uppercase-tracked, used sparingly.
- **Logo: General Sans 700** (logo lockup only; not a headline face).

Do not set headlines in General Sans, and do not set the logo in Instrument
Serif.

---

## 5. Motion language

Calm, purposeful, slow. Nothing bounces or races. Movement guides attention and
signals life; it never performs. If an animation draws attention to itself, it is
wrong.

- Ease, don't snap. Standard curve is a soft cubic-bezier; no linear, no harsh
  springs.
- Slow over fast. UI transitions 0.2–0.4s; ambient loops 3.6–5s.
- One thing at a time. Reveals stagger; the eye is led, not flooded.
- Respect the user. Large decorative motion honors `prefers-reduced-motion`; the
  logo is the single exception.

The feeling to protect: things gliding into place, competent and unhurried, never
jittery or attention-seeking.

---

## 6. UI components

A small, consistent kit: rounded, soft-edged, generously spaced.

- Primary button (`btn-teal`): pill radius, Ink Violet fill, white text, 500
  weight. The one action per view. Lifts on hover.
- Ghost button (`btn-ghost`): text with a violet underline. Secondary actions.
- Cards: 14px radius, hairline border, lift 3px on hover with border warming
  toward violet.
- Inputs: 10px radius, 16px text (prevents iOS zoom), soft violet focus ring.

Tokens: `--radius-card: 14px`, `--radius-input: 10px`, pill radius 999px, focus
ring `0 0 0 3px` violet-soft.

> **Form rule:** every form must surface its errors. Never leave a button frozen
> with no feedback. A dead button is a lost lead.

---

## 7. Voice and messaging

Direct, warm, honest. WeHA sounds like a sharp operator who respects your time,
tells the truth, and skips the theatre. Plain words, real outcomes, zero fluff.

**We are:** direct, honest even when it costs us, outcome-focused, warm,
confident and calm.
**We are not:** jargon-heavy, salesy, feature-obsessed, cold, hyped.

**Hard writing rules**
- Lead with the outcome, not the technology.
- Short sentences, real numbers (hours, days, deals).
- Say "No BS" and mean it.
- **Zero em-dashes** in any customer-facing copy. Ever.
- No manufactured urgency, no buzzword stacking, no unkeepable promises.

**Signature phrases:** "No BS." · "No sales scripts. No pitch decks." · "We
respond within 24 hours." · "Just a conversation about your workflow."

---

## 8. Channel guidelines

**Transactional email:** off-white background, single accent, clean sans body,
no heavy imagery, always a plain-text fallback, under ~8 visible lines of core
copy. From `WeHA <hello@wehelpautomate.com>`, reply-to the same, sign-off
"– The WeHA team".

**Social / LinkedIn:** lead with a real result or sharp observation; neutral base
with one violet accent; whitespace; one idea per post. No engagement-bait, no
generic "AI is the future" filler, no em-dashes.

**WhatsApp:** a primary human channel. The floating button uses the soft violet
pulse (a quiet "we're here", never a demanding notification). Established line:
`+91 81808 61084`.

---

## 9. Layout and grid

Layouts breathe. Generous whitespace is the confidence to let one thing matter at
a time.

- Base unit 8px; section padding 88px desktop / 60px mobile; content max-width
  ~1080px with 32px gutters.
- One idea per band; alternate canvas/surface bands for rhythm.
- Hairline structure (12%-ink borders), never heavy rules.
- Left-aligned reading on a ~68ch measure; center only short display moments.
- Consistent radius: 14px cards, 10px inputs, 999px pills. No sharp corners.

**Accessibility floor:** WCAG AA contrast on every surface, 16px minimum input
text, always-visible focus states, reduced-motion respected for decorative
motion.

---

## 10. Standards and governance

**Pre-ship checklist**
- Ink Violet is the only accent, used sparingly (90/8/2).
- Logo is the correct "We | HA" cut, unmodified, animating.
- Display type Instrument Serif; body Plus Jakarta Sans.
- Zero em-dashes in customer-facing copy.
- Copy leads with an outcome, sounds honest, skips buzzwords.
- Rounded corners (14/10/999), hairline borders.
- Motion calm and eased; decorative motion respects reduced-motion.
- WCAG AA contrast; visible focus states.
- Every form surfaces its errors.

**Red flags:** coral or teal anywhere, a frozen logo, purple as a background
fill, buzzword/urgency copy, em-dashes in copy.

**Source of truth:** the live `index.css` / `tailwind.config.js`. This document
mirrors them. When in doubt, choose the quieter option; WeHA earns trust through
restraint and honesty, not volume.
