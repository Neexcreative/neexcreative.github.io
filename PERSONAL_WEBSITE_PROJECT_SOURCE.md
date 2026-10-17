# PERSONAL WEBSITE — PROJECT SOURCE

> **Project:** Neex Creative website (www.neexcreative.com), the studio site and personal portfolio of designer Marlon Franca.
> **Document type:** single source of truth for AI assistants and developers working on this repository.
> **Generated:** 8 October 2026, by inspecting the repository at commit `3b16503` on `main` (in sync with `origin/main`).
> **Method:** everything below was verified in the code, config, assets or local Git metadata. Anything that could not be verified is labelled **NEEDS CONFIRMATION**.

**Labels used in this document**

| Label | Meaning |
| --- | --- |
| **CURRENT** | Exists in the code on `main` today |
| **PLANNED** | Referenced in docs, copy or comments, but not built |
| **NEEDS CONFIRMATION** | Cannot be verified from the repo (lives in Vercel, DNS, Google, etc.) |
| **TECHNICAL DEBT** | Verified issue or leftover that should eventually be addressed |

**Companion documents in the repo**

| File | What it holds |
| --- | --- |
| `README.md` | Content-level knowledge source (full site copy, voice, portfolio, blog rules), written for a ChatGPT project. Rewritten 2026-10-08, **not yet committed**. |
| `TECHNICAL-STATUS.md` | Technical status note dated 12/09/2026 (Portuguese): metadata refactor, SEO verification script, open `Vary` header issue. |
| `content/README.md` | Blog publishing workflow. |
| `AGENTS.md` / `CLAUDE.md` | Warning that this is Next.js 16 with breaking changes; read `node_modules/next/dist/docs/` before writing code. |
| `legacy/README.md` | README of the old static site. |

---

## 1. Project Overview

**CURRENT.** A marketing and portfolio website for **Neex Creative**, a creative agency/studio in Dublin, Ireland, run by **Marlon Franca**. It presents five services as "one system", shows a portfolio, publishes a blog, and converts visitors through a quote form, a Calendly booking page, WhatsApp and email.

- Built with **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4**, deployed on **Vercel**.
- Replaced a static HTML site (kept in `legacy/` for reference). The Next.js migration was merged to `main` via PR #1 (`fda2d6d`), followed by PR #3 (Calendly height fix) and PR #4 (navbar logo/palette swap).
- Content is data-driven: almost all copy lives in `src/lib/*.ts` and `content/blog/*.mdx`, not in components.
- Machine-readable layer for AI agents: `/llms.txt` plus Markdown versions of every page via `Accept: text/markdown`.

---

## 2. Identity & Positioning

| Item | Value | Source |
| --- | --- | --- |
| Project / package name | `neex-creative` | `package.json` |
| Brand name | Neex Creative | `src/lib/site-config.ts` |
| Person represented | Marlon Franca, "multidisciplinary designer" | `/about`, `src/app/api/markdown/route.ts` |
| Legal line | "Neex Creative, Dublin, Ireland" | `site-config.ts` |
| Public domain | `https://www.neexcreative.com` | `siteConfig.url`, `metadataBase` |
| Older Vercel URL | `https://neexcreativeio.vercel.app` | `legacy/README.md` (**NEEDS CONFIRMATION** whether still active) |
| Tagline | "One system. From the first impression to the conversion." | `site-config.ts` |
| Description | "Neex Creative is a Dublin creative agency building integrated brand systems, strategy, websites, video, marketing content and print that work as one growth engine." | `site-config.ts` |
| Language | English only, `lang="en"`, OG locale `en_IE`, Irish/British spelling | `layout.tsx`, copy |
| Audience | Business owners in Dublin and Ireland (local SMBs: cafés, restaurants, trades, studios, events). Blog says "written for business owners, not designers". | Copy across pages |
| Positioning | Creative agency that delivers brand, web, video, marketing content and print as **one integrated system** instead of separate services | Home, Services, all service pages |

**How the person is presented (About page):** first person, "I'm Marlon, a multidisciplinary designer focused on building strong visual identities and high-impact content systems for brands." Disciplines tagged: Graphic Design · Motion · Video · 3D · Brand Systems. Has delivered creative "for events, conferences, and businesses". A resume PDF is linked (`/docs/Resume-MarlonFranca2026.pdf`).

**Not present in the project (do not invent):** years of experience, client count, testimonials, awards, team members, pricing, education, nationality or any biography beyond the two About paragraphs.

### Contact & social (as published)

| Channel | Value |
| --- | --- |
| Business email | info@neexcreative.com |
| Phone / WhatsApp | +353 83 306 3221 · `https://wa.me/353833063221` (labelled "Fastest response") |
| Location | Dublin, Ireland |
| Hours | Mon to Fri 9:00 AM to 6:00 PM · Saturday by appointment |
| Booking | `https://calendly.com/neexcreative/30min` |
| Instagram (studio) | `https://www.instagram.com/neexcreative/` |
| LinkedIn (company) | `https://www.linkedin.com/company/neexcreative/` |
| Behance | `https://www.behance.net/neexcreative` |
| YouTube | `https://www.youtube.com/@marloneex` (footer + schema only; filtered out on `/contact`) |
| About-page personal contacts | `marlon.adm@outlook.com.br`, Instagram `@marloneex`, `linkedin.com/in/marlonfrancasilva` |

### Calls to action

- **Primary:** "Get a Quote →" → `/contact` (navbar, hero, service pages, CTA blocks, blog articles).
- **Secondary:** "View Our Work" / "View Work" → `/#work`; "Book a Free Call" → `/book`; "View selected work ↓" → `#service-work`; "Meet the Designer →" → `/about`; "Explore Services" → `/services`.
- **Form submit:** "Request My Free Quote".

---

## 3. Website Goals

Inferred strictly from code and copy:

1. **Generate enquiries** (quote form, WhatsApp, email, Calendly). Every page ends in a CTA.
2. **Rank locally** for Dublin/Ireland service searches (local-SEO copy, LocalBusiness and Service schema, dedicated service pages, legacy `/web-design` URL preserved).
3. **Show credibility** through a portfolio (Behance case studies, live client websites).
4. **Content marketing** via a blog (four articles; copy says "new articles land weekly").
5. **Measure genuine leads** (form success, Calendly bookings) and contact attempts (WhatsApp) in GA4 / Google Ads, after consent. (The former homepage-visit Ads conversion was retired on 2026-10-09.)
6. **Be readable by AI agents** (`/llms.txt`, Markdown content negotiation).

---

## 4. Current Architecture

```
Browser ──► Vercel (Next.js 16)
              │
              ├─ src/proxy.ts  (Next 16 "proxy", formerly middleware)
              │     Accept: text/markdown ? ──► rewrite to /api/markdown?path=…
              │     otherwise ──► normal page; sets Vary: Accept, Accept-Encoding
              │
              ├─ App Router pages (statically rendered; dynamic segments use
              │     generateStaticParams + dynamicParams = false)
              │
              ├─ Data layer (no CMS, no database):
              │     src/lib/site-config.ts       site-wide data
              │     src/lib/services-content.ts  service page copy
              │     src/lib/service-gallery.ts   per-service galleries
              │     src/lib/privacy-content.ts   privacy copy
              │     content/blog/*.mdx           blog (gray-matter + next-mdx-remote)
              │
              └─ Third parties (client side):
                    Consent-gated gtag.js (GA4 + Ads) · click-to-load Calendly + Maps ·
                    Form endpoint (NEXT_PUBLIC_FORM_ENDPOINT) or mailto fallback
```

