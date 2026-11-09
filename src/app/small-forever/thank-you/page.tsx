import type { Metadata } from "next";
import Link from "next/link";
import type Stripe from "stripe";
import { siteConfig } from "@/lib/site-config";
import { sfPlans } from "@/lib/small-forever";
import { getStripe, isCheckoutSessionId } from "@/lib/stripe-server";
import { sans, serif, sfBaseCss } from "../fonts";
import PurchaseTracker from "./PurchaseTracker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Thank you · Small Forever" },
  robots: { index: false, follow: false },
};

type View =
  | { kind: "missing" }
  | { kind: "open" }
  | { kind: "processing" | "paid"; session: Stripe.Checkout.Session };

/** Reads the order back from Stripe for display only. Fulfilment never depends on this page. */
async function loadView(sessionId: unknown): Promise<View> {
  if (!isCheckoutSessionId(sessionId)) return { kind: "missing" };
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.metadata?.project !== "small_forever") return { kind: "missing" };
    if (session.status !== "complete") return { kind: "open" };
    return { kind: session.payment_status === "paid" ? "paid" : "processing", session };
  } catch (error) {
    console.error("[thank-you] could not load session:", error instanceof Error ? error.message : error);
    return { kind: "missing" };
  }
}

function maskEmail(email: string | null | undefined) {
  if (!email) return null;
  const [user, domain] = email.split("@");
  if (!domain) return null;
  return `${user.slice(0, 1)}•••@${domain}`;
}

const whatsapp = `${siteConfig.whatsapp}?text=${encodeURIComponent("Hi! I have a question about my Small Forever order.")}`;

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const view = await loadView(session_id);

  const session = view.kind === "paid" || view.kind === "processing" ? view.session : null;
  const plan = sfPlans.find((p) => p.key === session?.metadata?.plan);
  const isGift = session?.metadata?.order_type === "gift";
  const email = maskEmail(session?.customer_details?.email);
  const amount = session?.amount_total != null ? (session.amount_total / 100).toFixed(2).replace(/\.00$/, "") : null;

  return (
    <div className={`${serif.variable} ${sans.variable} sf-root min-h-screen bg-[#fbf7f2] text-[#3b2a24]`}>
      <style>{sfBaseCss}</style>

      <header className="border-b border-[#e8d9cf]">
        <div className="mx-auto flex max-w-3xl justify-center px-5 py-5">
          <Link href="/small-forever" aria-label="Small Forever home">
            <span className="block whitespace-nowrap border-y border-[#3b2a24]/40 px-3 py-1 text-[12px] font-medium tracking-[0.42em] md:text-sm">
              SMALL FOREVER
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-16 md:py-24">
        {view.kind === "paid" && session && plan && (
          <PurchaseTracker orderRef={`sf_${session.id.slice(-16)}`} plan={plan.key} mode={isGift ? "gift" : "family"} />
        )}

        {(view.kind === "paid" || view.kind === "processing") && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7a2e2a]">
              {view.kind === "paid" ? "Payment received" : "Payment processing"}
            </p>
            <h1 className="sf-serif mt-4 text-4xl leading-tight md:text-5xl">
              {view.kind === "paid" ? (
                <>
                  Thank you. <em className="text-[#7a2e2a]">Their story starts here.</em>
                </>
              ) : (
                "Your order is in. Your bank is confirming the payment."
              )}
            </h1>
            {view.kind === "processing" && (
              <p className="mt-5 text-[17px] leading-relaxed text-[#6f5a52]">
                Some payment methods take a little longer. We&apos;ll email you as soon as it&apos;s confirmed, and we only start
                once it is.
              </p>
            )}

            <dl className="mt-10 grid gap-x-8 gap-y-4 rounded-3xl bg-white p-7 text-[15px] shadow-[0_20px_50px_-35px_rgba(59,42,36,0.5)] sm:grid-cols-2">
              <div>
                <dt className="text-[#6f5a52]">Plan</dt>
                <dd className="sf-serif text-2xl">{plan ? `Small Forever ${plan.name}` : "Small Forever"}</dd>
              </div>
              <div>
                <dt className="text-[#6f5a52]">Order</dt>
                <dd className="font-semibold">{isGift ? "Gift" : "For my family"}</dd>
              </div>
              {amount && (
                <div>
                  <dt className="text-[#6f5a52]">Total</dt>
                  <dd className="font-semibold">€{amount} · VAT and delivery included</dd>
                </div>
              )}
              {email && (
                <div>
                  <dt className="text-[#6f5a52]">Receipt sent to</dt>
                  <dd className="font-semibold">{email}</dd>
                </div>
              )}
            </dl>

            <h2 className="sf-serif mt-14 text-3xl">What happens next</h2>
            <ol className="mt-6 space-y-5 text-[16px] leading-relaxed">
              {(isGift
                ? [
                    "Within one working day, we email you a printable gift voucher, ready to wrap or send.",
                    "Give it whenever you like. The family can take their time choosing their photos and videos.",
                    "When they're ready, we send them a private way to share their files with us. Nothing is ever posted publicly.",
                    "We build their Small Forever, they approve a preview, and the keepsake box is delivered in Ireland.",
                  ]
                : [
                    "Within one working day, we email you with how to send your photos, videos and voice notes privately.",
                    "Send everything as it is on your phone. Sorting, dating and building is our job.",
                    "We send you a preview to approve, and you can ask for changes.",
                    "Your keepsake box is delivered free anywhere in Ireland.",
                  ]
              ).map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="sf-serif flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f2dfd6] text-lg text-[#7a2e2a]">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-10 rounded-2xl bg-[#e3e9dc] px-5 py-4 text-[15px]">
              Please don&apos;t reply to the Stripe receipt with photos. We&apos;ll send you a private way to share them.
            </p>
          </>
        )}

        {view.kind === "open" && (
          <>
            <h1 className="sf-serif text-4xl md:text-5xl">Your payment wasn&apos;t completed.</h1>
            <p className="mt-5 text-[17px] text-[#6f5a52]">Nothing was charged. You can try again whenever you&apos;re ready.</p>
            <Link
              href="/small-forever#plans"
              className="mt-8 inline-flex rounded-full bg-[#7a2e2a] px-7 py-3.5 text-[15px] font-semibold text-white hover:bg-[#62231f]"
            >
              Back to the plans
            </Link>
          </>
        )}

        {view.kind === "missing" && (
          <>
            <h1 className="sf-serif text-4xl md:text-5xl">We couldn&apos;t find that order.</h1>
            <p className="mt-5 text-[17px] text-[#6f5a52]">
              If you&apos;ve just paid, your receipt is on its way to your email and your order is safe. Any questions, we&apos;re
              here.
            </p>
          </>
        )}

        <p className="mt-12 text-[15px] text-[#6f5a52]">
          Questions?{" "}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#7a2e2a] underline underline-offset-4">
            Message us on WhatsApp
          </a>{" "}
          or email{" "}
          <a href={`mailto:${siteConfig.email}?subject=Small%20Forever%20order`} className="font-semibold text-[#7a2e2a] underline underline-offset-4">
            {siteConfig.email}
          </a>
          .
        </p>
      </main>
    </div>
  );
}
