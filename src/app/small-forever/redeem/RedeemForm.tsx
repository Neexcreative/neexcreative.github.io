"use client";

import { useState } from "react";
import { sfLegalPaths } from "@/lib/sf-legal";

/**
 * Voucher redemption: the person who will send the child's material accepts
 * the Terms and confirms they are the parent/guardian (or have permission)
 * before anything else happens. Both boxes start unticked; the button stays
 * disabled until both are ticked, and the server checks again.
 *
 * SOLICITOR REVIEW REQUIRED: checkbox wording.
 */
export default function RedeemForm() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [guardian, setGuardian] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !terms || !guardian) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/small-forever/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherCode: code, email, acceptTerms: terms, acceptGuardian: guardian, website }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-3xl bg-white p-7 shadow-[0_20px_50px_-35px_rgba(59,42,36,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a2e2a]">Voucher confirmed</p>
        <h2 className="sf-serif mt-3 text-3xl">Thank you. We&apos;ll be in touch.</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-[#6f5a52]">
          Within one working day we&apos;ll email <strong className="text-[#3b2a24]">{email}</strong> a private link to
          upload your photos, videos and voice notes. Please don&apos;t send anything before you receive it.
        </p>
      </div>
    );
  }

  const field =
    "mt-1.5 block w-full rounded-xl border border-[#e8d9cf] bg-white px-4 py-3 text-[16px] text-[#3b2a24] outline-none focus:border-[#7a2e2a]";
  const box =
    "flex cursor-pointer gap-3 rounded-2xl border border-[#e8d9cf] bg-white p-4 text-[15px] leading-snug has-[:checked]:border-[#7a2e2a]";
  const link = "font-semibold text-[#7a2e2a] underline underline-offset-2";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <label className="block text-sm font-semibold">
        Voucher code
        <input
          className={`${field} uppercase tracking-wider`}
          name="voucherCode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="SF-STO-K7M2P"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={20}
          required
        />
      </label>
      <label className="block text-sm font-semibold">
        Your email
        <span className="block text-xs font-normal text-[#6f5a52]">We&apos;ll send your private upload link here.</span>
        <input
          className={field}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          maxLength={254}
          required
        />
      </label>

      {/* Honeypot, hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <label className={box}>
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-[#7a2e2a]"
        />
        <span>
          I have read and accept the{" "}
          <a href={sfLegalPaths.terms} target="_blank" rel="noopener noreferrer" className={link}>
            Terms of Sale
          </a>
          .
        </span>
      </label>
      <label className={box}>
        <input
          type="checkbox"
          checked={guardian}
          onChange={(e) => setGuardian(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-[#7a2e2a]"
        />
        <span>
          I confirm I am the child&apos;s parent or legal guardian, or have their permission, and that I can share this
          material, including the voices and images of anyone else in it. I have read the{" "}
          <a href={sfLegalPaths.privacy} target="_blank" rel="noopener noreferrer" className={link}>
            Privacy Notice
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={!terms || !guardian || busy}
        aria-busy={busy}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#7a2e2a] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#62231f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Confirming…" : "Confirm and redeem"}
      </button>
      {(!terms || !guardian) && <p className="text-center text-xs text-[#6f5a52]">Tick both boxes to continue.</p>}
      <p role="alert" className="text-sm empty:hidden">
        {error && <span className="block rounded-xl bg-[#fbe9e5] px-3 py-2 text-[#7a2e2a]">{error}</span>}
      </p>
    </form>
  );
}
