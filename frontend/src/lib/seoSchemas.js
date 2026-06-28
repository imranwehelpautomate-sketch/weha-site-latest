// Shared JSON-LD building blocks for SEO + LLM crawlers.
// All schemas are industry-agnostic, geography-agnostic, IAM-free, and price-free.

export const SITE = (
  process.env.REACT_APP_SITE_URL || "https://www.wehelpautomate.com"
).replace(/\/$/, "");

// Canonical Organization node. Reused (by @id) across every page.
export const ORG = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "We Help Automate",
  alternateName: "WeHA",
  url: SITE,
  logo: `${SITE}/icon-512.png`,
  email: "hi@wehelpautomate.com",
  description:
    "AI automation studio. We turn manual workflows into systems that run themselves, built on the tools you already use and fully owned by you, with no lock-in.",
  sameAs: [
    "https://www.linkedin.com/company/we-help-automate",
    "https://www.linkedin.com/in/selena-thomas-9839472b8/",
  ],
};

// Build a BreadcrumbList from [{ name, path }] items.
export const breadcrumb = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE}${it.path}`,
  })),
});

// Build a FAQPage from [[question, answer], ...] pairs.
export const faqPage = (pairs) => ({
  "@type": "FAQPage",
  mainEntity: pairs.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

// Wrap a set of nodes into a single linked-data graph.
export const graph = (nodes) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});
