import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-24 md:px-12 md:py-32 lg:py-40">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
        Creative Agency Dublin
      </p>
      <h1 className="max-w-3xl text-4xl font-medium leading-tight md:text-6xl">
        {siteConfig.tagline}
      </h1>
      <p className="max-w-xl text-base leading-relaxed text-muted">
        The new Neex Creative experience is being built. Full homepage lands in Etapa 2.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-text transition-opacity hover:opacity-85"
      >
        Get a Quote <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
