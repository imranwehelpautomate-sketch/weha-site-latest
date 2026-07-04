import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ArrowRight, ChevronDown, BookOpen, Workflow, FileText } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useBooking } from "@/context/BookingContext";
import { EASE } from "@/lib/motion";
import Magnetic from "@/components/Magnetic";
import Logo from "@/components/Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/ai-workforce", label: "AI Workforce" },
  { to: "/work", label: "Work" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
];

const RESOURCE_CHILDREN = [
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
        to="/resources"
        data-testid="nav-resources"
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
            Resources
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
            className="absolute left-1/2 top-full z-50 w-[330px] -translate-x-1/2 pt-3"
            data-testid="resources-dropdown"
          >
            <div className="rounded-xl border border-weha-border bg-weha-bg p-2 shadow-xl">
              {RESOURCE_CHILDREN.map((c) => {
                const Icon = c.icon;
                return (
                  <NavLink
                    key={c.to}
                    to={c.to}
                    onClick={() => setOpen(false)}
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        open
          ? "bg-weha-bg border-b border-weha-border"
          : scrolled
          ? "backdrop-blur-xl bg-weha-bg/80 border-b border-weha-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 md:h-[72px] flex items-center justify-between">
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

        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {links.map((l) => {
            if (l.label === "Resources") return <ResourcesMenu key={l.to} />;
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
                  <span className="relative inline-block pb-1">
                    {l.label}
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
              Book a Free Audit <ArrowRight size={16} />
            </Link>
          </Magnetic>

          <button
            onClick={() => setOpen((v) => !v)}
            data-testid="mobile-menu-toggle"
            aria-label="Menu"
            className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-weha-border text-weha-text"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen overlay */}
      <div
        data-testid="mobile-menu"
        className={`md:hidden fixed inset-0 top-16 z-40 bg-weha-bg overflow-y-auto transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 pt-8 pb-12 flex flex-col gap-2">
          {links.map((l, i) => {
            if (l.label === "Resources") {
              return (
                <div key={l.to} className="border-b border-weha-border">
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    data-testid="mobile-nav-resources"
                    className={({ isActive }) =>
                      `weha-display text-3xl py-2.5 block ${isActive ? "text-weha-teal" : "text-weha-text"}`
                    }
                  >
                    Resources
                  </NavLink>
                  <div className="pb-4 pl-2 flex flex-col gap-1">
                    {RESOURCE_CHILDREN.map((c) => {
                      const Icon = c.icon;
                      return (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          onClick={() => setOpen(false)}
                          data-testid={`mobile-nav-resources-${c.key}`}
                          className={({ isActive }) =>
                            `flex items-center gap-3 py-2.5 text-lg ${isActive ? "text-weha-teal" : "text-weha-muted"}`
                          }
                        >
                          <Icon size={18} className="text-weha-teal" /> {c.title}
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
                  `weha-display text-3xl py-2.5 border-b border-weha-border ${
                    isActive ? "text-weha-teal" : "text-weha-text"
                  }`
                }
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {l.label}
              </NavLink>
            );
          })}
          <Link
            to="/contact"
            onClick={(e) => { e.preventDefault(); setOpen(false); openBooking(); }}
            className="btn-teal mt-8 justify-center"
            data-testid="mobile-cta"
          >
            Book a Free Audit <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
