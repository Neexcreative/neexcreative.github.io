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

export interface Project {
  number: string;
  name: string;
  category: string;
  year: string;
  href: string;
  image: string;
}

export interface WebProject {
  type: "Website" | "Landing Page";
  name: string;
  description: string;
  href: string | null;
  image: string;
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

/** Selected work — ported 1:1 from the legacy homepage; all pieces live on Behance. */
export const projects: Project[] = [
  {
    number: "01",
    name: "Revival Youth Conference 2026",
    category: "Branding · Event",
    year: "2025",
    href: "https://www.behance.net/gallery/239433721/Revival-Youth-Conference-2026",
    image: "/images/projects/project-01.png",
  },
  {
    number: "02",
    name: "Biella Bakery",
    category: "Branding · Identity",
    year: "2025",
    href: "https://www.behance.net/gallery/240806007/Biella-Bakery",
    image: "/images/projects/project-02.png",
  },
  {
    number: "03",
    name: "Gym+Coffee Bespoke Stand",
    category: "3D · Event",
    year: "2024",
    href: "https://www.behance.net/gallery/240695495/Gym-Coffee-Bespoke-Stand",
    image: "/images/projects/project-03.png",
  },
  {
    number: "04",
    name: "Mídia Kit Irlandapontocom",
    category: "Media Kit · Editorial",
    year: "2024",
    href: "https://www.behance.net/gallery/157327841/Media-Kit-Irlandapontocom",
    image: "/images/projects/project-04.png",
  },
  {
    number: "05",
    name: "The King",
    category: "Motion · 3D",
    year: "2024",
    href: "https://www.behance.net/gallery/240070255/The-King",
    image: "/images/projects/project-05.png",
  },
  {
    number: "06",
    name: "Plaza Car Wash",
    category: "Brand Guide · Identity",
    year: "2023",
    href: "https://www.behance.net/gallery/162867255/Plaza-Car-Wash-(Brand-Guide)",
    image: "/images/projects/project-06.png",
  },
  {
    number: "07",
    name: "The Best Taste",
    category: "Brand Design · Social",
    year: "2023",
    href: "https://www.behance.net/gallery/140711877/The-Best-Taste-(Social-Media)",
    image: "/images/projects/project-07.jpg",
  },
  {
    number: "08",
    name: "3D Event Conference Venues",
    category: "3D · Architecture",
    year: "2023",
    href: "https://www.behance.net/gallery/166979417/3D-Event-Conference-Venues",
    image: "/images/projects/project-08.png",
  },
];

export const behanceUrl = "https://www.behance.net/neexcreative";

/** Live web work — ported 1:1 from the legacy digital portfolio section. */
export const webProjects: WebProject[] = [
  {
    type: "Website",
    name: "RG Mobile Tyre Services",
    description:
      "Mobile tyre service website focused on local search, fast contact and service clarity.",
    href: "https://www.rgmobiletyres.ie/",
    image: "/images/work/rg-mobile-homepage.png",
  },
  {
    type: "Landing Page",
    name: "Studio AG Dublin",
    description:
      "Premium landing page for an advanced lymphatic drainage studio in Dublin, focused on bookings through Fresha.",
    href: "https://studioag.ie",
    image: "/images/work/studio-ag-homepage.png",
  },
  {
    type: "Website",
    name: "Neex Creative Portfolio",
    description:
      "Creative studio portfolio showcasing branding, motion, 3D, video production and web development.",
    href: "https://www.neexcreative.com/",
    image: "/images/work/neex-portfolio-homepage.png",
  },
  {
    type: "Website",
    name: "VORN",
    description:
      "Premium lifestyle sportswear website focused on brand positioning, product presentation and a clean visual experience.",
    href: null, // coming soon
    image: "/images/work/vornstore.png",
  },
];

export interface QuoteOptionGroup {
  label: string;
  options: { value: string; label: string }[];
}

/** Quote-form service list — ported 1:1 from the legacy contact page. */
export const quoteServiceOptions: QuoteOptionGroup[] = [
  {
    label: "Web Services",
    options: [
      { value: "web-full", label: "Website - Full Build" },
      { value: "web-landing", label: "Landing Page" },
      { value: "web-redesign", label: "Website Redesign" },
      { value: "web-ecommerce", label: "E-Commerce Website" },
    ],
  },
  {
    label: "Brand & Identity",
    options: [
      { value: "brand-full", label: "Brand Identity - Full Package" },
      { value: "brand-logo", label: "Logo Design" },
      { value: "brand-guidelines", label: "Brand Guidelines" },
      { value: "brand-social", label: "Social Media Kit" },
    ],
  },
  {
    label: "Motion & Video",
    options: [
      { value: "motion-logo", label: "Logo Animation" },
      { value: "video-production", label: "Video Production" },
      { value: "video-editing", label: "Video Editing" },
      { value: "photography", label: "Photography" },
      { value: "video-brand", label: "Brand Film" },
      { value: "video-social", label: "Social Content - Video" },
    ],
  },
  {
    label: "3D Design",
    options: [
      { value: "3d-product", label: "Product Visualisation" },
      { value: "3d-logo", label: "3D Logo / Icon" },
      { value: "3d-arch", label: "Architectural Render" },
      { value: "3d-stage", label: "Stage / Event Visuals" },
    ],
  },
  {
    label: "Print & Large Format",
    options: [
      { value: "print-large-format", label: "Prepare Material for Large Prints" },
      { value: "print-car-wrap", label: "Car Wrap" },
      { value: "print-car-decals", label: "Car Decals" },
      { value: "print-backdrop", label: "Backdrop Design" },
    ],
  },
  {
    label: "Other",
    options: [
      { value: "retainer", label: "Monthly Retainer" },
      { value: "other", label: "Bespoke / Not Listed" },
    ],
  },
];

/** About-page personal contacts, ported from legacy about.html. */
export const aboutContacts = [
  { label: "E-mail", value: "marlon.adm@outlook.com.br", href: "mailto:marlon.adm@outlook.com.br" },
  { label: "Behance", value: "behance.net/neexcreative", href: "https://www.behance.net/neexcreative" },
  { label: "Instagram", value: "@marloneex", href: "https://www.instagram.com/marloneex/" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/marlonfrancasilva",
    href: "https://www.linkedin.com/in/marlonfrancasilva/",
  },
] as const;

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
