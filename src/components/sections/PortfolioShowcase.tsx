import AnimateIn from "@/components/AnimateIn";
import ProjectBento from "@/components/ProjectBento";
import { caseStudies } from "@/lib/case-studies";
import { behanceUrl } from "@/lib/site-config";

/**
 * All twelve pieces as one bento grid, one system, every discipline.
 * Each tile opens its case study; content lives in lib/case-studies.
 */
export default function PortfolioShowcase() {
  return (
    <section id="work" aria-labelledby="work-title" className="bg-bg text-text">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-12 md:py-24">
        <AnimateIn>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2
                id="work-title"
                className="max-w-3xl text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl"
              >
                Featured Projects
              </h2>
            </div>
            <a
              href={behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-text"
            >
              All Projects on Behance <span aria-hidden>↗</span>
            </a>
          </div>
        </AnimateIn>

        <div className="mt-10 md:mt-14">
          <ProjectBento studies={caseStudies} />
        </div>
      </div>
    </section>
  );
}
