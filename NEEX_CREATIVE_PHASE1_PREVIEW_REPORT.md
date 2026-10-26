# Neex Creative — Phase 1 Preview Report

**Date:** 9 October 2026 (updated after Preview validation)  
**Scope:** SEO Phase 1 (consent-safe analytics, lead events, embed gating, Markdown fix), validated on a Vercel Preview  
**Outcome:** the Preview for `preview/seo-phase-1` @ `a260e8f` is built and live. **Every automated check passes on the real Vercel deployment**, apart from the known, documented `Vary` diagnostic. Production is untouched. **Recommendation: READY FOR PRODUCTION** once you approve, with the owner checks in section I.

---

## A. Deployment Summary

| Item | Status |
|---|---|
| Branch | `preview/seo-phase-1`, created from `main` @ `3b16503` |
| Commit | `a260e8f` "feat: complete consent-safe analytics and SEO phase 1" (25 files) |
| GitHub push | Done by the owner after GitHub sign-in |
| Vercel deployment | `dpl_5PK62HFBqGi4BVnqYQUerekwVZ3r`, state **READY**, target **Preview** (`target: null`), source `git`, region `iad1`, build 24 s |
| Branch/commit match | ✅ Vercel metadata: `githubCommitRef: preview/seo-phase-1`, `githubCommitSha: a260e8ff66eebf47507451827c48031e30432b49`; the build log shows "Cloning … (Branch: preview/seo-phase-1, Commit: a260e8f)" |
| Preview URL (branch alias) | `https://neexcreativeio-git-preview-seo-phase-1-marlon-francas-projects.vercel.app` |
| Preview URL (deployment) | `https://neexcreative-q5xb34r29-marlon-francas-projects.vercel.app` |
| Preview access | Protected by **Vercel Authentication** (unauthenticated requests get a 302 to `vercel.com/sso-api`). Testing used a **Vercel shareable link** generated through the owner's connected Vercel account: the platform's own access-grant mechanism, expiring 10 Oct 2026, 20:39. The token isn't recorded here. Protection settings weren't changed. |
| Production safety | ✅ The latest production deployment is still `dpl_41WZJ47B6tSoWrFXw66wexjTBZiG` from `main` @ `3b16503`. No merge, no push to `main`, no production deployment, no domain or project-setting changes, no new commits. |

---

## B. Files Changed (commit `a260e8f`)

**New:**
- `src/lib/consent.ts`
- `src/lib/gtag.ts`
- `src/lib/tracking.ts`
- `src/components/GoogleTag.tsx`
- `src/components/PageViewTracker.tsx`
- `src/components/CookieBanner.tsx`
- `src/components/CookieSettingsButton.tsx`
- `src/components/ExternalContentGate.tsx`
- `src/components/CalendlyEmbed.tsx`
- `scripts/analytics-consent-test.mjs`
- `PERSONAL_WEBSITE_PROJECT_SOURCE.md`
- `NEEX_CREATIVE_SEO_AUDIT_2026.md`

