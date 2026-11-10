"use client";

import { useEffect } from "react";
import { trackSmallForeverPlansView } from "@/lib/tracking";

/**
 * Sends "plans viewed" once, when the plans section scrolls into view.
 * Nothing is sent without consent (the helpers no-op), so it keeps watching
 * until an event actually goes out, e.g. after a later Accept.
 */
export default function PlansViewTracker({ targetId }: { targetId: string }) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) trackSmallForeverPlansView();
      },
      { threshold: 0.25 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);
  return null;
}
