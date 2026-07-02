import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Cookie consent banner wired to Google Consent Mode v2.
//
// - Default consent ("denied") is set in public/index.html before GTM loads.
// - This banner lets the visitor Accept or Decline. Both choices call
//   gtag('consent','update',...) explicitly and persist the raw choice in
//   localStorage under weha_cookie_consent ("accepted" | "declined").
// - PostHog is gated: it only initializes on Accept (or on load when the stored
//   choice is already "accepted", handled in index.html). Declining never loads it.
// - The banner only closes via Accept or Decline. Ignoring / scrolling / clicking
//   elsewhere never dismisses it and never grants consent implicitly.
// - The footer "Cookie preferences" link reopens it via openCookiePreferences().

const STORAGE_KEY = "weha_cookie_consent";
const OPEN_EVENT = "weha:open-cookie-preferences";

// Palette pinned to the site's light "card" tokens so the banner reads correctly
// on both light and dark themes (the card itself is always off-white).
const BG = "#f7f6f2";
const BORDER = "#ece9e3";
const TEXT = "#2b2a28";
const MUTED = "#6b6862";
const ACCENT = "#6F55AF"; // primary CTA fill for the Accept button

// Called from the Footer to reopen the banner so a visitor can change their choice.
export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

function readChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function applyGtag(granted) {
  const v = granted ? "granted" : "denied";
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: v,
      ad_storage: v,
      ad_user_data: v,
      ad_personalization: v,
    });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // First visit (no stored choice) shows the banner. index.html has already
    // re-applied any stored choice + gated PostHog before React mounted, so we
    // do not re-apply here; we only decide whether to prompt.
    if (!readChoice()) setVisible(true);

    const onOpen = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const accept = useCallback(() => {
    applyGtag(true);
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch (e) {
      /* localStorage unavailable; ignore */
    }
    if (typeof window !== "undefined" && typeof window.__wehaInitPosthog === "function") {
      window.__wehaInitPosthog();
    }
    if (typeof window !== "undefined" && window.posthog && typeof window.posthog.opt_in_capturing === "function") {
      window.posthog.opt_in_capturing();
    }
    setVisible(false);
  }, []);

  const decline = useCallback(() => {
    applyGtag(false);
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch (e) {
      /* localStorage unavailable; ignore */
    }
    // Never initialize PostHog. If it was loaded in a prior accepted session,
    // stop it from capturing now that the visitor has opted out.
    if (typeof window !== "undefined" && window.posthog && typeof window.posthog.opt_out_capturing === "function") {
      window.posthog.opt_out_capturing();
    }
    setVisible(false);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-consent"
          role="dialog"
          aria-modal="false"
          aria-label="Cookie consent"
          data-testid="cookie-consent"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[60] bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 sm:max-w-sm rounded-2xl p-5 sm:p-6"
          style={{
            background: BG,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 24px 60px -30px rgba(0,0,0,0.35)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: TEXT }}>
            Cookies, your call.
          </p>
          <p className="mt-2 text-[0.85rem] leading-relaxed" style={{ color: MUTED }}>
            We use cookies to understand how visitors use the site. You choose what is on. Essential cookies always run so the site works.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={accept}
              data-testid="cookie-accept"
              className="flex-1 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              style={{ background: ACCENT }}
            >
              Accept
            </button>
            <button
              type="button"
              onClick={decline}
              data-testid="cookie-decline"
              className="flex-1 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-black/5"
              style={{ color: TEXT, border: `1px solid ${TEXT}` }}
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
