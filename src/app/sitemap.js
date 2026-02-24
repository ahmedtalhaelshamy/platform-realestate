import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

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

  // 1. الروابط الثابتة (Static)
  const staticRoutes = ['', 'about-us', 'contact', 'projects', 'locations', 'developers', 'sitemap'];
  const staticUrls = staticRoutes.flatMap((route) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/${route}${route ? '/' : ''}`,
      lastModified: new Date(),
    }))
  );

  // 2. الروابط الديناميكية (Dynamic)
  const createUrls = (items, path) => 
    items.flatMap(item => languages.map(lang => ({
      url: `${baseUrl}/${lang}/${path}/${item.slug}/`,
      lastModified: new Date(item._updatedAt),
    })));

  return [
    ...staticUrls,
    ...createUrls(projects, 'projects'),
    ...createUrls(locations, 'locations'),
    ...createUrls(developers, 'developers'),
    ...createUrls(districts, 'districts'),
  ];
}