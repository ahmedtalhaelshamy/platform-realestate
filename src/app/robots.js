import { CONTACT_INFO } from '../components/constants/contact';

export default function robots() {
  // 🏁 الدومين الموحد المعتمد - نستخدم الثابت لضمان عدم حدوث تشتت لعناكب البحث
  const baseUrl = 'https://platformrealestate.co';

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/_next/static/', 
        '/_next/image/', 
        '/api/og', // السماح لصور المشاركة (Open Graph) للظهور في السوشيال ميديا
      ],
      disallow: [
        '/studio/',   // منع أرشفة لوحة تحكم Sanity
        '/admin/',    // منع أرشفة لوحة التحكم
        '/api/',      // منع الـ API العام
        '/private/',  // أي ملفات خاصة
        '/*?*',       // 🛡️ منع أرشفة روابط البحث والفلاتر (مهم جداً لمنع تكرار المحتوى)
      ],
    },
    // ✅ الإشارة للخريطة البرمجية الموحدة اللي عملناها
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}