import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  Workflow,
  Compass,
  Check,
  ShieldCheck,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import IntegrationStrip from "@/components/IntegrationStrip";
import Magnetic from "@/components/Magnetic";
import ValueCalculator from "@/components/ValueCalculator";
import FlowDiagram from "@/components/FlowDiagram";
import Roadmap from "@/components/Roadmap";
import Seo from "@/components/Seo";
import { EASE } from "@/lib/motion";
import { useBooking } from "@/context/BookingContext";
import { ORG, WEBSITE, SITE, breadcrumb, webPage, faqPage, graph } from "@/lib/seoSchemas";
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
 * Section 2 data: the three service cards, always fully open, click to focus.
 * ------------------------------------------------------------------ */
const serviceCards = [
  {
    icon: Workflow,
    name: "Deterministic Automation",
    tagline: "Connect your tools so they finally talk to each other.",
    description:
      "Rule based, reliable automations that move data and trigger actions between the apps you already use. Predictable, fast to deploy, and running quietly in the background so your team stops doing it by hand.",
    looks: [
      "Lead capture and routing",
      "Data sync between apps",
      "Automated reports",
      "Notifications and reminders",
      "Document generation",
    ],
    footLabel: "Built with",
    foot: "n8n, Make, Zapier, Google Workspace and your existing app stack.",
  },
  {
    icon: Sparkles,
    name: "Agentic Automation | AI Workforce",
    tagline: "AI that reasons, decides, and gets work done on its own.",
    description:
      "Custom AI agents that handle tasks needing judgment. They read and respond, triage, draft, and make multi step decisions end to end, instead of just following fixed rules.",
    looks: [
      "Inbox and ticket triage",
      "First draft generation",
      "Research and summarization",
      "Multi step task execution",
      "Autonomous follow through",
    ],
    footLabel: "Built with",
    foot: "OpenClaw, Hermes, Claude and modern agent frameworks.",
    cta: { label: "Explore AI Workforce", to: "/ai-workforce" },
  },
  {
    icon: Compass,
    name: "Advisory & Strategic Consulting",
    tagline: "A clear AI roadmap, without the guesswork.",
    description:
      "Purely advisory. We help you understand where AI fits in your business, what to automate first, how to sequence it, and how to avoid expensive mistakes. This is consulting and strategy only. We advise, we do not build, in this engagement.",
    looks: [
      "AI readiness assessment",
      "Opportunity mapping",
      "Prioritization roadmap",
      "Tool and vendor guidance",
      "Team enablement",
    ],
    footLabel: "You leave with",
    foot: "A documented roadmap your team can act on, whether you build it with us or not.",
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
    title: "Coaches, Consultants & Online Businesses",
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
  {
    tag: "FinTech & BFSI",
    title: "FinTech, Banking & Insurance",
    body: "Onboarding, KYC checks, reconciliation and compliance reporting, handled automatically. Faster approvals, cleaner audit trails, and a team freed from copy-pasting between systems.",
    useCase:
      "In financial services, speed and accuracy both matter and manual work costs you on each one. We automate KYC and onboarding, transaction reconciliation and compliance reporting, with a human kept in the loop wherever judgment or regulation demands it.",
    painpoints: [
      "KYC and onboarding checks are slow, manual and easy to get wrong.",
      "Reconciliation across accounts and systems eats analyst hours.",
      "Compliance and regulatory reports are assembled by hand every cycle.",
      "Customer queries about payments and applications pile up unanswered.",
    ],
    departments: [
      "KYC / AML & onboarding",
      "Transaction reconciliation",
      "Compliance & regulatory reporting",
      "Fraud & risk alerts",
      "Customer support triage",
      "Loan & claims processing",
    ],
    stack: [
      { name: "Plaid", domain: "plaid.com" },
      { name: "Stripe", domain: "stripe.com" },
      { name: "Salesforce", domain: "salesforce.com" },
      { name: "DocuSign", domain: "docusign.com" },
      { name: "Slack", slug: "slack" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
  {
    tag: "Healthcare",
    title: "Medical & Healthcare",
    body: "Patient intake, scheduling, reminders and records updates, running on their own. Less time on admin, more time on care, with sensitive data handled carefully.",
    useCase:
      "Clinics and healthcare teams lose hours to admin that has nothing to do with care. We automate patient intake, scheduling, reminders and records updates, keeping sensitive data secure and a human in the loop for anything clinical.",
    painpoints: [
      "Patient intake and forms are collected and re-keyed by hand.",
      "No-shows drain the calendar because reminders go out inconsistently.",
      "Records and referrals are updated manually across systems.",
      "Front-desk staff drown in scheduling calls and follow-ups.",
    ],
    departments: [
      "Patient intake & forms",
      "Appointment scheduling",
      "Reminders & no-show reduction",
      "Records & referral updates",
      "Billing & insurance prep",
      "Follow-up & recall",
    ],
    stack: [
      { name: "Calendly", domain: "calendly.com" },
      { name: "Twilio", domain: "twilio.com" },
      { name: "Google Workspace", domain: "workspace.google.com" },
      { name: "DocuSign", domain: "docusign.com" },
      { name: "Zapier", slug: "zapier" },
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
    meta: "30 MINUTES, free",
    body: "A conversation, not a sales call. We map your most automatable workflows and maybe build one live while you watch. You leave with a prioritized plan whether you hire us or not.",
    chip: "You keep the workflow map either way.",
  },
  {
    num: "02",
    name: "Build",
    meta: "days, not months",
    body: "We build your highest-impact workflow first, on the tools you already use, and test it against real data before anything goes live. Scoped and priced before we start, so there are never surprise invoices.",
    chip: "Most first automations live within the first week.",
  },
  {
    num: "03",
    name: "Deliver",
    meta: "you own it",
    body: "We hand over working systems with plain-English documentation. The code, the accounts and the docs are yours. If you stopped working with us tomorrow, everything keeps running.",
    chip: "Code, accounts and docs transferred to you at handoff.",
  },
  {
    num: "04",
    name: "Support",
    meta: "we stay reachable",
    body: "Automations drift, APIs change, things break quietly. Every build ships with 30 days of support, and we are one message away after that. You are never left stranded with a system you cannot fix.",
    chip: "30 days included, then one message away.",
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
  { icon: Search, title: "Lead enrichment", caption: "Company + contact data" },
  { icon: Sparkles, title: "AI-assisted pain point discovery", caption: "Surfaced automatically" },
  { icon: ClipboardList, title: "Account manager's brief", caption: "Ready before the call" },
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

/* ------------------------------------------------------------------ *
 * Section 3.5: "Systems We Help Automate".
 * Six automation systems. Cards expand into a centered modal (same
 * pattern as "Who we build for") with six sub-sections, including an
 * animated milestone FlowDiagram (same component as "Proof, not
 * promises"). Content is plain-English and conversion-led.
 * ------------------------------------------------------------------ */
const systems = [
  {
    icon: PenLine,
    tag: "Marketing",
    title: "Marketing & Content Automation",
    body: "Turn one idea into a week of content, published everywhere, on schedule. Your brand stays visible without anyone babysitting a calendar.",
    whatWeAutomate: [
      "One long piece repurposed into posts, emails and short clips",
      "Scheduling and publishing across every social channel",
      "Email and newsletter campaigns that send themselves",
      "Campaign performance pulled into one live dashboard",
    ],
    howWeAutomate: [
      "We connect your content tools so a single brief fans out into every format automatically.",
      "AI drafts on-brand copy and captions; a human approves before anything goes live.",
      "Approved content queues itself and publishes on the schedule you set.",
    ],
    timeline: "First automation live in days. Full content engine running in about a week.",
    trust: "Realistic timelines, real deliverables, reviewed together at every stage.",
    milestones: [
      { icon: Lightbulb, title: "Brief in", caption: "One idea or long piece" },
      { icon: Sparkles, title: "AI drafts", caption: "On-brand, every format" },
      { icon: UserCheck, title: "You approve", caption: "One click" },
      { icon: CalendarClock, title: "Auto-published", caption: "Everywhere, on schedule" },
    ],
    stack: [
      { name: "OpenAI", slug: "openai" },
      { name: "Notion", slug: "notion" },
      { name: "Zapier", slug: "zapier" },
      { name: "Slack", slug: "slack" },
      { name: "Google Sheets", slug: "googlesheets" },
      { name: "Buffer", domain: "buffer.com" },
    ],
  },
  {
    icon: Workflow,
    tag: "Sales",
    title: "Sales & Pipeline Automation",
    body: "Every lead followed up in minutes, every deal moved forward on its own. Your pipeline updates itself, so nothing slips and no revenue leaks.",
    whatWeAutomate: [
      "Instant follow-up the moment a lead enquires",
      "Deal stages and CRM fields updated automatically",
      "Meeting booking and reminders with zero back-and-forth",
      "Pipeline reports and forecasts refreshed in real time",
    ],
    howWeAutomate: [
      "We wire your forms, inbox and CRM together so new leads route and reply instantly.",
      "Rules move deals between stages as things happen, so no one drags cards by hand.",
      "AI drafts the follow-ups; your reps just review and send.",
    ],
    timeline: "Instant follow-up live in 48 hours. Full pipeline automation inside 2 weeks.",
    trust: "We define success together before you sign. No surprises, no scope creep.",
    milestones: [
      { icon: Inbox, title: "Lead lands", caption: "Any channel" },
      { icon: Mail, title: "Instant reply", caption: "Within minutes" },
      { icon: CalendarCheck, title: "Meeting booked", caption: "No back-and-forth" },
      { icon: RefreshCw, title: "CRM updated", caption: "Automatically" },
    ],
    stack: [
      { name: "HubSpot", slug: "hubspot" },
      { name: "Slack", slug: "slack" },
      { name: "Gmail", domain: "mail.google.com" },
      { name: "Calendly", domain: "calendly.com" },
      { name: "Zapier", slug: "zapier" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
  {
    icon: Search,
    tag: "Lead Gen",
    title: "Cold Outreach & Lead Gen Automation",
    body: "A steady flow of qualified conversations, booked straight into your calendar. We build the engine that finds, contacts and warms up your ideal customers on autopilot.",
    whatWeAutomate: [
      "Targeted prospect lists built and verified from your ideal-customer profile",
      "Personalized cold email and LinkedIn sequences at scale",
      "Replies sorted, and interested prospects booked automatically",
      "Inbox health monitored so you keep landing in the inbox, not spam",
    ],
    howWeAutomate: [
      "We pull and enrich targeted lead lists, then verify every email before a single send.",
      "AI personalizes each message using real signals about the prospect and their company.",
      "Positive replies route straight to your booking link and your CRM.",
    ],
    timeline: "First campaign sending within a week. Optimized engine inside 2 weeks.",
    trust: "Fixed scope. Flexible pricing. No hidden hours.",
    milestones: [
      { icon: Search, title: "Find leads", caption: "Your ideal profile" },
      { icon: Sparkles, title: "Personalize", caption: "AI, at scale" },
      { icon: Mail, title: "Sequenced send", caption: "Email + LinkedIn" },
      { icon: CalendarCheck, title: "Calls booked", caption: "Warm replies only" },
    ],
    stack: [
      { name: "Clay", slug: "clay", ext: "png" },
      { name: "OpenAI", slug: "openai" },
      { name: "LinkedIn", domain: "linkedin.com" },
      { name: "Instantly", domain: "instantly.ai" },
      { name: "HubSpot", slug: "hubspot" },
      { name: "Slack", slug: "slack" },
    ],
  },
  {
    icon: Inbox,
    tag: "Support",
    title: "Customer Support Automation",
    body: "Common questions answered instantly, day or night. Your team only touches the tickets that truly need a human, so customers stay happy and costs stay flat.",
    whatWeAutomate: [
      "Instant answers to repetitive questions across chat, email and WhatsApp",
      "Tickets tagged, prioritized and routed to the right person",
      "Order, account and status updates fetched automatically",
      "Clean escalations to a human, with the full history attached",
    ],
    howWeAutomate: [
      "An AI assistant trained on your own docs handles first response 24/7.",
      "It pulls live data from your systems to answer real questions, not just canned FAQs.",
      "Anything it cannot solve is handed to your team with the full context, so no one repeats themselves.",
    ],
    timeline: "AI assistant live in about a week. Full routing and integrations inside 2 weeks.",
    trust: "Realistic timelines, real deliverables, reviewed together at every stage.",
    milestones: [
      { icon: Inbox, title: "Question in", caption: "Any channel" },
      { icon: Sparkles, title: "AI answers", caption: "From your docs + data" },
      { icon: ListOrdered, title: "Sorted & routed", caption: "Right person, right priority" },
      { icon: UserCheck, title: "Human handoff", caption: "With full context" },
    ],
    stack: [
      { name: "OpenAI", slug: "openai" },
      { name: "WhatsApp", slug: "whatsapp" },
      { name: "Slack", slug: "slack" },
      { name: "Notion", slug: "notion" },
      { name: "Zendesk", domain: "zendesk.com" },
      { name: "HubSpot", slug: "hubspot" },
    ],
  },
  {
    icon: UserCheck,
    tag: "HR & People",
    title: "Human Resources Automation",
    body: "Hiring, onboarding and the endless admin, handled. Give every new joiner a smooth first week and give your people team their time back.",
    whatWeAutomate: [
      "Candidate screening, CV parsing and shortlisting",
      "Interview scheduling without the calendar tennis",
      "New-hire onboarding: accounts, documents and checklists",
      "Leave, expenses and HR requests routed and tracked",
    ],
    howWeAutomate: [
      "AI screens applicants against your criteria and reformats CVs into your template.",
      "Scheduling links and reminders remove the endless back-and-forth.",
      "Onboarding kicks off automatically the moment an offer is accepted.",
    ],
    timeline: "First HR workflow live in days. Full people-ops setup inside 2 weeks.",
    trust: "We define success together before you sign. No surprises, no scope creep.",
    milestones: [
      { icon: Search, title: "Screen", caption: "CVs, automatically" },
      { icon: CalendarCheck, title: "Schedule", caption: "Interviews, hands-free" },
      { icon: FileText, title: "Onboard", caption: "Docs + accounts ready" },
      { icon: RefreshCw, title: "Stay in sync", caption: "HR records updated" },
    ],
    stack: [
      { name: "OpenAI", slug: "openai" },
      { name: "Slack", slug: "slack" },
      { name: "Notion", slug: "notion" },
      { name: "Gmail", domain: "mail.google.com" },
      { name: "Calendly", domain: "calendly.com" },
      { name: "Google Sheets", slug: "googlesheets" },
    ],
  },
  {
    icon: Database,
    tag: "Data & CRM",
    title: "CRM & Lead Enrichment Automation",
    body: "A CRM that is always clean, complete and up to date, without anyone typing. Every contact enriched with the data your team needs to close.",
    whatWeAutomate: [
      "New contacts enriched with company and role data automatically",
      "Duplicate cleanup and field standardization across your stack",
      "Data synced between your CRM, spreadsheets and tools",
      "Lead scoring so reps work the hottest prospects first",
    ],
    howWeAutomate: [
      "Every new lead is enriched from live data sources the moment it lands.",
      "Rules dedupe, format and fill missing fields, so records stay clean on their own.",
      "Scoring flags priority leads and pings the right rep instantly.",
    ],
    timeline: "Enrichment live in 48 hours. Full CRM hygiene and scoring inside 2 weeks.",
    trust: "Fixed scope. Flexible pricing. No hidden hours.",
    milestones: [
      { icon: Inbox, title: "Contact added", caption: "Any source" },
      { icon: Search, title: "Enriched", caption: "Company + contact data" },
      { icon: Database, title: "Cleaned & synced", caption: "Across your stack" },
      { icon: ListOrdered, title: "Scored & routed", caption: "Hottest leads first" },
    ],
    stack: [
      { name: "Clay", slug: "clay", ext: "png" },
      { name: "HubSpot", slug: "hubspot" },
      { name: "Airtable", slug: "airtable" },
      { name: "Google Sheets", slug: "googlesheets" },
      { name: "OpenAI", slug: "openai" },
      { name: "Slack", slug: "slack" },
    ],
  },
];


export default function Services() {
  const { openBooking } = useBooking();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Section 2: which pillar tab is active.
  const [activeCard, setActiveCard] = useState(1);

  // Addition 2: sticky-bottom CTA bar. Appears after the hero scrolls out of
  // view, can be dismissed for the session.
  const heroSentinelRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("weha_sticky_cta_dismissed") === "1"
  );
  useEffect(() => {
    const el = heroSentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const dismissStickyBar = () => {
    setStickyDismissed(true);
    try {
      sessionStorage.setItem("weha_sticky_cta_dismissed", "1");
    } catch {
      /* ignore */
    }
  };
  const stickyVisible = showStickyBar && !stickyDismissed;

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

  // Section 3.5: index of the expanded automation system (null = closed).
  const [expandedSystem, setExpandedSystem] = useState(null);
  useEffect(() => {
    if (expandedSystem === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setExpandedSystem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [expandedSystem]);

  return (
    <div
      data-testid="services-page"
      className="overflow-x-hidden"
      style={{ paddingBottom: stickyVisible ? "5.5rem" : undefined }}
    >
      <Seo
        title="AI Automation Services"
        description="Three ways WeHA fixes what slows you down: connect your tools with deterministic automation, put AI to work with agents, or get a clear advisory roadmap."
        path="/services"
        jsonLd={graph([
          ORG,
          WEBSITE,
          webPage({
            path: "/services",
            name: "AI Automation Services",
            description:
              "Three ways WeHA fixes what slows you down: deterministic tool-to-tool automation, agentic AI, or an advisory automation roadmap.",
          }),
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
          ], "/services"),
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

      {/* sentinel: once this scrolls out of view, reveal the sticky CTA bar */}
      <div ref={heroSentinelRef} aria-hidden="true" className="h-px w-full" />

      <IntegrationStrip heading="Plays nice with your whole toolbox" />

      {/* SECTION 2 · WHAT WE BUILD (three always-open, click-to-focus cards) */}
      <ScrollSection direction="left" settle depth={0.5} intensity={0.45}>
      <section className="section-glass relative py-24 md:py-32" data-testid="services-pillars">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Our Engagement Models</span>
            <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-3xl">
              Three kinds of automation. We recommend the one you actually need.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-weha-muted max-w-2xl leading-relaxed">
              From simple tool to tool automation, to AI that reasons and acts, to a plain roadmap
              when you are not sure where to start. Tap a card to bring it forward.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-start">
              {serviceCards.map((card, i) => {
                const Icon = card.icon;
                const isActive = i === activeCard;
                const motionAnimate = prefersReducedMotion
                  ? {}
                  : isActive
                  ? { scale: 1.03, opacity: 1, boxShadow: "0 24px 60px -20px rgba(15,10,40,0.35)" }
                  : { scale: 0.97, opacity: 0.72, boxShadow: "0 0 0 0 rgba(0,0,0,0)" };
                return (
                  <motion.button
                    key={card.name}
                    type="button"
                    onClick={() => setActiveCard(i)}
                    aria-pressed={isActive}
                    data-cursor="hover"
                    data-testid={`service-card-${i + 1}`}
                    className="weha-card group relative flex h-full flex-col rounded-2xl border p-7 text-left md:p-8 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--weha-teal-soft)]"
                    style={{
                      zIndex: isActive ? 10 : 1,
                      borderColor: isActive
                        ? "color-mix(in srgb, var(--weha-teal) 35%, transparent)"
                        : "var(--weha-border)",
                      transition: "border-color 0.3s ease",
                    }}
                    initial={false}
                    animate={motionAnimate}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <span
                      className="grid h-12 w-12 place-items-center rounded-xl"
                      style={{ background: "var(--weha-teal-soft)" }}
                    >
                      <Icon size={22} className="text-weha-teal" />
                    </span>

                    <h3 className="weha-display text-2xl mt-5 text-weha-text">{card.name}</h3>
                    <p className="mt-2 font-medium text-weha-text leading-snug">{card.tagline}</p>
                    <p className="mt-3 text-sm text-weha-muted leading-relaxed">{card.description}</p>

                    <div className="my-6 h-px w-full" style={{ background: "var(--weha-border)" }} />

                    <p className="weha-label uppercase tracking-widest text-xs">What it looks like</p>
                    <ul className="mt-3 space-y-2">
                      {card.looks.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm text-weha-text leading-relaxed">
                          <Check size={15} className="mt-0.5 shrink-0 text-weha-teal" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-auto pt-6 text-xs text-weha-faint leading-relaxed">
                      <span className="font-semibold uppercase tracking-wider">{card.footLabel}:</span>{" "}
                      {card.foot}
                    </p>

                    {card.cta && (
                      <span
                        role="link"
                        tabIndex={0}
                        data-cursor="hover"
                        data-testid={`service-card-${i + 1}-cta`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(card.cta.to);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(card.cta.to);
                          }
                        }}
                        className="btn-teal mt-6 justify-center w-full cursor-pointer"
                      >
                        {card.cta.label} <ArrowRight size={15} />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 3.5 · SYSTEMS WE HELP AUTOMATE */}
      <ScrollSection direction="left" settle depth={0} intensity={0.35}>
      <section className="section-solid relative py-24 md:py-32" data-testid="section-systems">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">What we automate</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">Systems We Help Automate.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-weha-muted max-w-2xl leading-relaxed">
              Six systems that quietly remove the manual work slowing you down. Pick the one that hurts
              most and see exactly how we automate it, end to end.
            </p>
          </Reveal>

          {/* Grid of system cards. Clicking a card opens a centered modal that
              grows into view over a dimmed page (same pattern as "Who we build for"). */}
          <div className="mt-12">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
              {systems.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal key={s.title} delay={(i % 3) * 0.06}>
                    <motion.div
                      onClick={() => setExpandedSystem(i)}
                      className="weha-card p-7 min-w-[78vw] sm:min-w-[340px] md:min-w-0 h-full flex flex-col cursor-pointer"
                      data-cursor="hover"
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      data-testid={`system-card-${i}`}
                    >
                      <span
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}
                      >
                        <Icon size={22} />
                      </span>
                      <h3 className="weha-display text-2xl mt-5 text-weha-text">{s.title}</h3>
                      <p className="mt-3 text-weha-muted leading-relaxed flex-1">{s.body}</p>
                      <div className="mt-6">
                        <span className="btn-ghost" data-cursor="hover" data-testid={`system-expand-${i}`}>
                          Expand <Plus size={15} />
                        </span>
                      </div>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Centered, viewport-fixed modal (portaled outside the transformed
              section so it always sits dead-center). */}
          {createPortal(
            <AnimatePresence>
              {expandedSystem !== null && [
                <motion.div
                  key="sys-backdrop"
                  className="fixed inset-0 z-[120] backdrop-blur-sm"
                  style={{ background: "color-mix(in srgb, var(--weha-bg) 74%, transparent)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE } }}
                  transition={{ duration: 0.35, ease: EASE }}
                  onClick={() => setExpandedSystem(null)}
                />,
                <motion.div
                  key="sys-panel-wrap"
                  className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8, y: 28 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 12, transition: { duration: 0.28, ease: EASE } }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <div
                    className="weha-card w-full max-w-4xl max-h-[88vh] overflow-y-auto p-6 md:p-8 pointer-events-auto shadow-2xl"
                    data-testid="system-detail"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
                          style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}
                        >
                          {systems[expandedSystem].tag}
                        </span>
                        <h3 className="weha-display text-2xl md:text-3xl mt-3 text-weha-text">
                          {systems[expandedSystem].title}
                        </h3>
                        <p className="mt-2 text-sm text-weha-muted leading-relaxed max-w-2xl">
                          {systems[expandedSystem].body}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedSystem(null)}
                        aria-label="Close"
                        className="shrink-0 inline-flex items-center gap-2 rounded-full border border-weha-border px-4 py-2 text-sm text-weha-muted hover:text-weha-text hover:border-weha-teal transition-colors"
                        data-cursor="hover"
                        data-testid="system-detail-close"
                      >
                        <X size={16} /> Close
                      </button>
                    </div>

                    {/* Trust badge (WeHA styled) */}
                    <div
                      className="mt-5 rounded-2xl border p-4 md:p-4 flex items-center gap-4"
                      style={{
                        borderColor: "color-mix(in srgb, var(--weha-teal) 32%, transparent)",
                        background: "var(--weha-teal-soft)",
                      }}
                      data-testid="system-trust-badge"
                    >
                      <span
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                        style={{ background: "var(--weha-bg)", color: "var(--weha-teal)" }}
                      >
                        <ShieldCheck size={22} />
                      </span>
                      <div>
                        <p className="weha-display text-lg text-weha-text leading-tight">Built the way we said we would.</p>
                        <p className="mt-0.5 text-sm text-weha-muted leading-snug">
                          {systems[expandedSystem].trust}
                        </p>
                      </div>
                    </div>

                    {/* Compact 2x2 detail grid (no scrolling needed) */}
                    <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2">
                      {/* What we automate here */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                            <LayoutDashboard size={16} />
                          </span>
                          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-weha-faint">What we automate here</h4>
                        </div>
                        <ul className="mt-3 space-y-2">
                          {systems[expandedSystem].whatWeAutomate.map((p) => (
                            <li key={p} className="flex gap-2.5 text-sm text-weha-muted leading-snug">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--weha-teal)" }} />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* How we automate it */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                            <Workflow size={16} />
                          </span>
                          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-weha-faint">How we automate it</h4>
                        </div>
                        <ul className="mt-3 space-y-2">
                          {systems[expandedSystem].howWeAutomate.map((p) => (
                            <li key={p} className="flex gap-2.5 text-sm text-weha-muted leading-snug">
                              <Check size={15} className="mt-0.5 shrink-0" style={{ color: "var(--weha-teal)" }} />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Timeline of typical engagement */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                            <CalendarClock size={16} />
                          </span>
                          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-weha-faint">Timeline of typical engagement</h4>
                        </div>
                        <p className="mt-3 text-sm text-weha-text leading-snug">{systems[expandedSystem].timeline}</p>
                      </div>

                      {/* Tech stack used */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}>
                            <Share2 size={16} />
                          </span>
                          <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-weha-faint">Typical tech stack used</h4>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {systems[expandedSystem].stack.map((st) => (
                            <StackLogo key={st.name} {...st} />
                          ))}
                        </div>
                        <p className="mt-2.5 text-xs italic text-weha-faint">*tech stacks generally vary as per the use case</p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-5 rounded-2xl border border-weha-border p-4 md:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ background: "var(--weha-teal-soft)" }}>
                      <p className="text-sm text-weha-text leading-snug max-w-md">
                        Want this running in your business? See exactly what to automate first, free.
                      </p>
                      <Magnetic>
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedSystem(null);
                            openBooking();
                          }}
                          className="btn-teal shrink-0"
                          data-cursor="hover"
                          data-testid="system-book-audit"
                        >
                          Book your free audit <ArrowRight size={15} />
                        </button>
                      </Magnetic>
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


      {/* SECTION 4 · WHO THIS IS FOR (ported from Home) */}
      <ScrollSection direction="right" settle depth={0} intensity={0.35}>
      <section className="section-glass relative section-surface border-y border-weha-border py-24 md:py-32" data-testid="section-who">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Who we build for</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">Built for modern businesses.</h2>
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
                Book my free audit <ArrowRight size={15} />
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
                              Book my free audit <ArrowRight size={15} />
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
        cta="Book my free audit"
        testid="services-cta"
      />
      </ScrollSection>

      {/* ADDITION 2 · STICKY-BOTTOM CTA BAR */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            key="sticky-cta"
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: 120, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-weha-border"
            style={{ background: "color-mix(in srgb, var(--weha-surface) 85%, transparent)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
            data-testid="services-sticky-cta"
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
              <p className="text-sm md:text-base text-weha-text text-center sm:text-left flex-1">
                Map your top workflows in 90 minutes, free.
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Magnetic strength={0.3} className="flex-1 sm:flex-none">
                  <button
                    type="button"
                    onClick={openBooking}
                    className="btn-teal w-full sm:w-auto justify-center"
                    data-cursor="hover"
                    data-testid="sticky-cta-book"
                  >
                    Book my free audit <ArrowRight size={15} />
                  </button>
                </Magnetic>
                <button
                  type="button"
                  onClick={dismissStickyBar}
                  aria-label="Dismiss"
                  className="shrink-0 grid place-items-center h-9 w-9 rounded-full text-weha-muted hover:text-weha-text hover:bg-weha-elevated transition-colors"
                  data-cursor="hover"
                  data-testid="sticky-cta-dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
