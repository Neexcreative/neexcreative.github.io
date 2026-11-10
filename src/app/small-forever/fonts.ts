import { DM_Sans, Fraunces } from "next/font/google";

/* Fonts: Fraunces (soft, warm serif) for headings, DM Sans (friendly, clear) for text. */
export const serif = Fraunces({
  variable: "--font-sf-serif",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
export const sans = DM_Sans({
  variable: "--font-sf-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Base type styles shared by every Small Forever page. */
export const sfBaseCss = `
  .sf-root{font-family:var(--font-sf-sans),ui-sans-serif,system-ui,sans-serif}
  .sf-serif{font-family:var(--font-sf-serif),Georgia,serif;font-weight:400;letter-spacing:-0.015em;font-variation-settings:"SOFT" 100;font-variant-numeric:lining-nums}
  .sf-serif em{font-variation-settings:"SOFT" 100}
`;
