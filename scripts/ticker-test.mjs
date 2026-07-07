import puppeteer from "puppeteer-core";

const chromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
];
const { existsSync } = await import("node:fs");
const executablePath = chromePaths.find((p) => existsSync(p));
if (!executablePath) throw new Error("Chrome not found");

const browser = await puppeteer.launch({ executablePath, headless: "new" });
const page = await browser.newPage();
await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: process.env.REDUCE ? "reduce" : "no-preference" },
]);
await page.goto(process.env.URL ?? "http://localhost:3000/", { waitUntil: "networkidle0" });

const result = await page.evaluate(async () => {
  const track = document.querySelector(".marquee-track");
  if (!track) return { error: "no .marquee-track element" };
  const style = getComputedStyle(track);
  const diag = {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    stylesheets: [...document.styleSheets].map((s) => s.href ?? "inline"),
    trackClass: track.className,
  };
  const x1 = track.getBoundingClientRect().x;
  await new Promise((r) => setTimeout(r, 1200));
  const x2 = track.getBoundingClientRect().x;
  return {
    ...diag,
    animationName: style.animationName,
    animationDuration: style.animationDuration,
    animationPlayState: style.animationPlayState,
    x1,
    x2,
    moved: Math.abs(x1 - x2) > 1,
  };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
