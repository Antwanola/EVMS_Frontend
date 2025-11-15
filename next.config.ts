// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Disable ESLint and TypeScript errors from blocking builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Rewrites for your backend API
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://18.171.110.52:3000/:path*",
      },
    ];
  },

  // ✅ SVGR support for importing SVGs as React components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
