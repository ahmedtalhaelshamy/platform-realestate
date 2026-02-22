import { MetadataRoute } from 'next';

/**
 * 🤖 Robots.txt Configuration - The SEO Compass
 * التحديث: تم فتح مسارات التحقق لضمان عدم حدوث خطأ "Permission denied"
 */
export default function robots(): MetadataRoute.Robots {
  // 🏁 الدومين الموحد المعتمد
  const baseUrl = 'https://platformrealestate.co';

  return {
    rules: [
      {
        /**
         * 1️⃣ قاعدة عامة لجميع محركات البحث (Google, Bing, etc.)
         */
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/', // لضمان رندرة CSS بشكل صحيح
          '/_next/image/',  // لأرشفة الصور المحسنة
          '/api/og/',       // لصور مشاركة السوشيال ميديا
        ],
        disallow: [
          '/studio/',       // لوحة تحكم Sanity
          '/admin/',        // المسارات الإدارية
          '/api/',          // منع أرشفة الـ APIs العامة
          '/private/',      // الملفات الخاصة
          '/*?*',           // منع تكرار المحتوى بسبب الفلاتر
        ],
      },
      {
        /**
         * 2️⃣ قاعدة استثنائية لأدوات الفهرسة والتحقق (Indexing Bots)
         * هذا الجزء يساعد في حل مشكلة "Failed to verify ownership" 
         * إذا كانت الأداة تستخدم روابط تتبع أو بارامترات للتحقق.
         */
        userAgent: ['AdsBot-Google', 'Twitterbot', 'facebookexternalhit'], 
        allow: '/',
      }
    ],
    // ✅ الإشارة لخريطة الموقع
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}