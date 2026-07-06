/**
 * Single source of truth for site-wide data: navigation, services,
 * contact details, social profiles and SEO defaults.
 * Every component and route should read from here — never hardcode.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  /** URL segment under /services (web design keeps its legacy indexed path). */
  slug: string;
  title: string;
  /** Short label used in tickers, footers and cards. */
  shortLabel: string;
  description: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "Neex Creative",
  legalName: "Neex Creative — Dublin, Ireland",
  url: "https://www.neexcreative.com",
  tagline: "One system. From the first impression to the conversion.",
  description:
    "Neex Creative is a Dublin creative agency building integrated brand systems — strategy, websites, video, marketing content and print that work as one growth engine.",
  locale: "en_IE",
  email: "info@neexcreative.com",
  phone: "+353 83 306 3221",
  whatsapp: "https://wa.me/353833063221",
  address: {
    street: "64 Galtymore Road, Drimnagh",
    city: "Dublin",
    postalCode: "D12 TN84",
    region: "Dublin 12",
    country: "Ireland",
    countryCode: "IE",
  },
  availability: "Mon–Fri 9:00 AM–6:00 PM · Saturday by appointment",
  calendlyUrl: "https://calendly.com/neexcreative/30min",
  resumeUrl: "/docs/Resume-MarlonFranca2026.pdf",
  ogImage: "/og-image.png",
  googleAdsId: "AW-18147073778",
  /** Google Ads page-view conversion label fired on the homepage. */
  googleAdsConversion: "AW-18147073778/shK2CITiv6ocEPK9mc1D",
} as const;

export const navLinks: NavLink[] = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/services" },
  { label: "Web Design", href: "/web-design" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/**
 * The five services, framed as one integrated system:
 * strategy → design → content → distribution.
 */
export const services: Service[] = [
  {
    slug: "brand-strategy-design",
    title: "Brand Strategy & Design",
    shortLabel: "Brand & Identity",
    description:
      "Logos, visual identity, brand direction and printed materials — the foundation every other channel builds on.",
    href: "/services/brand-strategy-design",
  },
  {
    slug: "web-design",
    title: "Websites & Landing Pages",
    shortLabel: "Web & Conversion",
    description:
      "Modern sites built to earn trust and generate enquiries — designed for performance, clarity and lasting brand presence.",
    href: "/web-design",
  },
  {
    slug: "photo-video-production",
    title: "Photo & Video Production",
    shortLabel: "Film & Content",
    description:
      "Reels, business videos, campaign content and brand storytelling — filmed, edited and paced to hold attention.",
    href: "/services/photo-video-production",
  },
  {
    slug: "marketing-content",
    title: "Marketing Content",
    shortLabel: "Campaigns & Social",
    description:
      "Social assets, campaign visuals, ads and promotional materials that keep the system working week after week.",
    href: "/services/marketing-content",
  },
  {
    slug: "print-multimedia-design",
    title: "Print & Multimedia Design",
    shortLabel: "Print & Large Format",
    description:
      "Business cards, flyers, signage, menus, banners and print-ready artwork — the brand, carried into the physical world.",
    href: "/services/print-multimedia-design",
  },
];

export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/neexcreative/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/neexcreative/" },
  { label: "Behance", href: "https://www.behance.net/neexcreative" },
  { label: "YouTube", href: "https://www.youtube.com/@marloneex" },
];

/** Ticker items carried over from the legacy homepage marquee. */
export const tickerItems: string[] = [
  "Graphic Design",
  "Motion Design",
  "Video Production",
  "3D Design",
  "Brand Identity",
  "Web Design",
  "Stage Visuals",
  "Social Content",
];
