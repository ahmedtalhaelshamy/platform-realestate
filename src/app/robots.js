import { CONTACT_INFO } from '../components/constants/contact';

export default function robots() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || CONTACT_INFO.domain).replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/_next/static/', 
        '/_next/image/', 
        '/api/og', // السماح لصور المشاركة
      ],
      disallow: [
        '/studio/', 
        '/admin/', 
        '/api/',   // سيمنع الـ api ما عدا الـ og المذكور في الـ allow
        '/private/',
        '/*?*',    // منع روابط الفلاتر والبحث
      ],
    },
    // التأكد من أن الرابط كامل ويبدأ بـ https
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}