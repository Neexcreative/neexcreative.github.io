"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

/**
 * Generic "storage full" notification (not a real OS interface) that plays
 * the band's story once it scrolls into view: the space runs out, the phone
 * complains, then the videos go to Small Forever and the space comes back.
 * With reduced motion it stays still on the "full" state.
 */

type Phase = "filling" | "full" | "saved";

const ease = [0.16, 1, 0.3, 1] as const;

function formatSpace(mb: number) {
  return mb >= 1000 ? `${(mb / 1000).toFixed(1)} GB available` : `${Math.round(mb)} MB available`;
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5V12l6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StorageNotice({ className }: { className: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [phase, setPhase] = useState<Phase>("filling");

  const mb = useMotionValue(2400);
  const pct = useMotionValue(72);
  const space = useTransform(mb, formatSpace);
  const width = useTransform(pct, (v) => `${v}%`);

  useEffect(() => {
    if (!inView || reduce) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      await wait(500);
      await Promise.all([
        animate(mb, 0, { duration: 2.4, ease: "easeIn" }),
        animate(pct, 98, { duration: 2.4, ease: "easeIn" }),
      ]);
      if (cancelled) return;
      setPhase("full");
      await wait(1800);
      if (cancelled) return;
      setPhase("saved");
      await Promise.all([
        animate(mb, 18400, { duration: 1.6, ease }),
        animate(pct, 34, { duration: 1.6, ease }),
      ]);
    })();

    return () => {
      cancelled = true;
      mb.stop();
      pct.stop();
    };
  }, [inView, reduce, mb, pct]);

  if (reduce) {
    return (
      <div className={className} aria-hidden>
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#7a2e2a] text-white">
            <ClockIcon />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight text-[#3b2a24]">Storage almost full</p>
            <p className="text-[12px] leading-tight text-[#6f5a52]">0 MB available</p>
          </div>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#f2dfd6]">
          <span className="block h-full w-[98%] rounded-full bg-[#7a2e2a]" />
        </div>
      </div>
    );
  }

  const saved = phase === "saved";

  return (
    <motion.div
      ref={ref}
      className={className}
      aria-hidden
      initial={{ opacity: 0, y: -14, scale: 0.96 }}
      animate={
        inView
          ? phase === "full"
            ? { opacity: 1, y: 0, scale: 1, x: [0, -6, 6, -4, 4, -2, 0] }
            : { opacity: 1, y: 0, scale: 1, x: 0 }
          : undefined
      }
      transition={{ duration: phase === "full" ? 0.5 : 0.6, ease }}
    >
      <div className="flex items-center gap-2.5">
        <motion.span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
          animate={{
            backgroundColor: saved ? "#3b2a24" : "#7a2e2a",
            scale: phase === "full" ? [1, 1.14, 1, 1.14, 1] : 1,
          }}
          transition={{ duration: phase === "full" ? 1.2 : 0.4 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={saved ? "check" : "clock"}
              initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              {saved ? <CheckIcon /> : <ClockIcon />}
            </motion.span>
          </AnimatePresence>
        </motion.span>
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={phase}
              className="text-[13px] font-semibold leading-tight text-[#3b2a24]"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {saved ? "Sent to Small Forever" : phase === "full" ? "Storage full" : "Storage almost full"}
            </motion.p>
          </AnimatePresence>
          <motion.p className="text-[12px] tabular-nums leading-tight text-[#6f5a52]">{space}</motion.p>
        </div>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#f2dfd6]">
        <motion.span
          className="block h-full rounded-full"
          style={{ width }}
          animate={{ backgroundColor: saved ? "#3b2a24" : "#7a2e2a" }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}
