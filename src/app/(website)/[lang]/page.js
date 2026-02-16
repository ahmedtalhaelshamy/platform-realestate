import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { notFound } from 'next/navigation';

import FeaturedProjects from '@/components/sections/FeaturedProjects'; 
import SearchFilter from '@/components/SearchFilter';
import AboutSection from '@/components/AboutSection';
import CityCarousel from '@/components/CityCarousel'; 
import { ShieldCheck, ArrowRight, Award, CheckCircle, Zap, TrendingUp, Gem } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ 1. تحويل الصفحة لـ Static بنسبة 100% وإجبار المحرك على بنائها وقت الـ Build
export const dynamic = 'force-static';
export const revalidate = 3600; 

// ✅ 2. توليد المسارات مسبقاً (اللغات المتاحة)
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

// --- 3. SEO METADATA ---
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getPageData();
  const seo = data?.settings?.seo;

  const title = isAr ? (seo?.metaTitleAr || CONTACT_INFO.siteNameAr) : (seo?.metaTitleEn || CONTACT_INFO.siteNameEn);
  
  return {
    title: `${title} | Platform Real Estate`,
    description: isAr ? seo?.metaDescAr : seo?.metaDescEn,
    alternates: { canonical: `${CONTACT_INFO.domain}/${lang}` },
    openGraph: {
      title,
      images: seo?.openGraphImage ? [urlFor(seo.openGraphImage).width(1200).url()] : [],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    },
  };
}

