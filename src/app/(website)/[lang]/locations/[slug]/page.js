import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';
import { MapPin, ArrowRight, LayoutGrid, Phone, MessageCircle, Info, Building2, Sparkles, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CONTACT_INFO } from '@/components/constants/contact';

// 🏁 الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

// ✅ 1. توليد المسارات الثابتة (SSG)
export async function generateStaticParams() {
  const query = `*[_type == "location" && defined(slug.current)]{ "slug": slug.current }`;
  const locations = await client.fetch(query);
  
  return locations.flatMap((loc) => [
    { lang: 'ar', slug: loc.slug },
    { lang: 'en', slug: loc.slug },
  ]);
}

export const revalidate = 60; 

/**
 * ✅ 2. الـ SEO Metadata (الربط الدولي ومنع التكرار)
 */
export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  const data = await client.fetch(
    `*[_type == "location" && slug.current == $slug][0]{ nameAr, nameEn, seoTitleAr, seoTitleEn, seoDescAr, seoDescEn }`,
    { slug }
  );

  if (!data) return { title: 'Location Not Found' };

  const name = isAr ? data.nameAr : data.nameEn;
  const title = isAr ? (data.seoTitleAr || name) : (data.seoTitleEn || name);
  const description = isAr ? data.seoDescAr : data.seoDescEn;

  // روابط اللغات المتقاطعة
  const arPath = `${BASE_URL}/ar/locations/${slug}/`;
  const enPath = `${BASE_URL}/en/locations/${slug}/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${title} | Platform Real Estate`,
    description: description || (isAr ? `اكتشف أفضل العقارات في ${name}` : `Discover best properties in ${name}`),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar-EG': arPath,
        'en-US': enPath,
        'x-default': arPath,
      },
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
const ptComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-black mt-12 mb-6 text-slate-900 border-s-4 border-[#C02026] ps-4 leading-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-slate-800">{children}</h3>,
    normal: ({ children }) => <p className="text-base md:text-lg text-slate-600 leading-9 mb-6 text-justify font-medium">{children}</p>,
  },
};

