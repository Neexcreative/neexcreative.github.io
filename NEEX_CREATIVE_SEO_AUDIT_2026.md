# Neex Creative — Complete SEO & AI Search Audit 2026

**Audit date:** 8 October 2026  
**Production site:** https://www.neexcreative.com  
**Repository audited:** `Neexcreative/neexcreative.github.io`, local working tree  
**Framework:** Next.js 16.2.10, React 19.2.4, TypeScript, Tailwind CSS 4  
**Scope:** Technical SEO, on-page SEO, local SEO, structured data, AI-search readiness, performance, accessibility, analytics, conversion tracking, privacy and trust  
**Mode:** Audit only. No website source code was changed.

---

## Audit basis and limitations

This report distinguishes four evidence states:

- **VERIFIED IN CODE:** directly confirmed in the current local working tree.
- **VERIFIED IN PRODUCTION:** reproduced against `https://www.neexcreative.com` on 8 October 2026.
- **NEEDS CONFIRMATION:** requires account access, business confirmation or a deployed retest.
- **NOT TESTED:** a required tool or dataset was unavailable.

The working tree already contained uncommitted GA4 and cookie-consent work before this audit. Those files were inspected as the current local implementation but were not edited. Production is on an older state: it still loads Google Ads without consent and does not contain the local GA4/consent changes.

No Google Search Console, Google Analytics, Google Ads, Google Business Profile, Bing Webmaster Tools, Vercel Analytics or form-provider account access was available. Therefore, this report does not claim rankings, search volume, indexed-page totals, genuine lead counts, field Core Web Vitals or rich-result eligibility.

Lighthouse was not installed and no dependency was installed. A custom headless-Chrome lab check was run without artificial throttling; its timings are diagnostic only and are not PageSpeed scores or field Core Web Vitals.

---

# A. Executive Summary

Neex Creative has a sound SEO foundation: all 17 intended public pages are statically rendered or statically generated, production pages return `200`, canonicals and social metadata are present, the sitemap and robots file are accessible, legacy `.html` URLs redirect permanently, content is visible in server HTML, service pages target commercially relevant Dublin/Ireland intents, and structured data parses as JSON.

The largest weaknesses are measurement integrity, consent, machine-readable delivery and commercial proof:

1. **Production tracking is not privacy-safe:** Google Ads loads and sets `_gcl_au` before any choice. Google Maps and Calendly also contact third parties before consent.
2. **The homepage visit is counted as a Google Ads conversion:** this measures visits, not genuine leads, and can distort campaign optimisation and reporting.
3. **GA4 is not deployed:** the production site contains only `AW-18147073778`. The local implementation sends the initial GA4 page view after consent, but a tested App Router navigation did not generate a GA4 `page_view`; only Google Ads history events were observed.
4. **The local Markdown layer has regressed:** page-specific `Accept: text/markdown` requests return the homepage agent guide. Production currently returns the correct page Markdown, so deploying the present local build would reduce AI/machine-readable accuracy.
5. **HTML responses omit `Vary: Accept`:** production Markdown responses vary correctly, but HTML responses expose only Next.js router vary tokens. That leaves HTML/Markdown CDN cache isolation unproven.
6. **On-site proof is weak:** portfolio items mostly send users to Behance or external websites. There are no substantive on-site case studies, verified outcomes, testimonials or visible author bylines.
7. **Performance risk is concentrated in source assets and third parties:** project originals reach 34.72 MB, print-gallery links can open raw multi-megabyte files, and Maps/Calendly/Google tags add third-party work.

Overall, the site is technically indexable and well structured, but its deployed analytics cannot be trusted as a lead-measurement system and its consent posture is not suitable for an Ireland/EU audience. The most valuable next phase is a focused analytics/privacy release, followed by machine-readable delivery fixes, on-site case studies and image optimisation.

---

# B. Audit Scorecard

## Methodology

Scores start from 100 and deduct for reproducible defects in the category. Critical findings generally deduct 15–25 points, high findings 8–15, medium findings 3–7 and low findings 1–2. Missing account access is not treated as a failed test, but it limits the maximum confidence of affected categories. The overall score is the equal-weight mean of the nine requested categories, rounded to the nearest whole number.

| Category | Score | Confidence | Basis |
| --- | ---: | --- | --- |
| Technical SEO | 82/100 | High | Strong static rendering, sitemap, robots, canonicals and redirects; reduced by `Vary`, redirect-chain, 404 metadata and local Markdown defects. |
| On-Page SEO | 73/100 | High | Unique titles/descriptions/H1s and strong service copy; reduced by generic hub titles, weak proof, no breadcrumbs/bylines and limited topic coverage. |
| Local SEO | 62/100 | Medium | Consistent Dublin NAP and LocalBusiness data; GBP, citations and real local authority remain unverified. |
| Structured Data | 74/100 | Medium-high | JSON-LD parses and covers Organization, WebSite, LocalBusiness, Service and BlogPosting; entity relationships, Person and BreadcrumbList need work. |
| Performance | 72/100 | Medium | Static pages, `next/image`, self-hosted fonts and zero lab CLS are positives; very large sources, raw links and third parties are material risks. No field data. |
| Mobile Experience | 86/100 | High | No horizontal overflow at six requested widths across 11 representative routes; mobile-menu keyboard behaviour and 40×40 target remain. |
| Accessibility | 82/100 | Medium-high | Strong semantics, contrast tokens, focus styles, reduced motion and labelled forms; menu focus/Escape and full automated WCAG testing remain. |
| AI Search Readiness | 70/100 | Medium-high | Crawlable HTML, `llms.txt`, Markdown and clear entity copy; reduced by local Markdown regression, missing HTML `Vary`, limited source attribution and authorship. |
| Analytics & Conversions | 22/100 | High | GA4 absent in production, false homepage conversion, pre-consent tracking and no genuine lead-event coverage. |

