import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Brain,
  Network,
  ShieldCheck,
  Gauge,
  Sparkles,
  Check,
  Minus,
  Rocket,
  MessagesSquare,
  Inbox,
  Send,
  Database,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import Magnetic from "@/components/Magnetic";
import IntegrationStrip from "@/components/IntegrationStrip";
import Seo from "@/components/Seo";
import { useBooking } from "@/context/BookingContext";
import { ORG, SITE, breadcrumb, graph } from "@/lib/seoSchemas";

/* ------------------------------------------------------------------ *
 * Section 2: what makes a Workforce agent different from a chatbot.
 * ------------------------------------------------------------------ */
const capabilities = [
  {
    icon: Rocket,
    title: "Proactive",
    body: "It does not wait to be prompted. Your agent watches the workflows you hand it and starts the work the moment there is work to do.",
  },
  {
    icon: Brain,
    title: "Persistent memory",
    body: "It remembers your accounts, your tone and every past decision, so it gets sharper over time instead of starting from scratch each morning.",
  },
  {
    icon: Network,
    title: "Cross-stack",
    body: "It works across the tools you already use, moving between your CRM, inbox, docs and databases the way a real teammate would.",
  },
  {
    icon: ShieldCheck,
    title: "Self-checking",
    body: "It reviews its own output, catches its mistakes and asks for a human when a call genuinely needs one. No silent failures.",
  },
  {
    icon: Gauge,
    title: "Fully managed",
    body: "We deploy, monitor and maintain the agent for you. When an API changes or something drifts, we fix it before it becomes your problem.",
  },
  {
    icon: Sparkles,
    title: "Human-grade output",
    body: "Drafts, replies and reports come out on-brand and ready to send, not as raw text you have to rewrite before anyone sees it.",
  },
];

/* ------------------------------------------------------------------ *
 * Section 3: comparison table rows.
 * value: true = yes, "partial" = limited, false = no.
 * ------------------------------------------------------------------ */
const compareRows = [
  { label: "Starts work on its own", chatbot: false, copilot: false, diy: "partial", weha: true },
  { label: "Remembers your context over time", chatbot: false, copilot: "partial", diy: "partial", weha: true },
  { label: "Acts across your whole tool stack", chatbot: false, copilot: "partial", diy: true, weha: true },
  { label: "Checks and corrects its own work", chatbot: false, copilot: false, diy: false, weha: true },
  { label: "Monitored and maintained for you", chatbot: false, copilot: false, diy: false, weha: true },
  { label: "You own the system, no lock-in", chatbot: false, copilot: false, diy: "partial", weha: true },
];
const compareCols = [
  { key: "chatbot", name: "Chatbots" },
  { key: "copilot", name: "Copilots" },
  { key: "diy", name: "DIY agents" },
  { key: "weha", name: "WeHA Workforce", highlight: true },
];

/* ------------------------------------------------------------------ *
 * Section 4: real workflow "threads".
 * ------------------------------------------------------------------ */
