import { useState, useEffect, useRef } from "react";

export default function Logo({ className = "", animated = false, morph = false }) {
  // WeHA wordmark — theme-adaptive.
  //   "We" picks up --weha-text (cream on dark, ink on light)
  //   "HA" and the tall vertical stroke use --weha-teal (Ink Violet)
  //
  // `animated`  → the stroke "draws" and "HA" eases in on a slow loop.
  // `morph`     → an intro that starts with the full company name
  //               "We Help Automate" and collapses into the compact
  //               "We | HA" mark, then continues the looping animation.
  //               The collapse fires when the mark scrolls into view, so it
  //               plays instantly in the header (visible on load) and only
  //               when reached in the footer.
  // morph phases: "idle" (full name, waiting to be seen) → "morph" (collapsing) → "rest" (loop)
  // NOTE: the WeHA wordmark animation is an essential brand element, so it plays
  // regardless of the OS "reduce motion" setting. (Previously this was gated on
  // prefers-reduced-motion, which left the logo permanently static on Windows /
  // VMs / test browsers that report `reduce` by default — while it animated on
  // Macs where motion is on. See index.css: the logo is intentionally excluded
  // from the reduced-motion overrides for the same reason.)
  const [phase, setPhase] = useState(morph ? "idle" : "rest");
  const wrapRef = useRef(null);

  // Trigger the collapse once the mark is visible in the viewport.
  useEffect(() => {
    if (phase !== "idle") return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setPhase("morph");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase("morph");
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [phase]);

  // Hand off to the looping compact mark once the collapse finishes.
  useEffect(() => {
    if (phase !== "morph") return;
    const t = setTimeout(() => setPhase("rest"), 2850);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Intro: full company name collapsing into the compact mark ──
  if (phase === "idle" || phase === "morph") {
    return (
      <span
        ref={wrapRef}
        className={`weha-logo weha-logo--morph inline-flex items-center select-none ${
          phase === "morph" ? "is-collapsing" : ""
        } ${className}`}
        data-testid="weha-logo"
        aria-label="WeHA — We Help Automate"
      >
        <span className="weha-logo__word weha-logo__we text-weha-text">We</span>
        <span aria-hidden="true" className="weha-logo__stroke bg-weha-teal" />
        <span className="weha-logo__word weha-logo__ha text-weha-teal">
          H
          <span className="weha-logo__collapse">elp</span>
          <span className="weha-logo__collapse weha-logo__collapse--space">{"\u00A0"}</span>
          A
          <span className="weha-logo__collapse">utomate</span>
        </span>
      </span>
    );
  }

  // ── Resting compact mark (optionally looping) ──
  // After a morph intro we use the `--loop` variant whose looping animation
  // begins already "built" for a seamless handoff from the collapse.
  const animClass = animated ? (morph ? "weha-logo--loop" : "weha-logo--animated") : "";
  return (
    <span
      className={`weha-logo inline-flex items-center select-none ${animClass} ${className}`}
      data-testid="weha-logo"
      aria-label="WeHA — We Help Automate"
    >
      <span className="weha-logo__word weha-logo__we text-weha-text">We</span>
      <span aria-hidden="true" className="weha-logo__stroke bg-weha-teal" />
      <span className="weha-logo__word weha-logo__ha text-weha-teal">HA</span>
    </span>
  );
}
