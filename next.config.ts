// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    // ✅ Disable ESLint during next build
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ disable type errors blocking build
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://18.171.110.52:3000/:path*",
      },
    ];
  },

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
