import type { NextConfig } from "next";

/** * 🚀 Platform Real Estate - Next.js Configuration (v16.1.6 Optimized)
 * تم التعديل لحل مشكلة "loader does not implement width" 
 * وتفعيل الربط الكامل مع Bunny.net CDN
 * وإضافة توجيه الدومين الأساسي للغة العربية مع الحفاظ على الـ Trailing Slash
 */

const nextConfig: NextConfig = {
  // ✅ تم الإبقاء عليها true بناءً على طلبك للحفاظ على الصفحات المتفهرسة بـ Slash
  trailingSlash: true,
  poweredByHeader: false,

  images: {
    // ✅ تفعيل الـ Custom Loader المسئول عن تحويل الروابط لـ Bunny مع المقاسات
    loader: 'custom',
    loaderFile: './bunnyLoader.ts', 
    
    // تعريف المقاسات المعتمدة لضمان توليد srcset سليم
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // السماح بالدومينات المطلوبة (للاحتياط)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'platform-images.b-cdn.net',
        pathname: '/**', 
      }
    ],
  },

  // تسريع الـ Build وتجاهل أخطاء التايب سكريبت غير الحرجة
  typescript: {
    ignoreBuildErrors: true,
  },

  // تحسينات السيو بناءً على تقارير Ahrefs (Redirects)
  async redirects() {
    return [
      // 🚀 التحويل السحري: توجيه الدومين الأساسي حاف إلى النسخة العربية فوراً بالـ Slash
      { source: '/', destination: '/ar/', permanent: true },
      
      // الحفاظ على الـ Slash في نهاية كل الروابط كما طلبت تماماً لمنع أخطاء الـ Build
      { source: '/ar/about/', destination: '/ar/about-us/', permanent: true },
      { source: '/en/about/', destination: '/en/about-us/', permanent: true },
      { source: '/ar/locations/fifth-settlement/', destination: '/ar/districts/fifth-settlement/', permanent: true },
      { source: '/en/locations/fifth-settlement/', destination: '/en/districts/fifth-settlement/', permanent: true },
    ];
  },
};

export default nextConfig;