import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/**"),
      new URL("https://cdn.jsdelivr.net/**"),
      new URL("https://normal-disposer.biz/**"),
      new URL("https://loremflickr.com/**"),
      new URL("https://therealielts.vn/**"),
      new URL("https://avatars.githubusercontent.com/**"),
    ],
    // unoptimized: process.env.NODE_ENV === 'production',
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
};

export default nextConfig;
