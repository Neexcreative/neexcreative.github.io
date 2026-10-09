/**
 * Consent, GA4, Google Ads and embed regression test against a production
 * build (`npm run build && npx next start -p 3199`).
 *
 * Every Google Analytics / Ads hit is intercepted, recorded and ABORTED, so
 * nothing reaches the real accounts. Maps and Calendly are allowed to load
 * (viewing only, no booking). WhatsApp navigation is prevented.
 *
 * Form modes (must match how the build was made):
 *   FORM_MODE=fallback  build without NEXT_PUBLIC_FORM_ENDPOINT (mailto draft)
 *   FORM_MODE=endpoint  build with NEXT_PUBLIC_FORM_ENDPOINT=https://forms.invalid/neex-test
 *                       (the reserved .invalid host is answered by this script)
 *
 * GA4 page views are dispatched explicitly by the site. While GA4's own
 * "page changes based on browser history events" is still ON in the GA4
 * account, navigations show a second, automatic page_view: reported as
 * PENDING GA4 ADMIN (a failure with STRICT_GA=1).
 *
 * Run: SITE_URL=http://127.0.0.1:3199 FORM_MODE=fallback node scripts/analytics-consent-test.mjs
 * Local verification only: GA4 Realtime/DebugView and Ads diagnostics still
 * need checking on a deployed preview.
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const BASE = process.env.SITE_URL ?? "http://127.0.0.1:3199";
const FORM_MODE = process.env.FORM_MODE ?? "fallback";
const MOCK_ENDPOINT = "https://forms.invalid/neex-test";
const GA_ID = "G-CBTZVBP173";
const BATCH_WAIT = 6500; // GA4 batches hits; navigation page_views arrive ~5 s later.
const PII = ["Zed Testperson", "zed.pii@example.com", "353870000000", "PII-TOWN", "PII-MARKER-MESSAGE", "PII-DETAILS"];

const executablePath = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
].find((p) => existsSync(p));
if (!executablePath) throw new Error("Chrome not found");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (ok, message) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${message}`);
  if (!ok) failures++;
};

function classify(url) {
  const u = new URL(url);
  if (`${u.protocol}//${u.host}` === new URL(BASE).origin) return "local";
  if (u.protocol === "data:" || u.protocol === "blob:") return "local";
  if (/\/g\/collect/.test(u.pathname)) return "ga";
  if (u.host === "www.googletagmanager.com") return "gtagjs";
  if (/googleadservices\.com|googleads\.g\.doubleclick\.net|^ad\.doubleclick\.net/.test(u.host) ||
      (/^www\.google\./.test(u.host) && /^\/(pagead|ccm|rmkt)\//.test(u.pathname))) return "ads";
  if (/^www\.google\.[a-z.]+$/.test(u.host) && u.pathname.startsWith("/ads/ga-audiences")) return "ga";
  if (u.host === "forms.invalid") return "form";
  if (u.host === "wa.me") return "whatsapp";
  if (/calendly\.com$/.test(u.host)) return "calendly";
  if (/google|gstatic|googleapis/.test(u.host)) return "maps";
  return "other";
}

async function session(browser) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setRequestInterception(true);
  const log = [];
  page.on("request", (req) => {
    let kind;
    try { kind = classify(req.url()); } catch { return req.continue(); }
    if (kind === "local") return req.continue();
    log.push({ kind, url: req.url(), body: req.postData() ?? "" });
    if (kind === "ga" || kind === "ads" || kind === "whatsapp") return req.abort();
    if (kind === "form") {
      const ok = !log.some((e) => e.kind === "form-fail-next");
      return req.respond({ status: ok ? 200 : 500, contentType: "application/json", body: JSON.stringify({ ok }), headers: { "Access-Control-Allow-Origin": "*" } });
    }
    return req.continue();
  });
  return { context, page, log };
}

/** GA4 events from collect hits (URL or batched POST body, one event per line). */
function gaEvents(log) {
  const events = [];
  for (const e of log.filter((x) => x.kind === "ga" && /\/g\/collect/.test(x.url) && x.url.includes(`tid=${GA_ID}`))) {
    const shared = new URL(e.url).searchParams;
    for (const line of e.body ? e.body.split("\n").filter(Boolean) : [""]) {
      const p = new URLSearchParams(line);
      const get = (k) => p.get(k) ?? shared.get(k);
      const en = get("en");
      if (!en) continue;
      const dl = get("dl") ?? "";
      events.push({ en, path: dl ? new URL(dl).pathname + new URL(dl).search : "?", title: get("dt"), method: get("ep.method"), lead_source: get("ep.lead_source"), service: get("ep.service") });
    }
  }
  return events;
}
const pageViews = (log) => gaEvents(log).filter((e) => e.en === "page_view").map((e) => e.path);
const adsConversions = (log) => log.filter((e) => e.kind === "ads" && /[?&]en=conversion\b/.test(e.url));
const external = (log) => log.filter((e) => !["local"].includes(e.kind));
const clickButton = (page, label) =>
  page.evaluate((text) => {
    const button = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === text);
    if (!button) throw new Error(`No button "${text}"`);
    button.click();
  }, label);
