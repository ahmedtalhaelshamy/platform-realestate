import { client } from '@/sanity/client';
import DevelopersListClient from './DevelopersListClient';
import { Suspense } from 'react';
import { CONTACT_INFO } from '@/components/constants/contact';

export const dynamic = 'force-static';
export const revalidate = 3600; 

// ✅ الجزء ده هو المسؤول عن حل مشاكل Semrush و Google Search Console
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, ''); // تنظيف الدومين
  const currentUrl = `${baseUrl}/${lang}/developers/`; // الرابط الأساسي النظيف

  return {
    title: lang === 'ar' ? `أهم المطورين العقاريين في مصر | ${CONTACT_INFO.siteNameAr}` : `Top Developers | ${CONTACT_INFO.siteNameEn}`,
    alternates: {
      canonical: currentUrl, // حل مشكلة الـ Canonical
      languages: {
        'ar-EG': `${baseUrl}/ar/developers/`, // حل مشكلة الـ Hreflang عربي
        'en-US': `${baseUrl}/en/developers/`, // حل مشكلة الـ Hreflang إنجليزي
        'x-default': `${baseUrl}/ar/developers/`, // التوجيه الافتراضي
      },
    },
  };
}

export default async function DevelopersPage({ params }) {
  const { lang } = await params;
  
  const developers = await client.fetch(`*[_type == "developer" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, nameAr, nameEn, "slug": slug.current, logo,
    "projectsCount": count(*[_type == "project" && references(^._id) && !(_id in path("drafts.**"))])
  }`);

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-black animate-pulse">LOADING...</div>}>
      <DevelopersListClient initialDevelopers={developers} lang={lang} />
    </Suspense>
  );
}