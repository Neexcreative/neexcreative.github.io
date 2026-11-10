import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { isAllowedOrigin, jsonError, readJson } from "@/lib/request-guards";
import { clientKey, rateLimit } from "@/lib/sf-store";
import { sfLegalVersions } from "@/lib/sf-legal";
import { sfPlans, type SfPlanKey } from "@/lib/small-forever";
import {
  SF_ORDER_TYPES,
  StripeConfigError,
  getStripe,
  priceIdFor,
  siteUrl,
  type SfOrderType,
} from "@/lib/stripe-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_ERROR = "We couldn't open the secure checkout just now. Please try again in a moment.";

const fail = jsonError;

/** Influencer/referral codes: letters, digits, "-" and "_". Stored upper-case. */
const REF_CODE = /^[A-Za-z0-9_-]{2,32}$/;
/** UTM values are campaign labels; anything else is dropped, never rejected. */
const UTM_VALUE = /^[A-Za-z0-9 _.+-]{1,60}$/;
const utmField = z
  .string()
  .nullish()
  .transform((v) => (v && UTM_VALUE.test(v.trim()) ? v.trim().toLowerCase() : undefined))
  .catch(undefined);

/**
 * The only fields accepted from the browser. Prices, Stripe Price IDs and
 * return URLs are never taken from the client. Unknown fields are rejected.
 */
const Body = z
  .object({
    plan: z.enum(sfPlans.map((p) => p.key) as [SfPlanKey, ...SfPlanKey[]]),
    orderType: z.enum(SF_ORDER_TYPES),
    acceptTerms: z.literal(true),
    acceptPrivacy: z.literal(true),
    refCode: z
      .string()
      .trim()
      .max(32)
      .optional()
      .refine((v) => !v || REF_CODE.test(v), { message: "ref" }),
    utm: z
      .object({ utm_source: utmField, utm_medium: utmField, utm_campaign: utmField })
      .partial()
      .optional(),
  })
  .strict();

type Parsed = z.infer<typeof Body>;

/** Reads the body (JSON from the dialog, or a plain form post without JavaScript). */
async function readInput(request: Request): Promise<{ data: unknown; isForm: boolean }> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return { data: await readJson(request), isForm: false };
  const form = await request.formData().catch(() => null);
  if (!form) return { data: null, isForm: true };
  return {
    data: {
      plan: form.get("plan") ?? undefined,
      orderType: form.get("orderType") ?? undefined,
      acceptTerms: form.get("acceptTerms") === "on",
      acceptPrivacy: form.get("acceptPrivacy") === "on",
      refCode: (form.get("refCode") as string | null) || undefined,
    },
    isForm: true,
  };
}

/** Friendly message for the first problem; internal detail never reaches the visitor. */
function messageFor(error: z.ZodError): string {
  const paths = error.issues.map((i) => String(i.path[0] ?? ""));
  if (paths.includes("acceptTerms") || paths.includes("acceptPrivacy")) {
    return "Please tick both boxes to confirm before continuing to payment.";
  }
  if (paths.includes("refCode")) return "That referral code doesn't look right. Check it, or leave the box empty.";
  return "Please choose a plan and try again.";
}

/**
 * POST /api/checkout
 * Creates a Stripe-hosted Checkout Session for one Small Forever plan.
 * The price, currency, quantity and return URLs are decided here, never by the client.
 */
export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return fail(403, "This checkout can only be opened from our website.");

  if (!(await rateLimit("checkout", clientKey(request), { limit: 10, windowSeconds: 60 }))) {
    return fail(429, "Too many attempts. Please wait a minute and try again.", { "Retry-After": "60" });
  }

  const { data, isForm } = await readInput(request);
  const parsed = Body.safeParse(data);
  if (!parsed.success) return fail(400, messageFor(parsed.error));
  const { plan, orderType, refCode, utm }: Parsed = parsed.data;
  const ref = refCode ?? "";

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
    const campaign = Object.fromEntries(Object.entries(utm ?? {}).filter(([, v]) => typeof v === "string")) as Record<
      string,
      string
    >;
    const metadata = {
      project: "small_forever",
      plan,
      order_type: type,
      terms_version: sfLegalVersions.terms,
      privacy_version: sfLegalVersions.privacy,
      cancellation_version: sfLegalVersions.cancellation,
      accepted_at: new Date().toISOString(),
      acceptance: type === "gift" ? "gift-terms+voucher-redeemer-notice" : "terms+made-to-order+guardian+privacy",
      // Attribution for influencer commissions and campaign reports.
      ...(ref ? { ref_code: ref.toUpperCase() } : {}),
      ...campaign,
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
