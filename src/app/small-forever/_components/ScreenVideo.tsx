"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Silent screen recording laid over the laptop screen in a product photo.
 * Loads and plays only while on screen and fades in once it is playing, so
 * the photo underneath shows until then. With reduced motion it never plays.
 */
export default function ScreenVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.3 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
