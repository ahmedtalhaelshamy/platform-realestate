// src/app/sitemap.js
export const revalidate = 3600; 

import { client } from '../sanity/client'; 
import { CONTACT_INFO } from '../components/constants/contact'; 

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || CONTACT_INFO.domain).replace(/\/$/, '');
  
  const projectId = client.config().projectId;
  const dataset = client.config().dataset || 'production';

  let data = { projects: [], locations: [], developers: [], posts: [] };
  try {
    const query = `{
      "projects": *[_type == "project" && defined(slug.current)] { "slug": slug.current, _updatedAt, "imageRef": mainImage.asset._ref },
      "locations": *[_type == "location" && defined(slug.current)] { "slug": slug.current, _updatedAt, "imageRef": image.asset._ref },
      "developers": *[_type == "developer" && defined(slug.current)] { "slug": slug.current, _updatedAt, "imageRef": logo.asset._ref },
      "posts": *[_type == "post" && defined(slug.current)] { "slug": slug.current, _updatedAt, "imageRef": mainImage.asset._ref, language }
    }`;
    data = await client.fetch(query);
  } catch (error) {
    console.error("Sitemap fetch error:", error);
  }

  const { projects, locations, developers, posts } = data;

  const buildUrl = (ref) => {
    if (!ref || typeof ref !== 'string') return null;
    const parts = ref.split('-');
    if (parts.length < 4) return null;
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${parts[1]}-${parts[2]}.${parts[3]}`;
  };

  const staticRoutes = [
    '', 'about', 'contact', 'projects', 'locations', 'developers', 'blog', 'privacy', 'terms'
  ];
  
  const staticUrls = staticRoutes.flatMap((route) => {
    return ['ar', 'en'].map((lang) => ({
      url: `${baseUrl}/${lang}${route ? `/${route}` : ''}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: route === '' ? 1.0 : 0.8,
    }));
  });

  const projectUrls = projects.flatMap((project) => {
    const imgUrl = buildUrl(project.imageRef);
    return ['ar', 'en'].map((lang) => ({
      url: `${baseUrl}/${lang}/projects/${project.slug}`,
      lastModified: new Date(project._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.9,
      ...(imgUrl && { images: [imgUrl] }), 
    }));
  });

  const locationUrls = locations.flatMap((location) => {
    const imgUrl = buildUrl(location.imageRef);
    return ['ar', 'en'].map((lang) => ({
      url: `${baseUrl}/${lang}/locations/${location.slug}`,
      lastModified: new Date(location._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
      ...(imgUrl && { images: [imgUrl] }),
    }));
  });

  const developerUrls = developers.flatMap((dev) => {
    const imgUrl = buildUrl(dev.imageRef);
    return ['ar', 'en'].map((lang) => ({
      url: `${baseUrl}/${lang}/developers/${dev.slug}`,
      lastModified: new Date(dev._updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
      ...(imgUrl && { images: [imgUrl] }),
    }));
  });

  const blogPostUrls = posts.map((post) => {
    const imgUrl = buildUrl(post.imageRef);
    return {
      url: `${baseUrl}/${post.language || 'ar'}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
      ...(imgUrl && { images: [imgUrl] }),
    };
  });

  return [
    ...staticUrls, 
    ...locationUrls, 
    ...projectUrls, 
    ...developerUrls, 
    ...blogPostUrls 
  ];
}