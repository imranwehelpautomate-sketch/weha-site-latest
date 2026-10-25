import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ArrowRight, ChevronDown, BookOpen, Workflow, FileText, Gauge, Sparkles, Target, PenLine, BarChart3, Bot, Compass } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useBooking } from "@/context/BookingContext";
import { EASE } from "@/lib/motion";
import Magnetic from "@/components/Magnetic";
import Logo from "@/components/Logo";

const links = [
  { to: "/ai-seo-department", label: "AI SEO Department", flagship: true },
  { to: "/services", label: "Services" },
  { to: "/success-stories", label: "Success Stories" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
];

const SERVICE_CHILDREN = [
  { key: "sales", to: "/services", icon: Target, title: "Sales and pipeline", desc: "Lead capture, follow-up and CRM that runs itself." },
  { key: "marketing", to: "/services", icon: PenLine, title: "Marketing and content", desc: "Campaigns and content workflows, automated." },
  { key: "revops", to: "/services", icon: BarChart3, title: "RevOps and reporting", desc: "One source of truth for revenue numbers." },
  { key: "workforce", to: "/ai-workforce", icon: Bot, title: "AI Workforce", desc: "AI agents for the repetitive work in your team." },
  { key: "advisory", to: "/services", icon: Compass, title: "Advisory", desc: "What to automate first, and what to leave alone." },
];
const SERVICE_START = [
  { key: "audit", to: "/audit", title: "Free AI Audit" },
  { key: "readiness", to: "/readiness-check", title: "Readiness Check" },
];

const RESOURCE_CHILDREN = [
  {
    key: "audit",
    to: "/audit",
    icon: Sparkles,
    title: "AI Audit Walkthrough",
    desc: "See exactly how the free 90-minute audit works.",
  },
  {
    key: "readiness",
    to: "/readiness-check",
    icon: Gauge,
    title: "Automation Readiness Check",
    desc: "Six questions, two minutes, an honest score.",
  },
  {
    key: "workbooks",
    to: "/resources/workbooks",
    icon: BookOpen,
    title: "Workbooks",
    desc: "Printable worksheets to find what to automate first.",
  },
  {
    key: "workflows",
    to: "/resources/workflow-automations",
    icon: Workflow,
    title: "Workflow Automations",
    desc: "Ready-to-import n8n templates for your stack.",
  },
  {
    key: "ebooks",
    to: "/resources/ebooks",
    icon: FileText,
    title: "eBooks",
    desc: "Practical guides on automating your business.",
  },
];

function ResourcesMenu() {
  return (
    <HoverMenu to="/resources" label="Resources" testid="resources" width="w-[330px]">
      {(close) => (
        <div className="rounded-xl border border-weha-border bg-weha-bg p-2 shadow-xl">
          {RESOURCE_CHILDREN.map((c) => {
            const Icon = c.icon;
            return (
              <NavLink
                key={c.to}
                to={c.to}
                onClick={close}
                data-testid={`resources-dropdown-${c.key}`}
                className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-weha-teal-soft"
              >
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-weha-teal-soft text-weha-teal">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-weha-text transition-colors group-hover:text-weha-teal">
                    {c.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-weha-muted">{c.desc}</span>
                </span>
              </NavLink>
            );
          })}
        </div>
      )}
    </HoverMenu>
  );
}

function ServicesMenu() {
  return (
    <HoverMenu to="/services" label="Services" testid="services" width="w-[760px]">
      {(close) => (
        <div className="grid grid-cols-[1fr_1.15fr] gap-2 rounded-2xl border border-weha-border bg-weha-bg p-2 shadow-xl">
          <Link
            to="/ai-seo-department"
            onClick={close}
            data-testid="services-dropdown-ai-seo"
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl p-6 text-white"
            style={{ background: "#4A2F8F" }}
          >
            <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/80">
              <span className="h-2 w-2 rounded-full bg-weha-marigold" /> Flagship
            </span>
            <span>
              <span className="weha-display block text-3xl leading-tight">AI SEO Department</span>
              <span className="mt-2 block text-sm leading-snug text-white/80">
                Nine AI SEO specialists on your own server, led by a Director who reports to you.
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2">
                Meet the department <ArrowRight size={14} />
              </span>
            </span>
          </Link>
          <div className="p-2">
            {SERVICE_CHILDREN.map((c) => {
              const Icon = c.icon;
              return (
                <NavLink
                  key={c.key}
                  to={c.to}
                  onClick={close}
                  data-testid={`services-dropdown-${c.key}`}
                  className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-weha-teal-soft"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-weha-teal-soft text-weha-teal">
                    <Icon size={16} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-weha-text group-hover:text-weha-teal">{c.title}</span>
                    <span className="block text-xs leading-snug text-weha-muted">{c.desc}</span>
                  </span>
                </NavLink>
              );
            })}
            <div className="mt-2 flex items-center gap-2 border-t border-weha-border px-2.5 pt-3">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-weha-faint">Start here</span>
              {SERVICE_START.map((c) => (
                <Link key={c.key} to={c.to} onClick={close} className="rounded-full border border-weha-border px-3 py-1 text-xs text-weha-text hover:border-weha-teal hover:text-weha-teal">
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </HoverMenu>
  );
}

function HoverMenu({ to, label, testid, width, children }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const timer = useRef(null);

  const openNow = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlur={(e) => { if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false); }}
    >
      <NavLink
        to={to}
        data-testid={`nav-${testid}`}
        onFocus={openNow}
        aria-haspopup="true"
        aria-expanded={open}
        className={({ isActive }) =>
          `relative text-sm font-medium transition-colors duration-200 hover:text-weha-teal ${
            isActive ? "text-weha-teal" : "text-weha-text"
          }`
        }
      >
        {({ isActive }) => (
          <span className="relative inline-flex items-center gap-1 pb-1">
            {label}
            <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            {isActive && (
              <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-weha-teal rounded-full" />
            )}
          </span>
        )}
      </NavLink>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: EASE }}
            className={`absolute left-1/2 top-full z-50 ${width} -translate-x-1/2 pt-3`}
            data-testid={`${testid}-dropdown`}
          >
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const { theme, toggle } = useTheme();
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  const handleThemeToggle = () => {
    setPulse((p) => p + 1);
    toggle();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${open ? "bg-weha-bg" : ""} ${scrolled && !open ? "md:pt-3" : ""}`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-500 h-16 md:h-[68px] px-5 sm:px-8 ${
          scrolled && !open
            ? "max-w-6xl md:rounded-full border border-weha-border backdrop-blur-xl bg-weha-bg/80 shadow-[0_12px_40px_-24px_rgba(40,37,29,0.45)] md:px-6"
            : "max-w-7xl border border-transparent"
        }`}
      >
        <Link to="/" className="text-weha-text" data-testid="header-logo-link" onClick={() => setOpen(false)}>
          {/* Desktop (xl+): full-name → "We | HA" morph intro, with room to breathe */}
          <span className="hidden xl:inline-flex">
            <Logo morph animated />
          </span>
          {/* Smaller laptops, tablet & mobile: compact animated mark (unchanged) */}
          <span className="xl:hidden inline-flex">
            <Logo animated />
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
          {links.map((l) => {
            if (l.label === "Resources") return <ResourcesMenu key={l.to} />;
            if (l.label === "Services") return <ServicesMenu key={l.to} />;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors duration-200 hover:text-weha-teal ${
                    isActive ? "text-weha-teal" : "text-weha-text"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-flex items-center gap-1.5 pb-1">
                    {l.flagship && <span className="h-2 w-2 rounded-full bg-weha-marigold" aria-hidden="true" />}
                    {l.label}
                    {l.flagship && (
                      <span className="rounded-full bg-weha-marigold-soft px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-weha-marigold-text">New</span>
                    )}
                    {isActive && (
                      <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-weha-teal rounded-full" />
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleThemeToggle}
            data-testid="theme-toggle"
            aria-label="Toggle theme"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative h-9 w-9 grid place-items-center rounded-full border border-weha-border text-weha-text hover:text-weha-teal hover:border-weha-teal transition-colors"
          >
            {/* Expanding ripple ring + soft glow, emitted on every theme switch */}
            {pulse > 0 && (
              <>
                <motion.span
                  key={`ring-${pulse}`}
                  initial={{ scale: 0.5, opacity: 0.6 }}
                  animate={{ scale: 2.8, opacity: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-weha-teal"
                />
                <motion.span
                  key={`glow-${pulse}`}
                  initial={{ scale: 0.6, opacity: 0.65 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 rounded-full bg-weha-teal/40 blur-md"
                />
              </>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -160, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 160, scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 13 }}
                className="absolute inset-0 grid place-items-center"
              >
                {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <Magnetic strength={0.3} className="hidden sm:inline-flex">
            <Link to="/contact" className="btn-teal text-[0.8rem] px-4 py-2.5 md:text-[0.95rem] md:px-[1.6rem] md:py-[0.85rem]" data-testid="header-cta" data-cursor="hover" onClick={(e) => { e.preventDefault(); openBooking(); }}>
              Talk To Us <ArrowRight size={16} />
            </Link>
          </Magnetic>

          <button
            onClick={() => setOpen((v) => !v)}
            data-testid="mobile-menu-toggle"
            aria-label="Menu"
            className="lg:hidden h-9 w-9 grid place-items-center rounded-full border border-weha-border text-weha-text"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen overlay */}
      <div
        data-testid="mobile-menu"
        className={`lg:hidden fixed inset-0 top-16 z-40 bg-weha-bg overflow-y-auto transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 pt-4 pb-4 flex flex-col gap-1">
          {[...links, { to: "/ai-workforce", label: "AI Workforce" }, { to: "/contact", label: "Contact" }].map((l, i) => {
            if (l.label === "Resources") {
              return (
                <div key={l.to} className="border-b border-weha-border">
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    data-testid="mobile-nav-resources"
                    className={({ isActive }) =>
                      `weha-display text-xl py-1.5 block ${isActive ? "text-weha-teal" : "text-weha-text"}`
                    }
                  >
                    Resources
                  </NavLink>
                  <div className="pb-2 pl-2 flex flex-col gap-0.5">
                    {RESOURCE_CHILDREN.map((c) => {
                      const Icon = c.icon;
                      return (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          onClick={() => setOpen(false)}
                          data-testid={`mobile-nav-resources-${c.key}`}
                          className={({ isActive }) =>
                            `flex items-center gap-3 py-1 text-sm ${isActive ? "text-weha-teal" : "text-weha-muted"}`
                          }
                        >
                          <Icon size={15} className="text-weha-teal" /> {c.title}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `weha-display text-xl py-1.5 border-b border-weha-border ${
                    isActive ? "text-weha-teal" : "text-weha-text"
                  }`
                }
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {l.flagship && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-weha-marigold align-middle" aria-hidden="true" />}
                {l.label}
              </NavLink>
            );
          })}
          <Link
            to="/contact"
            onClick={(e) => { e.preventDefault(); setOpen(false); openBooking(); }}
            className="btn-teal mt-3 justify-center"
            data-testid="mobile-cta"
          >
            Talk To Us <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
