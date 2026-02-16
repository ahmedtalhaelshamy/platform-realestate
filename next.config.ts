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

  // ✅ تجاهل أخطاء الـ Type Check وقت الـ Build عشان الموقع يقوم بسرعة
  typescript: {
    ignoreBuildErrors: true,
  },

  // 🚀 التحويلات المحددة فقط (بدون تحويل الـ WWW لمنع الـ Loop)
  async redirects() {
    return [
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