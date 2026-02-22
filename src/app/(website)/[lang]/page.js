import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { notFound } from 'next/navigation';

import FeaturedProjects from '@/components/sections/FeaturedProjects'; 
import SearchFilter from '@/components/SearchFilter';
import AboutSection from '@/components/AboutSection';
import CityCarousel from '@/components/CityCarousel'; 
import { ShieldCheck, ArrowRight, Award, CheckCircle, Gem } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ 1. PERFORMANCE & CACHING
export const dynamic = 'force-static';
export const revalidate = 3600; 

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  return String(val);
};

/**
 * ✅ Metadata: Optimized for SEO & Social Sharing
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getPageData();
  const seo = data?.settings?.seo;

  const title = getSafeText(isAr ? (seo?.metaTitleAr || CONTACT_INFO.siteNameAr) : (seo?.metaTitleEn || CONTACT_INFO.siteNameEn));
  const description = getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn);
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');

  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).format('webp').url()
    : `${baseUrl}/og-image.jpg`;

  return {
    title: `${title} | Platform`,
    description,
    alternates: { 
      canonical: `${baseUrl}/${lang}/`,
      languages: { 'ar': `${baseUrl}/ar/`, 'en': `${baseUrl}/en/` }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/`,
      images: [{ url: ogImageUrl }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    },
  };
}

const BADGE_MAP = {
  strategic: { icon: ShieldCheck, color: 'text-blue-700', bg: 'bg-blue-50', ar: 'شريك استراتيجي', en: 'Strategic Partner' },
  market_leader: { icon: Award, color: 'text-amber-700', bg: 'bg-amber-50', ar: 'رائد السوق', en: 'Market Leader' },
  luxury: { icon: Gem, color: 'text-purple-700', bg: 'bg-purple-50', ar: 'عقارات فاخرة', en: 'Luxury Realty' },
  default: { icon: CheckCircle, color: 'text-slate-700', bg: 'bg-slate-100', ar: 'مطور موثوق', en: 'Trusted' }
};

async function getPageData() {
  const query = `{
    "settings": *[_type == "siteSettings"][0]{ 
        titleAr, titleEn, descriptionAr, descriptionEn, heroImage, 
        "seo": seo { metaTitleAr, metaTitleEn, metaDescAr, metaDescEn, openGraphImage }
    },
    "projects": *[_type == "project" && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...15] {
      _id, titleAr, titleEn, price, installments, downPayment,
      "slug": slug.current, mainImage, projectType,
      "location": location->{ nameAr, nameEn },
      "district": district->{ nameAr, nameEn },
      "developer": developer->{ nameAr, nameEn, logo },
      isNewLaunch, isFeatured, isReadyToMove, isInvestmentOpportunity
    },
    "developers": *[_type == "developer" && !(_id in path("drafts.**"))] | order(order asc) {
      _id, nameAr, nameEn, logo, "slug": slug.current, badges, 
      "projectsCount": count(*[_type == "project" && references(^._id)])
    }
  }`;
  return await client.fetch(query);
}

export default async function HomePage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getPageData();
  if (!data) return notFound();

  const { settings, projects, developers } = data;
  const marqueeItems = [...developers, ...developers, ...developers];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn,
    "url": `${CONTACT_INFO.domain}/${lang}/`,
    "logo": `${CONTACT_INFO.domain}/logo.png`,
    "telephone": CONTACT_INFO.phone,
    "sameAs": Object.values(CONTACT_INFO.social),
    "address": { "@type": "PostalAddress", "addressLocality": "New Cairo", "addressCountry": "EG" }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
        
        {/* 🚀 HERO SECTION - Optimized LCP 2026 */}
        <header className="relative h-[85vh] md:h-[95vh] flex flex-col items-center justify-center bg-[#050505] z-30">
          <div className="absolute inset-0 z-0 overflow-hidden">
            {settings?.heroImage && (
               <Image 
                  src={urlFor(settings.heroImage).width(1920).format('webp').quality(80).url()} 
                  alt={isAr ? "عقارات مصر - المنصة الأولى" : "Real Estate Egypt Premier Gateway"} 
                  priority={true} 
                  fetchPriority="high" 
                  fill
                  sizes="100vw"
                  className="object-cover animate-slow-zoom opacity-60 will-change-transform" 
                  placeholder="blur"
                  blurDataURL="data:image/webp;base64,UklGRmAAAABXRUJQVlA4WAoAAAAQAAAABwAABwAAQUxQSDIAAAABJ0AgGQAABAAAEDIAAABWUDggGAAAADABAJ0BKggACAACQDglsAJ0AAfAAf7/4AAA"
               />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60 z-10" aria-hidden="true" />
          </div>

          <div className="relative z-20 px-6 max-w-7xl text-center space-y-10 mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white text-[10px] md:text-xs font-black uppercase tracking-widest shadow-2xl">
              <ShieldCheck size={14} className="text-brand-red" aria-hidden="true" />
              {isAr ? 'منصة الاستثمار العقاري الأولى في مصر' : 'Egypt’s Premier Real Estate Gateway'}
            </div>
            
            <h1 className={`text-5xl md:text-7xl lg:text-[8rem] font-black text-white leading-[1.1] md:leading-[0.95] drop-shadow-2xl uppercase ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
              {isAr ? settings?.titleAr : settings?.titleEn}<span className="text-brand-red not-italic">.</span>
            </h1>
            
            <Link 
              href={`/${lang}/projects/`} 
              className="group inline-flex items-center gap-5 bg-brand-red text-white px-10 md:px-12 py-5 md:py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-white hover:text-brand-dark shadow-premium active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-brand-red/30"
            >
              {isAr ? 'عرض المشاريع الحصرية' : 'Explore Portfolio'}
              <ArrowRight size={20} className={`transition-transform duration-500 ${isAr ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />
            </Link>
          </div>

          {/* Search bar float */}
          <div className="absolute bottom-0 start-0 w-full translate-y-1/2 z-[100] px-6 pointer-events-none">
             <div className="max-w-5xl mx-auto pointer-events-auto">
                <SearchFilter lang={lang} isAr={isAr} />
             </div>
          </div>
        </header>

        {/* 🏙️ CONTENT SECTION */}
        <div className="pt-40 md:pt-60 space-y-32 md:space-y-48 pb-32">
          
          <AboutSection lang={lang} isAr={isAr} />
          
          <section id="featured" className="bg-brand-gray-50 py-32 border-y border-slate-100" aria-labelledby="featured-title">
            <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
               <div className="space-y-6 text-start">
                 <h2 id="featured-title" className={`text-5xl md:text-8xl font-black text-brand-dark uppercase leading-none ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
                   {isAr ? 'أحدث الفرص' : 'Featured'}
                 </h2>
                 <div className="h-2.5 w-48 bg-brand-red rounded-full" aria-hidden="true" />
               </div>
               <Link 
                 href={`/${lang}/projects/`} 
                 className="flex items-center gap-4 text-brand-dark font-black text-sm uppercase tracking-widest border-b-4 border-brand-red pb-2 hover:bg-brand-red hover:text-white px-4 transition-all duration-500 rounded-t-xl"
               >
                  {isAr ? 'جميع العقارات' : 'All Listings'} <ArrowRight size={18} className="rtl:rotate-180" />
               </Link>
            </div>
            <FeaturedProjects projects={projects} isAr={isAr} lang={lang} />
          </section>

          <section id="hotspots" className="max-w-7xl mx-auto px-6" aria-labelledby="hotspots-title">
             <div className="mb-24 text-start">
                <h2 id="hotspots-title" className={`text-5xl md:text-8xl font-black text-brand-dark uppercase leading-none ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
                  {isAr ? 'أهم المناطق' : 'Hotspots'}
                </h2>
             </div>
             <CityCarousel lang={lang} />
          </section>

          {/* 🏢 TITANS SECTION - Legacy Partners */}
          <section id="developers" className="bg-white py-32 overflow-hidden relative" aria-labelledby="dev-title">
              <div className="text-center mb-32 px-6 space-y-6">
                <span className={`text-brand-red font-black text-[11px] uppercase block ${isAr ? 'tracking-wider' : 'tracking-[0.6em]'}`}>
                  {isAr ? 'نخبة المطورين العقاريين' : 'Strategic Legacy Partners'}
                </span>
                <h2 id="dev-title" className={`text-5xl md:text-[9rem] font-black text-brand-dark uppercase leading-none ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
                  {isAr ? 'المطورون' : 'Titans'}
                </h2>
              </div>

              {/* Seamless Logo Marquee */}
              <div className="relative flex items-center group py-40" role="region" aria-label="Developers Logo Marquee">
                  <div className="flex w-max animate-marquee gap-16 md:gap-32 items-center px-12 group-hover:[animation-play-state:paused]">
                    {marqueeItems.map((dev, idx) => (
                      <Link 
                        key={`${dev._id}-${idx}`} 
                        href={`/${lang}/developers/${dev.slug}/`} 
                        className="hover:scale-110 transition-transform duration-700 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-3xl"
                      >
                        <DeveloperLogoItem dev={dev} isAr={isAr} />
                      </Link>
                    ))}
                  </div>
                  {/* Glass Shadows for Marquee */}
                  <div className="absolute inset-y-0 start-0 w-32 md:w-80 bg-gradient-to-r rtl:bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" aria-hidden="true" />
                  <div className="absolute inset-y-0 end-0 w-32 md:w-80 bg-gradient-to-l rtl:bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" aria-hidden="true" />
              </div>
          </section>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
          @keyframes marqueeRTL { 0% { transform: translateX(0); } 100% { transform: translateX(33.33%); } }
          .animate-marquee { display: flex; animation: marquee 120s linear infinite; }
          html[dir="rtl"] .animate-marquee { animation-name: marqueeRTL; }
          .animate-slow-zoom { animation: slow-zoom 40s linear infinite alternate; will-change: transform; }
          @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
          @media (max-width: 768px) { .animate-marquee { animation-duration: 60s; } }
          .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
        `}} />
      </main>
    </>
  );
}

/**
 * ✅ DeveloperLogoItem: Refactored for Premium UI
 */
const DeveloperLogoItem = ({ dev, isAr }) => {
  const mainBadgeKey = Array.isArray(dev.badges) ? dev.badges[0] : null;
  const badgeConfig = BADGE_MAP[mainBadgeKey] || BADGE_MAP.default;
  const BadgeIcon = badgeConfig.icon;

  return (
    <div className="relative group/dev px-6 shrink-0"> 
      <div className="w-[200px] h-[120px] md:w-[320px] md:h-[180px] bg-white rounded-[3rem] md:rounded-[4rem] border border-slate-100 shadow-sm relative transition-all duration-1000 group-hover/dev:shadow-premium group-hover/dev:border-brand-red group-hover/dev:-translate-y-4">
        
        {mainBadgeKey && (
          <div className={`absolute -top-4 start-[-12px] z-[60] flex items-center gap-2 ${badgeConfig.bg} ${badgeConfig.color} px-5 py-2 rounded-2xl shadow-xl border border-white transform transition-transform group-hover/dev:scale-110`}>
             <BadgeIcon size={14} aria-hidden="true" />
             <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                {isAr ? badgeConfig.ar : badgeConfig.en}
             </span>
          </div>
        )}

        <div className="absolute inset-0 overflow-hidden rounded-[3rem] md:rounded-[4rem] z-10 flex items-center justify-center p-10">
          <div className="relative w-full h-full grayscale opacity-40 group-hover/dev:grayscale-0 group-hover/dev:opacity-100 transition-all duration-1000 transform group-hover/dev:scale-105">
            {dev.logo ? (
              <Image 
                src={urlFor(dev.logo).width(400).format('webp').url()} 
                alt={`${dev.nameEn} Official Logo`} 
                fill 
                sizes="400px"
                className="object-contain" 
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-sm uppercase tracking-widest text-center">{dev.nameEn}</div>
            )}
          </div>
        </div>

        {dev.projectsCount > 0 && (
          <div className="absolute -bottom-5 inset-x-0 flex justify-center z-50 opacity-0 group-hover/dev:opacity-100 transition-all duration-700 translate-y-4 group-hover/dev:translate-y-0">
            <div className="bg-brand-red text-white px-6 py-2 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white">
              <span className="text-sm font-black leading-none">{dev.projectsCount}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{isAr ? 'عقار' : 'Assets'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};