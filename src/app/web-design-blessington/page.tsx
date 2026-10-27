import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { withSocialMetadata } from "@/lib/metadata";
import AnimateIn from "@/components/AnimateIn";
import JsonLd from "@/components/JsonLd";
import WebProjectsGrid from "@/components/WebProjectsGrid";
import ContactForm from "@/components/ContactForm";
import Journey, { type JourneyStep } from "@/components/sections/Journey";
import { blessingtonLocalBusinessSchema, faqSchema } from "@/lib/schema";
import { siteConfig, webProjects, type WebProject } from "@/lib/site-config";

const title = "Website Design in Blessington, Co. Wicklow | Neex Creative";
const description =
  "Website design in Blessington, Co. Wicklow. Fast, mobile-first websites for local businesses, built to bring in real enquiries. Fixed price, and you own your site.";

export const metadata: Metadata = withSocialMetadata({
  title: { absolute: title },
  description,
  alternates: { canonical: "/web-design-blessington" },
  openGraph: { title, description, url: "/web-design-blessington" },
});

/** Local copy for the two cases; image, link and type come from site-config. */
const caseDescriptions: Record<string, string> = {
  "RG Mobile Tyre Services":
    "A clear, mobile-first site built to turn local searches into phone calls.",
  "Studio AG Dublin": "A focused landing page designed to do one job: convert the visitor.",
};

const cases: WebProject[] = webProjects
  .filter((project) => project.name in caseDescriptions)
  .map((project) => ({ ...project, description: caseDescriptions[project.name] }));

const processSteps: JourneyStep[] = [
  {
    number: "01",
    title: "Conversation",
    description:
      "We start with your business, not a template: what you do, who you serve, and what the site needs to achieve.",
  },
  {
    number: "02",
    title: "Strategy & Design",
    description:
      "Structure, message and look planned as one, so every page earns trust and guides the visitor toward getting in touch.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "A modern, fast, mobile-first website. When it's finished, the code is yours. No lock-in.",
  },
  {
    number: "04",
    title: "Launch & Support",
    description:
      "We set it live, make sure it works everywhere, and stay reachable after it's up.",
  },
];

/** Fixed prices, never more than 4 pages, domain never included. */
const packages = [
  {
    name: "Landing Page",
    price: "€800",
    recommended: false,
    features: [
      "One page with linked sections: Home, About, Services, Contact",
      "Responsive on every screen",
      "Clear calls to action and social links",
      "Structured to be read by Google and AI search",
      "Set up and launched for you",
      "One-off payment, no monthly fee",
    ],
  },
  {
    name: "Business Website",
    price: "€1,750",
    recommended: true,
    features: [
      "Up to 4 pages",
      "Design tailored to your brand",
      "Your content, images and video integrated",
      "SEO-ready structure",
      "AI search ready, so ChatGPT and Google AI Overviews can find and cite you",
      "30 days of support after launch",
      "One-off payment, no monthly fee",
    ],
  },
  {
    name: "Growth Package",
    price: "€2,900",
    recommended: false,
    features: [
      "Everything in Business Website",
      "Photo session (2 to 3 hours) with 15 to 25 edited photos",
      "SEO setup and Google Business Profile setup",
      "AI search optimisation (GEO): business details and FAQs set up so AI assistants recommend you",
      "30 days of support after launch",
      "One-off payment, no monthly fee",
    ],
  },
];

const faqs = [
  {
    question: "How much does a website cost?",
    answer:
      "A one-page site starts from €800 + VAT. Our Business Website, up to 4 pages, is €1,750 + VAT. Every project is scoped in writing before we start, so you know the price upfront.",
  },
  {
    question: "How long does it take?",
    answer:
      "Most sites go live within 2 to 4 weeks, depending on the number of pages and how quickly your content and photos are ready.",
  },
  {
    question: "Do I own the website?",
    answer:
      "Yes. When the build is finished, the website and its code are yours. The domain is registered in your name and paid by you directly, so you control it from day one. Domain and hosting costs are not included in the package unless agreed.",
  },
  {
    question: "Do you meet clients in person?",
    answer:
      "We're relocating to Blessington in December 2026 and will meet local businesses face to face. Until then, we're a short drive away and happy to meet or call.",
  },
  {
    question: "Will my business show up in AI search like ChatGPT?",
    answer:
      "More and more people ask ChatGPT, Gemini or Google's AI Overviews for a local recommendation. We build every site with clear structure and structured data so AI assistants can read it, understand what you do and where, and cite you. The Growth Package goes further, with full AI search optimisation and your Google Business Profile set up.",
  },
  {
    question: "Do you only work with Blessington businesses?",
    answer:
      "No. We work across Wicklow, Kildare and Dublin. But if you're local, you'll find us easy to reach.",
  },
];

