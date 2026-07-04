import { client } from '@/sanity/client';

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = 'https://platformrealestate.co';
  const languages = ['ar', 'en'];

  let data = { projects: [], locations: [], districts: [], developers: [], posts: [] };

  try {
    // جلب البيانات مع حدود [0...5000] لمنع الـ Server Timeout وتسريع الاستجابة لجوجل
    const query = `{
      "projects": *[_type == "project" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))][0...5000] { "slug": slug.current, _updatedAt },
      "locations": *[_type == "location" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))][0...5000] { "slug": slug.current, _updatedAt },
      "districts": *[_type == "district" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))][0...5000] { "slug": slug.current, _updatedAt },
      "developers": *[_type == "developer" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))][0...5000] { "slug": slug.current, _updatedAt },
      "posts": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))][0...5000] { "slug": slug.current, _updatedAt }
    }`;
    data = await client.fetch(query);
  } catch (error) {
    console.error("Sitemap Fetch Error:", error);
  }

  const { projects, locations, districts, developers, posts } = data;

  // 1. الروابط الثابتة (Static Routes)
  const staticRoutes = ['', 'projects', 'locations', 'developers', 'blog', 'contact', 'about-us'];
  
  const staticUrls = staticRoutes.flatMap((route) => {
    // ✅ الإصلاح الجذري: إضافة الشرطة المائلة (/) في النهاية لتتطابق مع trailingSlash: true وتمنع أخطاء التوجيه
    const routePath = route ? `/${route}/` : '/'; 
    
    return languages.map((lang) => ({
      url: `${baseUrl}/${lang}${routePath}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          'ar': `${baseUrl}/ar${routePath}`,
          'en': `${baseUrl}/en${routePath}`,
          'x-default': `${baseUrl}/ar${routePath}`,
        },
      },
    }));
  });

  // 2. دالة إنتاج الروابط الديناميكية (Dynamic Routes Generator)
  const createUrls = (items, path, priority = 0.7) => 
    items.flatMap(item => {
      // ✅ الإصلاح الجذري: إضافة الشرطة المائلة (/) في نهاية الروابط الديناميكية
      const itemPath = `/${path}/${item.slug}/`;
      
      return languages.map(lang => ({
        url: `${baseUrl}/${lang}${itemPath}`,
        lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: priority,
        alternates: {
          languages: {
            'ar': `${baseUrl}/ar${itemPath}`,
            'en': `${baseUrl}/en${itemPath}`,
            'x-default': `${baseUrl}/ar${itemPath}`,
          },
        },
      }));
    });

  return [
    ...staticUrls,
    ...createUrls(projects, 'projects', 0.9),
    ...createUrls(locations, 'locations', 0.8),
    ...createUrls(districts, 'districts', 0.8), 
    ...createUrls(posts, 'blog', 0.7),
    ...createUrls(developers, 'developers', 0.6),
  ];
}