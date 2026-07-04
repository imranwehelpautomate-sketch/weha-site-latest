import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Inbox,
  Sparkles,
  Database,
  Send,
  CalendarClock,
  Bell,
  FileText,
  Eye,
  RefreshCw,
  AlertCircle,
  UserCheck,
  Lightbulb,
  Share2,
  LayoutDashboard,
  CalendarCheck,
  Video,
  Mail,
  BellRing,
  Table,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import Magnetic from "@/components/Magnetic";
import IntegrationStrip from "@/components/IntegrationStrip";
import ScrollSection from "@/components/ScrollSection";
import CountUp from "@/components/CountUp";
import TabSwitch from "@/components/TabSwitch";
import FlowDiagram from "@/components/FlowDiagram";
import CostSlider from "@/components/CostSlider";
import Seo from "@/components/Seo";
import { EASE } from "@/lib/motion";
import { useBooking } from "@/context/BookingContext";
import { ORG, SITE, breadcrumb, graph } from "@/lib/seoSchemas";

// Three persona confessions (label = persona + time, then the quote).
const pains = [
  {
    label: "Agency founder · 11:52 PM",
    quote:
      "Client reporting week again. Six dashboards, four spreadsheets, the same numbers pasted into slides. Every single month.",
  },
  {
    label: "Ecommerce founder · 8:14 AM",
    quote:
      "Abandoned carts, unanswered DMs, review requests we never send. We know the playbook. Nobody has time to actually run it.",
  },
  {
    label: "SaaS founder · 9:40 PM",
    quote:
      "A demo request came in Friday night. We replied Monday morning. They had already signed with someone else.",
  },
  {
    label: "Recruitment firm · 7:20 PM",
    quote:
      "Three hundred CVs for one role. Screening, formatting, scheduling, follow-ups — all by hand. Great candidates go cold before we even reply.",
  },
  {
    label: "Marketing head · 6:05 PM",
    quote:
      "A team of two doing the work of six. Content, campaigns, reporting — everything ships late because we are stuck stitching tools together.",
  },
  {
    label: "Sales head · 10:15 PM",
    quote:
      "My reps spend half their day updating the CRM and chasing quotes instead of selling. Small team, no ops person, pipeline slipping through the cracks.",
  },
];