**Overall score: 69/100.** This score reflects good crawl/index foundations held back by critical analytics/privacy defects and underdeveloped commercial evidence.

---

# C. Critical Issues

## SEO-001 — Production Google Ads runs before consent

**VERIFIED IN PRODUCTION.** A fresh headless browser loaded `https://www.googletagmanager.com/gtag/js?id=AW-18147073778`, sent Google Ads requests and created `_gcl_au` without displaying a consent interface. Ireland’s Data Protection Commission states that consent is normally required for cookies and similar technologies unless strictly necessary; analytics cookies require consent.

**Impact:** Irish/EU ePrivacy/GDPR exposure, loss of user trust and an unreliable consent record. This is a compliance risk assessment, not a legal determination.

## SEO-002 — A homepage visit is recorded as an Ads conversion

**VERIFIED IN PRODUCTION and VERIFIED IN CODE.** `ConversionEvent` fires `AW-18147073778/shK2CITiv6ocEPK9mc1D` when the homepage mounts. Runtime evidence showed a Google Ads `conversion` request immediately on a normal visit.

**Impact:** visits are mislabelled as outcomes. Campaign bidding and conversion reports may optimise for page loads rather than quote requests, WhatsApp contacts or booked calls.

## SEO-003 — GA4 is absent in production and local SPA page views are incomplete

**VERIFIED IN PRODUCTION.** Production contains `AW-18147073778` but not `G-CBTZVBP173`.

**VERIFIED IN LOCAL BUILD.** After “Accept all”, the local implementation loaded one site-authored Google tag, configured GA4 and Ads, and sent one initial GA4 `page_view`. After a client-side `<Link>` navigation from `/` to `/services`, Google Ads history requests appeared but no GA4 collection request was observed. No duplicate GA4 page view was observed because the navigation page view was missing.

The installed Next.js 16 documentation says automatic route page views depend on GA4 Enhanced Measurement and the “Page changes based on browser history events” setting. That GA account setting is **NEEDS CONFIRMATION**. If it cannot be made reliable, use explicit App Router page-view dispatch with automatic history page views disabled, never both.

## SEO-004 — Maps and Calendly load before consent

**VERIFIED IN CODE and LOCAL BUILD.** Before any cookie choice, `/contact` requested Google Maps/Maps API resources and `/book` requested Calendly scripts and the embedded booking page. Production behaves equivalently for these embeds.

**Impact:** third parties receive technical data before a user choice; the cookie banner controls Analytics/Ads only and does not gate these non-essential embeds.

---

# D. High-Priority Issues

## SEO-005 — Local page-specific Markdown negotiation is broken

**VERIFIED IN LOCAL BUILD; production currently passes.** Requests such as:

```text
Accept: text/markdown
GET /web-design
GET /blog?q=brand
```

returned the homepage `# Neex Creative` agent guide locally instead of the requested page. `scripts/verify-seo.mjs` passed its per-page content-type checks but then failed on:

```text
assert.ok(query.includes('No articles match your search.'))
```

Production currently returns correct page-specific Markdown and correct blog query filtering. Do not deploy the current local build until rewrite query propagation is corrected and assertions verify page identity, not only status/content-type.

## SEO-006 — HTML responses do not vary on `Accept`

**VERIFIED IN PRODUCTION.** Markdown responses return `Vary: Accept, Accept-Encoding` and `Cache-Control: private, no-store`. HTML responses return Next.js router vary tokens but omit `Accept`, despite the source attempting to set it in `proxy.ts` and `next.config.ts`.

**Impact:** a shared CDN/cache could theoretically reuse the wrong representation. Production alternation worked during direct tests, but cache isolation is not correctly declared on HTML responses.

## SEO-007 — Genuine lead conversions are not measured

**VERIFIED IN CODE.** There is no event for successful form submission, mailto fallback completion, WhatsApp click, Calendly booking or primary contact CTA. Only the misleading homepage conversion exists.

**Impact:** the business cannot distinguish awareness traffic from real enquiries or optimise campaigns toward valuable actions.

## SEO-008 — An obsolete GitHub Pages site is publicly indexable

**VERIFIED IN PRODUCTION/SEARCH.** `https://neexcreative.github.io/` returns `200`, self-canonicalises and exposes default Next.js starter instructions under the title “Marlon (Neex Creative) | Marlon Franca Portfolio”. It appears in web search.

**Impact:** brand confusion, wasted crawl/index signals and an unprofessional search result associated with Neex Creative.

## SEO-009 — Oversized source images and raw-file gallery links

**VERIFIED IN CODE.** Largest served-source assets include:

| Asset | Size |
| --- | ---: |
| `public/images/projects/project-02.png` | 34.72 MB |
| `espc-total-expo.jpg` | 12.62 MB |
| `thedrainteam-vans.jpg` | 9.68 MB |
| `project-08.png` | 8.56 MB |
| `project-05.png` | 3.30 MB |
| `marlon.png` | 2.20 MB |

`next/image` protects normal page delivery by resizing, but print-gallery links point to original image URLs. This increases repository/build cost and can transfer 10–13 MB on a click.

## SEO-010 — Important security headers are absent

**VERIFIED IN PRODUCTION.** HSTS is present (`max-age=63072000`), but representative HTML responses lacked CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`/`frame-ancestors`, COOP and CORP.

**Impact:** weaker defence in depth against script injection, clickjacking, referrer leakage and unnecessary browser capabilities. A CSP must be designed around Next.js, Google Maps, Calendly and consented Google tags rather than copied blindly.

## SEO-011 — The portfolio does not build enough on-site proof

**VERIFIED IN CODE and PRODUCTION.** Work cards mostly lead to Behance or client sites. No indexable project-detail routes provide problem, process, deliverables, verified result, local context or client approval.

**Impact:** Neex gives away engagement and cannot rank its own case-study evidence. This weakens trust for commercial searches and provides little first-party material for search/AI citation.

---

# E. Medium-Priority Improvements

## SEO-012 — Canonical-host redirect is a two-hop chain

**VERIFIED IN PRODUCTION.** `http://neexcreative.com/` → `https://neexcreative.com/` (`308`) → `https://www.neexcreative.com/` (`307`). The HTTPS apex redirect is temporary.