const threads = [
  {
    tag: "Lead response",
    lines: [
      { who: "Website", color: "#3b82f6", text: "New demo request from a 40-person SaaS team." },
      { who: "Agent", color: "var(--weha-teal)", text: "Enriched the company, scored it high-fit, drafted a reply and booked a slot." },
      { who: "Agent", color: "var(--weha-teal)", text: "Reply sent in under two minutes. CRM updated, owner notified." },
      { who: "You", color: "#8b5cf6", text: "Nice, that one used to sit until Monday." },
    ],
  },
  {
    tag: "Finance ops",
    lines: [
      { who: "Inbox", color: "#22c55e", text: "12 supplier invoices landed overnight." },
      { who: "Agent", color: "var(--weha-teal)", text: "Matched each to a PO, flagged two mismatches, queued the rest for payment." },
      { who: "Agent", color: "var(--weha-teal)", text: "Two flagged items need a human. Everything else is reconciled." },
      { who: "You", color: "#8b5cf6", text: "Approved. That saved the whole morning." },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Section 5: testimonials.
 * ------------------------------------------------------------------ */
const testimonials = [
  {
    quote:
      "It genuinely runs on its own. We handed it our lead inbox and stopped thinking about response times entirely.",
    name: "Operations lead",
    role: "B2B services company",
  },
  {
    quote:
      "The difference is that WeHA manages the agent. We do not babysit prompts or wake up to broken automations.",
    name: "Founder",
    role: "Recruitment agency",
  },
  {
    quote:
      "Live in under two weeks, on the tools we already had. It felt less like buying software and more like a hire.",
    name: "Head of growth",
    role: "SaaS startup",
  },
];

/* ------------------------------------------------------------------ *
 * Section 6: deployment steps.
 * ------------------------------------------------------------------ */
const steps = [
  {
    n: "01",
    title: "We deploy your Workforce agent",
    body: "We map one high-value workflow, wire the agent into your existing stack and get it doing real work, fast.",
  },
  {
    n: "02",
    title: "It works while you watch",
    body: "The agent runs end to end, checking its own output and escalating only the calls that truly need you.",
  },
  {
    n: "03",
    title: "We keep it running",
    body: "We monitor, maintain and improve it. When something changes upstream, we handle it before it reaches you.",
  },
];

function CompareCell({ value }) {
  if (value === true)
    return <Check size={18} className="mx-auto text-weha-teal" aria-label="Yes" />;
  if (value === "partial")
    return <Minus size={18} className="mx-auto text-weha-faint" aria-label="Limited" />;
  return <span className="mx-auto block h-[2px] w-3.5 rounded-full bg-weha-border" aria-label="No" />;
}

function ThreadCard({ tag, lines }) {
  return (
    <div className="weha-card p-6 md:p-7">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-weha-teal"
        style={{ background: "var(--weha-teal-soft)" }}
      >
        <MessagesSquare size={12} /> {tag}
      </span>
      <div className="mt-5 space-y-4">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-3">
            <span
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[0.6rem] font-bold text-white"
              style={{ background: l.color }}
            >
              {l.who.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="text-xs font-semibold text-weha-text">{l.who}</p>
              <p className="text-sm text-weha-muted leading-relaxed">{l.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIWorkforce() {
  const { openBooking } = useBooking();

  return (
    <div data-testid="ai-workforce-page" className="overflow-x-hidden">
      <Seo
        title="AI Workforce | Managed Agentic Coworkers"
        description="Hire a WeHA Workforce agent: a managed, agentic AI coworker that works across your tools end to end. Proactive, self-checking and fully maintained by us. Deployed in days, not months."
        path="/ai-workforce"
        jsonLd={graph([
          ORG,
          {
            "@type": "Service",
            "@id": `${SITE}/ai-workforce#service`,
            name: "AI Workforce",
            serviceType: "Managed agentic AI automation",
            provider: { "@id": `${SITE}/#organization` },
            description:
              "Managed agentic AI coworkers that work across your existing tools end to end. Proactive, self-checking, monitored and maintained by We Help Automate, and fully owned by you.",
            areaServed: "Worldwide",
            url: `${SITE}/ai-workforce`,
          },
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "AI Workforce", path: "/ai-workforce" },
          ]),
        ])}
      />

      {/* HERO */}
      <PageHero
        kicker="AI Workforce"
        title="Hire an agentic coworker."
        italicWord="We manage everything else."
        subtitle="A Workforce agent does the work, not just the talking. It runs across your tools end to end, checks itself, and stays out of your way. We deploy it, monitor it and keep it running, so you get the output without the overhead."
        showForm={false}
        rightSlot={
          <div className="weha-card p-6 md:p-7">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--weha-teal-soft)" }}>
                <Bot size={18} className="text-weha-teal" />
              </span>
              <div>
                <p className="text-sm font-semibold text-weha-text">Workforce agent</p>
                <p className="text-xs text-weha-faint">Active · working now</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {[
                { who: "Inbox", color: "#22c55e", Icon: Inbox, text: "New request came in overnight." },
                { who: "Agent", color: "var(--weha-teal)", Icon: Sparkles, text: "Read it, pulled the context, drafted a reply." },
                { who: "Agent", color: "var(--weha-teal)", Icon: Database, text: "Records updated. Reply queued for send." },
                { who: "Agent", color: "var(--weha-teal)", Icon: Send, text: "Sent. Follow-up scheduled for day 3." },
              ].map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white" style={{ background: l.color }}>
                    <l.Icon size={13} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-weha-text">{l.who}</p>
                    <p className="text-sm text-weha-muted leading-relaxed">{l.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* hero CTAs sit just under the hero copy on their own row */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 -mt-6 md:-mt-10 pb-4">
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <button type="button" onClick={openBooking} className="btn-teal" data-cursor="hover" data-testid="workforce-hero-cta">
              Book my free audit <ArrowRight size={15} />
            </button>
          </Magnetic>
          <Link to="/services" className="btn-ghost" data-cursor="hover">
            See how we build <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      <IntegrationStrip heading="Works across your whole stack" />

      {/* SECTION 2 · A DIFFERENT CATEGORY */}
      <ScrollSection direction="left" settle depth={0.5} intensity={0.45}>
        <section className="section-glass relative section-surface border-y border-weha-border py-24 md:py-32" data-testid="workforce-category">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">A different category of AI</span>
              <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-3xl">
                Not a chatbot. A coworker that gets things done.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-weha-muted max-w-2xl leading-relaxed">
                Most AI tools wait for you to type. A Workforce agent takes real work off your plate,
                runs it to completion, and only comes back when it needs you.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c, i) => {
                const Icon = c.icon;
                return (
                  <Reveal key={c.title} delay={(i % 3) * 0.06}>
                    <div className="weha-card h-full p-7" data-cursor="hover" data-testid={`workforce-capability-${i + 1}`}>
                      <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--weha-teal-soft)" }}>
                        <Icon size={20} className="text-weha-teal" />
                      </span>
                      <h3 className="weha-display text-2xl mt-5 text-weha-text">{c.title}</h3>
                      <p className="mt-3 text-sm text-weha-muted leading-relaxed">{c.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 3 · COMPARISON */}
      <ScrollSection direction="right" settle depth={0.4} intensity={0.4}>
        <section className="section-solid relative py-24 md:py-32" data-testid="workforce-compare">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Why it is different</span>
              <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-4xl">
                Most AI coworkers are still tools you have to run.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-weha-muted max-w-2xl leading-relaxed">
                A Workforce agent is the opposite. It runs itself, and we run it for you.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-12 overflow-x-auto hide-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
                <table className="w-full min-w-[640px] border-collapse" data-testid="workforce-compare-table">
                  <thead>
                    <tr>
                      <th className="text-left p-4 w-[34%]" />
                      {compareCols.map((col) => (
                        <th
                          key={col.key}
                          className={`p-4 text-center align-bottom ${
                            col.highlight ? "rounded-t-2xl" : ""
                          }`}
                          style={col.highlight ? { background: "var(--weha-teal-soft)" } : undefined}
                        >
                          <span
                            className={`weha-display text-lg ${
                              col.highlight ? "text-weha-teal" : "text-weha-text"
                            }`}
                          >
                            {col.name}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map((row, ri) => (
                      <tr key={row.label} className="border-t border-weha-border">
                        <td className="p-4 text-sm text-weha-text font-medium">{row.label}</td>
                        {compareCols.map((col) => (
                          <td
                            key={col.key}
                            className={`p-4 text-center ${col.highlight ? "" : ""} ${
                              col.highlight && ri === compareRows.length - 1 ? "rounded-b-2xl" : ""
                            }`}
                            style={col.highlight ? { background: "var(--weha-teal-soft)" } : undefined}
                          >
                            <CompareCell value={row[col.key]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 4 · REAL THREADS */}
      <ScrollSection direction="left" settle depth={0.5} intensity={0.45}>
        <section className="section-glass relative section-surface border-y border-weha-border py-24 md:py-32" data-testid="workforce-threads">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">In the wild</span>
              <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-3xl">
                Real workflows, running end to end.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-weha-muted max-w-2xl leading-relaxed">
                This is what a Workforce agent looks like on a normal day: it picks up the work,
                finishes it, and keeps you in the loop without making you do the loop.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {threads.map((t, i) => (
                <Reveal key={t.tag} delay={(i % 2) * 0.08}>
                  <ThreadCard tag={t.tag} lines={t.lines} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 5 · TESTIMONIALS + CALLOUT */}
      <ScrollSection direction="right" settle depth={0.4} intensity={0.4}>
        <section className="section-solid relative py-24 md:py-32" data-testid="workforce-proof">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">What teams say</span>
              <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-3xl">
                Run by teams that moved first.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={i} delay={(i % 3) * 0.06}>
                  <figure className="weha-card h-full p-7 flex flex-col" data-cursor="hover">
                    <blockquote className="text-weha-text leading-relaxed flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 pt-5 border-t border-weha-border">
                      <p className="weha-display text-lg text-weha-text">{t.name}</p>
                      <p className="text-sm text-weha-faint">{t.role}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div
                className="mt-10 rounded-3xl px-8 py-12 md:px-14 md:py-16 text-center"
                style={{ background: "var(--weha-teal)" }}
                data-testid="workforce-callout"
              >
                <h3 className="weha-display text-3xl md:text-4xl text-white max-w-3xl mx-auto leading-tight">
                  Your agent manages itself, and we manage your agent.
                </h3>
                <p className="mt-4 text-white/85 max-w-2xl mx-auto leading-relaxed">
                  You get a teammate that never sleeps and a team behind it that keeps it sharp. No
                  prompts to babysit, no broken automations to chase.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 6 · DEPLOYMENT */}
      <ScrollSection direction="left" settle depth={0.5} intensity={0.45}>
        <section className="section-glass relative section-surface border-y border-weha-border py-24 md:py-32" data-testid="workforce-deploy">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">How it starts</span>
              <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-3xl">
                Deployed in days, not months.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={(i % 3) * 0.06}>
                  <div className="weha-card h-full p-7" data-cursor="hover">
                    <span className="weha-display text-4xl text-weha-teal/40">{s.n}</span>
                    <h3 className="weha-display text-2xl mt-3 text-weha-text">{s.title}</h3>
                    <p className="mt-3 text-sm text-weha-muted leading-relaxed">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>

      <CTABanner
        heading="Ready to hire your first Workforce agent?"
        sub="Start with a free audit. We map the workflow worth handing over, then deploy and manage the agent that runs it. You keep the plan either way."
        cta="Book my free audit"
        testid="workforce-cta"
      />
    </div>
  );
}
