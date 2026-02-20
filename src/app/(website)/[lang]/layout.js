import { Almarai, Plus_Jakarta_Sans } from 'next/font/google';
import '@/app/globals.css';

import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer';
import WhatsAppBtn from '@/components/WhatsAppBtn'; 
import CompareFloatingBar from '@/components/CompareFloatingBar';

import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

// 1. إعداد الخطوط
const almarai = Almarai({
  subsets: ['arabic'],
  variable: '--font-almarai',
  display: 'swap',
  weight: ['300', '400', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// 2. دالة جلب الإعدادات
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

// 3. توليد الـ Metadata (SEO) - النسخة الموحدة للدومين الأساسي
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

  // ✅ الزتونة: إجبار الدومين الأساسي (بدون www) ليتطابق مع Vercel
  const baseUrl = 'https://platformrealestate.co'; 

  return {
    title: {
      default: title,
      template: `%s | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      // ✅ Canonical موحد ينتهي بـ / ليتوافق مع Next.js Trailing Slashes
      canonical: `${baseUrl}/${lang}/`, 
      languages: {
        'ar': `${baseUrl}/ar/`,
        'en': `${baseUrl}/en/`,
        'x-default': `${baseUrl}/ar/`, 
      },
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-icon.png',
    },
  };
}

// 4. الـ Layout الرئيسي للموقع
export default async function WebsiteLayout({ children, params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const settings = await getSiteSettings();

  return (
    <html 
      lang={lang} 
      dir={isAr ? 'rtl' : 'ltr'} 
      className={`${almarai.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body 
        className={`
          ${isAr ? 'font-almarai' : 'font-jakarta'} 
          min-h-screen flex flex-col bg-slate-50 text-slate-900 
          antialiased selection:bg-[#C02026] selection:text-white
          overflow-x-hidden
        `}
        suppressHydrationWarning
      >
          
        <Navbar lang={lang} contactInfo={settings?.contactInfo} />
        
        <main className="flex-grow relative w-full">
          {children}
        </main>

        <CompareFloatingBar lang={lang} />

        <WhatsAppBtn 
          lang={lang} 
          phoneNumber={settings?.contactInfo?.whatsapp || CONTACT_INFO.whatsapp} 
        />
        
        <Footer lang={lang} settings={settings} />
        
        <style dangerouslySetInnerHTML={{ __html: `
          html { scroll-behavior: smooth; }
          body { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
        `}} />
      </body>
    </html>
  );
}