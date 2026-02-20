import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { MapPin, ArrowRight, ArrowLeft, Building2, Globe } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

// ✅ دالة الأمان لمنع خطأ الـ Objects كأبناء لـ React
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  if (typeof val === 'object' && val.children) {
    return val.children.map(child => child.text).join('');
  }
  return String(val);
};

// 1. التوليد الثابت (Static Generation) لسرعة خارقة
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

// 2. Metadata: تحسين الأرشفة والروابط الدولية
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const query = `*[_type == "siteSettings"][0].locationsSeo`;
  const seo = await client.fetch(query);

  const title = getSafeText(isAr 
    ? (seo?.metaTitleAr || 'تصفح كل المناطق الاستثمارية في مصر') 
    : (seo?.metaTitleEn || 'Browse Investment Locations in Egypt'));

  const description = getSafeText(isAr 
    ? (seo?.metaDescAr || 'دليلك الشامل لأفضل المناطق الاستثمارية والسكنية في القاهرة الجديدة، العاصمة الإدارية، والساحل الشمالي.') 
    : (seo?.metaDescEn || 'Your comprehensive guide to top investment locations including New Cairo, NAC, and North Coast.'));

  return {
    title: `${title} | Platform`,
    description: description.substring(0, 160),
    alternates: {
      canonical: `${BASE_URL}/${lang}/locations/`,
      languages: {
        'ar': `${BASE_URL}/ar/locations/`,
        'en': `${BASE_URL}/en/locations/`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${lang}/locations/`,
      siteName: 'Platform Real Estate',
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    },
  };
}

export default async function LocationsIndexPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const query = `*[_type == "location"] | order(order asc) {
    _id, nameAr, nameEn,
    "slug": slug.current,
    image,
    "projectsCount": count(*[_type == "project" && !(_id in path("drafts.**")) && (references(^._id) || district->location._ref == ^._id)])
  }`;

  const locations = await client.fetch(query, {}, { next: { revalidate: 3600 } });

  const breadcrumbItems = [
    { label: isAr ? 'المناطق العقارية' : 'Real Estate Locations', href: `/${lang}/locations/` }
  ];

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-[#C02026] selection:text-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* ================= HERO SECTION (Premium Dark) ================= */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center bg-[#080A0D] overflow-hidden pt-20" aria-labelledby="hero-heading">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A0D] via-[#080A0D]/60 to-transparent z-10" aria-hidden="true" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C02026] via-transparent to-transparent animate-pulse pointer-events-none" aria-hidden="true" />
        
        <div className="relative z-20 text-center px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            
            <div className="flex justify-center mb-10 overflow-x-auto hide-scrollbar">
               <Breadcrumbs items={breadcrumbItems} lang={lang} />
            </div>

            <h1 id="hero-heading" className="text-5xl md:text-9xl font-black text-white mb-8 uppercase italic tracking-tighter drop-shadow-2xl leading-none">
                {isAr ? 'خريطة الاستثمار' : 'Prime Hotspots'}
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl font-medium tracking-wide max-w-3xl mx-auto leading-relaxed italic">
                {isAr 
                  ? 'اكتشف وجهاتنا العقارية المختارة بعناية، حيث تلتقي الفخامة بأعلى عوائد الاستثمار في مصر.' 
                  : 'Discover our handpicked destinations where luxury meets the highest investment returns in Egypt.'}
            </p>
        </div>
      </section>

      {/* ================= LOCATIONS GRID ================= */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-40" aria-label="Locations Grid">
        {locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14" role="list">
            {locations.map((loc, index) => {
              const locName = isAr ? getSafeText(loc.nameAr) : getSafeText(loc.nameEn);
              return (
                <Link 
                  key={loc._id} 
                  href={`/${lang}/locations/${loc.slug}/`}
                  role="listitem"
                  aria-label={isAr ? `عرض مشاريع ${locName}` : `View projects in ${locName}`}
                  className="group relative h-[500px] md:h-[650px] rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-700 block bg-slate-100 hover:-translate-y-4"
                >
                  {loc.image ? (
                      <Image 
                          src={urlFor(loc.image).width(800).height(1000).quality(90).url()} 
                          alt={isAr ? `خريطة مشاريع ${locName}` : `${locName} Investment Map`} 
                          fill 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-[2s] ease-out"
                          priority={index < 3} 
                      />
                  ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center" aria-hidden="true">
                          <MapPin size={64} className="text-slate-200" />
                      </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A0D] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" aria-hidden="true" />

                  {/* Card Content */}
                  <div className="absolute bottom-0 start-0 w-full p-10 md:p-14 flex flex-col items-start gap-6 z-20 text-start">
                      <div className="inline-flex items-center gap-3 bg-[#C02026] text-white px-5 py-2 rounded-2xl shadow-2xl group-hover:bg-white group-hover:text-[#C02026] transition-all duration-500">
                          <Building2 size={14} className="animate-pulse" />
                          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                              {loc.projectsCount} {isAr ? 'مشروع متاح' : 'Active Assets'}
                          </span>
                      </div>

                      <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none transition-colors group-hover:text-white">
                          {locName}
                      </h2>

                      <div className="flex items-center gap-3 text-white/70 text-[11px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                          {isAr ? 'اكتشف المنطقة' : 'Explore Territory'} 
                          {isAr ? <ArrowLeft size={18} className="animate-bounce-x" /> : <ArrowRight size={18} className="animate-bounce-x" />}
                      </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200" role="status">
             <Globe size={64} className="mx-auto text-slate-200 mb-6 animate-spin-slow" aria-hidden="true" />
             <h2 className="text-2xl font-black text-slate-400 italic uppercase tracking-widest">
                {isAr ? 'جاري تحديث البيانات الجغرافية...' : 'Synchronizing Geo-Data...'}
             </h2>
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-x { 
          0%, 100% { transform: translateX(0); } 
          50% { transform: translateX(${isAr ? '-10px' : '10px'}); } 
        }
        .animate-bounce-x { animation: bounce-x 2s infinite ease-in-out; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </main>
  );
}

// ✅ تحسين جودة الـ ISR
export const revalidate = 3600;