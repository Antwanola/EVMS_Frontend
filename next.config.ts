// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
    async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://18.171.110.52:3000/:path*",
        // 👆 point this to your backend server port
        // If your Docker backend is still on 3000, change to 3000
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
