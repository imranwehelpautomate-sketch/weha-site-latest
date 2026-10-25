import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  ClipboardList,
  Users,
  LineChart,
  Wrench,
  Map,
  PenLine,
  Sparkles,
  Megaphone,
  Server,
  ShieldCheck,
  FileCheck,
  BadgeCheck,
  Check,
  Undo2,
  MessagesSquare,
  Scale,
  BookOpenCheck,
  Lightbulb,
  MapPin,
} from "lucide-react";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import Magnetic from "@/components/Magnetic";
import Seo from "@/components/Seo";
import Scene3D from "@/three/Scene3D";
import { buildDepartment } from "@/three/builders";
import { useBooking } from "@/context/BookingContext";
import { SCROLL_SPRING } from "@/lib/motion";
import { ORG, WEBSITE, SITE, breadcrumb, webPage, graph } from "@/lib/seoSchemas";

/* ------------------------------------------------------------------ *
 * The team. The Director is the only one who talks to you.
 * ------------------------------------------------------------------ */
const director = {
  icon: Compass,
  title: "SEO Director",
  body: "Your one point of contact. Sends the daily brief, runs the weekly and monthly meetings, signs the reports, and never goes silent. You can reach the Director any time.",
};
const team = [
  { icon: ClipboardList, title: "SEO Manager", body: "Plans each sprint, assigns the work and settles disagreements." },
  { icon: Users, title: "SEO Lead", body: "Reviews every output before it reaches you and owns the change log." },
  { icon: LineChart, title: "SEO Analyst", body: "Owns every number. Reports only what the evidence shows." },
  { icon: Wrench, title: "Technical SEO", body: "Finds and fixes crawl, speed, schema and indexing problems." },
  { icon: Map, title: "Content Strategist", body: "Chooses the topics worth winning and plans around them." },
  { icon: PenLine, title: "Content Writer", body: "Writes drafts in your voice, from your own knowledge base." },
  { icon: Sparkles, title: "AEO/GEO Specialist", body: "Gets you cited in AI answers: ChatGPT, Perplexity, Gemini and Google's AI Overviews.", flag: true },
  { icon: Megaphone, title: "Distribution Specialist", body: "Puts finished content in front of people on your own channels." },
];

/* ------------------------------------------------------------------ *
 * A day in the department (pinned, scroll-scrubbed on desktop).
 * ------------------------------------------------------------------ */
const day = [
  { when: "Morning", title: "Team standup", body: "The team meets in the team room: what shipped, what is stuck, what is next. It is recorded and you can read it." },
  { when: "Then", title: "Your daily brief", body: "The Director sends you a short brief. What the team did, what needs your yes, what comes next. One voice, every day." },
  { when: "All day", title: "Audit, fix, write, measure", body: "Technical fixes, content drafts, AI answer checks, internal links. The Lead reviews every piece before it moves on." },
  { when: "When it matters", title: "You approve", body: "Plans, risky site changes and anything public wait for your named approver. Approve or decline in the dashboard or in chat." },
  { when: "Shipped", title: "Change log and undo", body: "On WordPress our plugin makes the change, logs it and keeps an undo. On other platforms you get a change pack, then a re-crawl confirms it." },
  { when: "Every week", title: "What we learned", body: "A weekly note of what the team learned about your business and your market, plus weekly and monthly meetings with the Director." },
];

const guarantees = [
  { icon: Server, title: "Runs on your own server", body: "The department lives on infrastructure you control. Your data and conversations stay with you." },
  { icon: ShieldCheck, title: "You approve what matters", body: "Plans, risky site changes and anything public wait for your named approver." },
  { icon: FileCheck, title: "Every fact has a source", body: "The knowledge base is built from your own material, and every fact points back to where it came from." },
  { icon: BadgeCheck, title: "Reads only what you grant", body: "Agents see only the data you give them access to. Nothing more." },
];

const packages = [
  { tag: "A", title: "The Generalist", body: "One AI SEO Executive covers technical SEO, content strategy and writing. Built for smaller sites.", points: ["Technical, strategy and writing in one role", "Hidden manager and review checks", "Daily brief, same approvals"] },
  { tag: "B", title: "The whole department", body: "The Director plus all eight specialists, working as one team from day one.", points: ["Director plus eight specialists", "Team room, debates, decision log", "AI answer visibility tracking"], featured: true },
  { tag: "C", title: "Director plus a smaller team", body: "The Director and the roles you need most. The rest of the team covers the gaps.", points: ["Director always included", "Choose the roles you need", "A hidden check reviews every output"] },
];

