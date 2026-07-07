import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import { siteConfig } from "@/lib/site-config";

interface ContactCTAProps {
  /** "dark" keeps the original treatment (used on /services); homepage passes "light". */
  palette?: "dark" | "light";
}

export default function ContactCTA({ palette = "dark" }: ContactCTAProps) {
  const light = palette === "light";

  const mutedText = light ? "text-light-muted" : "text-muted";
  const borderTone = light ? "border-light-border" : "border-border";

  return (
    <section
      aria-labelledby="contact-cta-title"
      className={light ? "bg-light-bg text-light-text" : undefined}
    >
      <div
        className={`mx-auto max-w-7xl px-6 md:px-12 ${
          light ? "py-28 md:py-40 lg:py-48" : "py-24 md:py-32 lg:py-40"
        }`}
      >
        <AnimateIn>
          <h2
            id="contact-cta-title"
            className={`max-w-4xl text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl ${
              light ? "md:text-7xl" : "md:text-6xl"
            }`}
          >
            Let&apos;s build{" "}
            <em className={`not-italic ${light ? "text-light-accent" : "text-accent"}`}>
              something
            </em>{" "}
            remarkable.
          </h2>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div
            className={`mt-14 flex flex-col gap-10 border-t pt-10 md:flex-row md:items-end md:justify-between ${borderTone}`}
          >
            <div>
              <p className={`text-xs uppercase tracking-[0.18em] ${mutedText}`}>Get in touch</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className={`mt-3 block font-display text-xl font-semibold tracking-tight transition-colors md:text-2xl ${
                  light ? "hover:text-light-accent" : "hover:text-accent"
                }`}
              >
                {siteConfig.email}
              </a>
              <Link
                href="/about"
                className={`mt-3 inline-block text-sm transition-colors ${mutedText} ${
                  light ? "hover:text-light-text" : "hover:text-text"
                }`}
              >
                Meet the Designer <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#work"
                className={`inline-flex items-center gap-2 border px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                  light
                    ? "border-light-border text-light-muted hover:border-light-muted hover:text-light-text"
                    : "border-border text-muted hover:border-muted hover:text-text"
                }`}
              >
                View Work
              </Link>
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-85 ${
                  light ? "bg-light-accent text-white" : "bg-accent text-bg"
                }`}
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
