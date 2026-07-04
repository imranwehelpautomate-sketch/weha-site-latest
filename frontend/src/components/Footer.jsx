import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import IndiaFlag from "@/components/IndiaFlag";
import { openCookiePreferences } from "@/components/CookieConsent";

// Placeholder — replace with the real company LinkedIn URL.
const LINKEDIN_URL = "https://www.linkedin.com/company/we-help-automate";
const CONTACT_EMAIL = "hi@wehelpautomate.com";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="border-t border-weha-border bg-weha-surface">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
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
              Automation without the busywork.
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

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-weha-faint mb-4">Pages</p>
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    data-testid={`footer-nav-${n.label.toLowerCase()}`}
                    className="text-weha-muted hover:text-weha-teal transition-colors"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-weha-faint mb-4">Where we work</p>
            <ul className="space-y-3 text-weha-muted">
              <li className="leading-relaxed">
                We Work Amanora Crest, 4th floor, Amanora Town Centre, Amanora Park Town, Hadapsar, 411 028.
                <br />
                Pune, Maharashtra, India.
              </li>
            </ul>
            <a
              href="mailto:hello@wehelpautomate.com"
              className="mt-5 inline-block text-weha-text hover:text-weha-teal transition-colors"
              data-testid="footer-email"
            >
              hello@wehelpautomate.com
            </a>
            <p
              className="mt-4 flex items-center gap-2 text-sm text-weha-muted"
              data-testid="footer-made-in-india"
            >
              <span>Designed for the World, built in India.</span>
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
              Cookie preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
