/**
 * Small Forever legal facts and document versions, in one place.
 * SOLICITOR REVIEW REQUIRED: every legal page that reads this file is a draft.
 *
 * When a legal text changes in substance, bump its version and keep the old
 * text in git history: the version is stored with every order in Stripe, so we
 * can always show which text a customer accepted.
 */

export const sfBusiness = {
  tradingName: "Neex Creative",
  owner: "Marlon Franca Silva",
  /** Registered under the Registration of Business Names Act 1963 (CRO). */
  businessNameNumber: "729770",
  address: ["64 Galtymore Road", "Drimnagh, Dublin 12", "D12 TN84, Ireland"],
  email: "info@neexcreative.com",
};

export const sfLegalVersions = {
  terms: "2026-11-v1",
  privacy: "2026-11-v1",
  cancellation: "2026-11-v1",
};

/** Human date shown as "Last updated" on each page. */
export const sfLegalUpdated = "11 November 2026";

/** Working copies of customers' files are deleted this many days after delivery is confirmed. */
export const sfDeletionDays = 30;

/** Irish gift voucher law: an expiry date must be at least five years from purchase. */
export const sfVoucherYears = 5;

/** Permanent link to the exact version of a legal page (what a customer accepted). */
export function sfLegalVersionUrl(base: string, doc: keyof typeof sfLegalVersions) {
  return `${base.replace(/\/+$/, "")}/small-forever/${doc}/${sfLegalVersions[doc]}`;
}

export const sfLegalPaths = {
  terms: "/small-forever/terms",
  privacy: "/small-forever/privacy",
  cancellation: "/small-forever/cancellation",
};
