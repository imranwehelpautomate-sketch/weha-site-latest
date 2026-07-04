import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Plus,
  X,
  Lightbulb,
  AlertCircle,
  LayoutDashboard,
  Share2,
  Inbox,
  Database,
  Mail,
  Slack,
  CalendarClock,
  Sparkles,
  Search,
  PenLine,
  UserCheck,
  RefreshCw,
  ClipboardList,
  ListOrdered,
  FileText,
  CalendarCheck,
  Video,
  BellRing,
  Table,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import IntegrationStrip from "@/components/IntegrationStrip";
import Magnetic from "@/components/Magnetic";
import ValueCalculator from "@/components/ValueCalculator";
import FlowDiagram from "@/components/FlowDiagram";
import TabSwitch from "@/components/TabSwitch";
import Roadmap from "@/components/Roadmap";
import Seo from "@/components/Seo";
import { EASE } from "@/lib/motion";
import { useBooking } from "@/context/BookingContext";
import { ORG, SITE, breadcrumb, faqPage, graph } from "@/lib/seoSchemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ------------------------------------------------------------------ *
 * Automation ROI Calculator (Services hero).
 * Transparent multi-driver model: labor time plus error and rework
 * cost. Conservative realism factors are baked in: a 0.85 exception
 * factor (never assume full automation) and only ~60 percent of error
 * cost removed.
 * ------------------------------------------------------------------ */
const roiInputs = [
  {
    key: "people",
    label: "How many people work on this process?",
    options: [
      { label: "1", value: 1 },
      { label: "2 to 3", value: 2.5 },
      { label: "4 to 6", value: 5 },
      { label: "7 or more", value: 8 },
    ],
  },
  {
    key: "hoursEach",
    label: "Hours each spends on it per week?",
    options: [
      { label: "2", value: 2 },
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "20 or more", value: 20 },
    ],
  },
  {
    key: "rate",
    label: "Fully loaded hourly cost of that time?",
    options: [
      { label: "Junior", value: 20 },
      { label: "Mid", value: 35 },
      { label: "Senior", value: 55 },
      { label: "Specialist", value: 80 },
    ],
  },
  {
    key: "errorCost",
    label: "Rough monthly cost of mistakes and rework in this process?",
    options: [
      { label: "Minimal", value: 0 },
      { label: "Low", value: 200 },
      { label: "Moderate", value: 800 },
      { label: "High", value: 2500 },
    ],
  },
  {
    key: "processType",
    label: "What best describes the process?",
    options: [
      { label: "Data entry and admin", value: 0.8 },
      { label: "Chasing and follow-ups", value: 0.7 },
      { label: "Reporting and compiling", value: 0.8 },
      { label: "Reviewing and deciding", value: 0.5 },
    ],
  },
];

const computeRoi = (v) => {
  const weeklyHours = v.people * v.hoursEach;
  const automatableHours = weeklyHours * v.processType * 0.85; // 0.85 realism factor
  const annualHoursSaved = Math.round(automatableHours * 52);
  const laborValue = annualHoursSaved * v.rate;
  const errorValue = v.errorCost * 12 * 0.6; // automation removes ~60% of error cost
  const totalAnnualBenefit = Math.round(laborValue + errorValue);
  return {
    headline: `About ${annualHoursSaved.toLocaleString()} hours and ${totalAnnualBenefit.toLocaleString()} in value reclaimed per year.`,
    breakdown: [
      { label: "Hours reclaimed per year", value: annualHoursSaved.toLocaleString() },
      { label: "Labor value", value: Math.round(laborValue).toLocaleString() },
      { label: "Error and rework value", value: Math.round(errorValue).toLocaleString() },
      { label: "Total annual benefit", value: totalAnnualBenefit.toLocaleString() },
    ],
    note: "This combines time saved and reduced errors, the two biggest drivers most businesses miss. Figures are in your own currency. We applied a realism factor so this reflects what is achievable, not a perfect-world maximum.",
  };
};

