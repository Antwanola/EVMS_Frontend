// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack(config) {
    // Add SVGR loader for SVGs
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/, // only apply on .js/.ts/.jsx/.tsx files
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