const navClick = async (page, href, expectPath) => {
  await page.click(`nav[aria-label="Main navigation"] a[href="${href}"]`);
  await page.waitForFunction((p) => location.pathname === p, {}, expectPath);
};
const safeDecode = (s) => { try { return decodeURIComponent(s.replace(/\+/g, " ")); } catch { return s; } };
const hasPII = (log) =>
  log.filter((e) => e.kind === "ga" || e.kind === "ads")
    .some((e) => PII.some((m) => (e.url + "\n" + e.body).includes(m) || safeDecode(e.url + "\n" + e.body).includes(m)));
const googleCookies = async (page) => (await page.cookies()).map((c) => c.name).filter((n) => /^(_ga|_gcl)/.test(n));
async function saveCustom(page, { analytics, ads, embeds }) {
  await page.evaluate(() => {
    const banner = document.querySelector('section[aria-labelledby="cookie-banner-title"]');
    const customise = [...banner.querySelectorAll("button")].find((b) => b.textContent.trim() === "Customise");
    customise?.click();
  });
  await page.waitForSelector('section[aria-labelledby="cookie-banner-title"] fieldset');
  await page.evaluate((want) => {
    const boxes = [...document.querySelectorAll('section[aria-labelledby="cookie-banner-title"] input[type=checkbox]:not([disabled])')];
    [want.analytics, want.ads, want.embeds].forEach((on, i) => { if (boxes[i].checked !== on) boxes[i].click(); });
  }, { analytics, ads, embeds });
  await clickButton(page, "Save choices");
}

const browser = await puppeteer.launch({ executablePath, headless: "new" });
const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

// A. No choice yet: every indexable route makes zero third-party requests.
{
  const { context, page, log } = await session(browser);
  for (const route of routes) await page.goto(BASE + route, { waitUntil: "networkidle0" });
  await sleep(1500);
  check(routes.length === 17, `sitemap lists 17 routes (got ${routes.length})`);
  check(external(log).length === 0, `no consent: zero third-party requests across all ${routes.length} routes (got ${external(log).map((e) => e.kind).join(",") || 0})`);
  check(!!(await page.$("#cookie-banner-title")), "no consent: banner visible");
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle0" });
  check(!(await page.$("iframe")) && (await page.content()).includes("Load map"), "contact: map placeholder, no iframe");
  check((await page.content()).includes("64 Galtymore Road"), "contact: address still visible without the map");
  await page.goto(`${BASE}/book`, { waitUntil: "networkidle0" });
  const book = await page.content();
  check(book.includes("Load booking calendar") && book.includes('href="https://calendly.com/neexcreative/30min"'), "book: Calendly placeholder plus direct Calendly link");
  check((await googleCookies(page)).length === 0, "no consent: no _ga/_gcl cookies");
  await context.close();
}

// B. Reject all: still nothing third-party anywhere.
{
  const { context, page, log } = await session(browser);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  await clickButton(page, "Reject all");
  for (const route of ["/contact", "/book", "/work"]) await page.goto(BASE + route, { waitUntil: "networkidle0" });
  await sleep(1500);
  check(external(log).length === 0, "rejected: zero third-party requests on /, /contact, /book, /work");
  await context.close();
}

