import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  blogCategories,
  type BlogCategory,
  type Post,
  type PostFrontmatter,
  type PostMeta,
} from "@/lib/blog-shared";

export { blogCategories };
export type { BlogCategory, Post, PostFrontmatter, PostMeta };

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function assertFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
  const required = ["title", "description", "date", "category", "coverImage", "readingTime", "keywords"];
  for (const field of required) {
    if (data[field] === undefined) {
      throw new Error(`Blog post "${slug}" is missing frontmatter field "${field}"`);
    }
  }
  if (!blogCategories.includes(data.category as BlogCategory)) {
    throw new Error(
      `Blog post "${slug}" has unknown category "${String(data.category)}". Valid: ${blogCategories.join(", ")}`,
    );
  }
  return data as unknown as PostFrontmatter;
}

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return { slug, content, ...assertFrontmatter(data, slug) };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** Strips the body so only serializable metadata crosses to client components. */
export function toMeta(post: Post): PostMeta {
  const { slug, title, description, date, category, coverImage, readingTime, keywords } = post;
  return { slug, title, description, date, category, coverImage, readingTime, keywords };
}

/** Same-category posts first, newest first, padded with other recent posts. */
export function getRelatedPosts(post: Post, limit = 2): PostMeta[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit).map(toMeta);
}
