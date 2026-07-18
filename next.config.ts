import type { NextConfig } from "next";

/**
 * Static export — the site is served by GitHub Pages from `out/`.
 * No server runtime, so no image optimisation loader and no API routes.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
