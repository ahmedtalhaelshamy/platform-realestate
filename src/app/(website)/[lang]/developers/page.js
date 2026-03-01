import { client } from '@/sanity/client';
import DevelopersListClient from './DevelopersListClient';
import { Suspense } from 'react';
import { CONTACT_INFO } from '@/components/constants/contact';

export const dynamic = 'force-static';
export const revalidate = 3600; 

// ✅ تحديث الدالة لتقرأ العناوين والوصف من Sanity
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');
  const currentUrl = `${baseUrl}/${lang}/developers/`;

  // 1. جلب بيانات السيو الخاصة بصفحة المطورين من Sanity
  // تأكد أن اسم الـ type هو "developersPage" كما حددناه في السكيما
  const pageData = await client.fetch(`*[_type == "developersPage"][0]{ 
    seo {
      metaTitleAr,
      metaTitleEn,
      metaDescAr,
      metaDescEn
    }
  }`);

  const seo = pageData?.seo;

  // 2. تحديد العنوان والوصف بناءً على اللغة المتوفرة (مع وجود بديل Fallback)
  const title = lang === 'ar' 
    ? (seo?.metaTitleAr || "أهم المطورين العقاريين في مصر")
    : (seo?.metaTitleEn || "Top Real Estate Developers");

  const description = lang === 'ar'
    ? (seo?.metaDescAr || CONTACT_INFO.defaultSeo.descAr)
    : (seo?.metaDescEn || CONTACT_INFO.defaultSeo.descEn);

  return {
    // ملاحظة: لا تضف اسم الشركة هنا إذا كنت قد أضفته في Layout Template
    title: title, 
    description: description,
    alternates: {
      canonical: currentUrl,
      languages: {
        'ar-EG': `${baseUrl}/ar/developers/`,
        'en-US': `${baseUrl}/en/developers/`,
        'x-default': `${baseUrl}/ar/developers/`,
      },
    },
  };
}

export default async function DevelopersPage({ params }) {
  const { lang } = await params;
  
  // جلب قائمة المطورين
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