import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Plus,
  Check,
  X,
  Inbox,
  Sparkles,
  Database,
  Send,
  CalendarClock,
  Bell,
  RefreshCw,
  LayoutDashboard,
  ShoppingCart,
  Clock,
  FileText,
  ClipboardCheck,
  CalendarCheck,
  Video,
  Mail,
  BellRing,
  Table,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import Magnetic from "@/components/Magnetic";
import TabSwitch from "@/components/TabSwitch";
import FlowDiagram from "@/components/FlowDiagram";
import Roadmap from "@/components/Roadmap";
import CTABanner from "@/components/CTABanner";
import Seo from "@/components/Seo";
import { EASE } from "@/lib/motion";
import { useBooking } from "@/context/BookingContext";
import { ORG, WEBSITE, breadcrumb, webPage, graph } from "@/lib/seoSchemas";

/* ------------------------------------------------------------------ *
 * Segment selector options. `id` doubles as the active-state key and
 * the FlowDiagram replayKey. Default state is null (nothing selected).
 * ------------------------------------------------------------------ */
const SEGMENTS = [
  { id: "agencies", label: "Agencies" },
  { id: "ecommerce", label: "Ecommerce" },
  { id: "saas", label: "SaaS" },
  { id: "coaches", label: "Coaches & Consultants" },
  { id: "recruitment", label: "Recruitment Agencies" },
];

// One-line promise shown under the chips, per segment.
const SEGMENT_LINE = {
  default:
    "Whatever you run, if it is manual and it repeats, we can probably automate it.",
  agencies:
    "Client reporting that writes itself. Onboarding that runs without the founder.",
  ecommerce:
    "Abandoned carts chased, reviews requested, support triaged. On autopilot.",
  saas: "Every trial signup and demo request answered in minutes, not days.",
  coaches:
    "Discovery calls booked, no-shows reminded, follow-ups sent automatically.",
  recruitment:
    "Every resume screened, every document chased, every candidate prepped. Automatically.",
};

/* ------------------------------------------------------------------ *
 * Proof flows, one per segment. Icon sequences and captions mirror the
 * flows already used across Home ("Speed to lead", "Marketing
 * reporting") and the "AI Recruitment Pipeline" success story, kept
 * inline here so this page compiles and ships fully self-contained.
 * ------------------------------------------------------------------ */

// Default + Coaches: the existing "Speed to lead" flow from Home.jsx.
const SPEED_TO_LEAD = [
  { icon: Inbox, title: "Lead comes in", caption: "Website, ad, WhatsApp or DM" },
  { icon: Sparkles, title: "AI qualifies it", caption: "Intent, budget signals, fit" },
  { icon: Database, title: "CRM updated", caption: "Enriched, tagged, assigned" },
  { icon: Send, title: "Reply in minutes", caption: "Personal and on-brand, day or night" },
  { icon: CalendarClock, title: "Follow-ups queued", caption: "Day 2 and day 5, automatic" },
  { icon: Bell, title: "You get one ping", caption: "A clean summary, not another task" },
];

// Agencies: the client-reporting teardown (Database/RefreshCw/Sparkles/LayoutDashboard/Send).
const AGENCY_REPORTING = [
  { icon: Database, title: "Channels connected", caption: "Ads, analytics, email, CRM" },
  { icon: RefreshCw, title: "Data pulled nightly", caption: "No exports, no copy-paste" },
  { icon: Sparkles, title: "AI writes the summary", caption: "What changed and why it matters" },
  { icon: LayoutDashboard, title: "Dashboard updates", caption: "Live, not last month" },
  { icon: Send, title: "Report in your inbox", caption: "Monday 8 AM, client-ready" },
];

// Ecommerce: the win-back teardown (ShoppingCart/Clock/Sparkles/Send/RefreshCw).
const ECOMMERCE_WINBACK = [
  { icon: ShoppingCart, title: "Cart abandoned", caption: "Detected the moment it happens" },
  { icon: Clock, title: "Timer starts", caption: "Waits for the right moment to nudge" },
  { icon: Sparkles, title: "AI writes the nudge", caption: "Personal and on-brand, per customer" },
  { icon: Send, title: "Win-back sent", caption: "Email or WhatsApp, day or night" },
  { icon: RefreshCw, title: "Result logged", caption: "Recovered, or re-queued to retry" },
];

