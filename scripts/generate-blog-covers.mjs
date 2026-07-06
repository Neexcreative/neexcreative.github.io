/**
 * Generates the dark editorial blog cover images in /public/images/blog.
 * Pure geometry (no text) so rendering never depends on installed fonts.
 * Run: node scripts/generate-blog-covers.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const W = 1600;
const H = 900;
const BG = "#0a0a0a";
const SURFACE = "#141414";
const LINE = "#2a2a2a";
const ACCENT = "#e63329";
const TEXTC = "#f5f5f0";

const frame = (inner) => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="${LINE}" stroke-width="1"/>
  ${inner}
  <rect x="40" y="${H - 44}" width="120" height="4" fill="${ACCENT}"/>
</svg>`;

/* client-journey: four stage nodes handed along one line, trust building. */
const clientJourney = frame(`
  <line x1="200" y1="450" x2="1400" y2="450" stroke="${LINE}" stroke-width="2"/>
  ${[0, 1, 2, 3]
    .map((i) => {
      const x = 280 + i * 347;
      const r = 26 + i * 14;
      const last = i === 3;
      return `
        <circle cx="${x}" cy="450" r="${r}" fill="${last ? ACCENT : SURFACE}" stroke="${last ? ACCENT : TEXTC}" stroke-width="2" stroke-opacity="${last ? 1 : 0.55}"/>
        <line x1="${x}" y1="${450 + r + 18}" x2="${x}" y2="620" stroke="${LINE}" stroke-width="1.5"/>
        <line x1="${x}" y1="280" x2="${x}" y2="${450 - r - 18}" stroke="${LINE}" stroke-width="1.5"/>`;
    })
    .join("")}
  <path d="M 1330 450 l -26 -14 v 28 z" fill="${ACCENT}"/>
`);

/* six-second-rule: a dial with six ticks, the sixth burning accent. */
const sixSecond = frame(`
  <circle cx="800" cy="450" r="260" fill="none" stroke="${LINE}" stroke-width="2"/>
  <circle cx="800" cy="450" r="180" fill="none" stroke="${LINE}" stroke-width="1"/>
  ${[...Array(12)]
    .map((_, i) => {
      const a = (i * 30 - 90) * (Math.PI / 180);
      const active = i < 6;
      const r1 = 260;
      const r2 = active ? 320 : 292;
      const x1 = 800 + r1 * Math.cos(a);
      const y1 = 450 + r1 * Math.sin(a);
      const x2 = 800 + r2 * Math.cos(a);
      const y2 = 450 + r2 * Math.sin(a);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${active ? ACCENT : TEXTC}" stroke-opacity="${active ? 1 : 0.35}" stroke-width="${active ? 6 : 2}"/>`;
    })
    .join("")}
  <path d="M 800 450 L 800 250 A 200 200 0 0 1 973 350 Z" fill="${ACCENT}" fill-opacity="0.85"/>
  <circle cx="800" cy="450" r="14" fill="${TEXTC}"/>
`);

/* brand-system: a grid of tiles — one mark alone vs. the system around it. */
const brandSystem = frame(`
  ${[...Array(4)]
    .map((_, row) =>
      [...Array(7)]
        .map((_, col) => {
          const x = 220 + col * 170;
          const y = 190 + row * 140;
          const isMark = row === 1 && col === 2;
          return isMark
            ? `<rect x="${x}" y="${y}" width="130" height="100" fill="${ACCENT}"/>`
            : `<rect x="${x}" y="${y}" width="130" height="100" fill="${SURFACE}" stroke="${LINE}" stroke-width="1.5"/>
               <line x1="${x + 20}" y1="${y + 70}" x2="${x + 80}" y2="${y + 70}" stroke="${TEXTC}" stroke-opacity="0.25" stroke-width="4"/>
               <rect x="${x + 20}" y="${y + 22}" width="26" height="26" fill="none" stroke="${ACCENT}" stroke-opacity="0.5" stroke-width="2"/>`;
        })
        .join(""),
    )
    .join("")}
`);

/* sales-system: wide attention converging through stages to one action. */
const salesSystem = frame(`
  ${[...Array(14)]
    .map((_, i) => {
      const y = 170 + i * 40;
      return `<line x1="180" y1="${y}" x2="700" y2="${380 + i * 10}" stroke="${TEXTC}" stroke-opacity="0.16" stroke-width="1.5"/>`;
    })
    .join("")}
  <line x1="700" y1="380" x2="700" y2="520" stroke="${LINE}" stroke-width="2"/>
  ${[0, 1, 2]
    .map((i) => {
      const x = 760 + i * 200;
      return `<rect x="${x}" y="400" width="130" height="100" fill="${SURFACE}" stroke="${TEXTC}" stroke-opacity="0.4" stroke-width="2"/>
              <line x1="${x + 130}" y1="450" x2="${x + 200}" y2="450" stroke="${LINE}" stroke-width="2"/>`;
    })
    .join("")}
  <circle cx="1420" cy="450" r="52" fill="${ACCENT}"/>
  <path d="M 1398 450 h 32 m -12 -12 l 14 12 l -14 12" stroke="${TEXTC}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
`);

const covers = {
  "client-journey.jpg": clientJourney,
  "six-second-rule.jpg": sixSecond,
  "brand-system.jpg": brandSystem,
  "sales-system.jpg": salesSystem,
};

const outDir = path.join(process.cwd(), "public", "images", "blog");
mkdirSync(outDir, { recursive: true });

for (const [file, svg] of Object.entries(covers)) {
  await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(path.join(outDir, file));
  console.log("wrote", file);
}