// C. Click-to-load without consent: loads only that embed, only for this page view.
{
  const { context, page, log } = await session(browser);
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle0" });
  await clickButton(page, "Load map");
  await page.waitForSelector('iframe[title="Neex Creative Location"]');
  await sleep(2500);
  check(log.some((e) => e.kind === "maps"), "Load map: Google Maps requested after the click");
  check(!log.some((e) => ["ga", "ads", "gtagjs", "calendly"].includes(e.kind)), "Load map: no analytics, ads or Calendly requests");
  check(await page.evaluate(() => document.activeElement?.querySelector?.("iframe") !== null), "Load map: focus moved to the loaded map");
  log.length = 0;
  await page.reload({ waitUntil: "networkidle0" });
  await sleep(1000);
  check(!(await page.$("iframe")) && external(log).length === 0, "Load map is per page view: reload shows placeholder, no requests");
  await page.goto(`${BASE}/book`, { waitUntil: "networkidle0" });
  log.length = 0;
  await clickButton(page, "Load booking calendar");
  const loaded = await page.waitForSelector('[aria-label="Calendly booking calendar"] iframe', { timeout: 15000 }).then(() => true, () => false);
  check(loaded && log.some((e) => e.kind === "calendly"), "Load booking calendar: Calendly widget initialises with an iframe");
  check(!log.some((e) => ["ga", "ads", "gtagjs"].includes(e.kind)), "Calendly load: no analytics or ads requests");
  // Rejecting in Cookie settings after a click-load unloads it.
  await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Reject all")?.click());
  await sleep(500);
  check(!(await page.$('[aria-label="Calendly booking calendar"]')), "click-loaded embed is removed when the visitor then rejects");
  await context.close();
}

