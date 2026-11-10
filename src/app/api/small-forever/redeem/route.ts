/* SOLICITOR REVIEW REQUIRED: the redemption acceptance wording lives in RedeemForm.tsx. */
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAllowedOrigin, jsonError, readJson } from "@/lib/request-guards";
import { sfLegalVersions } from "@/lib/sf-legal";
import { StoreUnavailableError, appendAcceptance, clientKey, rateLimit } from "@/lib/sf-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Voucher codes from the gift-card generator: SF-LIT|STO|LEG-XXXXX (no 0, O, 1 or I). */
const VOUCHER_CODE = /^SF-(LIT|STO|LEG)-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}$/;

const Body = z
  .object({
    voucherCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(VOUCHER_CODE, "Please check the voucher code. It looks like SF-STO-K7M2P."),
    email: z.string().trim().toLowerCase().max(254).pipe(z.email("Please enter a valid email address.")),
    acceptTerms: z.literal(true, "Please tick both boxes to continue."),
    acceptGuardian: z.literal(true, "Please tick both boxes to continue."),
    /** Honeypot: hidden from people; bots fill it. */
    website: z.string().max(0).optional(),
  })
  .strict();

/**
 * POST /api/small-forever/redeem
 *
 * The person redeeming a gift voucher (who will send the child's material)
 * accepts the Terms of Sale and confirms they are the parent/guardian or have
 * permission, before receiving the private upload link. Each acceptance is
 * appended to a log that the site never edits: UTC time, document versions,
 * voucher ID and email. No IP address or user agent is stored (a salted hash
 * of the IP is used only as a short-lived rate-limit counter).
 */
export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return jsonError(403, "This form can only be sent from our website.");

  if (!(await rateLimit("redeem", clientKey(request), { limit: 5, windowSeconds: 600 }))) {
    return jsonError(429, "Too many attempts. Please wait a few minutes and try again.", { "Retry-After": "600" });
  }

  const raw = await readJson(request);
  if (raw === null) return jsonError(400, "Please fill in the form and try again.");

  // Bots that fill the hidden field get a quiet success and nothing is recorded.
  if (typeof raw === "object" && raw && "website" in raw && String((raw as { website?: unknown }).website ?? "").length > 0) {
    return NextResponse.json({ ok: true, reference: null }, { headers: { "Cache-Control": "no-store" } });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    // Only our own friendly messages reach the visitor; anything else is generic.
    const issue = parsed.error.issues[0];
    const friendly = issue && issue.code !== "unrecognized_keys" && issue.code !== "invalid_type" ? issue.message : null;
    return jsonError(400, friendly ?? "Please check the form and try again.");
  }
  const { voucherCode, email } = parsed.data;

  try {
    const acceptedAt = new Date().toISOString();
    const reference = await appendAcceptance({
      type: "voucher_redemption",
      voucher_id: voucherCode,
      email,
      accepted_at: acceptedAt,
      terms_version: sfLegalVersions.terms,
      privacy_version: sfLegalVersions.privacy,
      wording: "redeem-v1:terms+guardian-or-permission+privacy",
    });
    return NextResponse.json({ ok: true, reference }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof StoreUnavailableError) {
      console.error("[redeem] acceptance store not configured");
    } else {
      console.error("[redeem] could not record acceptance:", error instanceof Error ? error.message : error);
    }
    // Fail closed: without a stored acceptance we must not proceed.
    return jsonError(503, "We couldn't record your confirmation just now. Please try again, or email us.");
  }
}
