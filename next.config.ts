import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages (custom domain serves repo at root,
  // so no basePath is needed). Deployed via .github/workflows/deploy.yml.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
