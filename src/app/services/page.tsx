import type { Metadata } from "next";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import Journey from "@/components/sections/Journey";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { services } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand strategy, web design, video production, marketing content and print — five services working as one growth system for Dublin businesses.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Neex Creative",
    description:
      "Brand strategy, web design, video production, marketing content and print — five services working as one growth system for Dublin businesses.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...organizationSchema,
        }}
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
          {/* Not animated: the H1 is the page's LCP element. */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Services</p>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Not five services. <span className="text-accent">One growth engine.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted">
              Strategy shapes the design, design carries the content, content
              feeds the distribution. From the first impression to the
              conversion — one system, built by a creative agency in Dublin.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="All services" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
          {services.map((service, index) => (
            <AnimateIn key={service.slug} delay={index * 0.1}>
              <Link
                href={service.href}
                className="group grid gap-3 border-b border-border py-8 transition-colors hover:border-muted md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-8"
              >
                <span className="text-2xl text-muted md:text-3xl" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-2">
                  <span className="text-xl font-medium transition-colors group-hover:text-accent md:text-2xl">
                    {service.title}
                  </span>
                  <span className="max-w-xl text-sm leading-relaxed text-muted">
                    {service.description}
                  </span>
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-muted">
                  {service.shortLabel}
                </span>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </section>

      <Journey />
      <ContactCTA />
    </>
  );
}