const BADGE_MAP = {
  strategic: { icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50', ar: 'شريك استراتيجي', en: 'Strategic Partner' },
  market_leader: { icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', ar: 'رائد السوق', en: 'Market Leader' },
  luxury: { icon: Gem, color: 'text-purple-600', bg: 'bg-purple-50', ar: 'عقارات فاخرة', en: 'Luxury Realty' },
  default: { icon: CheckCircle, color: 'text-slate-600', bg: 'bg-slate-50', ar: 'مطور موثوق', en: 'Trusted' }
};

// --- 4. DATA FETCHING (Strict Query) ---
async function getPageData() {
  const query = `{
    "settings": *[_type == "siteSettings"][0]{ 
        titleAr, titleEn, descriptionAr, descriptionEn, heroImage, 
        "seo": seo { metaTitleAr, metaTitleEn, metaDescAr, metaDescEn, keywordsAr, keywordsEn, openGraphImage }
    },
    "projects": *[_type == "project" && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...15] {
      _id, titleAr, titleEn, price, installments, downPayment,
      "slug": slug.current, mainImage, projectType,
      "location": location->{ nameAr, nameEn },
      "developer": developer->{ nameAr, nameEn, logo },
      isNewLaunch, isFeatured, isReady
    },
    "developers": *[_type == "developer" && !(_id in path("drafts.**"))] | order(order asc) {
      _id, nameAr, nameEn, logo, "slug": slug.current, badges, 
      "projectsCount": count(*[_type == "project" && references(^._id)])
    }
  }`;
  return await client.fetch(query);
}

// --- 5. MAIN COMPONENT ---
export default async function HomePage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getPageData();
  if (!data) return notFound();

  const { settings, projects, developers } = data;

  // تنقية البيانات لضمان عدم وجود تكرار
  const uniqueDevelopers = Array.from(new Map(developers.map(dev => [dev._id, dev])).values());

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🚀 HERO SECTION: CRYSTAL CLARITY */}
      <header className="relative h-[90vh] md:h-[100vh] flex flex-col items-center justify-between bg-[#050505] overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 z-0">
          {settings?.heroImage && (
             <Image 
                src={urlFor(settings.heroImage).width(1920).url()} 
                alt="Luxury Real Estate Egypt" fill priority 
                className="object-cover scale-100 animate-slow-zoom opacity-100" 
             />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent via-[45%] to-black/60 z-10" />
        </div>

        <div className="h-4 w-full" />

        <div className="relative z-20 px-6 max-w-7xl text-center space-y-10 animate-in fade-in duration-1000 mb-24 md:mb-32">
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-white text-[10px] md:text-xs font-black uppercase tracking-widest shadow-2xl">
            <ShieldCheck size={14} className="text-[#C02026]" />
            {isAr ? 'منصة الاستثمار العقاري الأولى في مصر' : 'Egypt’s Premier Real Estate Gateway'}
          </div>
          
          <h1 className="text-5xl md:text-[8.5rem] font-black text-white leading-[0.8] tracking-tighter italic drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
            {isAr ? settings?.titleAr : settings?.titleEn}<span className="text-[#C02026] not-italic">.</span>
          </h1>
          
          <Link href={`/${lang}/projects`} className="group inline-flex items-center gap-5 bg-[#C02026] text-white px-14 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-white hover:text-black shadow-2xl active:scale-95">
            {isAr ? 'عرض المشاريع الحصرية' : 'Explore Portfolio'}
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="relative z-50 w-full max-w-5xl px-6 transform translate-y-1/2">
           <SearchFilter lang={lang} isAr={isAr} />
        </div>
      </header>

      {/* 🏙️ CONTENT FLOW */}
      <div className="pt-48 space-y-48 pb-32">
        
        <AboutSection lang={lang} isAr={isAr} />
        
        <section className="bg-slate-50 py-32 border-y border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
             <div className="space-y-4">
               <h2 className="text-5xl md:text-8xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                 {isAr ? 'أحدث الفرص' : 'Featured'}
               </h2>
               <div className="h-2 w-40 bg-[#C02026] rounded-full" />
             </div>
             <Link href={`/${lang}/projects`} className="flex items-center gap-3 text-slate-900 font-black text-xs uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-[#C02026] hover:border-[#C02026] transition-all">
                {isAr ? 'جميع العقارات' : 'All Listings'} <ArrowRight size={16} />
             </Link>
          </div>
          <FeaturedProjects projects={projects} isAr={isAr} lang={lang} />
        </section>

        <section className="max-w-7xl mx-auto px-6">
           <div className="mb-20">
              <h2 className="text-5xl md:text-8xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                {isAr ? 'أهم المناطق' : 'Hotspots'}
              </h2>
           </div>
           <CityCarousel lang={lang} />
        </section>

        {/* 🏆 ELITE DEVELOPERS */}
        <section className="bg-white py-32 overflow-hidden relative border-t border-slate-50">
            <div className="text-center mb-28 px-6 space-y-4">
              <span className="text-[#C02026] font-black text-[10px] uppercase tracking-[0.6em] block">
                {isAr ? 'نخبة المطورين العقاريين' : 'Strategic Legacy Partners'}
              </span>
              <h2 className="text-4xl md:text-8xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
                {isAr ? 'المطورون' : 'Titans'}
              </h2>
            </div>

            <div className="relative flex items-center group">
                <div className="flex w-max animate-marquee gap-12 md:gap-28 items-center px-10 group-hover:[animation-play-state:paused]">
                  {[...uniqueDevelopers, ...uniqueDevelopers].map((dev, idx) => (
                    <Link key={`${dev._id}-${idx}`} href={`/${lang}/developers/${dev.slug}`} className="hover:scale-110 transition-transform duration-700 shrink-0">
                      <DeveloperLogoItem dev={dev} isAr={isAr} />
                    </Link>
                  ))}
                </div>
                <div className="absolute inset-y-0 left-0 w-32 md:w-96 bg-gradient-to-r from-white via-white/40 to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 md:w-96 bg-gradient-to-l from-white via-white/40 to-transparent z-20 pointer-events-none" />
            </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; animation: marquee 30s linear infinite; }
        html[dir="rtl"] .animate-marquee { animation: marquee 30s linear infinite reverse; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 30s linear infinite alternate; }
        @media (max-width: 768px) { .animate-marquee { animation-duration: 30s; } }
      `}} />
    </main>
  );
}

// --- 6. HELPER: Titan Logo Item ---
const DeveloperLogoItem = ({ dev, isAr }) => {
  const mainBadgeKey = Array.isArray(dev.badges) ? dev.badges[0] : null;
  const badgeConfig = BADGE_MAP[mainBadgeKey] || BADGE_MAP.default;
  const BadgeIcon = badgeConfig.icon;

  return (
    <div className="relative group/dev px-4 shrink-0"> 
      <div className="w-[200px] h-[120px] md:w-[280px] md:h-[160px] bg-white rounded-[3.5rem] border border-slate-100 shadow-sm relative transition-all duration-700 group-hover/dev:shadow-2xl group-hover/dev:border-[#C02026] group-hover/dev:-translate-y-4">
        
        {mainBadgeKey && (
          <div className={`absolute -top-5 ${isAr ? '-left-2' : '-right-2'} z-[60] flex items-center gap-2 ${badgeConfig.bg} ${badgeConfig.color} px-5 py-2 rounded-2xl shadow-xl border-2 border-white transform transition-transform group-hover/dev:scale-110`}>
             <BadgeIcon size={14} />
             <span className="text-[9px] font-black uppercase tracking-tighter leading-none">
                {isAr ? badgeConfig.ar : (badgeConfig.en || mainBadgeKey)}
             </span>
          </div>
        )}

        <div className="absolute inset-0 overflow-hidden rounded-[3.5rem] z-10 flex items-center justify-center p-6 md:p-8">
          <div className="relative w-full h-full grayscale opacity-40 group-hover/dev:grayscale-0 group-hover/dev:opacity-100 transition-all duration-1000 transform group-hover/dev:scale-110">
            {dev.logo ? (
              <Image 
                src={urlFor(dev.logo).width(600).url()} 
                alt={`${dev.nameEn} logo`} fill className="object-contain" 
                loading="lazy"
              />
            ) : (
              <span className="text-slate-300 font-black text-sm uppercase tracking-widest text-center">{dev.nameEn}</span>
            )}
          </div>
        </div>

        {dev.projectsCount > 0 && (
          <div className="absolute -bottom-5 inset-x-0 flex justify-center z-50 opacity-0 group-hover/dev:opacity-100 transition-all duration-500">
            <div className="bg-[#C02026] text-white px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white transform scale-90 group-hover/dev:scale-100">
              <span className="text-sm font-black leading-none">{dev.projectsCount}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{isAr ? 'مشروع' : 'Projects'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};