- **Rendering:** server components by default. Client components only where needed: `Navbar`, `ContactForm`, `BlogIndex`, `ReadingProgress`, `ShareButton`, `GoogleTag`, `PageViewTracker`, `CookieBanner`, `CookieSettingsButton`, `ExternalContentGate`, `CalendlyEmbed`.
- **No backend, database, auth or CMS.** The only server code is `/api/markdown`, `/llms.txt`, `robots.ts`, `sitemap.ts` and the proxy.
- **Page layout pattern ("hybrid"):** dark hero section → light warm "institutional" body → dark footer, with hard cuts between palettes.

---

## 5. Routes

### 5.1 CURRENT page routes (17 indexable pages, all in the sitemap)

| Route | Purpose | Main content / components | Primary CTA | SEO notes |
| --- | --- | --- | --- | --- |
| `/` | Home | LocalBusiness JSON-LD, `Hero`, `MarqueeTicker`, `PortfolioShowcase`, `ServicesSystem`, `Journey` (light), `ContactCTA` (light) | Get a Quote | Default title "Creative Agency Dublin \| Brand Systems, Web & Video \| Neex Creative"; canonical `/`; homepage conversion retired 2026-10-09 (local) |
| `/work` | Portfolio | Header + `PortfolioShowcase` (Branding / Web / Video & 3D) | Tiles open Behance / live sites | Title "Work \| Neex Creative" |
| `/services` | Services overview | Dark hero "Not five services. One growth engine.", list of 5 services, `Journey`, `ContactCTA`, Organization JSON-LD | Get a Quote | |
| `/services/brand-strategy-design` | Service page | `ServicePageContent` + `ServiceGallery` | Get a Quote / Book a Free Call | Service JSON-LD |
| `/web-design` | Service page (Websites & Landing Pages) | `ServicePageContent` | Get a Quote | **Keeps the legacy indexed URL and exact title** "Web Design Dublin \| Custom Websites \| Neex Creative" |
| `/services/photo-video-production` | Service page | `ServicePageContent` | Get a Quote | Service JSON-LD |
| `/services/marketing-content` | Service page | `ServicePageContent` | Get a Quote | Service JSON-LD |
| `/services/print-multimedia-design` | Service page | `ServicePageContent` | Get a Quote | Service JSON-LD |
| `/about` | "Meet the Designer" | Bio, discipline tags, photo `marlon.png`, personal contacts, Resume button | Resume / View Projects | |
| `/blog` | Blog index | `BlogIndex` (featured latest post, search, category filter) | Article cards | WebSite SearchAction targets `/blog?q=` |
| `/blog/website-sales-system` | Article | MDX via `MDXRemote`, `ReadingProgress`, `ShareButton`, related posts | Get a Quote | BlogPosting JSON-LD, OG type `article` |
| `/blog/brand-system-vs-logo` | Article | same | Get a Quote | same |
| `/blog/six-second-rule-video` | Article | same | Get a Quote | same |
| `/blog/first-impression-enquiries` | Article | same | Get a Quote | same |
| `/contact` | Contact + quote form | Contact details, social buttons and `ContactForm` | Request My Free Quote | |
| `/book` | Book a call | Discovery-call card + click-to-load Calendly (`ExternalContentGate` + `CalendlyEmbed`) | Open in Calendly | Calendly script only after load/consent |
| `/privacy` | Privacy notice | `privacySections` from `privacy-content.ts` | Contact us about privacy | Simple dark layout (not the hybrid pattern) |

Note: `/services/web-design` returns 404 by design (`dynamicParams = false`, web design is served at `/web-design`).

### 5.2 CURRENT non-page routes

| Route | Source | Purpose |
| --- | --- | --- |
| `/robots.txt` | `src/app/robots.ts` | Allow all, disallow `/docs/`, points to sitemap |
| `/sitemap.xml` | `src/app/sitemap.ts` | 8 static + 5 service + N blog URLs (blog entries carry `lastModified` from post date) |
| `/llms.txt` | `src/app/llms.txt/route.ts` | Plain-text agent guide built from `src/lib/agent-guide.ts` |
| `/api/markdown?path=…` | `src/app/api/markdown/route.ts` | Markdown version of each page; reached through the proxy rewrite; returns 404 + `noindex` for unknown paths |
| 404 | `src/app/not-found.tsx` | "404: Page not found" with recovery links |

### 5.3 CURRENT redirects (`next.config.ts`, permanent 308)

`/index.html → /`, `/about.html → /about`, `/contact.html → /contact`, `/book.html → /book`, `/web-design.html → /web-design`, `/assets/docs/* → /docs/*`, `/assets/icons/* → /icons/*`, four web screenshots `/assets/img/<file> → /images/work/<file>`, then `/assets/img/* → /images/*`.

### 5.4 PLANNED / REFERENCED (not live)

- **Blog category "Case Notes"** exists in the category list but has **no posts**.
- **VORN** website project is shown as "Coming Soon" (no link).
- **Case studies / authorship pages:** `TECHNICAL-STATUS.md` says to create them "only with real information". Not started.
- No commented-out or stubbed routes were found.

---

## 6. Technology Stack

Versions are the installed versions in `node_modules` (ranges from `package.json` in brackets).

| Layer | Technology | Version |
| --- | --- | --- |
| Framework | Next.js (App Router, Turbopack dev) | 16.2.10 (pinned) |
| UI | React / React DOM | 19.2.4 (pinned) |
| Language | TypeScript, `strict: true`, path alias `@/* → ./src/*` | 5.9.3 (`^5`) |
| Styling | Tailwind CSS via `@tailwindcss/postcss` (CSS-first `@theme` config, no `tailwind.config`) | 4.3.2 (`^4`) |
| Fonts | `next/font/google`: Inter, Montserrat | self-hosted by Next |
| Blog | `gray-matter` (frontmatter), `next-mdx-remote/rsc` (MDX rendering) | 4.0.3 / 6.0.0 |
| Animation | Pure CSS (`@keyframes` in `globals.css`) | |
| Installed but unused | `framer-motion` (no imports in `src/`) | 12.42.2 |
| Lint | ESLint 9 flat config + `eslint-config-next` (core-web-vitals + typescript) | 9.39.4 |
| Dev tooling | `sharp` (blog cover generator), `puppeteer-core` (QA scripts using local Chrome) | 0.35.3 / 25.3.0 |
| Hosting | Vercel (`vercel.json`: `"framework": "nextjs"`) | |
| Local runtime seen | Node.js | v24.14.0 (no `engines` field in `package.json`) |

Not present: GSAP, Supabase, any database, any CMS, PHP, auth, i18n library, testing framework (Jest/Vitest/Playwright), CI config.

---

## 7. Project Structure

