import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import { services } from "@/lib/site-config";

export default function ServicesSystem() {
  return (
    <section id="services" aria-labelledby="services-title" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        <AnimateIn>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">What We Do</p>
          <h2 id="services-title" className="mt-4 max-w-3xl text-3xl font-semibold leading-snug tracking-tight md:text-4xl">
            Not five services. One growth engine.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Strategy shapes the design, design carries the content, content
            feeds the distribution. From the first impression to the
            conversion — one system.
          </p>
        </AnimateIn>

        <div className="mt-14">
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
      </div>
    </section>
  );
}