**Recommendation:** make every non-canonical protocol/host variant redirect directly and permanently to the final `https://www` URL.

## SEO-013 — Blog sitemap `lastmod` does not represent last modification

**VERIFIED IN CODE.** The sitemap sets `lastModified` to frontmatter publication dates (January/February 2026), while all article files were last committed on 12 September 2026. A migration commit is not proof of editorial change, but it demonstrates that `lastmod` is not derived from a reliable modification field.

**Recommendation:** add a genuine `dateModified` only when content changes, or omit `lastmod` until reliable.

## SEO-014 — HTML 404 contains conflicting robots directives and homepage metadata

**VERIFIED IN PRODUCTION.** The HTML 404 returns status `404` and includes both `noindex` and `index, follow`, plus the homepage title, description and OG data. Google normally applies the most restrictive robots directive, but conflicting metadata is avoidable and may be interpreted inconsistently by other consumers.

## SEO-015 — Breadcrumbs and person authorship are missing

**VERIFIED IN CODE.** Nested service/blog pages have no visible breadcrumbs or `BreadcrumbList`. `/about` has no `Person` schema. Blog posts show no visible author and use the Organization as the `BlogPosting.author`.

**Impact:** weaker hierarchy, authorship and entity clarity. Add these only with accurate, visible information.

## SEO-016 — Structured-data entities are valid but loosely modelled

**VERIFIED IN CODE/PRODUCTION.** JSON-LD parsed successfully. The global Organization is rendered on every page; `/services` adds another Organization with the same `@id`; the homepage LocalBusiness uses a separate `@id` and is not explicitly linked to the Organization/WebSite graph.

**Recommendation:** model one canonical business entity, connect WebSite and page-level schemas through `@id`, and use the most accurate LocalBusiness subtype if the published address is a genuine customer-facing business location.

## SEO-017 — Several hub-page titles are too generic

**VERIFIED IN PRODUCTION.** Titles such as `Services | Neex Creative`, `Work | Neex Creative`, `Blog | Neex Creative` and `About | Neex Creative` are unique but under-describe location, speciality or value. Core service pages are much stronger.

**Recommendation:** rewrite for clarity and intent, not arbitrary character limits; avoid repeating the same “Creative Agency Dublin” phrase across every page.

## SEO-018 — Mobile menu keyboard behaviour is incomplete

**VERIFIED IN LOCAL BUILD.** At 390 px, opening the menu and pressing Escape left it open. Focus remained on the 40×40 toggle. There is no focus movement into the menu, return-on-close handling or outside-click close.

**Positive finding:** no horizontal overflow and one H1 were found across 11 representative pages at 320, 375, 390, 768, 1024 and 1440 px.

## SEO-019 — Blog claims need clearer sourcing and authorship

**VERIFIED IN CODE.** Articles are well structured and 828–935 words, but contain claims such as the “6-second rule”, “measurably” increased trust and general performance assertions without primary references. Each article contains one internal CTA link and no external citations.

**Impact:** lower factual trust and weaker suitability for direct citation by search/AI systems. Use sources where a claim is empirical; distinguish studio experience from industry evidence.

## SEO-020 — Content freshness and commercial topic coverage are limited

**VERIFIED IN CODE.** Four articles were published in January–February 2026, with no visible modified date or author. They cover brand systems, the customer journey, social video and website conversion. They do not yet answer many high-intent buyer questions around scope, briefs, timelines, redesign/migration, landing pages or choosing an agency.

## SEO-021 — Declared OG dimensions do not match the file

**VERIFIED IN CODE.** `og-image.png` is 1260×630 but metadata declares 1200×630. The image can still render, but the metadata should describe the actual asset or the file should be resized.

---

# F. Low-Priority Opportunities

## SEO-022 — Unused dependency and duplicate legacy assets

**VERIFIED IN CODE.** `framer-motion` is installed but never imported. Large images are duplicated under `legacy/`. These do not inflate the browser bundle today but add install/repository weight and maintenance noise.

## SEO-023 — `WebSite.SearchAction` has limited current Google value

**VERIFIED IN CODE.** The markup is valid Schema.org, but Google no longer presents the former sitelinks search-box feature. Retaining it is harmless if the search URL stays functional; it should not be treated as a rich-result opportunity.

## SEO-024 — Manifest/browser polish is incomplete

**VERIFIED IN CODE.** The manifest has no maskable icon and the layout exports no theme colour. These are UX/brand polish opportunities, not ranking blockers.

---

# G. Page-by-Page SEO Table

All 17 sitemap URLs returned `200`, contained one H1, were server-rendered, exposed `index, follow`, had self-referencing canonicals, unique descriptions and OG/Twitter metadata. “Indexable” below means technically indexable; it does not mean confirmed indexed or ranking.

