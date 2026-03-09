import { client } from '@/sanity/client';

// إعادة التحقق كل ساعة لضمان تحديث الروابط الجديدة
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = 'https://platformrealestate.co';
  const languages = ['ar', 'en'];

  let data = { projects: [], locations: [], districts: [], developers: [], posts: [] };

  try {
    // جلب البيانات مع فلترة دقيقة للمسودات والـ NoIndex
    const query = `{
      "projects": *[_type == "project" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "locations": *[_type == "location" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "districts": *[_type == "district" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "developers": *[_type == "developer" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "posts": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt }
    }`;
    data = await client.fetch(query);
  } catch (error) {
    console.error("Sitemap Fetch Error:", error);
  }

  const { projects, locations, districts, developers, posts } = data;

  // 1. الروابط الثابتة (Static Routes)
  const staticRoutes = ['', 'projects', 'locations', 'developers', 'blog', 'contact', 'about-us'];
  
  const staticUrls = staticRoutes.flatMap((route) => {
    // التأكد من وضع slash في النهاية ليتوافق مع trailingSlash: true
    const routePath = route ? `${route}/` : ''; 
    return languages.map((lang) => ({
      url: `${baseUrl}/${lang}/${routePath}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          'ar': `${baseUrl}/ar/${routePath}`,
          'en': `${baseUrl}/en/${routePath}`,
          'x-default': `${baseUrl}/ar/${routePath}`, // العربي هو الافتراضي
        },
      },
    }));
  });

  // 2. دالة إنتاج الروابط الديناميكية (Dynamic Routes Generator)
  const createUrls = (items, path, priority = 0.7) => 
    items.flatMap(item => {
      const itemPath = `${path}/${item.slug}/`;
      return languages.map(lang => ({
        url: `${baseUrl}/${lang}/${itemPath}`,
        // استخدام تاريخ التحديث أو تاريخ اللحظة كـ fallback
        lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: priority,
        alternates: {
          languages: {
            'ar': `${baseUrl}/ar/${itemPath}`,
            'en': `${baseUrl}/en/${itemPath}`,
            'x-default': `${baseUrl}/ar/${itemPath}`, // إضافة x-default هنا أيضاً
          },
        },
      }));
    });

  // تجميع كافة الروابط في مصفوفة واحدة مرتبة بالأولوية
  return [
    ...staticUrls,
    ...createUrls(projects, 'projects', 0.9), // المشاريع لها أولوية قصوى
    ...createUrls(locations, 'locations', 0.8),
    ...createUrls(districts, 'districts', 0.8), 
    ...createUrls(posts, 'blog', 0.7),
    ...createUrls(developers, 'developers', 0.6),
  ];
}