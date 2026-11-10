import { sendAdsConversion, sendAnalyticsEvent } from "@/lib/gtag";
import { trackMeta } from "@/lib/meta-pixel";
import { googleAdsConversions, quoteServiceOptions } from "@/lib/site-config";
import { sfPlans } from "@/lib/small-forever";

/*
 * Business events (client-side only). Every parameter is a fixed,
 * non-personal value: never pass names, emails, phone numbers, message text,
 * locations or booking identifiers to Analytics or Ads.
 *
 * | Action                          | GA4 event                                  | Google Ads             |
 * | ------------------------------- | ------------------------------------------ | ---------------------- |
 * | Form endpoint accepted enquiry  | generate_lead {lead_source: quote_form}    | quoteFormLead          |
 * | Calendly booking confirmed      | generate_lead {lead_source: calendly_booking} | calendlyBooking     |
 * | WhatsApp link clicked           | contact {method: whatsapp}                 | whatsappClick          |
 * | Form opened an email draft      | contact {method: email_draft}              | never (not confirmed)  |
 * | Small Forever plans in view     | view_item_list (once per page)             | never (Meta ViewContent) |
 * | Small Forever plan button       | select_item {item_*, purchase_mode}        | never                  |
 * | Confirmed, Stripe opening       | begin_checkout {value, item_*, ref_code}   | smallForeverCheckout (Meta InitiateCheckout) |
 * | Small Forever paid (thank-you)  | purchase {transaction_id, value, items}    | smallForeverPurchase (Meta Purchase) |
 * | WhatsApp link clicked           | (above)                                    | (above) + Meta Contact |
 *
 * Meta Pixel events only fire after Advertising consent (window.fbq exists).
 */

const knownServices = new Set<string>(
  quoteServiceOptions.flatMap((group) => group.options.map((option) => option.value)),
);

function transactionId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Confirmed lead: the form endpoint accepted the enquiry. Call once per accepted submission. */
export function trackQuoteFormLead(service: string) {
  sendAnalyticsEvent("generate_lead", {
    lead_source: "quote_form",
    service: knownServices.has(service) ? service : "unknown",
  });
  sendAdsConversion(googleAdsConversions.quoteFormLead, transactionId());
}

const bookedEvents = new Set<string>();

/**
 * Confirmed lead: Calendly reported a scheduled event. `bookingKey` is used
 * only to drop repeated callbacks for the same booking; it is never sent.
 */
export function trackCalendlyBooking(bookingKey: string) {
  if (bookedEvents.has(bookingKey)) return;
  bookedEvents.add(bookingKey);
  sendAnalyticsEvent("generate_lead", { lead_source: "calendly_booking" });
  sendAdsConversion(googleAdsConversions.calendlyBooking, transactionId());
}

/** Contact interaction, not a confirmed enquiry. */
export function trackContact(method: "whatsapp" | "email_draft") {
  sendAnalyticsEvent("contact", { method });
  if (method === "whatsapp") {
    sendAdsConversion(googleAdsConversions.whatsappClick, transactionId());
    trackMeta("Contact", { method: "whatsapp" });
  }
}

function sfItem(planKey: string) {
  const plan = sfPlans.find((p) => p.key === planKey);
  return plan
    ? { plan, item: { item_id: `small-forever-${plan.key}`, item_name: `Small Forever ${plan.name}`, price: plan.price, quantity: 1 } }
    : null;
}

let plansViewed = false;

/** The plans section scrolled into view. Sent at most once per page load. */
export function trackSmallForeverPlansView() {
  if (plansViewed) return;
  const sent = sendAnalyticsEvent("view_item_list", {
    item_list_id: "small_forever_plans",
    item_list_name: "Small Forever plans",
    items: sfPlans.map((p) => ({ item_id: `small-forever-${p.key}`, item_name: `Small Forever ${p.name}`, price: p.price })),
  });
  const metaSent = trackMeta("ViewContent", { content_category: "small_forever_plans", content_type: "product" });
  plansViewed = sent || metaSent;
}

/** A plan button was pressed (the confirmation dialog opens). Not a checkout yet. */
export function trackSmallForeverSelect(planKey: string, mode: string) {
  const found = sfItem(planKey);
  if (!found) return;
  sendAnalyticsEvent("select_item", {
    item_list_id: "small_forever_plans",
    purchase_mode: mode === "gift" ? "gift" : "family",
    items: [found.item],
  });
}

/**
 * Both confirmations ticked and Stripe Checkout is opening. `refCode` is the
 * optional influencer/referral code (a campaign code, never personal data).
 */
export function trackSmallForeverCheckout(planKey: string, mode: string, refCode?: string) {
  const found = sfItem(planKey);
  if (!found) return;
  const { plan, item } = found;
  sendAnalyticsEvent("begin_checkout", {
    currency: "EUR",
    value: plan.price,
    item_id: item.item_id,
    item_name: item.item_name,
    purchase_mode: mode === "gift" ? "gift" : "family",
    ...(refCode ? { ref_code: refCode } : {}),
    items: [item],
  });
  sendAdsConversion(googleAdsConversions.smallForeverCheckout, transactionId(), plan.price);
  trackMeta("InitiateCheckout", {
    currency: "EUR",
    value: plan.price,
    content_ids: [item.item_id],
    content_type: "product",
    num_items: 1,
  });
}

/**
 * Small Forever payment confirmed by Stripe (thank-you page, payment_status = paid).
 * `orderRef` is an opaque reference derived from the Checkout Session, used only
 * so GA4 and Ads count each order once. Returns false until analytics is ready.
 */
export function trackSmallForeverPurchase(orderRef: string, planKey: string, mode: string) {
  const plan = sfPlans.find((p) => p.key === planKey);
  if (!plan) return true;
  const sent = sendAnalyticsEvent("purchase", {
    transaction_id: orderRef,
    currency: "EUR",
    value: plan.price,
    purchase_mode: mode === "gift" ? "gift" : "family",
    items: [{ item_id: `small-forever-${plan.key}`, item_name: `Small Forever ${plan.name}`, price: plan.price, quantity: 1 }],
  });
  sendAdsConversion(googleAdsConversions.smallForeverPurchase, orderRef, plan.price);
  // eventID lets Meta drop duplicates if a server-side event is added later.
  const metaSent = trackMeta(
    "Purchase",
    { currency: "EUR", value: plan.price, content_ids: [`small-forever-${plan.key}`], content_type: "product", num_items: 1 },
    orderRef,
  );
  return sent || metaSent;
}

/** Delegated click tracking for WhatsApp links and Small Forever plan buttons. Returns a cleanup. */
export function installContactClickTracking() {
  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    const plan = target?.closest<HTMLElement>("[data-sf-plan]");
    if (plan) trackSmallForeverSelect(plan.dataset.sfPlan ?? "", plan.dataset.sfMode ?? "");
    if (target?.closest('a[href^="https://wa.me/"]')) trackContact("whatsapp");
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
