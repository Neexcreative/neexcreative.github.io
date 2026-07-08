import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageContent from "@/components/sections/ServicePageContent";
import { getServiceContent, servicesContent } from "@/lib/services-content";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

/** Slugs served under /services/* — web design lives at its legacy /web-design path. */
const nestedSlugs = servicesContent
  .filter((service) => service.path.startsWith("/services/"))
  .map((service) => service.slug);

export function generateStaticParams() {
  return nestedSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceContent(slug);
  if (!service || !nestedSlugs.includes(slug)) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: service.path },
    openGraph: {
      title: `${service.metaTitle} — Neex Creative`,
      description: service.metaDescription,
      url: service.path,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceContent(slug);
  if (!service || !nestedSlugs.includes(slug)) notFound();

  return <ServicePageContent service={service} />;
}
