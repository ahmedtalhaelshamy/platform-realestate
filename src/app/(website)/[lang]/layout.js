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

// 2. دالة جلب الإعدادات (مع إضافة كاش)
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

// 3. توليد الـ Metadata (SEO)
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

  return {
    title: {
      default: title,
      template: `%s | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    },
    description,
    metadataBase: new URL(CONTACT_INFO.domain),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'ar': '/ar',
        'en': '/en',
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
  // ✅ فك الـ params لأنها Promise في الإصدارات الحديثة
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const settings = await getSiteSettings();

  return (
    <html 
      lang={lang} 
      dir={isAr ? 'rtl' : 'ltr'} 
      className={`${almarai.variable} ${jakarta.variable}`}
      // منع أخطاء الـ Hydration بسبب إضافات المتصفح (مثل Dark Reader)
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
          
        {/* الهيدر: نمرر له بيانات التواصل من سانتي */}
        <Navbar lang={lang} contactInfo={settings?.contactInfo} />
        
        {/* محتوى الصفحة الرئيسي */}
        <main className="flex-grow relative w-full">
          {children}
        </main>

        {/* أدوات عائمة */}
        <CompareFloatingBar lang={lang} />

        <WhatsAppBtn 
          lang={lang} 
          phoneNumber={settings?.contactInfo?.whatsapp || CONTACT_INFO.whatsapp} 
        />
        
        {/* الفوتر */}
        <Footer lang={lang} settings={settings} />
        
        {/* Script صغير لتحسين أداء الخطوط ومنع الـ Layout Shift */}
        <style dangerouslySetInnerHTML={{ __html: `
          html { scroll-behavior: smooth; }
          body { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
        `}} />
      </body>
    </html>
  );
}