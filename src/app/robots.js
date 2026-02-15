import { CONTACT_INFO } from '../components/constants/contact';

export default function robots() {
  // تأكد أن baseUrl لا ينتهي بـ /
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || CONTACT_INFO.domain).replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/_next/static/',  // ملفات الـ CSS والجافا سكريبت (مهم للـ Mobile Friendly Test)
        '/_next/image/',   // ✅ مهم جداً: السماح لجوجل بأرشفة صور المشاريع
        '/api/og',         // لو عندك صور Share تلقائية
      ],
      disallow: [
        '/studio/',        // لوحة تحكم Sanity
        '/admin/',         
        '/api/',           // حماية الـ API Routes
        '/private/',
        '/*?*',            // منع أرشفة روابط البحث اللي فيها بارامترات (توفير الـ Crawl Budget)
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}