/* Pointer-driven 3D tilt for cards. Flat under reduced motion. */
function TiltCard({ children, className = "", ...rest }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };
  return (
    <div style={{ perspective: 900 }} className="h-full">
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className={`weha-card h-full ${className}`}
        data-cursor="hover"
        {...rest}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Kicker({ children, marigold = false }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase ${marigold ? "text-weha-marigold-text" : "text-weha-teal"}`}>
      {marigold && <span className="h-2 w-2 rounded-full bg-weha-marigold" />}
      {children}
    </span>
  );
}

/* Hero: full-bleed 3D department scene, layered parallax, oversized serif. */
function Hero({ openBooking }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);
  const bgY = useTransform(p, [0, 1], ["0%", "18%"]);
  const cardY = useTransform(p, [0, 1], [0, -90]);
  const chipY = useTransform(p, [0, 1], [0, -160]);
  const fade = useTransform(p, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden pt-28 pb-16" data-testid="seo-hero">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <Scene3D build={buildDepartment} className="absolute inset-0" />
      </motion.div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--weha-bg) 0%, var(--weha-bg) 22%, color-mix(in srgb, var(--weha-bg) 55%, transparent) 50%, transparent 78%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none" style={{ background: "linear-gradient(to top, var(--weha-bg), transparent)" }} />

      <motion.div style={{ opacity: fade }} className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
        <div>
          <Reveal>
            <Kicker marigold>The WeHA flagship · now taking pilot partners</Kicker>
          </Reveal>
          <h1 className="weha-display mt-5 text-[clamp(2.8rem,7.5vw,6.5rem)] leading-[0.95] text-weha-text">
            <MaskReveal delay={0.05}>A whole SEO</MaskReveal>
            <MaskReveal delay={0.15}>department.</MaskReveal>
            <MaskReveal delay={0.25}>
              <span className="italic weha-highlight">On your own server.</span>
            </MaskReveal>
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-7 text-lg md:text-xl text-weha-muted max-w-xl leading-relaxed">
              Nine AI SEO specialists, trained on your own data, led by a Director who is your single point of
              contact. They audit, fix, write and measure every day. You approve what matters.
            </p>
          </Reveal>
          <Reveal delay={0.38}>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Magnetic>
                <button type="button" onClick={openBooking} className="btn-teal" data-cursor="hover" data-testid="seo-hero-cta">
                  Ask about a pilot place <ArrowRight size={15} />
                </button>
              </Magnetic>
              <a href="#day" className="btn-ghost" data-cursor="hover">
                See a day in the department <ArrowUpRight size={15} />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Decorative example brief: floats on its own parallax layer. */}
        <div className="relative hidden lg:block h-[420px]">
          <motion.div style={{ y: cardY }} className="absolute right-0 top-6 w-[360px] rounded-2xl border border-weha-border bg-weha-elevated/90 backdrop-blur-md p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-weha-teal-soft"><Compass size={18} className="text-weha-teal" /></span>
              <div>
                <p className="text-sm font-semibold text-weha-text">Your SEO Director</p>
                <p className="text-xs text-weha-faint">Daily brief · example</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {[
                "Technical SEO fixed two pages Google could not index.",
                "The pricing guide draft waits for your approval.",
                "Three questions where AI answers cite a competitor.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm text-weha-muted leading-relaxed">
                  <Check size={16} className="mt-0.5 shrink-0 text-weha-teal" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div style={{ y: chipY }} className="absolute left-2 bottom-10 rounded-full border border-weha-border bg-weha-elevated px-4 py-2 text-xs font-semibold text-weha-text shadow-lg">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-weha-marigold align-middle" />
            Waiting for your approval · 1
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* Ticker of what the department works on. */
function WorkTicker() {
  const items = ["Technical fixes", "Content in your voice", "AI answer visibility", "ChatGPT", "Perplexity", "Gemini", "AI Overviews", "Schema", "Internal links", "Page speed", "Indexing", "Topic strategy", "Distribution"];
  const row = (k) => (
    <div className="flex shrink-0 items-center" key={k} aria-hidden={k === "b"}>
      {items.map((t) => (
        <span key={t + k} className="weha-display italic text-3xl md:text-5xl text-weha-text px-6 whitespace-nowrap">
          {t}<span className="ml-12 inline-block h-2.5 w-2.5 rounded-full bg-weha-marigold align-middle" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="weha-marquee is-ready border-y border-weha-border py-6 md:py-8">
      <div className="weha-marquee__track">{row("a")}{row("b")}</div>
    </div>
  );
}

/* A day in the department: horizontal track pinned and scrubbed by scroll (desktop), stacked list otherwise. */
function DayInTheDepartment() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);
  const x = useTransform(p, [0, 1], ["0%", `-${((day.length - 1) / day.length) * 100}%`]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);

  const card = (d, i) => (
    <div className="weha-card h-full p-8 md:p-10 flex flex-col">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">{d.when}</span>
        <span className="weha-display text-6xl text-weha-teal/25">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="weha-display text-3xl md:text-4xl mt-6 text-weha-text">{d.title}</h3>
      <p className="mt-4 text-weha-muted leading-relaxed">{d.body}</p>
    </div>
  );

  const heading = (
    <Reveal>
      <Kicker>A day in the department</Kicker>
      <h2 className="weha-display text-4xl md:text-6xl mt-3 text-weha-text max-w-3xl">
        Like a real team. <span className="weha-scribble italic text-weha-teal">You can watch it work.</span>
      </h2>
    </Reveal>
  );

  if (reduce) {
    return (
      <section id="day" className="py-24 md:py-32" data-testid="seo-day">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {heading}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{day.map((d, i) => <div key={d.title}>{card(d, i)}</div>)}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="day" data-testid="seo-day">
      {/* Phones and tablets: stacked, no pinning. */}
      <div className="md:hidden py-24 px-5">
        {heading}
        <div className="mt-10 grid gap-5">{day.map((d, i) => <Reveal key={d.title}>{card(d, i)}</Reveal>)}</div>
      </div>
      {/* Desktop: one pinned section per page. */}
      <div ref={ref} className="hidden md:block relative" style={{ height: `${day.length * 70}vh` }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 w-full">{heading}</div>
          <div className="mt-12 pl-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <motion.div style={{ x, width: `${day.length * 34}vw` }} className="flex gap-6">
              {day.map((d, i) => (
                <div key={d.title} className="w-[32vw] max-w-[440px] shrink-0">{card(d, i)}</div>
              ))}
            </motion.div>
          </div>
          <div className="max-w-7xl mx-auto px-8 w-full mt-10">
            <div className="h-[3px] w-full rounded-full bg-weha-border overflow-hidden">
              <motion.div style={{ width: bar }} className="h-full bg-weha-teal" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Small decorative mock rows used inside the bento cards. */
function MockRow({ children, tone = "teal" }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-weha-border bg-weha-bg px-3 py-2 text-xs text-weha-muted">
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone === "marigold" ? "bg-weha-marigold" : "bg-weha-teal"}`} />
      {children}
    </div>
  );
}

