import type { NextConfig } from "next";

/*
 * Security headers on every response.
 *
 * Content-Security-Policy: ENFORCED in production, report-only in `next dev`
 * (the dev server needs eval and a websocket for hot reload).
 *
 * It is an allowlist policy: only our own origin and the services below can
 * run scripts, receive data or be framed, nothing can frame us, plugins are
 * off and forms can only post to us or Stripe Checkout. Third parties load
 * only after consent (GA4/Ads, Meta Pixel, Calendly), so before consent the
 * page talks to no one else.
 *
 * script-src keeps 'unsafe-inline' because Next.js prerenders pages with
 * inline bootstrap scripts. A nonce-based policy ('strict-dynamic') would
 * require rendering every page on each request (no static pages or CDN
 * cache); that is a deliberate trade-off, documented in the security notes.
 * 'unsafe-eval' is never allowed in production.
 */
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://checkout.stripe.com",
  [
    "script-src 'self' 'unsafe-inline'",
    isDev ? "'unsafe-eval'" : "",
    "https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com",
    "https://connect.facebook.net https://assets.calendly.com https://vercel.live",
  ].join(" "),
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com https://vercel.live",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://vercel.live https://assets.vercel.com",
  [
    "connect-src 'self'",
    "https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    "https://www.google.com https://www.google.ie https://*.doubleclick.net https://www.googleadservices.com",
    "https://www.facebook.com https://connect.facebook.net",
    "https://formspree.io https://calendly.com",
    "https://vercel.live wss://ws-us3.pusher.com",
    isDev ? "ws: http://localhost:*" : "",
  ].join(" "),
  [
    "frame-src https://calendly.com https://www.youtube.com https://www.youtube-nocookie.com",
    "https://www.google.com https://td.doubleclick.net https://bid.g.doubleclick.net https://www.googletagmanager.com https://vercel.live",
  ].join(" "),
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  isDev ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ")
  .replace(/\s+/g, " ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=(), payment=(), interest-cohort=()" },
  { key: isDev ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  images: { qualities: [50, 75] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Vary", value: "Accept, Accept-Encoding" },
          ...securityHeaders,
        ],
      },
    ];
  },
  // Bundle instead of externalizing: Turbopack externals need junction
  // points, which this drive's filesystem doesn't support.
  transpilePackages: ["next-mdx-remote"],

  // Permanent redirects covering every URL from the legacy static site's
  // sitemap history, so no indexed URL breaks.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/book.html", destination: "/book", permanent: true },
      { source: "/web-design.html", destination: "/web-design", permanent: true },
      // Legacy asset paths that may be linked externally (resume especially).
      { source: "/assets/docs/:file*", destination: "/docs/:file*", permanent: true },
      { source: "/assets/icons/:file*", destination: "/icons/:file*", permanent: true },
      // Web screenshots moved into /images/work/ — must precede the wildcard.
      ...["rg-mobile-homepage.png", "studio-ag-homepage.png", "neex-portfolio-homepage.png", "vornstore.png"].map(
        (file) => ({
          source: `/assets/img/${file}`,
          destination: `/images/work/${file}`,
          permanent: true,
        }),
      ),
      { source: "/assets/img/:file*", destination: "/images/:file*", permanent: true },
    ];
  },
};

export default nextConfig;
