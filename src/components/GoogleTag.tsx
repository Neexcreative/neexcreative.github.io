"use client";

import { Suspense, useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import PageViewTracker from "@/components/PageViewTracker";
import { getConsent, getServerConsent, subscribeConsent, type ConsentSnapshot } from "@/lib/consent";
import { configureGoogleTag } from "@/lib/gtag";
import { siteConfig } from "@/lib/site-config";
import { installContactClickTracking } from "@/lib/tracking";

/**
 * The site's only gtag.js loader, shared by GA4 and Google Ads.
 * Renders nothing until the visitor consents to at least one of them.
 */
export default function GoogleTag() {
  const consent = useSyncExternalStore<ConsentSnapshot>(subscribeConsent, getConsent, getServerConsent);
  const granted = !!consent && (consent.analytics || consent.ads);

  useEffect(() => {
    if (consent && granted) configureGoogleTag(consent);
  }, [consent, granted]);

  // Listener only: events are dropped unless the matching consent was given.
  useEffect(() => installContactClickTracking(), []);

  if (!consent || !granted) return null;

  const primaryId = consent.analytics ? siteConfig.googleAnalyticsId : siteConfig.googleAdsId;
  return (
    <>
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      {consent.analytics && (
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
      )}
    </>
  );
}
