import Image from "next/image";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import { webProjects, type WebProject } from "@/lib/site-config";

function WebCard({ project, index }: { project: WebProject; index: number }) {
  const thumb = (
    <span className="relative block aspect-[16/10] overflow-hidden border border-border">
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
          <p className="text-xs uppercase tracking-[0.18em] text-muted">{project.type}</p>
          <h3 className="mt-2 text-lg font-medium">{project.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-accent underline-offset-4 hover:underline"
              aria-label={`View ${project.name} project`}
            >
              View Project <span aria-hidden>↗</span>
            </a>
          ) : (
            <p className="mt-4 text-sm text-muted">Coming Soon</p>
          )}
        </div>
      </article>
    </AnimateIn>
  );
}

export default function WebPortfolio() {
  return (
    <section aria-labelledby="web-portfolio-title" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        <AnimateIn>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Digital Portfolio
          </p>
          <h2 id="web-portfolio-title" className="mt-4 max-w-2xl text-3xl font-medium md:text-4xl">
            Websites &amp; Landing Pages
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Custom websites and landing pages designed to help businesses look
            professional, build trust and convert visitors into real enquiries.
          </p>
        </AnimateIn>

        <div className="mt-14 grid gap-x-12 gap-y-16 md:grid-cols-2">
          {webProjects.map((project, index) => (
            <WebCard key={project.name} project={project} index={index} />
          ))}
        </div>

        <AnimateIn>
          <div className="mt-16">
            <Link
              href="/web-design"
              className="text-sm text-muted transition-colors hover:text-text"
            >
              See all web projects <span aria-hidden>→</span>
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
