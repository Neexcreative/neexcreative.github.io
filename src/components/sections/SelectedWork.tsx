import Image from "next/image";
import AnimateIn from "@/components/AnimateIn";
import { behanceUrl, projects, type Project } from "@/lib/site-config";

function ProjectRow({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-5 border-b border-border py-5 transition-colors hover:border-muted"
    >
      <span className="w-8 shrink-0 text-xs text-muted">{project.number}</span>
      <Image
        src={project.image}
        alt={project.name}
        width={64}
        height={64}
        className="h-14 w-14 shrink-0 object-cover"
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-base font-medium transition-colors group-hover:text-accent">
          {project.name}
        </span>
        <span className="text-xs text-muted">{project.category}</span>
      </span>
      <span className="hidden text-xs text-muted sm:block">{project.year}</span>
      <span className="text-accent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
        ↗
      </span>
    </a>
  );
}

export default function SelectedWork() {
  const firstColumn = projects.slice(0, 4);
  const secondColumn = projects.slice(4);

  return (
    <section id="work" aria-labelledby="work-title" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        <AnimateIn>
          <div className="flex items-baseline justify-between gap-6">
            <h2
              id="work-title"
              className="text-xs font-medium uppercase tracking-[0.22em] text-accent"
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

        <AnimateIn delay={0.1}>
          <div className="mt-10 grid gap-x-16 md:grid-cols-2">
            <div>
              {firstColumn.map((project) => (
                <ProjectRow key={project.number} project={project} />
              ))}
            </div>
            <div>
              {secondColumn.map((project) => (
                <ProjectRow key={project.number} project={project} />
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