**Modified:**
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/book/page.tsx`
- `src/app/api/markdown/route.ts`
- `src/proxy.ts`
- `src/components/ContactForm.tsx` (includes the double-submit guard)
- `src/components/layout/Footer.tsx`
- `src/lib/site-config.ts`
- `src/lib/privacy-content.ts`
- `scripts/verify-seo.mjs`
- `README.md`

**Deleted:** `src/components/ConversionEvent.tsx` (the homepage page-load conversion)

The Preview validation needed **no repository changes**. The test harness pieces were kept in the session scratchpad, outside the repo:
- an auth preload that adds the share-link cookie to Preview-origin requests only;
- the 17-route × 6-width layout script;
- a request probe.

This report remains uncommitted.

---

## C. Testing (against the deployed Preview)

How the tests ran:
- All runs used the Preview URL above.
- Every Google Analytics / Ads hit was intercepted and **aborted**, so no test data reached GA4 and no Ads conversion was created.
- The Formspree endpoint (the real one is in the Preview bundle) was **mocked**: each `formspree.io` request got a fake 200 from the test harness, and a backstop aborts any Formspree request that would otherwise leave the browser. The harness logged 2 POSTs to `formspree.io/f/<id>`, intercepted and **not sent**. **No real form submission was made.**

| # | Test | Result | Notes |
|---|---|---|---|
| 1 | Vercel build | **PASS** | `next build` (Next 16.2.10, Turbopack) compiled; TypeScript passed; 24/24 static pages; same route table as locally. Only warnings: npm "install scripts not covered by allowScripts" for `sharp`/`unrs-resolver` (pre-existing, unrelated) |
| 2 | `verify-seo.mjs` | **PASS** | All 17 routes: OG/Twitter, canonical, JSON-LD parse, one H1, page-specific Markdown identity and uniqueness, ETag and HTML↔Markdown alternation. Also: blog search filtering, HTML and Markdown 404 with `noindex`, hero image via the Vercel image service, robots, `llms.txt`, five legacy 308 redirects |
| 3 | `verify-seo.mjs --strict-vary` | **FAIL (diagnostic, known)** | All 17 HTML responses lack `Vary: Accept`. Measured CDN behaviour shows no impact on Vercel (see F) |
| 4 | `analytics-consent-test.mjs` (endpoint mode, `STRICT_GA=1`), first run | **55 PASS / 3 FAIL** | All 3 failures came from one request: `vercel.live/_next-live/feedback/feedback.js`, Vercel's **Preview-only** feedback toolbar. It's injected by the platform, isn't in the source (0 references) or in the Preview's raw HTML (0), and isn't on production (0 references in `www.neexcreative.com` HTML) |
| 5 | `analytics-consent-test.mjs` (same, Vercel toolbar blocked) | **PASS (58/58)** | Same suite, with only `vercel.live` excluded |
| 6 | Layout/image check: 17 routes × 320/375/390/768/1024/1440 | **PASS** | 102 combinations, **with every image loaded** (lazy images forced eager). No horizontal overflow, one H1, Inter + Montserrat loaded, no console or hydration errors, no same-origin 4xx/5xx. Mobile menu opens, navigates and closes at 390 px; desktop navigation at 1024/1440 |
| 7 | `responsive-test.mjs` | **PASS** | 9 pages × 320/375/768, no horizontal scroll |
| 8 | `ticker-test.mjs` | **PASS** | Marquee moves; with `REDUCE=1` (reduced motion) it stays still |
| 9 | Vercel runtime errors (last 2 h, project) | **PASS** | "No runtime errors found" |
| 10 | Formspree endpoint in the Preview build | **PASS** | The `/contact` client bundle contains exactly one `https://formspree.io/f/<8-character id>` (value not printed) |
| 11 | GA4 Realtime/DebugView, account level | **NOT TESTED** | Hits were aborted on purpose; intercepted requests don't prove account-level reporting. Owner check (section I) |
| 12 | Real Formspree delivery, real Calendly booking, real Ads conversion | **NOT TESTED** | Not performed, by instruction |

Local results from the previous session also still stand: lint PASS, build PASS, and the consent test in fallback mode PASS (53 checks).

---

## D. Analytics (verified on the Preview from intercepted network hits)

- **Before consent:** across all 17 routes, a first visit and "Reject all" make **zero** Google, Maps or Calendly requests; the cookie banner shows, and there are no `_ga`/`_gcl` cookies. The only third-party request is Vercel's Preview toolbar, which production doesn't have.
- **One Google tag:** a single site-loaded `gtag.js` and one `<script>` element.
- **No homepage conversion:** the homepage load sends no Ads conversion in any consent state (the old label is retired).
- **GA4 page views, explicit, with your GA4 history setting OFF:** exactly **one** `page_view` per step.
  - Covered steps: initial load, Link to `/work`, Link to `/services`, back, forward, `/#work` from another route, `/web-design` followed by an immediate in-page anchor, and a query change.
  - A hash-only change sends none.
  - The `/web-design` case shows explicit dispatch counting a view that GA4's automatic tracking drops.
  - Page titles are correct. There are **no duplicates**, so automatic history page views are confirmed off from the network side.
- **Consent combinations:**
  - Analytics only: page views and zero Ads requests.
  - Ads only: zero GA4 requests and still no homepage conversion.
  - Granting analytics later sends one `page_view` for the current page.
- **Leads:**
  - Quote form: one `generate_lead {lead_source: quote_form, service: web-full}` after a 200. A double click produced **1 POST and 1 lead**; a 500 produced no lead and the error message.
  - Calendly: one `generate_lead {calendly_booking}`. Duplicates, spoofed origins and non-booking events are ignored, and no booking IDs or personal data are sent.
  - WhatsApp: one `contact {method: whatsapp}`.
  - Ads conversions: none while the actions are unmapped (`null`).
- **No personal data** in any Google request.
- **Withdrawal:**
  - Withdrawing External content reloads the page with the map placeholder and keeps the GA cookies.
  - Withdrawing everything reloads with zero third-party requests, no `_ga`/`_gcl` cookies and no gtag.js.

## E. Embeds (Google Maps, Calendly)

- `/contact`: map placeholder and no iframe until consent; the address stays visible. "Load map" requests Google Maps only (no analytics, ads or Calendly) and moves focus to the map. Reloading shows the placeholder again, so the click is per page view.
- `/book`: Calendly placeholder plus a direct Calendly link. "Load booking calendar" initialises the widget with an iframe and sends no analytics or ads requests. Calendly re-initialises after client-side navigation back to `/book`.
- With External content consent, both load without a click. Rejecting afterwards removes a click-loaded embed.

