import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';
import { urlFor } from '@/sanity/image';
import DevelopersListClient from './DevelopersListClient';
import { Suspense } from 'react';
import { Sparkles, Building2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

// ✅ 1. إجبار الصفحة على أن تكون Static بالكامل
export const dynamic = 'force-static';
export const revalidate = 3600;

// ✅ 2. تعريف اللغات المتاحة وقت الـ Build لتحويل الصفحة لـ ●
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

/**
 * 📡 دالة جلب البيانات - مضاف إليها فلتر المسودات لضمان استقرار الـ Build
 */
async function fetchDevelopersData() {
  const query = `*[_type == "developer" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    nameAr, nameEn,
    "slug": slug.current,
    logo,
    "projectsCount": count(*[_type == "project" && references(^._id)])
  }`;
  
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Critical: Developers Fetch Error", error);
    return [];
  }
}

/**
 * 🔍 SEO Metadata - استعلام نظيف ومنظم
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const seo = await client.fetch(`*[_type == "siteSettings"][0].developersSeo`);
  
  const title = isAr 
    ? (seo?.metaTitleAr || CONTACT_INFO.siteNameAr) 
    : (seo?.metaTitleEn || CONTACT_INFO.siteNameEn);
  
  return {
    title: `${title} | ${isAr ? 'دليل المطورين' : 'Developers Directory'}`,
    description: isAr ? seo?.metaDescAr : seo?.metaDescEn,
    alternates: { canonical: `${CONTACT_INFO.domain}/${lang}/developers` },
    openGraph: {
      title,
      images: seo?.openGraphImage ? [{ url: urlFor(seo.openGraphImage).width(1200).url() }] : [],
    }
  };
}

/**
 * 🛡️ هيكل التحميل (Skeleton Loader)
 */
function DevelopersLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 opacity-30">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />
      ))}
    </div>
  );
}

/**
 * 🏗️ المكون الأساسي للصفحة
 */
export default async function DevelopersPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  return (
    <main className="min-h-screen bg-[#FDFDFD]" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🚀 1. HERO SECTION (Static Content) */}
      <section className="relative bg-[#050505] pt-32 pb-44 md:pt-48 md:pb-64 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C02026]/5 rounded-full blur-[150px] animate-pulse" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-10 opacity-40">
            <Breadcrumbs items={[{ label: isAr ? 'شركاء النجاح' : 'Our Partners' }]} lang={lang} />
          </div>
          
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-8 backdrop-blur-md">
            <ShieldCheck size={14} className="text-[#C02026]" />
            {isAr ? 'نخبة المطورين في مصر' : 'The Elite Developers'}
          </div>

          <h1 className="text-5xl md:text-[9rem] font-black text-white mb-6 uppercase tracking-tighter italic leading-none drop-shadow-2xl">
            {isAr ? 'رواد' : 'THE'}<br/>
            <span className="text-[#C02026] not-italic">{isAr ? 'الصناعة' : 'TITANS'}</span>
          </h1>
        </div>
      </section>

      {/* 🚀 2. CONTENT SECTION WITH SUSPENSE */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 md:-mt-32 relative z-20 pb-40">
        <Suspense fallback={<DevelopersLoading />}>
            <DevelopersDataWrapper lang={lang} />
        </Suspense>
      </section>

    </main>
  );
}

/**
 * 🛰️ مكون جلب البيانات
 */
async function DevelopersDataWrapper({ lang }) {
  const developers = await fetchDevelopersData();
  
  if (!developers || developers.length === 0) {
    return (
      <div className="bg-white rounded-[4rem] p-20 text-center border-2 border-dashed border-slate-100 shadow-sm">
        <Building2 size={60} className="mx-auto text-slate-200 mb-6 opacity-20" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          {lang === 'ar' ? 'جاري تحديث قائمة المطورين...' : 'Syncing Titans Data...'}
        </p>
      </div>
    );
  }

  return <DevelopersListClient initialDevelopers={developers} lang={lang} />;
}

// أيقونة إضافية للحالة الخاصة
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
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}