import { Almarai, Plus_Jakarta_Sans } from 'next/font/google';
import '@/app/globals.css';
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer';
import WhatsAppBtn from '@/components/WhatsAppBtn'; 
import CompareFloatingBar from '@/components/CompareFloatingBar';
import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';
import Script from 'next/script';

// 1. إعداد الخطوط
const almarai = Almarai({
  subsets: ['arabic'],
  variable: '--font-almarai',
  display: 'swap',
  weight: ['400', '700'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '600', '700'],
});

async function getSiteSettings() {
  try {
    // ✅ [GEO/AEO]: جلب كل البيانات المطلوبة للـ Schema الشاملة
    const query = `*[_type == "siteSettings"][0]{ 
      seo, 
      facebook, instagram, linkedin, youtube, tiktok,
      contactInfo { whatsapp, phone, email, addressAr, addressEn } 
    }`;
    return await client.fetch(query, {}, { next: { revalidate: 3600 } });
  } catch (error) {
    console.error("Layout Settings Fetch Error:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const settings = await getSiteSettings();

  const sanityTitle = isAr ? settings?.seo?.metaTitleAr : settings?.seo?.metaTitleEn;
  const sanityDesc = isAr ? settings?.seo?.metaDescAr : settings?.seo?.metaDescEn;
  const defaultSiteName = isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn;
  const baseUrl = 'https://platformrealestate.co'; 

  const finalTitle = sanityTitle || defaultSiteName;
  const finalDesc = sanityDesc || (isAr ? "استشارك العقاري الأول في مصر" : "Your first real estate consultant in Egypt");

  return {
    title: {
      default: finalTitle,
      template: `%s`, 
    },
    description: finalDesc,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${lang}/`, 
      languages: {
        'ar': `${baseUrl}/ar/`,
        'en': `${baseUrl}/en/`,
        'x-default': `${baseUrl}/ar/`, 
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url: `${baseUrl}/${lang}/`,
      siteName: defaultSiteName,
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDesc,
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-icon.png',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport = {
  themeColor: '#C02026',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function WebsiteLayout({ children, params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const settings = await getSiteSettings();
  const baseUrl = 'https://platformrealestate.co';

  // ✅ تجميع روابط السوشيال ميديا لإخبار جوجل أنهم نفس الكيان (Entity Linking)
  const socialLinks = [
    settings?.facebook,
    settings?.instagram,
    settings?.linkedin,
    settings?.youtube,
    settings?.tiktok
  ].filter(Boolean);

  // ✅ [AEO & GEO E-E-A-T Schema]: التغليف المتقدم للموقع ككيان عقاري موثوق
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn,
        "inLanguage": isAr ? "ar-EG" : "en-US",
        "publisher": { "@id": `${baseUrl}/#organization` }
      },
      {
        "@type": ["Organization", "RealEstateAgent"],
        "@id": `${baseUrl}/#organization`,
        "name": isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn,
        "url": baseUrl,
        "logo": `${baseUrl}/icon.png`,
        "image": `${baseUrl}/og-image.png`,
        "sameAs": socialLinks.length > 0 ? socialLinks : undefined,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Cairo",
          "addressCountry": "EG",
          "streetAddress": isAr ? settings?.contactInfo?.addressAr : settings?.contactInfo?.addressEn
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": settings?.contactInfo?.phone || CONTACT_INFO.phone,
          "contactType": "customer service",
          "areaServed": "EG",
          "availableLanguage": ["Arabic", "English"]
        }
      }
    ]
  };

  return (
    <html lang={lang} dir={isAr ? 'rtl' : 'ltr'} className={`${almarai.variable} ${jakarta.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://platform-images.b-cdn.net" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <style dangerouslySetInnerHTML={{ __html: `
          body { 
            text-rendering: optimizeLegibility; 
            -webkit-font-smoothing: antialiased; 
            overflow-x: hidden;
          }
          :focus-visible { outline: 2px solid #C02026; outline-offset: 4px; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #f1f1f1; }
          ::-webkit-scrollbar-thumb { background: #94A3B8; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #C02026; }
        `}} />
      </head>
      <body className={`${isAr ? 'font-almarai' : 'font-jakarta'} min-h-screen flex flex-col bg-brand-gray-50 text-brand-dark antialiased`} suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:z-[9999] focus:bg-brand-red focus:text-white focus:p-4 focus:rounded-lg">
          {isAr ? 'تخطي للمحتوى الرئيسي' : 'Skip to main content'}
        </a>
        <Navbar lang={lang} contactInfo={settings?.contactInfo} />
        <main id="main-content" className="flex-grow relative w-full outline-none" role="main">
          {children}
        </main>
        <CompareFloatingBar lang={lang} />
        <WhatsAppBtn lang={lang} phoneNumber={settings?.contactInfo?.whatsapp || CONTACT_INFO.whatsapp} />
        <Footer lang={lang} settings={settings} />
        <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=G-HPS1P5D224`} />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HPS1P5D224');
          `}
        </Script>
      </body>
    </html>
  );
}