// D. Accept all: page views, no homepage conversion, embeds, contact and lead events.
{
  const { context, page, log } = await session(browser);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  await clickButton(page, "Accept all");
  await sleep(BATCH_WAIT);
  const loaders = log.filter((e) => e.kind === "gtagjs" && !/[?&]cx=c/.test(e.url));
  check(loaders.length === 1 && loaders[0].url.includes(`id=${GA_ID}`), `one site-loaded gtag.js (got ${loaders.length})`);
  check(await page.evaluate(() => document.querySelectorAll('script[src*="gtag/js?id=G-"]').length === 1), "one gtag.js <script> element");
  check(adsConversions(log).length === 0, "homepage load sends NO Google Ads conversion (retired)");

  // Each step's GA4 page_views, from intercepted network hits. Our explicit
  // dispatch sends exactly one per navigation; a second one means GA4's
  // automatic history page views are still enabled in the GA4 account.
  const initialViews = pageViews(log);
  check(JSON.stringify(initialViews) === '["/"]', `initial load: exactly one page_view (got ${JSON.stringify(initialViews)})`);
  const steps = [];
  const step = async (label, expectPath, action) => {
    const before = gaEvents(log).length;
    await action();
    await sleep(BATCH_WAIT);
    const views = gaEvents(log).slice(before).filter((e) => e.en === "page_view");
    steps.push({ label, expectPath, views });
  };
  await step("Link /work", "/work", () => navClick(page, "/work", "/work"));
  await step("Link /services", "/services", () => navClick(page, "/services", "/services"));
  await step("browser back", "/work", () => page.goBack());
  await step("browser forward", "/services", () => page.goForward());
  await step("Link /#work (hash on another route)", "/", async () => { await page.click('main a[href="/#work"]'); await page.waitForFunction(() => location.pathname === "/"); });
  await step("Link /web-design + immediate in-page anchor", "/web-design", async () => { await navClick(page, "/web-design", "/web-design"); await page.click('a[href="#service-work"]'); });
  await step("query change (history.pushState)", "/web-design?ref=test", () => page.evaluate(() => history.pushState(history.state, "", "/web-design?ref=test")));
  await step("hash-only change", null, () => page.evaluate(() => { location.hash = "service-work-2"; }));
  let pendingDuplicates = 0;
  for (const s of steps) {
    const own = s.views.filter((v) => v.path === s.expectPath);
    const stray = s.views.filter((v) => v.path !== s.expectPath);
    if (s.expectPath === null) { check(s.views.length === 0, `${s.label}: no page_view (got ${JSON.stringify(s.views.map((v) => v.path))})`); continue; }
    check(own.length >= 1 && own.length <= 2 && stray.length === 0, `${s.label}: page_view for ${s.expectPath} sent (${own.length}x), nothing else`);
    if (own.length === 2) pendingDuplicates++;
  }
  const fast = steps.find((s) => s.label.includes("immediate"));
  check(fast.views.some((v) => v.path === "/web-design"), "explicit dispatch proven: /web-design counted even though GA4's automatic history tracking drops it");
  const work = steps[0].views.find((v) => v.path === "/work");
  check(work?.title === "Work | Neex Creative", `page_view carries the new page title (got "${work?.title}")`);
  if (pendingDuplicates) {
    console.log(`PENDING GA4 ADMIN: ${pendingDuplicates}/${steps.length - 1} navigations also produced GA4's automatic history page_view.`);
    console.log("        Turn OFF Admin > Data streams > Enhanced measurement > Page views > 'Page changes based on browser history events' before deploying.");
    if (process.env.STRICT_GA === "1") check(false, "STRICT_GA: no duplicate page_views");
  } else {
    check(true, "no duplicate page_views (automatic history page views are off)");
  }

  await navClick(page, "/contact", "/contact");
  const mapAuto = await page.waitForSelector('iframe[title="Neex Creative Location"]', { timeout: 5000 }).then(() => true, () => false);
  check(mapAuto, "external content allowed: map loads without a click");

  const before = gaEvents(log).length;
  await page.evaluate(() => {
    const link = document.querySelector('a[href^="https://wa.me/"]');
    link.addEventListener("click", (e) => e.preventDefault(), { once: true });
    link.click();
  });
  await sleep(BATCH_WAIT);
  const contactEvents = gaEvents(log).slice(before).filter((e) => e.en === "contact");
  check(contactEvents.length === 1 && contactEvents[0].method === "whatsapp", `WhatsApp click: one GA4 contact {method: whatsapp} (got ${JSON.stringify(contactEvents)})`);
  check(adsConversions(log).length === 0, "WhatsApp click: no Ads conversion while its action is unmapped (null)");

  // Form.
  const fill = async () => {
    await page.type("#full-name", "Zed Testperson");
    await page.type("#email", "zed.pii@example.com");
    await page.type("#phone", "+353870000000");
    await page.type("#location", "PII-TOWN");
    await page.select("#service", "web-full");
    await page.type("#project-details", "PII-DETAILS");
    await page.type("#message", "PII-MARKER-MESSAGE");
  };
  const leadsBefore = gaEvents(log).filter((e) => e.en === "generate_lead").length;
  const postsBefore = log.filter((e) => e.kind === "form").length;
  await fill();
  if (FORM_MODE === "endpoint") {
    // Two synchronous clicks: the second must hit the disabled button.
    await page.evaluate(() => {
      const button = document.querySelector('form button[type="submit"]');
      button.click();
      button.click();
    });
  } else {
    await page.click('form button[type="submit"]');
  }
  await sleep(BATCH_WAIT);
  if (FORM_MODE === "endpoint") {
    const posts = log.filter((e) => e.kind === "form").length - postsBefore;
    check(posts === 1, `double click submits the form once (got ${posts} POSTs)`);
  }
  const formEvents = gaEvents(log).filter((e) => e.en === "generate_lead" || e.en === "contact").slice(-2);
  if (FORM_MODE === "endpoint") {
    check(log.some((e) => e.kind === "form" && e.url === MOCK_ENDPOINT), `form posted to the configured endpoint (${MOCK_ENDPOINT})`);
    const leads = gaEvents(log).filter((e) => e.en === "generate_lead");
    check(leads.length - leadsBefore === 1 && leads.at(-1).lead_source === "quote_form" && leads.at(-1).service === "web-full", `form accepted (200): exactly one generate_lead {quote_form, web-full} (got ${JSON.stringify(leads)})`);
    check((await page.content()).includes("Your enquiry is on its way"), "form accepted: success message shown");
    await sleep(2000);
    check(gaEvents(log).filter((e) => e.en === "generate_lead").length - leadsBefore === 1, "no duplicate lead after rerenders");
    log.push({ kind: "form-fail-next", url: "x:/", body: "" });
    await fill();
    await page.click('form button[type="submit"]');
    await sleep(BATCH_WAIT);
    check(gaEvents(log).filter((e) => e.en === "generate_lead").length - leadsBefore === 1, "form rejected (500): no lead event");
    check((await page.content()).includes("Something went wrong sending the form"), "form rejected: error message shown");
  } else {
    const drafts = gaEvents(log).filter((e) => e.en === "contact" && e.method === "email_draft");
    check(drafts.length === 1, `mailto fallback: one GA4 contact {method: email_draft} (got ${JSON.stringify(formEvents)})`);
    check(gaEvents(log).filter((e) => e.en === "generate_lead").length === leadsBefore, "mailto fallback: NOT counted as a lead");
  }
  check(adsConversions(log).length === 0, "form: no Ads conversion while quoteFormLead is unmapped (null)");
  check(!hasPII(log), "no personal data in any Google request");

  // Calendly booking signal.
  await navClick(page, "/web-design", "/web-design");
  await page.goto(`${BASE}/book`, { waitUntil: "networkidle0" });
  const calendlyAuto = await page.waitForSelector('[aria-label="Calendly booking calendar"] iframe', { timeout: 15000 }).then(() => true, () => false);
  check(calendlyAuto, "external content allowed: Calendly loads without a click");
  const leadCount = () => gaEvents(log).filter((e) => e.en === "generate_lead" && e.lead_source === "calendly_booking").length;
  await page.evaluate(() => {
    const send = (origin, uri) => window.dispatchEvent(new MessageEvent("message", { origin, data: { event: "calendly.event_scheduled", payload: { event: { uri }, invitee: { uri: "https://api.calendly.com/invitees/PII-MARKER-MESSAGE" } } } }));
    send("https://calendly.com", "https://api.calendly.com/scheduled_events/TEST-1");
    send("https://calendly.com", "https://api.calendly.com/scheduled_events/TEST-1");
    send("https://evil.example", "https://api.calendly.com/scheduled_events/TEST-2");
    window.dispatchEvent(new MessageEvent("message", { origin: "https://calendly.com", data: { event: "calendly.date_and_time_selected" } }));
  });
  await sleep(BATCH_WAIT);
  check(leadCount() === 1, `Calendly: one generate_lead for a scheduled event; duplicates, spoofed origins and non-booking events ignored (got ${leadCount()})`);
  check(!hasPII(log), "Calendly: no booking identifiers or personal data sent");
  // Client-side return to /book re-initialises the widget.
  await navClick(page, "/web-design", "/web-design");
  const marker = await page.evaluate(() => (window.__spaMarker = Math.random()));
  await page.click('main a[href="/book"]');
  await page.waitForFunction(() => location.pathname === "/book");
  check(await page.evaluate((m) => window.__spaMarker === m, marker), "returned to /book by client-side navigation (no full reload)");
  const reinit = await page.waitForSelector('[aria-label="Calendly booking calendar"] iframe', { timeout: 15000 }).then(() => true, () => false);
  check(reinit, "Calendly re-initialises after returning to /book");
  await context.close();
}

