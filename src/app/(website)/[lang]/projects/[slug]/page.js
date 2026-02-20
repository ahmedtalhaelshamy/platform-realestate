import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { notFound } from 'next/navigation';
import ProjectClientUI from '@/components/templates/ProjectClientUI';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ الأداء: تحديث دوري ذكي (ISR) كل ساعة لضمان سرعة الاستجابة
export const revalidate = 3600; 

// 🏁 الدومين الموحد المعتمد (بدون www)
const BASE_URL = 'https://platformrealestate.co';

/**
 * 🛠️ دالة تطهير النصوص الشاملة (حارس البيانات)
 * تحول أي محتوى (String أو Sanity Object) لنص صافي وآمن لـ React
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
 * 🖼️ حارس الصور - يضمن عدم كسر الصفحة إذا فقدت الصورة
 */
const getSafeImageUrl = (source) => {
  if (!source || !source.asset || !source.asset._ref) {
    return `${BASE_URL}/og-image.jpg`; 
  }
  try {
    return urlFor(source).width(1200).height(630).quality(90).auto('format').url();
  } catch (error) {
    return `${BASE_URL}/og-image.jpg`;
  }
};

/**
 * 1️⃣ التوليد الثابت (Static Generation)
 */
export async function generateStaticParams() {
  const query = `*[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))]{ 
    "slug": slug.current 
  }`;
  
  try {
    const projects = await client.fetch(query);
    const languages = ['ar', 'en'];
    
    return projects.flatMap((project) =>
      languages.map((lang) => ({ 
        lang: lang, 
        slug: project.slug 
      }))
    );
  } catch (error) {
    return [];
  }
}

/**
 * 2️⃣ [SEO] الميتا داتا المحدثة (توحيد الروابط والأرشفة الدولية)
 */
export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';
  
  const query = `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]{ 
    titleAr, titleEn, seo, mainImage 
  }`;
  
  const data = await client.fetch(query, { slug });
  if (!data) return { title: 'Project Not Found' };

  const seo = data.seo;
  // تأمين النصوص من الـ Objects
  const cleanTitle = getSafeText(isAr ? (seo?.metaTitleAr || data.titleAr) : (seo?.metaTitleEn || data.titleEn));
  const cleanDesc = getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn);
  
  const arUrl = `${BASE_URL}/ar/projects/${slug}/`;
  const enUrl = `${BASE_URL}/en/projects/${slug}/`;
  const currentUrl = isAr ? arUrl : enUrl;

  return {
    title: `${cleanTitle} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: cleanDesc.substring(0, 160),
    metadataBase: new URL(BASE_URL),
    
    alternates: {
      canonical: currentUrl,
      languages: {
        'ar': arUrl,
        'en': enUrl,
        'x-default': arUrl
      },
    },
    
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },
    
    openGraph: {
      title: cleanTitle,
      description: cleanDesc,
      url: currentUrl,
      images: [{ url: getSafeImageUrl(seo?.ogImage || data.mainImage) }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

/**
 * 3️⃣ المكون الرئيسي لمعالجة البيانات وتمريرها للـ UI
 */
export default async function ProjectDetailPage({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  const query = `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    ...,
    "slug": slug.current,
    "brochureUrl": brochure.asset->url,
    "districtData": district->{ nameAr, nameEn, "slug": slug.current },
    "locationData": location->{ nameAr, nameEn, "slug": slug.current },
    "developer": developer->{ nameAr, nameEn, "slug": slug.current, logo, descriptionAr, descriptionEn },
    "developerProjects": *[_type == "project" && references(^.developer._ref) && _id != ^._id && !(_id in path("drafts.**"))][0...4]{
        _id, titleAr, titleEn, mainImage, "slug": slug.current, "districtData": district->{ nameAr, nameEn }
    },
    "author": author->{ name, image, jobTitle },
    "relatedProjects": *[_type == "project" && references(^.district._ref) && _id != ^._id && !(_id in path("drafts.**"))][0...3]{
        _id, titleAr, titleEn, price, mainImage, "slug": slug.current, projectType, "districtData": district->{ nameAr, nameEn }
    }
  }`;

  const data = await client.fetch(query, { slug });
  if (!data) return notFound();

  // 🛡️ معالجة البيانات قبل إرسالها للـ Client Component لمنع خطأ الـ Objects
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
    { 
      label: sanitizedData.districtName || (isAr ? 'المنطقة' : 'District'), 
      href: `/${lang}/locations/${data.locationData?.slug}/` // تعديل المسار ليكون منطقياً
    },
    { label: sanitizedData.computedH1 }
  ];

  // 🏆 [SEO] Schema Markup مع الروابط الموحدة
  const mainSchema = {
    '@context': 'https://schema.org',
    '@type': data.seo?.schemaType || 'RealEstateListing',
    'name': sanitizedData.computedH1,
    'description': getSafeText(isAr ? data.seo?.metaDescAr : data.seo?.metaDescEn).substring(0, 200),
    'image': getSafeImageUrl(data.mainImage),
    'url': `${BASE_URL}/${lang}/projects/${slug}/`,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': sanitizedData.districtName,
      'addressRegion': sanitizedData.cityName,
      'addressCountry': 'EG'
    }
  };

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />
      
      <ProjectClientUI 
          data={sanitizedData} 
          lang={lang} 
          isAr={isAr} 
          breadcrumbItems={breadcrumbItems}
          similarProjects={data.relatedProjects || []}
      />
    </main>
  );
}