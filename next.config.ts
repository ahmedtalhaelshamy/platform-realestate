import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**', 
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // 🚀 التحويلات اللي صلحناها للـ SEO
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.platformrealestate.co' }],
        destination: 'https://platformrealestate.co/:path*',
        permanent: true,
      },
      {
        source: '/ar/about',
        destination: '/ar/about-us',
        permanent: true,
      },
      {
        source: '/en/about',
        destination: '/en/about-us',
        permanent: true,
      },
      {
        source: '/ar/locations/fifth-settlement',
        destination: '/ar/districts/fifth-settlement',
        permanent: true,
      },
      {
        source: '/en/locations/fifth-settlement',
        destination: '/en/districts/fifth-settlement',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;