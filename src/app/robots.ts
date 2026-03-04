import { MetadataRoute } from 'next';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🤖 Robots.txt Configuration - The SEO Compass 2026
 * الغرض: حماية ميزانية الزحف (Crawl Budget) وتوجيه العناكب بذكاء.
 */
export default function robots(): MetadataRoute.Robots {
  // ✅ سحب الدومين من الثوابت الموحدة وتنظيفه
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');

  return {
    rules: [
      {
        /**
         * 1️⃣ القاعدة العامة: لجميع محركات البحث (Googlebot, Bingbot, Yandex, etc)
         */
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/', // ضروري عشان جوجل يشوف الـ CSS والـ JS ويقيم الصفحة صح
          '/_next/image/',  // لأرشفة الصور المحسنة (LCP)
          '/api/og/',       // لضمان ظهور صور المشاركة (Open Graph)
        ],
        disallow: [
          '/studio/',       // لوحة تحكم Sanity (ممنوع الأرشفة للخصوصية)
          '/admin/',        // المسارات الإدارية
          '/api/',          // منع أرشفة الـ APIs لتخفيف الضغط على السيرفر
          '/private/',      // الملفات الخاصة
          '/*?*',           // 🔥 عبقرية الـ SEO: منع أرشفة الفلاتر لتوفير ميزانية الزحف ومنع المحتوى المكرر
        ],
      },
      {
        /**
         * 2️⃣ قاعدة بوتات السوشيال ميديا والشات (WhatsApp, FB, Twitter, LinkedIn)
         * السماح لهم بقراءة الميتا داتا بحرية لتوليد الـ Link Previews بشكل سليم.
         */
        userAgent: [
          'AdsBot-Google', 
          'Twitterbot', 
          'facebookexternalhit', 
          'LinkedInBot', 
          'WhatsApp',     // لضمان ظهور الصورة عند المشاركة في واتساب
          'Applebot'      // لضمان ظهور الصورة في iMessage
        ], 
        allow: '/',
        disallow: ['/studio/', '/private/'], // نمنعهم فقط من الأماكن الحساسة
      }
    ],
    // ✅ الإشارة لرابط خريطة الموقع الموحد
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}