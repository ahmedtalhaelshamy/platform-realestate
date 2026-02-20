import type { NextConfig } from "next";

/** * 🚀 Platform Real Estate - Next.js Configuration (v16.1.6 Optimized)
 * تم تعديل الملف لإزالة التحذيرات وضمان أسرع Build ممكن
 */

const nextConfig: NextConfig = {
  // ✅ توحيد شكل الروابط لضمان قوة السيو ومنع تكرار المحتوى
  trailingSlash: true,
  
  // ✅ حماية أمنية بإخفاء هوية تقنيات الموقع عن المتلصصين
  poweredByHeader: false,

  images: {
    // تم تفعيل unoptimized لضمان التوافق مع أغلب الاستضافات، 
    // لو هترفع على Vercel يفضل جعلها false لضغط الصور برمجياً.
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
    // تم الإبقاء عليها لتجاوز أخطاء التايب سكريبت أثناء الـ Build كما طلبت
    ignoreBuildErrors: true,
  },

  // 🛡️ إعدادات رؤوس الأمان (Security Headers)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // 🔗 تحويلات السيو (Redirects)
  async redirects() {
    return [
      { source: '/ar/about', destination: '/ar/about-us/', permanent: true },
      { source: '/en/about', destination: '/en/about-us/', permanent: true },
      { source: '/ar/locations/fifth-settlement', destination: '/ar/districts/fifth-settlement/', permanent: true },
      { source: '/en/locations/fifth-settlement', destination: '/en/districts/fifth-settlement/', permanent: true },
    ];
  },
};

export default nextConfig;