```
Website/
├── AGENTS.md, CLAUDE.md          AI instructions (Next 16 warning)
├── README.md                     Content knowledge source (ChatGPT project)
├── TECHNICAL-STATUS.md           Technical status note (12/09/2026, PT)
├── PERSONAL_WEBSITE_PROJECT_SOURCE.md   This document
├── package.json / package-lock.json
├── next.config.ts                Image qualities, Vary header, redirects, transpilePackages
├── vercel.json                   framework: nextjs
├── tsconfig.json, eslint.config.mjs, postcss.config.mjs
├── content/
│   ├── README.md                 Blog workflow
│   └── blog/*.mdx                4 articles (filename = slug)
├── public/
│   ├── favicon.ico, og-image.png, site.webmanifest
│   ├── icons/                    favicons, apple-touch, android-chrome
│   ├── docs/                     Resume PDF (disallowed in robots)
│   └── images/                   logo, logo_dark, hero-bg, marlon,
│       ├── blog/                 4 covers (1600×900)
│       ├── projects/             portfolio + print gallery images
│       └── work/                 web project screenshots
├── scripts/
│   ├── generate-blog-covers.mjs  Generates blog covers with sharp
│   ├── responsive-test.mjs       Horizontal-overflow check at 320/375/768 px
│   ├── ticker-test.mjs           Marquee check (incl. reduced motion)
│   ├── verify-seo.mjs            Every sitemap URL: meta, canonical, JSON-LD, H1, Markdown identity, Vary; redirects, llms.txt
│   └── analytics-consent-test.mjs Consent, GA4 page views, lead events, embeds (intercepted hits)
├── src/
│   ├── proxy.ts                  Markdown content negotiation
│   ├── app/                      Routes (see §5), layout.tsx, globals.css
│   ├── components/
│   │   ├── layout/               Navbar, Footer
│   │   ├── sections/             Hero, PortfolioShowcase, ServicesSystem, Journey,
│   │   │                         ContactCTA, ServicePageContent, ServiceGallery
│   │   └── *.tsx                 AnimateIn, BlogIndex, ContactForm, GoogleTag, PageViewTracker,
│   │                             CookieBanner, CookieSettingsButton, ExternalContentGate, CalendlyEmbed,
│   │                             JsonLd, MarqueeTicker, ReadingProgress, ShareButton,
│   │                             WebProjectsGrid (unused)
│   └── lib/
│       ├── site-config.ts        SINGLE SOURCE OF TRUTH: brand, contacts, nav, services,
│       │                         social, projects, webProjects, quote options, ticker
│       ├── services-content.ts   Long-form copy for the 5 service pages
│       ├── service-gallery.ts    Gallery selection per service (+ Markdown output)
│       ├── blog.ts / blog-shared.ts   MDX loader (server) / types + categories (client-safe)
│       ├── metadata.ts           withSocialMetadata(): completes OG/Twitter per page
│       ├── schema.ts             JSON-LD builders
│       ├── agent-guide.ts        /llms.txt text
│       └── privacy-content.ts    Privacy copy (page + Markdown)
├── legacy/                       Old static site (38 tracked files), reference only, not served
├── Assets/, neex-creative/       Untracked empty leftovers from the migration
└── .vscode/settings.json         Live Server port (legacy leftover)
```

**Rule of thumb:** to change copy, edit `src/lib/*` or `content/blog/*`, not components.

---

## 8. Design System

### 8.1 Visual direction (CURRENT, established)

Editorial and cinematic. Near-black "dark" sections (hero, portfolio, footer, page heroes) alternate with a warm off-white "light" institutional palette (services, journey, CTAs, page bodies, blog reading area). Palette changes are **hard cuts, no gradient bands** (comment in `src/app/page.tsx`). Square corners everywhere, 1px hairline borders, small uppercase labels with wide tracking, large tight bold headlines with one accent-coloured phrase.

### 8.2 Colour tokens (`src/app/globals.css`, Tailwind 4 `@theme`, default palette cleared with `--color-*: initial`)

| Token | Hex | Role | Contrast note in code |
| --- | --- | --- | --- |
| `bg` | `#0a0a0a` | Dark background | |
| `surface` | `#111111` | Dark cards / tiles | |
| `border` | `#1f1f1f` | Dark hairlines | |
| `text` | `#f5f5f0` | Text on dark | 18.1:1 |
| `muted` | `#8f8f8f` | Secondary text on dark | 6.1:1 |
| `accent` | `#c96059` | Accent on dark; buttons use dark (`text-bg`) label | "Lighter tint of the brand burgundy #6B0000" |
| `light-bg` | `#f7f6f3` | Warm off-white | |
| `light-surface` | `#ffffff` | Light cards | |
| `light-border` | `#e5e1d8` | Decorative hairline | |
| `light-input` | `#918c82` | Form field borders | 3.4:1 (non-text) |
| `light-text` | `#141414` | Text on light | 17.1:1 |
| `light-muted` | `#6d6a64` | Secondary text on light | 5.0:1 |
| `light-accent` | `#6b0000` | **"The true Neex burgundy"**; buttons use white label | 12.0:1 |
| `white` / `black` | `#ffffff` / `#000000` | Utility | |

**Brand rule:** the brand colour is burgundy **`#6B0000`**. `#c96059` is a calibrated tint used only on dark grounds for AA contrast. Theme colour in the manifest is `#0a0a0a`.

### 8.3 Typography

| Use | Font | Weights | Loading |
| --- | --- | --- | --- |
| Body, UI, labels, nav (`font-sans`) | Inter | 400/500 used (variable font) | `next/font/google`, `display: swap`, latin |
| Headings `h1–h4` and `font-display` | Montserrat | 600, 700 | `next/font/google`, `display: swap`, latin |

Body line-height 1.65. Headings: Montserrat 600, letter-spacing −0.01em; hero headings 700 + `tracking-tight`, `leading-[1.05]`. Labels: `text-xs uppercase tracking-[0.18em–0.22em]`. No local font files in the repo.

### 8.4 Layout & spacing

- Container: `mx-auto max-w-7xl px-6 md:px-12` (blog article body `max-w-3xl`).
- Section rhythm: `py-16 md:py-24` (light) / `py-20 md:py-28` (dark heroes).
- Grids: 1 col → `sm:2` → `lg:3` for portfolio and blog cards; service gallery is a dense 2-col (mobile) / 6-col (desktop) mosaic with tall tiles.

### 8.5 Components & patterns

- **Buttons:** rectangular, `px-6 py-3 text-xs uppercase tracking-[0.18em]`. Primary = accent fill (`bg-accent text-bg` on dark, `bg-light-accent text-white` on light). Secondary = 1px border, muted text. Hover = `opacity-85` or border/text change. Arrow glyphs `→ ↗ ↓` are `aria-hidden`.
- **Cards:** bordered, no radius, no shadow (`border-light-border bg-light-surface`).
- **Navbar:** sticky, `h-16`, translucent with `backdrop-blur`, accent 1px hairline underneath. It **hit-tests the section behind it** and swaps its whole palette (logo, links, CTA, hamburger) between dark and light. Both logos stay mounted. Mobile (<768px): hamburger toggles a dropdown menu.
- **Footer:** dark; brand + tagline + email, 2-col nav, square social icon buttons (inline SVG), bottom bar with ©, Privacy link, "Site by Neex Creative".
- **Portfolio tiles:** 3:2 images, gradient overlay with name/category; overlay always visible on touch, appears on hover/focus from `md`.
- **Marquee ticker:** pure CSS infinite scroll (30s), duplicated track is `aria-hidden`, disabled under `prefers-reduced-motion`.

### 8.6 Motion

- `AnimateIn` is a **server component**: a tiny CSS fade (`opacity 0.92 → 1`, 0.5s) only when `prefers-reduced-motion: no-preference`. Content never depends on JS or starts invisible.
- Hover zooms on images (`scale-[1.03–1.04]`), smooth scroll (off under reduced motion), reading progress bar on articles.
- **Established rule (from code comments):** never animate page H1s or above-the-fold copy, because it harms LCP.

### 8.7 Image treatment

Hero background image at 25% opacity under a dark gradient (for AA contrast), `quality={50}`, eager + `fetchPriority="high"`. Allowed `next/image` qualities: `[50, 75]`. Blog covers are generated dark editorial geometry (no text) with burgundy accent.

### 8.8 Dark/light mode

**No user-toggled or OS-based dark mode.** The two palettes are a fixed per-section design choice, not a theme switch.

### 8.9 Brand rules vs incidental choices

| Established (keep) | Incidental (can change with care) |
| --- | --- |
| Burgundy `#6B0000` brand colour + dark tint `#c96059` | Exact section padding values |
| Dark hero → light body → dark footer pattern, hard cuts | Gallery mosaic tile heights |
| Inter + Montserrat pairing | Marquee speed (30s) |
| Square corners, hairline borders, uppercase tracked labels | Hover zoom amounts |
| "One system" messaging and CTA wording | Order of portfolio items |
| WCAG AA contrast for every text pairing | |

