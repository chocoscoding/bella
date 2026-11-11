import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false,
  images: { qualities: [75, 95] },
  // The pizza hero (formerly /v2) is now the home page; old comparison URLs fold into it.
  async redirects() {
    return [
      { source: "/v1", destination: "/", permanent: true },
      { source: "/v2", destination: "/", permanent: true },
    ];
  },
};
export default nextConfig;
