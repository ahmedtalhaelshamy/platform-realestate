import { MetadataRoute } from 'next';
import { CONTACT_INFO } from '@/components/constants/contact';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/', 
          '/_next/image/',  
          '/api/og/',      
        ],
        disallow: [
          '/studio/',      
          '/admin/',        
          '/api/',          
          '/private/',      
          '/*?*',           // منع الفلاتر وروابط البحث المكررة
          '/*_type=*',      // منع أرشفة روابط استعلامات Sanity المباشرة إن وجدت
        ],
      },
      {
        /**
         * 🤖 AI Bots (GPT, Common Crawl, etc.)
         * نمنعهم من سحب الداتا الثقيلة للحفاظ على أداء السيرفر وحماية المحتوى
         */
        userAgent: ['GPTBot', 'CCBot', 'ChatGPT-User'],
        disallow: ['/projects/', '/developers/'], 
      },
      {
        userAgent: [
          'AdsBot-Google', 
          'Twitterbot', 
          'facebookexternalhit', 
          'LinkedInBot', 
          'WhatsApp', 
          'Applebot'
        ], 
        allow: '/',
        disallow: ['/studio/', '/private/'],
      }
    ],
    // ✅ وضع الرابط في مكان واضح لمحركات البحث
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}