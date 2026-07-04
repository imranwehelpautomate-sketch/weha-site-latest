// CostSlider - a small interactive "cost of inaction" calculator. Two range
// inputs feed a live read-out of hours lost per year and the equivalent number
// of full working weeks. No money or currency is ever shown - the point is the
// sheer volume of time. The big number uses CountUp so it feels alive as the
// sliders move (CountUp also handles reduced motion for us).
import { useState } from "react";
import CountUp from "./CountUp";

function SliderRow({ label, value, min, max, onChange }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-weha-muted">{label}</span>
        <span
          className="rounded-full px-2.5 py-0.5 text-sm font-semibold"
          style={{ background: "var(--weha-teal-soft)", color: "var(--weha-teal)" }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        data-cursor="hover"
        aria-label={label}
        className="w-full cursor-pointer"
        style={{ accentColor: "var(--weha-teal)" }}
      />
    </div>
  );
}

export default function CostSlider({
  className = "",
  title = "What does the manual work actually cost?",
  peopleLabel = "People doing manual work",
  hoursLabel = "Hours lost per person, per week",
  footnote = "",
}) {
  const [people, setPeople] = useState(3);
  const [hours, setHours] = useState(6);

  const yearlyHours = people * hours * 52;
  const weeks = yearlyHours / 40;

  return (
    <div className={`weha-card p-6 md:p-8 ${className}`}>
      <h3 className="text-lg font-semibold text-weha-text">{title}</h3>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-center">
        {/* Left: the controls */}
        <div className="flex flex-col gap-6">
          <SliderRow
            label={peopleLabel}
            value={people}
            min={1}
            max={25}
            onChange={setPeople}
          />
          <SliderRow
            label={hoursLabel}
            value={hours}
            min={1}
            max={20}
            onChange={setHours}
          />
        </div>

        {/* Right: the live read-out */}
        <div className="text-center md:text-left">
          <CountUp
            value={yearlyHours}
            duration={0.6}
            className="weha-display block text-5xl md:text-6xl text-[var(--weha-teal)]"
          />
          <p className="mt-1 text-sm font-medium text-weha-muted">hours a year</p>
          <p className="mt-4 text-sm text-weha-faint">
            that is{" "}
            <CountUp
              value={weeks}
              duration={0.6}
              decimals={1}
              className="font-semibold text-weha-muted"
            />{" "}
            working weeks of someone&apos;s time
          </p>
        </div>
      </div>

      {footnote ? (
        <p className="mt-6 text-xs text-weha-faint">{footnote}</p>
      ) : null}
    </div>
  );
}
