import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

/** Next replaces nested metadata objects; complete each page before returning it. */
export function withSocialMetadata(metadata: Metadata): Metadata {
  const canonical = metadata.alternates?.canonical;
  const url = canonical instanceof URL || typeof canonical === "string"
    ? canonical : canonical?.url ?? siteConfig.url;
  const rawTitle = metadata.title;
  const title = typeof rawTitle === "string" ? rawTitle
    : rawTitle && "absolute" in rawTitle ? rawTitle.absolute
    : "Creative Agency Dublin | Brand Systems, Web & Video | Neex Creative";
  const description = metadata.description ?? siteConfig.description;
  const images = [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }];
  return {
    ...metadata,
    openGraph: {
      type: "website", locale: siteConfig.locale, siteName: siteConfig.name,
      title, description, images,
      ...metadata.openGraph,
      url,
    },
    twitter: {
      card: "summary_large_image", title, description,
      images: [siteConfig.ogImage],
      ...metadata.twitter,
    },
  };
}
