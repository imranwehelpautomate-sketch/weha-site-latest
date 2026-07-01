import { Check } from "lucide-react";

// Pre-checked marketing consent checkbox with a short, witty disclaimer.
// Used across every lead-capture form on the site for a consistent look.
//
// Controlled: parent owns the boolean state (defaulting to true) and passes
// `checked` + `onChange(nextBool)`.
export default function MarketingConsent({ checked, onChange, testid = "marketing-consent" }) {
  return (
    <label
      htmlFor={testid}
      data-testid={`${testid}-label`}
      className="flex items-start gap-2.5 cursor-pointer select-none"
    >
      <span className="relative mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        <input
          id={testid}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          data-testid={testid}
          className="peer sr-only"
        />
        <span className="h-[18px] w-[18px] rounded-[5px] border border-weha-border bg-weha-bg transition-colors peer-checked:border-weha-teal peer-checked:bg-weha-teal peer-focus-visible:ring-2 peer-focus-visible:ring-weha-teal/40" />
        <Check
          size={12}
          strokeWidth={3.5}
          className="pointer-events-none absolute text-white opacity-0 scale-50 transition-all duration-150 peer-checked:opacity-100 peer-checked:scale-100"
        />
      </span>
      <span className="text-xs leading-relaxed text-weha-muted">
        Yep, keep the good stuff coming: newsletters, offers and the odd automation nugget. Pinky promise, zero spam and no 3am emails.
      </span>
    </label>
  );
}
