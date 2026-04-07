import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "tally.so" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "kxptt4m9j4.ufs.sh" },
      { protocol: "https", hostname: "me7aitdbxq.ufs.sh" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
