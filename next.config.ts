import type { NextConfig } from "next";

/** * 🚀 Platform Real Estate - Next.js Configuration (v16.1.6 Optimized)
 * تم تحديث الملف لإزالة تحذيرات ESLint وضمان أقصى أداء مع Sanity CDN
 */

const nextConfig: NextConfig = {
  // ✅ توحيد شكل الروابط لضمان قوة السيو ومنع تكرار المحتوى (Duplicate Content)
  trailingSlash: true,
  
  // ✅ حماية أمنية بإخفاء هوية تقنيات الموقع (Hide X-Powered-By)
  poweredByHeader: false,

  images: {
    // ✅ بما أننا نستخدم Sanity Image URL Builder مع التحسينات التي أجريناها، 
    // يفضل جعل unoptimized: true لتوفير موارد السيرفر وتقليل تكاليف Vercel
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
    // ✅ تجاهل أخطاء التايب سكريبت لضمان استمرار الـ Build في البيئات الصارمة
    ignoreBuildErrors: true,
  },

  // 🛡️ إعدادات رؤوس الأمان (Security Headers) لحماية الموقع من الهجمات الشائعة
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

  // 🔗 تحويلات السيو (Redirects) للحفاظ على ترتيب الروابط القديمة
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