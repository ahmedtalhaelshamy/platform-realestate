import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { MapPin, ArrowRight, ArrowLeft, Building2, Globe, Phone } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

/**
 * 🛠️ دالة الأمان لمنع خطأ الـ Objects
 */
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map((child) => child.text).join('')).join(' ');
  }
  if (typeof val === 'object' && val.children) {
    return val.children.map((child) => child.text).join('');
  }
  return String(val);
};

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

/**
 * 🔍 SEO Metadata: Optimized for Geo-Search
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const query = `*[_type == "siteSettings"][0]{
    locationsSeo {
      metaTitleAr, metaTitleEn,
      metaDescAr, metaDescEn,
      openGraphImage
    }
  }`;
  const settings = await client.fetch(query);
  const seo = settings?.locationsSeo;

  const title = getSafeText(isAr 
    ? (seo?.metaTitleAr || 'تصفح كل المناطق الاستثمارية في مصر') 
    : (seo?.metaTitleEn || 'Browse Investment Locations in Egypt'));

  const description = getSafeText(isAr 
    ? (seo?.metaDescAr || 'دليلك الشامل لأفضل المناطق الاستثمارية والسكنية في القاهرة الجديدة، العاصمة الإدارية، والساحل الشمالي.') 
    : (seo?.metaDescEn || 'Your comprehensive guide to top investment locations including New Cairo, NAC, and North Coast.'));

  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).format('webp').url()
    : `${BASE_URL}/og-image.jpg`;

  return {
    title: `${title} | Platform`,
    description: description.substring(0, 160),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${lang}/locations/`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${lang}/locations/`,
      images: [{ url: ogImageUrl }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    },
  };
}

export default async function LocationsIndexPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  // 🚀 تطوير الـ Query لجلب المناطق + أحدث المقالات العقارية
  const query = `{
    "locations": *[_type == "location"] | order(order asc) {
      _id, nameAr, nameEn,
      "slug": slug.current,
      image,
      "projectsCount": count(*[_type == "project" && !(_id in path("drafts.**")) && (references(^._id) || district->location._ref == ^._id)])
    },
    "latestPosts": *[_type == "post" && language == $lang] | order(_createdAt desc)[0...3] {
      title,
      "slug": slug.current,
      mainImage,
      overview,
      _createdAt
    }
  }`;

  const { locations, latestPosts } = await client.fetch(query, { lang }, { next: { revalidate: 3600 } });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isAr ? "المناطق العقارية في مصر" : "Real Estate Locations in Egypt",
    "itemListElement": locations.map((loc, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${BASE_URL}/${lang}/locations/${loc.slug}/`
    }))
  };

  const breadcrumbItems = [
    { label: isAr ? 'المناطق العقارية' : 'The Hotspots', href: `/${lang}/locations/` }
  ];

  return (
    <main 
      className={`min-h-screen bg-white selection:bg-[#C02026] selection:text-white overflow-x-hidden ${isAr ? 'font-almarai' : 'font-jakarta'}`} 
      dir={isAr ? 'rtl' : 'ltr'}
    >       
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center bg-brand-dark overflow-hidden pt-24">
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent z-10" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-red via-transparent to-transparent animate-pulse pointer-events-none z-10" />
        
        <div className="relative z-30 text-center px-6 max-w-5xl animate-fade-in-up">
            <div className="flex justify-center mb-12">
               <Breadcrumbs items={breadcrumbItems} lang={lang} />
            </div>
            <h1 id="hero-heading" className={`text-5xl md:text-8xl lg:text-[10rem] font-black text-white mb-8 uppercase leading-[1.1] md:leading-[0.9] drop-shadow-2xl ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
                {isAr ? 'خريطة الاستثمار' : 'Prime Hotspots'}
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl font-bold max-w-3xl mx-auto leading-relaxed opacity-80 mb-12">
                {isAr 
                  ? 'اكتشف وجهاتنا العقارية المختارة بعناية، حيث تلتقي الفخامة بأعلى عوائد الاستثمار في السوق المصري.' 
                  : 'Discover handpicked destinations where elite luxury meets the highest ROI in Egypt.'}
            </p>

            {/* ✅ زرار الاتصال المطور والمصحح 100% */}
            <div className="flex justify-center mt-10 relative z-50">
              <a 
                href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                className="flex items-center gap-4 bg-[#C02026] text-white hover:bg-white hover:text-black border-2 border-[#C02026] px-10 py-5 rounded-[2rem] font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 shadow-2xl active:scale-95 group cursor-pointer"
              >
                <Phone size={22} fill="currentColor" className="text-white group-hover:text-black group-hover:animate-bounce transition-colors" />
                <span className="text-white group-hover:text-black">{isAr ? 'تواصل مع مستشار عقاري' : 'Call Investment Expert'}</span>
              </a>
            </div>
        </div>
      </section>

      {/* ================= LOCATIONS GRID ================= */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-24 md:py-40">
        {locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
            {locations.map((loc, index) => {
              const locName = isAr ? getSafeText(loc.nameAr) : getSafeText(loc.nameEn);
              return (
                <Link 
                  key={loc._id} 
                  href={`/${lang}/locations/${loc.slug}/`}
                  className="group relative h-[500px] md:h-[650px] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-xl transition-all duration-700 block bg-slate-100 hover:-translate-y-4 hover:shadow-premium outline-none focus-visible:ring-4 focus-visible:ring-brand-red/20"
                >
                  {loc.image ? (
                    <Image 
                      src={urlFor(loc.image).format('webp').quality(80).url()} 
                      alt={locName} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-[3s] ease-out will-change-transform"
                      priority={index < 3} 
                    />
                  ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                          <MapPin size={64} className="text-slate-200" />
                      </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />

                  <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14 z-20 text-start">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 bg-brand-red text-white px-5 py-2 rounded-2xl shadow-xl group-hover:bg-white group-hover:text-brand-red transition-all duration-500">
                            <Building2 size={16} className="animate-pulse" />
                            <span className="text-[11px] font-black uppercase tracking-widest">
                                {loc.projectsCount} {isAr ? 'مشروع متاح' : 'Active Assets'}
                            </span>
                        </div>
                        
                        <h2 className={`text-4xl md:text-6xl font-black text-white uppercase leading-[1.1] transition-colors ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
                            {locName}
                        </h2>
                        
                        <div className="flex items-center gap-3 text-white/70 text-[10px] font-black uppercase tracking-[0.4em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100">
                            {isAr ? 'اكتشف المنطقة' : 'Explore territory'} 
                            {isAr ? <ArrowLeft size={18} className="animate-bounce-x" /> : <ArrowRight size={18} className="animate-bounce-x" />}
                        </div>
                      </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-40 bg-brand-gray-50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <Globe size={64} className="mx-auto text-slate-300 mb-8 animate-spin-slow" />
             <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-widest">
                {isAr ? 'جاري تحديث الخريطة...' : 'Synchronizing Data...'}
             </h2>
          </div>
        )}
      </section>

      {/* 📰 ✅ قسم أحدث التقارير والمقالات العقارية (سيو ذهبي) */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="bg-slate-950 py-32 md:py-48 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C02026]/10 rounded-full blur-[150px] -mr-64 -mt-64" />
          
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
            <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-20 gap-8 text-start border-s-[12px] border-[#C02026] ps-8">
               <div>
                  <h2 className={`text-4xl md:text-7xl font-black text-white uppercase leading-none ${isAr ? '' : 'italic tracking-tighter'}`}>
                    {isAr ? 'بوصلة السوق' : 'Market Intel'}
                  </h2>
                  <p className="text-slate-400 font-bold text-sm md:text-lg mt-4 max-w-xl">
                    {isAr ? 'تقارير حصرية من خبراء بلاتفورم حول أحدث تطورات المناطق العقارية في مصر.' : 'Exclusive insights from Platform experts on the latest real estate trends in Egypt.'}
                  </p>
               </div>
               <Link 
                href={`/${lang}/blog/`}
                className="bg-white text-slate-950 hover:bg-[#C02026] hover:text-white px-10 py-5 rounded-[2rem] transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl group shrink-0"
               >
                 {isAr ? 'كل المقالات' : 'Explore Blog'} <ArrowRight size={18} className="inline-block group-hover:translate-x-2 transition-transform rtl:rotate-180" />
               </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {latestPosts.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/${lang}/blog/${post.slug}/`}
                  className="group flex flex-col h-full bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {post.mainImage && (
                      <Image 
                        src={urlFor(post.mainImage).width(600).auto('format').url()} 
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                    )}
                  </div>
                  <div className="p-10 flex flex-col flex-1 text-start">
                    <span className="text-[10px] font-black text-[#C02026] uppercase tracking-[0.3em] mb-4 block">
                      {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#C02026] transition-colors leading-tight italic uppercase">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed">
                      {post.overview}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.1); }
        .animate-bounce-x { animation: bounceX 2s infinite ease-in-out; }
        @keyframes bounceX { 
          0%, 100% { transform: translateX(0); } 
          50% { transform: translateX(${isAr ? '-10px' : '10px'}); } 
        }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </main>
  );
}