import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["dev.onmindcrm.com"],
  devIndicators: false,
  serverExternalPackages: ["@resvg/resvg-js", "sharp", "satori"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
    ],
  },
};

export default nextConfig;
