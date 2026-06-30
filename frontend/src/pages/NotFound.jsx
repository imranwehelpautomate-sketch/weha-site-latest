import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cog, Home, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import { EASE } from "@/lib/motion";

// Reuse the same WhatsApp identity as the floating button.
const WHATSAPP_NUMBER = "918180861084";
const WHATSAPP_PREFILL =
  "Hi WeHA — I got a little lost on your site (a 404, oops). I'd love some help automating my way out of manual work!";
const WA_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;

// Witty "busywork" chips that drift in the background — the kind of manual
// chaos automation makes disappear (hence the strike-through).
const CHIPS = [
  { label: "copy → paste → repeat", top: "16%", left: "8%", rot: "-6deg", dur: "8.5s", delay: "0s" },
  { label: "manual data entry", top: "28%", left: "78%", rot: "5deg", dur: "10s", delay: "0.6s" },
  { label: "Spreadsheet_v7_FINAL_final.xlsx", top: "70%", left: "10%", rot: "4deg", dur: "9.4s", delay: "1.1s" },
  { label: "CC: literally everyone", top: "78%", left: "72%", rot: "-4deg", dur: "8.8s", delay: "0.3s" },
  { label: "Re: Re: Re: follow-up", top: "44%", left: "84%", rot: "7deg", dur: "11s", delay: "1.6s" },
  { label: "TODO: automate this 🙃", top: "58%", left: "4%", rot: "-3deg", dur: "9.8s", delay: "0.9s" },
  { label: "404 unread emails", top: "86%", left: "80%", rot: "3deg", dur: "10.6s", delay: "1.3s" },
];

// A loose constellation (nodes + links) echoing the brand's network motif.
const NODES = [
  { x: 120, y: 90 }, { x: 300, y: 180 }, { x: 470, y: 110 }, { x: 660, y: 200 },
  { x: 840, y: 120 }, { x: 200, y: 360 }, { x: 410, y: 420 }, { x: 620, y: 380 },
  { x: 800, y: 440 }, { x: 520, y: 260 }, { x: 70, y: 500 }, { x: 900, y: 320 },
];
const LINKS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, 7], [7, 8],
  [9, 2], [9, 6], [9, 7], [3, 11], [4, 11], [5, 10], [6, 10], [8, 11],
];

const WhatsAppGlyph = (props) => (
  <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M16.003 3C9.39 3 4 8.388 4 14.997c0 2.357.687 4.564 1.997 6.45L4 29l7.78-2.04a12 12 0 0 0 4.224.762h.001C22.61 27.722 28 22.334 28 15.725 28 12.547 26.748 9.557 24.476 7.288 22.205 5.018 19.182 3.001 16.004 3.001Zm0 21.778h-.002a9.74 9.74 0 0 1-4.969-1.36l-.357-.212-4.62 1.212 1.234-4.5-.232-.37a9.7 9.7 0 0 1-1.49-5.151c0-5.378 4.378-9.757 9.762-9.757 2.605 0 5.053 1.014 6.892 2.857a9.7 9.7 0 0 1 2.856 6.9c0 5.378-4.376 9.757-9.762 9.757Zm5.353-7.305c-.292-.146-1.728-.852-1.996-.949-.268-.097-.463-.146-.658.146s-.755.948-.926 1.144c-.17.195-.34.219-.633.073-.293-.146-1.237-.456-2.357-1.456-.872-.778-1.46-1.74-1.63-2.033-.17-.292-.018-.45.128-.595.131-.131.293-.341.439-.512.146-.17.195-.293.293-.487.097-.195.05-.366-.024-.512s-.658-1.586-.902-2.176c-.236-.57-.477-.493-.658-.5l-.561-.01a1.078 1.078 0 0 0-.78.366c-.268.292-1.024 1-1.024 2.437 0 1.437 1.049 2.826 1.195 3.02.146.195 2.065 3.156 5.005 4.428.7.302 1.245.482 1.671.617.702.224 1.34.192 1.846.117.563-.084 1.728-.706 1.972-1.387.243-.682.243-1.266.17-1.387-.072-.122-.268-.195-.561-.341Z" />
  </svg>
);

