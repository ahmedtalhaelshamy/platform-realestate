import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { MapPin, Building2, Info, Phone, MessageCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ PERFORMANCE & CACHING
export const dynamic = 'force-static';
export const revalidate = 3600; 

// 🏁 الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

// ✅ دالة الأمان المحسنة لمنع خطأ الـ Objects كأبناء لـ React
const getSafeText = (val: any) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map((child: any) => child.text).join('')).join(' ');
  }
  if (typeof val === 'object' && val.children) {
    return val.children.map((child: any) => child.text).join('');
  }
  return String(val);
};

// 1️⃣ توليد المسارات مسبقاً (SSG) لكل الأحياء واللغات
export async function generateStaticParams() {
  const query = `*[_type == "district" && defined(slug.current) && !(_id in path("drafts.**"))]{ 
    "slug": slug.current 
  }`;
  try {
    const districts = await client.fetch(query);
    const languages = ['ar', 'en'];
    return districts.flatMap((dist: any) => 
      languages.map((lang) => ({ lang, slug: dist.slug }))
    );
  } catch (error) {
    console.error("Static Params Error:", error);
    return [];
  }
}

/**
 * 2️⃣ الـ SEO Metadata (الربط الدولي الموحد)
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';
  
  const district = await client.fetch(
    `*[_type == "district" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      nameAr, nameEn, seoTitleAr, seoTitleEn, seoDescAr, seoDescEn
    }`, 
    { slug }
  );
  
  if (!district) return { title: 'District Not Found' };
  
  const name = isAr ? getSafeText(district.nameAr) : getSafeText(district.nameEn);
  const title = getSafeText(isAr ? (district.seoTitleAr || name) : (district.seoTitleEn || name));
  const description = getSafeText(isAr ? district.seoDescAr : district.seoDescEn);

  const arPath = `${BASE_URL}/ar/districts/${slug}/`;
  const enPath = `${BASE_URL}/en/districts/${slug}/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${title} | Platform`,
    description: description.substring(0, 160) || (isAr 
      ? `استكشف أفضل العقارات والمشاريع في ${name}. مقارنة أسعار وأنظمة سداد.` 
      : `Explore top projects in ${name}. Compare prices and plans.`),
    alternates: {
      canonical: currentPath,
      languages: { 'ar': arPath, 'en': enPath },
    },
    openGraph: {
      title: `${name} | Platform Real Estate`,
      url: currentPath,
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

// ✅ تنسيق محتوى المقال SEO
const ptComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl md:text-4xl font-black mt-16 mb-8 text-slate-950 border-s-8 border-[#C02026] ps-6 italic uppercase tracking-tighter leading-none">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-black mt-10 mb-5 text-slate-800 italic uppercase">{children}</h3>,
    normal: ({ children }) => <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6 text-justify font-medium">{children}</p>,
  },
};

/**
 * 🏗️ المكون الرئيسي
 */