// E. Analytics only: GA4 runs; no Ads and no embeds.
{
  const { context, page, log } = await session(browser);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  await saveCustom(page, { analytics: true, ads: false, embeds: false });
  await sleep(BATCH_WAIT);
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle0" });
  await sleep(BATCH_WAIT);
  check(pageViews(log).length === 2, `analytics only: page_views for / and /contact (got ${JSON.stringify(pageViews(log))})`);
  check(!log.some((e) => e.kind === "ads"), "analytics only: zero Google Ads requests");
  check(!(await page.$("iframe")) && !log.some((e) => e.kind === "maps"), "analytics only: map not loaded");
  await context.close();
}

// F. Ads only: no GA4 at all.
{
  const { context, page, log } = await session(browser);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
  await saveCustom(page, { analytics: false, ads: true, embeds: false });
  await sleep(BATCH_WAIT);
  check(!log.some((e) => e.kind === "ga"), "ads only: zero GA4 requests");
  check(adsConversions(log).length === 0, "ads only: still no homepage conversion");
  // Adding analytics later sends exactly one page_view for the current page.
  await page.evaluate(() => document.querySelector('footer button')?.click());
  await saveCustom(page, { analytics: true, ads: true, embeds: false });
  await sleep(BATCH_WAIT);
  check(JSON.stringify(pageViews(log)) === '["/"]', `analytics added later: one page_view for the current page (got ${JSON.stringify(pageViews(log))})`);
  await context.close();
}

// G. Withdrawal.
{
  const { context, page, log } = await session(browser);
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle0" });
  await clickButton(page, "Accept all");
  await page.waitForSelector('iframe[title="Neex Creative Location"]');
  await sleep(BATCH_WAIT);
  // Withdraw External content only: reload, map gone, analytics cookies kept.
  const gaBefore = (await googleCookies(page)).filter((n) => n.startsWith("_ga"));
  await page.evaluate(() => document.querySelector("footer button")?.click());
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), saveCustom(page, { analytics: true, ads: true, embeds: false })]);
  await sleep(1500);
  check(!(await page.$("iframe")), "withdraw External content: page reloads with the map placeholder");
  const gaAfter = (await googleCookies(page)).filter((n) => n.startsWith("_ga"));
  check(gaBefore.length > 0 && gaBefore.every((n) => gaAfter.includes(n)), `withdraw External content: GA cookies untouched [${gaAfter.join(", ")}]`);
  // Withdraw everything.
  await page.evaluate(() => document.querySelector("footer button")?.click());
  await page.waitForSelector("#cookie-banner-title");
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), clickButton(page, "Reject all")]);
  log.length = 0;
  await sleep(3000);
  check(external(log).length === 0, "withdraw all: reloaded page makes zero third-party requests");
  check((await googleCookies(page)).length === 0, "withdraw all: _ga/_gcl cookies removed");
  check(await page.evaluate(() => !document.querySelector('script[src*="gtag/js"]')), "withdraw all: no gtag.js on the page");
  await context.close();
}

await browser.close();
console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);
