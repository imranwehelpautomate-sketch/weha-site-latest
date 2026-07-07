// CountUp - animates a number from 0 up to `value` the first time it scrolls
// into view, then re-animates smoothly whenever `value` changes afterwards
// (so it stays responsive when wired to a live control like a slider).
// Follows the same in-view convention as Reveal.jsx (once, margin "-60px").
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

export default function CountUp({
  value,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  text = null,
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);
  // Whether the first count-up has already fired; subsequent runs count from
  // the current displayed value rather than restarting at 0.
  const started = useRef(false);

  const format = (n) =>
    `${prefix}${Number(n).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    // Reduced motion: jump straight to the final value, no tween.
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    // Hold the starting value until the number scrolls into view.
    if (!inView) return;

    const from = started.current ? display : 0;
    started.current = true;
    const controls = animate(from, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
    // `display` is intentionally excluded: including it would restart the
    // tween on every frame. We read its latest value via the closure instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, reduceMotion, duration]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {text != null ? `${prefix}${text}${suffix}` : format(display)}
    </span>
  );
}
