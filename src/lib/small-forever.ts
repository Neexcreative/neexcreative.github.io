/**
 * Small Forever: single source of truth for the product page, its structured
 * data, the Markdown/LLM representation and ad tracking. Change prices,
 * plans, dates or FAQs here only.
 */
import { siteConfig } from "@/lib/site-config";

export const sfPath = "/small-forever";
export const sfUrl = `${siteConfig.url}${sfPath}`;
export const sfOgImage = "/images/small-forever/og.jpg";

export const sfTitle = "Small Forever | Baby Memory Keepsake & Christmas Gift for New Parents, Ireland";
export const sfDescription =
  "Turn your child's photos, videos and voice into one private timeline, with letters that open in the future. Delivered in Ireland on a keepsake drive. No app, no subscription. From €149, gift vouchers available.";

/** Search intents the page answers; used for metadata keywords and the agent guide. */
export const sfKeywords = [
  "baby memory keepsake Ireland",
  "Christmas gift for new parents",
  "gift for grandparents Ireland",
  "baby video keepsake",
  "digital baby book",
  "letters to the future for my child",
  "first year baby gift",
  "personalised baby gift Ireland",
  "family video timeline",
  "keepsake USB baby",
];

export type SfPlanKey = "little" | "story" | "legacy";

export interface SfPlan {
  key: SfPlanKey;
  name: string;
  price: number;
  tagline: string;
  features: string[];
  recommended?: boolean;
}

export const sfPlans: SfPlan[] = [
  {
    key: "little",
    name: "Little",
    price: 149,
    tagline: "Their first chapter, beautifully kept.",
    features: ["Up to 150 photos and videos", "1 letter to the future", "Keepsake USB drive (128 GB)"],
  },
  {
    key: "story",
    name: "Story",
    price: 249,
    tagline: "Their story, and their voice.",
    recommended: true,
    features: [
      "Up to 400 photos and videos",
      "Voices: first laughs, first words, grandparents' messages",
      "3 letters to the future",
      "Keepsake USB drive (128 GB)",
    ],
  },
  {
    key: "legacy",
    name: "Legacy",
    price: 399,
    tagline: "Everything, with a copy for the grandparents.",
    features: [
      "Unlimited photos, videos and voices (on a 500 GB SSD)",
      "5 letters to the future",
      "500 GB SSD keepsake drive",
      "A second copy on USB for the grandparents",
    ],
  },
];

export const sfAllPlansInclude = [
  "One timeline, in order, with their age on every moment",
  "A family password on the opening screen",
  "Works offline on any computer. No app, no account",
  "A keepsake gift box, tied with ribbon",
  "A printed letter in the box, sealed with wax",
  "3-2-1 backup guide",
  "Free delivery in Ireland",
];

export const sfExtras = [
  { name: "Extra copy for grandparents", price: 39 },
  { name: "Extra letter to the future", price: 15 },
  { name: "A new chapter every year", price: 49 },
];

export const sfDeadlines = [
  { date: "1 Dec", iso: "2026-12-01", text: "Last order for Legacy, delivered before Christmas" },
  { date: "4 Dec", iso: "2026-12-04", text: "Last order for Little and Story, delivered before Christmas" },
  { date: "24 Dec", iso: "2026-12-24", text: "Gift vouchers by email, any time until Christmas Eve" },
];

