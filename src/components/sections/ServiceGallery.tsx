import Image from "next/image";
import { imageAspect } from "@/lib/image-aspect";
import { serviceGalleries, type GalleryProject } from "@/lib/service-gallery";

/**
 * Justified gallery: tiles in a row share one height and take widths in
 * proportion to their images, so every cover shows whole, uncropped. Each
 * image's ratio is read from the file at build time, so swapping an image
 * re-flows the layout with no code change. On mobile tiles stack, full width.
 */

async function aspectOf(src: string): Promise<number> {
  try {
    return (await imageAspect(src)) ?? 1.5;
  } catch {
    return 1.5;
  }
}

/** Three sit on one row; otherwise pairs, so each tile stays large. */
function toRows<T>(items: T[]): T[][] {
  if (items.length === 3) return [items];
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

export default async function ServiceGallery({ slug }: { slug: string }) {
  const gallery = serviceGalleries[slug];
  if (!gallery?.projects.length) return null;

  const tiles = await Promise.all(
    gallery.projects.map(async (project) => ({ project, aspect: await aspectOf(project.image) })),
  );
  // A lone tile on its own row would be huge, so it gets a wide crop.
  const rows = toRows(tiles).map((row) =>
    row.length === 1 ? [{ ...row[0], aspect: Math.max(row[0].aspect, 2.4) }] : row,
  );

  return (
    <section id="service-work" aria-labelledby="service-work-title" className="scroll-mt-24 bg-bg py-8 md:py-12">
      <h2 id="service-work-title" className="sr-only">{gallery.title}</h2>
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 md:px-12">
        {rows.map((row) => (
          <div key={row[0].project.name} className="flex flex-col gap-1 md:flex-row">
            {row.map(({ project, aspect }) => (
              <Tile key={project.name} project={project} aspect={aspect} share={aspect / row.reduce((sum, t) => sum + t.aspect, 0)} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Tile({ project, aspect, share }: { project: GalleryProject; aspect: number; share: number }) {
  const layout =
    "group relative block min-w-0 overflow-hidden bg-surface [aspect-ratio:var(--a)] md:[flex:var(--a)_1_0%]";
  const style = { "--a": aspect } as React.CSSProperties;
  const content = (
    <>
      <Image
        src={project.image}
        alt={project.name + ", " + project.category}
        fill
        sizes={`(min-width: 1280px) ${Math.round(1180 * share)}px, (min-width: 768px) ${Math.round(share * 100)}vw, 100vw`}
        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
      />
      <span
        className="absolute inset-x-0 bottom-0 flex flex-col bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-white transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
        aria-hidden
      >
        <span className="text-sm font-semibold">{project.name}</span>
        <span className="text-xs text-white/75">{project.category}</span>
      </span>
    </>
  );

  return project.href ? (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={"View " + project.name + " (opens in a new tab)"}
      style={style}
      className={layout + " focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"}
    >
      {content}
    </a>
  ) : (
    <div style={style} className={layout}>
      {content}
    </div>
  );
}
