import type { Metadata } from "next";
import { sfLegalVersions } from "@/lib/sf-legal";
import TermsPage from "../page";

/**
 * Permanent URL for one version of the Terms, e.g. /small-forever/terms/2026-11-v1.
 * Order emails link here so a customer can always see the exact text they accepted.
 * When a new version is published, keep the old text as its own component and
 * add its version to generateStaticParams.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ version: sfLegalVersions.terms }];
}
export const metadata: Metadata = {
  title: { absolute: `Terms of Sale ${sfLegalVersions.terms} · Small Forever` },
  alternates: { canonical: "/small-forever/terms" },
  robots: { index: false, follow: true },
};
export default TermsPage;
