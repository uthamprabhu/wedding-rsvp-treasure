import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only badge: keep it off the bottom-left share button.
  devIndicators: { position: 'top-right' },
  images: {
    // Serve modern formats — Next.js negotiates AVIF/WebP automatically.
    formats: ["image/avif", "image/webp"],
    // Device widths covering every viewport the invitation targets.
    deviceSizes: [390, 430, 768, 1024, 1280, 1920],
    // Intermediate sizes for srcset — covers portrait thumbnails etc.
    imageSizes: [128, 256, 384],
    // Demo build: stand-in couple photos are free Unsplash images.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;
