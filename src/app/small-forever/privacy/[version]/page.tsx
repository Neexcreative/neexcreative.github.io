import type { Metadata } from "next";
import { sfLegalVersions } from "@/lib/sf-legal";
import SmallForeverPrivacyPage from "../page";

/**
 * Permanent URL for one version of the Privacy Notice, e.g. /small-forever/privacy/2026-11-v1.
 * Order emails link here so a customer can always see the exact text they accepted.
 * When a new version is published, keep the old text as its own component and
 * add its version to generateStaticParams.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ version: sfLegalVersions.privacy }];
}
export const metadata: Metadata = {
  title: { absolute: `Privacy Notice ${sfLegalVersions.privacy} · Small Forever` },
  alternates: { canonical: "/small-forever/privacy" },
  robots: { index: false, follow: true },
};
export default SmallForeverPrivacyPage;
