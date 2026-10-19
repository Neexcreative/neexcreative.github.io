"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getConsent,
  getServerConsent,
  onOpenCookieSettings,
  saveConsent,
  subscribeConsent,
  type ConsentChoice,
  type ConsentSnapshot,
} from "@/lib/consent";

const buttonClasses =
  "inline-flex flex-1 items-center justify-center whitespace-nowrap border border-text px-2 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-text transition-colors hover:bg-text hover:text-bg sm:flex-none sm:px-5 sm:tracking-[0.18em]";

/**
 * Non-modal consent banner. Shown until the visitor chooses, and again from
 * the footer's "Cookie settings". Accept and Reject carry equal weight.
 */
export default function CookieBanner() {
  const consent = useSyncExternalStore<ConsentSnapshot>(subscribeConsent, getConsent, getServerConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customising, setCustomising] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>({ analytics: false, ads: false, embeds: false });
  const regionRef = useRef<HTMLElement>(null);

  useEffect(
    () =>
      onOpenCookieSettings(() => {
        setDraft(getConsent() ?? { analytics: false, ads: false, embeds: false });
        setCustomising(true);
        setSettingsOpen(true);
      }),
    [],
  );

  // Reopened on request: move focus to the banner so keyboard users land on it.
  useEffect(() => {
    if (settingsOpen) regionRef.current?.focus();
  }, [settingsOpen]);

  if (consent === undefined || (consent !== null && !settingsOpen)) return null;

  function choose(choice: ConsentChoice) {
    saveConsent(choice);
    setSettingsOpen(false);
    setCustomising(false);
  }

  return (
    <section
      ref={regionRef}
      tabIndex={-1}
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-60 max-h-[85dvh] overflow-y-auto border-t border-border bg-surface text-text shadow-[0_-8px_30px_rgba(0,0,0,0.5)] focus:outline-none"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 md:px-12">
        <p id="cookie-banner-title" className="text-sm font-medium">
          Cookies on this site
        </p>
        {/* Short notice on phones so the banner never hides the first screen. */}
        <p className="mt-1.5 text-[13px] leading-snug text-muted sm:hidden">
          We use Google Analytics, Google Ads, Maps and Calendly only if you allow them.{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-text">
            Privacy notice
          </Link>
        </p>
        <p className="mt-2 hidden max-w-3xl text-sm leading-relaxed text-muted sm:block">
          With your permission we use Google Analytics to understand how the site is used,
          Google Ads to measure our advertising, and load Google Maps and Calendly. None of
          these run unless you allow them. You can change your choice any time from Cookie
          settings in the footer.{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-text">
            Privacy notice
          </Link>
        </p>

        {customising && (
          <fieldset className="mt-4 flex flex-col gap-3 text-[13px] sm:text-sm">
            <legend className="sr-only">Cookie preferences</legend>
            <label className="flex items-start gap-3 text-muted">
              <input type="checkbox" checked disabled className="mt-1 accent-accent" />
              <span>
                <span className="text-text">Strictly necessary</span>, always on. Remembers your
                cookie choice.
              </span>
            </label>
            <label className="flex items-start gap-3 text-muted">
              <input
                type="checkbox"
                checked={draft.analytics}
                onChange={(event) => setDraft({ ...draft, analytics: event.target.checked })}
                className="mt-1 accent-accent"
              />
              <span>
                <span className="text-text">Analytics</span>, Google Analytics 4: pages visited
                and how the site is used.
              </span>
            </label>
            <label className="flex items-start gap-3 text-muted">
              <input
                type="checkbox"
                checked={draft.ads}
                onChange={(event) => setDraft({ ...draft, ads: event.target.checked })}
                className="mt-1 accent-accent"
              />
              <span>
                <span className="text-text">Advertising</span>, Google Ads: measures enquiries
                from our ads and may personalise Google ads.
              </span>
            </label>
            <label className="flex items-start gap-3 text-muted">
              <input
                type="checkbox"
                checked={draft.embeds}
                onChange={(event) => setDraft({ ...draft, embeds: event.target.checked })}
                className="mt-1 accent-accent"
              />
              <span>
                <span className="text-text">External content</span>, Google Maps on the contact
                page and Calendly on the booking page, loaded from Google and Calendly.
              </span>
            </label>
          </fieldset>
        )}

        <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:flex-wrap sm:gap-3">
          <button type="button" className={buttonClasses} onClick={() => choose({ analytics: false, ads: false, embeds: false })}>
            Reject all
          </button>
          <button type="button" className={buttonClasses} onClick={() => choose({ analytics: true, ads: true, embeds: true })}>
            Accept all
          </button>
          {customising ? (
            <button type="button" className={buttonClasses} onClick={() => choose(draft)}>
              Save choices
            </button>
          ) : (
            <button
              type="button"
              className="shrink-0 px-1 py-2.5 text-xs uppercase tracking-[0.1em] text-muted underline-offset-4 hover:text-text hover:underline sm:tracking-[0.18em]"
              onClick={() => setCustomising(true)}
            >
              Customise
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
