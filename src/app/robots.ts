import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Same crawl exclusions the legacy robots.txt carried.
      disallow: ["/docs/", "/icons/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
