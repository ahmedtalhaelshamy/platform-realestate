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

// ✅ دالة الأمان لتنظيف النصوص
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  return String(val);
};

// --- SEO METADATA ---
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getPageData();
  const seo = data?.settings?.seo;

  const title = getSafeText(isAr ? (seo?.metaTitleAr || CONTACT_INFO.siteNameAr) : (seo?.metaTitleEn || CONTACT_INFO.siteNameEn));
  const description = getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn);
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');

  return {
    title: `${title} | Platform Real Estate`,
    description,
    alternates: { 
      canonical: `${baseUrl}/${lang}/`,
      languages: { 'ar': `${baseUrl}/ar/`, 'en': `${baseUrl}/en/` }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/`,
      images: seo?.openGraphImage ? [urlFor(seo.openGraphImage).width(1200).url()] : [`${baseUrl}/og-image.jpg`],
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
    "address": { "@type": "PostalAddress", "addressLocality": "New Cairo", "addressCountry": "EG" }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
        
        {/* HERO SECTION */}
        {/* ✅ تم إزالة overflow-hidden وإضافة z-30 لضمان ظهور نتايج البحث فوق باقي الصفحة */}
        <header className="relative h-[85vh] md:h-[95vh] flex flex-col items-center justify-center bg-[#050505] z-30">
          {/* ✅ تم إضافة overflow-hidden هنا فقط للحفاظ على حواف الصورة أثناء الـ Zoom */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {settings?.heroImage && (
               <Image 
                  src={urlFor(settings.heroImage).width(1400).quality(90).url()} 
                  alt="Real Estate Egypt" 
                  priority={true} 
                  fetchPriority="high" 
                  loading="eager"
                  fill
                  className="object-cover animate-slow-zoom opacity-60" 
               />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60 z-10" aria-hidden="true" />
          </div>

          <div className="relative z-20 px-6 max-w-7xl text-center space-y-10 mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-white text-[11px] md:text-xs font-black uppercase tracking-widest shadow-2xl">
              <ShieldCheck size={14} className="text-[#C02026]" />
              {isAr ? 'منصة الاستثمار العقاري الأولى في مصر' : 'Egypt’s Premier Real Estate Gateway'}
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[8.5rem] font-black text-white leading-[0.9] tracking-tighter italic drop-shadow-2xl uppercase">
              {isAr ? settings?.titleAr : settings?.titleEn}<span className="text-[#C02026] not-italic">.</span>
            </h1>
            
            <Link 
              href={`/${lang}/projects/`} 
              aria-label={isAr ? "استكشف قائمة المشاريع" : "Explore projects portfolio"}
              className="group inline-flex items-center gap-5 bg-[#C02026] text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-white hover:text-black shadow-2xl active:scale-95"
            >
              {isAr ? 'عرض المشاريع الحصرية' : 'Explore Portfolio'}
              <ArrowRight size={20} className={`${isAr ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'} transition-transform`} />
            </Link>
          </div>

          {/* Search Filter Container */}
          <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-[100] px-6 pointer-events-none">
             <div className="max-w-5xl mx-auto pointer-events-auto">
                <SearchFilter lang={lang} isAr={isAr} />
             </div>
          </div>
        </header>

        {/* 🏙️ CONTENT SECTION */}
        <div className="pt-40 md:pt-60 space-y-32 md:space-y-48 pb-32">
          
          <AboutSection lang={lang} isAr={isAr} />
          
          {/* FEATURED PROJECTS */}
          <section id="featured" className="bg-slate-50 py-32 border-y border-slate-100" aria-labelledby="featured-title">
            <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
               <div className="space-y-6">
                 <h2 id="featured-title" className="text-5xl md:text-8xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                   {isAr ? 'أحدث الفرص' : 'Featured'}
                 </h2>
                 <div className="h-2.5 w-48 bg-[#C02026] rounded-full" aria-hidden="true" />
               </div>
               <Link 
                 href={`/${lang}/projects/`} 
                 aria-label={isAr ? "مشاهدة كافة العقارات المتاحة" : "View all available listings"}
                 className="flex items-center gap-4 text-slate-900 font-black text-sm uppercase tracking-[0.2em] border-b-4 border-[#C02026] pb-2 hover:bg-[#C02026] hover:text-white px-4 transition-all duration-500 rounded-t-xl"
               >
                  {isAr ? 'جميع العقارات' : 'All Listings'} <ArrowRight size={18} className={isAr ? 'rotate-180' : ''} />
               </Link>
            </div>
            <FeaturedProjects projects={projects} isAr={isAr} lang={lang} />
          </section>

          {/* HOTSPOTS */}
          <section id="hotspots" className="max-w-7xl mx-auto px-6" aria-labelledby="hotspots-title">
             <div className="mb-24 text-start">
                <h2 id="hotspots-title" className="text-5xl md:text-8xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                  {isAr ? 'أهم المناطق' : 'Hotspots'}
                </h2>
             </div>
             <CityCarousel lang={lang} />
          </section>

          {/* DEVELOPERS TITANS */}
          <section id="developers" className="bg-white py-32 overflow-hidden relative" aria-labelledby="dev-title">
              <div className="text-center mb-32 px-6 space-y-6">
                <span className="text-[#C02026] font-black text-[11px] uppercase tracking-[0.6em] block">
                  {isAr ? 'نخبة المطورين العقاريين' : 'Strategic Legacy Partners'}
                </span>
                <h2 id="dev-title" className="text-5xl md:text-[9rem] font-black text-slate-900 italic tracking-tighter uppercase leading-none">
                  {isAr ? 'المطورون' : 'Titans'}
                </h2>
              </div>

              {/* ✅ تم استخدام py-40 لضمان وجود مساحة كافية فوق وتحت الكروت */}
              <div className="relative flex items-center group py-40" role="region" aria-label="Developers Logo Marquee">
                  <div className="flex w-max animate-marquee gap-16 md:gap-32 items-center px-12 group-hover:[animation-play-state:paused]">
                    {marqueeItems.map((dev, idx) => (
                      <Link 
                        key={`${dev._id}-${idx}`} 
                        href={`/${lang}/developers/${dev.slug}/`} 
                        aria-label={isAr ? `شركة ${dev.nameAr}` : `${dev.nameEn} development company`}
                        className="hover:scale-110 transition-transform duration-700 shrink-0"
                      >
                        <DeveloperLogoItem dev={dev} isAr={isAr} />
                      </Link>
                    ))}
                  </div>
                  {/* Glass Gradient Fades */}
                  <div className="absolute inset-y-0 left-0 w-32 md:w-80 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" aria-hidden="true" />
                  <div className="absolute inset-y-0 right-0 w-32 md:w-80 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" aria-hidden="true" />
              </div>
          </section>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes marqueeRTL { 0% { transform: translateX(0); } 100% { transform: translateX(50%); } }
          .animate-marquee { display: flex; animation: marquee 100s linear infinite; }
          html[dir="rtl"] .animate-marquee { animation-name: marqueeRTL; }
          .animate-slow-zoom { animation: slow-zoom 40s linear infinite alternate; }
          @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
          @media (max-width: 768px) { .animate-marquee { animation-duration: 50s; } }
        `}} />
      </main>
    </>
  );
}

const DeveloperLogoItem = ({ dev, isAr }) => {
  const mainBadgeKey = Array.isArray(dev.badges) ? dev.badges[0] : null;
  const badgeConfig = BADGE_MAP[mainBadgeKey] || BADGE_MAP.default;
  const BadgeIcon = badgeConfig.icon;

  return (
    <div className="relative group/dev px-6 shrink-0"> 
      <div className="w-[200px] h-[120px] md:w-[320px] md:h-[180px] bg-white rounded-[3rem] md:rounded-[4rem] border border-slate-100 shadow-sm relative transition-all duration-1000 group-hover/dev:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover/dev:border-[#C02026] group-hover/dev:-translate-y-4">
        
        {mainBadgeKey && (
          <div className={`absolute -top-4 ${isAr ? '-left-3' : '-right-3'} z-[60] flex items-center gap-2 ${badgeConfig.bg} ${badgeConfig.color} px-5 py-2 rounded-2xl shadow-xl border border-white transform transition-transform group-hover/dev:scale-110`}>
             <BadgeIcon size={14} aria-hidden="true" />
             <span className="text-[9px] font-black uppercase tracking-widest">
                {isAr ? badgeConfig.ar : badgeConfig.en}
             </span>
          </div>
        )}

        <div className="absolute inset-0 overflow-hidden rounded-[3rem] md:rounded-[4rem] z-10 flex items-center justify-center p-10">
          <div className="relative w-full h-full grayscale opacity-30 group-hover/dev:grayscale-0 group-hover/dev:opacity-100 transition-all duration-1000 transform group-hover/dev:scale-105">
            {dev.logo ? (
              <Image 
                src={urlFor(dev.logo).width(400).url()} 
                alt={`${dev.nameEn} logo`} fill className="object-contain" 
              />
            ) : (
              <span className="text-slate-600 font-black text-sm uppercase tracking-widest">{dev.nameEn}</span>
            )}
          </div>
        </div>

        {dev.projectsCount > 0 && (
          <div className="absolute -bottom-5 inset-x-0 flex justify-center z-50 opacity-0 group-hover/dev:opacity-100 transition-all duration-700 translate-y-4 group-hover/dev:translate-y-0">
            <div className="bg-[#C02026] text-white px-6 py-2 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white">
              <span className="text-sm font-black leading-none">{dev.projectsCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'عقار' : 'Assets'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};