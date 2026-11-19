import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 90] },
  // keep the dev-mode "N" badge out of screenshots / screen exports
  devIndicators: false,
};

export default nextConfig;
