// src/app/robots.js

// ✅ استدعاء ملف الثوابت (نفس المسار النسبي اللي استخدمناه في sitemap)
import { CONTACT_INFO } from '../components/constants/contact';

export default function robots() {
  // ✅ الأولوية للبيئة، والبديل هو الدومين الموجود في ملف الثوابت الموحد
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || CONTACT_INFO.domain;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/studio/',        // حماية لوحة تحكم Sanity
        '/api/',           // منع أرشفة الـ API Endpoints
        '/_next/',         // منع أرشفة ملفات البناء الداخلية
        '/private/',       // أي مجلدات خاصة أخرى
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}