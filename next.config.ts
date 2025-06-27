import type { NextConfig } from "next";

const nextConfig: NextConfig = {
      images: {
    domains: ['images.unsplash.com'],
    // Alternative using remotePatterns (more specific):
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'images.unsplash.com',
    //   },
    // ],
  },

  /* config options here */
};

export default nextConfig;
