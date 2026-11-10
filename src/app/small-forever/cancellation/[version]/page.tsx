import type { Metadata } from "next";
import { sfLegalVersions } from "@/lib/sf-legal";
import CancellationPage from "../page";

/**
 * Permanent URL for one version of the cancellation page, e.g. /small-forever/cancellation/2026-11-v1.
 * Order emails link here so a customer can always see the exact text they accepted.
 * When a new version is published, keep the old text as its own component and
 * add its version to generateStaticParams.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ version: sfLegalVersions.cancellation }];
}
export const metadata: Metadata = {
  title: { absolute: `Cancellation ${sfLegalVersions.cancellation} · Small Forever` },
  alternates: { canonical: "/small-forever/cancellation" },
  robots: { index: false, follow: true },
};
export default CancellationPage;
