"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { sendAnalyticsEvent } from "@/lib/gtag";
import { useModal } from "@/lib/use-modal";
import { playableReels, type PlayableReel } from "@/lib/video-reels";

/**
 * Edge-to-edge row of vertical films. Cards are local posters; a film's
 * YouTube player (privacy-enhanced domain) only loads after the visitor
 * clicks it, the same click-to-load rule as the other embeds on the site.
 */
export default function VideoReels({ slug }: { slug: string }) {
  const reels = playableReels(slug);
  const rowRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<PlayableReel | null>(null);
  const close = useCallback(() => setPlaying(null), [setPlaying]);

  if (!reels.length) return null;

  const scrollBy = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (row) row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="service-work" aria-labelledby="video-reels-title" className="scroll-mt-24 bg-bg pb-16 pt-4 text-text md:pb-24 md:pt-8">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 sm:px-6 md:px-12">
        <h2 id="video-reels-title" className="text-3xl font-bold leading-[1.05] tracking-tight md:text-4xl">
          Films &amp; reels
        </h2>
        <div className="hidden gap-2 md:flex">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scrollBy(direction)}
              aria-label={direction === -1 ? "Previous films" : "Next films"}
              className="flex size-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-muted hover:text-text"
            >
              <span aria-hidden>{direction === -1 ? "←" : "→"}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={rowRef}
        className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 md:mt-10 md:gap-4 md:scroll-px-12 md:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {reels.map((reel) => {
          const card = (
            <>
              <Image
                src={reel.poster}
                alt=""
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 260px, 64vw"
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden />
              <span
                className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="ml-0.5 size-4" fill="currentColor">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </span>
              <span className="absolute inset-x-4 bottom-4 text-left text-white">
                <span className="block font-display text-[2.1rem] font-extrabold uppercase leading-[0.9] tracking-tight md:text-[2.5rem]">
                  {reel.title}
                </span>
                <span className="mt-2 block text-sm text-white/80">{reel.subtitle}</span>
              </span>
            </>
          );
          const layout =
            "group relative aspect-[9/16] w-[64vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl bg-surface sm:w-[260px] lg:w-[300px]";
          return (
            <button
              key={reel.title}
              type="button"
              aria-label={`Play ${reel.title}, ${reel.subtitle}`}
              onClick={() => {
                setPlaying(reel);
                sendAnalyticsEvent("select_content", { content_type: "video", item_id: reel.youtubeId });
              }}
              className={`${layout} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
            >
              {card}
            </button>
          );
        })}
      </div>

      <p className="mx-auto mt-6 max-w-7xl px-4 text-xs text-muted sm:px-6 md:px-12">
        Films play from YouTube when you press play.
      </p>

      {playing && <ReelPlayer reel={playing} onClose={close} />}
    </section>
  );
}

function ReelPlayer({ reel, onClose }: { reel: PlayableReel; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModal(panelRef, closeRef, onClose);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${reel.title}, ${reel.subtitle}`}
        className="relative aspect-[9/16] h-[min(86dvh,calc((100vw-2rem)*16/9))] overflow-hidden rounded-2xl bg-black"
        onClick={(event) => event.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${reel.youtubeId}?autoplay=1&playsinline=1&rel=0`}
          title={`${reel.title}, ${reel.subtitle}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-black"
        >
          Close
        </button>
      </div>
    </div>
  );
}
