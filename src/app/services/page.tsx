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

      {/* Dark hero, consistent with the homepage opening. */}
      <section className="bg-bg text-text">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
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

      {/* Light institutional body. */}
      <section aria-label="All services" className="bg-light-bg text-light-text">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          {services.map((service, index) => (
            <AnimateIn key={service.slug} delay={index * 0.05}>
              <Link
                href={service.href}
                className="group grid gap-2 border-b border-light-border py-5 transition-colors hover:border-light-muted md:grid-cols-[4rem_1fr_auto] md:items-baseline md:gap-8 md:py-6"
              >
                <span className="font-sans text-sm text-light-muted" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-light-accent md:text-2xl">
                    {service.title}
                  </span>
                  <span className="max-w-xl text-sm leading-relaxed text-light-muted">
                    {service.description}
                  </span>
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-light-muted">
                  {service.shortLabel}
                </span>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </section>

      <Journey palette="light" />
      <ContactCTA palette="light" />
    </>
  );
}
