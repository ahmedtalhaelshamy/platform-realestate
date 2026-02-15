export const revalidate = 3600; 

import { client } from '../sanity/client'; 
import { CONTACT_INFO } from '../components/constants/contact'; 

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || CONTACT_INFO.domain).replace(/\/$/, '');
  const projectId = client.config().projectId;
  const dataset = client.config().dataset || 'production';

  let data = { projects: [], locations: [], districts: [], developers: [], posts: [] };
  
  try {
    // ✅ أضفنا "districts" للاستعلام عشان نغطي التجمع الخامس وأي حي تاني
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
  }

  const { projects, locations, districts, developers, posts } = data;

  // 1️⃣ الروابط الاستاتيك (تم تصحيح about لـ about-us)
  const staticRoutes = [
    '', 
    '/about-us', // ✅ تم التصحيح هنا لعدم إنتاج 404
    '/contact', 
    '/projects', 
    '/locations', 
    '/developers', 
    '/blog', 
    '/privacy', 
    '/terms'
  ];
  
  const staticUrls = staticRoutes.flatMap((route) => {
    return ['ar', 'en'].map((lang) => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: route === '' ? 1.0 : 0.8,
    }));
  });

  // 2️⃣ روابط المناطق الكبرى (Locations)
  const locationUrls = locations.flatMap((location) => {
    return ['ar', 'en'].map((lang) => ({
      url: `${baseUrl}/${lang}/locations/${location.slug}`,
      lastModified: new Date(location._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  });

  // 3️⃣ روابط الأحياء (Districts) - حل مشكلة التجمع الخامس
  const districtUrls = districts.flatMap((district) => {
    return ['ar', 'en'].map((lang) => ({
      url: `${baseUrl}/${lang}/districts/${district.slug}`, // ✅ المسار الصحيح للحي
      lastModified: new Date(district._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  });

  // 4️⃣ روابط المشاريع
  const projectUrls = projects.flatMap((project) => {
    return ['ar', 'en'].map((lang) => ({
      url: `${baseUrl}/${lang}/projects/${project.slug}`,
      lastModified: new Date(project._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  });

  // 5️⃣ روابط المطورين والمدونة
  const developerUrls = developers.flatMap((dev) => {
    return ['ar', 'en'].map((lang) => ({
      url: `${baseUrl}/${lang}/developers/${dev.slug}`,
      lastModified: new Date(dev._updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  });

  const blogPostUrls = posts.map((post) => {
    return {
      url: `${baseUrl}/${post.language || 'ar'}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    };
  });

  return [
    ...staticUrls, 
    ...locationUrls, 
    ...districtUrls, // ✅ أضفنا الأحياء هنا
    ...projectUrls, 
    ...developerUrls, 
    ...blogPostUrls 
  ];
}