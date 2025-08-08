import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["randomuser.me", "picsum.photos"],
  },
};

export default nextConfig;