## F. Technical SEO

- **Routes:** all 17 sitemap routes return 200 HTML with canonical, OG/Twitter, valid JSON-LD and one H1.
- **Sitemap / robots / llms.txt:**
  - `sitemap.xml` lists 17 routes.
  - `robots.txt` has the `Sitemap: https://www.neexcreative.com/sitemap.xml` line and no `/icons/` disallow.
  - `llms.txt` returns 200 `text/plain`.
- **Markdown on Vercel:** every route returns its own Markdown (title identity and uniqueness checked), alternates correctly with HTML, and filters blog search. Markdown 404s carry `X-Robots-Tag: noindex`. The `next start` regression fix works on Vercel too.
- **`Vary: Accept`, measured on Vercel's CDN:**

  | Request | Result |
  |---|---|
  | `Accept: text/markdown` | `text/markdown`, `x-vercel-cache: MISS` every time, `Cache-Control: private, no-store`, `Vary: Accept, Accept-Encoding` |
  | `Accept: text/html`, `*/*`, or no `Accept` | `text/html`, `x-vercel-cache: HIT`, `Cache-Control: public, max-age=0, must-revalidate` |

  - Alternating Markdown, HTML, Markdown, HTML never served the wrong type, because the proxy rewrites Markdown before Vercel's cache lookup and Markdown is never cached.
  - Production (`www.neexcreative.com`) answers directly from Vercel (`Server: Vercel`, no third-party CDN headers).
  - Residual risk: a downstream shared cache could serve the cached HTML to an agent asking for Markdown. That degrades the response (the agent gets HTML) but breaks nothing, and browsers revalidate every time (`max-age=0`). The cause is framework-level (`app-page.js` overwrites `Vary`). **Accepted as a documented, non-blocking risk.**

## G. Remaining Risks

1. **GA4 account-level reporting not yet seen** (Realtime/DebugView). Network behaviour is proven; whether the property receives and reports the hits needs one manual look.
2. **Real Formspree delivery not exercised** (by design). The endpoint is present and the request shape (`POST` `FormData`, `Accept: application/json`) is unchanged from the intended integration. If Formspree rejected requests (for example a domain restriction), visitors would see the existing error message with the email address, and no lead would be recorded.
3. **Google Ads:**
   - No lead conversion actions are mapped yet, so Ads receives no lead conversions until they are.
   - The old homepage page-view conversion should be demoted or retired in Google Ads when Phase 1 goes live, or its history keeps influencing bidding.
4. **HTML `Vary: Accept`:** framework limitation, low impact (see F).
5. **Production still runs pre-Phase-1 tracking** (Ads tag before consent, homepage page-load conversion, and no Formspree endpoint in its bundle, so the live form falls back to a mail draft) until this is released. Releasing reduces risk rather than adding it.
6. The share link grants Preview access until 10 Oct 2026, 20:39. It can be revoked earlier in Vercel › Project › Settings › Deployment Protection.

## H. Production Readiness

**READY FOR PRODUCTION** (subject to your explicit approval)

The deployed Preview passes every deployment-blocking check on real Vercel infrastructure:
- build;
- SEO and Markdown on all 17 routes;
- consent, GA4 page views, leads and withdrawal (58/58, nothing leaking before consent, no duplicate events);
- Maps/Calendly gating;
- layout and **image loading** on 17 routes × 6 widths;
- no console, hydration or runtime errors, and no broken assets;
- the Formspree endpoint present in the build.

The open items are account-level confirmations, not code defects: the `Vary` diagnostic (an accepted framework limitation), and the GA4 Realtime check and real form test, which you can do on the Preview before merging or right after release.

## I. Next Actions

1. **Optional, on the Preview, before merging (about 5 min):**
   - Open the Preview while signed in to Vercel, accept Analytics, navigate 3–4 pages, and check **GA4 › Realtime/DebugView**: one `page_view` per page.
   - If you approve, send **one** real test enquiry from `/contact` and confirm it arrives through Formspree.
2. **When you approve the release:** open a PR `preview/seo-phase-1` → `main` and merge it. Vercel's Git integration deploys production; I won't do this without your explicit go-ahead.
3. **In Google Ads, at release:**
   - Demote or retire the homepage page-view conversion.
   - Create lead conversion actions and map them in `googleAdsConversions` (`src/lib/site-config.ts`), or import GA4 `generate_lead`, but not both.
4. **After release:** rerun `SITE_URL=https://www.neexcreative.com node scripts/verify-seo.mjs` as a smoke test.
