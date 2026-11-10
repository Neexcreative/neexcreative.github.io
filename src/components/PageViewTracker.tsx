"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { sendPageView } from "@/lib/gtag";

/** Longest wait for the new page's <title> before sending anyway. */
const TITLE_WAIT_MS = 1000;

/**
 * Sends one GA4 page_view per App Router navigation (path or query change,
 * including back/forward). No-op until analytics consent; duplicates of the
 * same URL are dropped in sendPageView. Must sit inside <Suspense> so pages
 * stay prerendered (useSearchParams).
 *
 * Since Next.js 16.4 the <title> is briefly empty right after a client-side
 * navigation (measured ~40 ms) before the new page's title is streamed in, so
 * a page_view sent immediately went out with no title. We wait until the
 * title is set and differs from the previous page's, for at most TITLE_WAIT_MS.
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const lastTitle = useRef<string | null>(null);

  useEffect(() => {
    const previous = lastTitle.current;
    const ready = () => document.title !== "" && document.title !== previous;

    // First load, or the new title is already in place.
    if (previous === null || ready()) {
      lastTitle.current = document.title;
      sendPageView();
      return;
    }

    let done = false;
    const send = () => {
      if (done) return;
      done = true;
      observer.disconnect();
      window.clearTimeout(timer);
      lastTitle.current = document.title;
      sendPageView();
    };
    const observer = new MutationObserver(() => {
      if (ready()) send();
    });
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    const timer = window.setTimeout(send, TITLE_WAIT_MS);

    return () => {
      // A newer navigation replaces this one: don't send a page view for it.
      done = true;
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname, search]);

  return null;
}
