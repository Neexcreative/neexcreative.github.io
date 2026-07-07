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

interface ShowcaseGroup {
  label: string;
  items: ShowcaseItem[];
}

function fromProject(index: number): ShowcaseItem {
  const project = projects[index];
  return {
    name: project.name,
    meta: project.category,
    year: project.year,
    href: project.href,
    image: project.image,
  };
}

function fromWeb(index: number): ShowcaseItem {
  const project = webProjects[index];
  return {
    name: project.name,
    meta: project.type,
    href: project.href,
    image: project.image,
    note: project.href ? undefined : "Coming Soon",
  };
}

/**
 * All twelve pieces grouped by discipline — one system, every discipline.
 * Content comes verbatim from site-config.
 */
const groups: ShowcaseGroup[] = [
  {
    label: "Branding",
    items: [fromProject(0), fromProject(1), fromProject(5), fromProject(6)],
  },
  {
    label: "Web",
    items: [fromWeb(0), fromWeb(1), fromWeb(2), fromWeb(3)],
  },
  {
    label: "Video & 3D",
    items: [fromProject(4), fromProject(2), fromProject(7)],
  },
  {
    label: "Print & Editorial",
    items: [fromProject(3)],
  },
];

function Tile({ item }: { item: ShowcaseItem }) {
  const inner = (
    <>
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      {/* Reveal overlay — always readable on touch, hover/focus on desktop. */}
      <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-5 opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:group-focus:opacity-100">
        <span className="flex items-end justify-between gap-4">
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-tight text-white">
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

  const tileClasses = "group relative block aspect-[3/2] overflow-hidden bg-surface";

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
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-12 md:py-40 lg:py-48">
        <AnimateIn>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-accent">
                Selected Work
              </p>
              <h2
                id="work-title"
                className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
              >
                One system.
                <br />
                Every discipline.
              </h2>
            </div>
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

        <div className="mt-20 flex flex-col gap-20 md:mt-28 md:gap-28">
          {groups.map((group) => (
            <AnimateIn key={group.label}>
              <div>
                <h3 className="flex items-center gap-5 font-sans text-xs font-medium uppercase tracking-[0.22em] text-muted">
                  {group.label}
                  <span className="h-px flex-1 bg-border" aria-hidden />
                </h3>
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <Tile key={item.name} item={item} />
                  ))}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
