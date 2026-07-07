import PageHero from "@/components/PageHero";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import IntegrationStrip from "@/components/IntegrationStrip";
import Magnetic from "@/components/Magnetic";
import CountUp from "@/components/CountUp";
import FlowDiagram from "@/components/FlowDiagram";
import Seo from "@/components/Seo";
import { motion } from "framer-motion";
import { Linkedin, Search, Wrench, BadgeCheck, KeyRound, FileText, GraduationCap, Workflow, Users, Zap, Layers, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { PLAYBOOK_URL } from "@/lib/resourceLinks";
import { ORG, SITE, breadcrumb, graph } from "@/lib/seoSchemas";

const ASSET = (p) => `${process.env.PUBLIC_URL || ""}${p}`;

const story = [
  "Look at almost any capable team and you'll find the same thing: smart people losing hours every week to work software should be doing for them. Copying data between tools. Chasing the same follow-ups. Rebuilding the same report by hand, every single week.",
  "Most businesses already sense that AI could help. What they don't have is a clear place to start. And too many AI agencies make it worse, overcomplicating simple problems or locking clients into tools they can never leave.",
  "WeHA was started by two operators who had spent years building marketing and automation systems for other people. They decided to build the agency they wished existed: one that builds practical systems on the tools you already use, proves they work, then hands them over.",
];

const belief = "Automation should give you ownership and time back, not another subscription you're trapped in.";

const mission =
  "To make practical AI automation accessible to any business: built fast, built on the tools you already use, and built to be owned by you.";

const vision =
  "A world where small and mid-sized teams compete on ideas and service, not on how many hours they can grind, because the repetitive work runs itself.";

const founders = [
  {
    name: "Imran Shaikh",
    role: "Co-Founder",
    photo: ASSET("/founders/imran.jpeg"),
    alt: "Portrait of Imran Shaikh, Co-Founder of WeHA",
    bio: "Imran is a full-stack marketer and AI systems builder with 8+ years across SEO, paid media, content, analytics and RevOps. He builds AI agents and automated workflows on a modern stack including OpenClaw, n8n, Claude Code and Zapier, and believes marketing and operations should run on systems, not manual effort. An IIM Kozhikode alum (Digital Marketing for Performance & Growth), he leads what WeHA builds: the automation systems and AI agents behind every engagement.",
  },
  {
    name: "Selena Thomas",
    role: "Co-Founder & COO",
    photo: ASSET("/founders/selena.jpeg"),
    alt: "Portrait of Selena Thomas, Co-Founder and COO of WeHA",
    bio: "Selena is a digital marketing leader with experience across Mastercard, Merkle Sokrati and Cybage. She leads operations, client relationships and go-to-market at WeHA, making sure every engagement starts with the right questions and that clients get a clear, human experience from the first call to handoff.",
    linkedin: "https://www.linkedin.com/in/selena-thomas-9839472b8/",
  },
];

const stats = [
  { value: 10, suffix: "+", label: "years across marketing & automation" },
  { value: 30, suffix: "+", label: "tools we build and automate across" },
  { value: 100, suffix: "%", label: "yours: code, docs and accounts" },
  { value: 0, text: "Days", label: "to your first live automation" },
];

const howWeWork = [
  { icon: Search, title: "Listen", caption: "We map how you actually work" },
  { icon: Wrench, title: "Build", caption: "One system, on your tools" },
  { icon: BadgeCheck, title: "Prove", caption: "We show it works on real data" },
  { icon: KeyRound, title: "Hand over", caption: "Docs, accounts and keys to you" },
];

const deliverables = [
  { icon: Workflow, title: "A working system", body: "Built and running on the tools you already use, doing real work from day one." },
  { icon: FileText, title: "Full documentation", body: "Every workflow written up in plain English, so nothing lives only in someone's head." },
  { icon: KeyRound, title: "All your accounts", body: "Every credential, key and login handed to you. You own the whole thing, no strings." },
  { icon: GraduationCap, title: "A team that can run it", body: "We walk your people through it so they can operate and tweak it with confidence." },
];

const reasons = [
  { icon: Users, title: "Operators, not theorists", body: "We've run marketing and operations ourselves, so we build systems that hold up in the real world, not slideware." },
  { icon: Zap, title: "Live in days, not months", body: "You see a working automation fast. We expand from proven results, never from promises." },
  { icon: Layers, title: "Built on your tools", body: "We automate on top of the stack you already use wherever we can. No rip-outs, no forced migrations." },
  { icon: KeyRound, title: "You own everything", body: "Code, docs and accounts are handed over. No lock-in, and no monthly hostage fees." },
];

export default function About() {
  const { openBooking } = useBooking();
  return (
    <div data-testid="about-page" className="overflow-x-hidden">
      <Seo
        title="About WeHA"
        description="Meet WeHA, an AI automation studio built by two operators. We build practical systems on the tools you already use, and hand them over to you."
        path="/about"
        jsonLd={graph([
          ORG,
          {
            "@type": "Person",
            name: "Imran Shaikh",
            jobTitle: "Co-Founder",
            worksFor: { "@id": `${SITE}/#organization` },
          },
          {
            "@type": "Person",
            name: "Selena Thomas",
            jobTitle: "Co-Founder & COO",
            worksFor: { "@id": `${SITE}/#organization` },
            sameAs: ["https://www.linkedin.com/in/selena-thomas-9839472b8/"],
          },
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ])}
      />
      <PageHero
        kicker="About"
        title="We help businesses do more"
        italicWord="with less manual work."
        subtitle="WeHA exists because too many capable teams spend their days on work software should be doing for them. We build the systems that give that time back."
        formHeading="Get the free AI Transformation Playbook"
        formSubheading="A practical 10-chapter framework for figuring out where AI fits, what to automate first, and how to roll it out. No jargon, no obligation."
        formTestid="about-lead-form"
        formSource="playbook:about-hero"
        formDownloadUrl={PLAYBOOK_URL}
      />

      <IntegrationStrip heading="The tools we build with" />

      {/* SECTION 1 - OUR STORY */}
      <ScrollSection direction="left">
      <section className="section-glass relative section-solid py-12 md:py-20" data-testid="about-story">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Why WeHA exists</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text leading-tight">
              The work nobody should be doing by hand.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-6 text-lg text-weha-muted leading-relaxed">
            {story.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={i === 0 ? "text-weha-text" : ""}>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-10 weha-display text-2xl md:text-3xl text-weha-text italic leading-snug border-l-[3px] border-weha-teal pl-5">
              {belief}
            </p>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 1.5 - BY THE NUMBERS (animated stats) */}
      <ScrollSection direction="right">
      <section className="section-glass relative py-16 md:py-24 overflow-hidden" style={{ background: "#171614", "--weha-bg": "#171614", "--weha-text": "#f7f6f2" }} data-testid="about-stats">
        <div
          className="absolute inset-0 opacity-[0.5] pointer-events-none"
          style={{ background: "radial-gradient(circle at 20% 30%, rgba(155,128,224,0.28), transparent 55%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#9b80e0" }}>Where we stand</span>
            <h2 className="weha-display text-3xl md:text-4xl mt-3 text-[#f7f6f2] max-w-2xl leading-snug">
              Small studio. Serious operators.
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-y-10">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className={i > 0 ? "md:border-l md:pl-8" : ""} style={i > 0 ? { borderColor: "rgba(155,128,224,0.15)" } : undefined}>
                  <p className="weha-display text-5xl md:text-6xl" style={{ color: "#9b80e0" }}>
                    <CountUp value={s.value} suffix={s.suffix} text={s.text} />
                  </p>
                  <p className="mt-3 text-[#c9c5bd] leading-snug">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 2 - MISSION & VISION */}
      <ScrollSection direction="right">
      <section className="section-glass py-20 md:py-28 bg-weha-surface border-y border-weha-border" data-testid="about-mission-vision">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Our mission</span>
              <p className="weha-display text-3xl md:text-4xl mt-4 text-weha-text leading-snug">{mission}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Our vision</span>
              <p className="weha-display text-3xl md:text-4xl mt-4 text-weha-text leading-snug">{vision}</p>
            </div>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 2.5 - HOW WE WORK (animated process) */}
      <ScrollSection direction="left">
      <section className="section-glass relative section-solid py-20 md:py-28" data-testid="about-process">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">How we work</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text leading-tight">
              Four steps. No mystery.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 text-lg text-weha-muted max-w-2xl leading-relaxed">
              Every engagement follows the same simple path, from understanding how you work to
              handing you the keys. You always know exactly where things stand.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-14">
              <FlowDiagram steps={howWeWork} />
            </div>
          </Reveal>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 3 - MEET THE FOUNDERS */}
      <ScrollSection direction="left">
      <section className="section-glass relative section-solid py-20 md:py-28" data-testid="about-founders">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">The team</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text">Meet the founders.</h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {founders.map((f, i) => (
              <Reveal key={f.name} delay={(i % 2) * 0.1}>
                <motion.article
                  className="weha-card group h-full p-7 md:p-8"
                  data-testid={`founder-card-${i + 1}`}
                  data-cursor="hover"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <div className="overflow-hidden rounded-2xl border border-weha-border bg-weha-surface aspect-square w-32 md:w-40">
                    <img
                      src={f.photo}
                      alt={f.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      data-testid={`founder-photo-${i + 1}`}
                    />
                  </div>
                  <div className="mt-6 flex items-center gap-3 flex-wrap">
                    <h3 className="weha-display text-3xl text-weha-text">{f.name}</h3>
                    {f.linkedin && (
                      <Magnetic strength={0.3}>
                        <a
                          href={f.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${f.name} on LinkedIn`}
                          data-cursor="hover"
                          data-testid={`founder-linkedin-${i + 1}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-weha-border text-weha-muted transition-colors hover:border-weha-teal hover:text-weha-teal"
                        >
                          <Linkedin size={16} />
                        </a>
                      </Magnetic>
                    )}
                  </div>
                  <p className="mt-1 text-sm uppercase tracking-wider text-weha-teal">{f.role}</p>
                  <p className="mt-4 text-weha-muted leading-relaxed">{f.bio}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 3.5 - WHAT YOU WALK AWAY WITH (animated cards) */}
      <ScrollSection direction="right">
      <section className="section-glass py-20 md:py-28 bg-weha-surface border-y border-weha-border" data-testid="about-deliverables">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">What you walk away with</span>
            <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text leading-tight">
              You keep everything. Literally.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map((d, i) => {
              const Icon = d.icon;
              return (
                <Reveal key={d.title} delay={(i % 4) * 0.06}>
                  <motion.div
                    className="weha-card h-full p-7"
                    data-cursor="hover"
                    data-testid={`deliverable-${i + 1}`}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <motion.span
                      className="grid h-12 w-12 place-items-center rounded-xl"
                      style={{ background: "var(--weha-teal-soft)" }}
                      whileHover={{ rotate: -8, scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Icon size={22} className="text-weha-teal" />
                    </motion.span>
                    <h3 className="weha-display text-2xl mt-5 text-weha-text">{d.title}</h3>
                    <p className="mt-3 text-sm text-weha-muted leading-relaxed">{d.body}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 4 - REASONS TO CHOOSE WEHA (two-column, animated grid) */}
      <ScrollSection direction="left">
      <section className="section-glass relative section-solid py-20 md:py-28" data-testid="about-reasons">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:items-start">
          {/* Left: intro + CTA (sticks on desktop) */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">Why teams pick us</span>
              <h2 className="weha-display text-4xl md:text-5xl mt-3 text-weha-text leading-[1.05]">
                Reasons to build{" "}
                <span className="italic text-weha-teal">with WeHA.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg text-weha-muted leading-relaxed max-w-md">
                We are a fast growing firm run by people who have actually done the work. That shows up in
                how fast we move, how little we lock you in, and how clearly we explain everything.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8">
                <Magnetic>
                  <button
                    type="button"
                    onClick={openBooking}
                    className="btn-teal"
                    data-cursor="hover"
                    data-testid="about-reasons-cta"
                  >
                    Talk to the founders <ArrowRight size={16} />
                  </button>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          {/* Right: 2-col animated reason cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <Reveal key={r.title} delay={(i % 2) * 0.06}>
                  <motion.div
                    className="weha-card h-full p-6 md:p-7"
                    data-cursor="hover"
                    data-testid={`about-reason-${i + 1}`}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <motion.span
                      className="grid h-11 w-11 place-items-center rounded-xl"
                      style={{ background: "var(--weha-teal-soft)" }}
                      whileHover={{ rotate: -8, scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Icon size={20} className="text-weha-teal" />
                    </motion.span>
                    <h3 className="weha-display text-xl md:text-2xl mt-4 text-weha-text">{r.title}</h3>
                    <p className="mt-2.5 text-sm text-weha-muted leading-relaxed">{r.body}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      </ScrollSection>

      {/* SECTION 5 - CTA BANNER */}
      <ScrollSection direction="left">
      <CTABanner
        heading="Let's give your team its time back."
        sub="Start with a free AI Audit. We map how you work, then show you what's worth automating first."
        cta="Book a Free Audit"
        testid="about-cta"
      />
      </ScrollSection>
    </div>
  );
}
