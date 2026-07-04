// FlowDiagram - an animated workflow pipeline. A faint dashed track connects a
// row (desktop) or column (mobile) of nodes; a violet path draws itself segment
// by segment while a small dot travels each segment, activating the next node
// when it arrives. The rhythm is deliberately unhurried, like a packet moving
// through a system. Node positions are measured from the DOM so the connectors
// stay accurate across breakpoints and label sizes; only transforms, opacity
// and SVG pathLength are ever animated.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";

const DRAW = 0.45; // seconds for one segment to draw / one dot to travel
const STEP = 0.95; // seconds between the start of consecutive segments
const PULSE = 0.4; // node activation scale pulse

export default function FlowDiagram({
  steps = [],
  autoPlay = true,
  replayKey,
  className = "",
}) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const inView = useInView(containerRef, { once: true, margin: "-60px" });

  const N = steps.length;

  // Vertical (stacked) layout below the md breakpoint.
  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setVertical(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Measured geometry: container size + each node box rect (relative to container).
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [rects, setRects] = useState([]);

  const measure = () => {
    const c = containerRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    const next = [];
    for (let i = 0; i < N; i++) {
      const el = nodeRefs.current[i];
      if (!el) return; // not laid out yet
      const r = el.getBoundingClientRect();
      next.push({
        cx: r.left - cr.left + r.width / 2,
        cy: r.top - cr.top + r.height / 2,
        left: r.left - cr.left,
        right: r.right - cr.left,
        top: r.top - cr.top,
        bottom: r.bottom - cr.top,
      });
    }
    setSize({ w: cr.width, h: cr.height });
    setRects(next);
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vertical, N]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vertical, N]);

  const centersReady = rects.length === N && N > 0;

  // Connector endpoints per segment: through node centers on desktop (labels sit
  // below, so nothing is crossed); edge-to-edge in the gaps when stacked.
  const segPoints = [];
  if (centersReady) {
    for (let s = 0; s < N - 1; s++) {
      const a = rects[s];
      const b = rects[s + 1];
      if (vertical) {
        segPoints.push({ x1: a.cx, y1: a.bottom, x2: b.cx, y2: b.top });
      } else {
        segPoints.push({ x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy });
      }
    }
  }

  // --- Sequencing state -----------------------------------------------------
  // activeUpTo: highest index of an activated node. drawing: segment currently
  // being drawn (-1 = none).
  const [activeUpTo, setActiveUpTo] = useState(0);
  const [drawing, setDrawing] = useState(-1);
  const firstReplay = useRef(replayKey);

  useEffect(() => {
    if (reduceMotion) return; // final state rendered via derived values below
    if (!centersReady) return;

    const isReplay = replayKey !== firstReplay.current;
    const shouldRun = isReplay || (inView && autoPlay);
    if (!shouldRun) return;

    // Reset, then walk the pipeline one segment at a time.
    setActiveUpTo(0);
    setDrawing(-1);
    const timers = [];
    let t = 0;
    for (let s = 0; s < N - 1; s++) {
      const start = t;
      timers.push(setTimeout(() => setDrawing(s), start * 1000));
      timers.push(
        setTimeout(() => {
          setActiveUpTo(s + 1);
          setDrawing(-1);
        }, (start + DRAW) * 1000)
      );
      t += STEP;
    }
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, centersReady, replayKey, reduceMotion, autoPlay, N, vertical]);

  // Derived per-element states (reduced motion => everything already complete).
  const nodeActive = (i) => reduceMotion || i <= activeUpTo;
  const segTarget = (s) =>
    reduceMotion || s < activeUpTo || s === drawing ? 1 : 0;

  const nodeVariants = {
    idle: { scale: 1 },
    active: { scale: [1, 1.12, 1], transition: { duration: PULSE, ease: EASE } },
  };
  const ringVariants = {
    idle: { scale: 0.9, opacity: 0 },
    active: {
      scale: [0.9, 1.6],
      opacity: [0.5, 0],
      transition: { duration: 0.6, ease: EASE },
    },
  };

  return (
    <div
      ref={containerRef}
      data-testid="flow-diagram"
      className={`relative w-full ${className}`}
    >
      {/* Connector layer (behind the nodes). */}
      {centersReady && size.w > 0 && (
        <svg
          className="pointer-events-none absolute inset-0"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          {segPoints.map((p, s) => (
            <g key={`seg-${s}`}>
              {/* faint always-visible dashed track */}
              <line
                x1={p.x1}
                y1={p.y1}
                x2={p.x2}
                y2={p.y2}
                stroke="var(--weha-border)"
                strokeWidth={2}
                strokeDasharray="4 5"
                strokeLinecap="round"
              />
              {/* violet path that draws itself when it is this segment's turn */}
              <motion.line
                x1={p.x1}
                y1={p.y1}
                x2={p.x2}
                y2={p.y2}
                stroke="var(--weha-teal)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: reduceMotion ? 1 : 0 }}
                animate={{ pathLength: segTarget(s) }}
                transition={{ duration: DRAW, ease: EASE }}
                style={{ willChange: "stroke-dashoffset" }}
              />
            </g>
          ))}
        </svg>
      )}

      {/* Traveling dot for the segment being drawn. Keyed so it restarts per
          segment. */}
      {!reduceMotion && centersReady && drawing >= 0 && segPoints[drawing] && (
        <motion.span
          key={`dot-${drawing}-${replayKey}`}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            left: segPoints[drawing].x1,
            top: segPoints[drawing].y1,
            background: "var(--weha-teal)",
            zIndex: 1,
            willChange: "transform",
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: segPoints[drawing].x2 - segPoints[drawing].x1,
            y: segPoints[drawing].y2 - segPoints[drawing].y1,
            opacity: 1,
          }}
          transition={{ duration: DRAW, ease: EASE }}
        />
      )}

      {/* Nodes */}
      <div
        className={
          vertical
            ? "relative flex flex-col items-center gap-10"
            : "relative grid items-start gap-4"
        }
        style={
          vertical
            ? { zIndex: 2 }
            : { zIndex: 2, gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }
        }
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          const active = nodeActive(i);
          return (
            <div
              key={i}
              className={
                vertical
                  ? "flex w-full max-w-sm items-center gap-5 text-left"
                  : "flex flex-col items-center text-center"
              }
            >
              {/* node box */}
              <motion.div
                ref={(el) => (nodeRefs.current[i] = el)}
                className="relative flex items-center justify-center rounded-2xl shrink-0"
                style={{
                  width: 60,
                  height: 60,
                  background: "var(--weha-elevated)",
                  border: "1px solid",
                  borderColor: active
                    ? "color-mix(in srgb, var(--weha-teal) 35%, transparent)"
                    : "var(--weha-border)",
                  transition: "border-color 0.3s ease",
                  willChange: "transform",
                }}
                variants={nodeVariants}
                animate={reduceMotion ? false : active ? "active" : "idle"}
              >
                {/* activation ring (expands + fades once) */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    border: "2px solid var(--weha-teal)",
                    willChange: "transform, opacity",
                  }}
                  variants={ringVariants}
                  animate={reduceMotion ? "idle" : active ? "active" : "idle"}
                />
                {Icon && (
                  <Icon
                    size={20}
                    style={{
                      color: active ? "var(--weha-teal)" : "var(--weha-muted)",
                      transition: "color 0.3s ease",
                    }}
                  />
                )}
              </motion.div>

              {/* labels fade up into place on activation */}
              <motion.div
                className={vertical ? "flex-1 min-w-0" : "mt-3"}
                style={vertical ? undefined : { maxWidth: 150 }}
                initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 8 }}
                animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: DUR.reveal, ease: EASE }
                }
              >
                <p className="text-sm font-semibold text-weha-text">{step.title}</p>
                <p className="mt-0.5 text-xs text-weha-muted">{step.caption}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
