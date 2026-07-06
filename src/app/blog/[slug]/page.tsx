import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import JsonLd from "@/components/JsonLd";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButton from "@/components/ShareButton";
import { organizationSchema } from "@/lib/schema";
import { getAllPosts, getPostBySlug, getRelatedPosts, type PostMeta } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      images: [{ url: post.coverImage, width: 1600, height: 900, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

/** Editorial typography for the MDX body. */
const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-14 text-2xl font-medium leading-snug md:text-3xl" {...props} />
  ),
  h3: (props) => <h3 className="mt-10 text-xl font-medium leading-snug" {...props} />,
  p: (props) => <p className="mt-6 text-base leading-[1.9] text-muted" {...props} />,
  strong: (props) => <strong className="font-medium text-text" {...props} />,
  em: (props) => <em {...props} />,
  a: (props) => (
    <a className="text-accent underline underline-offset-4 hover:opacity-85" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-10 border-l-2 border-accent pl-6 text-xl leading-relaxed text-text"
      {...props}
    />
  ),
  ul: (props) => <ul className="mt-6 list-disc space-y-3 pl-6 text-muted" {...props} />,
  ol: (props) => <ol className="mt-6 list-decimal space-y-3 pl-6 text-muted" {...props} />,
  hr: () => <hr className="mt-14 border-border" />,
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function RelatedCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block border border-border p-6">
      <span className="text-xs uppercase tracking-[0.18em] text-accent">{post.category}</span>
      <h3 className="mt-3 text-lg font-medium leading-snug transition-colors group-hover:text-accent">
        {post.title}
      </h3>
      <span className="mt-3 block text-xs text-muted">
        {formatDate(post.date)} · {post.readingTime} read
      </span>
    </Link>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const articleUrl = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          image: `${siteConfig.url}${post.coverImage}`,
          url: articleUrl,
          keywords: post.keywords.join(", "),
          author: organizationSchema,
          publisher: organizationSchema,
          mainEntityOfPage: articleUrl,
        }}
      />

      <article>
        <header className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              {post.category}
            </p>
            <h1 className="mt-6 text-3xl font-medium leading-[1.15] sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-muted">
                {formatDate(post.date)} · {post.readingTime} read
              </p>
              <ShareButton title={post.title} url={articleUrl} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-6 pt-12 md:px-12">
          <div className="relative aspect-[16/9] overflow-hidden border border-border">
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 60rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 pb-24 pt-4 md:pb-32">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>

      <aside aria-label="Related articles" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            Keep Reading
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((relatedPost) => (
              <RelatedCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-10 md:flex-row md:items-center">
            <p className="max-w-lg text-lg leading-relaxed">
              From the first impression to the conversion — one system. See how
              the services behind these ideas fit together.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:border-muted hover:text-text"
              >
                Explore Services
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-text transition-opacity hover:opacity-85"
              >
                Get a Quote <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
