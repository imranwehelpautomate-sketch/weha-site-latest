import { Link } from "react-router-dom";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import IndiaFlag from "@/components/IndiaFlag";
import { openCookiePreferences } from "@/components/CookieConsent";
import { useBooking } from "@/context/BookingContext";

// Placeholder — replace with the real company LinkedIn URL.
const LINKEDIN_URL = "https://www.linkedin.com/company/we-help-automate";
const CONTACT_EMAIL = "hello@wehelpautomate.com";

// Footer marquee words; even items are filled with the brand colour.
const MARQUEE = ["We Help Automate", "AI SEO Department", "Sales Automation", "Marketing Automation", "RevOps Automation", "AI Workforce"];

// Offer cards. The first is the flagship and renders tall and filled.
const offers = [
  {
    to: "/ai-seo-department",
    title: "AI SEO Department",
    body: "A team of nine AI specialists on your own server, trained on your data. The Director sends you a brief every day. You approve what goes live.",
    cta: "Meet the Department",
  },
  { to: "/services", title: "Sales Automation", body: "Leads routed, followed up and logged without anyone copying notes.", cta: "See Sales" },
  { to: "/services", title: "Marketing Automation", body: "Campaigns, content and reporting that run on a schedule.", cta: "See Marketing" },
  { to: "/services", title: "RevOps Automation", body: "One clean pipeline, tidy CRM data and reports that build themselves.", cta: "See RevOps" },
  { to: "/ai-workforce", title: "AI Workforce", body: "AI agents that take on the repeat work across your team.", cta: "See AI Workforce" },
];

const columns = [
  {
    heading: "Start Here",
    links: [
      { to: "/audit", label: "Free AI Audit" },
      { to: "/readiness-check", label: "Readiness Check" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { to: "/resources/workbooks", label: "Workbooks" },
      { to: "/resources/workflow-automations", label: "Workflow Automations" },
      { to: "/resources/ebooks", label: "Ebooks" },
    ],
  },
  {
    heading: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/services", label: "Services" },
      { to: "/success-stories", label: "Success Stories" },
    ],
  },
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function Footer() {
  const { openBooking } = useBooking();
  return (
    <footer data-testid="site-footer" className="border-t border-weha-border bg-weha-surface overflow-hidden">
      <div className="weha-foot-marquee" aria-hidden="true">
        <div className="weha-foot-marquee__track">
          {[...MARQUEE, ...MARQUEE].map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <h2 className="weha-display text-4xl md:text-6xl leading-[1.05] text-weha-text text-balance">
            We automate sales, marketing and RevOps.{" "}
            <em className="text-weha-pop">And we built you an SEO department.</em>
          </h2>
          <div>
            <p className="text-weha-muted leading-relaxed">
              Fewer tools to babysit, fewer tasks done by hand. Start with a free 30-minute AI Audit and leave
              with a plan.
            </p>
            <button
              type="button"
              onClick={openBooking}
              data-testid="footer-book-audit"
              data-cursor="hover"
              className="btn-teal mt-5"
            >
              Book the Free AI Audit
            </button>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="footer-offers">
          {offers.map((o, i) => {
            const flag = i === 0;
            return (
              <li key={o.title} className={flag ? "sm:row-span-2" : ""}>
                <Link
                  to={o.to}
                  data-testid={`footer-offer-${slug(o.title)}`}
                  data-cursor="hover"
                  className={`group flex h-full flex-col gap-2 rounded-2xl border p-6 transition-[transform,border-color] duration-200 motion-safe:hover:-translate-y-1 ${
                    flag
                      ? "border-weha-pop bg-weha-pop text-weha-bg"
                      : "border-weha-border bg-weha-elevated hover:border-weha-pop"
                  }`}
                >
                  {flag && (
                    <span className="text-xs font-semibold tracking-widest uppercase opacity-75">Flagship</span>
                  )}
                  <span className={flag ? "weha-display text-3xl md:text-4xl leading-tight" : "font-semibold text-weha-text"}>
                    {o.title}
                  </span>
                  <span className={`text-sm leading-relaxed ${flag ? "opacity-90" : "text-weha-muted"}`}>{o.body}</span>
                  <span className={`mt-auto pt-2 inline-flex items-center gap-1 text-sm font-semibold ${flag ? "" : "text-weha-pop"}`}>
                    {o.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.4fr]">
          <div>
            <div className="text-weha-text">
              {/* Mobile: full-name → "We | HA" morph intro */}
              <span className="md:hidden inline-flex">
                <Logo morph animated />
              </span>
              {/* Desktop: compact animated mark (unchanged) */}
              <span className="hidden md:inline-flex">
                <Logo animated />
              </span>
            </div>
            <p className="mt-5 text-weha-muted max-w-xs text-base leading-relaxed">
              Automation Without the Busywork.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow We Help Automate on LinkedIn"
                data-testid="footer-linkedin"
                className="inline-flex items-center justify-center h-11 w-11 rounded-lg border border-weha-border text-weha-pop hover:bg-weha-teal-soft hover:border-weha-pop transition-colors"
              >
                <Linkedin className="h-5 w-5" strokeWidth={2} />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label={`Email us at ${CONTACT_EMAIL}`}
                data-testid="footer-email-icon"
                className="inline-flex items-center justify-center h-11 w-11 rounded-lg border border-weha-border text-weha-pop hover:bg-weha-teal-soft hover:border-weha-pop transition-colors"
              >
                <Mail className="h-5 w-5" strokeWidth={2} />
              </a>
            </div>
          </div>

          {columns.map((c) => (
            <div key={c.heading}>
              <p className="text-xs font-semibold tracking-widest uppercase text-weha-faint mb-4">{c.heading}</p>
              <ul className="space-y-3">
                {c.links.map((n) => (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      data-testid={`footer-nav-${slug(n.label)}`}
                      className="text-weha-muted hover:text-weha-teal transition-colors"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-weha-faint mb-4">Where We Work</p>
            <p className="text-weha-muted leading-relaxed">
              We Work Amanora Crest, 4th floor, Amanora Town Centre, Amanora Park Town, Hadapsar, 411 028.
              <br />
              Pune, Maharashtra, India.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-block text-weha-text hover:text-weha-teal transition-colors"
              data-testid="footer-email"
            >
              {CONTACT_EMAIL}
            </a>
            <p
              className="mt-4 flex items-center gap-2 text-sm text-weha-muted"
              data-testid="footer-made-in-india"
            >
              <span>Designed for the World, Built in India.</span>
              <IndiaFlag />
            </p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-weha-border flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-sm text-weha-faint">© {new Date().getFullYear()} We Help Automate. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              to="/privacy-policy"
              data-testid="footer-privacy"
              className="text-sm text-weha-faint hover:text-weha-teal transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              data-testid="footer-terms"
              className="text-sm text-weha-faint hover:text-weha-teal transition-colors whitespace-nowrap"
            >
              Terms of Service
            </Link>
            <button
              type="button"
              onClick={openCookiePreferences}
              data-testid="footer-cookie-preferences"
              className="text-sm text-weha-faint hover:text-weha-teal transition-colors whitespace-nowrap"
            >
              Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
