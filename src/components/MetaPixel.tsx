"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { getConsent, getServerConsent, subscribeConsent, type ConsentSnapshot } from "@/lib/consent";
import { metaPixelId } from "@/lib/meta-pixel";

/**
 * Loads the Meta Pixel only after Advertising consent, and only if an ID is
 * configured. Automatic configuration (which scans buttons and page
 * metadata) is switched off: only the events we send explicitly are sent.
 * Withdrawing consent reloads the page (see saveConsent), so the Pixel is gone.
 */
export default function MetaPixel() {
  const consent = useSyncExternalStore<ConsentSnapshot>(subscribeConsent, getConsent, getServerConsent);
  if (!metaPixelId || !consent?.ads) return null;

  // The ID is validated as digits only before it is placed in the inline script.
  if (!/^\d{5,20}$/.test(metaPixelId)) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('set','autoConfig',false,'${metaPixelId}');
fbq('init','${metaPixelId}');
fbq('track','PageView');`}
    </Script>
  );
}