// Flagship flows shown in the flow section (each replays on tab switch).
const FLOWS = [
  {
    id: "speed",
    label: "Speed to lead",
    steps: [
      { icon: Inbox, title: "Lead comes in", caption: "Website, ad, WhatsApp or DM" },
      { icon: Sparkles, title: "AI qualifies it", caption: "Intent, budget signals, fit" },
      { icon: Database, title: "CRM updated", caption: "Enriched, tagged, assigned" },
      { icon: Send, title: "Reply in minutes", caption: "Personal and on-brand, day or night" },
      { icon: CalendarClock, title: "Follow-ups queued", caption: "Day 2 and day 5, automatic" },
      { icon: Bell, title: "You get one ping", caption: "A clean summary, not another task" },
    ],
  },
  {
    id: "pipeline",
    label: "Sales pipeline",
    steps: [
      { icon: FileText, title: "Proposal sent", caption: "Your rates, your template" },
      { icon: Eye, title: "Opens tracked", caption: "You know the moment they read it" },
      { icon: RefreshCw, title: "Chase-ups automatic", caption: "Polite, persistent, until they answer" },
      { icon: Database, title: "Pipeline updates itself", caption: "No more stale deal stages" },
      { icon: AlertCircle, title: "Cold deals flagged", caption: "Before they die quietly" },
      { icon: UserCheck, title: "You close", caption: "The system did the chasing" },
    ],
  },
  {
    id: "content",
    label: "Content engine",
    steps: [
      { icon: Lightbulb, title: "One idea goes in", caption: "A topic, a transcript, a rough note" },
      { icon: Sparkles, title: "AI drafts in your voice", caption: "Post, email and captions" },
      { icon: UserCheck, title: "You approve", caption: "One tap, edits optional" },
      { icon: Share2, title: "Published everywhere", caption: "LinkedIn, Instagram, newsletter" },
      { icon: RefreshCw, title: "Repurposed automatically", caption: "One asset becomes ten" },
      { icon: LayoutDashboard, title: "Performance logged", caption: "What worked, ready for next week" },
    ],
  },
  {
    id: "reporting",
    label: "Marketing reporting",
    steps: [
      { icon: Database, title: "Channels connected", caption: "Ads, analytics, email, CRM" },
      { icon: RefreshCw, title: "Data pulled nightly", caption: "No exports, no copy-paste" },
      { icon: Sparkles, title: "AI writes the summary", caption: "What changed and why it matters" },
      { icon: LayoutDashboard, title: "Dashboard updates", caption: "Live, not last month" },
      { icon: Send, title: "Report in your inbox", caption: "Monday 8 AM, client-ready" },
    ],
  },
  {
    id: "recruitment",
    label: "Recruitment agency",
    steps: [
      { icon: Inbox, title: "CVs come in", caption: "Job boards, referrals, email" },
      { icon: Sparkles, title: "AI screens & ranks", caption: "Skills, experience, role fit" },
      { icon: FileText, title: "CV reformatted", caption: "Your branded template, instantly" },
      { icon: CalendarCheck, title: "Interviews booked", caption: "Candidate and client, synced" },
      { icon: Send, title: "Updates go out", caption: "Everyone kept in the loop" },
      { icon: Database, title: "ATS updated", caption: "Every stage logged, zero typing" },
    ],
  },
  {
    id: "realestate",
    label: "Real estate",
    steps: [
      { icon: Inbox, title: "Enquiry arrives", caption: "Portal, ad, WhatsApp or call" },
      { icon: Send, title: "Instant reply sent", caption: "Answered in seconds, day or night" },
      { icon: CalendarCheck, title: "Viewing booked", caption: "Live calendar, auto-confirmed" },
      { icon: RefreshCw, title: "Listings synced", caption: "Portals and site always match" },
      { icon: BellRing, title: "Follow-ups nurtured", caption: "Warm leads never go cold" },
      { icon: Database, title: "CRM updated", caption: "Every lead tracked to close" },
    ],
  },
  {
    id: "onboarding",
    label: "SaaS onboarding",
    steps: [
      { icon: UserCheck, title: "New signup", caption: "Trial or paid, welcomed instantly" },
      { icon: Mail, title: "Welcome sequence", caption: "Personalized to their plan" },
      { icon: Sparkles, title: "AI guides setup", caption: "Nudges toward the aha moment" },
      { icon: CalendarClock, title: "Check-ins scheduled", caption: "Right message, right day" },
      { icon: AlertCircle, title: "At-risk flagged", caption: "Before they quietly churn" },
      { icon: LayoutDashboard, title: "Health tracked", caption: "Activation and usage, live" },
    ],
  },
];

// Proof / dogfooding: what happens when someone books on this very site.
const proofSteps = [
  { icon: CalendarCheck, title: "You pick a slot", caption: "Live availability, real calendar" },
  { icon: Database, title: "Lead saved", caption: "Straight into our database" },
  { icon: Video, title: "Meet link created", caption: "Generated automatically" },
  { icon: Mail, title: "Confirmation sent", caption: "Branded, personal, instant" },
  { icon: BellRing, title: "Reminders queued", caption: "24 hours and 1 hour before" },
  { icon: Table, title: "Books updated", caption: "Logged and tracked, zero typing" },
];

// Who this is for.
const industries = [
  {
    tag: "Agencies",
    title: "Marketing & Creative Agencies",
    body: "Client reporting that writes itself. Onboarding that runs without the founder. More retainers on the same headcount.",
  },
  {
    tag: "Recruitment",
    title: "Recruitment Agencies",
    body: "Candidate screening, CV formatting, interview scheduling and follow-ups — automated end to end. Great candidates get a reply in minutes, not days, so you place roles faster.",
  },
  {
    tag: "Remote",
    title: "Work From Home & Remote Teams",
    body: "A workforce scattered across cities — sometimes across the globe. Automations keep everyone in sync: handoffs, approvals, status updates and reporting run themselves across every timezone, so nothing gets lost between inboxes and no one waits on a colleague who is asleep.",
  },
  {
    tag: "Real Estate",
    title: "Real Estate",
    body: "New enquiries answered instantly, viewings booked, listings kept in sync and follow-ups nurtured on their own. Every lead worked around the clock while you focus on closing.",
  },
  {
    tag: "Online",
    title: "Online Businesses",
    body: "Orders, support, reviews and retention flows running 24/7. The revenue playbook you keep meaning to run, finally on autopilot.",
  },
  {
    tag: "Ecommerce",
    title: "Ecommerce & D2C Brands",
    body: "Abandoned carts chased, reviews requested, support triaged. The revenue playbook, finally running 24/7.",
  },
  {
    tag: "SaaS",
    title: "SaaS & Tech Startups",
    body: "Every trial signup and demo request answered in minutes. Your pipeline updates itself while you ship product.",
  },
  {
    tag: "Consultants",
    title: "Coaches, Consultants & Online Services",
    body: "Discovery calls booked, no-shows reminded, follow-ups sent. You sell and deliver; the admin runs itself.",
  },
];

