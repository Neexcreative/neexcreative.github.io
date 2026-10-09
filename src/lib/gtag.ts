import type { ConsentChoice } from "@/lib/consent";
import { siteConfig } from "@/lib/site-config";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Queues a command for the single Google tag (gtag.js) shared by GA4 and
 * Google Ads. gtag.js only processes IArguments entries, so this must push
 * `arguments`, not an array.
 */
export function gtag(...args: unknown[]) {
  void args;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

const configured = new Set<string>();
let initialised = false;

const state = (granted: boolean) => (granted ? "granted" : "denied");

let lastPageView: string | null = null;

/**
 * GA4 page views are dispatched explicitly, once per distinct URL (path +
 * query; hash-only changes are not page views): on the initial load, on
 * every App Router navigation including back/forward (PageViewTracker), and
 * when analytics consent is first given.
 *
 * GA4's automatic "page changes based on browser history events" drops the
 * page view when another history change follows within ~1 s (e.g. clicking
 * an in-page anchor right after navigating), so it is not relied on.
 * REQUIRED in GA4 Admin > Data streams > Enhanced measurement > Page views:
 * turn OFF "Page changes based on browser history events", otherwise every
 * navigation is counted twice. Verified by scripts/analytics-consent-test.mjs.
 */
export function sendPageView() {
  if (!configured.has(siteConfig.googleAnalyticsId)) return;
  const location = `${window.location.origin}${window.location.pathname}${window.location.search}`;
  if (location === lastPageView) return;
  gtag("event", "page_view", {
    send_to: siteConfig.googleAnalyticsId,
    page_location: location,
    page_referrer: lastPageView ?? document.referrer,
    page_title: document.title,
  });
  lastPageView = location;
}

/**
 * Applies the visitor's consent and configures only the destinations they
 * accepted. Safe to call repeatedly: each destination is configured once.
 */
export function configureGoogleTag(consent: ConsentChoice) {
  const consentState = {
    analytics_storage: state(consent.analytics),
    ad_storage: state(consent.ads),
    ad_user_data: state(consent.ads),
    ad_personalization: state(consent.ads),
  };

  if (!initialised) {
    gtag("consent", "default", consentState);
    gtag("js", new Date());
    initialised = true;
  } else {
    gtag("consent", "update", consentState);
  }

  if (consent.analytics && !configured.has(siteConfig.googleAnalyticsId)) {
    // Page views are sent explicitly (see sendPageView), never by config.
    gtag("config", siteConfig.googleAnalyticsId, { send_page_view: false });
    configured.add(siteConfig.googleAnalyticsId);
    sendPageView();
  }

  if (consent.ads && !configured.has(siteConfig.googleAdsId)) {
    gtag("config", siteConfig.googleAdsId);
    configured.add(siteConfig.googleAdsId);
  }
}

type EventParams = Record<string, string | number>;

/** GA4 event, sent only after analytics consent and addressed to GA4 alone. */
export function sendAnalyticsEvent(name: string, params: EventParams = {}) {
  if (!configured.has(siteConfig.googleAnalyticsId)) return false;
  gtag("event", name, { ...params, send_to: siteConfig.googleAnalyticsId });
  return true;
}

/** Google Ads conversion, sent only after advertising consent and when an action is mapped. */
export function sendAdsConversion(sendTo: string | null, transactionId: string) {
  if (!sendTo || !configured.has(siteConfig.googleAdsId)) return false;
  gtag("event", "conversion", { send_to: sendTo, transaction_id: transactionId });
  return true;
}
