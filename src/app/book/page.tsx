import type { Metadata } from "next";
import Script from "next/script";
import AnimateIn from "@/components/AnimateIn";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Book a Call",
  description: "Book a 30-minute discovery call with Neex Creative.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book a Call — Neex Creative",
    description: "Book a 30-minute discovery call with Neex Creative.",
    url: "/book",
  },
};

const meta = [
  "Response time: 24–48h",
  "Based in Dublin / Remote",
  "Best to send: brief + references",
];

export default function BookPage() {
  return (
    <>
      {/* Dark hero, consistent with the homepage opening. */}
      <section className="bg-bg text-text">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
          {/* Not animated: the H1 is the page's LCP element. */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              Neex Creative
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Book a Call
            </h1>
            <p className="mt-4 text-sm text-muted">Choose a time that works best for you below.</p>
          </div>
        </div>
      </section>

      {/* Light institutional body. */}
      <section aria-label="Booking" className="bg-light-bg text-light-text">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <AnimateIn>
              <div className="border border-light-border bg-light-surface p-8">
                <p className="text-xs uppercase tracking-[0.18em] text-light-muted">
                  Discovery Call
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                  30-min discovery call
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-light-muted">
                  Quick alignment on your goals, scope, timeline, and the best
                  next steps.
                </p>

                <ul className="mt-8 divide-y divide-light-border border-y border-light-border">
                  {meta.map((item) => (
                    <li key={item} className="py-3 text-sm text-light-muted">
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-light-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
                >
                  Open in Calendly <span aria-hidden>→</span>
                </a>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <div
                className="calendly-inline-widget min-h-[600px] border border-light-border bg-light-surface"
                data-url={siteConfig.calendlyUrl}
                aria-label="Calendly booking calendar"
              />
            </AnimateIn>
          </div>
        </div>
      </section>

      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </>
  );
}
