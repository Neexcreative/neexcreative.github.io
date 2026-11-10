/**
 * Small Forever order confirmation email (server only).
 *
 * PREPARED BUT OFF: no email provider has been chosen yet. sendEmail() does
 * nothing unless EMAIL_PROVIDER is set AND an adapter for it exists below.
 * To switch it on: pick a provider with a DPA and EU processing, add its
 * adapter in sendEmail(), set EMAIL_PROVIDER, EMAIL_FROM and the provider's
 * API key in Vercel, and add the provider to the Privacy Notice and
 * subprocessor list.
 *
 * SOLICITOR REVIEW REQUIRED: the cancellation wording in the email.
 */
import { sfBusiness, sfLegalVersionUrl, sfLegalVersions, sfVoucherYears } from "@/lib/sf-legal";
import { sfPlans } from "@/lib/small-forever";

export type ConfirmationInput = {
  plan: string;
  orderType: "gift" | "family";
  amountCents: number | null;
  orderRef: string;
  siteUrl: string;
};

export type EmailMessage = { subject: string; text: string; html: string };

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildOrderConfirmation(input: ConfirmationInput): EmailMessage {
  const plan = sfPlans.find((p) => p.key === input.plan);
  const planName = plan ? `Small Forever ${plan.name}` : "Small Forever";
  const amount = input.amountCents != null ? `€${(input.amountCents / 100).toFixed(2).replace(/\.00$/, "")}` : "";
  const isGift = input.orderType === "gift";
  const terms = sfLegalVersionUrl(input.siteUrl, "terms");
  const privacy = sfLegalVersionUrl(input.siteUrl, "privacy");
  const cancellation = sfLegalVersionUrl(input.siteUrl, "cancellation");

  const subject = isGift ? `Your ${planName} gift voucher order` : `Your ${planName} order is confirmed`;

  const nextSteps = isGift
    ? [
        "Within one working day we'll email you a printable gift voucher.",
        `The voucher is valid for ${sfVoucherYears} years. The family redeems it at ${input.siteUrl}/small-forever/redeem when they're ready.`,
      ]
    : [
        "Within one working day we'll email you a private link to upload your photos, videos and voice notes.",
        "Please don't reply to this email with photos.",
      ];

  const cancellationText = isGift
    ? "You can cancel this gift voucher for a full refund within 14 days of buying it, as long as it hasn't been redeemed."
    : "Small Forever is personalised and made to order from your own material, so the 14-day right to cancel doesn't apply, as you confirmed at checkout. Your rights if anything is faulty are not affected.";

  const lines = [
    `Thank you for your order.`,
    ``,
    `${planName}${amount ? `, ${amount}` : ""} (${isGift ? "gift voucher" : "for my family"})`,
    `Order reference: ${input.orderRef}`,
    ``,
    `What happens next`,
    ...nextSteps.map((s) => `- ${s}`),
    ``,
    `Cancellation`,
    cancellationText,
    `How to cancel and the model form: ${cancellation}`,
    ``,
    `The terms you accepted (version ${sfLegalVersions.terms}): ${terms}`,
    `Privacy Notice (version ${sfLegalVersions.privacy}): ${privacy}`,
    ``,
    `Questions? Reply to this email or write to ${sfBusiness.email}.`,
    ``,
    `${sfBusiness.tradingName} · ${sfBusiness.owner} · Business name no. ${sfBusiness.businessNameNumber}`,
    sfBusiness.address.join(", "),
  ];

  const p = (s: string) => `<p style="margin:0 0 12px">${s}</p>`;
  const a = (href: string, label: string) => `<a href="${esc(href)}" style="color:#7a2e2a">${esc(label)}</a>`;
  const html = `<!doctype html><html><body style="margin:0;background:#fbf7f2;font-family:Arial,sans-serif;color:#3b2a24;font-size:15px;line-height:1.6">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="letter-spacing:.3em;font-size:12px;margin:0 0 24px">SMALL FOREVER</p>
${p("Thank you for your order.")}
${p(`<strong>${esc(planName)}</strong>${amount ? `, ${esc(amount)}` : ""} (${isGift ? "gift voucher" : "for my family"})<br>Order reference: ${esc(input.orderRef)}`)}
<h2 style="font-size:17px;margin:24px 0 8px">What happens next</h2>
<ul style="margin:0 0 12px;padding-left:20px">${nextSteps.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
<h2 style="font-size:17px;margin:24px 0 8px">Cancellation</h2>
${p(esc(cancellationText))}
${p(`How to cancel, and the model form: ${a(cancellation, "Cancellation")}`)}
<h2 style="font-size:17px;margin:24px 0 8px">Your documents</h2>
${p(`${a(terms, `Terms of Sale (version ${sfLegalVersions.terms})`)} · ${a(privacy, `Privacy Notice (version ${sfLegalVersions.privacy})`)}`)}
${p(`Questions? Reply to this email or write to ${a(`mailto:${sfBusiness.email}`, sfBusiness.email)}.`)}
<p style="font-size:12px;color:#6f5a52;margin-top:32px">${esc(`${sfBusiness.tradingName} · ${sfBusiness.owner} · Business name no. ${sfBusiness.businessNameNumber}`)}<br>${esc(sfBusiness.address.join(", "))}</p>
</div></body></html>`;

  return { subject, text: lines.join("\n"), html };
}

export type SendResult = { sent: boolean; reason?: string };

/** Sends an email through the configured provider. Off until a provider is chosen. */
export async function sendEmail(to: string, message: EmailMessage): Promise<SendResult> {
  const provider = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (!provider) return { sent: false, reason: "email disabled (EMAIL_PROVIDER not set)" };
  void to;
  void message;
  // [TODO: add the adapter for the chosen provider here, e.g. "brevo" or "resend".]
  return { sent: false, reason: `no adapter for provider "${provider}"` };
}
