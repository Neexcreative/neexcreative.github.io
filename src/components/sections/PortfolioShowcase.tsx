import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";
import { behanceUrl, projects, webProjects } from "@/lib/site-config";

interface ShowcaseItem {
  name: string;
  meta: string;
  year?: string;
  href: string | null;
  image: string;
  note?: string;
}

/**
 * All twelve pieces — eight Behance projects and four live sites —
 * interleaved for visual rhythm. Content comes verbatim from site-config.
 */
const items: ShowcaseItem[] = [
  toItem(0), // Revival Youth Conference 2026
  toItem(4), // The King
  webItem(0), // RG Mobile Tyre Services
  toItem(1), // Biella Bakery
  toItem(7), // 3D Event Conference Venues
  webItem(1), // Studio AG Dublin
  toItem(2), // Gym+Coffee Bespoke Stand
  toItem(5), // Plaza Car Wash
  webItem(2), // Neex Creative Portfolio
  toItem(6), // The Best Taste
  toItem(3), // Mídia Kit Irlandapontocom
  webItem(3), // VORN
];

function toItem(index: number): ShowcaseItem {
  const project = projects[index];
  return {
    name: project.name,
    meta: project.category,
    year: project.year,
    href: project.href,
    image: project.image,
  };
}

function webItem(index: number): ShowcaseItem {
  const project = webProjects[index];
  return {
    name: project.name,
    meta: project.type,
    href: project.href,
    image: project.image,
    note: project.href ? undefined : "Coming Soon",
  };
}

/* Repeating 7/5 rhythm on a 12-column grid — wide tile, tall tile, swap. */
const spanPattern = [7, 5, 5, 7, 7, 5, 5, 7, 7, 5, 5, 7];

function Tile({ item, index }: { item: ShowcaseItem; index: number }) {
  const wide = spanPattern[index] === 7;

  const inner = (
    <>
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes={wide ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      {/* Reveal overlay — always readable on touch, hover/focus on desktop. */}
      <span
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-6 opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:group-focus:opacity-100"
      >
        <span className="flex items-end justify-between gap-4">
          <span className="min-w-0">
            <span className="block truncate text-lg font-semibold tracking-tight text-white">
              {item.name}
            </span>
            <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-white/70">
              {item.meta}
              {item.note ? ` · ${item.note}` : ""}
            </span>
          </span>
          <span className="shrink-0 text-xs text-white/70">
            {item.year ?? (item.href ? <span aria-hidden className="text-lg text-white">↗</span> : null)}
          </span>
        </span>
      </span>
    </>
  );

  // Static class strings — Tailwind cannot generate interpolated names.
  const tileClasses = `group relative block overflow-hidden bg-surface ${
    wide ? "md:col-span-7 aspect-[16/10]" : "md:col-span-5 aspect-[4/3]"
  }`;

  return item.href ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${item.name} — ${item.meta}`}
      className={tileClasses}
    >
      {inner}
    </a>
  ) : (
    <div className={tileClasses} aria-label={`${item.name} — coming soon`}>
      {inner}
    </div>
  );
}

export default function PortfolioShowcase() {
  return (
    <section id="work" aria-labelledby="work-title" className="bg-bg text-text">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32 lg:py-40">
        <AnimateIn>
          <div className="flex items-baseline justify-between gap-6">
            <h2
              id="work-title"
              className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-accent"
            >
              Selected Work
            </h2>
            <a
              href={behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-text"
            >
              All Projects <span aria-hidden>→</span>
            </a>
          </div>
        </AnimateIn>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {items.map((item, index) => (
            <Tile key={item.name} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
