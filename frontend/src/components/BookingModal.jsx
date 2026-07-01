import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar as CalendarIcon, Clock, Globe, Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { fetchAvailability, submitBookingRequest } from "@/lib/api";
import { validateName, validateEmail, validateCompany, validateFreeText } from "@/lib/spamGuard";
import MarketingConsent from "@/components/MarketingConsent";

const TIMEZONES = [
  { label: "🇦🇪 UAE · GST",                 value: "Asia/Dubai" },
  { label: "🇮🇳 India · IST",               value: "Asia/Kolkata" },
  { label: "🇸🇬 Singapore · SGT",           value: "Asia/Singapore" },
  // United States
  { label: "🇺🇸 US Eastern · ET",           value: "America/New_York" },
  { label: "🇺🇸 US Central · CT",           value: "America/Chicago" },
  { label: "🇺🇸 US Mountain · MT",          value: "America/Denver" },
  { label: "🇺🇸 US Arizona · MST",          value: "America/Phoenix" },
  { label: "🇺🇸 US Pacific · PT",           value: "America/Los_Angeles" },
  { label: "🇺🇸 US Alaska · AKT",           value: "America/Anchorage" },
  { label: "🇺🇸 US Hawaii · HST",           value: "Pacific/Honolulu" },
  // Australia
  { label: "🇦🇺 Australia (Sydney) · AEST",     value: "Australia/Sydney" },
  { label: "🇦🇺 Australia (Brisbane) · AEST",   value: "Australia/Brisbane" },
  { label: "🇦🇺 Australia (Adelaide) · ACST",   value: "Australia/Adelaide" },
  { label: "🇦🇺 Australia (Darwin) · ACST",     value: "Australia/Darwin" },
  { label: "🇦🇺 Australia (Perth) · AWST",      value: "Australia/Perth" },
  { label: "🇦🇺 Australia (Hobart) · AEDT",     value: "Australia/Hobart" },
];

const TZ_VALUES = new Set(TIMEZONES.map((z) => z.value));

