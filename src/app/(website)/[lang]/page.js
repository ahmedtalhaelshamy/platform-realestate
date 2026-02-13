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

export const revalidate = 60;

// --- 1. SEO METADATA GENERATION ---
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getPageData();
  const seo = data?.settings?.seo;

  const title = isAr 
    ? (seo?.metaTitleAr || CONTACT_INFO.siteNameAr) 
    : (seo?.metaTitleEn || CONTACT_INFO.siteNameEn);

  const description = isAr 
    ? (seo?.metaDescAr || "استشارك العقاري الأول في مصر") 
    : (seo?.metaDescEn || "Your first real estate consultant in Egypt");

  return {
    title,
    description,
    keywords: isAr ? seo?.keywordsAr : seo?.keywordsEn,
    openGraph: {
      title,
      description,
      images: seo?.openGraphImage ? [urlFor(seo.openGraphImage).width(1200).url()] : [],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    },
  };
}

const BADGE_MAP = {
  strategic: { icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50', ar: 'شريك استراتيجي' },
  market_leader: { icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', ar: 'رائد السوق' },
  luxury: { icon: Gem, color: 'text-purple-600', bg: 'bg-purple-50', ar: 'عقارات فاخرة' },
  best_seller: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', ar: 'الأعلى مبيعاً' },
  fast_delivery: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', ar: 'أسرع تسليم' },
  default: { icon: CheckCircle, color: 'text-slate-600', bg: 'bg-slate-50', ar: 'مطور موثوق' }
};

async function getPageData() {
  const query = `{
    "settings": *[_type == "siteSettings"][0]{ 
        titleAr, titleEn, descriptionAr, descriptionEn, heroImage, 
        "seo": seo { metaTitleAr, metaTitleEn, metaDescAr, metaDescEn, keywordsAr, keywordsEn, openGraphImage }
    },
    "projects": *[_type == "project"] | order(_createdAt desc)[0...12] {
      _id, titleAr, titleEn, price, installments, downPayment,
      "slug": slug.current, mainImage, projectType,
      "location": location->{ nameAr, nameEn },
      "developer": developer->{ nameAr, nameEn, logo },
      isNewLaunch, isReadyToMove, isFeatured, isInvestmentOpportunity
    },
    "developers": *[_type == "developer"] | order(order asc)[0...25] {
      _id, nameAr, nameEn, logo, "slug": slug.current,
      badges, 
      "projectsCount": count(*[_type == "project" && references(^._id)])
    }
  }`;
  return await client.fetch(query);
}

// --- 2. MAIN COMPONENT ---
export default async function HomePage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getPageData();
  if (!data) return notFound();

  const { settings, projects, developers } = data;

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[75vh] md:h-[85vh] w-full flex flex-col items-center bg-white overflow-visible pt-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {settings?.heroImage && (
             <Image 
               src={urlFor(settings.heroImage).width(1920).url()} 
               alt={isAr ? settings?.titleAr : settings?.titleEn} 
               fill 
               priority 
               sizes="100vw"
               className="object-cover scale-105 animate-slow-zoom opacity-60" 
             />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-[85%] to-white" />
        </div>

        <div className="relative z-10 px-6 max-w-6xl w-full flex flex-col items-center justify-center h-full pb-8 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full text-white text-[9px] md:text-xs font-black mb-4 ${isAr ? '' : 'uppercase tracking-widest'}`}>
            <ShieldCheck size={14} className="text-[#C02026]" />
            {isAr ? 'مستشارك العقاري الموثوق' : 'Your Trusted Advisor'}
          </div>
          
          <h1 className="text-4xl md:text-[6.5rem] font-black text-white mb-4 leading-none tracking-tighter italic drop-shadow-2xl">
            {isAr ? settings?.titleAr : settings?.titleEn}<span className="text-[#C02026]">.</span>
          </h1>
          
          <p className="text-sm md:text-lg text-white/90 mb-8 max-w-xl mx-auto font-medium italic leading-relaxed text-center">
             {isAr ? settings?.descriptionAr : settings?.descriptionEn}
          </p>
          
          <Link href={`/${lang}/projects`} className={`group inline-flex items-center gap-4 bg-[#C02026] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] transition-all shadow-2xl active:scale-95 ${isAr ? '' : 'uppercase tracking-widest hover:bg-white hover:text-black'}`}>
            {isAr ? 'تصفح المشاريع' : 'Browse Projects'}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-[100] transform translate-y-1/2 flex justify-center px-6">
           <div className="w-full max-w-6xl overflow-visible"> 
             <SearchFilter lang={lang} isAr={isAr} />
           </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <div id="about" className="pt-24 md:pt-32 bg-white">
        <AboutSection lang={lang} isAr={isAr} />
      </div>
      
      {/* 3. FEATURED PROJECTS */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <FeaturedProjects projects={projects} isAr={isAr} lang={lang} />
      </section>

      {/* 4. CITY CAROUSEL */}
      <section className="bg-white py-12 md:py-20">
         <div className="max-w-7xl mx-auto px-6 mb-10 text-start">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
              {isAr ? 'استكشف أهم المناطق' : 'Explore Hotspots'}
            </h2>
         </div>
        <CityCarousel lang={lang} />
      </section>

      {/* 5. ELITE DEVELOPERS */}
      <section className="bg-slate-50/50 py-20 md:py-32 overflow-hidden relative border-t border-slate-100">
          <div className="text-center mb-16 px-6">
            <span className={`text-[#C02026] font-black block mb-3 ${isAr ? '' : 'uppercase tracking-[0.4em] text-[10px]'}`}>
              {isAr ? 'شركاء النجاح' : 'Trusted Partners'}
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
              {isAr ? 'نخبة المطورين' : 'Elite Developers'}
            </h2>
          </div>

          <div className="relative flex overflow-hidden py-5 group">
            <div className="flex w-max animate-marquee gap-8 md:gap-16 items-center px-4 will-change-transform">
              {[...developers, ...developers].map((dev, idx) => (
                 <Link 
                   key={`${dev._id}-${idx}`} 
                   href={`/${lang}/developers/${dev.slug}`}
                   className="cursor-pointer group/link transform-gpu transition-transform hover:scale-110 active:scale-95"
                 >
                    <DeveloperLogoItem dev={dev} isAr={isAr} />
                 </Link>
              ))}
            </div>

            <div className="absolute inset-y-0 left-0 w-20 md:w-60 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 md:w-60 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none" />
          </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }

        .animate-marquee { 
          display: flex;
          animation: marquee 40s linear infinite; 
          animation-delay: -20s; 
        }

        html[dir="rtl"] .animate-marquee { 
          animation: marquee 40s linear infinite reverse; 
          animation-delay: -20s;
        }

        @keyframes slow-zoom { 
          0% { transform: scale(1); } 
          100% { transform: scale(1.1); } 
        }
        .animate-slow-zoom { animation: slow-zoom 20s linear infinite alternate; }
        
        @media (max-width: 768px) {
          .animate-marquee { 
            animation-duration: 25s; 
            animation-delay: -12.5s;
          }
          .transform-gpu {
            will-change: transform;
            backface-visibility: hidden;
          }
        }
      `}} />
    </main>
  );
}

// --- 3. HELPER COMPONENT (لوجو المطور) ---
// ✅ هذا هو الجزء الذي تم إصلاحه بدقة
const DeveloperLogoItem = ({ dev, isAr }) => {
  const mainBadgeKey = Array.isArray(dev.badges) ? dev.badges[0] : null;
  const badgeConfig = BADGE_MAP[mainBadgeKey] || BADGE_MAP.default;
  const BadgeIcon = badgeConfig.icon;

  return (
    <div className="relative group px-1"> 
      {/* 1. الكارت الرئيسي: 
        - لا يوجد overflow-hidden (عشان البادج يظهر بره)
        - relative عشان نتحكم في التموضع
      */}
      <div className="w-[160px] h-[100px] md:w-[240px] md:h-[140px] bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] relative transition-all duration-700 
        group-hover:shadow-[0_30px_70px_-15px_rgba(192,32,38,0.25)] 
        group-hover:border-[#C02026] 
        group-hover:-translate-y-3">
        
        {/* 2. البادج (فوق الصورة): واخد Z-Index عالي ومتموضع بالسالب ليظهر بالخارج */}
        {mainBadgeKey && (
          <div className={`absolute -top-3 ${isAr ? '-left-2' : '-right-2'} z-50 flex items-center gap-2 ${badgeConfig.bg} ${badgeConfig.color} px-3.5 py-1.5 rounded-2xl shadow-xl border border-white transform transition-transform group-hover:scale-110`}>
             <BadgeIcon size={12} />
             <span className="text-[8px] font-black uppercase tracking-tighter leading-none">{isAr ? badgeConfig.ar : mainBadgeKey.replace('_', ' ')}</span>
          </div>
        )}

        {/* 3. حاوية الصورة (Mask): دي اللي فيها overflow-hidden عشان تقص اللوجو جوه المربع */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] z-10">
          <div className="relative w-full h-full grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">
            {dev.logo ? (
              <Image 
                src={urlFor(dev.logo).width(400).url()} 
                alt={dev.nameEn} 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[9px] font-black text-slate-200 uppercase text-center leading-tight">
                {isAr ? dev.nameAr : dev.nameEn}
              </div>
            )}
          </div>
        </div>

        {/* 4. عدد المشاريع (تحت الصورة): واخد Z-Index عالي ومتموضع بالسالب ليظهر بالخارج */}
        {dev.projectsCount > 0 && (
          <div className="absolute -bottom-3 inset-x-0 flex justify-center z-50 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="bg-[#C02026] text-white px-4 py-1 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white scale-90 group-hover:scale-100 transition-all">
              <span className="text-[10px] font-black">{dev.projectsCount}</span>
              <span className="text-[8px] font-bold uppercase">{isAr ? 'مشروع' : 'Projects'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};