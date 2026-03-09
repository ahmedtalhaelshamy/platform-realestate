import CompareClient from './CompareClient';
import { CONTACT_INFO } from '@/components/constants/contact';
import { ShieldCheck, GitCompare, Info } from 'lucide-react';

// 🏁 الدومين الموحد المعتمد للسيو
const BASE_URL = 'https://platformrealestate.co';

/**
 * ✅ 1. التوليد الثابت (SSG)
 * يضمن أن محركات البحث تجد الصفحة جاهزة فوراً باللغتين
 */
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

/**
 * ✅ 2. الـ SEO Metadata (السيطرة اليدوية المطلقة)
 * متوافقة مع معايير جوجل 2026 للهواتف المحمولة
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const title = isAr ? 'قارن بين أفضل كمبوندات مصر' : 'Compare Top Egypt Compounds';
  const description = isAr 
    ? `أداة المقارنة العقارية من ${CONTACT_INFO.siteNameAr}. قارن الأسعار، مقدم الحجز، وخطط السداد لأكثر من 500 مشروع في العاصمة الإدارية والتجمع الخامس.` 
    : `Real Estate Comparison Tool by ${CONTACT_INFO.siteNameEn}. Compare prices, down payments, and plans for 500+ projects.`;

  const arPath = `${BASE_URL}/ar/compare/`;
  const enPath = `${BASE_URL}/en/compare/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    // 🚀 استخدام absolute لضمان السيطرة اليدوية ومنع التكرار
    title: {
      absolute: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    },
    description,
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
      description,
      url: currentPath,
      images: [{ url: `${BASE_URL}/og-compare.jpg`, width: 1200, height: 630, alt: title }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * 🏗️ المكون الرئيسي لصفحة المقارنة
 */
export default async function ComparePage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  // ✅ Schema.org لإخبار جوجل بأنها أداة مقارنة (SEO Boost)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": isAr ? "أداة المقارنة العقارية" : "Real Estate Comparison Tool",
    "url": `${BASE_URL}/${lang}/compare`,
    "applicationCategory": "Real Estate Tool",
    "description": isAr ? "قارن بين أفضل المشاريع العقارية في مصر" : "Compare the best real estate projects in Egypt",
    "operatingSystem": "All"
  };

  return (
    <main 
      className="min-h-screen bg-white" 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 1. Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 2. Header Section */}
      <header className="bg-slate-50 border-b border-slate-100 py-16 md:py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C02026]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 text-[#C02026] mb-6 animate-fade-in">
            <GitCompare size={24} strokeWidth={2.5} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">
              {isAr ? 'مقارنة استثمارية دقيقة' : 'Precision Comparison'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter italic uppercase mb-8">
            {isAr ? 'حلل واختار الأفضل' : 'Compare & Invest'}<span className="text-[#C02026]">.</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
             <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="text-sm">{isAr ? 'بيانات معتمدة من المطورين' : 'Verified Developer Data'}</span>
             </div>
             <div className="flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                <span className="text-sm">{isAr ? 'تحديث الأسعار 2026' : '2026 Price Updates'}</span>
             </div>
          </div>
        </div>
      </header>

      {/* 3. The Interactive Comparison Matrix */}
      <section className="relative z-20 -mt-8">
        <CompareClient lang={lang} />
      </section>

      {/* 4. Global Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #C02026; }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .snap-x {
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}} />
    </main>
  );
}