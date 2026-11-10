"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * A plan button that opens Stripe Checkout. It posts only the plan key and
 * order type; the server picks the price. Without JavaScript the form posts
 * directly and the server redirects to Stripe.
 */
export default function CheckoutButton({
  plan,
  orderType,
  className,
  fallbackHref,
  children,
}: {
  plan: string;
  orderType: "gift" | "family";
  className: string;
  /** WhatsApp link shown if checkout can't be opened. */
  fallbackHref: string;
  children: ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, orderType }),
      });
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!response.ok || !data.url || !data.url.startsWith("https://checkout.stripe.com/")) {
        throw new Error(data.error || "We couldn't open the secure checkout just now.");
      }
      window.location.assign(data.url);
      // Keep the button busy while the browser leaves the page.
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't open the secure checkout just now.");
      setBusy(false);
    }
  }

  return (
    <form action="/api/checkout" method="post" onSubmit={onSubmit} className="flex flex-col">
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="orderType" value={orderType} />
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        aria-describedby={error ? errorId : undefined}
        data-sf-plan={plan}
        data-sf-mode={orderType}
        className={`${className} disabled:cursor-wait disabled:opacity-70`}
      >
        {busy ? "Opening secure checkout…" : children}
      </button>
      <p id={errorId} role="alert" className="text-sm leading-snug empty:hidden">
        {error && (
          <span className="mt-2 block rounded-xl bg-[#fbe9e5] px-3 py-2 text-[#7a2e2a]">
            {error}{" "}
            <a href={fallbackHref} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
              Message us on WhatsApp
            </a>
          </span>
        )}
      </p>
    </form>
  );
}
