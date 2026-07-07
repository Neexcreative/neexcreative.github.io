import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import { services } from "@/lib/site-config";

/** Homepage services — the institutional, airy light block after the dark hero. */
export default function ServicesSystem() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="bg-light-bg text-light-text"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32 lg:py-40">
        <AnimateIn>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-light-accent">
            What We Do
          </p>
          <h2
            id="services-title"
            className="mt-4 max-w-3xl text-3xl font-semibold leading-snug tracking-tight md:text-4xl"
          >
            Not five services. One growth engine.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-light-muted">
            Strategy shapes the design, design carries the content, content
            feeds the distribution. From the first impression to the
            conversion — one system.
          </p>
        </AnimateIn>

        <div className="mt-16">
          {services.map((service, index) => (
            <AnimateIn key={service.slug} delay={index * 0.1}>
              <Link
                href={service.href}
                className="group grid gap-3 border-b border-light-border py-8 transition-colors hover:border-light-muted md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-8"
              >
                <span className="font-sans text-2xl text-light-muted md:text-3xl" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-2">
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
      </div>
    </section>
  );
}
