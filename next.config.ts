import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle instead of externalizing: Turbopack externals need junction
  // points, which this drive's filesystem doesn't support.
  transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
