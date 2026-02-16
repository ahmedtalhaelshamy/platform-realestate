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

  // 🚀 قسم التحويلات (هذا هو الجزء الناقص الذي سيحل مشكلة الـ 404)
  async redirects() {
    return [
      // 1. تحويل إجباري من www إلى النسخة الأصلية (للحفاظ على قوة الـ SEO)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.platformrealestate.co' }],
        destination: 'https://platformrealestate.co/:path*',
        permanent: true,
      },
      // 2. حل مشكلة صفحة "من نحن"
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
      // 3. حل مشكلة التجمع الخامس (من منطقة إلى حي)
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

  experimental: {
    // optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;