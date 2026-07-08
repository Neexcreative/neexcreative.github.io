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
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <AnimateIn>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-light-accent">
            What We Do
          </p>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2
              id="services-title"
              className="max-w-2xl text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl"
            >
              Not five services. One growth engine.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-light-muted md:text-right">
              Strategy shapes the design, design carries the content, content
              feeds the distribution. From the first impression to the
              conversion — one system.
            </p>
          </div>
        </AnimateIn>

        <div className="mt-10 md:mt-14">
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
      </div>
    </section>
  );
}