/* ------------------------------------------------------------------ *
 * Section 2 data: the three pillars, led by outcome. Each pillar owns
 * a FlowDiagram whose steps swap when the tab changes.
 * ------------------------------------------------------------------ */
const pillars = [
  {
    id: "connect",
    label: "Connect your tools",
    subtitle: "Deterministic automation",
    intro:
      "When you know exactly what should happen every time. Rule-based, reliable, running quietly in the background.",
    steps: [
      { icon: Inbox, title: "Lead form submitted", caption: "Website or ad" },
      { icon: Database, title: "CRM updated", caption: "Contact created and tagged" },
      { icon: Mail, title: "Welcome email sent", caption: "Instantly, on-brand" },
      { icon: Slack, title: "Team notified", caption: "Right person, right channel" },
      { icon: CalendarClock, title: "Follow-up scheduled", caption: "Nothing slips" },
    ],
    looks: [
      "Lead capture and routing",
      "Data sync between apps",
      "Automated reports",
      "Notifications and reminders",
      "Document generation",
    ],
    builtLabel: "Built with",
    built: "n8n, Make, Zapier, Google Workspace and your existing app stack.",
  },
  {
    id: "ai",
    label: "Put AI to work",
    subtitle: "Agentic automation",
    intro:
      "When the task needs judgment, reading or decisions. AI agents that handle multi-step work end to end, not just fixed rules.",
    steps: [
      { icon: Inbox, title: "Message arrives", caption: "Email, DM or ticket" },
      { icon: Sparkles, title: "AI reads and understands", caption: "Intent, urgency, context" },
      { icon: Search, title: "Gathers what it needs", caption: "Pulls the right info" },
      { icon: PenLine, title: "Drafts a real response", caption: "In your voice" },
      { icon: UserCheck, title: "You approve or it sends", caption: "Your rules decide" },
      { icon: RefreshCw, title: "Follows through", caption: "Until the task is done" },
    ],
    looks: [
      "Inbox and ticket triage",
      "First-draft generation",
      "Research and summarization",
      "Multi-step task execution",
      "Autonomous follow-through",
    ],
    builtLabel: "Built with",
    built: "OpenClaw, Hermes, Claude and modern agent frameworks.",
  },
  {
    id: "plan",
    label: "Get a clear plan",
    subtitle: "Advisory and strategy",
    intro:
      "When you are not sure where AI even fits yet. Purely advisory. We help you see what to automate first and how to sequence it. We advise, we do not build, in this engagement.",
    steps: [
      { icon: ClipboardList, title: "We map how you work", caption: "The real workflows" },
      { icon: Search, title: "Spot the opportunities", caption: "Where AI actually pays off" },
      { icon: ListOrdered, title: "Prioritize by impact", caption: "Quick wins first" },
      { icon: FileText, title: "You get a roadmap", caption: "Documented, your team can act on it" },
    ],
    looks: [
      "AI readiness assessment",
      "Opportunity mapping",
      "Prioritization roadmap",
      "Tool and vendor guidance",
      "Team enablement",
    ],
    builtLabel: "You leave with",
    built: "A documented roadmap your team can act on, whether you build it with us or not.",
  },
];

// Section 3: plain-language situation mapped to a pillar.
/* ------------------------------------------------------------------ *
 * Section 4 data: "Who this is for", ported from Home.jsx.
 * stack logos: { name, slug } => /logos/{slug}.svg (or ext),
 * { name, domain } => favicon.
 * ------------------------------------------------------------------ */
