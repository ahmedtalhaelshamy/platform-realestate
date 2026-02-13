import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { MapPin, ArrowRight, ArrowLeft, Building2, Globe } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ 1. تحويل الصفحة لنظام Static (●) لسرعة خارقة
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

// ✅ 2. جلب بيانات الـ SEO من Sanity (siteSettings)
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const query = `*[_type == "siteSettings"][0].locationsSeo`;
  const seo = await client.fetch(query);

  const title = isAr 
    ? (seo?.metaTitleAr || 'تصفح كل المناطق | بلاتفورم العقارية') 
    : (seo?.metaTitleEn || 'Browse Locations | Platform Real Estate');

  const description = isAr 
    ? (seo?.metaDescAr || 'دليلك الشامل لأفضل المناطق الاستثمارية والسكنية في مصر.') 
    : (seo?.metaDescEn || 'Your comprehensive guide to top investment locations in Egypt.');

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: description,
    keywords: isAr ? seo?.keywordsAr : seo?.keywordsEn,
    alternates: {
      canonical: `${CONTACT_INFO.domain}/${lang}/locations`,
    }
  };
}

export default async function LocationsIndexPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const query = `*[_type == "location"] | order(order asc) {
    _id, nameAr, nameEn,
    "slug": slug.current,
    image,
    "projectsCount": count(*[_type == "project" && (references(^._id) || district->location._ref == ^._id)])
  }`;

  const locations = await client.fetch(query, {}, { next: { revalidate: 3600 } });

  // ✅ التعديل هنا: حذفنا عنصر "Home" لأن المكون يضيفه تلقائياً كجذر للمسار
  const breadcrumbItems = [
    { label: isAr ? 'المناطق' : 'Locations' }
  ];

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-[#C02026] selection:text-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* ================= HERO SECTION (Premium Dark) ================= */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center bg-[#050505] overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C02026] via-black to-black animate-pulse" />
        
        <div className="relative z-20 text-center px-4 animate-in fade-in slide-in-from-top-4 duration-1000">
            
            {/* ✅ الـ Breadcrumbs أصبحت الآن Home > Locations فقط */}
            <div className="flex justify-center mb-8 text-white/60 text-[10px] md:text-xs tracking-widest uppercase">
               <Breadcrumbs items={breadcrumbItems} lang={lang} />
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter drop-shadow-2xl leading-none">
                {isAr ? 'خريطة الاستثمار' : 'Prime Locations'}
            </h1>
            <p className="text-white/70 text-base md:text-xl font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
                {isAr 
                  ? 'وجهات مختارة بعناية توفر لك أرقى مستويات المعيشة في مصر.' 
                  : 'Carefully curated destinations offering premium living standards in Egypt.'}
            </p>
        </div>
      </section>

      {/* ================= LOCATIONS GRID ================= */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 md:py-32">
        {locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {locations.map((loc, index) => (
              <Link 
                key={loc._id} 
                href={`/${lang}/locations/${loc.slug}`}
                className="group relative h-[450px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_rgba(192,32,38,0.15)] transition-all duration-700 block bg-gray-100"
              >
                {loc.image ? (
                    <Image 
                        src={urlFor(loc.image).width(800).height(1000).quality(90).url()} 
                        alt={isAr ? loc.nameAr : loc.nameEn} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                        priority={index < 3} 
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <MapPin size={48} className="text-slate-300" />
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                <div className="absolute bottom-0 start-0 w-full p-8 md:p-12 flex flex-col items-start gap-4 z-20">
                    <div className="inline-flex items-center gap-2 bg-[#C02026] px-4 py-1.5 rounded-full shadow-lg group-hover:bg-white group-hover:text-[#C02026] transition-all duration-500">
                        <Building2 size={12} className="fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {loc.projectsCount} {isAr ? 'مشروع' : 'Projects'}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                        {isAr ? loc.nameAr : loc.nameEn}
                    </h2>

                    <div className="flex items-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        {isAr ? 'استكشف الآن' : 'Explore Now'} 
                        {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                    </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <Globe size={48} className="mx-auto text-slate-300 mb-4 animate-spin-slow" />
             <h2 className="text-xl font-bold text-slate-400 italic">
                {isAr ? 'جاري تحديث الخريطة العقارية...' : 'Updating the real estate map...'}
             </h2>
          </div>
        )}
      </section>
    </main>
  );
}