// Infinite horizontal ticker of integration logos.
// Logos are real, full-color, transparent SVGs served locally from /public/logos.
import { useState, useEffect, useRef } from "react";
// A handful of brands ship a single-tone (monochrome) mark; those are flagged
// `mono` so they render dark on the light theme and invert to light on the dark
// theme, staying legible either way. Colored logos are shown as-is.
const TOOLS = [
  // Automation + tools
  { name: "n8n",           slug: "n8n" },
  { name: "Make",          slug: "make" },
  { name: "Zapier",        slug: "zapier" },
  { name: "HubSpot",       slug: "hubspot" },
  { name: "Airtable",      slug: "airtable" },
  { name: "WhatsApp",      slug: "whatsapp" },
  { name: "Slack",         slug: "slack" },
  { name: "Notion",        slug: "notion", mono: true },
  { name: "Google Sheets", slug: "googlesheets" },
  // Leading LLMs
  { name: "OpenAI",        slug: "openai", mono: true },
  { name: "Claude",        slug: "claude" },
  { name: "Gemini",        slug: "gemini" },
  { name: "Mistral",       slug: "mistral" },
  { name: "DeepSeek",      slug: "deepseek" },
  { name: "Perplexity",    slug: "perplexity" },
  { name: "Cohere",        slug: "cohere" },
  { name: "Grok",          slug: "grok", mono: true },
  { name: "Qwen",          slug: "qwen", mono: true },
  { name: "Kimi",          slug: "kimi" },
  { name: "Llama",         slug: "meta" },
  // Agentic frameworks + dev tools
  { name: "LangChain",     slug: "langchain" },
  { name: "Hugging Face",  slug: "huggingface" },
  { name: "Ollama",        slug: "ollama", mono: true },
  { name: "OpenCode",      slug: "opencode", mono: true },
  { name: "OpenClaw",      slug: "openclaw" },
  { name: "Cursor",        slug: "cursor", mono: true },
];

const PUBLIC_URL = process.env.PUBLIC_URL || "";

function Logo({ name, slug, mono }) {
  return (
    <div
      className="shrink-0 mx-7 md:mx-10 flex items-center gap-3 group"
      title={name}
      data-testid={`integration-logo-${slug}`}
    >
      <img
        src={`${PUBLIC_URL}/logos/${slug}.svg`}
        alt={`${name} logo`}
        className={`h-7 md:h-8 w-auto max-w-[110px] object-contain opacity-90 group-hover:opacity-100 transition duration-300 group-hover:scale-105 ${
          mono ? "dark:invert dark:brightness-200" : ""
        }`}
        loading="eager"
        decoding="async"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
      <span className="text-sm md:text-[0.95rem] font-medium text-weha-muted group-hover:text-weha-text transition-colors whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default function IntegrationStrip({ heading = "Fluent in your stack" }) {
  // Start the ticker only after fonts and logo images have finished loading.
  // Until then the track width is not final; animating to translateX(-50%) on a
  // still-changing width is what caused the brief jitter on a fresh reload.
  const [ready, setReady] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const markReady = () => { if (!cancelled) setReady(true); };

    const waitImages = () => {
      const root = trackRef.current;
      if (!root) return Promise.resolve();
      const imgs = Array.from(root.querySelectorAll("img"));
      return Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.addEventListener("load", res, { once: true });
                img.addEventListener("error", res, { once: true });
              })
        )
      );
    };

    const fontsReady =
      typeof document !== "undefined" && document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    Promise.all([fontsReady, waitImages()]).then(markReady);

    // Safety net: never leave the ticker frozen if a resource stalls.
    const t = setTimeout(markReady, 3000);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  return (
    <section
      aria-label="Tool fluency — integrations we build with"
      data-testid="integration-strip"
      className="relative border-y border-weha-border bg-weha-surface/70 backdrop-blur-sm py-7 md:py-9 overflow-hidden"
    >
      <p className="text-center text-[0.7rem] md:text-xs font-semibold tracking-[0.22em] uppercase text-weha-faint mb-5">
        {heading}
      </p>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 z-10"
           style={{ background: "linear-gradient(to right, var(--weha-bg), transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 z-10"
           style={{ background: "linear-gradient(to left, var(--weha-bg), transparent)" }} />
      <div className={`weha-marquee ${ready ? "is-ready" : ""}`} data-testid="integration-marquee">
        <div className="weha-marquee__track" ref={trackRef}>
          {TOOLS.map((t) => <Logo key={`a-${t.slug}`} {...t} />)}
          {/* duplicated set for seamless loop */}
          {TOOLS.map((t) => <Logo key={`b-${t.slug}`} {...t} />)}
        </div>
      </div>
    </section>
  );
}
