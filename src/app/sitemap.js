import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');
  const languages = ['ar', 'en'];

  let data = { projects: [], locations: [], districts: [], developers: [] };

  try {
    // 💡 التعديل هنا: استخدمنا [seo.noIndex != true] للوصول للحقل داخل كائن الـ SEO
    const query = `{
      "projects": *[_type == "project" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "locations": *[_type == "location" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "districts": *[_type == "district" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "developers": *[_type == "developer" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt }
    }`;
    data = await client.fetch(query);
  } catch (error) {
    console.error("Sitemap Fetch Error:", error);
  }

  const { projects, locations, districts, developers } = data;

  // 1. الروابط الثابتة (Static)
  const staticRoutes = ['', 'about-us', 'contact', 'projects', 'locations', 'developers'];
  
  const staticUrls = staticRoutes.flatMap((route) => {
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
        },
      },
    }));
  });

  // 2. الروابط الديناميكية (Dynamic)
  const createUrls = (items, path, priority = 0.7) => 
    items.flatMap(item => {
      const itemPath = `${path}/${item.slug}/`;
      return languages.map(lang => ({
        url: `${baseUrl}/${lang}/${itemPath}`,
        lastModified: new Date(item._updatedAt),
        changeFrequency: 'weekly',
        priority: priority,
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
    ...createUrls(projects, 'projects', 0.9),
    ...createUrls(locations, 'locations', 0.8),
    ...createUrls(districts, 'districts', 0.8), 
    ...createUrls(developers, 'developers', 0.7),
  ];
}