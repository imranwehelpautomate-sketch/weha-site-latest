import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
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
} from "lucide-react";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import Magnetic from "@/components/Magnetic";
import TabSwitch from "@/components/TabSwitch";
import FlowDiagram from "@/components/FlowDiagram";
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

export default function Audit() {
  const { openBooking } = useBooking();
  // Active segment. null = nothing selected (default copy + default flow).
  const [segment, setSegment] = useState(null);

  const key = segment || "default";
  const line = SEGMENT_LINE[key];
  const flow = SEGMENT_FLOW[key];

  return (
    <div data-testid="audit-page" className="overflow-x-hidden">
      <Seo
        title="The Free AI Audit"
        description="Book a free 90-minute AI Audit with WeHA. We map your three most automatable workflows and build one live while you watch."
        path="/audit"
        jsonLd={graph([
          ORG,
          WEBSITE,
          webPage({
            path: "/audit",
            name: "The Free AI Audit",
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

      {/* SECTION 3 - SECOND CTA */}
      <ScrollSection direction="right" settle depth={0.35} intensity={0.4}>
        <section className="section-solid py-24 md:py-32" data-testid="audit-cta">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <Reveal>
              <h2 className="weha-display text-4xl md:text-5xl text-weha-text leading-[1.05]">
                See your first automation built{" "}
                <span className="italic text-weha-teal">live on the call.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-weha-muted text-lg leading-relaxed">
                90 minutes, no pitch deck, no obligation. You leave with a
                prioritized plan whether you hire us or not.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex justify-center">
                <CtaButton onClick={openBooking} testid="audit-bottom-cta" />
              </div>
            </Reveal>
          </div>
        </section>
      </ScrollSection>
    </div>
  );
}
