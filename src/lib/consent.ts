/**
 * Cookie consent store (client-side only; call from effects or event handlers).
 *
 * Nothing non-essential runs until the visitor opts in. The choice itself is
 * kept in localStorage, which is strictly necessary to honour it. Consent is
 * re-requested after six months or when CONSENT_VERSION changes.
 */

import { gtag } from "@/lib/gtag";

export interface ConsentChoice {
  /** Google Analytics 4. */
  analytics: boolean;
  /** Google Ads conversion measurement and ad personalisation. */
  ads: boolean;
  /** External content: Google Maps (/contact) and Calendly (/book) embeds. */
  embeds: boolean;
}

/** undefined = not known yet (server render / before hydration); null = no choice made. */
export type ConsentSnapshot = ConsentChoice | null | undefined;

const STORAGE_KEY = "neex-consent";
const CONSENT_VERSION = 1;
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182;
const OPEN_SETTINGS_EVENT = "neex:open-cookie-settings";

let cache: ConsentChoice | null | undefined;
const listeners = new Set<() => void>();

function readStoredConsent(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    if (
      stored?.version !== CONSENT_VERSION ||
      typeof stored.analytics !== "boolean" ||
      typeof stored.ads !== "boolean" ||
      !(Date.now() - Date.parse(stored.updatedAt) < MAX_AGE_MS)
    ) {
      return null;
    }
    // Choices saved before the External content category existed never allowed it.
    return { analytics: stored.analytics, ads: stored.ads, embeds: stored.embeds === true };
  } catch {
    return null;
  }
}

const ANALYTICS_COOKIES = /^(_ga|_gid|_gat)/;
const ADS_COOKIES = /^(_gcl_|_gac_)/;

/** Removes first-party Google cookies matching `pattern` after consent is withdrawn. */
function clearGoogleCookies(pattern: RegExp) {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => pattern.test(name));
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function getConsent(): ConsentChoice | null {
  if (cache === undefined) cache = readStoredConsent();
  return cache;
}

export function getServerConsent(): ConsentSnapshot {
  return undefined;
}

export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function saveConsent(choice: ConsentChoice) {
  const previous = getConsent();
  const analyticsWithdrawn = !!previous && previous.analytics && !choice.analytics;
  const adsWithdrawn = !!previous && previous.ads && !choice.ads;
  const trackingWithdrawn = analyticsWithdrawn || adsWithdrawn;
  const withdrawn = trackingWithdrawn || (!!previous && previous.embeds && !choice.embeds);

  cache = { analytics: choice.analytics, ads: choice.ads, embeds: choice.embeds };
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...cache, version: CONSENT_VERSION, updatedAt: new Date().toISOString() }),
    );
  } catch {
    // Storage unavailable (private mode): the choice still applies for this visit.
  }

  if (withdrawn) {
    // gtag.js and loaded embeds cannot be unloaded cleanly, so start a clean
    // page. When tracking consent is withdrawn, first apply the new state so
    // any final beacon carries it, and drop first-party Google cookies.
    // (Cookies set inside the Maps/Calendly frames belong to those providers
    // and cannot be removed from here.)
    if (trackingWithdrawn) {
      gtag("consent", "update", {
        analytics_storage: choice.analytics ? "granted" : "denied",
        ad_storage: choice.ads ? "granted" : "denied",
        ad_user_data: choice.ads ? "granted" : "denied",
        ad_personalization: choice.ads ? "granted" : "denied",
      });
      if (analyticsWithdrawn) clearGoogleCookies(ANALYTICS_COOKIES);
      if (adsWithdrawn) clearGoogleCookies(ADS_COOKIES);
    }
    window.location.reload();
    return;
  }
  listeners.forEach((listener) => listener());
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function onOpenCookieSettings(handler: () => void) {
  window.addEventListener(OPEN_SETTINGS_EVENT, handler);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler);
}
