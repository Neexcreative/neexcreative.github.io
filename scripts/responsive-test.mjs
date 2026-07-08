/**
 * Horizontal-overflow check: loads every page type at narrow viewports and
 * fails if the document is wider than the viewport (horizontal scroll).
 * Run with the production server on :3000 — node scripts/responsive-test.mjs
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const chromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
];
const executablePath = chromePaths.find((p) => existsSync(p));
if (!executablePath) throw new Error("Chrome not found");

const pages = [
  "/",
  "/about",
  "/services",
  "/services/brand-strategy-design",
  "/web-design",
  "/contact",
  "/book",
  "/blog",
  "/blog/website-sales-system",
];
const widths = [320, 375, 768];

const browser = await puppeteer.launch({ executablePath, headless: "new" });
const page = await browser.newPage();
let failures = 0;

for (const path of pages) {
  for (const width of widths) {
    await page.setViewport({ width, height: 800 });
    await page.goto(`http://localhost:3000${path}`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 700)); // let layout/fonts settle
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 0) {
      failures++;
      console.log(`FAIL ${path} @${width}px — ${overflow}px horizontal overflow`);
    }
  }
  console.log(`ok   ${path} (320/375/768)`);
}

await browser.close();
console.log(failures === 0 ? "\nALL PASS — no horizontal scroll anywhere" : `\n${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
