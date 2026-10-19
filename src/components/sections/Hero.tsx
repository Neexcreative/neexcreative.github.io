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
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        quality={50}
        className="object-cover opacity-25"
      />
      {/* Darkening gradient keeps AA contrast over the background art. */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/85 to-bg" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-10 sm:py-20 md:px-12 md:py-28">
        {/* Not animated: the H1 is the LCP element, fading it in from
            opacity 0 pushes LCP past the performance budget. */}
        <div>
          <h1 className="max-w-4xl text-[2.35rem] sm:mt-6 sm:text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Websites, branding &amp; video {" "}
            <span className="text-accent">one system</span>, built by a creative
            agency in Dublin.
          </h1>
        </div>

        <AnimateIn delay={0.1}>
          <div className="mt-6 flex flex-col gap-6 sm:mt-10 sm:gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-[15px] leading-relaxed text-muted sm:text-base">
              A creative studio crafting websites, visual identities, video
              production and 3D design work that helps businesses grow from
              the first impression to the conversion.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap bg-accent px-4 py-3.5 text-xs font-medium uppercase tracking-[0.14em] sm:flex-none sm:px-6 sm:py-3 sm:tracking-[0.18em] text-bg transition-opacity hover:opacity-85"
              >
                Get a Quote <span aria-hidden>→</span>
              </Link>
              <Link
                href="/#work"
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap border border-border px-4 py-3.5 text-xs font-medium uppercase tracking-[0.14em] sm:flex-none sm:px-6 sm:py-3 sm:tracking-[0.18em] text-muted transition-colors hover:border-muted hover:text-text"
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
