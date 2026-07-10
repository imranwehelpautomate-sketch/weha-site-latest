import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Gauge,
  Mail,
  Inbox,
  Sparkles,
  Database,
  Send,
  CalendarClock,
  Bell,
  RefreshCw,
  LayoutDashboard,
  Lightbulb,
  UserCheck,
  Share2,
  Zap,
  FileText,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import Magnetic from "@/components/Magnetic";
import CountUp from "@/components/CountUp";
import FlowDiagram from "@/components/FlowDiagram";
import CTABanner from "@/components/CTABanner";
import Seo from "@/components/Seo";
import { EASE } from "@/lib/motion";
import { useBooking } from "@/context/BookingContext";
import { submitCalculatorLead } from "@/lib/api";
import { validateName, validateEmail } from "@/lib/spamGuard";
import { ORG, WEBSITE, breadcrumb, webPage, graph } from "@/lib/seoSchemas";

/* ------------------------------------------------------------------ *
 * Recommendation flows. Reused verbatim where the copy already exists
 * across the site (Speed to lead / Content engine / Marketing
 * reporting on Home + Audit). The deterministic "Connect your tools"
 * flow is built from the Services "Deterministic Automation" pillar's
 * own capability list, since that pillar has no standalone flow array.
 * ------------------------------------------------------------------ */
const SPEED_TO_LEAD = [
  { icon: Inbox, title: "Lead comes in", caption: "Website, ad, WhatsApp or DM" },
  { icon: Sparkles, title: "AI qualifies it", caption: "Intent, budget signals, fit" },
  { icon: Database, title: "CRM updated", caption: "Enriched, tagged, assigned" },
  { icon: Send, title: "Reply in minutes", caption: "Personal and on-brand, day or night" },
  { icon: CalendarClock, title: "Follow-ups queued", caption: "Day 2 and day 5, automatic" },
  { icon: Bell, title: "You get one ping", caption: "A clean summary, not another task" },
];

const AGENCY_REPORTING = [
  { icon: Database, title: "Channels connected", caption: "Ads, analytics, email, CRM" },
  { icon: RefreshCw, title: "Data pulled nightly", caption: "No exports, no copy-paste" },
  { icon: Sparkles, title: "AI writes the summary", caption: "What changed and why it matters" },
  { icon: LayoutDashboard, title: "Dashboard updates", caption: "Live, not last month" },
  { icon: Send, title: "Report in your inbox", caption: "Monday 8 AM, client-ready" },
];

const CONTENT_ENGINE = [
  { icon: Lightbulb, title: "One idea goes in", caption: "A topic, a transcript, a rough note" },
  { icon: Sparkles, title: "AI drafts in your voice", caption: "Post, email and captions" },
  { icon: UserCheck, title: "You approve", caption: "One tap, edits optional" },
  { icon: Share2, title: "Published everywhere", caption: "LinkedIn, Instagram, newsletter" },
  { icon: RefreshCw, title: "Repurposed automatically", caption: "One asset becomes ten" },
  { icon: LayoutDashboard, title: "Performance logged", caption: "What worked, ready for next week" },
];

const CONNECT_TOOLS = [
  { icon: Zap, title: "Trigger fires", caption: "A form, a sale, a new row" },
  { icon: RefreshCw, title: "Data syncs across apps", caption: "No copy-paste between tools" },
  { icon: Database, title: "Records updated", caption: "CRM and sheets stay in sync" },
  { icon: FileText, title: "Documents generated", caption: "Invoices, briefs, contracts" },
  { icon: Bell, title: "The right people pinged", caption: "Notifications and reminders sent" },
];

// Q2 answer drives which flow we recommend "first".
const RECOMMENDATION = {
  "Lead follow-up": { flow: SPEED_TO_LEAD },
  "Client reporting": { flow: AGENCY_REPORTING },
  "Content and marketing ops": { flow: CONTENT_ENGINE },
  "Admin and data entry": { flow: CONNECT_TOOLS },
  "Client onboarding": {
    flow: CONNECT_TOOLS,
    caption: "Onboarding is the classic connect-your-tools win.",
  },
};

