/**
 * Small Forever order state, stored on each order's PaymentIntent metadata in Stripe.
 * The site has no database, so Stripe is the durable record. Used by the webhook only.
 */
import type Stripe from "stripe";

export type OrderStatus = "awaiting_payment" | "paid" | "payment_failed";

export function isSmallForever(session: Stripe.Checkout.Session) {
  return session.metadata?.project === "small_forever";
}

/** Order of precedence: a later "paid" or "payment_failed" may replace "awaiting_payment", never the reverse. */
const RANK: Record<OrderStatus, number> = { awaiting_payment: 1, paid: 2, payment_failed: 2 };

/**
 * Writes the order status onto the PaymentIntent once per status.
 * Safe to call any number of times for the same event (Stripe retries and duplicates).
 */
export async function recordOrder(
  stripe: Pick<Stripe, "paymentIntents">, session: Stripe.Checkout.Session, status: OrderStatus, eventId: string) {
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (!paymentIntentId) {
    console.warn("[webhook] session without payment intent", session.id);
    return;
  }

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const current = intent.metadata?.sf_status as OrderStatus | undefined;
  if (current === status || (current && RANK[current] >= RANK[status])) {
    console.info("[webhook] already recorded", { session: session.id, status: current, event: eventId });
    return;
  }

  await stripe.paymentIntents.update(
    paymentIntentId,
    {
      metadata: {
        sf_status: status,
        sf_session: session.id,
        sf_recorded_at: new Date().toISOString(),
      },
    },
    { idempotencyKey: `sf-${session.id}-${status}` },
  );

  // Order details for the Vercel logs. No family media or free text, just what's needed to act.
  console.info("[webhook] small forever order", {
    status,
    session: session.id,
    plan: session.metadata?.plan,
    orderType: session.metadata?.order_type,
    amount: session.amount_total,
    currency: session.currency,
  });
}
