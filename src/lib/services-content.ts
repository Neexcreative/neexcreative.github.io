/**
 * Long-form content for the service pages. Copy is the product here:
 * human-first, ≥300 words per page, local SEO woven in naturally.
 * Blog slugs are fixed ahead of Etapa 5 so internal links stay stable.
 */

export interface RelatedLink {
  label: string;
  href: string;
}

export interface Deliverable {
  title: string;
  description: string;
}

export interface ServiceContent {
  slug: string;
  /** Route the page lives at (web design keeps its legacy indexed path). */
  path: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  intro: string[];
  deliverablesTitle: string;
  deliverables: Deliverable[];
  systemNote: string;
  related: RelatedLink[];
}

export const blogSlugs = {
  firstImpression: "/blog/first-impression-enquiries",
  brandSystemVsLogo: "/blog/brand-system-vs-logo",
  sixSecondRule: "/blog/six-second-rule-video",
  websiteSalesSystem: "/blog/website-sales-system",
} as const;

export const servicesContent: ServiceContent[] = [
  {
    slug: "brand-strategy-design",
    path: "/services/brand-strategy-design",
    metaTitle: "Brand Strategy & Design",
    metaDescription:
      "Brand strategy, visual identity and brand direction for businesses in Dublin and across Ireland. Logos, guidelines and printed materials built as one system.",
    kicker: "Brand Strategy & Design",
    h1: "Brand strategy and design that gives your business a system, not just a logo.",
    intro: [
      "Most businesses don't have a branding problem, they have a consistency problem. When the logo, website and feed all say different things, trust leaks away.",
      "As a branding agency in Ireland, we start with strategy, then design an identity that holds together on screen, in print and on the street.",
    ],
    deliverablesTitle: "What we build",
    deliverables: [
      {
        title: "Brand strategy & direction",
        description:
          "Positioning, audience and message.",
      },
      {
        title: "Logo & visual identity",
        description:
          "Logo, colour, type and graphic language.",
      },
      {
        title: "Brand guidelines",
        description:
          "A practical rulebook anyone can follow.",
      },
      {
        title: "Printed materials",
        description:
          "Cards, stationery and collateral.",
      },
    ],
    systemNote:
      "Brand is the first stage of the system. The identity we design here sets the visual language your website earns trust with, your video content moves in, and your marketing distributes. One system, from the first impression to the conversion.",
    related: [
      { label: "Brand system vs. logo: what actually drives growth", href: blogSlugs.brandSystemVsLogo },
      {
        label: "Why Irish businesses lose enquiries at the first impression",
        href: blogSlugs.firstImpression,
      },
    ],
  },
  {
    slug: "web-design",
    path: "/web-design",
    metaTitle: "Web Design Dublin | Custom Websites",
    metaDescription:
      "Custom-built websites for businesses in Dublin and Wicklow. Neex Creative designs professional websites that get found on Google and convert visitors into real enquiries.",
    kicker: "Websites & Landing Pages",
    h1: "Professional websites for Dublin businesses.",
    intro: [
      "Before anyone rings you, they check your website. Web design in Dublin is full of templates that look fine and convert nobody.",
      "Every site we build is custom, fast and built for search, with one job: turning the right visitors into real enquiries.",
    ],
    deliverablesTitle: "What we build",
    deliverables: [
      {
        title: "Custom websites",
        description:
          "Multi-page sites built to bring enquiries.",
      },
      {
        title: "Landing pages",
        description:
          "One message, one action, for campaigns.",
      },
      {
        title: "Website redesigns",
        description:
          "Rebuilt stronger, without losing rankings.",
      },
      {
        title: "E-commerce",
        description:
          "Stores that sell, with a simple checkout.",
      },
    ],
    systemNote:
      "The website is where the whole system converts. The brand gives it a face, the content gives it proof, and the marketing drives the traffic, the site's job is to turn that attention into enquiries.",
    related: [
      { label: "Your website is a sales system, not a brochure", href: blogSlugs.websiteSalesSystem },
      {
        label: "Why Irish businesses lose enquiries at the first impression",
        href: blogSlugs.firstImpression,
      },
      { label: "Web design in Wicklow, from Blessington to Wicklow Town", href: "/web-design-blessington" },
    ],
  },
  {
    slug: "photo-video-production",
    path: "/services/photo-video-production",
    metaTitle: "Photo & Video Production Dublin",
    metaDescription:
      "Video production in Dublin, reels, business videos, campaign content and brand storytelling. Filmed, edited and paced to hold attention and convert.",
    kicker: "Photo & Video Production",
    h1: "Video production in Dublin that earns attention, and keeps it.",
    intro: [
      "Nothing builds trust faster than seeing a business for real. One shoot in Dublin, or wherever the work is, gives you a homepage film, social reels and a photo library for months.",
      "We plan, film and edit end to end, and cut each piece for where it lives: the feed, the homepage or the campaign.",
    ],
    deliverablesTitle: "What we produce",
    deliverables: [
      {
        title: "Brand films & business videos",
        description:
          "Your story, for the homepage and pitches.",
      },
      {
        title: "Reels & social video",
        description:
          "Short cuts made to stop the scroll.",
      },
      {
        title: "Campaign content",
        description:
          "Video and photo for a launch or event.",
      },
      {
        title: "Photography",
        description:
          "Your team, place and products, not stock.",
      },
    ],
    systemNote:
      "Content is the proof layer of the system. The brand sets the look, the website makes the promise, photo and video are what make people believe it, then the marketing puts it in front of them.",
    related: [
      { label: "The 6-second rule: video content that converts on social", href: blogSlugs.sixSecondRule },
      { label: "Brand system vs. logo: what actually drives growth", href: blogSlugs.brandSystemVsLogo },
    ],
  },
  {
    slug: "marketing-content",
    path: "/services/marketing-content",
    metaTitle: "Marketing Content & Social Media Design Dublin",
    metaDescription:
      "Social assets, campaign visuals, ads and promotional materials for Dublin businesses, marketing content designed on-brand and built to convert.",
    kicker: "Marketing Content",
    h1: "Marketing content that keeps the system working week after week.",
    intro: [
      "A launch gets attention once. What grows a business is what happens every week after: the posts, the ads, the promotions.",
      "We design it all from your brand system, so every piece builds recognition, as a monthly retainer or a one-off campaign.",
    ],
    deliverablesTitle: "What we create",
    deliverables: [
      {
        title: "Social media assets",
        description:
          "Posts, stories and feed visuals on-brand.",
      },
      {
        title: "Campaign visuals",
        description:
          "One idea across every channel.",
      },
      {
        title: "Ad creative",
        description:
          "Static and motion ads for Meta and Google.",
      },
      {
        title: "Promotional materials",
        description:
          "Offers, events and promos, digital or print.",
      },
    ],
    systemNote:
      "Marketing is the distribution stage of the system. It takes the brand, the site and the content, and puts them in front of the people who haven't met you yet, consistently enough to be remembered.",
    related: [
      { label: "The 6-second rule: video content that converts on social", href: blogSlugs.sixSecondRule },
      {
        label: "Why Irish businesses lose enquiries at the first impression",
        href: blogSlugs.firstImpression,
      },
    ],
  },
  {
    slug: "print-multimedia-design",
    path: "/services/print-multimedia-design",
    metaTitle: "Print & Multimedia Design Dublin",
    metaDescription:
      "Print design in Dublin, business cards, flyers, signage, menus, banners and print-ready artwork that carry your brand into the physical world.",
    kicker: "Print & Multimedia Design",
    h1: "Print and multimedia design that carries your brand into the real world.",
    intro: [
      "Print puts your brand in someone's hand, on their wall and on the side of a van. For Dublin businesses it is often the first impression.",
      "We design it as part of the same brand system and hand over files that are genuinely print-ready, from business cards to backdrops.",
    ],
    deliverablesTitle: "What we design",
    deliverables: [
      {
        title: "Business cards & stationery",
        description: "The classics, done properly.",
      },
      {
        title: "Flyers, menus & brochures",
        description:
          "Clear layouts that still look like you.",
      },
      {
        title: "Signage & banners",
        description:
          "Made to read at distance and at scale.",
      },
      {
        title: "Vehicle wraps & large format",
        description:
          "Wraps, decals and stage visuals.",
      },
    ],
    systemNote:
      "Print is where the system becomes physical. It closes the loop: the same identity that lives on your website and your social feed meets your customers on the street, in the shop and at the event.",
    related: [
      { label: "Brand system vs. logo: what actually drives growth", href: blogSlugs.brandSystemVsLogo },
      { label: "Your website is a sales system, not a brochure", href: blogSlugs.websiteSalesSystem },
    ],
  },
];

export function getServiceContent(slug: string): ServiceContent | undefined {
  return servicesContent.find((service) => service.slug === slug);
}
