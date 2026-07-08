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
      "Most businesses don't have a branding problem — they have a consistency problem. The logo says one thing, the website says another, the social feed says a third. Customers notice, even when they can't name it, and trust leaks away at every mismatch.",
      "As a branding agency in Ireland working with businesses of every size, we start with strategy before we touch a single pixel: who you serve, what you stand for, and what the brand has to do commercially. Only then do we design — a visual identity built to hold together across your website, your social content, your signage and your print materials.",
      "The result is a brand direction your whole business can execute. Not a logo file in a folder, but a working system: colours, type, voice and rules that make every future decision faster and every touchpoint recognisably yours.",
      "Most identity projects run two to four weeks, depending on scope. You get working files, a practical guidelines document, and everything prepared for both screen and print — plus a partner who already knows the system when you need the next piece.",
    ],
    deliverablesTitle: "What we build",
    deliverables: [
      {
        title: "Brand strategy & direction",
        description:
          "Positioning, audience and message — the commercial thinking that every design decision hangs off.",
      },
      {
        title: "Logo & visual identity",
        description:
          "Logo suite, colour system, typography and graphic language, designed to work from a favicon to a shopfront.",
      },
      {
        title: "Brand guidelines",
        description:
          "A practical rulebook so anyone — your team or ours — can apply the brand consistently.",
      },
      {
        title: "Printed materials",
        description:
          "Business cards, stationery and collateral that carry the identity into the physical world.",
      },
    ],
    systemNote:
      "Brand is the first stage of the system. The identity we design here sets the visual language your website earns trust with, your video content moves in, and your marketing distributes — one system, from the first impression to the conversion.",
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
      "Custom-built websites for Dublin businesses. Neex Creative designs professional websites that get found on Google and convert visitors into real enquiries.",
    kicker: "Websites & Landing Pages",
    h1: "Professional websites for Dublin businesses.",
    intro: [
      "Your website is where trust is won or lost. Before anyone rings you, they check the site — and in those first seconds they decide whether you look like the professional option or the risky one. Web design in Dublin is a crowded market, but most of what's built is templates: pages that look fine and convert nobody.",
      "Every website we build is custom — no templates, no page builders. Designed for performance, clarity and lasting brand presence, and structured around one job: turning the right visitors into real enquiries. That means fast load times, copy that answers the questions buyers actually have, and a clear path from landing to contact on every page.",
      "It also means being found. We build with technical SEO from the first line — semantic structure, local search signals, clean Core Web Vitals — so the site earns Google's trust the same way it earns your customers'.",
      "Every project starts with a conversation about your business, not a package menu. From there you get a clear proposal, a realistic timeline, and a site you can actually update — with the option of a monthly retainer if you'd rather we keep it growing for you.",
    ],
    deliverablesTitle: "What we build",
    deliverables: [
      {
        title: "Custom websites",
        description:
          "Full multi-page sites designed around your services, your customers and the enquiries you want more of.",
      },
      {
        title: "Landing pages",
        description:
          "Single-purpose pages for campaigns and bookings — one message, one action, measurable results.",
      },
      {
        title: "Website redesigns",
        description:
          "An existing site that underperforms, rebuilt on a stronger structure without losing what already ranks.",
      },
      {
        title: "E-commerce",
        description:
          "Online stores with product presentation that sells and a checkout that stays out of the way.",
      },
    ],
    systemNote:
      "The website is where the whole system converts. The brand gives it a face, the content gives it proof, and the marketing drives the traffic — the site's job is to turn that attention into enquiries.",
    related: [
      { label: "Your website is a sales system, not a brochure", href: blogSlugs.websiteSalesSystem },
      {
        label: "Why Irish businesses lose enquiries at the first impression",
        href: blogSlugs.firstImpression,
      },
    ],
  },
  {
    slug: "photo-video-production",
    path: "/services/photo-video-production",
    metaTitle: "Photo & Video Production Dublin",
    metaDescription:
      "Video production in Dublin — reels, business videos, campaign content and brand storytelling. Filmed, edited and paced to hold attention and convert.",
    kicker: "Photo & Video Production",
    h1: "Video production in Dublin that earns attention — and keeps it.",
    intro: [
      "Nothing builds trust faster than seeing a business for real: the people, the place, the work being done. That's why video is the hardest-working asset in the system — one shoot becomes a homepage film, a run of social reels, campaign cuts and a library of photography your marketing can draw on for months.",
      "We handle production end to end: planning and scripting, filming on location in Dublin or wherever the work is, and an edit built on strong pacing, clean sound and story-first structure. The same discipline applies to photography — images shot to be used, across the website, socials, print and ads.",
      "Everything is cut for the platform it lives on. A reel that has to win the scroll in seconds is a different edit from a brand film that carries your story on the homepage — we make both, from the same day's footage, so the budget works harder.",
      "A typical production runs from a half-day shoot to a multi-day campaign. You get final cuts in every format you need, the photography library organised and ready to use, and raw footage archived so future edits don't need a new shoot.",
    ],
    deliverablesTitle: "What we produce",
    deliverables: [
      {
        title: "Brand films & business videos",
        description:
          "The story of your business, told properly — for your homepage, pitches and campaigns.",
      },
      {
        title: "Reels & social video",
        description:
          "Short-form cuts paced for the feed, designed to stop the scroll and drive profile visits.",
      },
      {
        title: "Campaign content",
        description:
          "Video and photo assets built around a specific launch, offer or event.",
      },
      {
        title: "Photography",
        description:
          "Team, premises and product photography that replaces stock images with the real thing.",
      },
    ],
    systemNote:
      "Content is the proof layer of the system. The brand sets the look, the website makes the promise — photo and video are what make people believe it, then the marketing puts it in front of them.",
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
      "Social assets, campaign visuals, ads and promotional materials for Dublin businesses — marketing content designed on-brand and built to convert.",
    kicker: "Marketing Content",
    h1: "Marketing content that keeps the system working week after week.",
    intro: [
      "A brand launch gets attention once. What grows a business is what happens every week after: the social posts, the campaign visuals, the ads, the promotions. This is where most brands fall apart — the identity that looked sharp at launch gets diluted post by post until the feed could belong to anyone.",
      "We produce marketing content as part of the system, not as one-off favours. Social assets, ad creative and promotional materials are designed from your brand guidelines and your content library, so every piece compounds recognition instead of eroding it.",
      "And because we build the websites and shoot the content too, the pieces connect: the ad matches the landing page it points to, the social visual matches the offer, and the whole journey feels like one business — which is exactly what makes people trust it enough to enquire.",
      "Most clients run this as a monthly retainer: a set volume of assets planned around your content calendar, delivered on schedule, with room built in for the campaigns and opportunities that come up mid-month. One-off campaign packages are available too, for launches and events that need a concentrated push.",
    ],
    deliverablesTitle: "What we create",
    deliverables: [
      {
        title: "Social media assets",
        description:
          "Post templates, story formats and feed visuals that keep the channel on-brand and easy to run.",
      },
      {
        title: "Campaign visuals",
        description:
          "Coordinated creative for launches, offers and seasonal pushes — one idea, carried across every channel.",
      },
      {
        title: "Ad creative",
        description:
          "Static and motion ad assets built for Meta and Google, matched to the landing pages they drive to.",
      },
      {
        title: "Promotional materials",
        description:
          "Digital and print promos — menus of offers, event announcements, everything in between.",
      },
    ],
    systemNote:
      "Marketing is the distribution stage of the system. It takes the brand, the site and the content — and puts them in front of the people who haven't met you yet, consistently enough to be remembered.",
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
      "Print design in Dublin — business cards, flyers, signage, menus, banners and print-ready artwork that carry your brand into the physical world.",
    kicker: "Print & Multimedia Design",
    h1: "Print and multimedia design that carries your brand into the real world.",
    intro: [
      "Digital gets the attention, but print does something screens can't: it puts your brand physically in someone's hand, on their wall, on the side of their van. For local businesses in Dublin, the physical touchpoints — signage, menus, cards, vehicle wraps — are often the first impression, long before anyone visits the website.",
      "We design print as an extension of the same brand system, not an afterthought. The colours match, the type matches, the tone matches — so the flyer someone picks up and the website they visit an hour later are unmistakably the same business.",
      "Every file we hand over is genuinely print-ready: correct bleed, resolution and colour profiles, prepared to your printer's spec. Large-format work — banners, backdrops, wraps, stage visuals — is built at scale from the start, so nothing arrives pixelated on the day.",
      "We work directly with your printer or recommend one we trust in Dublin, check proofs before anything goes to press, and keep every artwork file safely on record — so when you need a reprint, a new menu or an updated banner next season, it's a message away, not a redesign from scratch.",
    ],
    deliverablesTitle: "What we design",
    deliverables: [
      {
        title: "Business cards & stationery",
        description: "The classics, done properly — the handshake your brand leaves behind.",
      },
      {
        title: "Flyers, menus & brochures",
        description:
          "Layouts that organise real information clearly and still look like your brand.",
      },
      {
        title: "Signage & banners",
        description:
          "Shopfronts, event banners and backdrops designed to read at distance and at scale.",
      },
      {
        title: "Vehicle wraps & large format",
        description:
          "Car wraps, decals and stage visuals — print-ready artwork prepared to production spec.",
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
