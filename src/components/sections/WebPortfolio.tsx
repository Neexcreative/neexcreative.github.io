import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import WebProjectsGrid from "@/components/WebProjectsGrid";

export default function WebPortfolio() {
  return (
    <section aria-labelledby="web-portfolio-title" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        <AnimateIn>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Digital Portfolio
          </p>
          <h2 id="web-portfolio-title" className="mt-4 max-w-2xl text-3xl font-medium md:text-4xl">
            Websites &amp; Landing Pages
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Custom websites and landing pages designed to help businesses look
            professional, build trust and convert visitors into real enquiries.
          </p>
        </AnimateIn>

        <div className="mt-14">
          <WebProjectsGrid />
        </div>

        <AnimateIn>
          <div className="mt-16">
            <Link
              href="/web-design"
              className="text-sm text-muted transition-colors hover:text-text"
            >
              See all web projects <span aria-hidden>→</span>
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
