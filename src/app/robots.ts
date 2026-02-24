import { MetadataRoute } from 'next';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🤖 Robots.txt Configuration - The SEO Compass
 * الغرض: توجيه عناكب البحث (Crawlers) وحماية المسارات الخاصة.
 */
export default function robots(): MetadataRoute.Robots {
  // ✅ سحب الدومين من الثوابت الموحدة وتنظيفه
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');

  return {
    rules: [
      {
        /**
         * 1️⃣ القاعدة العامة: لجميع محركات البحث
         */
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/', // ضروري عشان جوجل يشوف الـ CSS والـ JS ويقيم الصفحة صح
          '/_next/image/',  // لأرشفة الصور المحسنة (LCP)
          '/api/og/',       // لضمان ظهور صور المشاركة على السوشيال ميديا
        ],
        disallow: [
          '/studio/',       // لوحة تحكم Sanity (ممنوع الأرشفة)
          '/admin/',        // المسارات الإدارة
          '/api/',          // منع أرشفة الـ APIs العامة
          '/private/',      // الملفات الخاصة
          '/*?*',           // 🔥 منع أرشفة روابط الفلاتر (Query Params) لمنع المحتوى المكرر في Semrush
        ],
      },
      {
        /**
         * 2️⃣ قاعدة استثنائية لبوتات السوشيال ميديا والإعلانات
         * تسمح لهم بالوصول الكامل لضمان ظهور الـ Previews بشكل سليم.
         */
        userAgent: ['AdsBot-Google', 'Twitterbot', 'facebookexternalhit', 'Bingbot'], 
        allow: '/',
      }
    ],
    // ✅ الإشارة لرابط خريطة الموقع الموحد
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}