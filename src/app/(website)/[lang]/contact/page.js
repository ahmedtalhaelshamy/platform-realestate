import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import ContactClientUI from '@/components/templates/ContactClientUI';
import { CONTACT_INFO } from '@/components/constants/contact';
import Breadcrumbs from '@/components/Breadcrumbs'; 

// ✅ PERFORMANCE: ISR كل ساعة لضمان سرعة الاستجابة
export const revalidate = 3600; 

// 🏁 الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

// ✅ دالة الأمان لمنع خطأ الـ Objects كأبناء لـ React
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  if (typeof val === 'object' && val.children) {
    return val.children.map(child => child.text).join('');
  }
  return String(val);
};

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

// 1. جلب البيانات بذكاء (مع فلترة المسودات)
async function getPageData() {
  const query = `*[_type == "siteSettings"][0]{ 
    contactSeo,
    phone, whatsapp, email,
    addressAr, addressEn,
    mapLocation,
    socialLinks
  }`;
  
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity Contact Page Error:", error);
    return null;
  }
}

// 2. Metadata: تم تحسين صورة المشاركة لتكون WebP تلقائياً
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getPageData();
  const seo = data?.contactSeo;

  const title = getSafeText(isAr 
    ? (seo?.metaTitleAr || 'تواصل معنا | بلاتفورم العقارية') 
    : (seo?.metaTitleEn || 'Contact Us | Platform Real Estate'));

  const desc = getSafeText(isAr 
    ? (seo?.metaDescAr || `تواصل مع ${CONTACT_INFO.siteNameAr} للاستفسار عن أحدث العقارات والمشاريع في مصر.`) 
    : (seo?.metaDescEn || `Get in touch with ${CONTACT_INFO.siteNameEn} for the latest real estate inquiries in Egypt.`));

  const arPath = `${BASE_URL}/ar/contact/`;
  const enPath = `${BASE_URL}/en/contact/`;
  const currentPath = isAr ? arPath : enPath;

  // تحسين: إضافة .auto('format') لضمان أن صورة المشاركة خفيفة جداً (WebP)
  const ogImage = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).auto('format').url() 
    : `${BASE_URL}/og-contact.jpg`;

  return {
    title: `${title}`,
    description: desc,
    keywords: isAr ? seo?.keywordsAr : seo?.keywordsEn,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar': arPath,
        'en': enPath,
        'x-default': arPath,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: currentPath,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

/**
 * 🏗️ المكون الرئيسي لصفحة التواصل
 */
export default async function ContactPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getPageData();

  // 3. دمج البيانات (Normalization) مع التأكد من نظافة النصوص
  const finalSettings = {
    phone: data?.phone || data?.socialLinks?.phone || CONTACT_INFO.phone,
    whatsapp: data?.whatsapp || data?.socialLinks?.whatsapp || CONTACT_INFO.whatsapp,
    email: data?.email || data?.socialLinks?.email || CONTACT_INFO.email,
    addressAr: getSafeText(data?.addressAr || CONTACT_INFO.addressAr),
    addressEn: getSafeText(data?.addressEn || CONTACT_INFO.addressEn),
    mapLocation: data?.mapLocation || CONTACT_INFO.googleMapsUrl,

    facebook: data?.socialLinks?.facebook || CONTACT_INFO.social.facebook,
    instagram: data?.socialLinks?.instagram || CONTACT_INFO.social.instagram,
    linkedin: data?.socialLinks?.linkedin || CONTACT_INFO.social.linkedin,
    youtube: data?.socialLinks?.youtube || CONTACT_INFO.social.youtube,
    tiktok: data?.socialLinks?.tiktok || CONTACT_INFO.social.tiktok,
  };

  const breadcrumbItems = [
    { label: isAr ? 'تواصل معنا' : 'Contact Us', href: `/${lang}/contact/` }
  ];

  // 🏆 [SEO] Schema Markup - ContactPage & Organization
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': isAr ? 'صفحة التواصل - بلاتفورم' : 'Contact Us - Platform',
    'description': isAr ? 'تواصل مع فريق مبيعات بلاتفورم العقارية' : 'Connect with Platform Real Estate sales team',
    'url': `${BASE_URL}/${lang}/contact/`,
    'mainEntity': {
      '@type': 'Organization',
      'name': isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn,
      'telephone': finalSettings.phone,
      'email': finalSettings.email,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': isAr ? finalSettings.addressAr : finalSettings.addressEn,
        'addressLocality': 'New Cairo',
        'addressCountry': 'EG'
      }
    }
  };

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 pb-4">
         <nav aria-label="Breadcrumb" className="opacity-70 hover:opacity-100 transition-opacity">
            <Breadcrumbs items={breadcrumbItems} lang={lang} />
         </nav>
      </div>

      {/* الـ UI Component سيستقبل الإعدادات الجاهزة والمحسنة */}
      <ContactClientUI 
        settings={finalSettings} 
        lang={lang} 
        isAr={isAr} 
      />
    </main>
  );
}