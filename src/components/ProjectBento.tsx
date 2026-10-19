"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendAnalyticsEvent } from "@/lib/gtag";
import type { CaseStudy, TileSize } from "@/lib/case-studies";

/** Same spans on 2 and 4 columns; the grid packs densely. */
const spans: Record<TileSize, string> = {
  feature: "col-span-2 row-span-2",
  wide: "col-span-2",
  square: "col-span-1",
};

const sizes: Record<TileSize, string> = {
  feature: "(min-width: 1024px) 50vw, 100vw",
  wide: "(min-width: 1024px) 50vw, 100vw",
  square: "(min-width: 1024px) 25vw, 50vw",
};

function Tile({ study, onOpen }: { study: CaseStudy; onOpen: () => void }) {
  const large = study.size === "feature";
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`Open case study: ${study.name}, ${study.category}`}
      className={`group relative overflow-hidden rounded-2xl bg-surface text-left ${spans[study.size]}`}
    >
      <Image
        src={study.image}
        alt=""
        fill
        sizes={sizes[study.size]}
        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] ${
          study.discipline === "Web" ? "object-top" : ""
        }`}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" aria-hidden />

      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm md:left-4 md:top-4">
        {study.discipline}
        {study.comingSoon ? " · Soon" : ""}
      </span>

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 md:p-5">
        <span className="min-w-0">
          <span
            className={`block font-display font-semibold leading-tight tracking-tight text-white ${
              large ? "text-xl md:text-3xl" : "text-sm md:text-lg"
            }`}
          >
            {study.name}
          </span>
          <span
            className={`mt-1 hidden text-xs uppercase tracking-[0.16em] text-white/70 ${
              study.size === "square" ? "" : "sm:block"
            }`}
          >
            {study.category}
            {study.year ? ` · ${study.year}` : ""}
          </span>
        </span>
        <span
          aria-hidden
          className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-transform duration-500 group-hover:rotate-45 sm:flex"
        >
          +
        </span>
      </span>
    </button>
  );
}

function CaseStudyBody({ study, onClose }: { study: CaseStudy; onClose: () => void }) {
  return (
    <>
      <div className="relative aspect-[16/9] w-full shrink-0 bg-surface md:aspect-[21/9]">
        <Image
          src={study.image}
          alt={study.name}
          fill
          sizes="(min-width: 1024px) 960px, 100vw"
          className={`object-cover ${study.discipline === "Web" ? "object-top" : ""}`}
        />
      </div>

      <div className="px-6 py-8 md:px-12 md:py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">
          {study.category}
          {study.year ? ` · ${study.year}` : ""}
        </p>
        <h2 id="case-study-title" className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight md:text-5xl">
          {study.name}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text/90">{study.summary}</p>

        {study.results && study.results.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {study.results.map((result) => (
              <div key={result.label} className="rounded-xl border border-border bg-surface p-5">
                <dt className="text-xs uppercase tracking-[0.16em] text-muted">{result.label}</dt>
                <dd className="mt-2 font-display text-3xl font-bold tracking-tight text-accent">{result.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_16rem]">
          <div className="space-y-8">
            {study.challenge && (
              <section>
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">The challenge</h3>
                <p className="mt-3 leading-relaxed">{study.challenge}</p>
              </section>
            )}
            {study.approach && (
              <section>
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Our approach</h3>
                <p className="mt-3 leading-relaxed">{study.approach}</p>
              </section>
            )}
            {study.testimonial && (
              <figure className="rounded-2xl border border-border bg-surface p-6 md:p-8">
                <blockquote className="font-display text-xl leading-snug tracking-tight md:text-2xl">
                  “{study.testimonial.quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm text-muted">
                  <span className="text-text">{study.testimonial.author}</span>
                  {study.testimonial.role ? `, ${study.testimonial.role}` : ""}
                </figcaption>
              </figure>
            )}
          </div>

          <aside>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Scope</h3>
            <ul className="mt-3 flex flex-wrap gap-2 md:flex-col md:gap-0 md:divide-y md:divide-border">
              {study.scope.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border px-3 py-1 text-sm md:rounded-none md:border-0 md:px-0 md:py-2.5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-85"
          >
            Start a similar project <span aria-hidden>→</span>
          </Link>
          {study.href ? (
            <a
              href={study.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:border-muted hover:text-text"
            >
              {study.hrefLabel ?? "View project"} <span aria-hidden>↗</span>
            </a>
          ) : (
            <span className="inline-flex items-center px-2 py-3 text-xs uppercase tracking-[0.18em] text-muted">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Bento portfolio. Each tile opens its case study in a native modal
 * <dialog> (focus trap, Esc to close, inert page behind it).
 */
export default function ProjectBento({ studies }: { studies: CaseStudy[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<CaseStudy | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
      document.documentElement.style.overflow = "hidden";
    }
  }, [active]);

  function open(study: CaseStudy) {
    setActive(study);
    sendAnalyticsEvent("select_content", { content_type: "case_study", item_id: study.slug });
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <div className="grid auto-rows-[150px] grid-flow-row-dense grid-cols-2 gap-3 sm:auto-rows-[200px] md:gap-4 lg:auto-rows-[240px] lg:grid-cols-4">
        {studies.map((study) => (
          <Tile key={study.slug} study={study} onOpen={() => open(study)} />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="case-study-title"
        onClose={() => {
          document.documentElement.style.overflow = "";
          setActive(null);
        }}
        onClick={(event) => {
          // Click on the backdrop (the dialog box itself, outside the panel) closes it.
          if (event.target === event.currentTarget) close();
        }}
        className="case-study-dialog m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-transparent p-0 text-text backdrop:bg-black/80 backdrop:backdrop-blur-sm md:py-10"
      >
        {active && (
          <div className="relative mx-auto min-h-full max-w-5xl overflow-hidden bg-bg md:min-h-0 md:rounded-2xl md:border md:border-border">
            <button
              type="button"
              onClick={close}
              aria-label="Close case study"
              className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-black/70 text-xl text-white backdrop-blur-sm transition-colors hover:bg-black"
            >
              <span aria-hidden>×</span>
            </button>
            <CaseStudyBody study={active} onClose={close} />
          </div>
        )}
      </dialog>
    </>
  );
}
