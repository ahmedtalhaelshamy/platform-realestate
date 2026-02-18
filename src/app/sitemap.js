export const revalidate = 3600; 

import { client } from '../sanity/client'; 
import { CONTACT_INFO } from '../components/constants/contact'; 

export default async function sitemap() {
  // تنظيف الـ Base URL والتأكد من عدم وجود شرطة في آخره
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || CONTACT_INFO.domain).replace(/\/$/, '');

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
    // في حالة الخطأ، نرجع مصفوفة فارغة لتجنب انهيار الـ Sitemap
    return [];
  }

  const { projects, locations, districts, developers, posts } = data;
  const languages = ['ar', 'en'];
  const now = new Date().toISOString();

  // 1️⃣ الروابط الاستاتيكية
  const staticRoutes = [
    '', 
    '/about-us', 
    '/contact', 
    '/projects', 
    '/locations', 
    '/developers', 
    '/blog', 
    '/privacy', 
    '/terms'
  ];
  
  const staticUrls = staticRoutes.flatMap((route) => 
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: route === '' ? 1.0 : 0.8,
    }))
  );

  // 2️⃣ روابط المناطق (Locations)
  const locationUrls = locations.flatMap((loc) => 
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/locations/${loc.slug}`,
      lastModified: new Date(loc._updatedAt).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );

  // 3️⃣ روابط الأحياء (Districts)
  const districtUrls = districts.flatMap((dist) => 
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/districts/${dist.slug}`,
      lastModified: new Date(dist._updatedAt).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );

  // 4️⃣ روابط المشاريع
  const projectUrls = projects.flatMap((proj) => 
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/projects/${proj.slug}`,
      lastModified: new Date(proj._updatedAt).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))
  );

  // 5️⃣ روابط المطورين
  const developerUrls = developers.flatMap((dev) => 
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/developers/${dev.slug}`,
      lastModified: new Date(dev._updatedAt).toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  );

  // 6️⃣ روابط المدونة (تعتمد على لغة المقال المحددة في Sanity)
  const blogPostUrls = posts.map((post) => ({
    url: `${baseUrl}/${post.language || 'ar'}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    ...staticUrls, 
    ...locationUrls, 
    ...districtUrls, 
    ...projectUrls, 
    ...developerUrls, 
    ...blogPostUrls 
  ];
}