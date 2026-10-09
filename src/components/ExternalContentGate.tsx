"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  getConsent,
  getServerConsent,
  openCookieSettings,
  subscribeConsent,
  type ConsentSnapshot,
} from "@/lib/consent";

interface ExternalContentGateProps {
  /** Provider name shown on the placeholder, e.g. "Google Maps". */
  provider: string;
  /** What loading the embed does, in plain words. */
  notice: string;
  loadLabel: string;
  /** Sizing/spacing for the placeholder, matching the embed it stands in for. */
  className?: string;
  /** Extra actions beside the load button, e.g. a direct external link. */
  actions?: ReactNode;
  /** The embed. Not rendered, so nothing is requested, until allowed. */
  children: ReactNode;
}

const NOT_LOADED = Symbol("not-loaded");

/**
 * Click-to-load wrapper for third-party embeds. Nothing from the provider is
 * requested until the visitor clicks the load button (this page view only)
 * or allows External content in Cookie settings. Any later consent change
 * unloads a click-loaded embed; withdrawing stored consent reloads the page.
 */
export default function ExternalContentGate({
  provider,
  notice,
  loadLabel,
  className = "",
  actions,
  children,
}: ExternalContentGateProps) {
  const consent = useSyncExternalStore<ConsentSnapshot>(subscribeConsent, getConsent, getServerConsent);
  // The consent snapshot the visitor clicked under; a new choice invalidates it.
  const [loadedUnder, setLoadedUnder] = useState<ConsentSnapshot | typeof NOT_LOADED>(NOT_LOADED);
  const embedRef = useRef<HTMLDivElement>(null);

  const clicked = loadedUnder !== NOT_LOADED && loadedUnder === consent;
  const allowed = !!consent?.embeds || clicked;

  // Keyboard users keep their place: the button they pressed is replaced by the embed.
  useEffect(() => {
    if (clicked) embedRef.current?.focus();
  }, [clicked]);

  if (allowed) {
    return (
      <div ref={embedRef} tabIndex={-1} className="focus:outline-none">
        {children}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-start justify-center gap-4 border border-light-border bg-light-surface p-6 text-light-text md:p-8 ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-light-muted">{provider}</p>
      <p className="max-w-md text-sm leading-relaxed text-light-muted">{notice}</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setLoadedUnder(consent)}
          className="inline-flex items-center gap-2 bg-light-accent px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
        >
          {loadLabel}
        </button>
        {actions}
      </div>
      <p className="text-xs leading-relaxed text-light-muted">
        To load external content automatically, allow it in{" "}
        <button
          type="button"
          onClick={openCookieSettings}
          className="underline underline-offset-4 hover:text-light-text"
        >
          Cookie settings
        </button>
        .
      </p>
    </div>
  );
}
