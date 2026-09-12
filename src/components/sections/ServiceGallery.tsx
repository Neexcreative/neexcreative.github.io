import Image from "next/image";
import { serviceGalleries } from "@/lib/service-gallery";

export default function ServiceGallery({ slug }: { slug: string }) {
  const gallery = serviceGalleries[slug];
  if (!gallery?.projects.length) return null;

  const count = gallery.projects.length;
  return (
    <section id="service-work" aria-labelledby="service-work-title" className="scroll-mt-24 bg-bg py-8 md:py-12">
      <h2 id="service-work-title" className="sr-only">{gallery.title}</h2>
      <div className="mx-auto grid max-w-7xl grid-flow-dense grid-cols-2 auto-rows-[140px] gap-1 px-4 sm:auto-rows-[200px] md:grid-cols-6 md:auto-rows-[220px] md:px-12">
        {gallery.projects.map((project, index) => {
          const tall = count > 2 && (index === 0 || (count % 2 === 0 && index === count - 2));
          const layout = "relative block min-w-0 overflow-hidden bg-surface md:col-span-3 " +
            (tall ? "row-span-2" : "row-span-1") +
            (count === 2 ? " md:row-span-2" : "");
          const image = (
            <Image
              src={project.image}
              alt={project.name + ", " + project.category}
              fill
              sizes="(min-width: 1280px) 590px, 50vw"
              className="object-cover"
            />
          );
          return project.href ? (
            <a key={project.name} href={project.href} target="_blank" rel="noopener noreferrer"
              aria-label={"View " + project.name + " (opens in a new tab)"}
              className={layout + " focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"}>
              {image}
            </a>
          ) : <div key={project.name} className={layout}>{image}</div>;
        })}
      </div>
    </section>
  );
}
