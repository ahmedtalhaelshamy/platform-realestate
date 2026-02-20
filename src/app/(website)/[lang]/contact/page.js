import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import ContactClientUI from '@/components/templates/ContactClientUI';
import { CONTACT_INFO } from '@/components/constants/contact';
import Breadcrumbs from '@/components/Breadcrumbs'; 

export const revalidate = 3600; 

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

// 1. جلب البيانات بذكاء
async function getPageData() {
  const query = `*[_type == "siteSettings"][0]{ 
    contactSeo,
    phone, whatsapp, email,
    addressAr, addressEn,
    mapLocation,
    facebook, instagram, linkedin, youtube, tiktok,
    contactInfo,
    socialLinks
  }`;
  
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity Contact Page Error:", error);
    return null;
  }
}

// 2. توليد الـ Metadata (SEO) - النسخة المصححة
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const data = await getPageData();
  const seo = data?.contactSeo;

  const title = isAr 
    ? (seo?.metaTitleAr || 'تواصل معنا') 
    : (seo?.metaTitleEn || 'Contact Us');

  const desc = isAr 
    ? (seo?.metaDescAr || `تواصل مع ${CONTACT_INFO.siteNameAr} للاستفسار عن عقارات مصر.`) 
    : (seo?.metaDescEn || `Contact ${CONTACT_INFO.siteNameEn} for Egypt real estate inquiries.`);

  // ✅ الزتونة: توحيد الدومين وإضافة الـ Trailing Slash
  const baseUrl = 'https://platformrealestate.co'; 
  const pagePath = `${baseUrl}/${lang}/contact/`; // ضفنا الـ / في الآخر

  const ogImage = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).url() 
    : `${baseUrl}/og-contact.jpg`;

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: desc,
    keywords: isAr ? seo?.keywordsAr : seo?.keywordsEn,
    alternates: {
      canonical: pagePath, // الرابط الرسمي الموحد
    },
    openGraph: {
      title,
      description: desc,
      url: pagePath,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website',
    }
  };
}

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const data = await getPageData();

  // 3. تجهيز البيانات (Data Normalization)
  const finalSettings = {
    phone: data?.phone || data?.contactInfo?.phone || CONTACT_INFO.phone,
    whatsapp: data?.whatsapp || data?.contactInfo?.whatsapp || CONTACT_INFO.whatsapp,
    email: data?.email || data?.contactInfo?.email || CONTACT_INFO.email,
    addressAr: data?.addressAr || data?.contactInfo?.addressAr || CONTACT_INFO.addressAr,
    addressEn: data?.addressEn || data?.contactInfo?.addressEn || CONTACT_INFO.addressEn,
    mapLocation: data?.mapLocation || data?.contactInfo?.mapLocation,

    facebook: data?.facebook || data?.socialLinks?.facebook || CONTACT_INFO.social.facebook,
    instagram: data?.instagram || data?.socialLinks?.instagram || CONTACT_INFO.social.instagram,
    linkedin: data?.linkedin || data?.socialLinks?.linkedin || CONTACT_INFO.social.linkedin,
    youtube: data?.youtube || data?.socialLinks?.youtube || CONTACT_INFO.social.youtube,
    tiktok: data?.tiktok || data?.socialLinks?.tiktok || CONTACT_INFO.social.tiktok,
  };

  const breadcrumbItems = [
    { label: isAr ? 'تواصل معنا' : 'Contact Us' }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 md:px-8 pt-32 pb-4">
         <Breadcrumbs items={breadcrumbItems} lang={lang} />
      </div>

      <ContactClientUI 
        settings={finalSettings} 
        lang={lang} 
        isAr={isAr} 
      />
    </main>
  );
}