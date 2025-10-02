import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.rossslaney.com",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
