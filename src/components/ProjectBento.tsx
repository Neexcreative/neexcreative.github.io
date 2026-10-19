"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import { sendAnalyticsEvent } from "@/lib/gtag";
import type { CaseStudy, TileSize } from "@/lib/case-studies";

/** Expo-out: fast start, long soft landing. Shared by every motion here. */
const easeOut = [0.16, 1, 0.3, 1] as const;

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

const objectPosition = (study: CaseStudy) => (study.discipline === "Web" ? "object-top" : "");

function Tile({ study, onOpen }: { study: CaseStudy; onOpen: (trigger: HTMLElement) => void }) {
  const large = study.size === "feature";
  return (
    <button
      type="button"
      onClick={(event) => onOpen(event.currentTarget)}
      aria-haspopup="dialog"
      aria-label={`Open case study: ${study.name}, ${study.category}`}
      className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl text-left text-white"
    >
      {/* Media: morphs into the popup hero. */}
      <motion.div layoutId={`media-${study.slug}`} className="absolute inset-0 overflow-hidden rounded-2xl bg-surface">
        <div className="relative h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          <Image src={study.image} alt="" fill sizes={sizes[study.size]} className={`object-cover ${objectPosition(study)}`} />
        </div>
      </motion.div>

      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent via-40% to-black/80"
        aria-hidden
      />

      <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm md:left-4 md:top-4">
        {study.discipline}
        {study.comingSoon ? " · Soon" : ""}
      </span>

      {/* Hover arrow. */}
      <span
        aria-hidden
        className="absolute right-3 top-3 flex size-9 scale-75 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 md:right-4 md:top-4"
      >
        ↗
      </span>

      <span className="absolute inset-x-3 bottom-3 block md:inset-x-5 md:bottom-5">
        <span
          className={`block font-display font-semibold leading-tight tracking-tight ${
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
    </button>
  );
}

/** Scroll lock, Esc to close, focus trap and initial focus on the close button. */
function useModal(panelRef: RefObject<HTMLElement | null>, closeRef: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      window.removeEventListener("keydown", onKey);
    };
  }, [panelRef, closeRef, onClose]);
}

/** Staggered rise-in for the popup's text blocks. */
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.07, ease: easeOut },
  }),
};

function CaseStudyModal({
  study,
  next,
  onClose,
  onNext,
}: {
  study: CaseStudy;
  next: CaseStudy;
  onClose: () => void;
  onNext: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModal(panelRef, closeRef, onClose);

  // Back to the top when jumping to the next project.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [study.slug]);

  const meta = [
    { label: "Client", value: study.client ?? study.name },
    ...(study.year ? [{ label: "Year", value: study.year }] : []),
    { label: "Discipline", value: study.category },
    { label: "Scope", value: study.scope.join(", ") },
  ];

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="case-study-title">
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        className="absolute inset-x-0 bottom-0 top-[3vh] overflow-y-auto overscroll-contain rounded-t-2xl bg-bg text-text md:inset-x-6 md:top-[5vh] lg:inset-x-12"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        {/* Sticky top bar. */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg/85 px-6 py-4 backdrop-blur-md md:px-10">
          <span className="text-xs uppercase tracking-[0.15em] text-muted">
            {study.category}
            {study.year ? ` · ${study.year}` : ""}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="group flex cursor-pointer items-center gap-3 text-xs uppercase tracking-[0.15em]"
          >
            Close
            <span className="relative flex size-9 items-center justify-center rounded-full border border-text transition-colors group-hover:bg-text group-hover:text-bg">
              <span className="absolute h-px w-3.5 rotate-45 bg-current" />
              <span className="absolute h-px w-3.5 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <motion.div key={study.slug} initial="hidden" animate="visible" className="px-6 pb-16 md:px-10">
          {/* Title. */}
          <div className="grid grid-cols-1 items-end gap-6 pb-10 pt-10 md:grid-cols-12 md:pb-14 md:pt-16">
            <motion.h2
              id="case-study-title"
              custom={0}
              variants={item}
              className="text-4xl font-bold leading-[0.95] tracking-tight md:col-span-8 md:text-6xl lg:text-7xl"
            >
              {study.name}
            </motion.h2>
            <motion.p custom={1} variants={item} className="text-lg leading-relaxed text-muted md:col-span-4">
              {study.summary}
            </motion.p>
          </div>

          {/* Hero: morphs from the grid tile. */}
          <motion.div
            layoutId={`media-${study.slug}`}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface md:aspect-[16/8]"
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <Image
              src={study.image}
              alt={study.name}
              fill
              sizes="100vw"
              priority
              className={`object-cover ${objectPosition(study)}`}
            />
          </motion.div>

          {/* Briefing: meta + story. */}
          <div className="mt-12 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-12">
            <motion.dl custom={2} variants={item} className="grid grid-cols-2 gap-6 md:col-span-4 md:grid-cols-1">
              {meta.map((entry) => (
                <div key={entry.label} className="border-t border-border pt-3">
                  <dt className="text-xs uppercase tracking-[0.15em] text-muted">{entry.label}</dt>
                  <dd className="mt-1 text-sm">{entry.value}</dd>
                </div>
              ))}
              <div className="border-t border-border pt-3">
                <dt className="text-xs uppercase tracking-[0.15em] text-muted">Link</dt>
                <dd className="mt-1 text-sm">
                  {study.href ? (
                    <a
                      href={study.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-border underline-offset-4 transition-colors hover:decoration-text"
                    >
                      {study.hrefLabel ?? "View project"} ↗
                    </a>
                  ) : (
                    <span className="text-muted">Coming soon</span>
                  )}
                </dd>
              </div>
            </motion.dl>

            <motion.div custom={3} variants={item} className="space-y-10 md:col-span-7 md:col-start-6">
              {study.challenge && (
                <section>
                  <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted">The brief</h3>
                  <p className="mt-3 text-lg leading-relaxed md:text-xl">{study.challenge}</p>
                </section>
              )}
              {study.approach && (
                <section>
                  <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted">Our approach</h3>
                  <p className="mt-3 text-lg leading-relaxed md:text-xl">{study.approach}</p>
                </section>
              )}
              {!study.challenge && !study.approach && (
                <p className="text-lg leading-relaxed md:text-xl">{study.summary}</p>
              )}

              {study.results && study.results.length > 0 && (
                <dl className="grid grid-cols-2 gap-4">
                  {study.results.map((result) => (
                    <div key={result.label} className="rounded-xl border border-border bg-surface p-5">
                      <dt className="text-xs uppercase tracking-[0.15em] text-muted">{result.label}</dt>
                      <dd className="mt-2 font-display text-3xl font-bold tracking-tight text-accent">{result.value}</dd>
                    </div>
                  ))}
                </dl>
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
            </motion.div>
          </div>

          {/* Mini gallery. */}
          {study.gallery && study.gallery.length > 0 && (
            <div className="mt-16 grid grid-cols-1 gap-4 md:mt-24 md:grid-cols-2 md:gap-6">
              {study.gallery.map((image) => (
                <motion.div
                  key={image.src}
                  className={`relative overflow-hidden rounded-2xl bg-surface ${
                    image.full ? "aspect-[16/9] md:col-span-2" : "aspect-[4/5]"
                  }`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, root: panelRef, margin: "-40px" }}
                  transition={{ duration: 0.9, ease: easeOut }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={image.full ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-16 flex flex-wrap gap-3">
            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-bg transition-opacity hover:opacity-85"
            >
              Start a similar project <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Next project. */}
          <button
            type="button"
            onClick={onNext}
            className="group mt-16 flex w-full cursor-pointer items-end justify-between gap-6 border-t border-border pt-8 text-left md:mt-24"
          >
            <span>
              <span className="mb-3 block text-xs uppercase tracking-[0.15em] text-muted">Next project</span>
              <span className="block font-display text-3xl font-semibold tracking-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:text-5xl">
                {next.name}
              </span>
            </span>
            <span className="text-3xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-5xl">
              →
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Bento portfolio. Each tile's image morphs into the case study hero
 * (shared layoutId), the panel rises in and its text staggers up.
 * Honours the visitor's reduced-motion setting.
 */
export default function ProjectBento({ studies }: { studies: CaseStudy[] }) {
  const [selected, setSelected] = useState<CaseStudy | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((study: CaseStudy, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setSelected(study);
    sendAnalyticsEvent("select_content", { content_type: "case_study", item_id: study.slug });
  }, []);

  const close = useCallback(() => {
    setSelected(null);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const index = selected ? studies.findIndex((study) => study.slug === selected.slug) : -1;
  const next = selected ? studies[(index + 1) % studies.length] : null;

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div className="grid auto-rows-[150px] grid-flow-row-dense grid-cols-2 gap-3 sm:auto-rows-[200px] md:gap-4 lg:auto-rows-[240px] lg:grid-cols-4">
          {studies.map((study, i) => (
            <motion.div
              key={study.slug}
              className={spans[study.size]}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: easeOut }}
            >
              <Tile study={study} onOpen={(trigger) => open(study, trigger)} />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected && next && (
            <CaseStudyModal
              key="case-study"
              study={selected}
              next={next}
              onClose={close}
              onNext={() => {
                setSelected(next);
                sendAnalyticsEvent("select_content", { content_type: "case_study", item_id: next.slug });
              }}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </MotionConfig>
  );
}
