import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "commondatastorage.googleapis.com"],
  },
};

export default nextConfig;
