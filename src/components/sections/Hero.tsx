import Image from "next/image";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <Image
        src="/images/hero-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-25"
      />
      {/* Darkening gradient keeps AA contrast over the background art. */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/85 to-bg" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32 lg:py-40">
        <AnimateIn>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Creative Agency · Dublin, Ireland
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.08] sm:text-5xl md:text-7xl">
            Websites, branding &amp; video —{" "}
            <span className="text-accent">one system</span>, built by a creative
            agency in Dublin.
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-base leading-relaxed text-muted">
              A creative studio crafting websites, visual identities, video
              production and 3D design work that helps businesses grow — from
              the first impression to the conversion.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-text transition-opacity hover:opacity-85"
              >
                Get a Quote <span aria-hidden>→</span>
              </Link>
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:border-muted hover:text-text"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
