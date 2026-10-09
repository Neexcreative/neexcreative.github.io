"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { sendPageView } from "@/lib/gtag";

/**
 * Sends one GA4 page_view per App Router navigation (path or query change,
 * including back/forward). No-op until analytics consent; duplicates of the
 * same URL are dropped in sendPageView. Must sit inside <Suspense> so pages
 * stay prerendered (useSearchParams).
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    sendPageView();
  }, [pathname, search]);

  return null;
}
