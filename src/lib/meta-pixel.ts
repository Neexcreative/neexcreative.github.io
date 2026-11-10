/**
 * Meta (Facebook/Instagram) Pixel helpers, client-side only.
 *
 * The Pixel is loaded by <MetaPixel /> only after the visitor accepts the
 * Advertising category, and only when NEXT_PUBLIC_META_PIXEL_ID is set.
 * Until then `window.fbq` does not exist and every call here is a no-op.
 *
 * Never send personal data, child data or free text: no names, emails,
 * phone numbers, addresses, messages or advanced matching.
 */

type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || null;

/** Standard Meta event, e.g. "ViewContent", "InitiateCheckout", "Purchase", "Contact". */
export function trackMeta(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return false;
  window.fbq("track", event, params ?? {}, eventId ? { eventID: eventId } : undefined);
  return true;
}