// SaaS: the lead-response teardown (Inbox/Sparkles/Database/Send/CalendarClock).
const SAAS_LEAD_RESPONSE = [
  { icon: Inbox, title: "Signup or demo request", caption: "Trial, form or inbound" },
  { icon: Sparkles, title: "AI qualifies it", caption: "Fit, intent, plan signals" },
  { icon: Database, title: "CRM updated", caption: "Enriched, tagged, assigned" },
  { icon: Send, title: "Reply in minutes", caption: "Personal and on-brand, day or night" },
  { icon: CalendarClock, title: "Onboarding queued", caption: "Right nudge, right day" },
];

// Recruitment: new steps grounded in the "AI Recruitment Pipeline" case study.
const RECRUITMENT_PIPELINE = [
  { icon: Inbox, title: "Resume comes in", caption: "Any channel, any time" },
  { icon: Sparkles, title: "AI screens it", caption: "Fit, experience, red flags" },
  { icon: FileText, title: "Documents collected", caption: "Automatically requested and chased" },
  { icon: ClipboardCheck, title: "Candidate prepped", caption: "Tailored brief, ready for review" },
  { icon: Bell, title: "Hiring manager updated", caption: "No manual status chasing" },
];

const SEGMENT_FLOW = {
  default: SPEED_TO_LEAD,
  agencies: AGENCY_REPORTING,
  ecommerce: ECOMMERCE_WINBACK,
  saas: SAAS_LEAD_RESPONSE,
  coaches: SPEED_TO_LEAD,
  recruitment: RECRUITMENT_PIPELINE,
};

// Primary CTA, reused in the hero and at the bottom of the page.
function CtaButton({ onClick, testid }) {
  return (
    <Magnetic>
      <button
        type="button"
        onClick={onClick}
        className="btn-teal text-base md:text-lg"
        data-cursor="hover"
        data-testid={testid}
      >
        Book my free audit <ArrowRight size={17} />
      </button>
    </Magnetic>
  );
}

// Section 3: the interactive 90-minute phase switcher.
const PHASES = [
  {
    id: "p1",
    label: "Minutes 0 to 15",
    title: "We listen",
    body: "You walk us through the workflow that eats the most time. Where it starts, who touches it, where it breaks. No slides, no discovery script.",
  },
  {
    id: "p2",
    label: "Minutes 15 to 75",
    title: "We build, live",
    body: "We pick the highest-impact piece and automate its first real step on your actual tools, screen shared, while you watch. You see exactly how we work before you spend a rupee.",
  },
  {
    id: "p3",
    label: "Minutes 75 to 90",
    title: "You get the map",
    body: "We walk you through a prioritized map of your top three workflows. What to automate, in what order, and roughly what it takes. Yours to keep either way.",
  },
];

// Section 4: the journey map (Roadmap stations, { num, name, meta, body }).
const JOURNEY = [
  {
    num: "01",
    name: "Pick your slot",
    meta: "under a minute",
    body: "Live calendar, takes under a minute. Just the basics, no long forms.",
  },
  {
    num: "02",
    name: "Confirmed in seconds",
    meta: "instant, automatic",
    body: "Google Meet link, branded confirmation, and reminders at 24 hours and 1 hour. All automatic.",
  },
  {
    num: "03",
    name: "The build call",
    meta: "90 minutes",
    body: "90 minutes. We listen, then build one automation live on your own tools.",
  },
  {
    num: "04",
    name: "The map lands",
    meta: "in your inbox",
    body: "Your prioritized automation map arrives in your inbox. What you do with it is entirely up to you.",
  },
];

