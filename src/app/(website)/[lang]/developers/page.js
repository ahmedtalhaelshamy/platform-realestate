import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';
import { urlFor } from '@/sanity/image';
import DevelopersListClient from './DevelopersListClient';
import { Suspense } from 'react';
import { Sparkles, Building2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

// ✅ 1. PERFORMANCE & SEO CONFIG
export const dynamic = 'force-static';
export const revalidate = 3600;

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

// ✅ 2. توليد اللغات مسبقاً (ar / en)
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

/**
 * 📡 جلب بيانات المطورين مع فلترة المسودات
 */
async function fetchDevelopersData() {
  const query = `*[_type == "developer" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    nameAr, nameEn,
    "slug": slug.current,
    logo,
    "projectsCount": count(*[_type == "project" && references(^._id) && !(_id in path("drafts.**"))])
  }`;
  
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Critical: Developers Fetch Error", error);
    return [];
  }
}

/**
 * 🔍 SEO Metadata - أرشفة دولية موحدة
 * تم تحسين صورة الـ OG لتكون WebP تلقائياً
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');
  
  const seo = await client.fetch(`*[_type == "siteSettings"][0].developersSeo`);
  
  const title = getSafeText(isAr 
    ? (seo?.metaTitleAr || CONTACT_INFO.siteNameAr) 
    : (seo?.metaTitleEn || CONTACT_INFO.siteNameEn));
  
  const description = getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn);

  // تحسين: إضافة .auto('format') لضمان أن الصورة المصغرة خفيفة جداً
  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).auto('format').url() 
    : `${baseUrl}/og-image.jpg`;

  return {
    title: `${title} | ${isAr ? 'دليل المطورين' : 'Developers Directory'}`,
    description: description.substring(0, 160),
    alternates: { 
      canonical: `${baseUrl}/${lang}/developers/`,
      languages: {
        'ar': `${baseUrl}/ar/developers/`,
        'en': `${baseUrl}/en/developers/`,
      }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/developers/`,
      images: [{ 
        url: ogImageUrl,
        width: 1200,
        height: 630,
      }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

/**
 * 🛡️ Skeleton Loader المحسن
 */
function DevelopersLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 opacity-40" aria-hidden="true">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />
      ))}
    </div>
  );
}

/**
 * 🏗️ المكون الأساسي لصفحة المطورين
 */
export default async function DevelopersPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🚀 1. HERO SECTION */}
      <header className="relative bg-[#080A0D] pt-36 pb-48 md:pt-52 md:pb-64 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C02026]/10 rounded-full blur-[150px] animate-pulse pointer-events-none" aria-hidden="true" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-10 overflow-x-auto hide-scrollbar">
            <Breadcrumbs items={[{ label: isAr ? 'شركاء النجاح' : 'TITANS', href: `/${lang}/developers/` }]} lang={lang} />
          </div>
          
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-10 backdrop-blur-md">
            <ShieldCheck size={16} className="text-[#C02026]" />
            {isAr ? 'نخبة المطورين العقاريين في مصر' : 'The Strategic Legacy Partners'}
          </div>

          <h1 className="text-5xl md:text-[9rem] font-black text-white mb-8 uppercase tracking-tighter italic leading-[0.85] drop-shadow-2xl">
            {isAr ? 'رواد' : 'THE'}<br/>
            <span className="text-[#C02026] not-italic">{isAr ? 'الصناعة' : 'TITANS'}</span>
          </h1>
        </div>
      </header>

      {/* 🚀 2. DEVELOPERS LIST SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 -mt-24 md:-mt-40 relative z-20 pb-40" aria-label="Developers Directory">
        <Suspense fallback={<DevelopersLoading />}>
            <DevelopersDataWrapper lang={lang} />
        </Suspense>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}

/**
 * 🛰️ المكون الداخلي لمعالجة البيانات
 */
async function DevelopersDataWrapper({ lang }) {
  const developers = await fetchDevelopersData();
  
  if (!developers || developers.length === 0) {
    return (
      <div className="bg-white rounded-[4rem] p-24 text-center border-2 border-dashed border-slate-100 shadow-2xl" role="status">
        <Building2 size={64} className="mx-auto text-slate-200 mb-8 opacity-20" aria-hidden="true" />
        <h2 className="text-2xl font-black text-slate-400 italic uppercase tracking-widest">
          {lang === 'ar' ? 'جاري تحديث قائمة العمالقة...' : 'Synchronizing Industry Leaders...'}
        </h2>
      </div>
    );
  }

  return <DevelopersListClient initialDevelopers={developers} lang={lang} />;
}

/**
 * 🛡️ Custom Icon Component
 */
function ShieldCheck({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}