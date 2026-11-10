import { sfTestimonials } from "@/lib/sf-testimonials";

/**
 * Renders nothing until there is at least one real, authorised testimonial
 * (see src/lib/sf-testimonials.ts). Entries without a release reference are skipped.
 */
export default function Testimonials() {
  const items = sfTestimonials.filter((t) => t.quote.trim() && t.attribution.trim() && t.releaseRef.trim());
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="sf-testimonials-title" className="bg-[#fbf7f2]">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#8e5a52]">From families</p>
        <h2 id="sf-testimonials-title" className="sf-serif mt-4 text-center text-4xl md:text-5xl">
          In their words
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.releaseRef} className="rounded-3xl bg-white p-7 shadow-[0_20px_50px_-35px_rgba(59,42,36,0.5)]">
              <blockquote className="sf-serif text-xl leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 text-sm text-[#6f5a52]">{t.attribution}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