const industries = [
  {
    tag: "Agencies",
    title: "Marketing & Creative Agencies",
    body: "Client reporting that writes itself. Onboarding that runs without the founder. More retainers on the same headcount.",
    useCase:
      "Agencies win on output and margin. We automate the repetitive delivery work: reporting, onboarding and content ops. The same team serves more clients without burning out or hiring ahead of revenue.",
    painpoints: [
      "Client reporting eats a full day every month, for every account.",
      "Onboarding still depends on the founder chasing logins and assets.",
      "Content and campaigns ship late because the tools do not talk to each other.",
      "No single view of what is due, live or overdue across every client.",
    ],
    departments: [
      "Client reporting & dashboards",
      "Onboarding & asset intake",
      "Content production & scheduling",
      "Campaign QA & approvals",
      "Billing & retainer tracking",
      "Lead nurture & pitches",
    ],
    stack: [
      { name: "HubSpot", slug: "hubspot" },
      { name: "Notion", slug: "notion" },
      { name: "Slack", slug: "slack" },
      { name: "Airtable", slug: "airtable" },
      { name: "Google Sheets", slug: "googlesheets" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
  {
    tag: "Recruitment",
    title: "Recruitment Agencies",
    body: "Candidate screening, CV formatting, interview scheduling and follow-ups, automated end to end. Great candidates get a reply in minutes, not days, so you place roles faster.",
    useCase:
      "Placement speed is everything. We automate sourcing admin, screening and scheduling so recruiters spend their day talking to people, not formatting CVs or copying data between systems.",
    painpoints: [
      "Hundreds of CVs to screen and reformat by hand for every role.",
      "Great candidates go cold before anyone finds time to reply.",
      "Interview scheduling is endless back-and-forth across calendars.",
      "The ATS is always out of date because every update is manual.",
    ],
    departments: [
      "Candidate sourcing & CV parsing",
      "Screening & shortlisting",
      "CV reformatting to your template",
      "Interview scheduling",
      "Candidate & client comms",
      "ATS / CRM hygiene",
    ],
    stack: [
      { name: "LinkedIn", domain: "linkedin.com" },
      { name: "Calendly", domain: "calendly.com" },
      { name: "Gmail", domain: "mail.google.com" },
      { name: "HubSpot", slug: "hubspot" },
      { name: "Slack", slug: "slack" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
  {
    tag: "Remote",
    title: "Work From Home & Remote Teams",
    body: "A workforce scattered across cities, sometimes across the globe. Automations keep everyone in sync so nothing gets lost between inboxes and no one waits on a colleague who is asleep.",
    useCase:
      "When your team is spread across cities, or even continents, coordination becomes the hidden tax. We wire your tools together so handoffs, approvals and status updates move on their own, and work keeps flowing while half the team sleeps.",
    painpoints: [
      "Work stalls for hours waiting on a colleague in another timezone.",
      "Status updates and approvals get buried in chat and email.",
      "No single source of truth for who owns what, right now.",
      "Managers lose hours stitching scattered updates into reports.",
    ],
    departments: [
      "Task & handoff routing",
      "Approvals & sign-offs",
      "Async status reporting",
      "Onboarding & IT access",
      "Meeting notes & follow-ups",
      "Timezone coordination",
    ],
    stack: [
      { name: "Slack", slug: "slack" },
      { name: "Notion", slug: "notion" },
      { name: "Google Calendar", domain: "calendar.google.com" },
      { name: "Zoom", domain: "zoom.us" },
      { name: "Zapier", slug: "zapier" },
      { name: "Gmail", domain: "mail.google.com" },
    ],
  },
  {
    tag: "Real Estate",
    title: "Real Estate",
    body: "New enquiries answered instantly, viewings booked, listings kept in sync and follow-ups nurtured on their own. Every lead worked around the clock while you focus on closing.",
    useCase:
      "In property, the first agent to respond usually wins the listing or the buyer. We make sure that is you: instant replies, booked viewings, synced listings and follow-ups that never let a warm lead go cold.",
    painpoints: [
      "Enquiries arrive after hours and get answered far too late.",
      "Listings drift out of sync across portals and the website.",
      "Viewings are a scheduling headache across buyers and owners.",
      "Follow-up stops after the first call, so leads quietly slip away.",
    ],
    departments: [
      "Enquiry response & routing",
      "Viewing scheduling",
      "Listing sync across portals",
      "Lead nurture & drip",
      "Document & contract prep",
      "CRM & pipeline updates",
    ],
    stack: [
      { name: "WhatsApp", slug: "whatsapp" },
      { name: "HubSpot", slug: "hubspot" },
      { name: "Calendly", domain: "calendly.com" },
      { name: "DocuSign", domain: "docusign.com" },
      { name: "Gmail", domain: "mail.google.com" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
  {
    tag: "Online",
    title: "Online Businesses",
    body: "Orders, support, reviews and retention flows running 24/7. The revenue playbook you keep meaning to run, finally on autopilot.",
    useCase:
      "If your storefront runs online, revenue leaks quietly: unanswered messages, missed follow-ups, reviews never requested. We put the whole retention and support playbook on autopilot so nothing worth money slips through.",
    painpoints: [
      "Customer messages pile up across channels and get missed.",
      "Post-purchase follow-ups and review requests never get sent.",
      "Refunds, FAQs and order questions eat the team's whole day.",
      "No time to run the retention flows you already planned.",
    ],
    departments: [
      "Multi-channel support triage",
      "Order & delivery updates",
      "Reviews & UGC requests",
      "Retention & win-back flows",
      "FAQ & self-serve deflection",
      "Reporting & KPIs",
    ],
    stack: [
      { name: "WhatsApp", slug: "whatsapp" },
      { name: "Stripe", domain: "stripe.com" },
      { name: "Zendesk", domain: "zendesk.com" },
      { name: "Slack", slug: "slack" },
      { name: "Zapier", slug: "zapier" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
  {
    tag: "Ecommerce",
    title: "Ecommerce & D2C Brands",
    body: "Abandoned carts chased, reviews requested, support triaged. The revenue playbook, finally running 24/7.",
    useCase:
      "D2C margins live and die on repeat purchases. We automate the revenue plays: abandoned carts, reviews, support and win-backs. Your store sells around the clock without a bigger team.",
    painpoints: [
      "Abandoned carts are never chased consistently.",
      "Support tickets spike during launches and overwhelm the team.",
      "Reviews and UGC are left on the table.",
      "Win-back and loyalty flows exist only on paper.",
    ],
    departments: [
      "Abandoned cart recovery",
      "Support & returns triage",
      "Reviews & loyalty",
      "Post-purchase upsell",
      "Inventory & fulfilment alerts",
      "Marketing reporting",
    ],
    stack: [
      { name: "Shopify", domain: "shopify.com" },
      { name: "Stripe", domain: "stripe.com" },
      { name: "Mailchimp", domain: "mailchimp.com" },
      { name: "WhatsApp", slug: "whatsapp" },
      { name: "Zapier", slug: "zapier" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
  {
    tag: "SaaS",
    title: "SaaS & Tech Startups",
    body: "Every trial signup and demo request answered in minutes. Your pipeline updates itself while you ship product.",
    useCase:
      "For SaaS, speed to lead and time-to-value decide growth. We automate trial onboarding, lead response and health tracking so activation goes up and churn signals surface before it is too late.",
    painpoints: [
      "Demo and trial signups wait too long for a first reply.",
      "Onboarding is one-size-fits-all, so activation lags.",
      "At-risk accounts churn quietly with no early warning.",
      "The pipeline and CRM are always slightly out of date.",
    ],
    departments: [
      "Lead response & routing",
      "Trial onboarding sequences",
      "Product-usage tracking",
      "Churn / at-risk alerts",
      "Pipeline & CRM sync",
      "Customer comms",
    ],
    stack: [
      { name: "HubSpot", slug: "hubspot" },
      { name: "Slack", slug: "slack" },
      { name: "Stripe", domain: "stripe.com" },
      { name: "Intercom", domain: "intercom.com" },
      { name: "GitHub", slug: "github" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
  {
    tag: "Consultants",
    title: "Coaches, Consultants & Online Services",
    body: "Discovery calls booked, no-shows reminded, follow-ups sent. You sell and deliver; the admin runs itself.",
    useCase:
      "Your time is the product. We automate everything around the session: booking, reminders, intake, follow-ups and content. You spend your hours delivering, not doing admin.",
    painpoints: [
      "Discovery calls turn into a scheduling ping-pong match.",
      "No-shows quietly kill the calendar and the revenue.",
      "Intake forms and prep are chased manually every single time.",
      "Follow-up and nurture stop the moment a call ends.",
    ],
    departments: [
      "Discovery & session booking",
      "Reminders & no-show reduction",
      "Client intake & prep",
      "Follow-up & nurture",
      "Content & newsletter",
      "Payments & invoicing",
    ],
    stack: [
      { name: "Calendly", domain: "calendly.com" },
      { name: "Zoom", domain: "zoom.us" },
      { name: "Stripe", domain: "stripe.com" },
      { name: "Typeform", domain: "typeform.com" },
      { name: "Gmail", domain: "mail.google.com" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
];

// Renders a brand logo for the tech-stack grid. Uses a local SVG/PNG when a
// slug is given, otherwise falls back to the Google favicon service by domain.
const stackFavicon = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

function StackLogo({ name, slug, domain, ext = "svg" }) {
  const src = domain
    ? stackFavicon(domain)
    : `${process.env.PUBLIC_URL || ""}/logos/${slug}.${ext}`;
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-weha-border bg-weha-surface px-3.5 py-2">
      <img
        src={src}
        alt={`${name} logo`}
        className="h-5 w-5 object-contain rounded-sm"
        loading="lazy"
        decoding="async"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
      <span className="text-sm font-medium text-weha-text whitespace-nowrap">{name}</span>
    </div>
  );
}

// Section 5: how an engagement works (Audit to Build to Deliver to Support).
const engagement = [
  {
    num: "01",
    name: "Audit",
    meta: "90 minutes, free",
    body: "A working session, not a sales call. We map your three most automatable workflows and build one live while you watch. You leave with a prioritized plan whether you hire us or not.",
  },
  {
    num: "02",
    name: "Build",
    meta: "days, not months",
    body: "We build your highest-impact workflow first, on the tools you already use, and test it against real data before anything goes live. Scoped and priced before we start, so there are never surprise invoices.",
  },
  {
    num: "03",
    name: "Deliver",
    meta: "you own it",
    body: "We hand over working systems with plain-English documentation. The code, the accounts and the docs are yours. If you stopped working with us tomorrow, everything keeps running.",
  },
  {
    num: "04",
    name: "Support",
    meta: "we stay reachable",
    body: "Automations drift, APIs change, things break quietly. Every build ships with 30 days of support, and we are one message away after that. You are never left stranded with a system you cannot fix.",
  },
];

// Section 6: the booking flow that runs this very site.
const proofSteps = [
  { icon: CalendarCheck, title: "You pick a slot", caption: "Live availability" },
  { icon: Database, title: "Lead saved", caption: "Into our database" },
  { icon: Video, title: "Meet link created", caption: "Automatically" },
  { icon: Mail, title: "Confirmation sent", caption: "Branded and instant" },
  { icon: BellRing, title: "Reminders queued", caption: "24 hours and 1 hour before" },
  { icon: Table, title: "Records updated", caption: "Zero typing" },
];

// Section 7: FAQ.
const faqs = [
  [
    "Do I have to switch tools or software?",
    "No. We build on top of what you already use, including the spreadsheets. If something genuinely cannot connect, you will know at the audit, not after you have paid.",
  ],
  [
    "What happens when an automation breaks or drifts?",
    "It is handled. Everything ships with documentation and 30 days of support, and we stay reachable after that. You will never be stuck with a black box you cannot fix.",
  ],
  [
    "What is the difference between the three?",
    "Connect your tools follows fixed rules reliably. Put AI to work handles tasks needing judgment. Get a clear plan is advice only. We recommend the right fit for each workflow, and often it is a mix.",
  ],
  [
    "Can you just advise, without building?",
    "Yes. The advisory track gives you a roadmap with no build attached. No pressure to continue.",
  ],
  [
    "How fast do we see something working?",
    "Often a working demo in the first session. Most first automations are live in days, not months.",
  ],
  [
    "How do we start?",
    "Book the free AI Audit. We map your workflows and show you what is worth automating first.",
  ],
];

export default function Services() {
  const { openBooking } = useBooking();

  // Section 2: which pillar tab is active.
  const [activeTab, setActiveTab] = useState(pillars[0].id);
  const activePillar = pillars.find((p) => p.id === activeTab) || pillars[0];

  // Section 4: index of the expanded industry (null = closed).
  const [expandedIndustry, setExpandedIndustry] = useState(null);
  // While the industry modal is open, lock body scroll and close on Escape.
  useEffect(() => {
    if (expandedIndustry === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setExpandedIndustry(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [expandedIndustry]);

  return (
    <div data-testid="services-page" className="overflow-x-hidden">
      <Seo
        title="AI Automation Services"
        description="Three ways WeHA fixes what slows you down: connect your tools with deterministic automation, put AI to work with agents, or get a clear advisory roadmap."
        path="/services"
        jsonLd={graph([
          ORG,
          {
            "@type": "ItemList",
            name: "WeHA AI automation services",
            itemListElement: [
              {
                name: "Connect your tools",
                description:
                  "Deterministic, rule-based automation that moves data and triggers actions across the tools you already use.",
              },
              {
                name: "Put AI to work",
                description:
                  "Agentic AI that reads, decides and completes multi-step tasks that need judgment, end to end.",
              },
              {
                name: "Get a clear plan",
                description:
                  "Advisory only. A clear roadmap for where AI fits, what to automate first, and how to sequence it.",
              },
            ].map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Service",
                name: s.name,
                description: s.description,
                serviceType: s.name,
                provider: { "@id": `${SITE}/#organization` },
              },
            })),
          },
          faqPage(faqs),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ])}
      />

      {/* SECTION 1 · HERO */}
      <PageHero
        kicker="Services"
        title="Automation that fixes"
        italicWord="what is actually slowing you down."
        subtitle="We start with your bottleneck, not our tech stack. Then we build the smallest system that removes it, on the tools you already use. Three ways to work with us, one goal: your team stops doing work a system should."
        showForm={false}
        rightSlot={
          <ValueCalculator
            title="Automation ROI Calculator"
            intro="See the real annual value of automating one of your manual processes. Most businesses undercount this by looking only at time saved."
            accentNote="Hourly cost and error cost are in your own currency, no symbol needed."
            inputs={roiInputs}
            compute={computeRoi}
            source="calculator:services"
            testid="services-roi-calculator"
          />
        }
      />

      <IntegrationStrip heading="Plays nice with your whole toolbox" />

      {/* SECTION 2 · THE THREE PILLARS */}
      <ScrollSection direction="left" settle depth={0.6} intensity={0.5}>
      <section className="section-glass relative py-24 md:py-32" data-testid="services-pillars">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">What we build</span>
            <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-3xl">
              Three types of automation services. We recommend the one you actually need
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">
              <TabSwitch
                tabs={pillars.map((p) => ({ id: p.id, label: p.label }))}
                active={activeTab}
                onChange={setActiveTab}
              />
            </div>
          </Reveal>

          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-weha-faint">
                  {activePillar.subtitle}
                </p>
                <p className="mt-3 text-lg text-weha-muted max-w-2xl leading-relaxed">
                  {activePillar.intro}
                </p>

                <div className="mt-10">
                  <FlowDiagram steps={activePillar.steps} replayKey={activeTab} />
                </div>

                <div className="mt-14 grid gap-8 md:gap-12 md:grid-cols-2">
                  <div>
                    <p className="weha-label">What it looks like</p>
                    <ul className="mt-3 space-y-2.5">
                      {activePillar.looks.map((g) => (
                        <li key={g} className="flex gap-3 text-weha-text leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--weha-teal)" }} />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="weha-label">{activePillar.builtLabel}</p>
                    <p className="mt-3 text-weha-muted leading-relaxed">{activePillar.built}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 4 · WHO THIS IS FOR (ported from Home) */}
      <ScrollSection direction="right" settle depth={0} intensity={0.35}>
      <section className="section-glass relative section-surface border-y border-weha-border py-24 md:py-32" data-testid="section-who">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Who we build for</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">Built for digital-first businesses.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-weha-muted max-w-xl leading-relaxed">
              If your leads, sales and delivery already happen online, automation compounds fastest.
              That is where we play.
            </p>
          </Reveal>

          {/* Grid of industry cards. Clicking a card opens a centered modal
              that grows into view over a dimmed page. */}
          <div className="mt-12">
            <div className="flex md:grid md:grid-cols-2 gap-5 overflow-x-auto md:overflow-visible hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
              {industries.map((v, i) => (
                <Reveal key={v.title} delay={(i % 2) * 0.06}>
                  <motion.div
                    onClick={() => setExpandedIndustry(i)}
                    className="weha-card p-7 min-w-[78vw] sm:min-w-[340px] md:min-w-0 h-full flex flex-col cursor-pointer"
                    data-cursor="hover"
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    data-testid={`industry-card-${i}`}
                  >
                    <span
                      className="self-start inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
                      style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}
                    >
                      {v.tag}
                    </span>
                    <h3 className="weha-display text-2xl mt-4 text-weha-text">{v.title}</h3>
                    <p className="mt-4 text-weha-muted leading-relaxed flex-1">{v.body}</p>
                    <div className="mt-6">
                      <span className="btn-ghost" data-cursor="hover" data-testid={`industry-expand-${i}`}>
                        Expand <Plus size={15} />
                      </span>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-weha-border p-6 md:p-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-weha-muted leading-relaxed max-w-2xl">
                A different business? The bottlenecks rhyme. If it is manual and it repeats, we can
                probably automate it.
              </p>
              <button type="button" onClick={openBooking} className="btn-ghost shrink-0" data-cursor="hover">
                Book the free audit <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Centered, viewport-fixed modal (portaled outside the transformed
              section so it always sits dead-center, no scrolling needed). */}
          {createPortal(
            <AnimatePresence>
              {expandedIndustry !== null && [
                <motion.div
                  key="who-backdrop"
                  className="fixed inset-0 z-[120] backdrop-blur-sm"
                  style={{ background: "color-mix(in srgb, var(--weha-bg) 74%, transparent)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE } }}
                  transition={{ duration: 0.35, ease: EASE }}
                  onClick={() => setExpandedIndustry(null)}
                />,
                <motion.div
                  key="who-panel-wrap"
                  className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8, y: 28 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 12, transition: { duration: 0.28, ease: EASE } }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <div
                    className="weha-card w-full max-w-4xl max-h-[88vh] overflow-y-auto p-7 md:p-10 pointer-events-auto shadow-2xl"
                    data-testid="industry-detail"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
                          style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}
                        >
                          {industries[expandedIndustry].tag}
                        </span>
                        <h3 className="weha-display text-3xl md:text-4xl mt-4 text-weha-text">
                          {industries[expandedIndustry].title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedIndustry(null)}
                        aria-label="Close"
                        className="shrink-0 inline-flex items-center gap-2 rounded-full border border-weha-border px-4 py-2 text-sm text-weha-muted hover:text-weha-text hover:border-weha-teal transition-colors"
                        data-cursor="hover"
                        data-testid="industry-detail-close"
                      >
                        <X size={16} /> Close
                      </button>
                    </div>

                    <div className="mt-8 grid gap-9 md:gap-10 md:grid-cols-2">
                      {/* Business use case */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                            <Lightbulb size={16} />
                          </span>
                          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-weha-faint">Business use case</h4>
                        </div>
                        <p className="mt-4 text-weha-muted leading-relaxed">{industries[expandedIndustry].useCase}</p>
                      </div>

                      {/* Painpoints */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                            <AlertCircle size={16} />
                          </span>
                          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-weha-faint">Painpoints we fix</h4>
                        </div>
                        <ul className="mt-4 space-y-3">
                          {industries[expandedIndustry].painpoints.map((p) => (
                            <li key={p} className="flex gap-3 text-weha-muted leading-relaxed">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--weha-teal)" }} />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Departments / processes */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                            <LayoutDashboard size={16} />
                          </span>
                          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-weha-faint">Processes we automate</h4>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {industries[expandedIndustry].departments.map((d) => (
                            <span key={d} className="rounded-lg border border-weha-border bg-weha-surface px-3 py-1.5 text-sm text-weha-text">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tech stack */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                            <Share2 size={16} />
                          </span>
                          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-weha-faint">Typical tech stack</h4>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {industries[expandedIndustry].stack.map((s) => (
                            <StackLogo key={s.name} {...s} />
                          ))}
                        </div>

                        {/* CTA kept here (below the logos) so it stays visible
                            without scrolling to the very bottom of the modal. */}
                        <div className="mt-7">
                          <Magnetic>
                            <button
                              type="button"
                              onClick={() => {
                                setExpandedIndustry(null);
                                openBooking();
                              }}
                              className="btn-teal"
                              data-cursor="hover"
                              data-testid="industry-book-audit"
                            >
                              Book Free Audit <ArrowRight size={15} />
                            </button>
                          </Magnetic>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>,
              ]}
            </AnimatePresence>,
            document.body
          )}
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 5 · HOW AN ENGAGEMENT WORKS */}
      <ScrollSection direction="left" settle depth={0.5} intensity={0.4}>
      <section className="section-solid relative py-24 md:py-32" data-testid="services-how">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">How it works</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">From first call to fully handed off.</h2>
          </Reveal>
          <div className="mt-16">
            <Roadmap steps={engagement} />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-14 text-weha-muted leading-relaxed max-w-3xl">
              How we price: the audit is free, builds are scoped and quoted before we start. If a
              workflow is not worth automating, we will tell you.
            </p>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 6 · PROOF, THIS SITE IS THE DEMO */}
      <ScrollSection direction="right" settle depth={0.6} intensity={0.45}>
      <section className="relative section-glass py-24 md:py-32" data-testid="services-proof">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Proof, not promises</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">You are already watching us work.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-weha-muted max-w-2xl leading-relaxed">
              The audit you can book on this site runs on the exact automations we sell. No human
              touches it:
            </p>
          </Reveal>
          <div className="mt-14 md:mt-16">
            <FlowDiagram steps={proofSteps} autoPlay />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-14 weha-display text-2xl md:text-3xl text-weha-text max-w-3xl leading-snug">
              We do not just build these systems. We <span className="italic text-weha-teal">run on them.</span>
            </p>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 7 · FAQ */}
      <ScrollSection direction="left" settle depth={0} intensity={0.3}>
      <section className="section-solid relative py-24 md:py-32" data-testid="services-faq">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Straight answers</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">The questions everyone actually asks.</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <Accordion type="single" collapsible className="mt-8" data-testid="services-faq-accordion">
              {faqs.map(([q, a], i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-weha-border">
                  <AccordionTrigger
                    className="text-left text-lg text-weha-text hover:text-weha-teal hover:no-underline"
                    data-testid={`services-faq-trigger-${i}`}
                  >
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-weha-muted text-base leading-relaxed">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 8 · CTA BANNER */}
      <ScrollSection direction="left">
      <CTABanner
        heading="Not sure where to start? Let's map it out together."
        sub="Book a free AI Audit. We map how you work, then show you what is worth automating first."
        cta="Book a Free Audit"
        testid="services-cta"
      />
      </ScrollSection>
    </div>
  );
}
