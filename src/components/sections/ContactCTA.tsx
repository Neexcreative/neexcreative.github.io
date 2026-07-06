import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import { siteConfig } from "@/lib/site-config";

export default function ContactCTA() {
  return (
    <section aria-labelledby="contact-cta-title">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32 lg:py-40">
        <AnimateIn>
          <h2
            id="contact-cta-title"
            className="max-w-3xl text-4xl font-medium leading-[1.1] sm:text-5xl md:text-6xl"
          >
            Let&apos;s build <em className="text-accent not-italic">something</em>{" "}
            remarkable.
          </h2>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="mt-14 flex flex-col gap-10 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Get in touch</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-3 block text-xl font-medium transition-colors hover:text-accent md:text-2xl"
              >
                {siteConfig.email}
              </a>
              <Link
                href="/about"
                className="mt-3 inline-block text-sm text-muted transition-colors hover:text-text"
              >
                Meet the Designer <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:border-muted hover:text-text"
              >
                View Work
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-text transition-opacity hover:opacity-85"
              >
                Get a Quote <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
