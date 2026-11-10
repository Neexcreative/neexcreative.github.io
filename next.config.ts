import type { NextConfig } from "next";

/*
 * Security headers on every response.
 * The Content-Security-Policy is REPORT-ONLY for now: browsers log what it
 * would block (DevTools console) without breaking anything. Once the logs
 * are clean on the live site, rename the key to "Content-Security-Policy".
 * Third parties allowed: Google tag (GA4/Ads) and Meta Pixel (only after consent), Calendly,
 * YouTube, Stripe Checkout (redirect target) and the contact form endpoint.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://assets.calendly.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.google.com https://*.doubleclick.net https://formspree.io https://www.facebook.com https://connect.facebook.net",
  "frame-src https://calendly.com https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://td.doubleclick.net",
  // Add "upgrade-insecure-requests" when switching from Report-Only to enforced:
  // browsers ignore it in a report-only policy.
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=(), interest-cohort=()" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
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
