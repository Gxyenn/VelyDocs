import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages needs the standalone output for next-on-pages.
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
