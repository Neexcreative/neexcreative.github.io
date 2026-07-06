"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Google Ads page-view conversion, carried over from the legacy homepage.
 * gtag.js only processes IArguments entries, so this must push `arguments`,
 * not an array.
 */
export default function ConversionEvent() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      void args;
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    }
    gtag("event", "conversion", { send_to: siteConfig.googleAdsConversion });
  }, []);

  return null;
}
