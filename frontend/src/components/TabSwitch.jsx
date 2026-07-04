// TabSwitch - a controlled tab row with a violet pill indicator that slides
// between tabs via a shared layoutId. Each instance gets a unique layoutId
// (useId) so multiple TabSwitches on a page never cross-animate.
import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function TabSwitch({ tabs = [], active, onChange, className = "" }) {
  const reduceMotion = useReducedMotion();
  const uid = useId();
  const layoutId = `tabswitch-indicator-${uid}`;

  return (
    <div
      role="tablist"
      className={`hide-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto ${className}`}
      style={{
        background: "var(--weha-elevated)",
        border: "1px solid var(--weha-border)",
        borderRadius: 999,
        padding: 4,
      }}
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-cursor="hover"
            onClick={() => onChange?.(t.id)}
            className={`relative shrink-0 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--weha-teal-soft)] ${
              isActive ? "text-white" : "text-weha-muted hover:text-weha-text"
            }`}
            style={{ padding: "8px 18px" }}
          >
            {isActive && (
              <motion.span
                aria-hidden="true"
                layoutId={layoutId}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "var(--weha-teal)",
                  zIndex: 0,
                  willChange: "transform",
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 32 }
                }
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