const relatedReading = [
  {
    label: "Branding for Blessington Businesses: Standing Out as the Town Grows",
    href: "/blog/branding-for-blessington-businesses",
  },
  {
    label: "Social Media for Blessington Businesses: How to Reach Local Customers",
    href: "/blog/social-media-for-blessington-businesses",
  },
];

const labelClasses = "font-sans text-xs font-medium uppercase tracking-[0.22em]";
const lightHeadingClasses = "max-w-3xl text-3xl font-bold leading-[1.05] tracking-tight md:text-4xl";
const primaryButton =
  "inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap bg-accent px-4 py-3.5 text-xs font-medium uppercase tracking-[0.14em] sm:flex-none sm:px-6 sm:py-3 sm:tracking-[0.18em] text-bg transition-opacity hover:opacity-85";
const secondaryButton =
  "inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap border border-border px-4 py-3.5 text-xs font-medium uppercase tracking-[0.14em] sm:flex-none sm:px-6 sm:py-3 sm:tracking-[0.18em] text-muted transition-colors hover:border-muted hover:text-text";

/**
 * Local SEO landing page for Blessington. /web-design covers the service;
 * this page covers the place, so no section repeats between the two.
 */
export default function WebDesignBlessingtonPage() {
  return (
    <>
      <JsonLd data={blessingtonLocalBusinessSchema} />
      <JsonLd data={faqSchema(faqs)} />

      {/* Dark hero, same treatment as the homepage. */}
      <section className="relative overflow-hidden border-b border-border bg-bg text-text">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          quality={50}
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/85 to-bg" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-10 sm:py-20 md:px-12 md:py-28">
          {/* Not animated: the H1 is the LCP element. */}
          <div>
            <h1 className="max-w-4xl text-[2.35rem] font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Websites that bring in <span className="text-accent">real enquiries</span>.
            </h1>
          </div>

          <AnimateIn delay={0.1}>
            <div className="mt-6 flex flex-col gap-6 sm:mt-10 sm:gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-[15px] leading-relaxed text-muted sm:text-base">
                Fast, mobile-first websites for Blessington and West Wicklow businesses, built to
                earn trust and turn visitors into customers. And when it&apos;s done, you own it.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <a href="#contact" className={primaryButton}>
                  Get a Quote <span aria-hidden>→</span>
                </a>
                <Link href="/work" className={secondaryButton}>
                  View Our Work
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* The local problem. */}
      <section aria-labelledby="local-problem-title" className="bg-light-bg text-light-text">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1fr_1fr] md:px-12 md:py-24">
          <AnimateIn>
            <h2 id="local-problem-title" className={lightHeadingClasses}>
              Most Blessington businesses are better than their website shows.
            </h2>
            <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-light-border">
              <Image
                src="/images/blessington/blessington-town.jpg"
                alt="Aerial view of Blessington town centre, Co. Wicklow"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="flex flex-col gap-6">
              <p className="max-w-xl text-base leading-relaxed text-light-muted">
                Blessington is growing fast. New homes are going up across the town, and new families
                are moving in. Families who find every service on their phone before
                they ever walk through a door.
              </p>
              <p className="max-w-xl text-base leading-relaxed text-light-muted">
                Yet most local businesses still run on word of mouth. Their site is dated,
                awkward on mobile, or doesn&apos;t exist at all. Along Main Street and out in
                Burgage, Crosschapel and Three Castles, there are great businesses that just
                don&apos;t look as professional online as the work they actually do.
              </p>
              <p className="max-w-xl text-base leading-relaxed text-light-muted">
                A website should work as a business tool, not sit there looking pretty. Make the
                first impression. Build trust. Turn a visitor into an enquiry. That&apos;s what we
                build.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Short story band. */}
      <section
        aria-labelledby="local-story-title"
        className="border-t border-light-border bg-light-bg text-light-text"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-[1.2fr_1fr] md:px-12 md:py-24">
          <AnimateIn>
            <h2 id="local-story-title" className={lightHeadingClasses}>
              We&apos;re moving to Blessington to work with the businesses here.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-light-muted">
              Neex Creative is a creative studio relocating its base to Blessington in December
              2026. Not a city agency two counties away. The same town as you. We know the Irish
              market, we know how local business works, and we&apos;re building here for the long
              term.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden border border-light-border">
              <Image
                src="/images/blessington/blessington-lakes-4x3.jpg"
                alt="Blessington and the Blessington Lakes, Co. Wicklow"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Proof: web work only. */}
      <section
        aria-labelledby="local-work-title"
        className="border-t border-light-border bg-light-bg text-light-text"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <AnimateIn>
            <h2 id="local-work-title" className={lightHeadingClasses}>
              Websites we&apos;ve built.
            </h2>
          </AnimateIn>
          <div className="mt-10 md:mt-14">
            <WebProjectsGrid projects={cases} />
          </div>
          <AnimateIn>
            <Link
              href="/work"
              className="mt-12 inline-block text-sm text-light-accent underline-offset-4 hover:underline"
            >
              See all our work <span aria-hidden>→</span>
            </Link>
          </AnimateIn>
        </div>
      </section>

      <Journey palette="light" title="From first conversation to launch." steps={processSteps} />

      {/* Fixed-price packages: three cards, the middle one recommended. */}
      <section
        aria-labelledby="package-title"
        className="border-t border-light-border bg-light-bg text-light-text"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <AnimateIn>
            <h2 id="package-title" className={lightHeadingClasses}>
              Fixed price, agreed before we start.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-light-muted">
              No estimate creeping upward as we go. No monthly fee quietly renting your own
              website back to you. You own the site outright.
            </p>
            <Link
              href="/web-design"
              className="mt-6 inline-block text-sm text-light-accent underline-offset-4 hover:underline"
            >
              More about our web design service <span aria-hidden>→</span>
            </Link>
          </AnimateIn>

          <div className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <AnimateIn key={pkg.name} delay={index * 0.1}>
                <div
                  className={`flex h-full flex-col border bg-light-surface p-7 md:p-10 ${
                    pkg.recommended ? "border-light-accent" : "border-light-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold tracking-tight">{pkg.name}</h3>
                    {pkg.recommended && (
                      <span className="bg-light-accent px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-light-on-accent">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-4 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                    {pkg.price}{" "}
                    <span className="text-base font-normal text-light-muted">+ VAT</span>
                  </p>
                  <ul className="mt-6 flex-1 divide-y divide-light-border border-y border-light-border">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex gap-3 py-4 text-sm">
                        <span className="text-light-accent" aria-hidden>
                          →
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={`mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] ${
                      pkg.recommended
                        ? "bg-light-accent text-light-on-accent transition-opacity hover:opacity-85"
                        : "border border-light-border text-light-muted transition-colors hover:border-light-muted hover:text-light-text"
                    }`}
                  >
                    Get a Quote <span aria-hidden>→</span>
                  </a>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-light-muted">
              All prices + VAT. 60% deposit to start, 40% on delivery. Two rounds of revisions
              included. Domain and hosting are not included: the domain is registered in your
              name, so you own it.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ: native details/summary, works without JS. */}
      <section
        aria-labelledby="faq-title"
        className="border-t border-light-border bg-light-bg text-light-text"
      >
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-12 md:py-24">
          <AnimateIn>
            <h2 id="faq-title" className={`mx-auto text-center ${lightHeadingClasses}`}>
              Questions, answered.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="mt-10 divide-y divide-light-border border-y border-light-border md:mt-14">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group transition-colors duration-300 hover:bg-light-surface open:bg-light-surface"
                >
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 px-4 py-5 [&::-webkit-details-marker]:hidden md:px-6">
                    <h3 className="text-base font-semibold transition-all duration-300 group-hover:translate-x-1 group-hover:text-light-accent">
                      {faq.question}
                    </h3>
                    <span
                      className="text-light-accent transition-transform duration-300 group-hover:scale-125 group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl px-4 pb-5 text-sm leading-relaxed text-light-muted md:px-6">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Related reading, same list style as the service pages. */}
      <section
        aria-labelledby="related-reading-title"
        className="border-t border-light-border bg-light-bg text-light-text"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <AnimateIn>
            <div className="max-w-3xl">
              <h2 id="related-reading-title" className={`${labelClasses} text-light-accent`}>
                Related Reading
              </h2>
              <ul className="mt-6 divide-y divide-light-border border-y border-light-border">
                {relatedReading.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group flex items-baseline justify-between gap-6 py-4">
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
        </div>
      </section>

      {/* Dark closing contact, same treatment as the dark ContactCTA. */}
      <section
        id="contact"
        aria-labelledby="local-contact-title"
        className="scroll-mt-20 bg-bg text-text"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32 lg:py-40">
          <AnimateIn>
            <h2
              id="local-contact-title"
              className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            >
              Let&apos;s build <em className="not-italic text-accent">something</em> that works.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Tell us about your business and what you need. We&apos;ll come back with a clear
              next step.
            </p>
          </AnimateIn>

          <div className="mt-14 grid gap-12 border-t border-border pt-10 lg:grid-cols-[1fr_1.4fr]">
            <AnimateIn>
              <div className="flex flex-col gap-6 text-sm text-muted">
                <p>
                  Prefer to talk? WhatsApp or call{" "}
                  <a
                    href={siteConfig.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {siteConfig.phone}
                  </a>
                </p>
                <p>
                  Or email us directly:{" "}
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                </p>
                <p>
                  Rather book a time?{" "}
                  <Link
                    href="/book"
                    className="text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    Book a free 30-minute call
                  </Link>
                </p>
              </div>
            </AnimateIn>

            {/* Same quote form as /contact, so enquiries are tracked as leads. */}
            <AnimateIn delay={0.1}>
              <div className="border border-light-border bg-light-surface p-6 md:p-8">
                <ContactForm defaultService="web-full" defaultLocation="Blessington" />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
