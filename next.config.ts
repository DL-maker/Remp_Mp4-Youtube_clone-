import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: { 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thispersondoesnotexist.com",// this is a fake person generator
      },
      {
        protocol: "http",
        hostname: "test.com", // ...
      }
    ],
  }
};

export default nextConfig;