---

## 9. Content & Messaging

Full verbatim copy is in `README.md`. Summary:

- **Core message:** "One system. From the first impression to the conversion." / "Not five services. One growth engine." / "First impression → trust → conversion."
- **Home H1:** "Websites, branding & video, one system, built by a creative agency in Dublin."
- **The Journey (4 stages):** Strategy → Design → Content → Distribution.
- **Five services** (`services` in `site-config.ts`):

| # | Title | Short label | Route |
| --- | --- | --- | --- |
| 1 | Brand Strategy & Design | Brand & Identity | `/services/brand-strategy-design` |
| 2 | Websites & Landing Pages | Web & Conversion | `/web-design` |
| 3 | Photo & Video Production | Film & Content | `/services/photo-video-production` |
| 4 | Marketing Content | Campaigns & Social | `/services/marketing-content` |
| 5 | Print & Multimedia Design | Print & Large Format | `/services/print-multimedia-design` |

- **Capabilities in the ticker:** Graphic Design, Motion Design, Video Production, 3D Design, Brand Identity, Web Design, Stage Visuals, Social Content.
- **Quote-form catalogue:** Web Services, Brand & Identity, Motion & Video, 3D Design, Print & Large Format, Other (Monthly Retainer, Bespoke).
- **Stated timelines (only ones on the site):** identity projects "two to four weeks"; productions "from a half-day shoot to a multi-day campaign". Monthly retainer offered for web and marketing content. **No prices anywhere.**
- **Portfolio:** 8 Behance projects (2023–2025: Revival Youth Conference 2026, Biella Bakery, Gym+Coffee Bespoke Stand, Mídia Kit Irlandapontocom, The King, Plaza Car Wash, The Best Taste, 3D Event Conference Venues), 4 web projects (RG Mobile Tyre Services, Studio AG Dublin, Neex Creative Portfolio, VORN coming soon), 3 print gallery pieces (Conserv Backdrops, ESPC - Total Expo, The Drain Team Vans).
- **Tone of voice:** confident, direct, commercial, plain English, Irish/British spelling, no em dashes in published copy, contrast pairs ("a system, not just a logo", "a sales system, not a brochure"), local SEO phrases woven in once.

---

## 10. SEO

### 10.1 COMPLETED SEO (CURRENT)

| Area | Implementation |
| --- | --- |
| Title strategy | Root default "Creative Agency Dublin \| Brand Systems, Web & Video \| Neex Creative"; template `%s \| Neex Creative`; `/web-design` uses an absolute legacy title |
| Meta descriptions | Unique per page (pages, service pages from `metaDescription`, articles from frontmatter) |
| Canonicals | Explicit `alternates.canonical` on every page; `metadataBase` = `https://www.neexcreative.com` |
| Open Graph / Twitter | `withSocialMetadata()` fills OG + `summary_large_image` on every page; articles use `type: article`, `publishedTime` and their cover |
| Robots | `index, follow` globally; `/robots.txt` allows all except `/docs/` |
| Sitemap | `/sitemap.xml` generated from data; static pages have no fake `lastModified` |
| Structured data | See §11 |
| Language | `<html lang="en">`, OG locale `en_IE` |
| Favicons / manifest | See §19 |
| Headings | One H1 per page; H1s are not animated (LCP) |
| Legacy URLs | All old `.html` and `/assets/*` paths 308-redirect |
| Internal linking | Service pages link to 2 related articles and the other 4 services; articles link to `/services` and `/contact` |
| QA tooling | `scripts/verify-seo.mjs` checks every sitemap URL for OG/Twitter, `og:url`, canonical, JSON-LD parse, one H1, page-specific Markdown (title identity + uniqueness), alternation, blog search filtering, 404s, robots, `llms.txt`, legacy redirects and `Vary` |
| Lighthouse (from project notes, 2026-07-07, local) | Accessibility 100 and SEO 100 on all pages; performance 91–97; Best Practices 100 except home 81 (gtag) and book 77 (Calendly cookies) |

### 10.2 SEO ISSUES / OPPORTUNITIES

