import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
