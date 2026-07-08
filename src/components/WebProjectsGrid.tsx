import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";
import { webProjects, type WebProject } from "@/lib/site-config";

function WebCard({ project, index }: { project: WebProject; index: number }) {
  const thumb = (
    <span className="relative block aspect-[16/10] overflow-hidden border border-light-border">
      <Image
        src={project.image}
        alt={`Homepage screenshot of ${project.name}`}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </span>
  );

  return (
    <AnimateIn delay={index * 0.1}>
      <article className="group flex h-full flex-col">
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.name} website`}
          >
            {thumb}
          </a>
        ) : (
          thumb
        )}
        <div className="flex flex-1 flex-col pt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-light-muted">{project.type}</p>
          <h3 className="mt-2 text-lg font-semibold">{project.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-light-muted">
            {project.description}
          </p>
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-light-accent underline-offset-4 hover:underline"
              aria-label={`View ${project.name} project`}
            >
              View Project <span aria-hidden>↗</span>
            </a>
          ) : (
            <p className="mt-4 text-sm text-light-muted">Coming Soon</p>
          )}
        </div>
      </article>
    </AnimateIn>
  );
}

/** The four live web projects — light-palette cards on /web-design. */
export default function WebProjectsGrid() {
  return (
    <div className="grid gap-x-12 gap-y-16 md:grid-cols-2">
      {webProjects.map((project, index) => (
        <WebCard key={project.name} project={project} index={index} />
      ))}
    </div>
  );
}
