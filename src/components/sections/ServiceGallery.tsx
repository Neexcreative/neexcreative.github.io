import Image from "next/image";
import Link from "next/link";
import { serviceGalleries, type GalleryProject } from "@/lib/service-gallery";

function ProjectCard({ project, featured }: { project: GalleryProject; featured: boolean }) {
  const content = <>
    <div className={"relative overflow-hidden bg-surface " + (featured ? "aspect-[16/10] md:aspect-[2/1]" : "aspect-[16/10]")}>
      <Image src={project.image} alt={project.name + ", " + project.category} fill
        sizes={featured ? "(min-width: 1280px) 1184px, 100vw" : "(min-width: 1280px) 576px, (min-width: 768px) 50vw, 100vw"}
        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />
      <span className="absolute left-4 top-4 bg-bg/90 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-text md:left-6 md:top-6">
        {project.href ? project.category : "Coming soon"}
      </span>
    </div>
    <div className="flex items-start justify-between gap-5 border-b border-border pb-6 pt-5">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{project.category}{project.year ? " / " + project.year : ""}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-accent md:text-2xl">{project.name}</h3>
        {project.description && <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{project.description}</p>}
        <p className="mt-4 text-xs text-muted">{project.href ? "Explore project" : "In development"}</p>
      </div>
      {project.href && <span aria-hidden className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-lg transition-colors group-hover:border-accent group-hover:text-accent">↗</span>}
    </div>
  </>;
  return <article className={featured ? "md:col-span-2" : ""}>
    {project.href ? <a href={project.href} target="_blank" rel="noopener noreferrer" className="group block" aria-label={"Explore " + project.name + " (opens in a new tab)"}>{content}</a> : <div>{content}</div>}
  </article>;
}

export default function ServiceGallery({ slug }: { slug: string }) {
  const gallery = serviceGalleries[slug];
  if (!gallery?.projects.length) return null;
  return <section id="service-work" aria-labelledby="service-work-title" className="scroll-mt-24 border-y border-border bg-bg text-text">
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Selected work</p>
        <span className="text-xs tabular-nums text-muted">{String(gallery.projects.length).padStart(2, "0")} projects</span>
      </div>
      <div className="mb-10 mt-8 grid gap-6 md:mb-14 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
        <h2 id="service-work-title" className="max-w-2xl text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl">{gallery.title}</h2>
        <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">{gallery.description}</p>
      </div>
      <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 md:gap-y-14">
        {gallery.projects.map((project, index) => <ProjectCard key={project.name} project={project} featured={gallery.projects.length % 2 !== 0 && index === 0} />)}
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 md:mt-16">
        <Link href="/work" className="text-sm text-muted transition-colors hover:text-text">Explore the full portfolio <span aria-hidden>→</span></Link>
        <Link href="/contact" className="inline-flex items-center gap-3 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-bg hover:opacity-85">Start your project <span aria-hidden>↗</span></Link>
      </div>
    </div>
  </section>;
}
