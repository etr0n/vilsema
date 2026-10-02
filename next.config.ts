import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name>/, so the build sets
// NEXT_PUBLIC_BASE_PATH=/vilsema. Locally it is empty and the site runs at /.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
