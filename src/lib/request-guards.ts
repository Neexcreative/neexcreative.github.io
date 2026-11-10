/** Shared server-side request checks for API routes. */
import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/stripe-server";

/** Blocks cross-site posts. Same-origin requests and requests without an Origin header (some form posts) pass. */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const allowed = new Set([new URL(siteUrl()).host, new URL(request.url).host]);
    return allowed.has(new URL(origin).host);
  } catch {
    return false;
  }
}

/** JSON error with no caching and no internal detail. */
export function jsonError(status: number, error: string, headers: Record<string, string> = {}) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/** Reads a JSON body of at most `maxBytes`; returns null if it is too big or not JSON. */
export async function readJson(request: Request, maxBytes = 4096): Promise<unknown | null> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > maxBytes) return null;
  const text = await request.text().catch(() => "");
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
