# Neex Creative — Blog Workflow

One MDX file = one published article. Add a file to `content/blog/`, push,
and the post appears automatically on `/blog`, in the related-posts mesh,
and in the sitemap. No code changes needed.

## Publishing a post (weekly)

1. Create `content/blog/<slug>.mdx`. The filename **is the URL**:
   `my-new-post.mdx` → `neexcreative.com/blog/my-new-post`.
   Use short, keyword-bearing, kebab-case slugs. Never rename a published
   file — that changes an indexed URL.

2. Start the file with complete frontmatter (all fields required — the
   build fails loudly if one is missing):

   ```yaml
   ---
   title: "Post Title In Title Case"
   description: "One-sentence summary, ~150 chars. Used for SEO and cards."
   date: "2026-07-14"            # YYYY-MM-DD; newest post becomes featured
   category: "Web & Conversion"  # exactly one of the five below
   coverImage: "/images/blog/my-cover.jpg"
   readingTime: "6 min"
   keywords:
     - "web design Dublin"
     - "creative agency Dublin"
   ---
   ```

3. Valid categories (typed in `src/lib/blog.ts` — adding a new one means
   updating that list first):
   - Brand Strategy
   - Web & Conversion
   - Video & Content
   - Marketing
   - Case Notes

4. Add a cover image to `public/images/blog/` — 1600×900, dark editorial
   style (bg `#0a0a0a`, accent `#e63329`, restrained geometry). The
   generator script in `scripts/generate-blog-covers.mjs` shows the house
   style if you want to add a new programmatic cover.

5. Write the body in Markdown. House editorial rules:
   - 600–900 words, human-first, English only.
   - `##` for sections, `###` sparingly. No `#` — the H1 comes from `title`.
   - Bold the local-SEO phrase once, early (e.g. **web design in Dublin**),
     then write naturally. No keyword stuffing.
   - Link to at least one service page or `/contact` in the body or footer
     line — the internal mesh is part of the SEO strategy.
   - End with the one-line italic studio note + CTA link (see existing
     posts for the pattern).

6. `npm run build` locally to confirm, then commit and push. Vercel
   deploys it; the sitemap and blog index update on their own.

## Where things live

| Piece | Location |
| --- | --- |
| Articles | `content/blog/*.mdx` |
| Typed loader / categories | `src/lib/blog.ts` |
| Index page + category filter | `src/app/blog/page.tsx`, `src/components/BlogIndex.tsx` |
| Article template | `src/app/blog/[slug]/page.tsx` |
| Cover images | `public/images/blog/` |