// Animated pills for the "Who this is for" section.
const whoPills = [
  "Marketing Agencies",
  "Recruitment Agencies",
  "Remote Teams",
  "Real Estate",
  "Online Businesses",
  "Ecommerce & D2C",
  "SaaS & Startups",
  "Coaches & Consultants",
  "Creative Studios",
  "Global Teams",
];

// Why WeHA (dark section) bullets, unchanged.
const whyWeha = [
  "You own every system we build, no lock-in, no monthly hostage fees.",
  "We automate on top of the tools you already use. No rip-and-replace.",
  "Live systems in days, not months. You see value almost immediately.",
  "Every automation is documented and handed off, so your team stays in control.",
];

// Dogfooding stats row inside the dark section.
const stats = [
  { value: 90, suffix: " min", label: "to your first live automation" },
  { value: 100, suffix: "%", label: "yours: code, docs and accounts" },
  { value: 30, suffix: " days", label: "of support after every handoff" },
  { value: 0, suffix: "", label: "new software to buy" },
];

// FAQ.
const faqs = [
  {
    q: "How much does it cost?",
    a: "The audit is free. Builds are scoped and priced before we start, so you never get a surprise invoice. And if a workflow is not worth automating, we will tell you that too.",
  },
  {
    q: "Our tools are old and messy. Will this still work?",
    a: "Almost certainly. We build on top of what you already run, including the spreadsheets. If something genuinely cannot connect, you will know at the audit, not after you have paid.",
  },
  {
    q: "What happens when something breaks after handoff?",
    a: "Every build ships with plain-English documentation and 30 days of support. After that you own a system your team understands, and we are one message away.",
  },
  {
    q: "We are not technical people.",
    a: "You do not need to be. You approve things from your phone and read clear summaries. The system does the technical part. That is what it is for.",
  },
];