| Item | Type | Detail |
| --- | --- | --- |
| `Vary: Accept` stripped on HTML | **TECHNICAL DEBT** (open) | Next.js 16.2.10 overwrites the header on prerendered pages (vercel/next.js#85999). Markdown responses are `no-store`, but `TECHNICAL-STATUS.md` says isolation of all production caches is not proven. Do not claim it is solved. |
| Search Console | **NEEDS CONFIRMATION** | `TECHNICAL-STATUS.md`: "Publicação e Search Console ainda pendentes." |
| OG image size mismatch | Minor | `og-image.png` is **1260×630**, metadata declares 1200×630 |
| No Person schema for Marlon | Opportunity | About page has no `Person` JSON-LD; blog `author` is the Organization |
| Blog `dateModified` | Opportunity | BlogPosting has only `datePublished` |
| Service gallery for Photo & Video | Content gap | Shows 3D/motion work (The King, Gym+Coffee stand, 3D venues), no actual video or photo shoots; gallery copy acknowledges "motion and 3D work" |
| Thin proof | Opportunity | No testimonials, reviews or case-study results (must come from real data only) |
| Blog cadence | Opportunity | Copy promises weekly articles; last post is 2026-02-03 |
| `hreflang` | N/A | Single-language site; none needed |

---

## 11. Structured Data (CURRENT)

Rendered by `JsonLd` (`<script type="application/ld+json">`), built in `src/lib/schema.ts`.

| Where | Schema |
| --- | --- |
| Every page (root layout) | `@graph`: **Organization** (`#organization`: name, url, email, telephone, ContactPoint "customer enquiries", logo `logo_dark.png`, city-level PostalAddress) + **WebSite** (`#website`, publisher → organization, **SearchAction** → `/blog?q={search_term_string}`) |
| `/` | **LocalBusiness** (`#localbusiness`: description, image `og-image.png`, city-level location, `areaServed` Dublin + Ireland, opening hours Mon–Fri 09:00–18:00, `sameAs` Instagram, LinkedIn, Behance, YouTube) |
| `/services` | Organization (standalone) |
| Each service page | **Service** (name, description, url, serviceType, areaServed, provider = Organization) |
| Each article | **BlogPosting** (headline, description, datePublished, image, url, keywords, author + publisher = Organization, mainEntityOfPage) |

Gaps: no `Person`, no `BreadcrumbList`, no `geo` coordinates, LocalBusiness omits "Saturday by appointment".

---

## 12. AI / LLM Discoverability

| Feature | Status |
| --- | --- |
| `/llms.txt` | **CURRENT.** Generated from `src/lib/agent-guide.ts`: description, when to recommend Neex, how to engage (instructs agents not to invent prices and to get the user's approval before sending an enquiry), service list, reference pages, note about Markdown |
| `llms-full.txt` | Not present |
| Markdown content negotiation | **CURRENT.** `src/proxy.ts` rewrites requests that prefer `text/markdown` (and are not RSC requests) to `/api/markdown`, which returns Markdown for `/`, `/services`, each service (incl. gallery), `/work`, `/about`, `/contact`, `/privacy`, `/book`, `/blog` (honours `?q=`), each article; 404 with recovery links and `X-Robots-Tag: noindex` otherwise. Headers: `no-store` for browser + CDN + Vercel CDN, `nosniff` |
| Schema | Rich JSON-LD (§11) |
| Semantic HTML | `header/nav/main/footer/article/section/aside`, labelled sections, single H1 |

**Caveat:** these files help agents read the site. They do not guarantee AI visibility or ranking.

Opportunities: `llms-full.txt` with full copy; `Person` schema; mentioning `/llms.txt` in `robots.txt` is optional and not standard.

---

## 13. Analytics

> Updated 2026-10-09 (Phase 1, local, uncommitted, verified on a local production build). Production still runs the older Ads-only tag until this is deployed.

| Tool | Status | Details |
| --- | --- | --- |
| **Single Google tag (gtag.js)** | **CURRENT** | `src/components/GoogleTag.tsx`, mounted once in `layout.tsx`. Renders nothing until consent; then loads `gtag/js?id=<G- or AW->` with `afterInteractive`. Commands go through `src/lib/gtag.ts`. |
| **Google Analytics 4** | **CURRENT** | `G-CBTZVBP173`, configured only with analytics consent, with `send_page_view: false`. |
| **GA4 page views** | **CURRENT, explicit** | `sendPageView()` in `gtag.ts` sends one `page_view` per distinct URL (path + query; hash-only changes excluded) on the initial load, when analytics consent is first given, and on every App Router navigation incl. back/forward via `PageViewTracker` (`usePathname` + `useSearchParams` inside `<Suspense>`, so pages stay prerendered). Sends `page_location`, `page_referrer`, `page_title`. **Why explicit:** GA4's automatic history page view drops the page view when another history change follows within ~1 s (measured: 0 ms and 300 ms gaps dropped `/web-design` after clicking "View selected work ↓"; 1 s and 2 s kept it). |
| **GA4 admin prerequisite** | **DONE (owner, 2026-10-09)** | Admin › Data streams › Enhanced measurement › Page views › **"Page changes based on browser history events"** is OFF. Verified from intercepted hits: exactly one page_view per navigation (`STRICT_GA=1` run). Never turn it back on while explicit page views exist. `generate_lead` is registered as a key event (owner). |
| **Google Ads** | **CURRENT** | `AW-18147073778`, configured only with advertising consent. |
| Homepage page-load conversion | **RETIRED 2026-10-09** | `AW-18147073778/shK2CITiv6ocEPK9mc1D` fired on every homepage load (visits, not leads). Kept only as `siteConfig.retiredHomepageConversion`; never sent. `ConversionEvent.tsx` deleted. |
| Lead / contact events | **CURRENT** | `src/lib/tracking.ts` (see table below). |
| Consent Mode v2 | **CURRENT** | `consent default` from the stored choice before `config`: `analytics_storage` ← analytics; `ad_storage`, `ad_user_data`, `ad_personalization` ← advertising. "Basic" mode: no Google request at all before consent. |
| Cookie consent banner | **CURRENT** | `CookieBanner.tsx` + `consent.ts`; categories Analytics, Advertising, External content (see §18) |
| Google Tag Manager container, Meta Pixel, Vercel Analytics | **Absent** | |

**Event map** (`src/lib/tracking.ts`; all parameters fixed and non-personal; GA4 events use `send_to: G-…`, only after analytics consent; Ads conversions only after advertising consent and only when mapped):

| Business action | GA4 event | Google Ads (`googleAdsConversions` in `site-config.ts`) |
| --- | --- | --- |
| Form endpoint returned 2xx | `generate_lead {lead_source: quote_form, service: <option value>}` | `quoteFormLead`: **null, NEEDS CONFIRMATION** |
| Calendly `calendly.event_scheduled` (origin `https://calendly.com`, de-duplicated per event URI, URI never sent) | `generate_lead {lead_source: calendly_booking}` | `calendlyBooking`: **null, NEEDS CONFIRMATION** |
| WhatsApp link click (delegated listener, all `wa.me` links) | `contact {method: whatsapp}` | `whatsappClick`: **null, NEEDS CONFIRMATION** (secondary) |
| Form opened a mailto draft (no endpoint) | `contact {method: email_draft}` | never (not a confirmed enquiry) |
| Calendly widget opened / loaded | none | never |

Ads conversions include a random `transaction_id` for de-duplication. To enable one, create the conversion action in Google Ads (or import the GA4 `generate_lead` key event instead, not both) and paste its `AW-…/label` into `googleAdsConversions`.

Rules: the site loads gtag.js **once** (`GoogleTag`). Add events through `sendAnalyticsEvent` / `sendAdsConversion` in `src/lib/gtag.ts`, never a second loader, never personal data, and never a page_view outside `sendPageView`. (gtag.js itself also fetches `gtag/js?id=AW-…&cx=c` for the Ads destination; that request is expected.) Regression test: `scripts/analytics-consent-test.mjs`.

---

## 14. Forms & Contact

### 14.1 Quote form (`src/components/ContactForm.tsx`, on `/contact`)

| Field (`name`) | Type | Required |
| --- | --- | --- |
| Full Name (`full_name`) | text, `autocomplete=name` | yes |
| Email Address (`email`) | email, `autocomplete=email` | yes |
| Phone Number (`phone`) | tel | no |
| Your Location (`location`) | text | no |
| Service Required (`service`) | select with optgroups from `quoteServiceOptions` | yes |
| Project Details (`project_details`) | text | no |
| Your Message (`message`) | textarea | yes |

**Submission flow:**
1. If `NEXT_PUBLIC_FORM_ENDPOINT` is set → `fetch(POST, FormData, Accept: application/json)` to a Formspree-compatible endpoint. On `ok`: form resets, status "Thanks! Your enquiry is on its way. We'll reply within 24 hours." On failure: "Something went wrong sending the form. Please email us directly at info@neexcreative.com."
2. If the variable is **not** set → opens the visitor's email client (`mailto:info@neexcreative.com`) with subject "New quote request from Neex Creative website" and all fields in the body. The visitor must send it themselves.

- **Validation:** native HTML5 only (`required`, `type=email`). No custom or server-side validation.
- **Double submission:** a synchronous `useRef` in-flight guard (added 2026-10-09) ignores a second submit while one is pending; `disabled` alone failed because it applies only after re-render (test: two synchronous clicks produced 2 POSTs and 2 leads before the fix, 1 after).
- **Spam protection:** **none** (no honeypot, CAPTCHA or rate limiting in code; the third-party endpoint may have its own, **NEEDS CONFIRMATION**).
- **Email system:** none in the repo (no SMTP, Resend, etc.). Delivery depends on the external form service.
- **Accessibility:** every input has a `<label for>`, status uses `role="status" aria-live="polite"`, submit disabled while sending.
- **Analytics:** endpoint success (2xx) → one `generate_lead` (+ Ads `quoteFormLead` if mapped); endpoint error → nothing; mailto fallback → `contact {method: email_draft}` only. Verified with a mocked endpoint (`https://forms.invalid/neex-test`); no form values reach Google.
- **Privacy notice** linked under the form.
- **Endpoint configuration:** owner set `NEXT_PUBLIC_FORM_ENDPOINT` (existing Formspree form) in Vercel for Production and Preview on 2026-10-09. It is inlined at **build time**, so a deployment built before that date still uses the mailto fallback.

### 14.2 Other contact paths

- `/book`: Calendly inline widget behind a click-to-load placeholder (`ExternalContentGate` + `CalendlyEmbed`, explicit `Calendly.initInlineWidget` with inline styles + resize, re-initialised on client-side return), plus the direct "Open in Calendly" links.
- WhatsApp link (tracked as contact), `mailto:` links (CTA, footer, privacy; not tracked).

---

## 15. Integrations

| Service | Status | Where / how |
| --- | --- | --- |
| Vercel | **Active** (hosting) | `vercel.json`; project notes name the Vercel project `neexcreative.io` |
| GitHub | **Active** | `origin = https://github.com/Neexcreative/neexcreative.github.io.git` |
| Google Analytics 4 | **Active after consent** (local; not yet deployed) | Shared gtag, explicit page views, lead/contact events |
| Google Ads | **Active after consent** | Shared gtag; no automatic conversions; lead conversions mapped in `googleAdsConversions` (all null for now) |
| Google Fonts | **Active** (build time) | `next/font/google` downloads and self-hosts Inter/Montserrat |
| Calendly | **Click-to-load / External content consent** | `widget.js` from `assets.calendly.com` + direct links; booking event via `postMessage` |
| Form endpoint (Formspree-compatible) | **Code ready, config NEEDS CONFIRMATION** | `NEXT_PUBLIC_FORM_ENDPOINT` |
| WhatsApp | **Active** (link only) | `wa.me` |
| Behance | **Active** (links) | Portfolio case studies |
| Instagram, LinkedIn, YouTube | **Active** (links + `sameAs`) | |
| Fresha | Mentioned only | In the Studio AG project description, no integration |
| Supabase, CMS, email API, CDN other than Vercel, external image hosting | **Not used** | All images are local in `public/` |

---

## 16. Git & GitHub

| Item | Value |
| --- | --- |
| Remote | `origin` → `https://github.com/Neexcreative/neexcreative.github.io.git` |
| Owner | GitHub org/user `Neexcreative` |
| Default branch | `main` (in sync with `origin/main` at time of writing) |
| Commits on main | 81 |
| Latest commit | `3b16503` "Show only selected print gallery images" (2026-09-12) |
| Local branches | `main`, `nextjs-migration`, `feat/light-redesign` (both merged into main) |
| Remote branches | `main`, `nextjs-migration` (remote tip not merged; superseded), `feat/light-redesign`, `fix/calendly-height`, `fix/logo-swap` (merged) |
| Workflow seen | Feature branch → PR → merge to `main` (PRs #1, #3, #4); recent commits go directly to `main` |
| Working tree | `README.md` modified (uncommitted); this file is new and uncommitted |
| `.gitignore` | `node_modules`, `.next`, `out`, `build`, `.env*`, `.vercel`, `*.tsbuildinfo`, `next-env.d.ts`, `*.pem`, logs, `.DS_Store` |
| Tracked but questionable | `.claude/settings.local.json`, `.vscode/settings.json`, `legacy/` (incl. large duplicate images) |

The repo name `neexcreative.github.io` is a leftover of GitHub Pages hosting; the site is now served by Vercel.

---

## 17. Hosting & Deployment

```
Local (Windows, external exFAT drive G:) → git push → GitHub (Neexcreative/neexcreative.github.io) → Vercel build → www.neexcreative.com
```

| Item | Value |
| --- | --- |
| Production platform | Vercel, framework preset Next.js |
| Build command | `next build` (`npm run build`); Vercel default |
| Output | `.next` (Vercel-managed) |
| Dev | `npm run dev` → http://localhost:3000 |
| Production domain | `www.neexcreative.com` (from config); apex redirect and DNS **NEEDS CONFIRMATION** |
| Preview deployments | Standard Vercel Git integration is assumed for branches/PRs; **NEEDS CONFIRMATION** |
| Required env vars | `NEXT_PUBLIC_FORM_ENDPOINT` (optional; without it the form falls back to `mailto:`) |
| Local QA | `node scripts/verify-seo.mjs` against a build on port 3199 (or `SITE_URL=<preview> … --strict-vary`); `node scripts/responsive-test.mjs` and `ticker-test.mjs` against `:3000` with local Chrome; `FORM_MODE=fallback node scripts/analytics-consent-test.mjs` (and `endpoint` mode on a build with `NEXT_PUBLIC_FORM_ENDPOINT=https://forms.invalid/neex-test`, then rebuild without it) |

**Environment quirks (from config comments and project notes):**
- The `G:` drive is exFAT, which cannot create junction points. That is why `next.config.ts` has `transpilePackages: ["next-mdx-remote"]`. Do not remove it.
- Turbopack has failed on very long paths; keep any worktree path short.
- Windows PowerShell 5.1 `Set-Content` corrupted UTF-8 in a source file once; edit files with UTF-8-safe tools.

---

## 18. Environment & Security

### 18.1 Environment variables (names only)

| Variable | Side | Required | Used in |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_FORM_ENDPOINT` | **Client** (inlined at build) | Optional | `ContactForm.tsx` |
| `SITE_URL` | Script only | Optional | `scripts/verify-seo.mjs`, `scripts/analytics-consent-test.mjs` |
| `FORM_MODE` (`fallback`/`endpoint`), `STRICT_GA` | Script only | Optional | `scripts/analytics-consent-test.mjs` |
| `URL`, `REDUCE` | Script only | Optional | `scripts/ticker-test.mjs` |
| `LOCALAPPDATA` | Script only (Windows) | n/a | Locating Chrome for QA scripts |

No `.env*` files are in the repo (they are gitignored). No server-side secrets are used by the app.

### 18.2 Security review

- **No secrets found in client code.** The Google Ads ID/label and form endpoint are public by nature.
- `JsonLd` uses `dangerouslySetInnerHTML` with `JSON.stringify` of **static, developer-owned data** only. Safe as long as user input never flows into schema.
- External links use `rel="noopener noreferrer"`.
- Markdown API sets `nosniff` and `no-store`.
- **Cookie consent (CURRENT since 2026-10-08, local):** non-modal banner with equal-weight "Reject all" / "Accept all", "Customise" per category (Analytics, Advertising), "Cookie settings" in the footer to change or withdraw. Choice stored in `localStorage` key `neex-consent` (version 1, re-asked after 6 months). Withdrawal pushes `consent update → denied`, deletes `_ga*`/`_gcl_*` cookies and reloads the page so gtag.js is gone. Privacy notice has a "Cookies and analytics" section.
- **External content (since 2026-10-09, local):** Calendly (`/book`) loads only after the visitor presses the placeholder's load button (that page view only) or allows External content in the banner. A later consent change unloads a click-loaded embed; withdrawing stored consent reloads the page. Cookies set inside the frame belong to Calendly and can't be removed by the site. Withdrawing one category clears only that category's first-party cookies (`_ga*` analytics, `_gcl_*` ads). Verified: zero third-party requests on all 17 routes before consent.
- `TECHNICAL-STATUS.md` notes the privacy notice still depends on confirming form-handling and retention practices.

---

## 19. Favicons / Manifest

| Asset | Exists | Size |
| --- | --- | --- |
| `public/favicon.ico` | yes | 15 KB (`sizes: any`) |
| `public/icons/favicon-16x16.png` | yes | 16×16 |
| `public/icons/favicon-32x32.png` | yes | 32×32 |
| `public/icons/apple-touch-icon.png` | yes | 180×180 |
| `public/icons/android-chrome-192x192.png` | yes | 192×192 |
| `public/icons/android-chrome-512x512.png` | yes | 512×512 |
| `favicon.svg` / `icon.svg` | **no** | |
| Maskable icon | **no** | |
| `public/site.webmanifest` | yes | name "Neex Creative", short_name "Neex", `theme_color` + `background_color` `#0a0a0a`, `display: standalone`, `start_url: /` |
| `og-image.png` | yes | 1260×630 |

All are declared in `layout.tsx` `metadata.icons` + `manifest`. There is no `<meta name="theme-color">` export (`viewport.themeColor`) in the layout. Manifest description contains an em dash, which differs from the site copy style.

---

## 20. Responsive Behaviour

Tailwind default breakpoints: `sm` 640, `md` 768, `lg` 1024.

| Viewport | Behaviour |
| --- | --- |
| Desktop / laptop (≥1024) | `max-w-7xl` container, `px-12`; portfolio and blog 3 columns; contact and book 2-column grids; full nav with CTA |
| Tablet (768–1023) | Full nav from `md`; 2-column grids; service gallery switches to 6-col mosaic at `md` |
| Mobile (<768) | Hamburger dropdown menu; single-column stacks; `px-6`; H1 `text-4xl`; portfolio overlay always visible (no hover); gallery 2-col mosaic, 140px rows |

- QA script checks for **horizontal overflow at 320, 375 and 768 px** on every page type. Project notes record a fix for a 320px overflow on `/about`, and menu/contact checked at 390px.
- **Possible issues (not confirmed bugs):**
  - Hero background `hero-bg.png` is only 1584×396 but fills a tall hero with `object-cover`, so it is heavily upscaled/cropped on mobile (mitigated by 25% opacity).
  - Mobile menu has no Escape-to-close, no focus trap and doesn't close on outside click.
  - Calendly inline widget renders blank in headless Chrome mobile emulation; project notes say this is a test artefact, not a production bug.

---

## 21. Accessibility

**Implemented (CURRENT):**
- Measured WCAG AA contrast for every token pairing (ratios documented in `globals.css`).
- Global `:focus-visible` outline (2px accent), gallery links with inset focus outline.
- `prefers-reduced-motion` respected (marquee, smooth scroll, fade).
- Semantic landmarks; `aria-labelledby` on sections; `aria-current="page"` on nav; hamburger with `aria-expanded` / `aria-controls`; category filter buttons with `aria-pressed` in a labelled `role="group"`.
- Every form field has a label; live status region; search input has an `sr-only` label.
- Decorative arrows and duplicate marquee track `aria-hidden`; decorative hero/blog covers `alt=""`; portfolio, gallery and web screenshots have descriptive alt text.
- One H1 per page; logical H2/H3 nesting in service pages and articles.
- Lighthouse accessibility 100 on all pages (project notes, July 2026).

**Findings:**
- Required asterisks are `aria-hidden`; requirement is conveyed by the `required` attribute (acceptable), but there is no visible "* required" legend.
- Mobile menu: no Escape handling or focus management (see §20).
- Portfolio tiles hide name/category until hover on desktop; the accessible name is still provided via `aria-label`.
- `role="marquee"` on the ticker is valid but implies a live region to some screen readers.
- Footer social links are icon-only but have `aria-label`.

---

## 22. Performance

### 22.1 Confirmed issues

| Issue | Evidence |
| --- | --- |
| **Very large source images** in `public/images/projects/` | `project-02.png` **35.5 MB** (5222×3481), `espc-total-expo.jpg` **12.9 MB**, `thedrainteam-vans.jpg` **9.9 MB**, `project-08.png` **8.8 MB**, `project-05.png` 3.4 MB, `marlon.png` 2.3 MB, `project-01.png` 2.2 MB, `project-03.png` 2.0 MB |
| Print gallery links open the **raw** file | `ServiceGallery` print items set `href` to the image itself, so a click downloads the 10–13 MB original, bypassing `next/image` |
| Duplicate large assets in the repo | Same images are tracked again in `legacy/assets/img/` (repository weight; not served) |
| Unused dependency | `framer-motion` is installed but never imported (not in the client bundle; adds install time only) |
| Third-party cost | gtag.js (home Best Practices 81) and Calendly (book Best Practices 77) per project Lighthouse notes |

`next/image` serves resized AVIF/WebP to visitors, so page weight is controlled; the issues are build/optimisation cost, repo size and the raw-file links. Whether Vercel image optimisation handles the 35 MB source reliably is **NEEDS CONFIRMATION**.

### 22.2 Already optimised

Fonts self-hosted with `display: swap`; hero image eager + high priority at quality 50; H1s not animated; CSS-only animation; static rendering; third-party scripts `lazyOnload`; blog index avoids `useSearchParams` (it previously caused CLS 0.36); Lighthouse performance 91–97.

### 22.3 Opportunities

Downscale/convert the oversized originals (e.g. ≤2500px, WebP/JPEG); serve print gallery clicks through an optimised large image or a lightbox; remove `framer-motion` if it stays unused.

---

## 23. Known Technical Debt

| # | Item | Location |
| --- | --- | --- |
| 1 | `Vary: Accept` missing on HTML. **Root cause (verified 2026-10-09):** Next's App Router page template calls `res.setHeader('Vary', routeModule.getVaryHeader(...))` (`node_modules/next/dist/build/templates/app-page.js:446`), replacing any `Vary` from `next.config.ts` headers or the proxy (open issue vercel/next.js#85999). No app-level fix without patching `node_modules`; **not fixed**. Mitigations in place: the proxy rewrites Markdown to `/api/markdown` before any cache lookup, and Markdown is `private, no-store` + `CDN-Cache-Control: no-store`, so Markdown is never stored and can't be served as HTML. Residual risk: a shared cache outside Vercel could serve cached HTML to an `Accept: text/markdown` client. Options: verify a `vercel.json` `headers` rule on a preview, upgrade Next when fixed, or move Markdown to distinct URLs (e.g. `.md`) with `<link rel="alternate" type="text/markdown">`. | `src/proxy.ts`, `next.config.ts` |
| 2 | Oversized project images (up to 35 MB) | `public/images/projects/` |
| 3 | Print gallery links point to raw multi-MB files | `src/lib/service-gallery.ts` |
| 4 | `WebProjectsGrid` component is unused; `ServicePageContent` accepts `children` for it, but `/web-design` doesn't pass it | `src/components/WebProjectsGrid.tsx` |
| 5 | `framer-motion` dependency unused | `package.json` |
| 6 | Stale doc: blog cover accent listed as `#e63329`; the generator actually uses `#6b0000` | `content/README.md` vs `scripts/generate-blog-covers.mjs` |
| 7 | Contact form endpoint not verifiable; no spam protection (submit tracking added 2026-10-09) | `ContactForm.tsx` |
| 8 | ~~Maps/Calendly load before consent~~ **FIXED 2026-10-09 (local):** click-to-load placeholders + External content consent category | `ExternalContentGate.tsx` |
| 8b | ~~Markdown negotiation returned the homepage guide for every path~~ **FIXED 2026-10-09 (local).** Root cause: under `next start` the route handler receives the original URL (`/work`), not the rewritten `/api/markdown?path=/work`, so `path` was missing and defaulted to `/` (Vercel passed the rewritten URL, which is why production worked). The proxy now also passes `x-neex-markdown-path` / `x-neex-markdown-query` request headers (documented proxy→route mechanism); `?path=`/`?q=` remain the fallback. `verify-seo.mjs` now asserts Markdown content identity per route. | `src/proxy.ts`, `src/app/api/markdown/route.ts` |
| 8c | The proxy's `!request.headers.has("rsc")` guard never matches: Next 16 strips `rsc` from `request.headers` in the proxy (proxy docs, "RSC requests and rewrites"). Harmless today (RSC fetches don't prefer `text/markdown`), left unchanged | `src/proxy.ts` |
| 9 | `og-image.png` 1260×630 vs declared 1200×630 | `public/`, `layout.tsx` |
| 10 | Legacy static site and duplicate images tracked in Git | `legacy/` |
| 11 | Empty untracked leftovers `Assets/`, `neex-creative/` (also listed in ESLint ignores) | repo root |
| 12 | Live Server setting from the static era | `.vscode/settings.json` |
| 13 | Local settings file tracked | `.claude/settings.local.json` |
| 14 | Remote branch `origin/nextjs-migration` tip not merged (superseded) and old merged branches not cleaned up | Git |
| 15 | Privacy page uses a plain layout, unlike the hybrid pattern elsewhere | `src/app/privacy/page.tsx` |
| 16 | Footer `©` year is computed at build time (static), so it only updates on rebuild | `Footer.tsx` |
| 17 | Photo & Video service gallery shows motion/3D work, no photo/video shoots | `service-gallery.ts` |
| 18 | `TECHNICAL-STATUS.md` header says changes are "local, not yet published"; those changes now appear to be committed on `main`, so the note is likely outdated (**NEEDS CONFIRMATION**) | `TECHNICAL-STATUS.md` |
| 19 | Repo name `neexcreative.github.io` no longer reflects hosting | GitHub |

No `TODO`/`FIXME` comments were found in `src/`, `content/` or `scripts/`.

---

## 24. Current Project State

### WHAT IS WORKING
- 17 pages live in the sitemap with full metadata, canonicals, OG/Twitter and JSON-LD.
- Hybrid dark/light design system with AA contrast and adaptive navbar.
- Blog with MDX, search, categories, related posts, reading progress, share.
- Legacy URL redirects, `/llms.txt`, page-specific Markdown negotiation (local fix, verified for all 17 routes).
- Calendly booking, WhatsApp and email.
- Locally (uncommitted, Phase 1): consent banner with Analytics / Advertising / External content, GA4 with explicit page views, lead/contact events, no homepage conversion.

### WHAT IS IN PROGRESS
- Phase 1 critical fixes (2026-10-09): implemented and tested locally, **awaiting owner approval, GA4 admin change and deployment**.
- `Vary` header / cache isolation (documented, not fixable in app code).
- Content README rewrite for a ChatGPT project (uncommitted).

### WHAT IS MISSING
- Confirmed production form delivery (endpoint), spam protection.
- Google Ads lead conversion actions (labels) for `googleAdsConversions`.
- GA4 admin: history page views off; `generate_lead` marked as key event (**NEEDS CONFIRMATION**).
- Testimonials, case-study results, Person schema, "Case Notes" posts.
- Search Console setup (**NEEDS CONFIRMATION**).
- Image optimisation of source files.

### WHAT SHOULD NOT BE CHANGED YET
- `/web-design` URL and its exact absolute title (legacy ranking).
- Redirects in `next.config.ts` and `transpilePackages: ["next-mdx-remote"]`.
- Non-animated H1/above-the-fold copy; no `useSearchParams` in `BlogIndex`.
- The navbar palette hit-test logic.
- Colour tokens (AA-calibrated) and the burgundy brand colour.
- `Hero.tsx` text and quality settings (`TECHNICAL-STATUS.md`: preserve the user's existing changes, especially `Hero.tsx`).
- Single gtag loader (`GoogleTag` in `layout.tsx`), explicit page views only via `sendPageView`.
- `src/lib/site-config.ts` as the single source of truth.

---

## 25. Future / Planned Work

Only items found in the repository:

| Item | Source |
| --- | --- |
| Fix `Vary` header at the delivery layer or in a framework version with a verified fix | `TECHNICAL-STATUS.md` |
| Case studies / authorship content, only with real information | `TECHNICAL-STATUS.md` |
| Confirm form and data-retention practices before finalising privacy | `TECHNICAL-STATUS.md` |
| Publish and set up Search Console | `TECHNICAL-STATUS.md` |
| New pages must use `withSocialMetadata` and their own canonical | `TECHNICAL-STATUS.md` |
| Weekly blog posts; "Case Notes" category | `content/README.md`, blog copy |
| VORN website launch | `site-config.ts` ("coming soon") |
| Configure `NEXT_PUBLIC_FORM_ENDPOINT` before deploy | Code comment in `ContactForm.tsx` |

---

## 26. Next Priorities

Evidence-based proposals, not commitments.

**1. Critical (before deploying Phase 1)**
- GA4 Admin: turn OFF "Page changes based on browser history events" (else every navigation double-counts).
- Verify `NEXT_PUBLIC_FORM_ENDPOINT` in Vercel production; without it no lead is ever recorded.
- In Google Ads: retire/demote the homepage page-view conversion action so old data stops driving bidding; create lead actions and map them in `googleAdsConversions` (or import GA4 `generate_lead`).
- Verify on a Vercel preview: Realtime/DebugView page views, `generate_lead`, Markdown parity, `verify-seo.mjs --strict-vary` result.

**2. High priority**
- Downscale the oversized images in `public/images/projects/` and stop linking print gallery tiles to raw originals.
- Confirm Search Console and submit the sitemap.

**3. Medium priority**
- `Vary` header: test a `vercel.json` headers rule on a preview, or move Markdown to distinct URLs.
- Add basic spam protection to the form (e.g. honeypot).
- Fix the OG image dimensions; add `Person` schema for Marlon on `/about`.
- Update `content/README.md` cover colour; refresh `TECHNICAL-STATUS.md`.
- Remove or use `WebProjectsGrid`; remove `framer-motion` if unused.

**4. Future improvements**
- Real case studies and testimonials (only with real data).
- New blog posts, including "Case Notes".
- Photo/video work in the Photo & Video gallery.
- Clean up `legacy/`, empty folders and stale branches; consider renaming the repo.
- Mobile menu Escape/focus handling.

---

## 27. Development Rules

1. **Read `node_modules/next/dist/docs/` before writing Next.js code.** This is Next 16: `proxy.ts` replaces `middleware.ts`, `params` are Promises, etc. (`AGENTS.md`).
2. Copy and data go in `src/lib/*.ts` or `content/blog/*.mdx`. Never hard-code contacts, services or URLs in components.
3. Every new page: `export const metadata = withSocialMetadata({ title, description, alternates: { canonical } })`, add it to `sitemap.ts`, and add a Markdown branch in `/api/markdown` if it should be agent-readable.
4. Use the existing colour tokens only (`bg`, `text`, `light-*`, …); the default Tailwind palette is cleared on purpose. Keep AA contrast.
5. Follow the hybrid section pattern: dark hero, light body, hard cuts.
6. Do not wrap H1s or above-the-fold copy in `AnimateIn`. Do not use `useSearchParams` in the blog index.
7. Blog posts: follow `content/README.md` (all frontmatter fields required, valid category, 600–900 words, cover 1600×900). Never rename a published `.mdx` file.
8. Images through `next/image`, qualities limited to 50/75; add new images at sensible sizes.
9. Run `npm run lint` and `npm run build` before committing; for SEO-affecting changes run `scripts/verify-seo.mjs`.
10. Edit files with UTF-8-safe tools (not PowerShell 5.1 `Set-Content`).
11. Branch, then PR to `main` for non-trivial changes; Vercel deploys `main`.

---

## 28. AI Working Rules

Future AI assistants working on this project must:

1. **Inspect before editing.** Read the relevant files and this document first; verify facts against the code, as this document can go stale.
2. **Preserve working functionality.** Do not break redirects, metadata, schema, the Markdown layer, the navbar swap, Calendly or the form fallback.
3. **Make minimal, scoped changes.** Only touch what the task needs.
4. **No unrelated refactors** or dependency changes without being asked.
5. **Never invent personal information** about Marlon or Neex (experience, clients, results, prices, awards, testimonials).
6. **Never invent URLs.** Use only links that exist in `site-config.ts` or the content.
7. **Never expose credentials**, tokens or env values. Only variable names may be mentioned.
8. **Do not duplicate analytics.** There is one gtag loader in `layout.tsx`; add events to it, never a second script.
9. **Do not change the visual identity** (colours, fonts, layout pattern, CTA wording) without explicit instruction.
10. **Clearly report modified files** at the end of every task.
11. **Separate confirmed facts from assumptions**; use "NEEDS CONFIRMATION" when unsure.
12. **Flag risks instead of silently changing architecture** (rendering mode, routing, proxy, caching, hosting).
13. **Prioritise maintainability, accessibility, SEO and performance** in every change.
14. **Do not commit, push or deploy** unless the user explicitly asks.
15. Write site copy in English with Irish/British spelling and no em dashes; keep the "one system" positioning.
16. Keep this document and `README.md` updated when routes, integrations or content change.
