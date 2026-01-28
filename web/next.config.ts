import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/ultimate-blackjack-card-counting-app-guide-2026',
        destination: '/ultimate-blackjack-card-counting-app-guide',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
