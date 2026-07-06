"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

export default function BlogIndex({ posts }: BlogIndexProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const [featured, ...rest] = posts;
  const filtered =
    activeCategory === "All" ? rest : posts.filter((post) => post.category === activeCategory);
  const showFeatured = activeCategory === "All" && featured;

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
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts by category">
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
            No posts in this category yet — new articles land weekly.
          </p>
        )}
      </div>
    </>
  );
}
