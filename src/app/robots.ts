import { MetadataRoute } from 'next';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🤖 Robots.txt Configuration - The SEO Compass
 * وظيفة الملف: توجيه عناكب جوجل للمحتوى المفيد ومنعها من المناطق التقنية أو الحساسة.
 */
export default function robots(): MetadataRoute.Robots {
  // 🏁 الدومين الموحد المعتمد - نضمن عدم وجود تشتت (Canonical Authority)
  const baseUrl = 'https://platformrealestate.co';

  return {
    rules: {
      userAgent: '*', // ينطبق على جميع محركات البحث (Google, Bing, Yandex, etc.)
      allow: [
        '/',
        '/_next/static/', // السماح بملفات التنسيق لضمان رندرة الصفحة بشكل صحيح
        '/_next/image/',  // السماح بالصور المحسنة لظهورها في بحث الصور
        '/api/og/',       // السماح لصور المشاركة (Open Graph) للظهور في منصات التواصل
      ],
      disallow: [
        '/studio/',       // منع أرشفة لوحة تحكم Sanity (حماية وخصوصية)
        '/admin/',        // منع أرشفة أي مسارات إدارية
        '/api/',          // منع أرشفة الـ APIs لتقليل الضغط على السيرفر
        '/private/',      // أي ملفات خاصة بالشركة
        '/*?*',           // 🛡️ منع أرشفة روابط الفلاتر والبحث (UX & Duplicate Content Protection)
      ],
    },
    // ✅ الإشارة لخريطة الموقع لضمان زحف سريع وشامل
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}