import { client } from '@/sanity/client';
import DevelopersListClient from './DevelopersListClient';
import { Suspense } from 'react';
import { CONTACT_INFO } from '@/components/constants/contact';

export const dynamic = 'force-static';
export const revalidate = 3600; 

/**
 * ✅ SEO Metadata: السيطرة اليدوية المطلقة وتوحيد الروابط البديلة
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const baseUrl = 'https://platformrealestate.co';
  const currentUrl = `${baseUrl}/${lang}/developers/`;

  // 1. جلب بيانات السيو الخاصة بصفحة المطورين من Sanity
  const pageData = await client.fetch(`*[_type == "developersPage"][0]{ 
    seo {
      metaTitleAr,
      metaTitleEn,
      metaDescAr,
      metaDescEn
    }
  }`);

  const seo = pageData?.seo;

  // 2. تحديد العنوان والوصف (السيطرة لـ Sanity أولاً)
  const title = lang === 'ar' 
    ? (seo?.metaTitleAr || "أهم المطورين العقاريين في مصر")
    : (seo?.metaTitleEn || "Top Real Estate Developers");

  const description = lang === 'ar'
    ? (seo?.metaDescAr || "دليل شامل لأكبر شركات التطوير العقاري في مصر، العاصمة الإدارية، والتجمع الخامس.")
    : (seo?.metaDescEn || "Comprehensive guide to the largest real estate development companies in Egypt.");

  return {
    // 🚀 استخدام absolute لضمان السيطرة اليدوية ومنع التكرار
    title: {
      absolute: title, 
    },
    description: description,
    alternates: {
      canonical: currentUrl,
      languages: {
        'ar': `${baseUrl}/ar/developers/`,
        'en': `${baseUrl}/en/developers/`,
        'x-default': `${baseUrl}/ar/developers/`,
      },
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      locale: lang === 'ar' ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

export default async function DevelopersPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const baseUrl = 'https://platformrealestate.co';
  const currentUrl = `${baseUrl}/${lang}/developers/`;
  
  // 1. جلب قائمة المطورين
  const developers = await client.fetch(`*[_type == "developer" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, nameAr, nameEn, "slug": slug.current, logo,
    "projectsCount": count(*[_type == "project" && references(^._id) && !(_id in path("drafts.**"))])
  }`);

  // 2. جلب أحدث 3 أخبار متعلقة بالشركات لعرضها في قسم TITAN INTEL
  const initialPosts = await client.fetch(`*[_type == "post" && language == $lang] | order(_createdAt desc)[0...3] {
    title, "slug": slug.current, mainImage, overview, _createdAt
  }`, { lang });

  // ✅ [تغذية محرك البحث - Omni Search]: جلب المشاريع، المناطق، والأحياء لتشغيل البحث السريع
  const initialProjects = await client.fetch(`*[_type == "project" && !(_id in path("drafts.**"))] { _id, titleAr, titleEn, "slug": slug.current, mainImage }`);
  const initialAreas = await client.fetch(`*[_type == "location" && !(_id in path("drafts.**"))] { _id, nameAr, nameEn, "slug": slug.current }`);
  const initialDistricts = await client.fetch(`*[_type == "district" && !(_id in path("drafts.**"))] { _id, nameAr, nameEn, "slug": slug.current }`);

  // ✅ [AEO & GEO]: بناء سكيما الـ CollectionPage وربط المطورين فيها
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${currentUrl}#collection`,
    "name": isAr ? "أهم المطورين العقاريين في مصر" : "Top Real Estate Developers",
    "description": isAr ? "دليل شامل لأكبر شركات التطوير العقاري في مصر" : "Comprehensive guide to the largest real estate development companies in Egypt",
    "url": currentUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": developers.map((dev, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/${lang}/developers/${dev.slug}/`,
        "name": isAr ? dev.nameAr : dev.nameEn
      }))
    }
  };

  return (
    <>
      {/* حقن البيانات المهيكلة في الهيدر الخفي */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      
      <Suspense fallback={<div className="h-screen flex items-center justify-center font-black animate-pulse text-slate-200 uppercase tracking-widest">Generating Intelligence...</div>}>
        <DevelopersListClient 
          initialDevelopers={developers} 
          initialPosts={initialPosts} 
          initialProjects={initialProjects}
          initialAreas={initialAreas}
          initialDistricts={initialDistricts}
          lang={lang} 
        />
      </Suspense>
    </>
  );
}