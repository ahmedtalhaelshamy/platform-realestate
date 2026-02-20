export const revalidate = 3600; 

import { client } from '../sanity/client'; 
import { CONTACT_INFO } from '../components/constants/contact'; 

export default async function sitemap() {
  const baseUrl = 'https://platformrealestate.co';

  let data = { projects: [], locations: [], districts: [], developers: [], posts: [] };
  
  try {
    const query = `{
      "projects": *[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "locations": *[_type == "location" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "districts": *[_type == "district" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "developers": *[_type == "developer" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt },
      "posts": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] { "slug": slug.current, _updatedAt, language }
    }`;
    data = await client.fetch(query);
  } catch (error) {
    console.error("Sitemap fetch error:", error);
    return [];
  }

  const { projects, locations, districts, developers, posts } = data;
  const languages = ['ar', 'en'];
  const now = new Date().toISOString();

  // مصفوفة لتجميع كل الروابط
  const allUrls = [];

  // 1️⃣ الروابط الاستاتيكية
  const staticRoutes = ['', 'about-us', 'contact', 'projects', 'locations', 'developers', 'blog', 'privacy', 'terms'];
  
  staticRoutes.forEach((route) => {
    languages.forEach((lang) => {
      const path = route ? `/${route}/` : '/';
      allUrls.push({
        url: `${baseUrl}/${lang}${path}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: route === '' ? 1.0 : 0.8,
        // ✅ إضافة الروابط البديلة
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${path}`,
            en: `${baseUrl}/en${path}`,
          },
        },
      });
    });
  });

  // 2️⃣ روابط المناطق (Locations)
  locations.forEach((loc) => {
    languages.forEach((lang) => {
      allUrls.push({
        url: `${baseUrl}/${lang}/locations/${loc.slug}/`,
        lastModified: new Date(loc._updatedAt).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/locations/${loc.slug}/`,
            en: `${baseUrl}/en/locations/${loc.slug}/`,
          },
        },
      });
    });
  });

  // 3️⃣ روابط الأحياء (Districts)
  districts.forEach((dist) => {
    languages.forEach((lang) => {
      allUrls.push({
        url: `${baseUrl}/${lang}/districts/${dist.slug}/`,
        lastModified: new Date(dist._updatedAt).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/districts/${dist.slug}/`,
            en: `${baseUrl}/en/districts/${dist.slug}/`,
          },
        },
      });
    });
  });

  // 4️⃣ روابط المشاريع (Projects)
  projects.forEach((proj) => {
    languages.forEach((lang) => {
      allUrls.push({
        url: `${baseUrl}/${lang}/projects/${proj.slug}/`,
        lastModified: new Date(proj._updatedAt).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/projects/${proj.slug}/`,
            en: `${baseUrl}/en/projects/${proj.slug}/`,
          },
        },
      });
    });
  });

  // 5️⃣ روابط المطورين (Developers)
  developers.forEach((dev) => {
    languages.forEach((lang) => {
      allUrls.push({
        url: `${baseUrl}/${lang}/developers/${dev.slug}/`,
        lastModified: new Date(dev._updatedAt).toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/developers/${dev.slug}/`,
            en: `${baseUrl}/en/developers/${dev.slug}/`,
          },
        },
      });
    });
  });

  // 6️⃣ روابط المدونة (Posts)
  posts.forEach((post) => {
    allUrls.push({
      url: `${baseUrl}/${post.language || 'ar'}/blog/${post.slug}/`,
      lastModified: new Date(post._updatedAt).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
      // المقالات غالباً بتكون لغة واحدة، فممكن نكتفي بالـ Canonical
    });
  });

  return allUrls;
}