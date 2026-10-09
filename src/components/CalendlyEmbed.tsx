"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { trackCalendlyBooking } from "@/lib/tracking";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: {
        url: string;
        parentElement: HTMLElement;
        inlineStyles?: boolean;
        resize?: boolean;
      }): void;
    };
  }
}

const CALENDLY_ORIGIN = "https://calendly.com";

/**
 * Calendly inline widget. Render only behind ExternalContentGate.
 *
 * widget.js auto-initialises `.calendly-inline-widget` elements only when it
 * first loads, so this initialises explicitly (same options as auto-init:
 * inline styles + resize) on every mount, including client-side returns.
 */
export default function CalendlyEmbed({ url, className }: { url: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // A completed booking is the only Calendly signal treated as a lead.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== CALENDLY_ORIGIN || event.data?.event !== "calendly.event_scheduled") return;
      const uri = event.data?.payload?.event?.uri;
      trackCalendlyBooking(typeof uri === "string" ? uri : `no-uri-${Math.floor(Date.now() / 10_000)}`);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function initialise() {
    const container = containerRef.current;
    if (!container || container.dataset.processed || !window.Calendly) return;
    container.dataset.processed = "true";
    window.Calendly.initInlineWidget({ url, parentElement: container, inlineStyles: true, resize: true });
  }

  return (
    <>
      <div
        ref={containerRef}
        role="region"
        aria-label="Calendly booking calendar"
        data-auto-load="false"
        className={className}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onReady={initialise}
      />
    </>
  );
}
