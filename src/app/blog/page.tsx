import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";
import { getAllPosts, toMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical thinking on brand systems, web conversion, video content and marketing — from a creative agency in Dublin.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Neex Creative",
    description:
      "Practical thinking on brand systems, web conversion, video content and marketing — from a creative agency in Dublin.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts().map(toMeta);

  return (
    <>
      {/* Dark hero, consistent with the homepage opening. */}
      <section className="bg-bg text-text">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
          {/* Not animated: the H1 is the page's LCP element. */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Blog</p>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Thinking that turns attention into enquiries.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted">
              Practical notes on brand systems, web conversion, video and
              marketing — written for business owners, not designers.
            </p>
          </div>
        </div>
      </section>

      {/* Light editorial body. */}
      <div className="bg-light-bg text-light-text">
        <BlogIndex posts={posts} />
      </div>
    </>
  );
}
