import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sfLegalVersions } from "@/lib/sf-legal";
import { sfPlans } from "@/lib/small-forever";
import {
  StripeConfigError,
  getStripe,
  isOrderType,
  isPlanKey,
  priceIdFor,
  siteUrl,
  type SfOrderType,
} from "@/lib/stripe-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_ERROR = "We couldn't open the secure checkout just now. Please try again in a moment.";

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

type Input = { plan: unknown; orderType: unknown; acceptTerms: boolean; acceptPrivacy: boolean; isForm: boolean };

/**
 * Reads { plan, orderType, acceptTerms, acceptPrivacy } from JSON or a plain
 * HTML form post. Nothing else from the client is used.
 */
async function readInput(request: Request): Promise<Input> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    return {
      plan: body?.plan,
      orderType: body?.orderType,
      acceptTerms: body?.acceptTerms === true,
      acceptPrivacy: body?.acceptPrivacy === true,
      isForm: false,
    };
  }
  const form = await request.formData().catch(() => null);
  return {
    plan: form?.get("plan"),
    orderType: form?.get("orderType"),
    acceptTerms: form?.get("acceptTerms") === "on",
    acceptPrivacy: form?.get("acceptPrivacy") === "on",
    isForm: true,
  };
}

/** Blocks cross-site posts. Same-origin requests and requests without an Origin header (some form posts) pass. */
function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const allowed = new Set([new URL(siteUrl()).host, new URL(request.url).host]);
    return allowed.has(new URL(origin).host);
  } catch {
    return false;
  }
}

/**
 * POST /api/checkout
 * Creates a Stripe-hosted Checkout Session for one Small Forever plan.
 * The price, currency, quantity and return URLs are decided here, never by the client.
 */
export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return fail(403, "This checkout can only be opened from our website.");

  const { plan, orderType, acceptTerms, acceptPrivacy, isForm } = await readInput(request);
  if (!isPlanKey(plan) || !isOrderType(orderType)) return fail(400, "Please choose a plan and try again.");
  // Both confirmations are required before payment (Terms incl. the made-to-order
  // notice, and parent/guardian + Privacy Notice). Never assumed, never defaulted.
  if (!acceptTerms || !acceptPrivacy) {
    return fail(400, "Please tick both boxes to confirm before continuing to payment.");
  }

  const planInfo = sfPlans.find((p) => p.key === plan)!;
  const type: SfOrderType = orderType;

  try {
    const stripe = getStripe();
    const priceId = priceIdFor(plan);

    // Guard against a misconfigured env var pointing at the wrong price.
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.currency !== "eur" || price.type !== "one_time" || price.unit_amount !== planInfo.price * 100) {
      console.error("[checkout] price mismatch", {
        plan,
        priceId,
        active: price.active,
        currency: price.currency,
        type: price.type,
        unitAmount: price.unit_amount,
      });
      return fail(503, GENERIC_ERROR);
    }

    const base = siteUrl();
    // Acceptance record, kept with the order in Stripe (the site has no database).
    // Stripe stores it with the Checkout Session and PaymentIntent; it isn't edited afterwards.
    const metadata = {
      project: "small_forever",
      plan,
      order_type: type,
      terms_version: sfLegalVersions.terms,
      privacy_version: sfLegalVersions.privacy,
      cancellation_version: sfLegalVersions.cancellation,
      accepted_at: new Date().toISOString(),
      acceptance: type === "gift" ? "gift-terms+voucher-redeemer-notice" : "terms+made-to-order+guardian+privacy",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/small-forever/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/small-forever?checkout=cancelled#plans`,
      shipping_address_collection: { allowed_countries: ["IE"] },
      billing_address_collection: "auto",
      customer_creation: "always",
      metadata,
      payment_intent_data: {
        metadata,
        description: `Small Forever ${planInfo.name} (${type === "gift" ? "gift" : "for my family"})`,
      },
      custom_text: {
        shipping_address: {
          message:
            type === "gift"
              ? "Where should the gift box go? Your printable voucher arrives by email right away; the box is made in January."
              : "Your keepsake box is delivered free anywhere in Ireland.",
        },
        submit: {
          message: "After payment we'll email you within one working day with how to send your photos and videos safely.",
        },
      },
    });

    if (!session.url) throw new Error("Stripe returned a session without a URL");

    if (isForm) return NextResponse.redirect(session.url, 303);
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof StripeConfigError) {
      console.error("[checkout] configuration:", error.message);
    } else if (error instanceof Stripe.errors.StripeError) {
      console.error("[checkout] stripe:", error.type, error.code, error.message);
    } else {
      console.error("[checkout] unexpected:", error);
    }
    return fail(503, GENERIC_ERROR);
  }
}