// Detect user's tz from browser and map to one of our supported zones
function guessDefaultTz() {
  try {
    const sys = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (TZ_VALUES.has(sys)) return sys;
    if (/Australia/i.test(sys)) return "Australia/Sydney";
    if (/India|Asia\/Calcutta/i.test(sys)) return "Asia/Kolkata";
    if (/America\/|US\//i.test(sys)) return "America/New_York";
    if (/Pacific\/Honolulu/i.test(sys)) return "Pacific/Honolulu";
    if (/Asia\/Singapore|Asia\/Kuala_Lumpur/i.test(sys)) return "Asia/Singapore";
    if (/Asia\/(Dubai|Muscat|Abu_Dhabi)/i.test(sys)) return "Asia/Dubai";
  } catch (e) { /* fall through to default */ }
  return "Asia/Dubai";
}

// Format YYYY-MM-DD in local terms (the date the user clicked on the calendar)
function ymdLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const horizon = new Date(today);
horizon.setDate(horizon.getDate() + 28);

const initialForm = {
  name: "", company: "", country: "", industry: "",
  process: "", email: "",
};

export default function BookingModal({ open, onOpenChange }) {
  const [step, setStep] = useState(1); // 1: pick slot · 2: details · 3: success
  const [tz, setTz] = useState(guessDefaultTz);
  const [date, setDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // { iso_utc, label }
  const [duration, setDuration] = useState(15); // 15 (default) or 30 minutes
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);

  // Reset state every time the modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setDate(null);
      setSlots([]);
      setSelectedSlot(null);
      setDuration(15);
      setForm(initialForm);
      setError("");
    }
  }, [open]);

  // Fetch slots whenever date, tz, or call length changes
  useEffect(() => {
    if (!date) { setSlots([]); return; }
    let cancel = false;
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetchAvailability(ymdLocal(date), tz, duration)
      .then(data => { if (!cancel) setSlots(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancel) setSlots([]); })
      .finally(() => { if (!cancel) setLoadingSlots(false); });
    return () => { cancel = true; };
  }, [date, tz, duration]);

  const tzLabel = useMemo(() => TIMEZONES.find(z => z.value === tz)?.label || tz, [tz]);

  const slotDisplay = useMemo(() => {
    if (!selectedSlot || !date) return "";
    const d = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
    return `${d} · ${selectedSlot.label} · ${duration} min (${tzLabel.split("·")[1]?.trim() || tz})`;
  }, [selectedSlot, date, tz, tzLabel, duration]);

  const updateForm = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e?.preventDefault?.();
    setError("");
    const spamError =
      validateName(form.name) ||
      validateCompany(form.company) ||
      validateEmail(form.email) ||
      validateFreeText(form.process, "the process you want to fix");
    if (spamError) {
      setError(spamError);
      return;
    }
    setSubmitting(true);
    try {
      await submitBookingRequest({
        ...form,
        source: "booking-modal",
        slot_iso_utc: selectedSlot?.iso_utc || null,
        timezone: selectedSlot ? tz : null,
        duration_minutes: duration,
      });
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="booking-modal"
        style={{ maxWidth: "min(1120px, 95vw)" }}
        className="!p-0 !gap-0 overflow-hidden border-weha-border bg-weha-bg text-weha-text shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto"
      >
        {/* sr-only title/desc to satisfy radix a11y */}
        <DialogTitle className="sr-only">Book a Free AI Audit</DialogTitle>
        <DialogDescription className="sr-only">
          Pick a date and time and tell us about the process you want to automate.
        </DialogDescription>

        {step === 3 ? (
          <div data-testid="booking-success" className="p-10 md:p-14 text-center">
            <div className="mx-auto h-14 w-14 rounded-full grid place-items-center bg-weha-teal text-white">
              <Check size={28} />
            </div>
            <h2 className="weha-display text-3xl md:text-4xl mt-6">Your audit is booked.</h2>
            {selectedSlot && (
              <p className="mt-3 text-weha-muted">
                We&apos;ll see you on <span className="text-weha-text font-medium">{slotDisplay}</span>.
              </p>
            )}
            <p className="mt-3 text-weha-muted max-w-md mx-auto leading-relaxed">
              A confirmation will arrive within 24 hours by email.
              No sales scripts, just a focused 15-minute working session.
            </p>
            <button
              onClick={() => onOpenChange(false)}
              data-testid="booking-success-close"
              className="btn-teal mt-8 mx-auto"
            >
              Close <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-[320px_1fr]">
            {/* LEFT - context column */}
            <aside className="hidden md:flex flex-col justify-between p-7 lg:p-8 bg-weha-surface border-r border-weha-border">
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-teal">
                  Free · 15 minutes
                </span>
                <h2 className="weha-display text-3xl lg:text-4xl mt-3 leading-tight">
                  Book your <span className="italic text-weha-teal">AI Audit.</span>
                </h2>
                <p className="mt-4 text-weha-muted leading-relaxed text-[0.95rem]">
                  On call we will understand your pain-points, discover your automation and agentic workflow needs, and give you our honest opinion.{" "}
                  <span className="italic text-weha-text">No BS.</span>
                </p>
              </div>
              <ul className="mt-8 space-y-3.5 text-[0.95rem]">
                {[
                  "Map your most time-consuming workflows",
                  "Identify what is automatable today",
                  "Get free honest consultation from an expert",
                ].map(x => (
                  <li key={x} className="flex gap-3"><span className="text-weha-teal mt-1">✦</span><span>{x}</span></li>
                ))}
              </ul>
              <div className="mt-10 text-xs text-weha-faint leading-relaxed border-t border-weha-border pt-5">
                Already booked? Email <a className="text-weha-text underline" href="mailto:hello@wehelpautomate.com">hello@wehelpautomate.com</a>
              </div>
            </aside>

            {/* RIGHT - interactive column */}
            <div className="p-6 md:p-7 lg:p-9">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-5">
                <StepDot active={step === 1} done={step > 1} index={1} label="Slot" />
                <span className="h-px flex-1 bg-weha-border" />
                <StepDot active={step === 2} done={step > 2} index={2} label="Details" />
              </div>

              {step === 1 && (
                <div data-testid="booking-step-slot">
                  <label className="weha-label flex items-center gap-2">
                    <Globe size={13} /> Timezone
                  </label>
                  <select
                    data-testid="booking-tz"
                    className="weha-input mb-5"
                    value={tz}
                    onChange={(e) => setTz(e.target.value)}
                  >
                    {TIMEZONES.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
                  </select>

                  {/* Call length — 15 min default, optional extend to 30 min */}
                  <label className="weha-label flex items-center gap-2">
                    <Clock size={13} /> Call length
                  </label>
                  <div className="flex items-center gap-2" data-testid="booking-duration">
                    {[15, 30].map((mins) => {
                      const active = duration === mins;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDuration(mins)}
                          data-testid={`duration-${mins}`}
                          aria-pressed={active}
                          className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                            active
                              ? "border-weha-teal bg-weha-teal text-white shadow-sm"
                              : "border-weha-border text-weha-text hover:border-weha-teal hover:text-weha-teal"
                          }`}
                        >
                          {mins} min
                          {mins === 15 && (
                            <span className={`ml-1.5 text-[0.7rem] ${active ? "text-white/80" : "text-weha-faint"}`}>
                              · default
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 mb-5 text-xs text-weha-muted">
                    Most audits fit in 15 minutes. Need a deeper dive?{" "}
                    <button
                      type="button"
                      onClick={() => setDuration(30)}
                      className="font-medium text-weha-teal underline underline-offset-2 hover:opacity-80"
                      data-testid="duration-extend-link"
                    >
                      Extend to 30 min
                    </button>.
                  </p>

                  <div className="grid gap-5 lg:grid-cols-[minmax(260px,320px)_1fr]">
                    <div className="min-w-0">
                      <label className="weha-label flex items-center gap-2">
                        <CalendarIcon size={13} /> Select a date
                      </label>
                      <div className="weha-card p-2 overflow-hidden">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < today || d > horizon}
                          fromDate={today}
                          toDate={horizon}
                          className="w-full p-2"
                          classNames={{
                            months: "w-full",
                            month: "w-full space-y-3",
                            caption: "flex justify-center pt-1 relative items-center px-1",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-7 w-7 inline-flex items-center justify-center rounded-md border border-weha-border bg-transparent p-0 opacity-70 hover:opacity-100 hover:border-weha-teal",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse",
                            head_row: "grid grid-cols-7 mb-1",
                            head_cell: "text-weha-faint font-normal text-[0.72rem] py-1",
                            row: "grid grid-cols-7 mt-1",
                            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                            day: "h-9 w-full p-0 font-normal rounded-md hover:bg-weha-surface aria-selected:opacity-100 transition-colors",
                            day_selected: "!bg-weha-teal !text-white hover:!bg-weha-teal hover:!text-white focus:!bg-weha-teal focus:!text-white",
                            day_today: "border border-weha-teal/40 text-weha-teal",
                            day_outside: "text-weha-faint/40",
                            day_disabled: "text-weha-faint/40 opacity-40 cursor-not-allowed",
                            day_hidden: "invisible",
                          }}
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <label className="weha-label flex items-center gap-2">
                        <Clock size={13} /> Available times
                      </label>
                      <div className="weha-card p-3 min-h-[260px] max-h-[320px] overflow-y-auto">
                        {!date && (
                          <p className="text-weha-faint text-sm p-4">Pick a date to see open slots.</p>
                        )}
                        {date && loadingSlots && (
                          <div className="flex items-center gap-2 text-weha-faint text-sm p-4">
                            <Loader2 size={15} className="animate-spin" /> Loading slots…
                          </div>
                        )}
                        {date && !loadingSlots && slots.length === 0 && (
                          <p className="text-weha-faint text-sm p-4">No open slots that day. Try another date.</p>
                        )}
                        {date && !loadingSlots && slots.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" data-testid="booking-slots">
                            {slots.map(s => {
                              const isActive = selectedSlot?.iso_utc === s.iso_utc;
                              return (
                                <button
                                  key={s.iso_utc}
                                  type="button"
                                  disabled={s.taken}
                                  onClick={() => setSelectedSlot({ iso_utc: s.iso_utc, label: s.label })}
                                  data-testid={`slot-${s.label}`}
                                  className={`text-sm rounded-lg border px-2.5 py-2 transition-all ${
                                    s.taken
                                      ? "opacity-35 line-through cursor-not-allowed border-weha-border"
                                      : isActive
                                        ? "bg-weha-teal text-white border-weha-teal"
                                        : "border-weha-border hover:border-weha-teal hover:text-weha-teal"
                                  }`}
                                >
                                  {s.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-weha-muted">
                      {selectedSlot
                        ? <>Selected: <span className="text-weha-text font-medium">{slotDisplay}</span></>
                        : "Pick a date and time to continue."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!selectedSlot}
                      data-testid="booking-next"
                      className="btn-teal disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={submit} data-testid="booking-step-details" className="space-y-4">
                  <div className="rounded-lg border border-weha-border bg-weha-surface px-4 py-3 flex items-start gap-3">
                    <CalendarIcon size={15} className="text-weha-teal mt-0.5 shrink-0" />
                    <p className="text-sm">
                      <span className="text-weha-text font-medium">{slotDisplay}</span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="ml-3 text-weha-teal underline text-sm"
                        data-testid="booking-change-slot"
                      >
                        change
                      </button>
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="weha-label" htmlFor="bk-name">Name</label>
                      <input id="bk-name" className="weha-input" placeholder="Your name"
                        value={form.name} onChange={updateForm("name")} data-testid="booking-name" />
                    </div>
                    <div>
                      <label className="weha-label" htmlFor="bk-company">Company</label>
                      <input id="bk-company" className="weha-input" placeholder="Company"
                        value={form.company} onChange={updateForm("company")} data-testid="booking-company" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="weha-label" htmlFor="bk-country">Country</label>
                      <input id="bk-country" className="weha-input" placeholder="Where you're based"
                        value={form.country} onChange={updateForm("country")} data-testid="booking-country" />
                    </div>
                    <div>
                      <label className="weha-label" htmlFor="bk-industry">Industry</label>
                      <input id="bk-industry" className="weha-input" placeholder="What your business does"
                        value={form.industry} onChange={updateForm("industry")} data-testid="booking-industry" />
                    </div>
                  </div>
                  <div>
                    <label className="weha-label" htmlFor="bk-email">Email</label>
                    <input id="bk-email" type="email" className="weha-input" placeholder="you@company.com"
                      value={form.email} onChange={updateForm("email")} data-testid="booking-email" />
                  </div>
                  <div>
                    <label className="weha-label" htmlFor="bk-process">The manual process you want to fix</label>
                    <textarea id="bk-process" rows={3} className="weha-input resize-none"
                      placeholder="e.g. We copy new leads into a spreadsheet every morning…"
                      value={form.process} onChange={updateForm("process")} data-testid="booking-process" />
                  </div>

                  {error && (
                    <p role="alert" data-testid="booking-error" className="text-sm font-medium text-red-600 dark:text-red-400 pt-1">
                      {error}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={() => setStep(1)} className="btn-ghost" data-testid="booking-back">
                      ← Back
                    </button>
                    <button type="submit" disabled={submitting} className="btn-teal disabled:opacity-60" data-testid="booking-submit">
                      {submitting
                        ? <>Booking… <Loader2 size={15} className="animate-spin" /></>
                        : <>Confirm Booking <ArrowRight size={16} /></>
                      }
                    </button>
                  </div>

                  <MarketingConsent checked={marketingOptIn} onChange={setMarketingOptIn} testid="booking-marketing" />
                </form>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepDot({ active, done, index, label }) {
  return (
    <span className="flex items-center gap-2 text-xs">
      <span className={`h-6 w-6 grid place-items-center rounded-full text-[11px] font-semibold transition-colors ${
        done ? "bg-weha-teal text-white"
          : active ? "bg-weha-teal text-white"
          : "bg-weha-surface border border-weha-border text-weha-faint"
      }`}>
        {done ? <Check size={12} /> : index}
      </span>
      <span className={active || done ? "text-weha-text font-medium" : "text-weha-faint"}>{label}</span>
    </span>
  );
}
