/**
 * Server-only Stripe helpers for Small Forever checkout.
 * Never import this file from a client component: it reads secret env vars.
 */
import Stripe from "stripe";
import { siteConfig } from "@/lib/site-config";
import { sfPlans, type SfPlanKey } from "@/lib/small-forever";

export const SF_ORDER_TYPES = ["gift", "family"] as const;
export type SfOrderType = (typeof SF_ORDER_TYPES)[number];

const PRICE_ENV: Record<SfPlanKey, string> = {
  little: "STRIPE_PRICE_LITTLE",
  story: "STRIPE_PRICE_STORY",
  legacy: "STRIPE_PRICE_LEGACY",
};

/** Thrown when the server is missing configuration. The message is for logs, not for customers. */
export class StripeConfigError extends Error {}

export function isPlanKey(value: unknown): value is SfPlanKey {
  return typeof value === "string" && sfPlans.some((plan) => plan.key === value);
}

export function isOrderType(value: unknown): value is SfOrderType {
  return typeof value === "string" && (SF_ORDER_TYPES as readonly string[]).includes(value);
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new StripeConfigError(`Missing environment variable ${name}`);
  return value;
}

let client: Stripe | null = null;

/** One Stripe client per server instance. Test keys only until live payments are approved. */
export function getStripe(): Stripe {
  if (!client) client = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  return client;
}

export function priceIdFor(plan: SfPlanKey): string {
  const id = requireEnv(PRICE_ENV[plan]);
  if (!id.startsWith("price_")) throw new StripeConfigError(`${PRICE_ENV[plan]} is not a Stripe Price ID`);
  return id;
}

const clean = (url: string) => url.trim().replace(/\/+$/, "");

/**
 * The origin of the environment this server runs in, for Stripe return URLs
 * (success_url / cancel_url). Never taken from anything the browser sends.
 *
 * - Vercel Production: SITE_URL if set, otherwise https://www.neexcreative.com
 * - Vercel Preview:    this deployment's own URL (VERCEL_URL, set by Vercel),
 *                      so a preview checkout returns to the same preview
 * - Local (next dev / next start): the local origin that served the request
 *   (localhost only), otherwise SITE_URL, otherwise the production domain
 */
export function siteUrl(request?: Request): string {
  const env = process.env.VERCEL_ENV;
  if (env === "production") return clean(process.env.SITE_URL || siteConfig.url);
  if (env === "preview") {
    if (process.env.VERCEL_URL) return `https://${clean(process.env.VERCEL_URL)}`;
    console.error("[checkout] configuration: Missing environment variable VERCEL_URL on a Vercel preview");
  }
  if (request) {
    const local = new URL(request.url);
    if (local.hostname === "localhost" || local.hostname === "127.0.0.1") return local.origin;
  }
  return clean(process.env.SITE_URL || siteConfig.url);
}

export function webhookSecret(): string {
  return requireEnv("STRIPE_WEBHOOK_SECRET");
}

/** Checkout Session IDs look like cs_test_… or cs_live_…; anything else is rejected before calling Stripe. */
export function isCheckoutSessionId(value: unknown): value is string {
  return typeof value === "string" && /^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(value);
}