const QUESTIONS = [
  {
    q: "How many people touch your day-to-day operations?",
    options: [
      { label: "Just me", points: 8 },
      { label: "2 to 10", points: 12 },
      { label: "11 to 50", points: 16 },
      { label: "More than 50", points: 14 },
    ],
  },
  {
    q: "Where do the most hours quietly disappear?",
    options: [
      { label: "Lead follow-up", points: 12 },
      { label: "Client reporting", points: 12 },
      { label: "Content and marketing ops", points: 12 },
      { label: "Admin and data entry", points: 12 },
      { label: "Client onboarding", points: 12 },
    ],
  },
  {
    q: "How do new leads reach you?",
    options: [
      { label: "Mostly one channel", points: 8 },
      { label: "Two or three channels", points: 12 },
      { label: "Everywhere: forms, DMs, WhatsApp, email", points: 16 },
    ],
  },
  {
    q: "What runs your operations today?",
    options: [
      { label: "Mostly spreadsheets and inboxes", points: 8 },
      { label: "A CRM plus scattered apps", points: 12 },
      { label: "A modern stack we actually use", points: 16 },
    ],
  },
  {
    q: "Have you tried automating anything yet?",
    options: [
      { label: "Not really", points: 8 },
      { label: "A few basic zaps", points: 12 },
      { label: "Yes, but it is fragile and breaks", points: 16 },
    ],
  },
  {
    q: "How fast does a new lead get a reply?",
    options: [
      { label: "Within minutes", points: 8 },
      { label: "Within hours", points: 12 },
      { label: "Next day or later", points: 16 },
      { label: "Honestly, it depends who is free", points: 14 },
    ],
  },
];

const MAX_POINTS = QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
  0
);

function getBand(score) {
  if (score < 50) {
    return {
      band: "Foundation first",
      verdict:
        "Honest answer: automation is not your first move. Get your leads flowing into one place and standardize on a core tool, then automation compounds fast. We would tell you the same thing on a call. That is the No BS part.",
    };
  }
  if (score < 75) {
    return {
      band: "Quick wins ready",
      verdict:
        "You have real automation upside sitting in plain sight. One or two workflows are leaking hours every single week, and fixing them does not require changing your stack.",
    };
  }
  return {
    band: "Ready to compound",
    verdict:
      "Your operations are automation-ready today. The volume is there, the tools are there, and the manual hours are pure leak. Teams in your position usually see the fastest payback.",
  };
}

