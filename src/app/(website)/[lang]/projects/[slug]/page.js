import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { hasImage } from '@/sanity/hasImage';
import { getDefaultOgImage } from '@/sanity/defaultOg';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import ProjectClientUI from '@/components/templates/ProjectClientUI';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ الأداء: ISR لضمان سرعة الاستجابة (يفضل وضع رقم كـ 3600 لتحديث البيانات كل ساعة)
export const revalidate = 3600; 
const BASE_URL = 'https://platformrealestate.co';
const BUNNY_DOMAIN = 'https://platform-images.b-cdn.net';

/**
 * 🛠️ دالة تطهير النصوص الشاملة
 */
function getSafeText(input) {
  if (!input) return "";
  if (typeof input === 'string') return input;
  if (Array.isArray(input)) {
    return input
      .map(block => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map(child => child.text).join('');
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  if (typeof input === 'object' && input.children) {
    return input.children.map(child => child.text).join('');
  }
  return String(input);
}

/**
 * 🖼️ حارس الصور المطور
 */
const getSafeImageUrl = (source, fallback) => {
  if (!hasImage(source)) return fallback; 
  try {
    const sanityUrl = urlFor(source).url();
    return sanityUrl.replace('https://cdn.sanity.io', BUNNY_DOMAIN);
  } catch (error) {
    return fallback;
  }
};

/**
 * يجلب بيانات المشروع مرة واحدة لكل طلب (generateMetadata والصفحة يشتركان في نفس النتيجة)
 */
const getProject = cache(async (slug, lang) => {
  const query = `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    titleAr, titleEn, customH1Ar, customH1En,
    seo { metaTitleAr, metaTitleEn, metaDescAr, metaDescEn, ogImage, schemaType },
    mainImage, gallery, videoUrl,
    price, downPayment, installments, minArea, finishingType, deliveryDate,
    isNewLaunch, isReadyToMove, editorRating,
    aiSummaryAr, aiSummaryEn, faqs, amenities, nearbyPlaces, inventory,
    prosAr, prosEn, consAr, consEn,
    introTitleAr, introTitleEn, introContentAr, introContentEn,
    locationTitleAr, locationTitleEn, locationImage, locationContentAr, locationContentEn,
    detailsTitleAr, detailsTitleEn, detailsImage, detailsContentAr, detailsContentEn,
    areaTitleAr, areaTitleEn, areaImage, areaContentAr, areaContentEn,
    facilitiesTitleAr, facilitiesTitleEn, facilitiesImage, facilitiesContentAr, facilitiesContentEn,
    unitsTitleAr, unitsTitleEn, unitsImage, unitsContentAr, unitsContentEn,
    pricesTitleAr, pricesTitleEn, pricesImage, pricesContentAr, pricesContentEn,
    paymentTitleAr, paymentTitleEn, paymentImage, paymentContentAr, paymentContentEn,
    opinionTitleAr, opinionTitleEn, opinionContentAr, opinionContentEn,
    "slug": slug.current,
    "brochureUrl": brochure.asset->url,
    "districtData": district->{ nameAr, nameEn, "slug": slug.current, _id },
    "locationData": location->{ nameAr, nameEn, "slug": slug.current },
    "developer": developer->{ nameAr, nameEn, "slug": slug.current, logo, descriptionAr, descriptionEn, _id },
    "developerProjects": *[_type == "project" && references(^.developer._ref) && _id != ^._id && !(_id in path("drafts.**"))][0...4]{
        _id, titleAr, titleEn, mainImage, "slug": slug.current, "districtData": district->{ nameAr, nameEn }
    },
    "author": author->{ name, image, jobTitle },
    "relatedProjects": *[_type == "project" && references(^.district._ref) && _id != ^._id && !(_id in path("drafts.**"))][0...3]{
        _id, titleAr, titleEn, price, mainImage, "slug": slug.current, projectType, "districtData": district->{ nameAr, nameEn }
    },
    "relatedPosts": *[_type == "post" && language == $lang && references(^._id)] | order(_createdAt desc)[0...3] {
      title, "slug": slug.current, mainImage, overview, _createdAt
    }
  }`;

  return client.fetch(query, { slug, lang });
});

/**
 * 1️⃣ التوليد الثابت (Static Generation)
 */
export async function generateStaticParams() {
  const query = `*[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;
  try {
    const projects = await client.fetch(query);
    const languages = ['ar', 'en'];
    return projects.flatMap((project) => languages.map((lang) => ({ lang, slug: project.slug })));
  } catch (error) { return []; }
}

/**
 * 2️⃣ [SEO] الميتا داتا
 */
export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';
  const data = await getProject(slug, lang);
  if (!data) return { title: { absolute: 'Project Not Found' } };

  const seo = data.seo;
  const cleanTitle = getSafeText(isAr ? (seo?.metaTitleAr || data.titleAr) : (seo?.metaTitleEn || data.titleEn));
  const cleanDesc = getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn);
  const currentPath = `${BASE_URL}/${lang}/projects/${slug}/`;

  return {
    title: { absolute: cleanTitle },
    description: cleanDesc.substring(0, 160),
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: currentPath, languages: { 'ar': `${BASE_URL}/ar/projects/${slug}/`, 'en': `${BASE_URL}/en/projects/${slug}/`, 'x-default': `${BASE_URL}/ar/projects/${slug}/` } },
    openGraph: { title: cleanTitle, description: cleanDesc, url: currentPath, images: [{ url: getSafeImageUrl(seo?.ogImage || data.mainImage, await getDefaultOgImage()), width: 1200, height: 630 }], locale: isAr ? 'ar_EG' : 'en_US', type: 'article' },
  };
}

/**
 * 3️⃣ المكون الرئيسي
 */
export default async function ProjectDetailPage({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  const data = await getProject(slug, lang);
  if (!data) return notFound();

  const sanitizedData = {
    ...data,
    titleAr: getSafeText(data.titleAr),
    titleEn: getSafeText(data.titleEn),
    computedH1: getSafeText(isAr ? (data.customH1Ar || data.titleAr) : (data.customH1En || data.titleEn)),
    districtName: getSafeText(isAr ? data.districtData?.nameAr : data.districtData?.nameEn),
    cityName: getSafeText(isAr ? data.locationData?.nameAr : data.locationData?.nameEn),
    developerName: getSafeText(isAr ? data.developer?.nameAr : data.developer?.nameEn),
  };

  const breadcrumbItems = [
    { label: isAr ? 'المشاريع' : 'Projects', href: `/${lang}/projects/` },
    { label: sanitizedData.districtName || (isAr ? 'المنطقة' : 'District'), href: data.locationData?.slug ? `/${lang}/locations/${data.locationData.slug}/` : undefined },
    { label: sanitizedData.computedH1 }
  ];

  const currentUrl = `${BASE_URL}/${lang}/projects/${slug}/`;
  
  // ✅ [AEO & GEO] تحسين السكيمة لتكون صديقة للذكاء الاصطناعي بنسبة 100%
  const aiInsight = isAr ? data.aiSummaryAr : data.aiSummaryEn;
  const faqList = data.faqs?.map(f => ({
    '@type': 'Question',
    'name': isAr ? f.questionAr : f.questionEn,
    'acceptedAnswer': { '@type': 'Answer', 'text': isAr ? f.answerAr : f.answerEn }
  })).filter(q => q.name && q.acceptedAnswer.text) || [];

  const mainSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. تعريف الكيان (Organization/Agent)
      {
        '@type': 'RealEstateAgent',
        '@id': `${BASE_URL}/#organization`,
        'name': isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn,
        'url': BASE_URL,
        'logo': `${BASE_URL}/logo.png`,
        'telephone': CONTACT_INFO.phone,
        'sameAs': Object.values(CONTACT_INFO.social)
      },
      // 2. تعريف العرض (Listing)
      {
        '@type': data.seo?.schemaType || 'RealEstateListing',
        '@id': `${currentUrl}#listing`,
        'name': sanitizedData.computedH1,
        'description': aiInsight ? aiInsight.join(' ') : getSafeText(isAr ? data.seo?.metaDescAr : data.seo?.metaDescEn),
        'image': getSafeImageUrl(data.mainImage, await getDefaultOgImage()),
        'url': currentUrl,
        'brand': { '@type': 'Brand', 'name': sanitizedData.developerName },
        'address': { '@type': 'PostalAddress', 'addressLocality': sanitizedData.districtName, 'addressRegion': sanitizedData.cityName, 'addressCountry': 'EG' }
      }
    ]
  };

  if (faqList.length > 0) {
    mainSchema['@graph'].push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#faq`,
      'mainEntity': faqList
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />
      
      <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
        <ProjectClientUI 
            data={sanitizedData} 
            lang={lang} 
            isAr={isAr} 
            breadcrumbItems={breadcrumbItems}
            similarProjects={data.relatedProjects || []}
            relatedPosts={data.relatedPosts || []}
        />
      </main>
    </>
  );
}