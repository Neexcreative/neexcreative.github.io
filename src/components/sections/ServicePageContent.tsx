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

/** Shared hybrid layout for all five service pages: dark hero, light body. */
export default function ServicePageContent({ service, children }: ServicePageContentProps) {
  const otherServices = services.filter((s) => s.href !== service.path);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />

      {/* Dark hero, consistent with the homepage opening. */}
      <section className="bg-bg text-text">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
          {/* Not animated: the H1 is the page's LCP element. */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              {service.kicker}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {service.h1}
            </h1>
          </div>

          <AnimateIn delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4 md:mt-14">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-85"
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

      {/* Light institutional body. */}
      <section aria-label="Overview" className="bg-light-bg text-light-text">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1fr_1fr] md:px-12 md:py-24">
          {/* Not animated: on mobile this copy is the LCP element. */}
          <div className="flex flex-col gap-6">
            {service.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="max-w-xl text-base leading-relaxed text-light-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <AnimateIn delay={0.1}>
            <div>
              <h2 className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-light-accent">
                {service.deliverablesTitle}
              </h2>
              <ul className="mt-6 divide-y divide-light-border border-y border-light-border">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable.title} className="py-5">
                    <h3 className="text-base font-semibold">{deliverable.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-light-muted">
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

      <section
        aria-labelledby="system-note-title"
        className="border-t border-light-border bg-light-bg text-light-text"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <AnimateIn>
            <h2
              id="system-note-title"
              className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-light-accent"
            >
              Part of One System
            </h2>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed md:text-2xl">
              {service.systemNote}
            </p>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <ul className="mt-10 flex flex-wrap gap-3">
              {otherServices.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={other.href}
                    className="inline-block border border-light-border bg-light-surface px-4 py-2 text-xs uppercase tracking-[0.12em] text-light-muted transition-colors hover:border-light-muted hover:text-light-text"
                  >
                    {other.title}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimateIn>
        </div>
      </section>

      <section
        aria-labelledby="related-reading-title"
        className="border-t border-light-border bg-light-bg text-light-text"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:items-end">
            <AnimateIn>
              <div>
                <h2
                  id="related-reading-title"
                  className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-light-accent"
                >
                  Related Reading
                </h2>
                <ul className="mt-6 divide-y divide-light-border border-y border-light-border">
                  {service.related.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-baseline justify-between gap-6 py-4"
                      >
                        <span className="text-base transition-colors group-hover:text-light-accent">
                          {link.label}
                        </span>
                        <span className="text-light-accent" aria-hidden>
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
                <p className="text-base text-light-muted">Ready to start your project?</p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 bg-light-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
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
