import { projects, webProjects } from "@/lib/site-config";

/**
 * Portfolio case studies: what each bento tile opens.
 *
 * Images, names, categories, years and links come from site-config; this file
 * adds the story. `results` and `testimonial` are optional: a section only
 * renders when it has content, so add real client numbers and quotes here as
 * they come in. Never invent them.
 */

export type TileSize = "feature" | "wide" | "square";

export interface CaseStudyResult {
  /** Short figure, e.g. "+42%" or "3 weeks". */
  value: string;
  label: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface CaseStudy {
  slug: string;
  name: string;
  category: string;
  discipline: "Branding" | "Web" | "Video & 3D";
  year?: string;
  image: string;
  /** External link (Behance or live site); null while not public. */
  href: string | null;
  hrefLabel?: string;
  comingSoon?: boolean;
  size: TileSize;
  summary: string;
  challenge?: string;
  approach?: string;
  scope: string[];
  results?: CaseStudyResult[];
  testimonial?: CaseStudyTestimonial;
}

type Story = Pick<CaseStudy, "slug" | "discipline" | "size" | "summary" | "scope"> &
  Partial<Pick<CaseStudy, "challenge" | "approach" | "results" | "testimonial">>;

function fromProject(name: string, story: Story): CaseStudy {
  const project = projects.find((p) => p.name === name);
  if (!project) throw new Error(`Unknown project: ${name}`);
  return {
    name: project.name,
    category: project.category,
    year: project.year,
    image: project.image,
    href: project.href,
    hrefLabel: "View on Behance",
    ...story,
  };
}

function fromWeb(name: string, story: Story): CaseStudy {
  const project = webProjects.find((p) => p.name === name);
  if (!project) throw new Error(`Unknown web project: ${name}`);
  return {
    name: project.name,
    category: project.type,
    image: project.image,
    href: project.href,
    hrefLabel: project.type === "Landing Page" ? "Visit landing page" : "Visit website",
    comingSoon: project.href === null,
    ...story,
  };
}

/**
 * Bento order. The grid packs densely: on 4 columns this is six full rows
 * (feature = 2×2, wide = 2×1, square = 1×1); squares sit in pairs so the
 * 2-column mobile grid has no gaps either.
 */
export const caseStudies: CaseStudy[] = [
  fromProject("Revival Youth Conference 2026", {
    slug: "revival-youth-conference",
    discipline: "Branding",
    size: "feature",
    summary:
      "Event identity for the Revival Youth Conference 2026: a visual system built to carry the conference from the first announcement to the stage.",
    approach:
      "One identity applied everywhere the audience meets the event: social announcements, printed materials and on-stage visuals, so every touchpoint reads as the same conference.",
    scope: ["Event identity", "Key visual", "Social media assets", "Print materials", "Stage visuals"],
  }),
  fromWeb("RG Mobile Tyre Services", {
    slug: "rg-mobile-tyre-services",
    discipline: "Web",
    size: "wide",
    summary:
      "Website for a mobile tyre service, built around local search, fast contact and clear service information.",
    challenge:
      "Customers looking for a mobile tyre fitter are often in a hurry. The site has to answer what, where and how to call within seconds.",
    approach:
      "A service-first structure with contact always in reach, clear service areas and pages written for local search.",
    scope: ["Website design", "Development", "Local SEO structure", "Contact flow"],
  }),
  fromProject("The Best Taste", {
    slug: "the-best-taste",
    discipline: "Branding",
    size: "square",
    summary:
      "Brand design and social media content for The Best Taste, giving the business a consistent, appetising presence online.",
    scope: ["Brand design", "Social media templates", "Campaign visuals"],
  }),
  fromProject("Mídia Kit Irlandapontocom", {
    slug: "midia-kit-irlandapontocom",
    discipline: "Branding",
    size: "square",
    summary:
      "Media kit for Irlandapontocom, presenting the platform's audience and advertising options to potential partners.",
    scope: ["Editorial design", "Media kit", "Data presentation"],
  }),
  fromWeb("Studio AG Dublin", {
    slug: "studio-ag-dublin",
    discipline: "Web",
    size: "wide",
    summary:
      "Premium landing page for an advanced lymphatic drainage studio in Dublin, designed to turn visits into bookings through Fresha.",
    challenge:
      "A premium treatment needs to feel premium online, and every visit should lead to one action: booking.",
    approach:
      "A calm, high-end visual language with a single booking path to Fresha repeated through the page.",
    scope: ["Landing page design", "Development", "Booking integration (Fresha)", "Copy structure"],
  }),
  fromProject("The King", {
    slug: "the-king",
    discipline: "Video & 3D",
    size: "wide",
    summary: "Motion and 3D piece built around a single striking character, from modelling to final animation.",
    scope: ["3D modelling", "Lighting & rendering", "Motion design"],
  }),
  fromProject("Gym+Coffee Bespoke Stand", {
    slug: "gym-coffee-bespoke-stand",
    discipline: "Video & 3D",
    size: "wide",
    summary:
      "Bespoke event stand concept for Gym+Coffee, visualised in 3D so the brand could see the space before it was built.",
    scope: ["3D stand design", "Photorealistic renders", "Brand application in space"],
  }),
  fromProject("Biella Bakery", {
    slug: "biella-bakery",
    discipline: "Branding",
    size: "feature",
    summary:
      "Brand identity for Biella Bakery: a warm, recognisable identity designed to work on the shopfront, the packaging and the feed.",
    scope: ["Logo design", "Visual identity", "Packaging & applications", "Brand guidelines"],
  }),
  fromWeb("VORN", {
    slug: "vorn",
    discipline: "Web",
    size: "square",
    summary:
      "Premium lifestyle sportswear website focused on brand positioning, product presentation and a clean visual experience.",
    scope: ["E-commerce design", "Product presentation", "Brand positioning"],
  }),
  fromWeb("Neex Creative Portfolio", {
    slug: "neex-creative-portfolio",
    discipline: "Web",
    size: "square",
    summary:
      "Our own studio site: branding, motion, 3D, video and web development presented as one system, built for speed, SEO and privacy-first analytics.",
    scope: ["Brand system", "Website design", "Next.js development", "SEO & analytics"],
  }),
  fromProject("Plaza Car Wash", {
    slug: "plaza-car-wash",
    discipline: "Branding",
    size: "wide",
    summary:
      "Brand guide for Plaza Car Wash, setting the rules that keep signage, uniforms and promotions consistent.",
    scope: ["Brand guidelines", "Visual identity", "Signage applications"],
  }),
  fromProject("3D Event Conference Venues", {
    slug: "3d-event-conference-venues",
    discipline: "Video & 3D",
    size: "wide",
    summary:
      "3D visualisation of conference venues and stage set-ups, used to plan and sell events before a single structure goes up.",
    scope: ["3D venue modelling", "Stage design", "Architectural renders"],
  }),
];