| URL | Current title | H1 | Canonical | Indexability | Main SEO issue | Recommended action |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Creative Agency Dublin \| Brand Systems, Web & Video \| Neex Creative | Websites, branding & video, one system, built by a creative agency in Dublin. | `https://www.neexcreative.com` | Indexable | Strong relevance, but deployed tracking is non-compliant and false conversion fires. | Fix analytics/consent before other homepage work; retain positioning. |
| `/work` | Work \| Neex Creative | Selected creative work. | `/work` | Indexable | Generic title; proof leaves the domain. | Add approved on-site case studies and a more descriptive title. |
| `/services` | Services \| Neex Creative | Not five services. One growth engine. | `/services` | Indexable | Generic title; mostly a directory. | Clarify creative-agency/Dublin value while keeping links to distinct service pages. |
| `/services/brand-strategy-design` | Brand Strategy & Design \| Neex Creative | Brand strategy and design that gives your business a system, not just a logo. | Self | Indexable | Title underuses established Dublin/Ireland intent; no breadcrumb/proof. | Refine title and add real local case study evidence. |
| `/web-design` | Web Design Dublin \| Custom Websites \| Neex Creative | Professional websites for Dublin businesses. | Self | Indexable | Strong page; claims “clean Core Web Vitals” without field evidence. | Preserve URL/title; support claims with real case studies and measured evidence. |
| `/services/photo-video-production` | Photo & Video Production Dublin \| Neex Creative | Video production in Dublin that earns attention, and keeps it. | Self | Indexable | Gallery reportedly emphasises motion/3D rather than actual shoots. | Add approved photo/video examples and outcomes. |
| `/services/marketing-content` | Marketing Content & Social Media Design Dublin \| Neex Creative | Marketing content that keeps the system working week after week. | Self | Indexable | Commercial copy is good; proof and process are thin. | Add deliverable examples, workflow and verified retainer/campaign case evidence. |
| `/services/print-multimedia-design` | Print & Multimedia Design Dublin \| Neex Creative | Print and multimedia design that carries your brand into the real world. | Self | Indexable | Raw original gallery links; large source files. | Optimise/download derivatives or use a lightbox; retain print-specific copy. |
| `/about` | About \| Neex Creative | Meet the Designer. | Self | Indexable | Generic title; no Person schema or visible expertise links. | Add accurate Person entity, role, profile links and selected authored work. |
| `/contact` | Contact \| Neex Creative | Let's talk about your project. | Self | Indexable | Map loads pre-consent; form delivery and genuine conversion event unverified. | Gate map, validate endpoint, add spam protection and success tracking. |
| `/book` | Book a Call \| Neex Creative | Book a Call | Self | Indexable | Thin page; Calendly loads pre-consent and booking completion is not measured. | Consent-gate embed and track confirmed scheduling via supported Calendly event/webhook. |
| `/privacy` | Privacy \| Neex Creative | Privacy notice | Self | Indexable | Production notice is stale relative to local consent work and may overstate non-sharing. | Publish an accurate notice after confirming providers, retention and legal basis. |
| `/blog` | Blog \| Neex Creative | Thinking that turns attention into enquiries. | Self | Indexable | Generic title; only four articles; no author hub. | Strengthen editorial proposition and topic clusters without thin content. |
| `/blog/first-impression-enquiries` | First Impression to Enquiry: Mapping the Client Journey \| Neex Creative | Same as title stem | Self | Indexable | No visible author/citations; only one body internal link. | Add byline, updated date if changed, sources and contextual service/case links. |
| `/blog/six-second-rule-video` | The 6-Second Rule: Video Content That Converts on Social \| Neex Creative | Same as title stem | Self | Indexable | Central “six-second” claim is unsourced. | Cite a reliable primary source or reframe as studio guidance. |
| `/blog/brand-system-vs-logo` | Brand System vs. Logo: What Actually Drives Growth \| Neex Creative | Same as title stem | Self | Indexable | Empirical language lacks evidence; no author. | Add authorship and source or qualify measurable claims. |
| `/blog/website-sales-system` | Your Website Is a Sales System, Not a Brochure \| Neex Creative | Same as title stem | Self | Indexable | Conversion/CWV claims lack first-party evidence. | Link a real web case study and cite measurement methodology. |

### Search-intent and landing-page assessment

| Intent | Current coverage | Recommendation |
| --- | --- | --- |
| Creative Agency Dublin | Strong homepage and services copy | Keep homepage primary; avoid duplicating it across thin location pages. |
| Web Design Dublin | Strong dedicated `/web-design` page | Preserve URL and exact core positioning. Add proof, FAQ and development capability on the same page. |
| Website Development Dublin | Partially covered by `/web-design` | Add a substantive development section; a separate page only if the offer/process is genuinely distinct. |
| Branding Agency Dublin | Dedicated brand page, but title is generic | Improve the existing page rather than create a duplicate Dublin page. |
| Graphic Design Dublin | Fragmented across brand, marketing and print | Create a page only if it represents a coherent sellable service with unique portfolio/proof; otherwise strengthen hub/internal links. |
| Video Production Dublin | Strong dedicated page | Add real production examples, process and buyer FAQs. |
| Motion Graphics Dublin | Portfolio mentions, no focused service content | A combined Motion & 3D page can be justified if actively sold and supported by unique work. |
| Landing Page Design Ireland | Included within web design | Keep on `/web-design` initially; a standalone page risks overlap unless there is distinct campaign methodology and proof. |
| Small Business Website Dublin | Overlaps web design | Address via sections/case studies on `/web-design`; do not create a doorway page. |

---

# H. Issue Register

