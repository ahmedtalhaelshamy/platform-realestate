import { Almarai, Plus_Jakarta_Sans } from 'next/font/google';
import '@/app/globals.css';

import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer';
import WhatsAppBtn from '@/components/WhatsAppBtn'; 
import CompareFloatingBar from '@/components/CompareFloatingBar';

import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

// 🚀 1. استيراد Script من Next.js بدلاً من مكتبة الطرف الثالث
import Script from 'next/script';

// 1. إعداد الخطوط
const almarai = Almarai({
  subsets: ['arabic'],
  variable: '--font-almarai',
  display: 'swap',
  adjustFontFallback: true,
  weight: ['400', '700'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  adjustFontFallback: true,
  weight: ['400', '600', '700'],
});

async function getSiteSettings() {
  try {
    const query = `*[_type == "siteSettings"][0]{ 
      seo, 
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

  // محاولة جلب العنوان من Sanity (لو أضفت الحقل مستقبلاً)
  const sanityTitle = isAr ? settings?.seo?.metaTitleAr : settings?.seo?.metaTitleEn;
  
  // القيمة الافتراضية في حال عدم وجود عنوان مخصص
  const defaultSiteName = isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn;

  const description = isAr 
    ? (settings?.seo?.metaDescAr || "استشارك العقاري الأول في مصر") 
    : (settings?.seo?.metaDescEn || "Your first real estate consultant in Egypt");

  const baseUrl = 'https://platformrealestate.co'; 

  return {
    title: {
      // إذا وجد عنوان في Sanity نستخدمه، وإلا نستخدم اسم الموقع الافتراضي
      default: sanityTitle || defaultSiteName,
      // الـ template سيعمل فقط إذا كان هناك عنوان مخصص (لتجنب التكرار في الصفحة الرئيسية)
      template: sanityTitle ? `%s | ${isAr ? 'بلاتفورم' : 'Platform'}` : `%s`, 
    },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      // ✅ التعديل هنا: استخدام الروابط الكاملة (Absolute URLs) لضمان عدم حدوث Duplicate Content في جوجل
      canonical: `${baseUrl}/${lang}`, 
      languages: {
        'ar': `${baseUrl}/ar`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/ar`, 
      },
    },
    icons: {
      icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
      apple: [{ url: '/apple-icon.png' }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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

  return (
    <html 
      lang={lang} 
      dir={isAr ? 'rtl' : 'ltr'} 
      className={`${almarai.variable} ${jakarta.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://0v9re5oc.api.sanity.io" crossOrigin="anonymous" />
        
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
      <body 
        className={`
          ${isAr ? 'font-almarai' : 'font-jakarta'} 
          min-h-screen flex flex-col bg-brand-gray-50 text-brand-dark 
          antialiased selection:bg-brand-red selection:text-white
        `}
        suppressHydrationWarning
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:z-[9999] focus:bg-brand-red focus:text-white focus:p-4 focus:rounded-lg"
        >
          {isAr ? 'تخطي للمحتوى الرئيسي' : 'Skip to main content'}
        </a>
          
        <Navbar lang={lang} contactInfo={settings?.contactInfo} />
        
        <main id="main-content" className="flex-grow relative w-full outline-none" role="main">
          {children}
        </main>

        <CompareFloatingBar lang={lang} />

        <WhatsAppBtn 
          lang={lang} 
          phoneNumber={settings?.contactInfo?.whatsapp || CONTACT_INFO.whatsapp} 
        />
        
        <Footer lang={lang} settings={settings} />

        {/* 🚀 2. كود تتبع جوجل أناليتكس بنظام Lazy Load لعدم التأثير على PageSpeed */}
        <Script 
          strategy="lazyOnload" 
          src={`https://www.googletagmanager.com/gtag/js?id=G-HPS1P5D224`} 
        />
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