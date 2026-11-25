import { MetadataRoute } from 'next';

/**
 * robots.txt موحّد:
 * - كل البوتات (بما فيها Googlebot و Bingbot) تدخل كل الصفحات العامة.
 * - لا بوت يدخل /api/ و /studio/ (ولا /admin/ و /private/).
 * - بوتات البحث بالذكاء الاصطناعي مسموح لها صراحةً بكل الصفحات العامة.
 * - روابط الـ Query (فلاتر/بحث) مستبعدة للبوتات العامة لمنع تكرار المحتوى،
 *   وGooglebot/Bingbot وبوتات معاينة الروابط والإعلانات مستثناة منها حتى لا تتعطل روابط الحملات (utm / gclid).
 *
 * ملاحظة: البوت يتبع المجموعة الأكثر تحديداً فقط، لذلك تتكرر قواعد المنع في كل مجموعة.
 */
const BASE_URL = 'https://platformrealestate.co';

const PRIVATE_PATHS = ['/api/', '/studio/', '/admin/', '/private/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          '*',
          // بوتات البحث/الاستشهاد بالذكاء الاصطناعي
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'PerplexityBot',
          'Claude-SearchBot',
          'Google-Extended',
        ],
        allow: ['/', '/_next/static/', '/_next/image/'],
        disallow: [...PRIVATE_PATHS, '/*?*'],
      },
      {
        // معاينات المشاركة والإعلانات: تحتاج فتح روابط فيها Query (utm / gclid / fbclid)
        userAgent: [
          // Googlebot و Bingbot هنا (بدون /*?*) للحفاظ على سلوكهم الحالي مع روابط الـ Query
          'Googlebot',
          'Bingbot',
          'AdsBot-Google',
          'Googlebot-Image',
          'Twitterbot',
          'facebookexternalhit',
          'LinkedInBot',
          'WhatsApp',
          'Applebot',
        ],
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