| ID | Severity | Affected URL/file | Evidence/status | Impact | Proposed solution | Expected benefit | Complexity | Validation method |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEO-001 | Critical | Production/global analytics | Ads tag and `_gcl_au` before choice; VERIFIED IN PRODUCTION | Privacy and trust risk | Deploy consent-gated tag implementation | Consent-respecting measurement | M | Fresh profile: no Google requests/cookies before opt-in |
| SEO-002 | Critical | `/`, `ConversionEvent.tsx` | Homepage mount sends Ads conversion; VERIFIED IN PRODUCTION/CODE | False lead reporting and bidding | Retire page-load conversion; trigger only verified lead outcomes | Accurate optimisation | M | Tag Assistant/Ads diagnostics after true lead only |
| SEO-003 | Critical | GA4/local tag | GA absent live; no GA SPA event locally; VERIFIED | Missing journey data | Confirm Enhanced Measurement history option or implement one explicit route tracker with auto history disabled | Complete, non-duplicated GA4 journeys | M | Realtime/DebugView: exactly one view per route |
| SEO-004 | Critical | `/contact`, `/book` | Maps/Calendly requests before choice; VERIFIED IN CODE/LOCAL | Third-party processing before consent | Click-to-load placeholders or appropriate consent category gating | Better ePrivacy posture and performance | M | Network log before/after category consent |
| SEO-005 | High | `proxy.ts`, `/api/markdown` | Local routes return homepage guide; production currently correct | Wrong machine-readable content after deploy | Preserve pathname/query through rewrite; expand parity assertions | Accurate AI/agent representation | M | Assert unique H1/title in Markdown for every route/query |
| SEO-006 | High | Global HTML headers | HTML omits `Vary: Accept`; VERIFIED IN PRODUCTION | Cache representation ambiguity | Fix at delivery layer/framework version and retain no-store Markdown | Safe HTML/Markdown caching | M–H | Edge responses and alternating-cache test |
| SEO-007 | High | Form, WhatsApp, Calendly | No genuine lead events; VERIFIED IN CODE | No ROI measurement | Define `generate_lead`/Ads events with deduplication and consent | Actionable attribution | M | Submit/click/book test in DebugView and Ads |
| SEO-008 | High | `neexcreative.github.io` | Indexable starter site; VERIFIED IN PRODUCTION/SEARCH | Brand confusion | Disable GitHub Pages or 301 to canonical domain; request re-crawl | Consolidated brand signals | L–M | URL returns 301/404 and leaves search over time |
| SEO-009 | High | `public/images/projects`, print gallery | 34.72 MB max; raw links; VERIFIED IN CODE | Build, transfer and UX cost | Resize/compress originals and serve optimised viewing/download assets | Faster builds and clicks | M | File budget plus network transfer test |
| SEO-010 | High | Production headers | Only HSTS of reviewed security set; VERIFIED | Reduced browser defence | Add tested CSP and supporting headers | Stronger trust/security | M–H | Security-header scan with embeds/tags still functional |
| SEO-011 | High | `/work`, portfolio | External-only/thin proof; VERIFIED | Weak conversion/E-E-A-T/local relevance | Approved on-site case-study routes with real outcomes | More trust, internal links and long-tail coverage | H | Indexable cases, user review and conversion analysis |
| SEO-012 | Medium | Domain redirects | HTTP apex takes two hops; HTTPS apex uses 307 | Slower consolidation | Direct permanent redirects to `https://www` | Cleaner canonicalisation | L | `curl -I` all four host/protocol variants |
| SEO-013 | Medium | `sitemap.ts`, blog frontmatter | Publication date used as `lastmod` | Misleading freshness signal | Add true modified date or omit | Trustworthy sitemap | L | Compare XML to editorial history |
| SEO-014 | Medium | 404 metadata | `noindex` and `index, follow`; homepage OG/title | Conflicting machine signals | Add dedicated not-found metadata and avoid inherited index directive | Cleaner error handling | L | GET missing URL, inspect head/status |
| SEO-015 | Medium | Nested pages, `/about`, blog | No breadcrumbs/Person/byline | Weaker hierarchy/authorship | Visible breadcrumbs and accurate linked schemas | Better navigation/entity clarity | M | Schema validator plus visible-content match |
| SEO-016 | Medium | `schema.ts` | Duplicate/redundant Organization; LocalBusiness disconnected | Ambiguous entity graph | Consolidate canonical IDs and relationships | Clearer entity understanding | M | Schema.org validator/Rich Results Test |
| SEO-017 | Medium | Hub metadata | Generic hub titles | Lower relevance/CTR potential | Descriptive, differentiated titles based on actual intent | Clearer snippets | L | Rendered metadata and Search Console CTR after release |
| SEO-018 | Medium | `Navbar.tsx` | Escape does not close; no focus management; 40×40 toggle | Keyboard/mobile friction | Add Escape, focus movement/return and review target sizing | Better WCAG/mobile UX | M | Keyboard test at 320–390 px |
| SEO-019 | Medium | Blog articles | No author/citations; empirical claims | Lower factual trust | Add sources and visible expert authorship | Stronger people-first/AI citation value | M | Editorial review and rendered schema |
| SEO-020 | Medium | Blog/content | Four posts, last publication Feb 2026 | Limited commercial coverage | Publish evidence-led buyer topics and cases | More qualified long-tail entry points | H | Search Console query/page monitoring |
| SEO-021 | Medium | `og-image.png`, metadata | File 1260×630; declared 1200×630 | Metadata mismatch | Resize or declare actual dimensions | Predictable social previews | L | Image metadata and social debuggers |
| SEO-022 | Low | `package.json`, `legacy/` | Unused package; duplicated assets | Maintenance/repository cost | Remove only after dependency/legacy review | Leaner install/repo | L | Build/lint and repository-size comparison |
| SEO-023 | Low | `siteGraphSchema` | SearchAction no longer a Google rich feature | Maintenance noise | Retain only for semantics or remove when revisiting schema | Clear expectations | L | Schema parse; no ranking expectation |
| SEO-024 | Low | Manifest/layout | No maskable icon/theme colour | Minor installed-app/browser polish | Add branded assets/viewport metadata | Better browser/PWA finish | L | Manifest and device UI check |

### Pending confirmations, not counted as verified defects

| ID | Requirement | Why pending |
| --- | --- | --- |
| P-01 | `NEXT_PUBLIC_FORM_ENDPOINT`, provider, recipients, retention and DPA | Environment/account access unavailable. |
| P-02 | Google Business Profile ownership, address type and NAP | Public search did not establish a verified profile; account access unavailable. |
| P-03 | Search Console and sitemap submission/index coverage | Account access unavailable. |
| P-04 | GA4 Enhanced Measurement history-event setting and cross-domain configuration | GA Admin access unavailable. |
| P-05 | Real-user LCP, INP, CLS and traffic/device distribution | No CrUX/Search Console/Vercel field dataset available. |
| P-06 | Google Rich Results Test eligibility | JSON syntax was tested; Google’s interactive validator was not run. |