export default function AISeoDepartment() {
  const { openBooking } = useBooking();
  const DIcon = director.icon;

  return (
    <div data-testid="ai-seo-department-page" className="overflow-x-clip">
      <Seo
        title="AI SEO Department | A Full SEO Team on Your Own Server"
        description="WeHA's AI SEO Department: a team of nine AI SEO specialists, led by a Director who reports to you, running on your own server and trained on your own data. Now taking pilot partners."
        path="/ai-seo-department"
        jsonLd={graph([
          ORG,
          WEBSITE,
          webPage({
            path: "/ai-seo-department",
            name: "AI SEO Department | A Full SEO Team on Your Own Server",
            description:
              "A team of nine AI SEO specialists, led by a Director who reports to you, running on your own server and trained on your own data.",
          }),
          {
            "@type": "Service",
            "@id": `${SITE}/ai-seo-department#service`,
            name: "AI SEO Department",
            serviceType: "Managed AI SEO",
            provider: { "@id": `${SITE}/#organization` },
            description:
              "A virtual SEO department of AI specialists that runs on the client's own server, is trained on the client's own data, and asks the client's approver before plans, risky changes and public content.",
            areaServed: ["India", "United States", "Canada"],
            url: `${SITE}/ai-seo-department`,
          },
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "AI SEO Department", path: "/ai-seo-department" },
          ], "/ai-seo-department"),
        ])}
      />

      <Hero openBooking={openBooking} />
      <WorkTicker />
      <DayInTheDepartment />

      {/* THE TEAM: editorial grid, Director gets the big tile. */}
      <section className="section-surface border-y border-weha-border py-24 md:py-32" data-testid="seo-team">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <Kicker>Meet the department</Kicker>
            <h2 className="weha-display text-4xl md:text-6xl mt-3 text-weha-text max-w-3xl">
              Nine specialists. <span className="italic weha-highlight">One person to talk to.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Reveal className="md:col-span-2 lg:row-span-2">
              <TiltCard className="p-8 md:p-10 flex flex-col justify-between" data-testid="seo-role-1">
                <div>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-weha-teal text-weha-bg"><DIcon size={26} /></span>
                  <h3 className="weha-display text-4xl md:text-5xl mt-8 text-weha-text">{director.title}</h3>
                  <p className="mt-4 text-weha-muted leading-relaxed max-w-md">{director.body}</p>
                </div>
                <p className="mt-10 text-sm text-weha-muted">
                  Smaller site? <span className="text-weha-text font-semibold">The Generalist</span> covers technical, strategy and writing in one role.
                </p>
              </TiltCard>
            </Reveal>
            {team.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.title} delay={(i % 4) * 0.05}>
                  <TiltCard className="p-6" data-testid={`seo-role-${i + 2}`}>
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-weha-teal-soft"><Icon size={18} className="text-weha-teal" /></span>
                      {c.flag && <span className="rounded-full bg-weha-marigold-soft px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-weha-marigold-text">AI answers</span>}
                    </div>
                    <h3 className="weha-display text-2xl mt-5 text-weha-text">{c.title}</h3>
                    <p className="mt-2 text-sm text-weha-muted leading-relaxed">{c.body}</p>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-8 inline-flex items-center gap-2 text-sm text-weha-muted">
              <MapPin size={15} className="text-weha-teal" /> Add-on: a Local SEO specialist for businesses that win on maps and nearby searches.
            </p>
          </Reveal>
        </div>
      </section>

      {/* NOTHING HIDDEN: bento of team room, debates, knowledge base, weekly learning. */}
      <section className="py-24 md:py-32" data-testid="seo-transparency">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <Kicker>Nothing hidden</Kicker>
            <h2 className="weha-display text-4xl md:text-6xl mt-3 text-weha-text max-w-4xl">
              See how every decision was made. <span className="italic text-weha-teal">Failures included.</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-6">
            <Reveal className="lg:col-span-4">
              <TiltCard className="p-8">
                <MessagesSquare size={22} className="text-weha-teal" />
                <h3 className="weha-display text-3xl mt-4 text-weha-text">The team room</h3>
                <p className="mt-3 text-weha-muted leading-relaxed max-w-lg">Every conversation between the specialists is recorded and visible to you, including what went wrong and how they fixed it.</p>
                <div className="mt-6 grid gap-2 max-w-lg" aria-hidden="true">
                  <MockRow>Technical SEO: two product pages blocked by a noindex tag. Fix drafted.</MockRow>
                  <MockRow>SEO Lead: reviewed. Risky change, sending to the approver.</MockRow>
                  <MockRow tone="marigold">AEO/GEO: competitor cited for "best invoicing tool in Pune".</MockRow>
                </div>
              </TiltCard>
            </Reveal>
            <Reveal className="lg:col-span-2" delay={0.06}>
              <TiltCard className="p-8">
                <Scale size={22} className="text-weha-teal" />
                <h3 className="weha-display text-3xl mt-4 text-weha-text">Debates, then a decision</h3>
                <p className="mt-3 text-weha-muted leading-relaxed">When specialists disagree, they argue it out blind, on equal footing. The Manager decides, and the reasoning goes into the decision log.</p>
              </TiltCard>
            </Reveal>
            <Reveal className="lg:col-span-3" delay={0.04}>
              <TiltCard className="p-8">
                <BookOpenCheck size={22} className="text-weha-teal" />
                <h3 className="weha-display text-3xl mt-4 text-weha-text">A knowledge base you can correct</h3>
                <p className="mt-3 text-weha-muted leading-relaxed">Built only from sources you grant. Every fact shows where it came from, and you can fix anything in the dashboard.</p>
              </TiltCard>
            </Reveal>
            <Reveal className="lg:col-span-3" delay={0.08}>
              <TiltCard className="p-8">
                <Lightbulb size={22} className="text-weha-teal" />
                <h3 className="weha-display text-3xl mt-4 text-weha-text">What we learned this week</h3>
                <p className="mt-3 text-weha-muted leading-relaxed">A weekly page of what the team learned about your customers, your market and your site. The department grows like an employee.</p>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* APPROVAL + CHANGE LOG WITH UNDO */}
      <section className="section-surface border-y border-weha-border py-24 md:py-32" data-testid="seo-approvals">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid gap-14 lg:grid-cols-2 items-center">
          <div>
            <Reveal>
              <Kicker>You stay in charge</Kicker>
              <h2 className="weha-display text-4xl md:text-6xl mt-3 text-weha-text">
                Every change logged. <span className="weha-scribble italic text-weha-teal">Every change undoable.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 text-lg text-weha-muted leading-relaxed">
                Your approver (the founder, or a named marketing manager or director) says yes to plans, risky site
                changes and public content. On WordPress our plugin applies the change and keeps an undo. On any other
                platform the team prepares a change pack for your developer, then re-crawls to confirm it landed.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <TiltCard className="p-6 md:p-8" aria-hidden="true">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-weha-text">Change log</p>
                <span className="text-xs text-weha-faint">example</span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Title and meta rewritten on /pricing", "Approved by your approver"],
                  ["FAQ schema added to 4 guides", "Low risk, reviewed by the Lead"],
                  ["Redirect /old-blog to /blog", "Approved by your approver"],
                ].map(([t, s]) => (
                  <div key={t} className="flex items-center justify-between gap-4 rounded-xl border border-weha-border bg-weha-bg px-4 py-3">
                    <div>
                      <p className="text-sm text-weha-text">{t}</p>
                      <p className="text-xs text-weha-faint mt-0.5">{s}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-weha-border px-3 py-1 text-xs text-weha-muted"><Undo2 size={12} /> Undo</span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-weha-marigold px-4 py-3">
                  <p className="text-sm text-weha-text">New guide: "How to choose an invoicing tool"</p>
                  <span className="rounded-full bg-weha-marigold-soft px-3 py-1 text-xs font-semibold text-weha-marigold-text">Waiting for you</span>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* PACKAGES (no prices: D44) */}
      <section className="py-24 md:py-32" data-testid="seo-packages">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <Kicker>Three ways to start</Kicker>
            <h2 className="weha-display text-4xl md:text-6xl mt-3 text-weha-text max-w-3xl">Pick the team size that fits your site.</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {packages.map((k, i) => (
              <Reveal key={k.tag} delay={i * 0.06}>
                <TiltCard className={`p-8 flex flex-col ${k.featured ? "border-weha-teal" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="weha-display text-5xl text-weha-teal">{k.tag}</span>
                    {k.featured && <span className="rounded-full bg-weha-teal px-3 py-1 text-xs font-semibold text-weha-bg">Full department</span>}
                  </div>
                  <h3 className="weha-display text-3xl mt-6 text-weha-text">{k.title}</h3>
                  <p className="mt-3 text-weha-muted leading-relaxed">{k.body}</p>
                  <ul className="mt-6 space-y-2">
                    {k.points.map((pt) => (
                      <li key={pt} className="flex gap-2 text-sm text-weha-muted"><Check size={15} className="mt-0.5 shrink-0 text-weha-teal" /> {pt}</li>
                    ))}
                  </ul>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-8 text-sm text-weha-muted max-w-3xl">Pricing comes later. Pilot partners talk it through with us before anything is agreed.</p>
          </Reveal>
        </div>
      </section>

      {/* TRUST */}
      <section className="section-surface border-y border-weha-border py-24 md:py-32" data-testid="seo-trust">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <Kicker>Your site, your data, your call</Kicker>
            <h2 className="weha-display text-4xl md:text-6xl mt-3 text-weha-text max-w-4xl">Built to be trusted with your website.</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g, i) => {
              const Icon = g.icon;
              return (
                <Reveal key={g.title} delay={i * 0.05}>
                  <TiltCard className="p-7">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-weha-teal-soft"><Icon size={20} className="text-weha-teal" /></span>
                    <h3 className="weha-display text-2xl mt-5 text-weha-text">{g.title}</h3>
                    <p className="mt-3 text-sm text-weha-muted leading-relaxed">{g.body}</p>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-10 text-sm text-weha-muted max-w-3xl leading-relaxed">
              We run the department on our own website first. Pilot places are limited, for businesses in India, the
              United States and Canada. English only for now.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABanner
        heading="Want an SEO department without hiring one?"
        sub="Tell us about your site. We will let you know if a pilot place fits and what the department would work on first."
        cta="Ask about a pilot place"
        testid="seo-cta"
      />
    </div>
  );
}
