import type { Metadata } from "next";
import AnimateIn from "@/components/AnimateIn";
import ContactForm from "@/components/ContactForm";
import { siteConfig, socialLinks } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Neex Creative. Custom websites, brand identity, motion design and video production for Dublin businesses.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Neex Creative",
    description:
      "Get in touch with Neex Creative. Custom websites, brand identity, motion design and video production for Dublin businesses.",
    url: "/contact",
  },
};

const detailItems = [
  { label: "Location", value: "Dublin, Ireland" },
  {
    label: "Address",
    value: `${siteConfig.address.street}, ${siteConfig.address.region}, ${siteConfig.address.postalCode}`,
  },
] as const;

const mapSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.3!2d-6.3284!3d53.3289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e9b4e0c3a0d%3A0x0!2s64+Galtymore+Rd%2C+Drimnagh%2C+Dublin+12!5e0!3m2!1sen!2sie!4v1700000000000";

export default function ContactPage() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        {/* Not animated: the H1 is the page's LCP element. */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Contact</p>
          <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.08] sm:text-5xl md:text-6xl">
            Let&apos;s talk about your project.
          </h1>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[0.92fr_1.08fr]">
          {/* Contact details */}
          <AnimateIn>
            <div>
              <h2 className="sr-only">Contact details</h2>
              <dl className="divide-y divide-border border-y border-border">
                {detailItems.map((item) => (
                  <div key={item.label} className="py-5">
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</dt>
                    <dd className="mt-2 text-sm leading-relaxed">{item.value}</dd>
                  </div>
                ))}
                <div className="py-5">
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted">
                    WhatsApp / Phone
                  </dt>
                  <dd className="mt-2 text-sm">
                    <a
                      href={siteConfig.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {siteConfig.phone}
                    </a>
                    <span className="ml-3 border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                      Fastest response
                    </span>
                  </dd>
                </div>
                <div className="py-5">
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted">Email</dt>
                  <dd className="mt-2 text-sm">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="transition-colors hover:text-accent"
                    >
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div className="py-5">
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted">Availability</dt>
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
                        className="inline-block border border-border px-4 py-2 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:border-muted hover:text-text"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
              </ul>

              <div className="mt-8 h-60 overflow-hidden border border-border">
                <iframe
                  src={mapSrc}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Neex Creative Location"
                  className="h-full w-full grayscale-[15%]"
                />
              </div>
            </div>
          </AnimateIn>

          {/* Quote form */}
          <AnimateIn delay={0.1}>
            <div className="border border-border bg-surface p-6 md:p-8">
              <ContactForm />
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