---

# I. AI Search Recommendations

## Established practices

1. Keep every important page accessible as complete HTML with a unique title, H1, canonical and internal links. The site currently does this well.
2. Keep `robots.txt` permissive for public content. The current wildcard rule permits OAI-SearchBot, GPTBot, Bingbot and other crawlers; CDN/firewall IP blocking still needs operational confirmation.
3. Maintain a complete canonical sitemap and submit it to Google Search Console and Bing Webmaster Tools.
4. Publish clear, factual service definitions, business identity, location, authorship and first-party case evidence.
5. Use structured data that matches visible content. It improves entity understanding and feature eligibility but does not guarantee citations or rankings.
6. Resolve the old GitHub Pages property so crawlers see one authoritative Neex entity.
7. Add source attribution to empirical claims and show who wrote/reviewed advice.

OpenAI states that eligibility for ChatGPT Search requires allowing OAI-SearchBot and its published IP ranges; inclusion is not guaranteed. Bing recommends crawlable pages, sitemaps, accurate freshness and optionally IndexNow. Google states that ordinary SEO and helpful, reliable content remain the foundation for AI features.

## Experimental or optional practices

- `llms.txt` is accessible and concise. It may help systems that choose to consume it, but Google explicitly states that it ignores `llms.txt` for Search and AI features; the file neither improves nor harms Google visibility.
- `Accept: text/markdown` and `/api/markdown` are experimental conveniences, not ranking requirements. Keep them only if they remain correct, cache-safe and maintainable. The current local regression must be fixed before deployment.
- `llms-full.txt` is optional. Do not create it merely to repeat the entire site. Consider it only if a maintained, factual corpus offers clear value to non-Google consumers.
- IndexNow is useful for faster notification to participating engines, but it does not guarantee indexing or AI citation.

## Machine-readable delivery findings

- `/llms.txt`: `200`, correct plain-text content in production.
- Page Markdown: correct in production, broken in the current local build.
- Markdown 404: `404`, `X-Robots-Tag: noindex`, correct content type.
- HTML 404: `404`, but conflicting robots metadata.
- Markdown cache headers: private/no-store, positive.
- HTML `Vary: Accept`: missing, unresolved.

---

# J. Blog and Content Strategy

## Current article assessment

| Article | Words | Structure | Links | Primary opportunity |
| --- | ---: | --- | --- | --- |
| Brand System vs. Logo | 828 | 6 H2s | 1 internal, 0 cited external | Qualify/cite growth and “measurably” claims; add author and case proof. |
| First Impression to Enquiry | 935 | 7 H2s | 1 internal, 0 cited external | Add a practical downloadable/checklist element and real journey example. |
| The 6-Second Rule | 841 | 6 H2s | 1 internal, 0 cited external | Source or reframe the six-second premise; link real video work. |
| Website Is a Sales System | 835 | 4 H2s, 3 H3s | 1 internal, 0 cited external | Support conversion/CWV claims with measured case evidence. |

The articles are readable, commercially adjacent and not thin. Their main weakness is not length; it is missing expert attribution, evidence, contextual internal links and first-party examples.

## Ten prioritised future topics

No search-volume figures are asserted. Priority is based on proximity to a purchase decision and fit with current services.

1. **How to brief a web design agency in Dublin: scope, content, timeline and approvals** — high buyer intent; useful contact-form companion.
2. **Website redesign without losing SEO: an Irish business migration checklist** — supports the redesign offer and reduces buyer risk.
3. **Landing page or full website? A decision guide for Irish SMEs** — directly qualifies two web-service options without creating competing landing pages.
4. **What affects the cost of a custom business website in Ireland?** — explain scope factors without publishing invented prices.
5. **Case study: [approved web client] — problem, build, launch and verified outcome** — highest trust value; publish only with client approval and real data.
6. **What a complete brand identity brief should contain** — practical brand-service lead magnet/topic.
7. **How to plan one photo/video shoot for a website, ads and a month of social content** — supports the integrated-system positioning.
8. **Choosing a video production partner in Dublin: questions to ask before filming** — high commercial relevance and local intent.
9. **Print-ready artwork explained: bleed, colour profiles, resolution and large format** — demonstrates specialist print competence and answers real buyer questions.
10. **When motion graphics or 3D is worth the investment for an event or campaign** — validates whether a dedicated Motion/3D service page deserves to exist.

---

# K. Privacy, Analytics and Conversion Plan

This section is implementation guidance, not a legal determination.

## Consent changes required before release

1. Gate GA4 and Google Ads until the relevant category is affirmatively accepted. The local implementation does this for those two services.
2. Gate Google Maps and Calendly, or present click-to-load placeholders that explain the provider and consequence before loading.
3. Keep Reject and Accept equally prominent. The local banner currently uses the same styling for both, which is positive.
4. Allow granular Analytics and Advertising choices and an always-available withdrawal control. The local implementation provides these.
5. Confirm the privacy notice states the actual providers, purposes, retention, recipients/transfers, legal bases, withdrawal method and contact route.
6. Confirm whether the public address is a business location appropriate for LocalBusiness/GBP publication.
7. Record and version consent as needed; local storage used solely to remember the choice is plausibly necessary, but legal review remains the owner’s responsibility.

## Measurement model

| Business action | GA4 event | Google Ads conversion? | Conditions |
| --- | --- | --- | --- |
| Page view | `page_view` | No | Exactly once per initial load/App Router navigation after analytics consent. |
| Successful endpoint form response | `generate_lead` | Yes, primary | Fire only after confirmed success; include no personal data. |
| Mailto fallback opened | `contact` or custom fallback event | Usually secondary | It is not a confirmed sent enquiry; report separately. |
| WhatsApp click | `contact` with method `whatsapp` | Secondary or primary by business decision | Fire on click after applicable consent; avoid phone/user data in parameters. |
| Calendly booking completed | `generate_lead`/`appointment_booked` | Yes, primary | Use supported Calendly event/webhook; do not count widget open as booking. |
| Quote CTA click | `select_content`/custom CTA event | No or secondary | Useful funnel event, not a lead. |

