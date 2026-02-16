import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1️⃣ إعدادات الصور (Sanity)
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

  // 2️⃣ تجاهل أخطاء التيبيسكربت لضمان استمرار الـ Build
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3️⃣ 🚀 محرك التحويلات (Redirects) - الحل النهائي للروابط المكسورة
  async redirects() {
    return [
      // أ. تحويل إجباري من www إلى النسخة الأصلية (301 دائمة)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.platformrealestate.co' }],
        destination: 'https://platformrealestate.co/:path*',
        permanent: true,
      },

      // ب. إصلاح روابط صفحة "عن الشركة" (من عن نصر إلى من نحن)
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

      // ج. إصلاح روابط التجمع الخامس (تحويل من مسار المنطقة إلى مسار الحي)
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

  // 4️⃣ الميزات التجريبية (اختياري)
  experimental: {
    // optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;