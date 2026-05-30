import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "inventorycsvchecker.com" }],
        destination: "https://www.inventorycsvchecker.com/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
