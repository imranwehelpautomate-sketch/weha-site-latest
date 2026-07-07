import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  X,
  ShieldCheck,
  Check,
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
      "Three hundred CVs for one role. Screening, formatting, scheduling, follow-ups, all by hand. Great candidates go cold before we even reply.",
  },
  {
    label: "Marketing head · 6:05 PM",
    quote:
      "A team of two doing the work of six. Content, campaigns, reporting: everything ships late because we are stuck stitching tools together.",
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

// Who this is for. Each entry powers a card + an expanded detail view.
// stack logos: { name, slug } => /logos/{slug}.svg (or ext), { name, domain } => favicon.
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
  {
    tag: "Legal",
    title: "Legal & Research Teams",
    body: "Case research, document review, contract drafting and intake, accelerated by AI. Your team spends time on judgment, not on reading hundreds of pages by hand.",
    useCase:
      "Legal work is high value but heavy on reading and drafting. We automate research, document review, contract drafting and client intake, so your team moves faster on the work that actually needs a lawyer's judgment.",
    painpoints: [
      "Case and precedent research swallows billable hours.",
      "Document and contract review is slow and easy to miss things in.",
      "First-draft contracts and briefs are written from scratch every time.",
      "Client intake and matter setup are entirely manual.",
    ],
    departments: [
      "Case & precedent research",
      "Document & contract review",
      "Contract & brief drafting",
      "Client intake & matter setup",
      "Deadline & docket tracking",
      "Knowledge base & summaries",
    ],
    stack: [
      { name: "Google Docs", domain: "docs.google.com" },
      { name: "DocuSign", domain: "docusign.com" },
      { name: "Clio", domain: "clio.com" },
      { name: "Notion", slug: "notion" },
      { name: "Slack", slug: "slack" },
      { name: "OpenAI", slug: "openai" },
    ],
  },
  {
    tag: "Hospitality",
    title: "Hotels & Restaurants",
    body: "Bookings, guest messages, reviews and reorders handled around the clock. Tables and rooms stay full, guests get instant replies, and your team stays on the floor, not on the phone.",
    useCase:
      "In hospitality, every unanswered message is a lost booking and every slow reply dents the review score. We automate reservations, guest communication, reviews and supplier reordering so your team spends time with guests, not glued to a screen.",
    painpoints: [
      "Booking and reservation enquiries arrive at all hours and get missed.",
      "Guest messages across phone, email and social pile up unanswered.",
      "Review requests are forgotten, so ratings stall.",
      "Stock and supplier reordering is tracked by hand and runs late.",
    ],
    departments: [
      "Reservations & booking response",
      "Guest messaging & concierge",
      "Reviews & reputation",
      "Table / room availability sync",
      "Supplier & stock reordering",
      "Feedback & loyalty follow-up",
    ],
    stack: [
      { name: "WhatsApp", slug: "whatsapp" },
      { name: "OpenTable", domain: "opentable.com" },
      { name: "Toast", domain: "toasttab.com" },
      { name: "Google Business", domain: "business.google.com" },
      { name: "Stripe", domain: "stripe.com" },
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

// Why WeHA (dark section) bullets, unchanged.
const whyWeha = [
  "You own every system we build, no lock-in, no monthly hostage fees.",
  "We build on the tools you already use wherever we can.",
  "Live systems in days, not months. You see value almost immediately.",
  "Automations are documented and delivered, so you are in control.",
];

// Dogfooding stats row inside the dark section.
const stats = [
  { value: 90, suffix: " min", label: "to your first live automation" },
  { value: 100, suffix: "%", label: "yours: code, docs and accounts" },
  { value: 30, suffix: " days", label: "of support after every handoff" },
  { value: 0, suffix: "", text: "Zero", label: "markup on any tool you need" },
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
    "your ads",
    "your email marketing",
    "your SEO",
    "your content marketing",
    "your proposals",
    "your recruitment",
    "your bookings",
    "your client management",
    "your worries",
    "your stress",
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Flagship flow tab + FAQ accordion state.
  const [activeTab, setActiveTab] = useState(FLOWS[0].id);
  const activeFlow = FLOWS.find((f) => f.id === activeTab) || FLOWS[0];
  const [openFaq, setOpenFaq] = useState(0);

  // "Who this is for" — index of the expanded industry (null = closed).
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
              <div
                className="mt-9 inline-flex items-center gap-3 rounded-2xl border px-4 py-3 pointer-events-auto"
                style={{
                  borderColor: "color-mix(in srgb, var(--weha-teal) 28%, transparent)",
                  background: "var(--weha-teal-soft)",
                }}
                data-testid="hero-trust-badge"
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                  style={{ background: "var(--weha-bg)", color: "var(--weha-teal)" }}
                >
                  <ShieldCheck size={18} />
                </span>
                <p className="text-sm leading-snug max-w-md">
                  <span className="font-semibold text-weha-text">Outcome-guaranteed engagements.</span>
                  <br />
                  <span className="text-weha-muted">Fixed scope. Flexible pricing. No surprises.</span>
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.55}>
              <div className="mt-6 flex flex-nowrap items-center gap-3 sm:gap-5 pointer-events-auto">
                <Magnetic>
                  <button type="button" onClick={openBooking} className="btn-teal max-sm:!px-4 max-sm:!text-sm" data-testid="hero-primary-cta" data-cursor="hover">
                    Book a Free AI Audit <ArrowRight size={16} />
                  </button>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <Link to="/services" className="btn-ghost max-sm:!text-sm whitespace-nowrap" data-testid="hero-secondary-cta" data-cursor="hover">
                    Explore Services <ArrowRight size={15} />
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
                  A 30-minute conversation. We map your most automatable workflows and maybe
                  build one live on the call. You leave with a prioritized plan whether you hire us
                  or not.
                </p>
                <div className="mt-6">
                  <Magnetic>
                    <button type="button" onClick={openBooking} className="btn-teal" data-cursor="hover">
                      Book my free audit <ArrowRight size={15} />
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
              section so it always sits dead-center — no scrolling needed). */}
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

                        {/* CTA — kept here (below the logos) so it stays visible
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

      {/* SECTION 10 · WHY WEHA - dark moment (strongest entrance) */}
      <ScrollSection direction="right" settle depth={1} intensity={0.6}>
      <section className="section-glass relative py-12 md:py-16 overflow-hidden" style={{ background: "#171614", "--weha-bg": "#171614", "--weha-text": "#f7f6f2" }}>
        <div
          className="absolute inset-0 opacity-[0.6]"
          style={{ background: "radial-gradient(circle at 78% 42%, rgba(155,128,224,0.32), transparent 55%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:items-center">
            {/* LEFT: message */}
            <div>
              <Reveal>
                <span className="text-xs font-semibold tracking-[0.24em] uppercase" style={{ color: "#9b80e0" }}>
                  The WeHA difference
                </span>
                <h2 className="weha-display text-4xl md:text-5xl mt-3 text-[#f7f6f2] leading-[1.04]">
                  Not a freelancer. Not a big agency.{" "}
                  <span className="italic" style={{ color: "#9b80e0" }}>Better placed than both.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-4 text-[0.95rem] md:text-base text-[#c9c5bd] leading-relaxed max-w-xl">
                  A freelancer connects two tools and calls it done. A big agency quotes a six-month
                  roadmap with a retainer to match. We sit in between: engineered properly, shipped
                  in days, and owned entirely by you.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <ul className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                  {whyWeha.map((t, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg mt-0.5"
                        style={{ background: "rgba(155,128,224,0.16)", color: "#9b80e0" }}
                      >
                        <Check size={14} />
                      </span>
                      <span className="text-[0.95rem] text-[#e9e6df] leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.26}>
                <div className="mt-6">
                  <Magnetic>
                    <button
                      type="button"
                      onClick={openBooking}
                      className="btn-teal"
                      data-cursor="hover"
                      data-testid="whyweha-cta"
                    >
                      Book a Free AI Audit <ArrowRight size={16} />
                    </button>
                  </Magnetic>
                </div>
              </Reveal>
            </div>

            {/* RIGHT: circular guarantee visual */}
            <Reveal delay={0.2}>
              <div className="relative mx-auto aspect-square w-full max-w-[360px]">
                {/* soft glow */}
                <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(155,128,224,0.22), transparent 62%)" }} />
                {/* concentric rings */}
                <div className="absolute inset-0 rounded-full border" style={{ borderColor: "rgba(155,128,224,0.16)" }} />
                <div className="absolute inset-[9%] rounded-full border" style={{ borderColor: "rgba(155,128,224,0.22)" }} />
                {/* rotating dashed ring + orbiting dot */}
                <motion.div
                  className="absolute inset-[4%] rounded-full"
                  style={{ border: "1px dashed rgba(155,128,224,0.35)" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-[4%]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <span
                    className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                    style={{ background: "#9b80e0", boxShadow: "0 0 14px rgba(155,128,224,0.9)" }}
                  />
                </motion.div>
                {/* center medallion */}
                <div
                  className="absolute inset-[19%] rounded-full flex flex-col items-center justify-center text-center px-7"
                  style={{
                    background: "radial-gradient(circle at 50% 35%, rgba(155,128,224,0.16), rgba(23,22,20,0.72))",
                    border: "1px solid rgba(155,128,224,0.28)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: "rgba(155,128,224,0.18)", color: "#9b80e0" }}
                  >
                    <ShieldCheck size={26} />
                  </span>
                  <p className="weha-display text-2xl md:text-[1.7rem] mt-4 text-[#f7f6f2] leading-tight">
                    Outcome-guaranteed
                  </p>
                  <p className="weha-display text-2xl md:text-[1.7rem] italic leading-tight" style={{ color: "#9b80e0" }}>
                    engagements.
                  </p>
                  <span className="mt-2.5 h-px w-10" style={{ background: "rgba(155,128,224,0.4)" }} />
                  <p className="mt-2.5 text-sm text-[#c9c5bd] leading-snug">
                    We only propose what we&apos;re confident we can deliver, and we put it in writing.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Proof row */}
          <div
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-y-7 border-t pt-8"
            style={{ borderColor: "rgba(155,128,224,0.15)" }}
          >
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className={i > 0 ? "md:border-l md:pl-8" : "md:pl-0"} style={i > 0 ? { borderColor: "rgba(155,128,224,0.15)" } : undefined}>
                  <p className="weha-display text-4xl md:text-5xl" style={{ color: "#9b80e0" }}>
                    <CountUp value={s.value} suffix={s.suffix} text={s.text} />
                  </p>
                  <p className="mt-2 text-[#c9c5bd]">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION · THE COST - agitation (moved above FAQ) */}
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
                Book my free audit <ArrowUpRight size={17} />
              </button>
            </Magnetic>
          </Reveal>
        </div>
      </section>
      </ScrollSection>
    </div>
  );
}
