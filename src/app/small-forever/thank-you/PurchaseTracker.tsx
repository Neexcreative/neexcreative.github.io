"use client";

import { useEffect } from "react";
import { trackSmallForeverPurchase } from "@/lib/tracking";

/**
 * Sends the purchase event once per order. Rendered only when Stripe reports
 * the session as paid. A reload or a second visit does not count it again.
 */
export default function PurchaseTracker({ orderRef, plan, mode }: { orderRef: string; plan: string; mode: string }) {
  useEffect(() => {
    const key = `sf-purchase-${orderRef}`;
    try {
      if (window.localStorage.getItem(key)) return;
    } catch {
      /* storage blocked: still try to send once in this page view */
    }

    let tries = 0;
    // Analytics loads after the consent banner, so retry briefly.
    const timer = window.setInterval(() => {
      tries += 1;
      const sent = trackSmallForeverPurchase(orderRef, plan, mode);
      if (sent || tries >= 10) window.clearInterval(timer);
      if (sent) {
        try {
          window.localStorage.setItem(key, "1");
        } catch {
          /* ignore */
        }
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [orderRef, plan, mode]);

  return null;
}