export default async function DistrictPage({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  const query = `{
    "district": *[_type == "district" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id, nameAr, nameEn, descriptionAr, descriptionEn, image,
      "location": location->{_id, nameAr, nameEn, "slug": slug.current},
      "projects": *[_type == "project" && references(^._id) && !(_id in path("drafts.**"))] | order(isNewLaunch desc, _createdAt desc) {
        _id, titleAr, titleEn, price, installments, downPayment, 
        isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage, 
        "developer": developer->{nameAr, nameEn},
        "districtData": district->{ nameAr, nameEn },
        "locationData": location->{ nameAr, nameEn }
      }
    }
  }`;

  const data = await client.fetch(query, { slug });
  if (!data?.district) return notFound();

  const { district } = data;
  const distName = isAr ? getSafeText(district.nameAr) : getSafeText(district.nameEn);
  const parentLocName = isAr ? getSafeText(district.location.nameAr) : getSafeText(district.location.nameEn);

  // Cross-Selling: مشاريع في نفس المنطقة الكبرى ولكن في أحياء أخرى
  const locationProjectsQuery = `*[_type == "project" && location._ref == $locationId && !references($districtId) && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...6] {
    _id, titleAr, titleEn, price, installments, downPayment, 
    isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage, 
    "developer": developer->{nameAr, nameEn},
    "districtData": district->{ nameAr, nameEn },
    "locationData": location->{ nameAr, nameEn }
  }`;

  const locationProjects = await client.fetch(locationProjectsQuery, { 
    locationId: district.location._id, 
    districtId: district._id 
  });

  const breadcrumbItems = [
    { label: isAr ? 'المناطق' : 'Locations', href: `/${lang}/locations/` },
    { label: parentLocName, href: `/${lang}/locations/${district.location.slug}/` },
    { label: distName }
  ];

  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? `استفسار عن المشاريع في حي ${distName}` : `Inquiry about projects in ${distName}`)}`;

  // 🏆 [SEO] Schema Markup - Local Business Neighborhood
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    'name': distName,
    'description': isAr ? `أفضل المشاريع العقارية في حي ${distName}` : `Best real estate assets in ${distName} district`,
    'url': `${BASE_URL}/${lang}/districts/${slug}/`,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': distName,
      'addressRegion': parentLocName,
      'addressCountry': 'EG'
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[50vh] md:h-[65vh] w-full bg-[#080A0D] overflow-hidden" aria-labelledby="district-title">
        {district.image ? (
          <Image 
            src={urlFor(district.image).width(1920).quality(90).url()} 
            alt={distName} fill className="object-cover opacity-60 scale-105 animate-slow-zoom" priority 
          />
        ) : (
          <div className="absolute inset-0 bg-[#080A0D]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-black/20 to-black/60 z-10" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center z-20 max-w-5xl mx-auto">
            <nav className="mb-10 flex justify-center overflow-x-auto hide-scrollbar"><Breadcrumbs items={breadcrumbItems} lang={lang} /></nav>
            <h1 id="district-title" className="text-5xl md:text-9xl font-black mb-8 italic uppercase tracking-tighter drop-shadow-2xl leading-none">{distName}</h1>
            <div className="inline-flex items-center gap-3 bg-[#C02026] text-white px-6 py-2 rounded-2xl shadow-2xl border border-white/10">
                <MapPin size={16} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">{parentLocName}</span>
            </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 space-y-32">
        
        {/* 2. SPECIFIC DISTRICT PROJECTS GRID */}
        <section id="projects-grid" aria-labelledby="grid-heading">
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-s-[12px] border-[#C02026] ps-8 text-start">
              <div>
                <span className="text-[#C02026] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">{isAr ? 'نتائج البحث في الحي' : 'District Inventory'}</span>
                <h2 id="grid-heading" className="text-4xl md:text-7xl font-black text-slate-950 italic uppercase tracking-tighter leading-none">
                    {isAr ? `مشاريع ${distName}` : `${distName} Portfolio`}
                </h2>
              </div>
              <div className="bg-slate-50 px-8 py-4 rounded-[1.5rem] shadow-inner border border-slate-100 font-black text-slate-900 italic uppercase text-sm">
                {district.projects.length} {isAr ? 'عقارات متاحة' : 'Units Available'}
              </div>
          </header>
          
          {district.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14" role="list">
              {district.projects.map((proj: any) => (
                <article key={proj._id} role="listitem">
                  <ProjectCard data={proj} lang={lang} />
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200" role="status">
                <p className="text-slate-400 font-black text-xl italic uppercase tracking-widest">{isAr ? 'جاري إضافة مشاريع جديدة لهذا الحي' : 'No direct projects yet.'}</p>
            </div>
          )}
        </section>

        {/* 3. CONTENT & SIDEBAR CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* SEO Content Section */}
            <article className="lg:col-span-8 order-2 lg:order-1 text-start">
                {(district.descriptionAr || district.descriptionEn) && (
                  <section className="bg-white p-10 md:p-20 rounded-[4rem] shadow-2xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C02026]/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="flex items-center gap-5 mb-12 text-[#C02026]">
                        <Info size={40} strokeWidth={1.5} />
                        <h3 className="text-3xl md:text-4xl font-black text-slate-950 italic uppercase tracking-tighter leading-none">
                            {isAr ? `لماذا تختار ${distName}؟` : `Why Choose ${distName}?`}
                        </h3>
                    </div>
                    <div className="prose prose-xl prose-slate max-w-none prose-headings:italic prose-headings:tracking-tighter prose-img:rounded-[3rem]">
                      <PortableText value={isAr ? district.descriptionAr : district.descriptionEn} components={ptComponents} />
                    </div>
                  </section>
                )}
            </article>

            {/* Sticky Sidebar CTA */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 order-1 lg:order-2 h-full">
                <section className="bg-[#080A0D] rounded-[4rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border-b-[16px] border-[#C02026] group">
                    <div className="absolute -top-16 -right-16 opacity-10 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none" aria-hidden="true">
                        <Building2 size={300} />
                    </div>
                    
                    <div className="relative z-10 text-start">
                        <div className="inline-flex items-center gap-3 bg-[#C02026] px-5 py-2 rounded-2xl text-[10px] font-black uppercase mb-10 shadow-xl">
                            <Sparkles size={14} className="animate-pulse" /> {isAr ? 'مستشار مخصص' : 'Exclusive Expert'}
                        </div>
                        <h4 className="text-3xl md:text-5xl font-black mb-8 leading-[0.9] italic uppercase tracking-tighter">
                            {isAr ? `احجز معاينتك في ${distName} الآن` : `Visit ${distName} Today`}
                        </h4>
                        <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed italic">
                            {isAr ? `نحن نساعدك في المقارنة بين أفضل الكمبوندات في حي ${distName} للوصول لأفضل سعر استثماري مجاناً.` : `We assist you in comparing top-tier compounds in ${distName} to secure the best ROI, 100% free.`}
                        </p>
                        
                        <div className="space-y-4">
                            <a href={whatsappUrl} 
                               target="_blank" rel="noopener noreferrer"
                               aria-label="Contact via WhatsApp"
                               className="flex items-center justify-center gap-4 w-full py-6 bg-[#25D366] hover:bg-[#1eb954] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95">
                                <MessageCircle size={24} fill="currentColor" /> WhatsApp
                            </a>
                            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                               aria-label="Direct Phone Call"
                               className="flex items-center justify-center gap-4 w-full py-6 bg-white text-slate-950 hover:bg-[#C02026] hover:text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95">
                                <Phone size={24} fill="currentColor" /> {isAr ? 'اتصل الآن' : 'Call Sales'}
                            </a>
                        </div>
                    </div>
                </section>
            </aside>
        </div>

        {/* 4. CROSS-SELLING SECTION (Projects in Parent Location) */}
        {locationProjects.length > 0 && (
          <section className="pt-32 border-t border-slate-100" aria-labelledby="related-heading">
            <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 border-s-[12px] border-slate-200 ps-8 gap-8 text-start">
                <div className="space-y-4">
                    <h2 id="related-heading" className="text-4xl md:text-7xl font-black text-slate-950 italic uppercase tracking-tighter leading-none">
                        {isAr ? `أبرز مشاريع ${parentLocName}` : `Top in ${parentLocName}`}
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm font-black uppercase tracking-[0.3em] italic">
                        {isAr ? `فرص إضافية استثمارية في ${parentLocName} بالكامل` : `Premium investment picks across the entire ${parentLocName} area`}
                    </p>
                </div>
                <Link href={`/${lang}/locations/${district.location.slug}/`} className="bg-slate-900 text-white hover:bg-[#C02026] px-10 py-5 rounded-[2rem] transition-all font-black text-[11px] uppercase tracking-widest shadow-2xl group shrink-0">
                    {isAr ? 'كل المشاريع' : 'All Projects'} <ArrowUpRight size={18} className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14" role="list">
              {locationProjects.map((proj: any) => (
                <article key={proj._id} role="listitem">
                  <ProjectCard data={proj} lang={lang} />
                </article>
              ))}
            </div>
          </section>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
        .animate-slow-zoom { animation: slow-zoom 40s linear infinite alternate; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}