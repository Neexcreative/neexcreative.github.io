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
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-12 md:py-40 lg:py-48">
        <AnimateIn>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-light-accent">
            What We Do
          </p>
          <h2
            id="services-title"
            className="mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
          >
            Not five services.
            <br />
            One growth engine.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-light-muted">
            Strategy shapes the design, design carries the content, content
            feeds the distribution. From the first impression to the
            conversion — one system.
          </p>
        </AnimateIn>

        <div className="mt-20 md:mt-28">
          {services.map((service, index) => (
            <AnimateIn key={service.slug} delay={index * 0.1}>
              <Link
                href={service.href}
                className="group grid gap-3 border-b border-light-border py-10 transition-colors hover:border-light-muted md:grid-cols-[6rem_1fr_auto] md:items-baseline md:gap-8 md:py-12"
              >
                <span className="font-sans text-2xl text-light-muted md:text-3xl" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-2">
                  <span className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-light-accent md:text-3xl">
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
