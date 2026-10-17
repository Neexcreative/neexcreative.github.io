import type { Metadata } from "next";
import { withSocialMetadata } from "@/lib/metadata";
import AnimateIn from "@/components/AnimateIn";
import ContactForm from "@/components/ContactForm";
import { siteConfig, socialLinks } from "@/lib/site-config";

export const metadata: Metadata = withSocialMetadata({
  title: "Contact",
  description:
    "Get in touch with Neex Creative. Custom websites, brand identity, motion design and video production for Dublin businesses.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Neex Creative",
    description:
      "Get in touch with Neex Creative. Custom websites, brand identity, motion design and video production for Dublin businesses.",
    url: "/contact",
  },
});

const detailItems = [
  { label: "Location", value: "Dublin, Ireland" },
] as const;

export default function ContactPage() {
  return (
    <>
      {/* Dark hero, consistent with the homepage opening. */}
      <section className="bg-bg text-text">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
          {/* Not animated: the H1 is the page's LCP element. */}
          <div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Let&apos;s talk about your project.
            </h1>
          </div>
        </div>
      </section>

      {/* Light institutional body. */}
      <section aria-label="Contact details and quote form" className="bg-light-bg text-light-text">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr]">
            {/* Contact details */}
            <AnimateIn>
              <div>
                <h2 className="sr-only">Contact details</h2>
                <dl className="divide-y divide-light-border border-y border-light-border">
                  {detailItems.map((item) => (
                    <div key={item.label} className="py-5">
                      <dt className="text-xs uppercase tracking-[0.18em] text-light-muted">
                        {item.label}
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed">{item.value}</dd>
                    </div>
                  ))}
                  <div className="py-5">
                    <dt className="text-xs uppercase tracking-[0.18em] text-light-muted">
                      WhatsApp / Phone
                    </dt>
                    <dd className="mt-2 text-sm">
                      <a
                        href={siteConfig.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-light-accent"
                      >
                        {siteConfig.phone}
                      </a>
                      <span className="ml-3 border border-light-border bg-light-surface px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-light-muted">
                        Fastest response
                      </span>
                    </dd>
                  </div>
                  <div className="py-5">
                    <dt className="text-xs uppercase tracking-[0.18em] text-light-muted">Email</dt>
                    <dd className="mt-2 text-sm">
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="transition-colors hover:text-light-accent"
                      >
                        {siteConfig.email}
                      </a>
                    </dd>
                  </div>
                  <div className="py-5">
                    <dt className="text-xs uppercase tracking-[0.18em] text-light-muted">
                      Availability
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed">{siteConfig.availability}</dd>
                  </div>
                </dl>

                <ul className="mt-8 flex flex-wrap gap-3" aria-label="Social profiles">
                  {socialLinks
                    .filter((social) => social.label !== "YouTube")
                    .map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block border border-light-border bg-light-surface px-4 py-2 text-xs uppercase tracking-[0.12em] text-light-muted transition-colors hover:border-light-muted hover:text-light-text"
                        >
                          {social.label}
                        </a>
                      </li>
                    ))}
                </ul>

              </div>
            </AnimateIn>

            {/* Quote form */}
            <AnimateIn delay={0.1}>
              <div className="border border-light-border bg-light-surface p-6 md:p-8">
                <ContactForm />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
