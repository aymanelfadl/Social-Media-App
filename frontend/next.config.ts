import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "randomuser.me",
      "picsum.photos",
      // common auth/CDN providers – add the ones you actually use
      "res.cloudinary.com",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      // supabase storage public buckets (adjust to your project if used)
      "objectstorage.us-ashburn-1.oraclecloud.com",
    ],
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "true",
  },
};

export default nextConfig;
