import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import { aboutContacts, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Marlon Franca is a multidisciplinary designer based in Dublin — brand identity, motion, video, and 3D design.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Neex Creative",
    description:
      "Marlon Franca is a multidisciplinary designer based in Dublin — brand identity, motion, video, and 3D design.",
    url: "/about",
  },
};

const tags = ["Graphic Design", "Motion", "Video", "3D", "Brand Systems"];

export default function AboutPage() {
  return (
    <>
      {/* Dark hero, consistent with the homepage opening. */}
      <section className="bg-bg text-text">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
          {/* Not animated: the H1 is the page's LCP element. */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              About Marlon
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Meet the <span className="text-muted">Designer.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Light institutional body. */}
      <section aria-label="Biography" className="bg-light-bg text-light-text">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-12 md:py-24">
          {/* Not animated: on mobile this copy is the LCP element. */}
          <div>
            <div className="flex flex-col items-start gap-6">
              <p className="max-w-xl text-base leading-relaxed text-light-muted">
                I&apos;m Marlon, a multidisciplinary designer focused on building
                strong visual identities and high-impact content systems for
                brands. My work blends graphic design, motion, video production,
                and 3D to create consistent experiences across digital and live
                environments.
              </p>
              <p className="max-w-xl text-base leading-relaxed text-light-muted">
                I&apos;ve delivered creative for events, conferences, and
                businesses from brand systems and campaigns to video
                storytelling and 3D visuals. I care about clarity, pacing, and
                craft: design that looks premium and communicates with purpose.
              </p>

              <ul className="mt-2 flex flex-wrap gap-2" aria-label="Disciplines">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-light-border bg-light-surface px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-light-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-light-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
                >
                  Resume <span aria-hidden>→</span>
                </a>
                <Link
                  href="/#work"
                  className="inline-flex items-center gap-2 border border-light-border px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-light-muted transition-colors hover:border-light-muted hover:text-light-text"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>

          <AnimateIn delay={0.1}>
            <div>
              <Image
                src="/images/marlon.png"
                alt="Marlon Franca — Designer"
                width={640}
                height={800}
                sizes="(min-width: 768px) 40vw, 100vw"
                className="w-full border border-light-border object-cover"
              />

              <dl className="mt-8 divide-y divide-light-border border-y border-light-border">
                {aboutContacts.map((contact) => (
                  <div
                    key={contact.label}
                    className="flex items-baseline justify-between gap-6 py-4"
                  >
                    <dt className="text-xs uppercase tracking-[0.18em] text-light-muted">
                      {contact.label}
                    </dt>
                    <dd className="min-w-0">
                      <a
                        href={contact.href}
                        target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={contact.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        className="block truncate text-sm transition-colors hover:text-light-accent"
                      >
                        {contact.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
