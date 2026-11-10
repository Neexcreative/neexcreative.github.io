import Link from "next/link";
import type { ReactNode } from "react";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { sfBusiness, sfLegalPaths, sfLegalUpdated } from "@/lib/sf-legal";
import { sans, serif, sfBaseCss } from "../fonts";

/**
 * Shared frame for the Small Forever legal pages (Terms, Privacy, Cancellation).
 * SOLICITOR REVIEW REQUIRED: the pages using this frame are drafts. The
 * data attribute below marks them in the HTML; visitors don't see it.
 */
export default function LegalPage({
  title,
  version,
  intro,
  children,
}: {
  title: string;
  version: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={`${serif.variable} ${sans.variable} sf-root min-h-screen bg-[#fbf7f2] text-[#3b2a24]`}
      data-legal-status="draft-solicitor-review-required"
    >
      <style>{`${sfBaseCss}
        .sf-legal h2{font-family:var(--font-sf-serif),Georgia,serif;font-size:1.6rem;line-height:1.2;margin-top:2.75rem}
        .sf-legal h3{font-weight:600;margin-top:1.5rem}
        .sf-legal p,.sf-legal li{color:#5b4840;line-height:1.7;margin-top:.75rem}
        .sf-legal ul{list-style:disc;padding-left:1.25rem}
        .sf-legal ol{list-style:decimal;padding-left:1.25rem}
        .sf-legal a{color:#7a2e2a;text-decoration:underline;text-underline-offset:3px}
        .sf-legal strong{color:#3b2a24}
      `}</style>

      <header className="border-b border-[#e8d9cf]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
          <Link href="/small-forever" aria-label="Small Forever home">
            <span className="block whitespace-nowrap border-y border-[#3b2a24]/40 px-3 py-1 text-[12px] font-medium tracking-[0.42em]">
              SMALL FOREVER
            </span>
          </Link>
          <Link href="/small-forever#plans" className="text-sm text-[#6f5a52] hover:text-[#3b2a24]">
            ← Back to the plans
          </Link>
        </div>
      </header>

      <main className="sf-legal mx-auto max-w-3xl px-5 py-14 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8e5a52]">Small Forever</p>
        <h1 className="sf-serif mt-3 text-4xl md:text-5xl">{title}</h1>
        <p className="!mt-4 text-sm">
          Last updated {sfLegalUpdated} · Version {version}
        </p>
        <div className="mt-6">{intro}</div>
        {children}
      </main>

      <footer className="bg-[#2e201c] text-[#e6d5cb]">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-10 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            {sfBusiness.tradingName} · {sfBusiness.owner} · Business name no. {sfBusiness.businessNameNumber}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={sfLegalPaths.terms} className="hover:text-white">Terms of Sale</Link>
            <Link href={sfLegalPaths.privacy} className="hover:text-white">Privacy</Link>
            <Link href={sfLegalPaths.cancellation} className="hover:text-white">Cancellation</Link>
            <CookieSettingsButton />
          </nav>
        </div>
      </footer>
    </div>
  );
}
