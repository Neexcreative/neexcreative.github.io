/**
 * Blog types and category list, safe to import from client components
 * (no node:fs — the filesystem loader lives in blog.ts).
 */

export const blogCategories = [
  "Brand Strategy",
  "Web & Conversion",
  "Video & Content",
  "Marketing",
  "Case Notes",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  category: BlogCategory;
  coverImage: string;
  readingTime: string;
  keywords: string[];
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

export interface Post extends PostMeta {
  content: string;
}
