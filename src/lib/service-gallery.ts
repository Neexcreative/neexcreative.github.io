import { projects, webProjects } from "@/lib/site-config";

export interface GalleryProject {
  name: string;
  category: string;
  image: string;
  href: string | null;
  description?: string;
  year?: string;
}
export interface ServiceGalleryContent {
  title: string;
  description: string;
  projects: GalleryProject[];
}

function selectProjects(...numbers: string[]): GalleryProject[] {
  return numbers.map(number => {
    const project = projects.find(item => item.number === number);
    if (!project) throw new Error("Unknown portfolio project: " + number);
    return project;
  });
}

/** Select by stable project number; names, images and destinations stay in site-config. */
export const serviceGalleries: Record<string, ServiceGalleryContent> = {
  "brand-strategy-design": {
    title: "Identities with a point of view.",
    description: "Explore visual identities and brand guidelines for businesses and events. Open a project to see the full presentation.",
    projects: selectProjects("01", "02", "06", "07"),
  },
  "web-design": {
    title: "Websites in the real world.",
    description: "Explore our web portfolio, from service businesses to creative brands. Visit the live sites or preview work in development.",
    projects: webProjects.map(project => ({ ...project, category: project.type })),
  },
  "photo-video-production": {
    title: "Motion, dimension and visual storytelling.",
    description: "Selected motion and 3D work from our wider visual portfolio. Explore stage visuals, event spaces and dimensional design in the full project presentations.",
    projects: selectProjects("05", "03", "08"),
  },
  "marketing-content": {
    title: "Content with a recognisable identity.",
    description: "Social design and editorial presentation, created to carry a brand across its communications.",
    projects: selectProjects("07", "04"),
  },
  "print-multimedia-design": {
    title: "Design beyond the screen.",
    description: "Editorial and 3D event projects from our portfolio, showing how visual design can extend into publications, stands and spaces.",
    projects: selectProjects("04", "03", "08"),
  },
};

/** The same project selection is exposed to readers requesting Markdown. */
export function serviceGalleryMarkdown(slug: string): string {
  const gallery = serviceGalleries[slug];
  if (!gallery) return "";
  return "\n\n## " + gallery.title + "\n\n" + gallery.description + "\n\n" +
    gallery.projects.map(project =>
      project.href
        ? "- [" + project.name + "](" + project.href + "): " + project.category + (project.description ? ". " + project.description : "")
        : "- " + project.name + ": " + project.category + ". Coming soon."
    ).join("\n");
}
