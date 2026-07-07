// Shared JSON-LD building blocks for SEO + LLM crawlers.
// All schemas are industry-agnostic and price-free. The Organization node is
// the canonical entity, referenced by @id from every other node so Google (and
// LLM crawlers) resolve the whole site to a single, well-described business.

export const SITE = (
  process.env.REACT_APP_SITE_URL || "https://www.wehelpautomate.com"
).replace(/\/$/, "");

const DESCRIPTION =
  "AI automation agency. We turn manual workflows into systems that run themselves, built on the tools you already use and fully owned by you, with no lock-in. Built in days, not months.";

// Canonical Organization node. Reused (by @id) across every page. Modelled as
// both Organization and ProfessionalService for strong entity + local SEO.
export const ORG = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE}/#organization`,
  name: "We Help Automate",
  alternateName: "WeHA",
  legalName: "We Help Automate",
  url: SITE,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE}/#logo`,
    url: `${SITE}/icon-512.png`,
    contentUrl: `${SITE}/icon-512.png`,
    width: 512,
    height: 512,
    caption: "We Help Automate",
  },
  image: `${SITE}/og-default.png`,
  slogan: "AI automation that runs itself, built on the tools you already use.",
  description: DESCRIPTION,
  email: "hello@wehelpautomate.com",
  telephone: "+91-81808-61084",
  foundingDate: "2024",
  knowsAbout: [
    "AI automation",
    "Workflow automation",
    "Business process automation",
    "AI agents",
    "Agentic AI",
    "Lead generation automation",
    "CRM automation",
    "Marketing automation",
    "Customer support automation",
    "n8n",
    "Zapier",
    "Make",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "WeWork Amanora Crest, 4th Floor, Amanora Town Centre, Amanora Park Town, Hadapsar",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411028",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-81808-61084",
      email: "hello@wehelpautomate.com",
      contactType: "customer service",
      areaServed: ["IN", "AE", "AU", "SG"],
      availableLanguage: ["English"],
    },
  ],
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Country", name: "Australia" },
    { "@type": "Country", name: "Singapore" },
  ],
  founder: [
    { "@type": "Person", name: "Imran Shaikh", jobTitle: "Co-Founder" },
    {
      "@type": "Person",
      name: "Selena Thomas",
      jobTitle: "Co-Founder & COO",
      sameAs: ["https://www.linkedin.com/in/selena-thomas-9839472b8/"],
    },
  ],
  sameAs: [
    "https://www.linkedin.com/company/we-help-automate",
    "https://www.linkedin.com/in/selena-thomas-9839472b8/",
  ],
};

// Canonical WebSite node. Reused by @id from every WebPage node.
export const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: SITE,
  name: "We Help Automate",
  alternateName: "WeHA",
  description: DESCRIPTION,
  publisher: { "@id": `${SITE}/#organization` },
  inLanguage: "en",
};

// Build a BreadcrumbList from [{ name, path }] items. Pass pagePath to give it
// a stable @id so a WebPage node can reference it.
export const breadcrumb = (items, pagePath) => ({
  "@type": "BreadcrumbList",
  ...(pagePath ? { "@id": `${SITE}${pagePath}#breadcrumb` } : {}),
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE}${it.path}`,
  })),
});

// Build a WebPage (or subtype) node linked to the site + organization.
export const webPage = ({
  path,
  name,
  description,
  type = "WebPage",
  primaryImage,
  hasBreadcrumb = true,
}) => {
  const node = {
    "@type": type,
    "@id": `${SITE}${path}#webpage`,
    url: `${SITE}${path}`,
    name,
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#organization` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: primaryImage || `${SITE}/og-default.png`,
    },
    inLanguage: "en",
  };
  if (description) node.description = description;
  if (hasBreadcrumb) node.breadcrumb = { "@id": `${SITE}${path}#breadcrumb` };
  return node;
};

// Build a Service node provided by the organization.
export const service = ({ name, description, serviceType, areaServed = "Worldwide", url, id }) => ({
  "@type": "Service",
  ...(id ? { "@id": id } : {}),
  name,
  ...(description ? { description } : {}),
  ...(serviceType ? { serviceType } : {}),
  provider: { "@id": `${SITE}/#organization` },
  areaServed,
  ...(url ? { url: `${SITE}${url}` } : {}),
});

// Build a FAQPage from [[question, answer], ...] pairs OR [{ q, a }, ...].
export const faqPage = (pairs) => ({
  "@type": "FAQPage",
  mainEntity: pairs.map((item) => {
    const q = Array.isArray(item) ? item[0] : item.q;
    const a = Array.isArray(item) ? item[1] : item.a;
    return {
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    };
  }),
});

// Wrap a set of nodes into a single linked-data graph.
export const graph = (nodes) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});
