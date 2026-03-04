import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ الحفاظ على الكاش لضمان الأداء
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');
  const languages = ['ar', 'en'];

  let data = { projects: [], locations: [], districts: [], developers: [] };

  try {
    const query = `{
      "projects": *[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "locations": *[_type == "location" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "districts": *[_type == "district" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "developers": *[_type == "developer" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt }
    }`;
    data = await client.fetch(query);
  } catch (error) {
    console.error("Sitemap Fetch Error:", error);
  }

  const { projects, locations, districts, developers } = data;

  // 1. الروابط الثابتة (Static) مع إضافة الأولوية واللغات البديلة
  const staticRoutes = ['', 'about-us', 'contact', 'projects', 'locations', 'developers', 'sitemap'];
  const staticUrls = staticRoutes.flatMap((route) => {
    // ✅ ضبط المسار ليتوافق مع trailingSlash: true
    const routePath = route ? `${route}/` : ''; 
    
    return languages.map((lang) => ({
      url: `${baseUrl}/${lang}/${routePath}`,
      lastModified: new Date(),
      // 🚀 إخبار محرك البحث بمعدل التحديث والأولوية
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : 0.8,
      // 🚀 ربط اللغات ببعضها داخل الـ Sitemap (SEO Supercharge)
      alternates: {
        languages: {
          'ar': `${baseUrl}/ar/${routePath}`,
          'en': `${baseUrl}/en/${routePath}`,
        },
      },
    }));
  });

  // 2. الروابط الديناميكية (Dynamic) مع دعم اللغات البديلة
  const createUrls = (items, path, priority = 0.7) => 
    items.flatMap(item => {
      const itemPath = `${path}/${item.slug}/`;

      return languages.map(lang => ({
        url: `${baseUrl}/${lang}/${itemPath}`,
        lastModified: new Date(item._updatedAt),
        changeFrequency: 'weekly',
        priority: priority,
        // 🚀 ربط اللغات ببعضها للمشاريع والمناطق
        alternates: {
          languages: {
            'ar': `${baseUrl}/ar/${itemPath}`,
            'en': `${baseUrl}/en/${itemPath}`,
          },
        },
      }));
    });

  return [
    ...staticUrls,
    ...createUrls(projects, 'projects', 0.9),     // المشاريع لها أولوية عالية
    ...createUrls(locations, 'locations', 0.8),   // المناطق أولوية متوسطة
    ...createUrls(districts, 'districts', 0.8), 
    ...createUrls(developers, 'developers', 0.7), // المطورين أولوية عادية
  ];
}