Do not send form names, email addresses, phone numbers, message text or other personally identifiable data to Google Analytics or Ads.

---

# L. Performance and Accessibility Evidence

## Performance

Strengths verified in code/build:

- Static/SSG output for all public content pages.
- Server-rendered content; no blank client-only SEO shell.
- `next/image` for site imagery and responsive `sizes` on key images.
- Self-hosted Next fonts with `display: swap`.
- H1/above-fold copy deliberately not animated.
- Reduced-motion support.
- No Lighthouse package bundled into the app.

Custom production lab sample, headless Chrome, cache disabled per page, no artificial CPU/network throttling:

| Route | Viewport | TTFB | FCP | LCP | CLS |
| --- | --- | ---: | ---: | ---: | ---: |
| `/` | 390 px | 31 ms | 444 ms | 444 ms | 0 |
| `/` | 1440 px | 6 ms | 152 ms | 152 ms | 0 |
| `/web-design` | 390 px | 6 ms | 140 ms | 140 ms | 0 |
| `/contact` | 390 px | 5 ms | 180 ms | 180 ms | 0 |
| `/book` | 390 px | 5 ms | 112 ms | 112 ms | 0 |

These values reflect a fast local connection to production and **must not** be represented as Lighthouse or user-experience scores. INP was not measured. Field CWV remain **NEEDS CONFIRMATION**.

## Accessibility and mobile

Confirmed positives:

- Semantic headings and landmarks; one H1 on tested routes.
- Labels for form controls and a polite status region.
- Visible `:focus-visible` outline.
- CSS colour tokens document AA contrast values.
- `prefers-reduced-motion` disables smooth scroll/marquee motion.
- Decorative blog/hero imagery uses empty alt; project imagery has descriptive alt.
- No horizontal overflow across 11 representative pages at 320, 375, 390, 768, 1024 and 1440 px.

Confirmed defects/opportunities:

- Escape does not close the mobile menu.
- Focus is not moved into the opened menu or explicitly restored after close.
- The menu toggle is 40×40 px: above WCAG 2.2’s 24×24 minimum, below the common 44×44 mobile recommendation.
- Full automated WCAG testing with axe/Lighthouse and manual screen-reader testing were **NOT TESTED**.

---

# M. 30-Day SEO Action Plan

## Week 1 — Critical corrections

1. Finish and deploy consent gating for GA4, Ads, Maps and Calendly.
2. Replace the homepage-visit Ads conversion with true lead conversions.
3. Verify GA4 Enhanced Measurement; prove exactly one page view per initial load and App Router navigation.
4. Confirm form provider, endpoint, recipients, retention, DPA and success semantics.
5. Fix local Markdown rewrite regression before any deployment.

## Week 2 — Technical and on-page improvements

1. Fix `Vary: Accept` at the actual delivery/CDN layer or simplify/remove content negotiation if it cannot be made cache-safe.
2. Consolidate host redirects into one permanent hop.
3. Add accurate 404 metadata and security headers.
4. Correct OG image dimensions and sitemap modification dates.
5. Add breadcrumbs, Person schema and visible bylines where factually supported.

## Week 3 — Content and local SEO

1. Publish the first approved on-site case study with real scope and outcomes.
2. Improve hub titles and service proof without changing `/web-design`.
3. Confirm/optimise Google Business Profile and NAP consistency.
4. Publish one high-intent buyer article from the priority list.
5. Disable or redirect the obsolete GitHub Pages site.

## Week 4 — Validation, tracking and reporting

1. Submit/verify sitemap in Search Console and Bing Webmaster Tools.
2. Run Rich Results Test/URL Inspection on representative schemas.
3. Validate GA4 Realtime/DebugView and Google Ads conversion diagnostics.
4. Run mobile Lighthouse on homepage, web design, contact and book; record methodology and date.
5. Establish a monthly dashboard: organic landing pages, qualified enquiries, conversion rate, local visibility and field CWV.

---

# N. Implementation Roadmap for Codex

Each phase should be a separate, reviewable change set. Do not begin until explicitly approved.

1. **Analytics correctness** — page views, genuine lead events, deduplication and DebugView test harness.
2. **Consent and third-party gating** — tag, Maps and Calendly categories/placeholders; privacy copy sync.
3. **Markdown/cache repair** — path/query parity tests, `Vary` delivery validation, 404 representations.
4. **Redirects and headers** — host rules, CSP and supporting security headers.
5. **Schema/authorship** — canonical entity graph, Person, BreadcrumbList and visible bylines.
6. **Asset optimisation** — downscale originals, safe gallery views/downloads, remove proven duplicates.
7. **Case-study foundation** — reusable on-site case route/template only after real content is supplied.
8. **On-page refinements** — hub titles, proof sections and internal linking; preserve `/web-design`.
9. **Content programme** — one evidence-led commercial article/case at a time.
10. **Measurement and QA** — Search Console/Bing/GA/Ads verification, Lighthouse and regression scripts.

---

# O. Verification Matrix

