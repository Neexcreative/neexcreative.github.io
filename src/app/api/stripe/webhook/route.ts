import { NextResponse } from "next/server";
import Stripe from "stripe";
import { isSmallForever, recordOrder } from "@/lib/sf-orders";
import { buildOrderConfirmation, sendEmail } from "@/lib/sf-email";
import { StripeConfigError, getStripe, siteUrl, webhookSecret } from "@/lib/stripe-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/webhook
 *
 * The only place a Small Forever order is treated as paid. The signature is
 * verified against the raw body before anything is read.
 *
 * Durable, idempotent record: the site has no database, so the order state
 * lives on the order's PaymentIntent in Stripe (metadata.sf_status). A repeat
 * delivery of the same event finds sf_status already set and does nothing.
 * Fulfilment itself (collecting media, building, posting) is manual for now:
 * paid orders are listed in Stripe with sf_status = paid.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let stripe: Stripe;
  let secret: string;
  try {
    stripe = getStripe();
    secret = webhookSecret();
  } catch (error) {
    if (error instanceof StripeConfigError) console.error("[webhook] configuration:", error.message);
    // 500 makes Stripe retry later, once the configuration is fixed.
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (!isSmallForever(session)) break;
        // Card payments arrive here already paid. Delayed methods arrive "unpaid"
        // and are confirmed later by async_payment_succeeded.
        if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
          if (await recordOrder(stripe, session, "paid", event.id)) await confirmByEmail(session);
        } else {
          await recordOrder(stripe, session, "awaiting_payment", event.id);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        if (isSmallForever(session) && (await recordOrder(stripe, session, "paid", event.id))) await confirmByEmail(session);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        if (isSmallForever(session)) await recordOrder(stripe, session, "payment_failed", event.id);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("[webhook] handling failed for", event.type, event.id, error);
    // Let Stripe retry: the handler is idempotent.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * Order confirmation with the accepted terms and cancellation information.
 * Sent once: only when the order has just been recorded as paid (a repeat
 * webhook delivery finds it already recorded and skips this). Off until an
 * email provider is configured (see src/lib/sf-email.ts). A failure is logged
 * and never fails the webhook, so the payment record is never lost.
 */
async function confirmByEmail(session: Stripe.Checkout.Session) {
  const to = session.customer_details?.email;
  if (!to) return;
  try {
    const message = buildOrderConfirmation({
      plan: session.metadata?.plan ?? "",
      orderType: session.metadata?.order_type === "gift" ? "gift" : "family",
      amountCents: session.amount_total,
      orderRef: `sf_${session.id.slice(-16)}`,
      siteUrl: siteUrl(),
    });
    const result = await sendEmail(to, message);
    if (!result.sent) console.info("[webhook] confirmation email not sent:", result.reason);
  } catch (error) {
    console.error("[webhook] confirmation email failed:", error instanceof Error ? error.message : error);
  }
}