export default function Home() {
  const { openBooking } = useBooking();

  const rotatingWords = [
    "your manual tasks",
    "your workflows",
    "your follow-ups",
    "your reporting",
    "your onboarding",
    "your invoicing",
    "your lead routing",
    "your stress",
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Flagship flow tab + FAQ accordion state.
  const [activeTab, setActiveTab] = useState(FLOWS[0].id);
  const activeFlow = FLOWS.find((f) => f.id === activeTab) || FLOWS[0];
  const [openFaq, setOpenFaq] = useState(0);

  // "Sound familiar?" slider — horizontal scroll with arrow controls.
  const painsRef = useRef(null);
  const scrollPains = (dir) => {
    const el = painsRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 420);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // Hero → first-section handoff: as the hero scrolls away it lifts + fades,
  // synced with the network camera pulling the viewer inward.
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const cueOpacity = useTransform(heroProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % rotatingWords.length);
        setVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-testid="home-page" className="overflow-x-hidden">
      <Seo
        title=""
        description="We Help Automate (WeHA) turns your messiest manual workflows into AI systems that run themselves, built in days, not months. Book a free AI Audit."
        path="/"
        jsonLd={graph([
          ORG,
          {
            "@type": "WebSite",
            "@id": `${SITE}/#website`,
            url: SITE,
            name: "We Help Automate",
            publisher: { "@id": `${SITE}/#organization` },
          },
          breadcrumb([{ name: "Home", path: "/" }]),
        ])}
      />
      {/* HERO - over the live floating tech network */}
      <section ref={heroRef} className="relative min-h-[88svh] flex items-center pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--weha-bg) 0%, var(--weha-bg) 24%, color-mix(in srgb, var(--weha-bg) 55%, transparent) 48%, transparent 76%)",
          }}
        />
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full pt-20 pb-16"
        >
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-weha-teal animate-pulse flex-shrink-0" />
                <span className="text-weha-teal">We Help Automate</span>
                <span
                  className="text-weha-muted normal-case tracking-normal italic font-semibold transition-all duration-300"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0px)" : "translateY(6px)",
                  }}
                >
                  {rotatingWords[wordIndex]}
                </span>
              </span>
            </Reveal>
            <h1 className="weha-display text-5xl sm:text-7xl lg:text-[5.5rem] mt-6 text-weha-text leading-[1.02]">
              <MaskReveal delay={0.05}>Your business probably</MaskReveal>
              <MaskReveal delay={0.13}>runs on 47 manual steps.</MaskReveal>
              <MaskReveal delay={0.21}>
                <span className="italic text-weha-teal">Let&apos;s automate that.</span>
              </MaskReveal>
            </h1>
            <Reveal delay={0.35}>
              <p className="mt-7 text-lg md:text-xl text-weha-muted max-w-xl leading-relaxed">
                We turn your messiest, most time-consuming workflows into systems that run
                themselves. Built in days, not months.
              </p>
            </Reveal>
            <Reveal delay={0.45}>
              <div className="mt-9 flex flex-nowrap items-center gap-3 sm:gap-5 pointer-events-auto">
                <Magnetic>
                  <button type="button" onClick={openBooking} className="btn-teal max-sm:!px-4 max-sm:!text-sm" data-testid="hero-primary-cta" data-cursor="hover">
                    Book a Free AI Audit <ArrowRight size={16} />
                  </button>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <Link to="/services" className="btn-ghost max-sm:!text-sm whitespace-nowrap" data-testid="hero-secondary-cta" data-cursor="hover">
                    See How It Works <ArrowRight size={15} />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </motion.div>
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
          >
            <span className="scroll-cue" />
          </motion.div>
        </motion.div>
      </section>

      {/* INTEGRATION LOGO TICKER - tool fluency */}
      <IntegrationStrip />

      {/* SECTION 3 · PAINS - glass cards floating over the network */}
      <ScrollSection direction="left" settle depth={0.25} intensity={0.4}>
      <section className="relative section-glass py-24 md:py-32" data-testid="section-pains">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <h2 className="weha-display text-4xl md:text-6xl text-weha-text">Sound familiar?</h2>
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => scrollPains(-1)}
                  className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-weha-border text-weha-text hover:border-weha-teal hover:text-weha-teal transition-colors"
                  data-cursor="hover"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => scrollPains(1)}
                  className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-weha-border text-weha-text hover:border-weha-teal hover:text-weha-teal transition-colors"
                  data-cursor="hover"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </Reveal>
          <div
            ref={painsRef}
            className="mt-12 flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory -mx-5 px-5 sm:-mx-8 sm:px-8 pb-2"
          >
            {pains.map((p, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[82vw] sm:w-[340px] md:w-[360px]"
              >
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <div className="glass rounded-2xl p-7 h-full" data-cursor="hover">
                    <span className="text-xs uppercase tracking-[0.2em] text-weha-faint">{p.label}</span>
                    <p className="mt-4 text-lg leading-relaxed text-weha-text">&ldquo;{p.quote}&rdquo;</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-12 weha-display text-2xl md:text-4xl text-weha-text max-w-3xl leading-snug">
              Different businesses. The same leak:{" "}
              <span className="italic text-weha-teal">hours going into work a system should do.</span>
            </p>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 4 · THE COST - agitation */}
      <ScrollSection direction="right" settle depth={0} intensity={0.35}>
      <section className="section-surface border-y border-weha-border py-24 md:py-32" data-testid="section-cost">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">The real cost</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">Small leaks. Serious math.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-weha-muted max-w-xl leading-relaxed">
              A few hours here, a couple of people there. Slide to see what the manual work adds up
              to in a year.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-10">
              <CostSlider footnote="Based on your inputs. Most teams underestimate by half." />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-12 weha-display text-2xl md:text-4xl text-weha-text max-w-3xl leading-snug">
              That is not a software problem. That is a{" "}
              <span className="italic text-weha-teal">systems problem.</span> And systems can be fixed.
            </p>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 5 · THE FLOW - flagship, over the network */}
      <ScrollSection direction="left" settle depth={0.7} intensity={0.5}>
      <section className="relative section-glass py-24 md:py-32" data-testid="section-flow">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">See it work</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">Watch one workflow fix itself.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-weha-muted max-w-xl leading-relaxed">
              Pick a bottleneck. This is what it looks like after we automate it. The first business
              to answer usually wins the deal; these systems make sure that is you.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-8">
              <TabSwitch
                tabs={FLOWS.map((f) => ({ id: f.id, label: f.label }))}
                active={activeTab}
                onChange={setActiveTab}
              />
            </div>
          </Reveal>
          <div className="mt-14 md:mt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <FlowDiagram steps={activeFlow.steps} replayKey={activeTab} />
              </motion.div>
            </AnimatePresence>
          </div>
          <Reveal delay={0.1}>
            <p className="mt-14 text-weha-muted max-w-2xl leading-relaxed">
              Every flow above runs on your existing tools. Nothing to rip out, nothing new to learn.
            </p>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 7 · SERVICES */}
      <ScrollSection direction="left" settle depth={0.6} intensity={0.45}>
      <section className="section-solid relative py-24 md:py-32" data-testid="section-services">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Ways to work with us</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">Start free. Scale when it proves itself.</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {/* Card 1 - the free audit */}
            <Reveal>
              <div className="weha-card p-7 h-full flex flex-col" data-cursor="hover">
                <span className="self-start rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                  Start here · Free
                </span>
                <h3 className="weha-display text-2xl mt-5 text-weha-text">The AI Audit</h3>
                <p className="mt-3 text-weha-muted leading-relaxed flex-1">
                  A 90-minute working session. We map your three most automatable workflows and
                  build one live on the call. You leave with a prioritized plan whether you hire us
                  or not.
                </p>
                <div className="mt-6">
                  <Magnetic>
                    <button type="button" onClick={openBooking} className="btn-teal" data-cursor="hover">
                      Book the audit <ArrowRight size={15} />
                    </button>
                  </Magnetic>
                </div>
              </div>
            </Reveal>
            {/* Card 2 - the build sprint */}
            <Reveal delay={0.08}>
              <div className="weha-card p-7 h-full flex flex-col" data-cursor="hover">
                <span className="self-start rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                  Fixed scope
                </span>
                <h3 className="weha-display text-2xl mt-5 text-weha-text">The Build Sprint</h3>
                <p className="mt-3 text-weha-muted leading-relaxed flex-1">
                  We take the workflows from your audit and ship them as working automations. Scoped
                  and priced before we start, so there are no surprise invoices.
                </p>
              </div>
            </Reveal>
            {/* Card 3 - the automation partner */}
            <Reveal delay={0.16}>
              <div className="weha-card p-7 h-full flex flex-col" data-cursor="hover">
                <span className="self-start rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                  Ongoing
                </span>
                <h3 className="weha-display text-2xl mt-5 text-weha-text">The Automation Partner</h3>
                <p className="mt-3 text-weha-muted leading-relaxed flex-1">
                  We keep your systems running, catch what breaks before you notice, and keep
                  finding the next thing worth automating as you grow.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 8 · WHO THIS IS FOR */}
      <ScrollSection direction="right" settle depth={0} intensity={0.35}>
      <section className="section-glass relative section-surface border-y border-weha-border py-24 md:py-32" data-testid="section-who">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Who this is for</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">Built for digital-first businesses.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-weha-muted max-w-xl leading-relaxed">
              If your leads, sales and delivery already happen online, automation compounds fastest.
              That is where we play.
            </p>
          </Reveal>

          {/* Animated business-area pills */}
          <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
            {whoPills.map((label, i) => (
              <motion.span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-weha-border bg-weha-surface px-4 py-2 text-sm font-medium text-weha-text cursor-default"
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                whileHover={{
                  scale: 1.06,
                  borderColor: "var(--weha-teal)",
                  color: "var(--weha-teal)",
                }}
                data-cursor="hover"
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ background: "var(--weha-teal)" }}
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 2.4 + (i % 4) * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {label}
              </motion.span>
            ))}
          </div>

          <div className="mt-12 flex md:grid md:grid-cols-2 gap-5 overflow-x-auto md:overflow-visible hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
            {industries.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.08}>
                <motion.div
                  className="weha-card p-7 min-w-[78vw] sm:min-w-[340px] md:min-w-0 h-full"
                  data-cursor="hover"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
                    style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}
                  >
                    {v.tag}
                  </span>
                  <h3 className="weha-display text-2xl mt-4 text-weha-text">{v.title}</h3>
                  <p className="mt-4 text-weha-muted leading-relaxed">{v.body}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-6 rounded-2xl border border-dashed border-weha-border p-6 md:p-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-weha-muted leading-relaxed max-w-2xl">
                A different business? The bottlenecks rhyme. If it is manual and it repeats, we can
                probably automate it.
              </p>
              <button type="button" onClick={openBooking} className="btn-ghost shrink-0" data-cursor="hover">
                Book the free audit <ArrowRight size={15} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 9 · PROOF - dogfooding, over the network */}
      <ScrollSection direction="left" settle depth={0.7} intensity={0.5}>
      <section className="relative section-glass py-24 md:py-32" data-testid="section-proof">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Proof, not promises</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">This website is the demo.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-weha-muted max-w-xl leading-relaxed">
              When you book an audit here, no human lifts a finger. Our own automations do the work:
            </p>
          </Reveal>
          <div className="mt-14 md:mt-16">
            <FlowDiagram steps={proofSteps} autoPlay />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-14 weha-display text-2xl md:text-3xl text-weha-text max-w-3xl leading-snug">
              We did not hire anyone to run this. We automated it.{" "}
              <span className="italic text-weha-teal">That is the point.</span>
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 text-weha-muted leading-relaxed max-w-2xl">
              The systems we sell are the systems we run on.
            </p>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 10 · WHY WEHA - dark moment (strongest entrance) */}
      <ScrollSection direction="right" settle depth={1} intensity={0.6}>
      <section className="section-glass relative py-28 md:py-40 overflow-hidden" style={{ background: "#171614", "--weha-bg": "#171614", "--weha-text": "#f7f6f2" }}>
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{ background: "radial-gradient(circle at 75% 50%, rgba(155,128,224,0.30), transparent 55%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid gap-14 md:grid-cols-2 md:gap-20 md:items-center">
            <Reveal>
              <h2 className="weha-display text-4xl md:text-6xl text-[#f7f6f2] leading-[1.05]">
                Not a freelancer. Not a big agency.{" "}
                <span className="italic" style={{ color: "#9b80e0" }}>Better placed than both.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div>
                <p className="text-lg text-[#e9e6df] leading-relaxed max-w-xl">
                  A freelancer connects two tools and calls it done. A big agency quotes a six-month
                  roadmap with a retainer to match. We sit in between: engineered properly, shipped
                  in days, and owned entirely by you.
                </p>
                <ul className="mt-8 space-y-7">
                  {whyWeha.map((t, i) => (
                    <li key={i} className="flex gap-4">
                      <span style={{ color: "#9b80e0" }} className="text-xl leading-none mt-1">✦</span>
                      <span className="text-lg text-[#e9e6df] leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          {/* Proof row */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <p className="weha-display text-4xl md:text-5xl text-[#9b80e0]">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[#c9c5bd]">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 11 · FAQ */}
      <ScrollSection direction="left" settle depth={0} intensity={0.3}>
      <section className="section-solid relative py-24 md:py-32" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Straight answers</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">The questions everyone actually asks.</h2>
          </Reveal>
          <div className="mt-12">
            {faqs.map((item, i) => {
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

      {/* SECTION 12 · CTA BANNER */}
      <ScrollSection direction="right" settle depth={0.35} intensity={0.45}>
      <section className="section-glass section-solid px-5 sm:px-8 pb-24">
        <div className="max-w-7xl mx-auto rounded-3xl px-8 py-16 md:px-16 md:py-24 relative overflow-hidden" style={{ background: "var(--weha-teal)" }}>
          <Reveal>
            <h2 className="weha-display text-4xl md:text-6xl text-white max-w-3xl leading-[1.05]">
              See your first automation built in 90 minutes.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-white/85 text-lg max-w-2xl leading-relaxed">
              Book a free AI Audit. We will map your top three workflows and build one live on the
              call. No pitch deck, no obligation.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Magnetic>
              <button
                type="button"
                onClick={openBooking}
                data-testid="home-banner-cta"
                data-cursor="hover"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-medium text-[var(--weha-teal)] transition-transform hover:-translate-y-0.5"
              >
                Book My Free Audit <ArrowUpRight size={17} />
              </button>
            </Magnetic>
          </Reveal>
        </div>
      </section>
      </ScrollSection>
    </div>
  );
}
