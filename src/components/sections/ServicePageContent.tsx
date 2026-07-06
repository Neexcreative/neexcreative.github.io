import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import JsonLd from "@/components/JsonLd";
import { serviceSchema } from "@/lib/schema";
import { services } from "@/lib/site-config";
import type { ServiceContent } from "@/lib/services-content";
import type { ReactNode } from "react";

interface ServicePageContentProps {
  service: ServiceContent;
  /** Optional extra section (e.g. the web projects grid on /web-design). */
  children?: ReactNode;
}

/** Shared editorial layout for all five service pages. */
export default function ServicePageContent({ service, children }: ServicePageContentProps) {
  const otherServices = services.filter((s) => s.href !== service.path);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
          <AnimateIn>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              {service.kicker}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.08] sm:text-5xl md:text-6xl">
              {service.h1}
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-text transition-opacity hover:opacity-85"
              >
                Get a Quote <span aria-hidden>→</span>
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:border-muted hover:text-text"
              >
                Book a Free Call
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      <section aria-label="Overview" className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[1fr_1fr] md:px-12 md:py-32">
          <AnimateIn>
            <div className="flex flex-col gap-6">
              {service.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="max-w-xl text-base leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
                {service.deliverablesTitle}
              </h2>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable.title} className="py-5">
                    <h3 className="text-base font-medium">{deliverable.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {deliverable.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>
        </div>
      </section>

      {children}

      <section aria-labelledby="system-note-title" className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
          <AnimateIn>
            <h2
              id="system-note-title"
              className="text-xs font-medium uppercase tracking-[0.22em] text-accent"
            >
              Part of One System
            </h2>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed md:text-2xl">
              {service.systemNote}
            </p>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <ul className="mt-12 flex flex-wrap gap-3">
              {otherServices.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={other.href}
                    className="inline-block border border-border px-4 py-2 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:border-muted hover:text-text"
                  >
                    {other.title}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimateIn>
        </div>
      </section>

      <section aria-labelledby="related-reading-title">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:items-end">
            <AnimateIn>
              <div>
                <h2
                  id="related-reading-title"
                  className="text-xs font-medium uppercase tracking-[0.22em] text-accent"
                >
                  Related Reading
                </h2>
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  {service.related.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-baseline justify-between gap-6 py-4"
                      >
                        <span className="text-base transition-colors group-hover:text-accent">
                          {link.label}
                        </span>
                        <span className="text-accent" aria-hidden>
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <div className="md:text-right">
                <p className="text-base text-muted">Ready to start your project?</p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-text transition-opacity hover:opacity-85"
                >
                  Get a Quote <span aria-hidden>→</span>
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
