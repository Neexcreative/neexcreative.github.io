import { siteConfig } from "@/lib/site-config";
import type { ServiceContent } from "@/lib/services-content";

/** Shared Organization node reused by page-level schemas. */
export const organizationSchema = {
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer enquiries",
    email: siteConfig.email,
    telephone: siteConfig.phone,
    url: `${siteConfig.url}/contact`,
  },
  logo: `${siteConfig.url}/images/logo_dark.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.address.city,
    addressCountry: siteConfig.address.countryCode,
  },
} as const;

/** Site-wide graph: Organization + WebSite with blog SearchAction. */
export const siteGraphSchema = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
} as const;

/** LocalBusiness node for the homepage, with city-level location and hours. */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}/#localbusiness`,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.address.city,
    addressCountry: siteConfig.address.countryCode,
  },
  areaServed: [
    { "@type": "City", name: "Dublin" },
    { "@type": "Country", name: "Ireland" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/neexcreative/",
    "https://www.linkedin.com/company/neexcreative/",
    "https://www.behance.net/neexcreative",
    "https://www.youtube.com/@marloneex",
  ],
} as const;

/**
 * LocalBusiness node for /web-design-blessington. No streetAddress until the
 * move to Blessington in December 2026; the address stays at city level.
 */
export const blessingtonLocalBusinessSchema = {
  ...localBusinessSchema,
  "@id": `${siteConfig.url}/web-design-blessington#localbusiness`,
  url: `${siteConfig.url}/web-design-blessington`,
  description:
    "Website design for Blessington and West Wicklow businesses: fast, mobile-first websites built to bring in real enquiries, owned outright by the client.",
  areaServed: [
    { "@type": "City", name: "Blessington" },
    { "@type": "AdministrativeArea", name: "County Wicklow" },
    { "@type": "AdministrativeArea", name: "County Kildare" },
  ],
} as const;

/** FAQPage for a page's visible question list (answers must match the page). */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function serviceSchema(service: ServiceContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.metaTitle,
    description: service.metaDescription,
    url: `${siteConfig.url}${service.path}`,
    serviceType: service.kicker,
    areaServed: [
      { "@type": "City", name: "Dublin" },
      { "@type": "Country", name: "Ireland" },
    ],
    provider: organizationSchema,
  };
}
