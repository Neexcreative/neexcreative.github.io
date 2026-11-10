/**
 * Small Forever testimonials. EMPTY ON PURPOSE.
 *
 * Add an entry only when it is real and authorised: a customer's own words,
 * with a signed image/text release (Docs/legal-interno/image-release-form.md).
 * `releaseRef` must point to that signed release; entries without one are
 * never shown. No invented quotes, no invented names, no counts or ratings.
 */
export type SfTestimonial = {
  /** The customer's own words, unedited apart from trimming. */
  quote: string;
  /** As the customer agreed to be named, e.g. "Aoife, mum of two". */
  attribution: string;
  /** Reference of the signed release, e.g. "release-2027-01-aoife". Required. */
  releaseRef: string;
};

export const sfTestimonials: SfTestimonial[] = [];
