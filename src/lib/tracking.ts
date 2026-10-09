import { sendAdsConversion, sendAnalyticsEvent } from "@/lib/gtag";
import { googleAdsConversions, quoteServiceOptions } from "@/lib/site-config";

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
  if (method === "whatsapp") sendAdsConversion(googleAdsConversions.whatsappClick, transactionId());
}

/** Delegated click tracking for every WhatsApp link on the site. Returns a cleanup. */
export function installContactClickTracking() {
  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('a[href^="https://wa.me/"]')) trackContact("whatsapp");
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
