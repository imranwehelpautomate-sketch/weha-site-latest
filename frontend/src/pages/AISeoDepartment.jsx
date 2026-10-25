import { Link } from "react-router-dom";
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
} from "lucide-react";
import PageHero from "@/components/PageHero";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import Magnetic from "@/components/Magnetic";
import Seo from "@/components/Seo";
import { useBooking } from "@/context/BookingContext";
import { ORG, WEBSITE, SITE, breadcrumb, webPage, graph } from "@/lib/seoSchemas";

/* ------------------------------------------------------------------ *
 * Section 2: the team. The Director is the only one who talks to you.
 * ------------------------------------------------------------------ */
const team = [
  { icon: Compass, title: "SEO Director", body: "Your one point of contact. Sends the daily brief, runs the weekly and monthly meetings, and never goes silent." },
  { icon: ClipboardList, title: "SEO Manager", body: "Plans each sprint and keeps the team on schedule." },
  { icon: Users, title: "SEO Lead", body: "Reviews the team's work before anything reaches you." },
  { icon: LineChart, title: "SEO Analyst", body: "Measures rankings, traffic and results, and reports only what the evidence shows." },
  { icon: Wrench, title: "Technical SEO", body: "Finds and fixes crawl, speed, schema and indexing problems on your site." },
  { icon: Map, title: "Content Strategist", body: "Chooses the topics worth winning and plans the content around them." },
  { icon: PenLine, title: "Content Writer", body: "Writes drafts in your voice, from your own knowledge base." },
  { icon: Sparkles, title: "AEO/GEO Specialist", body: "Works on being cited in AI answers: ChatGPT, Perplexity, Gemini and Google's AI Overviews." },
  { icon: Megaphone, title: "Distribution Specialist", body: "Gets finished content in front of the right people on your own channels." },
];

/* ------------------------------------------------------------------ *
 * Section 3: why it is safe to hand over.
 * ------------------------------------------------------------------ */
const guarantees = [
  { icon: Server, title: "Runs on your own server", body: "The department lives on infrastructure you control. Your data and conversations stay with you." },
  { icon: ShieldCheck, title: "You approve what matters", body: "Plans, risky site changes and anything public wait for your named approver. Nothing important goes out on its own." },
  { icon: FileCheck, title: "Every fact has a source", body: "The knowledge base is built from your own material, and every fact in it points back to where it came from." },
  { icon: BadgeCheck, title: "Reads only what you grant", body: "Agents see only the data you give them access to. Nothing more." },
];

const steps = [
  { n: "01", title: "We learn your business", body: "We build the knowledge base from your site, documents and data, with a source for every fact." },
  { n: "02", title: "The department starts work", body: "The Director agrees the plan with you. The team audits, fixes, writes and measures, and you approve the changes that matter." },
  { n: "03", title: "You see everything", body: "A daily brief from the Director and a dashboard showing what the team did, what changed and what is next." },
];

export default function AISeoDepartment() {
  const { openBooking } = useBooking();

  return (
    <div data-testid="ai-seo-department-page" className="overflow-x-hidden">
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

      {/* HERO */}
      <PageHero
        kicker="AI SEO Department · now taking pilot partners"
        title="A whole SEO team."
        italicWord="On your own server."
        subtitle="Nine AI SEO specialists, trained on your own data, led by a Director who is your single point of contact. They audit, fix, write and measure every day. You approve what matters."
        showForm={false}
        ctaSlot={
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <button type="button" onClick={openBooking} className="btn-teal" data-cursor="hover" data-testid="seo-hero-cta">
                Ask about a pilot place <ArrowRight size={15} />
              </button>
            </Magnetic>
            <Link to="/success-stories" className="btn-ghost" data-cursor="hover">
              See our SEO work <ArrowUpRight size={15} />
            </Link>
          </div>
        }
        rightSlot={
          <div className="weha-card p-6 md:p-7">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--weha-teal-soft)" }}>
                <Compass size={18} className="text-weha-teal" />
              </span>
              <div>
                <p className="text-sm font-semibold text-weha-text">Your SEO Director</p>
                <p className="text-xs text-weha-faint">Daily brief · example</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {[
                "Technical SEO fixed two pages Google could not index.",
                "Content Writer drafted the pricing guide. It waits for your approval.",
                "The AEO/GEO Specialist found three questions where AI answers cite a competitor.",
                "Next: the Analyst's weekly report on Friday.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm text-weha-muted leading-relaxed">
                  <Check size={16} className="mt-0.5 shrink-0 text-weha-teal" /> {t}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* SECTION 2 · THE TEAM */}
      <ScrollSection direction="left" settle depth={0.5} intensity={0.45}>
        <section className="section-glass relative section-surface border-y border-weha-border py-24 md:py-32" data-testid="seo-team">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Meet the department</span>
              <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-3xl">
                Nine specialists. One person to talk to.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-weha-muted max-w-2xl leading-relaxed">
                Each role does one job well, like a real SEO team. Only the Director talks to you. For
                smaller sites, one Generalist covers the whole job instead.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {team.map((c, i) => {
                const Icon = c.icon;
                return (
                  <Reveal key={c.title} delay={(i % 3) * 0.06}>
                    <div className="weha-card h-full p-7" data-cursor="hover" data-testid={`seo-role-${i + 1}`}>
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

      {/* SECTION 3 · SAFE TO HAND OVER */}
      <ScrollSection direction="right" settle depth={0.4} intensity={0.4}>
        <section className="section-solid relative py-24 md:py-32" data-testid="seo-trust">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Your site, your data, your call</span>
              <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-4xl">
                Built to be trusted with your website.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {guarantees.map((g, i) => {
                const Icon = g.icon;
                return (
                  <Reveal key={g.title} delay={(i % 2) * 0.06}>
                    <div className="weha-card h-full p-7" data-cursor="hover">
                      <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--weha-teal-soft)" }}>
                        <Icon size={20} className="text-weha-teal" />
                      </span>
                      <h3 className="weha-display text-2xl mt-5 text-weha-text">{g.title}</h3>
                      <p className="mt-3 text-sm text-weha-muted leading-relaxed">{g.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={0.1}>
              <p className="mt-10 text-sm text-weha-muted max-w-3xl leading-relaxed">
                Works with WordPress through our plugin. On other platforms, the team prepares ready-to-apply
                change packs for your developer.
              </p>
            </Reveal>
          </div>
        </section>
      </ScrollSection>

      {/* SECTION 4 · HOW IT STARTS */}
      <ScrollSection direction="left" settle depth={0.5} intensity={0.45}>
        <section className="section-glass relative section-surface border-y border-weha-border py-24 md:py-32" data-testid="seo-steps">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">How it starts</span>
              <h2 className="weha-display text-3xl md:text-5xl mt-3 text-weha-text max-w-3xl">
                From your data to a working department.
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
            <Reveal delay={0.1}>
              <p className="mt-10 text-sm text-weha-muted max-w-3xl leading-relaxed">
                We run it on our own website first. Pilot places are limited, for businesses in India, the
                United States and Canada.
              </p>
            </Reveal>
          </div>
        </section>
      </ScrollSection>

      <CTABanner
        heading="Want an SEO department without hiring one?"
        sub="Tell us about your site. We will let you know if a pilot place fits and what the department would work on first."
        cta="Ask about a pilot place"
        testid="seo-cta"
      />
    </div>
  );
}
