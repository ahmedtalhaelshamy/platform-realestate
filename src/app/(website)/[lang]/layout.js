import { Almarai, Plus_Jakarta_Sans } from 'next/font/google';
import '@/app/globals.css';

import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer';
import WhatsAppBtn from '@/components/WhatsAppBtn'; 
import CompareFloatingBar from '@/components/CompareFloatingBar';

import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

// 1. إعداد الخطوط - استخدام خط المراعي لحل مشكلة التقطع
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
    const query = `*[_type == "siteSettings"][0]{ seo, contactInfo }`;
    return await client.fetch(query, {}, { next: { revalidate: 3600 } });
  } catch (error) {
    console.error("Layout Settings Fetch Error:", error);
    return null;
  }
}

// 3. Metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
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
        'ar-EG': '/ar',
        'en-US': '/en',
      },
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-icon.png',
    },
    openGraph: {
      title,
      description,
      siteName: isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn,
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    },
  };
}

// 4. Layout Component
export default async function WebsiteLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'ar';
  const isAr = lang === 'ar';
  
  const settings = await getSiteSettings();

  return (
    // ✅ الحل النهائي: وضع html و body هنا لضمان مطابقة السيرفر مع المتصفح
    <html lang={lang} dir={isAr ? 'rtl' : 'ltr'} className={`${almarai.variable} ${jakarta.variable}`}>
      <body 
        className={`
          ${isAr ? 'font-almarai' : 'font-jakarta'} 
          min-h-screen flex flex-col bg-slate-50 text-slate-900 
          antialiased selection:bg-[#C02026] selection:text-white
          overflow-x-hidden
        `}
        style={{ 
          textRendering: 'optimizeLegibility',
          fontFeatureSettings: '"rlig" 1, "calt" 1' // لضمان اتصال الحروف العربية
        }}
      >
          
        {/* Top Navigation */}
        <Navbar lang={lang} contactInfo={settings?.contactInfo} />
        
        {/* Main Content Area */}
        <main className="flex-grow relative w-full">
          {children}
        </main>

        {/* --- Floating Elements Zone --- */}
        <CompareFloatingBar lang={lang} />

        <WhatsAppBtn 
          lang={lang} 
          phoneNumber={settings?.contactInfo?.whatsapp || CONTACT_INFO.whatsapp} 
        />
        
        {/* Footer */}
        <Footer lang={lang} settings={settings} />
        
      </body>
    </html>
  );
}