"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { sfLegalPaths, sfVoucherYears } from "@/lib/sf-legal";

/**
 * A plan button that opens Stripe Checkout after two confirmations.
 *
 * Clicking the button opens a small dialog with two separate, unticked
 * checkboxes; payment stays blocked until both are ticked. The client posts
 * only the plan key, the order type and the two confirmations; the server
 * picks the price and records the accepted document versions in Stripe.
 *
 * SOLICITOR REVIEW REQUIRED: the checkbox wording, especially for gift vouchers.
 */
export default function CheckoutButton({
  plan,
  planName,
  price,
  orderType,
  className,
  fallbackHref,
  children,
}: {
  plan: string;
  planName: string;
  price: number;
  orderType: "gift" | "family";
  className: string;
  /** WhatsApp link shown if checkout can't be opened. */
  fallbackHref: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const isGift = orderType === "gift";

  function open() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function close() {
    if (busy) return;
    dialogRef.current?.close();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !terms || !privacy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, orderType, acceptTerms: terms, acceptPrivacy: privacy }),
      });
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!response.ok || !data.url || !data.url.startsWith("https://checkout.stripe.com/")) {
        throw new Error(data.error || "We couldn't open the secure checkout just now.");
      }
      window.location.assign(data.url);
      // Stay busy while the browser leaves the page.
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't open the secure checkout just now.");
      setBusy(false);
    }
  }

  const termsLink = (
    <a href={sfLegalPaths.terms} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
      Terms of Sale
    </a>
  );
  const privacyLink = (
    <a href={sfLegalPaths.privacy} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
      Privacy Notice
    </a>
  );

  return (
    <>
      <button type="button" onClick={open} data-sf-plan={plan} data-sf-mode={orderType} className={className}>
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-title`}
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        className="m-auto w-[min(92vw,30rem)] rounded-3xl bg-[#fbf7f2] p-0 text-left text-[#3b2a24] shadow-[0_40px_80px_-30px_rgba(30,20,15,0.6)] backdrop:bg-[#2e201c]/60 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={onSubmit} className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8e5a52]">
                {isGift ? "Gift voucher" : "Order for my family"}
              </p>
              <h2 id={`${id}-title`} className="sf-serif mt-2 text-2xl">
                Small Forever {planName} · €{price}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-2 -mt-1 flex size-9 items-center justify-center rounded-full text-xl text-[#6f5a52] hover:bg-[#f2dfd6]"
            >
              ×
            </button>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-[#6f5a52]">
            {isGift
              ? `Before payment, please confirm the two points below. The voucher is valid for ${sfVoucherYears} years, and you can cancel it within 14 days.`
              : "Before payment, please confirm the two points below."}
          </p>

          <div className="mt-5 space-y-3">
            <label className="flex cursor-pointer gap-3 rounded-2xl border border-[#e8d9cf] bg-white p-4 text-[14.5px] leading-snug has-[:checked]:border-[#7a2e2a]">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-[#7a2e2a]"
              />
              <span>
                {isGift ? (
                  <>I have read and accept the {termsLink}, including the gift voucher terms.</>
                ) : (
                  <>
                    I have read and accept the {termsLink}. I understand that Small Forever is personalised and made to
                    order from my family&apos;s own photos, videos and voice, so the 14-day right to cancel does not apply
                    to it.
                  </>
                )}
              </span>
            </label>

            <label className="flex cursor-pointer gap-3 rounded-2xl border border-[#e8d9cf] bg-white p-4 text-[14.5px] leading-snug has-[:checked]:border-[#7a2e2a]">
              <input
                type="checkbox"
                name="acceptPrivacy"
                checked={privacy}
                onChange={(e) => setPrivacy(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-[#7a2e2a]"
              />
              <span>
                {isGift ? (
                  <>
                    I understand that the person who redeems this voucher will be asked to confirm they are the
                    child&apos;s parent or legal guardian, and to accept the Terms, before sending any photos. I have read
                    the {privacyLink}.
                  </>
                ) : (
                  <>
                    I confirm I am the child&apos;s parent or legal guardian, or have their permission, and that I can
                    share this material. I have read the {privacyLink}.
                  </>
                )}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!terms || !privacy || busy}
            aria-busy={busy}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#7a2e2a] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#62231f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Opening secure checkout…" : "Continue to secure payment"}
          </button>
          {!terms || !privacy ? (
            <p className="mt-2 text-center text-xs text-[#6f5a52]">Tick both boxes to continue.</p>
          ) : (
            <p className="mt-2 text-center text-xs text-[#6f5a52]">Payment by Stripe. We never see your card details.</p>
          )}

          <p role="alert" className="text-sm leading-snug empty:hidden">
            {error && (
              <span className="mt-3 block rounded-xl bg-[#fbe9e5] px-3 py-2 text-[#7a2e2a]">
                {error}{" "}
                <a href={fallbackHref} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                  Message us on WhatsApp
                </a>
              </span>
            )}
          </p>
        </form>
      </dialog>
    </>
  );
}
