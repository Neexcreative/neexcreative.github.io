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
  logo: `${siteConfig.url}/images/logo_dark.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.countryCode,
  },
} as const;

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