// Section 5: the booking-is-the-demo flow. Replicated verbatim from the
// proofSteps array defined in Services.jsx (first six steps).
const BOOKING_PROOF_STEPS = [
  { icon: CalendarCheck, title: "You pick a slot", caption: "Live availability" },
  { icon: Database, title: "Lead saved", caption: "Into our database" },
  { icon: Video, title: "Meet link created", caption: "Automatically" },
  { icon: Mail, title: "Confirmation sent", caption: "Branded and instant" },
  { icon: BellRing, title: "Reminders queued", caption: "24 hours and 1 hour before" },
  { icon: Table, title: "Records updated", caption: "Zero typing" },
];

// Section 7: this call vs a typical sales call.
const CONTRAST = [
  { ours: "You watch a real automation get built", theirs: "You watch a slide deck" },
  { ours: "Your workflows set the agenda", theirs: "Their pitch sets the agenda" },
  { ours: "You leave with a plan you keep", theirs: "You leave with a follow-up sequence" },
  { ours: "No is a perfectly fine answer", theirs: "No triggers three more calls" },
];

// Section 6: what you leave the call with.
const WALKAWAY = [
  "A recorded map of your top 3 automatable workflows",
  "One real automation already partially built",
  "A rough sense of cost and timeline for each",
  "No pitch deck, no obligation, no follow-up pressure you didn't ask for",
];

// FAQ (7 items).
const AUDIT_FAQS = [
  {
    q: "Is this actually free?",
    a: "Yes. No card, no catch. If it is not worth automating, we will tell you that too.",
  },
  {
    q: "What if I am not ready to hire anyone?",
    a: "Then you leave with the map anyway. Plenty of people use it themselves.",
  },
  {
    q: "How long is the call really?",
    a: "90 minutes, sometimes less. We do not pad it out.",
  },
  {
    q: "What do I need to prepare?",
    a: "Nothing. Just show up ready to talk about the workflow that bothers you most.",
  },
  {
    q: "Will you try to sell me something?",
    a: "At the end, if there is a genuine fit, we will tell you what working together would look like. That is it. No pressure tactics, no countdown timers, no follow-up barrage. A no is a complete answer.",
  },
  {
    q: "My tools are old and messy. Will this still work?",
    a: "Almost certainly. We build on top of what you already run, including the spreadsheets. If something genuinely cannot connect, you will know at the audit, not after you have paid.",
  },
  {
    q: "What happens after the call if I say no?",
    a: "You keep the map, and we part on good terms. Some people run it themselves, some come back months later. Both are fine with us.",
  },
];