export default function ReadinessCheck() {
  const { openBooking } = useBooking();
  const reduceMotion = useReducedMotion();
  const quizRef = useRef(null);

  // answers[i] = chosen option index for question i (null until answered).
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [step, setStep] = useState(0);
  const [justPicked, setJustPicked] = useState(null); // confirmation highlight
  const [completed, setCompleted] = useState(false);

  // Email capture state.
  const [lead, setLead] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [sent, setSent] = useState(false);

  const dur = reduceMotion ? 0 : 0.25;

  const score = useMemo(() => {
    const total = answers.reduce(
      (sum, a, i) => sum + (a !== null ? QUESTIONS[i].options[a].points : 0),
      0
    );
    return Math.round((total / MAX_POINTS) * 100);
  }, [answers]);

  const band = useMemo(() => getBand(score), [score]);

  const q2Label =
    answers[1] !== null ? QUESTIONS[1].options[answers[1]].label : null;
  const rec = RECOMMENDATION[q2Label] || { flow: SPEED_TO_LEAD };

  const startCheck = () =>
    quizRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

  const pick = (optIndex) => {
    if (justPicked !== null) return; // ignore double-clicks mid-advance
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = optIndex;
      return next;
    });
    setJustPicked(optIndex);
    window.setTimeout(() => {
      setJustPicked(null);
      if (step === QUESTIONS.length - 1) setCompleted(true);
      else setStep((s) => s + 1);
    }, 250);
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const retake = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setJustPicked(null);
    setCompleted(false);
    setLead({ name: "", email: "" });
    setEmailErr("");
    setSent(false);
    startCheck();
  };

  const updateLead = (k) => (e) =>
    setLead((l) => ({ ...l, [k]: e.target.value }));

  const submitEmail = async (e) => {
    e.preventDefault();
    const v = validateName(lead.name) || validateEmail(lead.email);
    if (v) {
      setEmailErr(v);
      return;
    }
    setSubmitting(true);
    setEmailErr("");
    try {
      const qaPairs = QUESTIONS.map((q, i) => ({
        question: q.q,
        answer: answers[i] !== null ? q.options[answers[i]].label : null,
      }));
      await submitCalculatorLead({
        name: lead.name,
        email: lead.email,
        source: "readiness-check",
        inputs_json: JSON.stringify({ answers: qaPairs, score }),
        result_summary: `${band.band}, ${score}/100`,
      });
      setSent(true);
    } catch (err) {
      setEmailErr(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const current = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div data-testid="readiness-page" className="overflow-x-hidden">
      <Seo
        title="Automation Readiness Check"
        description="Six quick questions, two minutes, an honest automation-readiness score, plus the one workflow you should automate first. No email required to see your result."
        path="/readiness-check"
        jsonLd={graph([
          ORG,
          WEBSITE,
          webPage({
            path: "/readiness-check",
            name: "Automation Readiness Check",
            description:
              "A free six-question quiz that scores how automation-ready your business is and tells you what to automate first.",
          }),
          breadcrumb(
            [
              { name: "Home", path: "/" },
              { name: "Automation Readiness Check", path: "/readiness-check" },
            ],
            "/readiness-check"
          ),
        ])}
      />

      {/* SECTION 1 - INTRO HERO */}
      <section
        className="section-solid relative pt-28 pb-16 md:pt-32 md:pb-20"
        data-testid="readiness-hero"
      >
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
              <Gauge size={14} /> Readiness check
            </span>
            <h1 className="weha-display text-5xl sm:text-6xl md:text-7xl mt-4 text-weha-text leading-[1.02]">
              How automation-ready are you?
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-lg md:text-xl text-weha-muted max-w-2xl leading-relaxed">
              Six quick questions. Two minutes. An honest score and the one
              workflow you should automate first. No email required to see your
              result.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8">
              <Magnetic>
                <button
                  type="button"
                  onClick={startCheck}
                  className="btn-teal text-base md:text-lg"
                  data-cursor="hover"
                  data-testid="readiness-start"
                >
                  Start the check <ArrowRight size={17} />
                </button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2 / 3 - QUIZ + RESULT */}
      <ScrollSection direction="left" settle depth={0.4} intensity={0.4}>
        <section
          ref={quizRef}
          className="section-glass border-y border-weha-border py-20 md:py-28 scroll-mt-24"
          data-testid="readiness-quiz-section"
        >
          <div className="max-w-2xl mx-auto px-5 sm:px-8">
            <AnimatePresence mode="wait">
              {!completed ? (
                /* -------- QUIZ CARD -------- */
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: dur, ease: EASE }}
                  className="weha-card p-7 md:p-10"
                  data-testid="readiness-quiz-card"
                >
                  {/* progress */}
                  <div className="h-1.5 w-full rounded-full bg-weha-elevated overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--weha-pop)" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
                    />
                  </div>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-weha-faint">
                    Question {step + 1} of {QUESTIONS.length}
                  </p>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: reduceMotion ? 0 : 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: reduceMotion ? 0 : -24 }}
                      transition={{ duration: dur, ease: EASE }}
                    >
                      <h2 className="weha-display text-2xl md:text-3xl mt-4 text-weha-text leading-snug">
                        {current.q}
                      </h2>

                      <div className="mt-7 space-y-3">
                        {current.options.map((opt, oi) => {
                          const active = justPicked === oi || answers[step] === oi;
                          return (
                            <button
                              key={oi}
                              type="button"
                              onClick={() => pick(oi)}
                              data-cursor="hover"
                              data-testid={`readiness-option-${oi}`}
                              className={`w-full flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
                                active
                                  ? "border-weha-pop bg-weha-teal-soft text-weha-text"
                                  : "border-weha-border bg-weha-surface text-weha-text hover:border-weha-pop"
                              }`}
                            >
                              <span className="text-base md:text-lg">{opt.label}</span>
                              <span
                                className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-opacity ${
                                  active
                                    ? "border-weha-pop bg-weha-pop text-white opacity-100"
                                    : "border-weha-border opacity-0"
                                }`}
                              >
                                <Check size={14} />
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {step > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          data-cursor="hover"
                          data-testid="readiness-back"
                          className="mt-6 inline-flex items-center gap-1.5 text-sm text-weha-faint hover:text-weha-teal transition-colors"
                        >
                          <ArrowLeft size={14} /> Back
                        </button>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ) : (
                /* -------- RESULT -------- */
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: dur, ease: EASE }}
                  data-testid="readiness-result"
                >
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-weha-faint">
                      Your readiness score
                    </p>
                    <p className="mt-3 leading-none">
                      <span className="weha-display text-6xl md:text-8xl text-weha-teal">
                        <CountUp value={score} />
                      </span>
                      <span className="weha-display text-3xl md:text-4xl text-weha-teal/50">
                        /100
                      </span>
                    </p>
                    <h2 className="weha-display text-3xl md:text-4xl mt-6 text-weha-text">
                      {band.band}
                    </h2>
                    <p className="mt-4 text-weha-muted leading-relaxed max-w-xl mx-auto">
                      {band.verdict}
                    </p>
                  </div>

                  <div className="mt-12">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal text-center">
                      Automate this first:
                    </p>
                    {rec.caption && (
                      <p className="mt-3 text-center text-weha-muted">{rec.caption}</p>
                    )}
                    <div className="mt-8">
                      <FlowDiagram steps={rec.flow} autoPlay replayKey={q2Label || "default"} />
                    </div>
                  </div>

                  {/* PRIMARY CTA */}
                  <div className="mt-12 text-center">
                    <Magnetic>
                      <button
                        type="button"
                        onClick={openBooking}
                        className="btn-teal text-base md:text-lg"
                        data-cursor="hover"
                        data-testid="readiness-book"
                      >
                        Book my free audit <ArrowRight size={17} />
                      </button>
                    </Magnetic>
                    <p className="mt-4 text-sm text-weha-muted">
                      We will map your exact top three on the call and build one
                      live.
                    </p>
                  </div>

                  {/* SECTION 4 - OPTIONAL EMAIL CAPTURE */}
                  <div
                    className="mt-12 weha-card p-7 md:p-8"
                    data-testid="readiness-email-card"
                  >
                    <h3 className="weha-display text-xl md:text-2xl text-weha-text">
                      Want this as a written breakdown? We will email it over.
                    </h3>
                    {sent ? (
                      <p
                        className="mt-5 inline-flex items-center gap-2 text-weha-teal"
                        role="status"
                        data-testid="readiness-email-success"
                      >
                        <Check size={18} /> Sent. Check your inbox.
                      </p>
                    ) : (
                      <form
                        onSubmit={submitEmail}
                        className="mt-5 space-y-4"
                        data-testid="readiness-email-form"
                      >
                        <div>
                          <label className="weha-label" htmlFor="readiness-name">
                            Name
                          </label>
                          <input
                            id="readiness-name"
                            className="weha-input text-base"
                            value={lead.name}
                            onChange={updateLead("name")}
                            placeholder="Your name"
                            autoComplete="name"
                            data-testid="readiness-name"
                          />
                        </div>
                        <div>
                          <label className="weha-label" htmlFor="readiness-email">
                            Work email
                          </label>
                          <input
                            id="readiness-email"
                            type="email"
                            className="weha-input text-base"
                            value={lead.email}
                            onChange={updateLead("email")}
                            placeholder="you@company.com"
                            autoComplete="email"
                            data-testid="readiness-email"
                          />
                        </div>
                        {emailErr && (
                          <p
                            className="text-sm text-red-500"
                            role="alert"
                            data-testid="readiness-email-error"
                          >
                            {emailErr}
                          </p>
                        )}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-teal w-full justify-center disabled:opacity-60"
                          data-cursor="hover"
                          data-testid="readiness-email-submit"
                        >
                          {submitting ? "Sending…" : "Email my breakdown"}{" "}
                          <Mail size={16} />
                        </button>
                      </form>
                    )}
                  </div>

                  {/* RETAKE */}
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={retake}
                      data-cursor="hover"
                      data-testid="readiness-retake"
                      className="inline-flex items-center gap-1.5 text-sm text-weha-faint hover:text-weha-teal transition-colors"
                    >
                      <RotateCcw size={14} /> Retake the check
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 5 - CLOSING CTA */}
      <ScrollSection direction="right" settle depth={0.35} intensity={0.45}>
        <CTABanner
          heading="Not sure where to start? Let's map it out together."
          sub="Book a free AI Audit. We map how you work, then show you what is worth automating first."
          cta="Book my free audit"
          testid="readiness-cta"
        />
      </ScrollSection>
    </div>
  );
}
