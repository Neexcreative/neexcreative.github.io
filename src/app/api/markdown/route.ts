import { serviceGalleryMarkdown } from "@/lib/service-gallery";
import { getAllPosts } from "@/lib/blog";
import { servicesContent } from "@/lib/services-content";
import { siteConfig, projects, webProjects } from "@/lib/site-config";
import { agentGuide } from "@/lib/agent-guide";
import { privacySections } from "@/lib/privacy-content";

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const path = params.get("path") ?? "/";
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const links = `\n\n## Explore\n- [Home](${siteConfig.url}/)\n- [Services](${siteConfig.url}/services)\n- [Work](${siteConfig.url}/work)\n- [Contact](${siteConfig.url}/contact)\n- [Sitemap](${siteConfig.url}/sitemap.xml)\n- [Agent guide](${siteConfig.url}/llms.txt)\n`;
  let body: string | undefined;
  if (path === "/") body = agentGuide;
  if (path === "/services") body = "# Services\n\n" + servicesContent.map(s => `## [${s.metaTitle}](${siteConfig.url}${s.path})\n${s.metaDescription}`).join("\n\n");
  const service = servicesContent.find(s => s.path === path);
  if (service) body = `# ${service.h1}\n\n${service.intro.join("\n\n")}\n\n## ${service.deliverablesTitle}\n\n${service.deliverables.map(d => `### ${d.title}\n${d.description}`).join("\n\n")}\n\n${service.systemNote}`;
  if (service) body += serviceGalleryMarkdown(service.slug);
  if (path === "/work") body = "# Selected work\n\n" + projects.map(p => `- [${p.name}](${p.href}), ${p.category}, ${p.year}`).join("\n") + "\n\n## Websites\n" + webProjects.map(p => p.href ? `- [${p.name}](${p.href}): ${p.description}` : `- ${p.name}, Coming soon: ${p.description}`).join("\n");
  if (path === "/about") body = "# About Neex Creative\n\nMarlon Franca is a multidisciplinary designer based in Dublin. His work combines graphic design, brand identity, motion, video production and 3D to create consistent experiences across digital and live environments. He has delivered creative for events, conferences and businesses, from brand systems and campaigns to video storytelling and 3D visuals. Neex Creative connects strategy, design, content and distribution so businesses can communicate consistently across their website, social content and printed materials.\n\n" + siteConfig.description;
  if (path === "/contact") body = `# Contact Neex Creative\n\nEmail: ${siteConfig.email}\n\nPhone / WhatsApp: ${siteConfig.phone}\n\nAddress: ${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.postalCode}, Ireland\n\nAvailability: ${siteConfig.availability}\n\nRequest a free quote through the contact page. Provide your name, email, requested service and message, plus optional phone, location and project details. Describe the business, deliverables and deadline so the studio can assess the scope and respond. Prices are quoted per project. The form may open your email application; in that case, send the draft to complete your enquiry.\n\n[Privacy notice](${siteConfig.url}/privacy)`;
  if (path === "/privacy") body = "# Privacy notice\n\n" + privacySections.map(s => `## ${s.title}\n\n${s.text}`).join("\n\n");
  if (path === "/book") body = `# Book a discussion\n\n[Schedule a 30-minute discussion](${siteConfig.calendlyUrl}) or email ${siteConfig.email}. Scheduling is handled by Calendly. Contact the studio to confirm project scope, pricing and availability.`;
  if (path === "/blog" || path.startsWith("/blog/")) {
    const posts = getAllPosts();
    const matches = query ? posts.filter(p => [p.title, p.description, ...p.keywords].join(" ").toLowerCase().includes(query)) : posts;
    if (path === "/blog") body = "# Blog\n\n" + (matches.length ? matches.map(p => `- [${p.title}](${siteConfig.url}/blog/${p.slug}): ${p.description}`).join("\n") : "No articles match your search.");
    const post = posts.find(p => path === `/blog/${p.slug}`);
    if (post) body = `# ${post.title}\n\n${post.description}\n\n${post.content}`;
  }
  const status = body === undefined ? 404 : 200;
  return new Response((body ?? "# 404: Page not found\n\nThis address does not match an available Neex Creative page. Use the links below to continue.") + links, {
    status,
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Vary": "Accept, Accept-Encoding", "Cache-Control": "private, no-store", "CDN-Cache-Control": "no-store", "Vercel-CDN-Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...(status === 404 ? { "X-Robots-Tag": "noindex" } : {}) },
  });
}
