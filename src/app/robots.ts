import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://platformrealestate.co';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/', 
          // ✅ تم الإبقاء عليه للاحتياط ولكن Bunny هو الأساس الآن
          '/_next/image/',  
          '/api/og/',       
        ],
        disallow: [
          '/studio/',       // لوحة تحكم سانتي
          '/admin/',        
          '/api/',          // حماية الـ endpoints
          '/private/',      
          '/*?*',           // منع أرشفة الفلاتر (Query Params) لمنع المحتوى المكرر
          '/*_type=*',      
          '/*_id=*',        
        ],
      },
      {
        /**
         * 🤖 AI Intelligence Protection
         * منع بوتات الذكاء الاصطناعي من سرقة مجهودك التحليلي
         */
        userAgent: ['GPTBot', 'CCBot', 'ChatGPT-User', 'anthropic-ai', 'Claude-Web', 'Google-Extended'],
        disallow: [
          '/ar/projects/', 
          '/en/projects/', 
          '/ar/developers/', 
          '/en/developers/',
          '/ar/locations/',
          '/en/locations/'
        ], 
      },
      {
        /**
         * 📱 Social Media & Search Bots
         * السماح الكامل لهذه البوتات لضمان ظهور الـ OG Tags والـ Rich Snippets
         */
        userAgent: [
          'Googlebot', // تأكيد السماح لجوجل بالزحف الكامل
          'AdsBot-Google', 
          'Twitterbot', 
          'facebookexternalhit', 
          'LinkedInBot', 
          'WhatsApp', 
          'Applebot',
          'Bingbot'
        ], 
        allow: '/',
        disallow: ['/studio/', '/private/'],
      }
    ],
    // ✅ الرابط الموحد لضمان التزامن مع ملف sitemap.ts
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}