export default function Audit() {
  const { openBooking } = useBooking();
  // Active segment. null = nothing selected (default copy + default flow).
  const [segment, setSegment] = useState(null);
  // FAQ accordion: index of the open item (-1 = all closed).
  const [openFaq, setOpenFaq] = useState(0);
  // Active phase tab in the "inside the 90 minutes" section.
  const [phase, setPhase] = useState("p1");
  const activePhase = PHASES.find((p) => p.id === phase) || PHASES[0];

  const key = segment || "default";
  const line = SEGMENT_LINE[key];
  const flow = SEGMENT_FLOW[key];

  return (
    <div data-testid="audit-page" className="overflow-x-hidden">
      <Seo
        title="AI Audit Walkthrough"
        description="Book a free 90-minute AI Audit with WeHA. We map your three most automatable workflows and build one live while you watch."
        path="/audit"
        jsonLd={graph([
          ORG,
          WEBSITE,
          webPage({
            path: "/audit",
            name: "AI Audit Walkthrough",
            description:
              "Book a free 90-minute AI Audit with WeHA. We map your three most automatable workflows and build one live while you watch.",
          }),
          breadcrumb(
            [
              { name: "Home", path: "/" },
              { name: "Free AI Audit", path: "/audit" },
            ],
            "/audit"
          ),
        ])}
      />

      {/* SECTION 1 - HERO WITH SELF-SELECT SEGMENTATION */}
      <section
        className="section-solid relative pt-28 pb-16 md:pt-32 md:pb-20"
        data-testid="audit-hero"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
              Free AI Audit
            </span>
            <h1 className="weha-display text-5xl sm:text-6xl md:text-7xl mt-4 text-weha-text leading-[1.02]">
              The Free AI Audit.
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-lg md:text-xl text-weha-muted max-w-2xl leading-relaxed">
              90 minutes. One call. We map your three most automatable workflows
              and build one live while you watch.
            </p>
          </Reveal>

          {/* Segment chips - reuse TabSwitch visual (pill + sliding indicator).
              Scrolls horizontally on mobile via its built-in hide-scrollbar. */}
          <Reveal delay={0.14}>
            <div className="mt-8">
              <TabSwitch
                tabs={SEGMENTS}
                active={segment}
                onChange={setSegment}
              />
            </div>
          </Reveal>

          {/* Segment-aware promise line. */}
          <div className="mt-6 min-h-[3.5rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="text-lg md:text-xl text-weha-text max-w-2xl leading-relaxed"
                data-testid="audit-segment-line"
              >
                {line}
              </motion.p>
            </AnimatePresence>
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8">
              <CtaButton onClick={openBooking} testid="audit-hero-cta" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2 - PROOF, MATCHED TO THE SELECTED SEGMENT */}
      <ScrollSection direction="left" settle depth={0.5} intensity={0.45}>
        <section
          className="section-glass relative py-24 md:py-32 border-y border-weha-border"
          data-testid="audit-proof"
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
                See it work
              </span>
              <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">
                Watch a business problem fix itself.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-weha-muted max-w-xl leading-relaxed">
                This is what one of your workflows looks like after we automate
                it. Pick the segment above to see the flow that fits you.
              </p>
            </Reveal>

            <div className="mt-14 md:mt-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <FlowDiagram steps={flow} autoPlay replayKey={key} />
                </motion.div>
              </AnimatePresence>
            </div>

            <Reveal delay={0.1}>
              <p className="mt-14 text-weha-muted max-w-2xl leading-relaxed">
                Every flow runs on your existing tools. Nothing to rip out,
                nothing new to learn.
              </p>
            </Reveal>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 3 - HOW THE 90 MINUTES WORKS */}
      <ScrollSection direction="right" settle depth={0} intensity={0.35}>
        <section
          className="section-surface border-y border-weha-border py-24 md:py-32"
          data-testid="audit-how"
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
                How it works
              </span>
              <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">
                What actually happens on the call.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10">
                <TabSwitch tabs={PHASES} active={phase} onChange={setPhase} />
              </div>
            </Reveal>
            <div className="mt-8 max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="weha-card p-8 md:p-10"
                  data-testid="audit-phase-card"
                >
                  <h3 className="weha-display text-3xl md:text-4xl text-weha-text">
                    {activePhase.title}
                  </h3>
                  <p className="mt-4 text-lg text-weha-muted leading-relaxed">
                    {activePhase.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 4 - JOURNEY MAP */}
      <ScrollSection direction="left" settle depth={0.5} intensity={0.45}>
        <section className="section-solid py-24 md:py-32" data-testid="audit-journey">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
                From click to plan
              </span>
              <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">
                What happens when you book.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-weha-muted max-w-xl leading-relaxed">
                The whole journey, start to finish. No surprises anywhere in it.
              </p>
            </Reveal>
            <div className="mt-8 md:mt-4">
              <Roadmap steps={JOURNEY} />
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 5 - THE BOOKING IS THE DEMO */}
      <ScrollSection direction="right" settle depth={0.6} intensity={0.5}>
        <section
          className="section-glass border-y border-weha-border py-24 md:py-32"
          data-testid="audit-booking-demo"
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
                Proof, not promises
              </span>
              <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">
                Even this booking is a demo.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-weha-muted max-w-xl leading-relaxed">
                The moment you pick a slot, our own automations take over. No
                human touches any of this:
              </p>
            </Reveal>
            <div className="mt-14 md:mt-16">
              <FlowDiagram steps={BOOKING_PROOF_STEPS} autoPlay />
            </div>
            <Reveal delay={0.1}>
              <p className="mt-14 weha-display text-2xl md:text-3xl max-w-3xl text-weha-text leading-snug">
                The systems we sell are the systems we run on.{" "}
                <span className="italic text-weha-teal">
                  This booking is your first look at them, live.
                </span>
              </p>
            </Reveal>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 6 - WHAT YOU WALK AWAY WITH */}
      <ScrollSection direction="left" settle depth={0.4} intensity={0.4}>
        <section className="section-solid py-24 md:py-32" data-testid="audit-walkaway">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
                What you get
              </span>
              <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">
                Not a pitch. A plan.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-9 space-y-4">
                {WALKAWAY.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}
                    >
                      <Check size={14} />
                    </span>
                    <span className="text-lg text-weha-text leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 7 - CONTRAST STRIP: this call vs a typical sales call */}
      <ScrollSection direction="left" settle depth={0} intensity={0.35}>
        <section
          className="section-surface border-y border-weha-border py-24 md:py-32"
          data-testid="audit-contrast"
        >
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
                No ambush
              </span>
              <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">
                This call vs a typical sales call.
              </h2>
            </Reveal>

            {/* Column headers (desktop only) */}
            <Reveal delay={0.06}>
              <div className="mt-12 hidden md:grid md:grid-cols-2 md:gap-6">
                <p className="weha-display text-xl text-weha-teal">This call</p>
                <p className="weha-display text-xl text-weha-faint">A typical sales call</p>
              </div>
            </Reveal>

            <div className="mt-4 space-y-5 md:space-y-4">
              {CONTRAST.map((row, i) => (
                <Reveal key={i} delay={0.08 + i * 0.06}>
                  <div className="grid gap-3 md:grid-cols-2 md:gap-6">
                    {/* This call */}
                    <div className="weha-card flex items-start gap-3 p-5" data-cursor="hover">
                      <span
                        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}
                      >
                        <Check size={14} />
                      </span>
                      <span className="text-weha-text leading-relaxed">{row.ours}</span>
                    </div>
                    {/* A typical sales call */}
                    <div className="flex items-start gap-3 rounded-2xl border border-weha-border p-5">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-weha-elevated text-weha-faint">
                        <X size={14} />
                      </span>
                      <span className="text-weha-faint leading-relaxed">{row.theirs}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 8 - TESTIMONIAL MOMENT */}
      <section className="section-solid py-24 md:py-32" data-testid="audit-testimonial">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Reveal>
            <blockquote className="weha-display text-2xl md:text-3xl text-weha-text leading-snug">
              &ldquo;Live in under two weeks, on the tools we already had. It felt
              less like buying software and more like a hire.&rdquo;
            </blockquote>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm text-weha-faint">SaaS startup</p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 9 - FAQ */}
      <ScrollSection direction="right" settle depth={0} intensity={0.3}>
        <section
          className="section-surface border-y border-weha-border py-24 md:py-32"
          data-testid="audit-faq"
        >
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
                Straight answers
              </span>
              <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">
                Quick questions, honestly answered.
              </h2>
            </Reveal>
            <div className="mt-12">
              {AUDIT_FAQS.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="border-b border-weha-border">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      data-cursor="hover"
                      className="w-full flex items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--weha-teal-soft)] rounded-lg"
                    >
                      <span className="weha-display text-xl md:text-2xl text-weha-text">{item.q}</span>
                      <Plus
                        size={22}
                        className="shrink-0 text-weha-teal"
                        style={{
                          transform: open ? "rotate(45deg)" : "rotate(0deg)",
                          transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                        }}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          style={{ overflow: "hidden" }}
                        >
                          <p className="pb-6 pr-8 text-weha-muted leading-relaxed">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 6 - CLOSING CTA */}
      <ScrollSection direction="left" settle depth={0.35} intensity={0.45}>
        <CTABanner
          heading="See your first automation built live on the call."
          sub="Book a free AI Audit. We will map your top three workflows and build one live on the call. No pitch deck, no obligation."
          cta="Book my free audit"
          testid="audit-cta"
        />
      </ScrollSection>
    </div>
  );
}
