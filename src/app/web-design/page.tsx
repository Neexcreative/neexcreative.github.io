import type { Metadata } from "next";
import { withSocialMetadata } from "@/lib/metadata";
import ServicePageContent from "@/components/sections/ServicePageContent";
import { getServiceContent } from "@/lib/services-content";

const service = getServiceContent("web-design");
if (!service) throw new Error("web-design service content missing");

export const metadata: Metadata = withSocialMetadata({
  // Absolute: preserves the exact title indexed for the legacy web-design.html.
  title: { absolute: "Web Design Dublin | Custom Websites | Neex Creative" },
  description: service.metaDescription,
  alternates: { canonical: "/web-design" },
  openGraph: {
    title: "Web Design Dublin | Custom Websites | Neex Creative",
    description: service.metaDescription,
    url: "/web-design",
  },
});

export default function WebDesignPage() {
  return <ServicePageContent service={service!} />;
}