| Area | Result | Verification label |
| --- | --- | --- |
| 17 sitemap routes | All returned 200 with one H1, canonical and unique metadata | VERIFIED IN PRODUCTION |
| Server rendering/indexability | Public content present in HTML; build reports static/SSG routes | VERIFIED IN CODE and PRODUCTION |
| Sitemap/robots/llms | Accessible, correct domain; 17 canonical page URLs | VERIFIED IN PRODUCTION |
| Legacy `.html` redirects | 308 to current routes | VERIFIED IN PRODUCTION |
| Host redirects | Two-hop HTTP apex chain; HTTPS apex 307 | VERIFIED IN PRODUCTION |
| Trailing slash | 308 removal, consistent | VERIFIED IN PRODUCTION |
| Missing pages | HTML and Markdown return 404; Markdown has X-Robots noindex | VERIFIED IN PRODUCTION |
| Canonicals | Self-referencing on all sitemap pages | VERIFIED IN PRODUCTION |
| JSON-LD syntax | Parsed on home, services, web design, about and blog sample | VERIFIED IN PRODUCTION |
| Google rich-result eligibility | Interactive validator/account inspection not run | NOT TESTED |
| Production GA4 | Measurement ID absent | VERIFIED IN PRODUCTION |
| Production Ads | Loads before consent; homepage conversion fires | VERIFIED IN PRODUCTION |
| Local consent | No GA/Ads requests before choice; initial GA view after acceptance | VERIFIED IN LOCAL BUILD |
| Local App Router GA page views | No GA page view observed on `/` → `/services` navigation | VERIFIED IN LOCAL BUILD |
| GA Enhanced Measurement setting | Admin access unavailable | NEEDS CONFIRMATION |
| Maps/Calendly consent | Third-party requests before choice | VERIFIED IN CODE and LOCAL BUILD |
| Form delivery/provider/retention | Environment/account access unavailable | NEEDS CONFIRMATION |
| Markdown production parity | Correct page content and blog query filtering | VERIFIED IN PRODUCTION |
| Markdown local parity | Wrong homepage content; query regression | VERIFIED IN LOCAL BUILD |
| HTML `Vary: Accept` | Missing | VERIFIED IN PRODUCTION |
| Responsive overflow | None on 11 pages × six requested widths | VERIFIED IN LOCAL BUILD |
| Mobile Escape behaviour | Menu remains open | VERIFIED IN LOCAL BUILD |
| Mixed content | No `http://` subresource URLs found on tested pages | VERIFIED IN PRODUCTION |
| Security headers | HSTS present; reviewed defence headers absent | VERIFIED IN PRODUCTION |
| Field Core Web Vitals | No CrUX/account data | NOT TESTED |
| Lighthouse | Package/tool unavailable; not installed | NOT TESTED |
| Google Business Profile | No account access; public verification inconclusive | NEEDS CONFIRMATION |
| Search Console/Bing | No account access | NEEDS CONFIRMATION |

---

# P. Tests Performed

## Passed

- `npm run lint` — passed with no reported errors.
- `npm run build` — passed on Next.js 16.2.10; 24 static generation outputs completed.
- Production crawl of all 17 sitemap URLs — all `200`.
- Sitemap/robots/llms retrieval and legacy redirect checks.
- Canonical/title/description/H1/index directive extraction for every sitemap page.
- JSON-LD JSON parsing on representative Organization, WebSite, LocalBusiness, Service and BlogPosting pages.
- Existing `scripts/responsive-test.mjs` — passed at 320/375/768 px.
- Extended responsive test — 11 representative routes passed at 320/375/390/768/1024/1440 px with no overflow and one H1.
- Production content-negotiation alternation — correct HTML/Markdown content types; Markdown no-store.
- Production blog Markdown query filtering — passed.
- Production/lab consent and Google-tag network inspection.
- Custom unthrottled headless-Chrome paint/CLS sampling.

## Failed

- `node scripts/verify-seo.mjs` on the local production build: 17 route-level checks printed PASS, then the blog query assertion failed because the current local Markdown rewrite returned the homepage guide.
- Mobile menu Escape test: failed; menu remained open.
- Local GA4 client-navigation test: no GA `page_view` observed after `/` → `/services`.
- HTML `Vary: Accept` validation: failed in production.

## Unavailable or not performed

- Lighthouse/PageSpeed scoring.
- Real-user Core Web Vitals and INP.
- axe/manual screen-reader audit.
- Google Rich Results Test and Search Console URL Inspection.
- Search Console, GA4, Google Ads, GBP, Bing Webmaster Tools and Vercel account checks.
- Search-volume/ranking/backlink datasets.
- Live form delivery, retention and spam-provider verification.
- No claim is made that an unavailable test passed.

---

# Q. Authoritative References

- [Ireland Data Protection Commission: cookies and tracking technologies](https://www.dataprotection.ie/en/dpc-guidance/guidance-cookies-and-other-tracking-technologies)
- [Ireland DPC: consent for analytics cookies](https://www.dataprotection.ie/en/faqs/cookies/do-i-need-consent-analytics-cookies)
- [Google Analytics: Enhanced Measurement events](https://support.google.com/analytics/answer/9216061)
- [Google Search: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google Search: building sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search: Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google Search: LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google Search: generative AI optimisation guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [OpenAI: making a website available to ChatGPT Search](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt)
- [Bing: sitemaps in AI-powered search](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/)
- Installed Next.js 16.2.10 guides: `node_modules/next/dist/docs/01-app/02-guides/analytics.md`, `third-party-libraries.md`, and the App Router Script API reference.

---

# Final Status

**Overall SEO status:** technically indexable and structurally competent, but not measurement-ready or privacy-ready in production. Commercial authority and first-party proof are the next largest growth constraints after analytics/consent.

**Verified issues:** 4 critical, 7 high, 10 medium and 3 low — 24 total. Six additional requirements need confirmation.

**Five highest-priority recommendations:**

1. Deploy consent-safe analytics and gate Maps/Calendly.
2. Replace the homepage page-load “conversion” with genuine form/WhatsApp/booking outcomes.
3. Prove exactly one GA4 page view per initial load and App Router navigation.
4. Fix the local Markdown rewrite regression and HTML `Vary: Accept` before deployment.
5. Publish approved on-site case studies and remove/redirect the obsolete GitHub Pages site.

**Estimated implementation complexity:** medium overall. Analytics/consent, Markdown/cache and security headers are medium to medium-high; redirects/metadata are low; case studies/content are high because they require verified business inputs and client approval.

**Audit deliverable:** `NEEX_CREATIVE_SEO_AUDIT_2026.md` in the repository root.