export default function NotFound() {
  return (
    <section
      data-testid="notfound-page"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-5 py-28 md:py-32"
    >
      <Seo
        title="404 — Lost in manual work"
        description="This page wandered off. Don't worry — WeHA helps you automate your way out of manual work. Connect with us on WhatsApp."
        path="/404"
        noindex
      />

      {/* ───────────────────────── Background animation ───────────────────────── */}
      <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Drifting brand blobs */}
        <span
          className="weha-404-blob"
          style={{ width: "44vw", height: "44vw", top: "-12%", left: "-8%", background: "radial-gradient(circle at 30% 30%, var(--weha-teal), transparent 70%)", animationDelay: "0s" }}
        />
        <span
          className="weha-404-blob"
          style={{ width: "40vw", height: "40vw", bottom: "-14%", right: "-10%", background: "radial-gradient(circle at 70% 70%, var(--weha-teal), transparent 70%)", opacity: 0.35, animationDelay: "-7s" }}
        />

        {/* Constellation network */}
        <svg
          className="weha-404-grid absolute inset-0 h-full w-full opacity-70"
          viewBox="0 0 960 560"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke="var(--weha-teal)" strokeOpacity="0.18" strokeWidth="1">
            {LINKS.map(([a, b], i) => (
              <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
            ))}
          </g>
          {NODES.map((n, i) => (
            <circle
              key={i}
              className="weha-404-node"
              cx={n.x}
              cy={n.y}
              r={i % 3 === 0 ? 4.5 : 3}
              fill="var(--weha-teal)"
              style={{ "--tdur": `${3 + (i % 4)}s`, "--delay": `${(i % 5) * 0.4}s` }}
            />
          ))}
        </svg>

        {/* Floating busywork chips */}
        {CHIPS.map((c, i) => (
          <span
            key={i}
            className={`weha-404-chip absolute select-none whitespace-nowrap rounded-full border border-weha-border bg-weha-surface/70 px-3 py-1.5 text-xs sm:text-sm text-weha-faint line-through backdrop-blur-sm ${
              i > 3 ? "hidden sm:inline-block" : "inline-block"
            }`}
            style={{ top: c.top, left: c.left, "--rot": c.rot, "--dur": c.dur, "--delay": c.delay }}
          >
            {c.label}
          </span>
        ))}
      </div>

      {/* ───────────────────────────── Content ───────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        className="relative z-10 mx-auto w-full max-w-2xl text-center"
      >
        <motion.span
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-weha-border bg-weha-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-weha-teal backdrop-blur-sm"
        >
          Error 404 — Workflow not found
        </motion.span>

        {/* 4 ⚙ 4 — the cog is the only thing still running */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-6 flex items-center justify-center gap-2 sm:gap-4 text-weha-text"
        >
          <span className="weha-display leading-none text-[6.5rem] sm:text-[9rem] lg:text-[11rem]">4</span>
          <Cog className="weha-404-cog text-weha-teal h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40" strokeWidth={1.25} />
          <span className="weha-display leading-none text-[6.5rem] sm:text-[9rem] lg:text-[11rem]">4</span>
        </motion.div>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: EASE }}
          className="-mt-2 text-sm text-weha-faint italic"
        >
          (the cog is the only thing still running on this page)
        </motion.p>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: EASE }}
          className="weha-display mt-6 text-4xl sm:text-5xl lg:text-6xl leading-[1.06] text-weha-text"
        >
          This page got lost in the{" "}
          <span className="italic text-weha-teal">busywork.</span>
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mt-5 max-w-xl text-lg text-weha-muted leading-relaxed"
        >
          We automate just about everything around here — yet this URL somehow
          slipped through the cracks. Honestly? Very on-brand for manual work.
        </motion.p>

        {/* The requested message */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mt-8 max-w-xl text-xl sm:text-2xl font-medium text-weha-text leading-snug"
          data-testid="notfound-message"
        >
          Lost in manual work? Don&apos;t worry — if you think you&apos;re lost,
          we&apos;re here to help. <span className="text-weha-teal">Connect on WhatsApp</span> 👇
        </motion.p>

        {/* Centered WhatsApp widget */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-8 flex flex-col items-center"
        >
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="notfound-whatsapp"
            data-cursor="hover"
            aria-label="Connect with WeHA on WhatsApp"
            className="group relative inline-flex items-center gap-3 rounded-full px-7 py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-black/15 outline-none transition-transform hover:scale-[1.03] active:scale-95 focus-visible:ring-4 focus-visible:ring-weha-teal/30"
            style={{ backgroundColor: "var(--weha-teal)" }}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15">
              <span
                className="weha-whatsapp-pulse absolute inset-0 rounded-full"
                style={{ backgroundColor: "#ffffff" }}
                aria-hidden="true"
              />
              <WhatsAppGlyph width="22" height="22" className="relative text-white" />
            </span>
            Connect on WhatsApp
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
          <span className="mt-3 text-sm text-weha-faint">Real humans, fast replies · +91 81808 61084</span>
        </motion.div>

        {/* Secondary escape hatches */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm"
        >
          <Link
            to="/"
            data-testid="notfound-home"
            className="inline-flex items-center gap-2 font-medium text-weha-text transition-colors hover:text-weha-teal"
          >
            <Home size={16} /> Take me home
          </Link>
          <span className="hidden sm:inline text-weha-faint">·</span>
          <Link
            to="/services"
            data-testid="notfound-services"
            className="inline-flex items-center gap-2 font-medium text-weha-muted transition-colors hover:text-weha-teal"
          >
            See what we automate <ArrowRight size={15} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
