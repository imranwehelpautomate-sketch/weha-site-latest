import { useState } from "react";
import { ArrowRight, Mail, MessageCircle, Linkedin, Clock, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import Seo from "@/components/Seo";
import MarketingConsent from "@/components/MarketingConsent";
import { submitContactMessage } from "@/lib/api";
import { checkContactFields } from "@/lib/spamGuard";
import { ORG, SITE, breadcrumb, faqPage, graph } from "@/lib/seoSchemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  ["Do I need to buy new software?", "No. We build on the tools you already use. No rip and replace, no forced migration."],
  ["How long does a typical automation take?", "Most first automations are live within days, not months. You often see a working demo in the very first session."],
  ["What if I want changes after it is built?", "Everything we build is documented and handed over to you, and we offer support so you are never left stranded."],
  ["Do you only build, or can you just advise?", "Both. Our consulting track is purely advisory if you want a clear AI roadmap without a build."],
  ["What happens at the free audit?", "We map your most painful manual workflows with you and show you what one automation would look like for your business. No pitch, no obligation."],
];

const initial = {
  name: "",
  company: "",
  country: "",
  industry: "",
  process: "",
  email: "",
};

// Office address / map coordinates. Single source of truth for the phone number,
// used by the WhatsApp link (digits only), the displayed WhatsApp text, and the
// office phone strip.
const OFFICE = {
  address: "We Work Amanora Crest, 4th floor, Amanora Town Centre, Amanora Park Town, Hadapsar, 411 028.\nPune, Maharashtra, India.",
  email: "hello@wehelpautomate.com",
  phone: "+91 81808 61084",
  whatsapp: "+91 81808 61084",
  coords: { lat: 18.518774, lng: 73.93606 },
};
const WHATSAPP_DIGITS = OFFICE.whatsapp.replace(/\D/g, "");
const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${OFFICE.coords.lat},${OFFICE.coords.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const spamError = checkContactFields({
      name: form.name,
      company: form.company,
      email: form.email,
      process: form.process,
    });
    if (spamError) {
      setError(spamError);
      return;
    }
    setSubmitting(true);
    try {
      await submitContactMessage({ ...form, source: "contact-page" });
      setDone(true);
      toast.success("Request received. We'll reply within 24 hours.");
      setForm(initial);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page" className="overflow-x-hidden">
      <Seo
        title="Contact, book a free AI Audit"
        description="Book a free 60 minute AI Audit with WeHA. We map your most painful manual workflows and show you what one automation would look like, live."
        path="/contact"
        jsonLd={graph([
          {
            ...ORG,
            contactPoint: {
              "@type": "ContactPoint",
              email: "hello@wehelpautomate.com",
              contactType: "customer service",
            },
          },
          faqPage(faqs),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ])}
      />
      <PageHero
        kicker="Contact"
        title="Let's find your"
        italicWord="first automation."
        subtitle="Book a free consultation. We map your most painful manual workflows and show you what one automation would look like, live, for your specific business."
        showForm={false}
      />

      <ScrollSection direction="right" intensity={0.4}>
        <section className="section-glass py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:gap-16">
            {/* FORM */}
            <Reveal>
              <div className="weha-card p-8 md:p-10">
                {done ? (
                  <div data-testid="contact-success" className="py-10">
                    <span className="text-xs font-semibold tracking-widest uppercase text-weha-teal">Received</span>
                    <h2 className="weha-display text-3xl md:text-4xl mt-3 text-weha-text">Thanks, your audit request is in.</h2>
                    <p className="mt-4 text-weha-muted leading-relaxed">
                      We respond to queries instantly. No Secrets, <em className="italic">it&apos;s Automated</em>
                    </p>
                    <button onClick={() => setDone(false)} className="btn-ghost mt-6" data-testid="contact-reset">
                      Send another request <ArrowRight size={15} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} data-testid="audit-form" className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="weha-label" htmlFor="name">Name</label>
                        <input id="name" className="weha-input" value={form.name} onChange={update("name")} placeholder="Your name" data-testid="input-name" />
                      </div>
                      <div>
                        <label className="weha-label" htmlFor="company">Company name</label>
                        <input id="company" className="weha-input" value={form.company} onChange={update("company")} placeholder="Company" data-testid="input-company" />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="weha-label" htmlFor="country">Country</label>
                        <input id="country" className="weha-input" value={form.country} onChange={update("country")} placeholder="Where you are based" data-testid="input-country" />
                      </div>
                      <div>
                        <label className="weha-label" htmlFor="industry">What does your business do?</label>
                        <input id="industry" className="weha-input" value={form.industry} onChange={update("industry")} placeholder="In a few words" data-testid="input-industry" />
                      </div>
                    </div>

                    <div>
                      <label className="weha-label" htmlFor="email">Email</label>
                      <input id="email" type="email" className="weha-input" value={form.email} onChange={update("email")} placeholder="you@company.com" data-testid="input-email" />
                    </div>

                    <div>
                      <label className="weha-label" htmlFor="process">The manual process you want to fix</label>
                      <textarea id="process" rows={4} className="weha-input resize-none" value={form.process} onChange={update("process")} placeholder="e.g. Every morning we copy new enquiries from email into our CRM and a spreadsheet by hand." data-testid="input-process" />
                    </div>

                    {error && (
                      <p role="alert" data-testid="contact-error" className="text-sm font-medium text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    )}

                    <button type="submit" disabled={submitting} className="btn-teal w-full justify-center disabled:opacity-60" data-testid="submit-audit">
                      {submitting ? "Sending…" : "Send to WeHA"} <ArrowRight size={16} />
                    </button>

                    <MarketingConsent checked={marketingOptIn} onChange={setMarketingOptIn} testid="contact-marketing" />

                    <p className="text-sm text-weha-muted leading-relaxed pt-1">
                      We respond to queries instantly. No Secrets, <em className="italic">it&apos;s Automated</em>
                    </p>
                  </form>
                )}
              </div>
            </Reveal>

            {/* RIGHT COLUMN */}
            <Reveal delay={0.1}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <a
                    href={`https://wa.me/${WHATSAPP_DIGITS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-weha-text hover:text-weha-teal transition-colors"
                    data-testid="contact-whatsapp"
                  >
                    <MessageCircle size={18} className="text-weha-teal" /> WhatsApp: {OFFICE.whatsapp}
                  </a>
                  <a
                    href="https://www.linkedin.com/company/we-help-automate/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-weha-text hover:text-weha-teal transition-colors"
                    data-testid="contact-linkedin"
                  >
                    <Linkedin size={18} className="text-weha-teal" /> LinkedIn
                  </a>
                  <a
                    href={`mailto:${OFFICE.email}`}
                    className="flex items-center gap-3 text-weha-text hover:text-weha-teal transition-colors"
                    data-testid="contact-email"
                  >
                    <Mail size={18} className="text-weha-teal" /> {OFFICE.email}
                  </a>
                </div>

                <div className="rounded-xl border border-weha-border bg-weha-surface p-6" data-testid="what-happens-next">
                  <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-weha-faint">
                    <Clock size={14} /> What happens next
                  </p>
                  <ul className="mt-4 space-y-3 text-weha-text">
                    <li className="flex gap-3">
                      <span className="grid place-items-center h-6 w-6 shrink-0 rounded-full bg-weha-teal-soft text-weha-teal text-xs font-semibold">1</span>
                      We reply almost instantly. Like Magic.
                    </li>
                    <li className="flex gap-3">
                      <span className="grid place-items-center h-6 w-6 shrink-0 rounded-full bg-weha-teal-soft text-weha-teal text-xs font-semibold">2</span>
                      We book you a free consultation, at a time that suits you.
                    </li>
                    <li className="flex gap-3">
                      <span className="grid place-items-center h-6 w-6 shrink-0 rounded-full bg-weha-teal-soft text-weha-teal text-xs font-semibold">3</span>
                      We map your workflows and show you what automations can move the needle.
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </ScrollSection>

      {/* OFFICE INFO STRIP: Address, Email, Phone */}
      <ScrollSection direction="left">
        <section className="section-glass py-16 md:py-20" data-testid="office-strip">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="text-center mb-10">
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-weha-teal">
                  Find us
                </span>
                <h2 className="weha-display text-3xl md:text-4xl mt-3 text-weha-text">
                  Drop by the office.
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              <Reveal>
                <div
                  className="weha-card h-full p-7 flex flex-col gap-3"
                  data-testid="office-address"
                >
                  <span className="h-10 w-10 grid place-items-center rounded-lg bg-weha-teal/12 text-weha-teal">
                    <MapPin size={18} />
                  </span>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-faint">
                    Office Address
                  </p>
                  <p className="text-weha-text leading-relaxed whitespace-pre-line">{OFFICE.address}</p>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div
                  className="weha-card h-full p-7 flex flex-col gap-3"
                  data-testid="office-email"
                >
                  <span className="h-10 w-10 grid place-items-center rounded-lg bg-weha-teal/12 text-weha-teal">
                    <Mail size={18} />
                  </span>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-faint">
                    Contact Email
                  </p>
                  <a
                    href={`mailto:${OFFICE.email}`}
                    className="text-weha-text hover:text-weha-teal transition-colors leading-relaxed"
                  >
                    {OFFICE.email}
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <div
                  className="weha-card h-full p-7 flex flex-col gap-3"
                  data-testid="office-phone"
                >
                  <span className="h-10 w-10 grid place-items-center rounded-lg bg-weha-teal/12 text-weha-teal">
                    <Phone size={18} />
                  </span>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-weha-faint">
                    Contact Number
                  </p>
                  <a
                    href={`tel:${OFFICE.phone.replace(/\s/g, "")}`}
                    className="text-weha-text hover:text-weha-teal transition-colors leading-relaxed"
                  >
                    {OFFICE.phone}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* FULL-WIDTH MAP */}
      <section
        className="relative w-full border-y border-weha-border"
        data-testid="office-map"
        aria-label="Office location on map"
      >
        <iframe
          title="WeHA Office, Pune"
          src={MAP_EMBED_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full h-[420px] md:h-[480px] border-0"
          allowFullScreen
        />
      </section>

      {/* FAQ */}
      <ScrollSection direction="left">
        <section className="section-glass py-20 md:py-28 bg-weha-surface border-t border-weha-border">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <Reveal>
              <h2 className="weha-display text-3xl md:text-4xl text-weha-text">
                Quick answers.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <Accordion type="single" collapsible className="mt-8" data-testid="contact-faq">
                {faqs.map(([q, a], i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-weha-border">
                    <AccordionTrigger
                      className="text-left text-lg text-weha-text hover:text-weha-teal hover:no-underline"
                      data-testid={`faq-trigger-${i}`}
                    >
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-weha-muted text-base leading-relaxed">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>
      </ScrollSection>
    </div>
  );
}