export default async function LocationDetailPage({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  const query = `{
    "locationData": *[_type == "location" && slug.current == $slug][0]{
      _id, nameAr, nameEn, descriptionAr, descriptionEn, image
    },
    "districts": *[_type == "district" && location->slug.current == $slug] | order(order asc) {
      _id, nameAr, nameEn, "slug": slug.current, image,
      "projects": *[_type == "project" && references(^._id)] | order(isNewLaunch desc, _createdAt desc) { 
          _id, titleAr, titleEn, price, installments, downPayment, 
          isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage, 
          "developer": developer->{nameAr, nameEn},
          "location": location->{nameAr, nameEn}
      }
    },
    "generalProjects": *[_type == "project" && location->slug.current == $slug && !defined(district)] | order(_createdAt desc)[0...6] {
       _id, titleAr, titleEn, price, installments, downPayment, 
       isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage,
       "developer": developer->{nameAr, nameEn}
    }
  }`;

  const data = await client.fetch(query, { slug });
  if (!data?.locationData) return notFound();

  const { locationData, districts, generalProjects } = data;
  const locName = isAr ? locationData.nameAr : locationData.nameEn;

  const breadcrumbItems = [
    { label: isAr ? 'المناطق' : 'Locations', href: `/${lang}/locations/` },
    { label: locName }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[45vh] md:h-[55vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {locationData.image && (
          <Image 
            src={urlFor(locationData.image).width(1920).url()} 
            alt={locName} fill className="object-cover opacity-60 scale-105 animate-slow-zoom" priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-black/20 to-black/60 z-10" />
        
        <div className="relative z-20 text-center text-white px-4">
          <nav className="mb-6 flex justify-center"><Breadcrumbs items={breadcrumbItems} lang={lang} /></nav>
          <div className="inline-flex items-center gap-2 bg-[#C02026] px-4 py-1 rounded-full mb-6 shadow-2xl">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? 'فرص استثمارية حصرية' : 'Exclusive Opportunities'}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-4 drop-shadow-2xl italic uppercase tracking-tighter leading-none">
            {locName}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-30">
        
        {/* 2. PREMIUM DISTRICTS NAV */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 -mt-24 mb-24">
          {districts.map((dist) => (
            <Link key={dist._id} href={`/${lang}/districts/${dist.slug}/`} 
                  className="group flex flex-col items-center gap-4">
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full p-1 bg-white shadow-2xl transition-all duration-500 group-hover:ring-4 group-hover:ring-[#C02026] group-hover:scale-110 overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {dist.image ? (
                    <Image src={urlFor(dist.image).width(200).url()} fill alt={dist.nameEn} className="object-cover" />
                  ) : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><LayoutGrid size={32} /></div>}
                </div>
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 bg-white px-3 py-1 rounded-full shadow-sm group-hover:bg-[#C02026] group-hover:text-white transition-colors">
                {isAr ? dist.nameAr : dist.nameEn}
              </span>
            </Link>
          ))}
        </div>

        {/* 3. MAIN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-32">
            
            {districts.map((district) => (
              district.projects && district.projects.length > 0 && (
                <section key={district._id} id={district.slug} className="scroll-mt-28">
                  <div className="flex items-end justify-between mb-12 border-s-8 border-[#C02026] ps-6">
                    <div>
                      <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter">
                        {isAr ? `مشاريع ${district.nameAr}` : `${district.nameEn} Projects`}
                      </h2>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
                        {isAr ? `استكشف أفضل الوحدات في ${district.nameAr}` : `Top Units in ${district.nameEn}`}
                      </p>
                    </div>
                    <Link href={`/${lang}/districts/${district.slug}/`} className="hidden md:flex items-center gap-2 text-[#C02026] font-black text-[10px] uppercase tracking-widest hover:underline">
                      {isAr ? 'عرض الكل' : 'View All'} <ArrowRight size={14} className={isAr ? 'rotate-180' : ''} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {district.projects.map((project) => (
                      <ProjectCard key={project._id} data={project} lang={lang} />
                    ))}
                  </div>
                </section>
              )
            ))}

            {generalProjects.length > 0 && (
              <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100">
                <h2 className="text-3xl font-black mb-12 text-slate-900 italic uppercase">
                  {isAr ? `أحدث الفرص في ${locName}` : `Global Opportunities in ${locName}`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {generalProjects.map((project) => (
                    <ProjectCard key={project._id} data={project} lang={lang} />
                  ))}
                </div>
              </section>
            )}

            {(locationData.descriptionAr || locationData.descriptionEn) && (
              <section className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-50">
                <div className="flex items-center gap-3 mb-10 text-[#C02026]">
                    <Info size={32} />
                    <h4 className="text-2xl font-black uppercase tracking-tighter">{isAr ? 'دليل الاستثمار العقاري' : 'Investment Guide'}</h4>
                </div>
                <article className="prose prose-lg prose-slate max-w-none prose-img:rounded-[2rem]">
                  <PortableText 
                    value={isAr ? locationData.descriptionAr : locationData.descriptionEn} 
                    components={ptComponents} 
                  />
                </article>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-8">
                <div className="bg-[#111827] text-white p-10 rounded-[3rem] shadow-2xl border-b-[12px] border-[#C02026] relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                        <Building2 size={250} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-[#C02026] px-3 py-1 rounded-full text-[9px] font-black uppercase mb-8">
                            <CheckCircle size={12} /> {isAr ? 'مستشار عقاري معتمد' : 'Verified Consultant'}
                        </div>
                        <h3 className="text-3xl font-black mb-6 leading-tight italic uppercase tracking-tighter">
                            {isAr ? `محتاج مساعدة في ${locName}؟` : `Need help in ${locName}?`}
                        </h3>
                        <p className="text-slate-400 text-sm mb-10 font-medium leading-relaxed">
                            {isAr 
                                ? `نحن نساعدك في مقارنة الأسعار واختيار أفضل نظام سداد في المنطقة مجاناً .` 
                                : `We help you compare prices and choose the best payment plan for free.`}
                        </p>

                        <div className="space-y-4">
                            <a href={`https://wa.me/${CONTACT_INFO.whatsapp?.replace(/\D/g,'')}`} 
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-5 bg-[#25D366] hover:bg-[#1eb954] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform hover:scale-105 shadow-xl">
                                <MessageCircle size={20} /> WhatsApp
                            </a>
                            <a href={`tel:${CONTACT_INFO.phone}`} 
                                className="flex items-center justify-center gap-3 w-full py-5 bg-white text-slate-900 hover:bg-[#C02026] hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform hover:scale-105 shadow-xl">
                                <Phone size={20} /> {isAr ? 'اتصل الآن' : 'Call Sales'}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h5 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">{isAr ? 'تصفح حسب الحي' : 'Browse by District'}</h5>
                    <div className="flex flex-wrap gap-2">
                        {districts.map(d => (
                            <Link key={d._id} href={`/${lang}/districts/${d.slug}/`} className="px-4 py-2 bg-slate-50 hover:bg-[#C02026] hover:text-white rounded-xl text-[11px] font-bold text-slate-600 transition-all">
                                {isAr ? d.nameAr : d.nameEn}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}