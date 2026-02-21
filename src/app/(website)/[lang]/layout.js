import { Almarai, Plus_Jakarta_Sans } from 'next/font/google';
import '@/app/globals.css';

import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer';
import WhatsAppBtn from '@/components/WhatsAppBtn'; 
import CompareFloatingBar from '@/components/CompareFloatingBar';

import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

// 1. إعداد الخطوط - تم تحسين الأوزان لتقليل حجم الملف
const almarai = Almarai({
  subsets: ['arabic'],
  variable: '--font-almarai',
  display: 'swap',
  weight: ['400', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
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

  const title = isAr 
    ? (settings?.seo?.metaTitleAr || CONTACT_INFO.siteNameAr) 
    : (settings?.seo?.metaTitleEn || CONTACT_INFO.siteNameEn);

  const description = isAr 
    ? (settings?.seo?.metaDescAr || "استشارك العقاري الأول في مصر") 
    : (settings?.seo?.metaDescEn || "Your first real estate consultant in Egypt");

  const baseUrl = 'https://platformrealestate.co'; 

  return {
    title: {
      default: title,
      template: `%s | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${lang}/`, 
      languages: {
        'ar': `${baseUrl}/ar/`,
        'en': `${baseUrl}/en/`,
        'x-default': `${baseUrl}/ar/`, 
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon.png', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon.png' },
      ],
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
        {/* ✅ علاج الـ LCP: الربط المسبق بسيرفرات Sanity */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://0v9re5oc.api.sanity.io" crossOrigin="anonymous" />
        {/* تسريع اكتشاف الدومين قبل الاتصال الكامل */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body 
        className={`
          ${isAr ? 'font-almarai' : 'font-jakarta'} 
          min-h-screen flex flex-col bg-slate-50 text-slate-900 
          antialiased selection:bg-[#C02026] selection:text-white
          overflow-x-hidden
        `}
        suppressHydrationWarning
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#C02026] focus:text-white focus:px-6 focus:py-3 focus:rounded-xl focus:font-bold"
        >
          {isAr ? 'تخطي للرئيسية' : 'Skip to Content'}
        </a>
          
        <Navbar lang={lang} contactInfo={settings?.contactInfo} />
        
        <main id="main-content" className="flex-grow relative w-full outline-none">
          {children}
        </main>

        <CompareFloatingBar lang={lang} />

        <WhatsAppBtn 
          lang={lang} 
          phoneNumber={settings?.contactInfo?.whatsapp || CONTACT_INFO.whatsapp} 
        />
        
        <Footer lang={lang} settings={settings} />
        
        <style dangerouslySetInnerHTML={{ __html: `
          body { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #f8fafc; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 2px solid #f8fafc; }
          ::-webkit-scrollbar-thumb:hover { background: #C02026; }
          /* تحسين تجربة الـ Focus لمستخدمي الكيبورد (Accessibility) */
          :focus-visible { outline: 2px solid #C02026; outline-offset: 4px; }
        `}} />
      </body>
    </html>
  );
}