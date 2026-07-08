import type { Metadata } from "next";
import AnimateIn from "@/components/AnimateIn";
import ServicePageContent from "@/components/sections/ServicePageContent";
import WebProjectsGrid from "@/components/WebProjectsGrid";
import { getServiceContent } from "@/lib/services-content";

const service = getServiceContent("web-design");
if (!service) throw new Error("web-design service content missing");

export const metadata: Metadata = {
  // Absolute: preserves the exact title indexed for the legacy web-design.html.
  title: { absolute: "Web Design Dublin | Custom Websites — Neex Creative" },
  description: service.metaDescription,
  alternates: { canonical: "/web-design" },
  openGraph: {
    title: "Web Design Dublin | Custom Websites — Neex Creative",
    description: service.metaDescription,
    url: "/web-design",
  },
};

export default function WebDesignPage() {
  return (
    <ServicePageContent service={service!}>
      {/* Ported from legacy web-design.html: "Websites We've Built". */}
      <section
        aria-labelledby="web-built-title"
        className="border-t border-light-border bg-light-bg text-light-text"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <AnimateIn>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-light-accent">
              Web Projects
            </p>
            <h2 id="web-built-title" className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Websites We&apos;ve Built
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-light-muted">
              Every project is custom-built — no templates, no page builders.
              Designed for performance, clarity and lasting brand presence.
            </p>
          </AnimateIn>

          <div className="mt-12">
            <WebProjectsGrid />
          </div>
        </div>
      </section>
    </ServicePageContent>
  );
}
