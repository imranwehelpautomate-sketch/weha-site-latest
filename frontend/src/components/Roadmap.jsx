import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/*
 * Roadmap — an animated "curved road" that showcases the engagement steps.
 *
 * Desktop (md+): a horizontal winding SVG road whose stroke draws itself in as
 * the section scrolls into view, with a glowing dot that travels the road on a
 * loop. Four milestone "stations" sit exactly on the curve (top / bottom /
 * top / bottom) with a numbered marker and a content card.
 *
 * Mobile (< md): a vertical animated spine with the same stations stacked.
 *
 * The desktop alignment trick: the SVG uses preserveAspectRatio="none", so its
 * viewBox coordinates map linearly to the element box on both axes. HTML
 * stations positioned with left = x/1000 and top = y/600 therefore land exactly
 * on the same point of the path at any width.
 */

const VIEW_W = 1000;
const VIEW_H = 600;

// Milestone coordinates in viewBox space. Alternating top / bottom.
const NODES = [
  { x: 140, y: 260, place: "top" },
  { x: 380, y: 380, place: "bottom" },
  { x: 620, y: 260, place: "top" },
  { x: 880, y: 380, place: "bottom" },
];

const ROAD_PATH =
  "M 30,260 L 140,260 C 300,260 220,380 380,380 C 540,380 460,260 620,260 C 780,260 700,380 880,380 L 970,380";

export default function Roadmap({ steps = [] }) {
  const nodes = steps.slice(0, 4);

  return (
    <div data-testid="roadmap">
      {/* ---------- DESKTOP: horizontal curved road ---------- */}
      <div className="relative hidden md:block" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--weha-teal)" stopOpacity="0.15" />
              <stop offset="50%" stopColor="var(--weha-teal)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--weha-teal)" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* faint full road underneath */}
          <path
            d={ROAD_PATH}
            stroke="var(--weha-border)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 10"
          />

          {/* the animated drawing road */}
          <motion.path
            id="roadPath"
            d={ROAD_PATH}
            stroke="url(#roadGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.9, ease: EASE }}
          />

          {/* glowing dot that travels the road on a loop */}
          <circle r="7" fill="var(--weha-teal)" opacity="0.95">
            <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" path={ROAD_PATH} />
          </circle>
          <circle r="14" fill="var(--weha-teal)" opacity="0.18">
            <animateMotion dur="4s" repeatCount="indefinite" path={ROAD_PATH} />
          </circle>
        </svg>

        {/* stations */}
        {nodes.map((s, i) => {
          const node = NODES[i];
          const isTop = node.place === "top";
          return (
            <div
              key={s.num}
              className="absolute"
              style={{ left: `${(node.x / VIEW_W) * 100}%`, top: `${(node.y / VIEW_H) * 100}%` }}
              data-testid={`roadmap-node-${i + 1}`}
            >
              {/* card */}
              <motion.div
                className={`absolute left-1/2 w-[240px] -translate-x-1/2 ${
                  isTop ? "bottom-full mb-9" : "top-full mt-9"
                }`}
                initial={{ opacity: 0, y: isTop ? 16 : -16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.35 + i * 0.42 }}
              >
                <div className="weha-card p-5" data-cursor="hover">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-weha-faint">
                    Step {s.num} · {s.meta}
                  </p>
                  <h3 className="weha-display text-2xl mt-1.5 text-weha-text">{s.name}</h3>
                  <p className="mt-2.5 text-sm text-weha-muted leading-relaxed">{s.body}</p>
                </div>
              </motion.div>

              {/* stalk from card to marker */}
              <motion.span
                className={`absolute left-1/2 w-px -translate-x-1/2 bg-weha-teal/40 ${
                  isTop ? "bottom-full h-6" : "top-full h-6"
                }`}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.35 + i * 0.42 }}
                style={{ transformOrigin: isTop ? "bottom" : "top" }}
              />

              {/* numbered marker sitting on the curve */}
              <motion.div
                className="section-solid relative flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-weha-teal"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.35 + i * 0.42 }}
              >
                <span className="weha-display text-lg text-weha-teal">{s.num}</span>
                <span className="absolute inset-0 rounded-full border-2 border-weha-teal/40 animate-ping-slow" />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ---------- MOBILE: vertical spine ---------- */}
      <div className="relative md:hidden pl-14">
        <motion.span
          className="absolute left-[1.15rem] top-2 bottom-2 w-[2px] origin-top bg-gradient-to-b from-weha-teal/10 via-weha-teal/70 to-weha-teal/10"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <div className="space-y-8">
          {nodes.map((s, i) => (
            <motion.div
              key={s.num}
              className="relative"
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
            >
              <div className="section-solid absolute -left-[3.35rem] top-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-weha-teal">
                <span className="weha-display text-base text-weha-teal">{s.num}</span>
              </div>
              <div className="weha-card p-5">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-weha-faint">
                  {s.meta}
                </p>
                <h3 className="weha-display text-2xl mt-1.5 text-weha-text">{s.name}</h3>
                <p className="mt-2.5 text-sm text-weha-muted leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
