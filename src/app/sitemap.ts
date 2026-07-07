import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { servicesContent } from "@/lib/services-content";
import { siteConfig } from "@/lib/site-config";

/** Build date, used for pages whose content ships with the deploy. */
const deployed = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: deployed, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/services`, lastModified: deployed, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/contact`, lastModified: deployed, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/about`, lastModified: deployed, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/book`, lastModified: deployed, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/blog`, lastModified: deployed, changeFrequency: "weekly", priority: 0.8 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = servicesContent.map((service) => ({
    url: `${siteConfig.url}${service.path}`,
    lastModified: deployed,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
