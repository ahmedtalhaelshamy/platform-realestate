import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { notFound } from 'next/navigation';
import ProjectClientUI from '@/components/templates/ProjectClientUI';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ الأداء: تحديث دوري ذكي (ISR) كل ساعة
export const revalidate = 3600; 

/**
 * 🛠️ دالة تطهير وتحويل أي مدخل (PortableText أو مصفوفات) إلى نص صافي (String)
 */
function cleanToPlainText(input) {
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
  return "";
}

/**
 * 🖼️ حارس الصور النهائي (The Build Saver)
 */
const getSafeImageUrl = (source) => {
  if (!source || !source.asset || !source.asset._ref) {
    return `${CONTACT_INFO.domain}/og-image.jpg`; 
  }
  try {
    return urlFor(source).width(1200).quality(90).auto('format').url();
  } catch (error) {
    console.error("Critical Image Resolution Error:", error);
    return `${CONTACT_INFO.domain}/og-image.jpg`;
  }
};

/**
 * 1️⃣ التوليد الثابت (Static Generation)
 */
export async function generateStaticParams() {
  const query = `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`;
  try {
    const projects = await client.fetch(query);
    const languages = ['ar', 'en'];
    return projects.flatMap((project) =>
      languages.map((lang) => ({ lang, slug: project.slug }))
    );
  } catch (error) {
    console.error("Static Params Fetch Error:", error);
    return [];
  }
}

/**
 * 2️⃣ [SEO] الميتا داتا المحصنة والمطورة
 */
export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';
  
  const query = `*[_type == "project" && slug.current == $slug][0]{ 
    titleAr, titleEn, seo, mainImage 
  }`;
  
  const data = await client.fetch(query, { slug });
  if (!data) return { title: 'Project Not Found' };

  const seo = data.seo;
  const title = isAr 
    ? (seo?.metaTitleAr || data.titleAr || CONTACT_INFO.siteNameAr) 
    : (seo?.metaTitleEn || data.titleEn || CONTACT_INFO.siteNameEn);
  
  const description = (isAr ? seo?.metaDescAr : seo?.metaDescEn) || '';
  
  // استخدام صورة الـ OG Image المخصصة لو وجدت، وإلا صورة الهيرو
  const imageUrl = seo?.ogImage ? getSafeImageUrl(seo.ogImage) : getSafeImageUrl(data.mainImage);

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: cleanToPlainText(description).substring(0, 160),
    alternates: {
      canonical: `${CONTACT_INFO.domain}/${lang}/projects/${slug}`,
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },
    openGraph: {
      title,
      description: cleanToPlainText(description),
      url: `${CONTACT_INFO.domain}/${lang}/projects/${slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: seo?.schemaType === 'Article' ? 'article' : 'website',
    }
  };
}

/**
 * 3️⃣ المكون الرئيسي (Server Component)
 */
export default async function ProjectDetailPage({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  const query = `*[_type == "project" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    "brochureUrl": brochure.asset->url,
    "districtData": district->{ nameAr, nameEn, "slug": slug.current },
    "locationData": location->{ nameAr, nameEn, "slug": slug.current },
    "developer": developer->{ nameAr, nameEn, "slug": slug.current, logo, descriptionAr, descriptionEn },
    "developerProjects": *[_type == "project" && references(^.developer._ref) && _id != ^._id][0...4]{
        _id, titleAr, titleEn, mainImage, "slug": slug.current, "districtData": district->{ nameAr, nameEn }
    },
    "author": author->{ name, image, jobTitle },
    "relatedProjects": *[_type == "project" && references(^.district._ref) && _id != ^._id][0...3]{
        _id, titleAr, titleEn, price, mainImage, "slug": slug.current, projectType, "districtData": district->{ nameAr, nameEn }
    }
  }`;

  const data = await client.fetch(query, { slug });
  if (!data) return notFound();

  // 🛡️ تطهير الحقول وتجهيز البيانات
  const sanitizedData = {
    ...data,
    computedH1: isAr ? (data.customH1Ar || data.titleAr) : (data.customH1En || data.titleEn),
    districtName: isAr ? data.districtData?.nameAr : data.districtData?.nameEn,
    cityName: isAr ? data.locationData?.nameAr : data.locationData?.nameEn,
  };

  const breadcrumbItems = [
    { label: isAr ? 'المشاريع' : 'Projects', href: `/${lang}/projects` },
    { label: sanitizedData.districtName || (isAr ? 'المنطقة' : 'District'), href: `/${lang}/locations/${data.districtData?.slug}` },
    { label: isAr ? data.titleAr : data.titleEn }
  ];

  // 🏆 [SEO] Schema Markup - تجميع الـ JSON-LD بشكل احترافي
  const mainSchema = {
    '@context': 'https://schema.org',
    '@type': data.seo?.schemaType || 'RealEstateListing',
    'name': sanitizedData.computedH1,
    'description': cleanToPlainText(isAr ? data.seo?.metaDescAr : data.seo?.metaDescEn).substring(0, 200) || 
                   cleanToPlainText(isAr ? data.introContentAr : data.introContentEn).substring(0, 200),
    'image': getSafeImageUrl(data.mainImage),
    'url': `${CONTACT_INFO.domain}/${lang}/projects/${slug}`,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': sanitizedData.districtName,
      'addressRegion': sanitizedData.cityName,
      'addressCountry': 'EG'
    },
    'offers': {
      '@type': 'Offer',
      'price': data.price,
      'priceCurrency': data.currency || 'EGP'
    },
    'brand': {
      '@type': 'Organization',
      'name': isAr ? data.developer?.nameAr : data.developer?.nameEn
    }
  };

  // إضافة الأسئلة الشائعة للـ Schema إذا وجدت
  let faqSchema = null;
  if (data.faqs && data.faqs.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': data.faqs.map(faq => ({
        '@type': 'Question',
        'name': isAr ? faq.questionAr : faq.questionEn,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': isAr ? faq.answerAr : faq.answerEn
        }
      }))
    };
  }

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      {/* حقن الـ Schema الأساسية */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />
      
      {/* حقن الـ FAQ Schema إذا وجدت */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
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