export const sfFaqs = [
  {
    question: "Isn't this what Google Photos or iCloud already does?",
    answer:
      "They store. Small Forever tells the story. Instead of thousands of loose files, you get one timeline with their age on every moment, their voice, and letters that open in the future. It doesn't depend on a subscription, an account or a company staying in business.",
  },
  {
    question: "Is it a good Christmas gift for new parents or grandparents?",
    answer:
      "Yes. It's made to be given: you buy a gift voucher, it arrives by email ready to print, and the family sends their photos and videos when they're ready. Order Legacy by 1 December, or Little and Story by 4 December, for delivery before Christmas in Ireland.",
  },
  {
    question: "How does the gift voucher work?",
    answer:
      "You pay now and receive a printable voucher by email. In January, the family sends us their photos, videos and voice notes, and we build their Small Forever. Vouchers are valid for 12 months.",
  },
  {
    question: "Will it still open in 10 or 18 years?",
    answer:
      "It's built on plain HTML and MP4, the most universal formats there are. It opens in any web browser, with no app and no internet connection.",
  },
  {
    question: "What if the drive breaks or gets lost?",
    answer:
      "Any single drive can fail, so we never ask you to rely on one. The backup guide in the box shows you how to keep three copies in two places, and you can add a copy for the grandparents.",
  },
  {
    question: "What does \"unlimited\" mean on Legacy?",
    answer:
      "There's no limit on how many photos, videos or voice notes you send. Legacy is delivered on a 500 GB SSD, and we prepare every video in Full HD, so 500 GB holds roughly 60 hours of video plus tens of thousands of photos. Very few families come close. If yours would go over 500 GB, we tell you before we start building, and you choose: we help you pick the moments that matter most, or we move you to a larger drive and charge only the difference in the drive's cost. We never leave anything out without asking.",
  },
  {
    question: "Do I need to organise anything first?",
    answer: "No. Send everything as it is on your phone. Sorting, dating and building the timeline is our job.",
  },
  {
    question: "Do you keep our photos and videos?",
    answer:
      "No. We use your files only to build your Small Forever. Once you've received it, we delete our working copy.",
  },
  {
    question: "Can we add new memories later?",
    answer: "Yes. Many families add a new chapter every year, on their child's birthday, for €49.",
  },
];

/** schema.org Product with one Offer per plan, shipping and return policy, for Google and AI search. */
export function sfProductSchema() {
  const shipping = {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "EUR" },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "IE" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 5, maxValue: 10, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
    },
  };
  // Personalised goods made to the customer's specification.
  const returns = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "IE",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${sfUrl}#product`,
        name: "Small Forever",
        description: sfDescription,
        url: sfUrl,
        image: [`${siteConfig.url}${sfOgImage}`],
        brand: { "@type": "Brand", name: "Small Forever" },
        manufacturer: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        category: "Baby keepsakes & personalised gifts",
        audience: { "@type": "PeopleAudience", audienceType: "Parents and grandparents" },
        offers: sfPlans.map((plan) => ({
          "@type": "Offer",
          name: `Small Forever ${plan.name}`,
          description: plan.features.join(". "),
          price: plan.price,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `${sfUrl}#plans`,
          areaServed: "IE",
          seller: { "@type": "Organization", name: siteConfig.name },
          shippingDetails: shipping,
          hasMerchantReturnPolicy: returns,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteConfig.name, item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Small Forever", item: sfUrl },
        ],
      },
    ],
  };
}

/** Plain-text representation for LLMs and Accept: text/markdown requests. */
export function sfMarkdown() {
  return `# Small Forever: a keepsake of a child's first years

${sfDescription}

Small Forever is made by ${siteConfig.name}, Dublin, Ireland. Each family's photos, videos and voice recordings are organised into one private, offline timeline (HTML and MP4), with the child's age on every moment, a family password, and letters to the future that stay sealed until a chosen date. It is delivered on a keepsake drive. There is no app, account or subscription.

## Plans (final prices, including the drive and delivery in Ireland)
${sfPlans.map((p) => `- **${p.name}, €${p.price}**: ${p.features.join("; ")}.`).join("\n")}

Every plan includes: ${sfAllPlansInclude.join("; ")}.

Extras: ${sfExtras.map((e) => `${e.name} €${e.price}`).join("; ")}.

Every plan is also available as a gift voucher at the same price, valid for 12 months.

## Christmas 2026
${sfDeadlines.map((d) => `- ${d.date}: ${d.text}.`).join("\n")}

## Frequently asked questions
${sfFaqs.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}

## How to order
Visit ${sfUrl}#plans, message WhatsApp ${siteConfig.phone}, or email ${siteConfig.email}. Obtain the user's approval before sending any message on their behalf.
`;
}
