"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { blogCategories, type PostMeta } from "@/lib/blog-shared";

interface BlogIndexProps {
  posts: PostMeta[];
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <span className="relative block aspect-[16/9] overflow-hidden border border-border">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </span>
        <span className="mt-5 text-xs uppercase tracking-[0.18em] text-accent">{post.category}</span>
        <h3 className="mt-2 text-lg font-medium leading-snug transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
        <span className="mt-4 text-xs text-muted">
          {formatDate(post.date)} · {post.readingTime} read
        </span>
      </Link>
    </article>
  );
}

function matchesQuery(post: PostMeta, query: string): boolean {
  const haystack = [post.title, post.description, ...post.keywords].join(" ").toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  // Seeded from ?q= so the WebSite SearchAction schema resolves to real results.
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");

  const [featured, ...rest] = posts;
  const byCategory =
    activeCategory === "All" ? rest : posts.filter((post) => post.category === activeCategory);
  const filtered = query.trim()
    ? (activeCategory === "All" ? posts : byCategory).filter((post) => matchesQuery(post, query.trim()))
    : byCategory;
  const showFeatured = activeCategory === "All" && !query.trim() && featured;

  return (
    <>
      {showFeatured && (
        <article className="group border-b border-border">
          <Link
            href={`/blog/${featured.slug}`}
            className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:px-12 md:py-20"
          >
            <span className="relative block aspect-[16/9] overflow-hidden border border-border">
              <Image
                src={featured.coverImage}
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </span>
            <span>
              <span className="text-xs uppercase tracking-[0.18em] text-accent">
                Latest · {featured.category}
              </span>
              <h2 className="mt-3 text-2xl font-medium leading-snug transition-colors group-hover:text-accent md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">{featured.description}</p>
              <span className="mt-5 block text-xs text-muted">
                {formatDate(featured.date)} · {featured.readingTime} read
              </span>
            </span>
          </Link>
        </article>
      )}

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <label className="flex w-full items-center gap-3 md:max-w-xs">
            <span className="sr-only">Search articles</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles…"
              className="w-full border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter posts by category">
          {["All", ...blogCategories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
                activeCategory === category
                  ? "border-accent text-text"
                  : "border-border text-muted hover:border-muted hover:text-text"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-sm text-muted">
            {query.trim()
              ? `No articles match "${query.trim()}" — try another term.`
              : "No posts in this category yet — new articles land weekly."}
          </p>
        )}
      </div>
    </>
  );
}
