import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { MapPin, Building2, Info, Phone, MessageCircle, Sparkles, ArrowUpRight, ArrowRight, Cpu, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ PERFORMANCE & CACHING
export const dynamic = 'force-static';
export const revalidate = 3600; 

const BASE_URL = 'https://platformrealestate.co';

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';
  
  const district = await client.fetch(
    `*[_type == "district" && slug.current == $slug][0]{
      nameAr, nameEn, seoTitleAr, seoTitleEn, seoDescAr, seoDescEn, image
    }`, 
    { slug }
  );
  
  if (!district) return { title: { absolute: isAr ? 'الحي غير موجود' : 'District Not Found' } };
  
  const name = isAr ? getSafeText(district.nameAr) : getSafeText(district.nameEn);
  const title = getSafeText(isAr ? (district.seoTitleAr || name) : (district.seoTitleEn || name));
  const description = getSafeText(isAr ? district.seoDescAr : district.seoDescEn);

  const ogImage = district.image 
    ? urlFor(district.image).url()
    : `${BASE_URL}/og-image.jpg`;

  const currentPath = `${BASE_URL}/${lang}/districts/${slug}/`;

  return {
    title: { absolute: title },
    description: description.substring(0, 160) || (isAr 
      ? `استكشف أفضل العقارات والمشاريع في ${name}. مقارنة أسعار وأنظمة سداد.` 
      : `Explore top projects in ${name}. Compare prices and plans.`),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar': `${BASE_URL}/ar/districts/${slug}/`,
        'en': `${BASE_URL}/en/districts/${slug}/`,
        'x-default': `${BASE_URL}/ar/districts/${slug}/`
      }
    },
    openGraph: {
      title,
      description,
      url: currentPath,
      images: [{ url: ogImage, width: 1200, height: 630 }],
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
      _id, nameAr, nameEn, descriptionAr, descriptionEn, image, aiSummaryAr, aiSummaryEn, faqs,
      "location": location->{_id, nameAr, nameEn, "slug": slug.current},
      "projects": *[_type == "project" && references(^._id) && !(_id in path("drafts.**"))] | order(isNewLaunch desc, _createdAt desc) {
        _id, titleAr, titleEn, price, installments, downPayment, 
        isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage, 
        "developer": developer->{nameAr, nameEn},
        "districtData": district->{ nameAr, nameEn },
        "locationData": location->{ nameAr, nameEn }
      },
      "relatedPosts": *[_type == "post" && language == $lang && (references(^._id) || references(string::split(^._id, "drafts.")[1]))] | order(_createdAt desc)[0...3] {
        title, "slug": slug.current, mainImage, overview, _createdAt
      }
    }
  }`;

  const data = await client.fetch(query, { slug, lang });
  if (!data?.district) return notFound();

  const { district } = data;
  const distName = isAr ? getSafeText(district.nameAr) : getSafeText(district.nameEn);
  const parentLocName = isAr ? getSafeText(district.location.nameAr) : getSafeText(district.location.nameEn);
  const aiSummary = isAr ? district.aiSummaryAr : district.aiSummaryEn;

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

  const currentPath = `${BASE_URL}/${lang}/districts/${slug}/`;
  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? `استفسار عن العقارات في حي ${distName}` : `Property inquiry in ${distName} District`)}`;

  // ✅ [AEO & GEO] بناء الـ Schema المشتركة (Place + FAQPage)
  const faqList = district.faqs?.map((faq: any) => ({
    '@type': 'Question',
    'name': isAr ? faq.questionAr : faq.questionEn,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': isAr ? faq.answerAr : faq.answerEn
    }
  })).filter((q: any) => q.name && q.acceptedAnswer.text) || [];

  const graphElements: any[] = [
    {
      "@type": "Place",
      "@id": `${currentPath}#place`,
      "name": distName,
      "description": getSafeText(isAr ? district.descriptionAr : district.descriptionEn).substring(0, 200) || distName,
      "url": currentPath,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": distName,
        "addressRegion": parentLocName,
        "addressCountry": "EG"
      },
      "containedInPlace": {
        "@type": "Place",
        "name": parentLocName,
        "url": `${BASE_URL}/${lang}/locations/${district.location.slug}/`
      }
    }
  ];

  if (faqList.length > 0) {
    graphElements.push({
      '@type': 'FAQPage',
      '@id': `${currentPath}#faq`,
      'mainEntity': faqList
    });
  }

  return (
    <main className={`min-h-screen bg-white selection:bg-[#C02026] selection:text-white overflow-x-hidden ${isAr ? 'font-almarai' : 'font-jakarta'}`} dir={isAr ? 'rtl' : 'ltr'}>       
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graphElements }) }} />
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[55vh] md:h-[70vh] w-full bg-brand-dark overflow-hidden">
        {district.image ? (
        <Image 
          src={urlFor(district.image).url()} 
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
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center z-20 max-w-7xl mx-auto">
            <nav className="mb-12 flex justify-center"><Breadcrumbs items={breadcrumbItems} lang={lang} /></nav>
            <h1 className={`text-5xl md:text-[8rem] lg:text-[10rem] font-black mb-8 uppercase leading-[1.1] md:leading-[0.9] drop-shadow-2xl ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>{distName}</h1>
            <div className="inline-flex items-center gap-3 bg-brand-red text-white px-6 py-3 rounded-2xl shadow-xl border border-white/10">
                <MapPin size={18} aria-hidden="true" />
                <span className="text-xs font-black uppercase tracking-widest">{parentLocName}</span>
            </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-24 space-y-32">
        
        {/* ✅ [GEO]: AI Quick Facts Section */}
        {aiSummary && aiSummary.length > 0 && (
          <section className="bg-brand-gray-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 relative overflow-hidden -mt-20 z-30 shadow-premium">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-[80px]" />
             <div className="flex items-center gap-4 mb-8">
               <Cpu className="text-brand-red w-10 h-10" />
               <h3 className="font-black text-2xl md:text-3xl italic uppercase tracking-wider text-brand-dark">{isAr ? `نظرة سريعة على ${distName}` : `${distName} Highlights`}</h3>
             </div>
             <ul className="grid md:grid-cols-2 gap-6">
               {aiSummary.map((point: string, i: number) => (
                 <li key={i} className="flex gap-4 text-slate-700 font-bold text-lg items-center">
                   <CheckCircle2 size={24} className="text-[#C02026] shrink-0" /><span>{point}</span>
                 </li>
               ))}
             </ul>
          </section>
        )}

        {/* 2. DISTRICT PROJECTS GRID */}
        <section id="projects-grid">
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-s-[12px] border-brand-red ps-8 text-start">
              <div>
                <span className="text-brand-red font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">{isAr ? 'نتائج البحث في الحي' : 'District Inventory'}</span>
                <h2 className={`text-4xl md:text-7xl font-black text-brand-dark uppercase leading-none ${isAr ? '' : 'italic tracking-tighter'}`}>
                    {isAr ? `مشاريع ${distName}` : `${distName} Portfolio`}
                </h2>
              </div>
              <div className="bg-brand-gray-50 px-8 py-5 rounded-[2rem] shadow-inner border border-slate-100 font-black text-brand-dark italic uppercase text-xs md:text-sm tracking-widest">
                {district.projects.length} {isAr ? 'عقارات متاحة' : 'Units Listed'}
              </div>
          </header>
          
          {district.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {district.projects.map((proj: any, index: number) => (
                <div key={proj._id} className="animate-fade-in-up">
                  <ProjectCard data={proj} lang={lang} isPriority={index < 3} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-brand-gray-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                <Building2 size={64} className="mx-auto text-slate-300 mb-8 animate-pulse" />
                <p className="text-slate-500 font-black text-xl uppercase tracking-widest">{isAr ? 'جاري إضافة مشاريع جديدة لهذا الحي' : 'Inventory coming soon.'}</p>
            </div>
          )}
        </section>

        {/* 3. CONTENT & SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
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
                    <div className="prose prose-xl prose-slate max-w-none prose-p:leading-relaxed prose-p:text-justify prose-p:font-medium">
                      <PortableText value={isAr ? district.descriptionAr : district.descriptionEn} components={ptComponents} />
                    </div>
                  </section>
                )}

                {/* ✅ [AEO]: FAQs Section for AI Response Engines */}
                {district.faqs && district.faqs.length > 0 && (
                  <section className="mt-24 space-y-12" itemScope itemType="https://schema.org/FAQPage">
                     <h2 className="text-3xl md:text-5xl font-black text-brand-dark flex items-center gap-4 italic uppercase tracking-tighter leading-none text-start">
                        <HelpCircle size={40} className="text-brand-red" />
                        {isAr ? `أسئلة وأجوبة حول ${distName}` : `District Intelligence`}
                     </h2>
                     <div className="space-y-4">
                        {district.faqs.map((faq: any, i: number) => {
                          const q = isAr ? faq.questionAr : faq.questionEn;
                          const a = isAr ? faq.answerAr : faq.answerEn;
                          if (!q || !a) return null;
                          return (
                            <details key={i} className="group bg-brand-gray-50 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 cursor-pointer text-start transition-all" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                              <summary className="flex justify-between items-center font-black text-lg md:text-xl outline-none uppercase italic text-brand-dark">
                                <span itemProp="name">{q}</span>
                                <span className="text-brand-red group-open:rotate-180 transition-transform"><ChevronDown size={24}/></span>
                              </summary>
                              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer" className="mt-6 text-slate-600 font-medium leading-relaxed border-t border-slate-200 pt-6">
                                <p itemProp="text">{a}</p>
                              </div>
                            </details>
                          );
                        })}
                     </div>
                  </section>
                )}
            </article>

            <aside className="lg:col-span-4 lg:sticky lg:top-32 order-1 lg:order-2">
                <section className="bg-brand-dark rounded-[4rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border-b-[16px] border-brand-red group text-start">
                    <div className="absolute -top-16 -end-16 opacity-10 group-hover:rotate-12 transition-transform duration-[2s] pointer-events-none">
                        <Building2 size={350} />
                    </div>
                    
                    <div className="relative z-10">
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
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-center gap-4 w-full py-6 bg-[#25D366] hover:bg-[#1eb954] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95">
                                 <MessageCircle size={24} fill="currentColor" /> WhatsApp Advisor
                            </a>
                            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                               className="flex items-center justify-center gap-4 w-full py-6 bg-[#C02026] text-white hover:bg-white hover:text-black border-2 border-[#C02026] rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95">
                                 <Phone size={24} fill="currentColor" /> {isAr ? 'اتصل الآن' : 'Call Sales'}
                            </a>
                        </div>
                    </div>
                </section>
            </aside>
        </div>


        {/* 4. REGIONAL CROSS-SELLING */}
        {locationProjects.length > 0 && (
          <section className="pt-32 border-t border-slate-100">
            <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 border-s-[12px] border-slate-200 ps-8 gap-8 text-start">
                <div className="space-y-4">
                    <h2 className={`text-4xl md:text-7xl font-black text-brand-dark uppercase leading-none ${isAr ? '' : 'italic tracking-tighter'}`}>
                        {isAr ? `أبرز مشاريع ${parentLocName}` : `More in ${parentLocName}`}
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest italic">
                        {isAr ? `فرص إضافية استثمارية مختارة في ${parentLocName} بالكامل` : `Regional investment picks across the entire ${parentLocName} area`}
                    </p>
                </div>
                <Link href={`/${lang}/locations/${district.location.slug}/`} className="bg-brand-dark text-white hover:bg-brand-red px-10 py-5 rounded-[2rem] transition-all font-black text-[11px] uppercase tracking-widest shadow-premium group shrink-0">
                    {isAr ? 'كل المشاريع' : 'All Listings'} <ArrowUpRight size={18} className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
              {locationProjects.map((proj: any) => (
                <div key={proj._id}>
                  <ProjectCard data={proj} lang={lang} isPriority={false} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. AREA INSIGHTS */}
        {district.relatedPosts && district.relatedPosts.length > 0 && (
          <section className="pt-32 border-t border-slate-100">
            <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 border-s-[12px] border-[#C02026] ps-8 gap-8 text-start">
                <div>
                  <h2 className={`text-4xl md:text-7xl font-black text-slate-950 uppercase leading-none ${isAr ? '' : 'italic tracking-tighter'}`}>
                    {isAr ? `أخبار ${distName}` : `${distName} Reports`}
                  </h2>
                  <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-4">
                    {isAr ? 'آخر التطورات والتحليلات العقارية في المنطقة' : 'Latest updates and market analysis for this area'}
                  </p>
                </div>
                <Link href={`/${lang}/blog/`} className="bg-brand-dark text-white hover:bg-[#C02026] px-10 py-5 rounded-[2rem] transition-all font-black text-[11px] uppercase tracking-widest shadow-premium group shrink-0">
                  {isAr ? 'كل المقالات' : 'All Reports'} <ArrowRight size={18} className="inline-block group-hover:translate-x-2 transition-transform rtl:rotate-180" />
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {district.relatedPosts.map((post: any) => (
                <Link key={post.slug} href={`/${lang}/blog/${post.slug}/`} className="group flex flex-col h-full bg-slate-50 rounded-[3rem] overflow-hidden border border-transparent hover:bg-white hover:shadow-premium transition-all duration-500">
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-200">
                    <Image 
                      src={urlFor(post.mainImage).url()} 
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-10 flex flex-col flex-1 text-start">
                    <span className="text-[10px] font-black text-[#C02026] uppercase tracking-widest mb-4 block">
                      {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#C02026] transition-colors leading-tight italic uppercase">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
        .animate-slow-zoom { animation: slow-zoom 40s linear infinite alternate; }
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </main>
  );
}