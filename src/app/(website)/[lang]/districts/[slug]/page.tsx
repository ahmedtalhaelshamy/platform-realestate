import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { MapPin, Building2, Info, Phone, MessageCircle, Sparkles, ArrowUpRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ PERFORMANCE & CACHING
export const dynamic = 'force-static';
export const revalidate = 3600; 

const BASE_URL = 'https://platformrealestate.co';

/**
 * 🛠️ دالة الأمان لمنع خطأ الـ Objects
 */
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
    return [];
  }
}

/**
 * 🔍 SEO Metadata: Optimized for Local Neighborhood Search
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';
  
  const district = await client.fetch(
    `*[_type == "district" && slug.current == $slug][0]{
      nameAr, nameEn, seoTitleAr, seoTitleEn, seoDescAr, seoDescEn, image
    }`, 
    { slug }
  );
  
  if (!district) return { title: 'District Not Found' };
  
  const name = isAr ? getSafeText(district.nameAr) : getSafeText(district.nameEn);
  const title = getSafeText(isAr ? (district.seoTitleAr || name) : (district.seoTitleEn || name));
  const description = getSafeText(isAr ? district.seoDescAr : district.seoDescEn);

  const ogImage = district.image 
    ? urlFor(district.image).width(1200).height(630).format('webp').url()
    : `${BASE_URL}/og-image.jpg`;

  const currentPath = `${BASE_URL}/${lang}/districts/${slug}/`;

  return {
    title: `${title} | Platform`,
    description: description.substring(0, 160) || (isAr 
      ? `استكشف أفضل العقارات والمشاريع في ${name}. مقارنة أسعار وأنظمة سداد.` 
      : `Explore top projects in ${name}. Compare prices and plans.`),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
    },
    openGraph: {
      title,
      description,
      url: currentPath,
      images: [{ url: ogImage }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

const ptComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl md:text-4xl font-black mt-16 mb-8 text-brand-dark border-s-8 border-brand-red ps-6 uppercase leading-none">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-black mt-10 mb-5 text-slate-800 uppercase tracking-tight">{children}</h3>,
    normal: ({ children }) => <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6 text-justify font-medium">{children}</p>,
  },
};

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

  // مشاريع في نفس المنطقة الكبرى (Cross-selling logic)
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
    { label: isAr ? 'المناطق' : 'The Hotspots', href: `/${lang}/locations/` },
    { label: parentLocName, href: `/${lang}/locations/${district.location.slug}/` },
    { label: distName }
  ];

  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? `استفسار عن العقارات في ${distName}` : `Property inquiry in ${distName} District`)}`;

  // ✅ SEO: بيانات منظمة متقدمة (Accommodation/Place)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": distName,
    "description": isAr ? `دليل الاستثمار والمشاريع في ${distName}` : `Investment hub in ${distName} district`,
    "url": `${BASE_URL}/${lang}/districts/${slug}/`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": distName,
      "addressRegion": parentLocName,
      "addressCountry": "EG"
    }
  };

  return (
    <main className={`min-h-screen bg-white ${isAr ? 'font-almarai' : 'font-jakarta'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      
      {/* 1. HERO SECTION - Optimized for Visual Impact */}
      <section className="relative h-[55vh] md:h-[70vh] w-full bg-brand-dark overflow-hidden">
        {district.image ? (
          <Image 
            src={urlFor(district.image).width(1920).format('webp').quality(80).url()} 
            alt={distName} 
            fill 
            sizes="100vw"
            className="object-cover opacity-50 scale-105 animate-slow-zoom will-change-transform" 
            priority 
          />
        ) : (
          <div className="absolute inset-0 bg-brand-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-brand-dark/20 to-brand-dark/60 z-10" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center z-20 max-w-7xl mx-auto animate-fade-in-up">
            <nav className="mb-12 flex justify-center"><Breadcrumbs items={breadcrumbItems} lang={lang} /></nav>
            <h1 className={`text-5xl md:text-[8rem] lg:text-[10rem] font-black mb-8 uppercase leading-[1.1] md:leading-[0.9] drop-shadow-2xl ${isAr ? 'tracking-normal px-4' : 'italic tracking-tighter'}`}>{distName}</h1>
            <div className="inline-flex items-center gap-3 bg-brand-red text-white px-6 py-3 rounded-2xl shadow-xl border border-white/10">
                <MapPin size={18} aria-hidden="true" />
                <span className="text-xs font-black uppercase tracking-widest">{parentLocName}</span>
            </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-24 space-y-32">
        
        {/* 2. SPECIFIC DISTRICT PROJECTS GRID */}
        <section id="projects-grid" aria-labelledby="grid-heading">
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-s-[12px] border-brand-red ps-8 text-start">
              <div>
                <span className="text-brand-red font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">{isAr ? 'نتائج البحث في الحي' : 'District Inventory'}</span>
                <h2 id="grid-heading" className={`text-4xl md:text-7xl font-black text-brand-dark uppercase leading-none ${isAr ? '' : 'italic tracking-tighter'}`}>
                    {isAr ? `مشاريع ${distName}` : `${distName} Portfolio`}
                </h2>
              </div>
              <div className="bg-brand-gray-50 px-8 py-5 rounded-[2rem] shadow-inner border border-slate-100 font-black text-brand-dark italic uppercase text-xs md:text-sm tracking-widest">
                {district.projects.length} {isAr ? 'عقارات متاحة' : 'Units Listed'}
              </div>
          </header>
          
          {district.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12" role="list">
              {district.projects.map((proj: any, index: number) => (
                <div key={proj._id} role="listitem" className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* ✅ تم تعديل isPriority إلى priority هنا */}
                  <ProjectCard data={proj} lang={lang} priority={index < 3} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-brand-gray-50 rounded-[4rem] border-2 border-dashed border-slate-200" role="status">
                <Building2 size={64} className="mx-auto text-slate-300 mb-8 animate-pulse" aria-hidden="true" />
                <p className="text-slate-500 font-black text-xl uppercase tracking-widest">{isAr ? 'جاري إضافة مشاريع جديدة لهذا الحي' : 'Inventory coming soon.'}</p>
            </div>
          )}
        </section>

        {/* 3. CONTENT & SIDEBAR CONVERSION HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* SEO Analytical Content Section */}
            <article className="lg:col-span-8 order-2 lg:order-1 text-start">
                {(district.descriptionAr || district.descriptionEn) && (
                  <section className="bg-white p-10 md:p-20 rounded-[4rem] shadow-premium border border-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 end-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl -me-32 -mt-32" />
                    <div className="flex items-center gap-6 mb-12 text-brand-red">
                        <div className="p-4 bg-red-50 rounded-3xl shadow-inner"><Info size={40} strokeWidth={1.5} aria-hidden="true" /></div>
                        <h3 className={`text-3xl md:text-5xl font-black text-brand-dark uppercase leading-none ${isAr ? '' : 'italic tracking-tighter'}`}>
                            {isAr ? `دليل الاستثمار في ${distName}` : `${distName} Intel`}
                        </h3>
                    </div>
                    <div className="prose prose-xl prose-slate max-w-none 
                                    prose-headings:text-brand-dark prose-headings:font-black
                                    prose-p:leading-relaxed prose-p:text-justify prose-p:font-medium">
                      <PortableText value={isAr ? district.descriptionAr : district.descriptionEn} components={ptComponents} />
                    </div>
                  </section>
                )}
            </article>

            {/* Sticky Sidebar CTA - The Lead Machine */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 order-1 lg:order-2">
                <section className="bg-brand-dark rounded-[4rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border-b-[16px] border-brand-red group">
                    <div className="absolute -top-16 -end-16 opacity-10 group-hover:rotate-12 transition-transform duration-[2s] pointer-events-none" aria-hidden="true">
                        <Building2 size={350} />
                    </div>
                    
                    <div className="relative z-10 text-start">
                        <div className="inline-flex items-center gap-3 bg-brand-red px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase mb-10 shadow-xl border border-white/10">
                            <Sparkles size={14} className="animate-pulse" /> {isAr ? 'دعم استثماري' : 'Platinum Support'}
                        </div>
                        <h4 className={`text-3xl md:text-5xl font-black mb-8 leading-[0.95] uppercase ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
                            {isAr ? `احجز معاينتك في ${distName} مجاناً` : `Tour ${distName} with an Expert`}
                        </h4>
                        <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed italic opacity-90">
                            {isAr ? `مستشارونا متاحون لمساعدتك في مقارنة أفضل المشاريع والأسعار في حي ${distName} فوراً.` : `Compare top-tier compounds and ROI potentials in ${distName} district with our elite advisory team.`}
                        </p>
                        
                        <div className="space-y-4">
                            <a href={whatsappUrl} 
                               target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-center gap-4 w-full py-6 bg-[#25D366] hover:bg-[#1eb954] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-green-500/30">
                                <MessageCircle size={24} fill="currentColor" aria-hidden="true" /> WhatsApp Advisor
                            </a>
                            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                               className="flex items-center justify-center gap-4 w-full py-6 bg-white text-brand-dark hover:bg-brand-red hover:text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-white/20">
                                <Phone size={24} fill="currentColor" aria-hidden="true" /> {isAr ? 'اتصل الآن' : 'Call Sales'}
                            </a>
                        </div>
                    </div>
                </section>
            </aside>
        </div>

        {/* 4. CROSS-SELLING: Regional Hotshots */}
        {locationProjects.length > 0 && (
          <section className="pt-32 border-t border-slate-100" aria-labelledby="related-heading">
            <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 border-s-[12px] border-slate-200 ps-8 gap-8 text-start">
                <div className="space-y-4">
                    <h2 id="related-heading" className={`text-4xl md:text-7xl font-black text-brand-dark uppercase leading-none ${isAr ? '' : 'italic tracking-tighter'}`}>
                        {isAr ? `أبرز مشاريع ${parentLocName}` : `More in ${parentLocName}`}
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest italic">
                        {isAr ? `فرص إضافية استثمارية مختارة في ${parentLocName} بالكامل` : `Regional investment picks across the entire ${parentLocName} area`}
                    </p>
                </div>
                <Link href={`/${lang}/locations/${district.location.slug}/`} className="bg-brand-dark text-white hover:bg-brand-red px-10 py-5 rounded-[2rem] transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-premium group shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-brand-red/20">
                    {isAr ? 'كل المشاريع' : 'All Listings'} <ArrowUpRight size={18} className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
                </Link>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14" role="list">
              {locationProjects.map((proj: any) => (
                <div key={proj._id} role="listitem">
                  <ProjectCard data={proj} lang={lang} />
                </div>
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
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </main>
  );
}