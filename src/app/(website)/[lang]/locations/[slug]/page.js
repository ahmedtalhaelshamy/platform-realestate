import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';
import { MapPin, Info, LayoutGrid, Building2, ArrowLeft, ArrowRight, Phone, MessageCircle, Globe } from 'lucide-react';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ 1. STATIC GENERATION (ISR)
export async function generateStaticParams() {
  const query = `*[_type == "location" && defined(slug.current)]{ "slug": slug.current }`;
  try {
    const locations = await client.fetch(query);
    const languages = ['ar', 'en'];
    return locations.flatMap((loc) => 
      languages.map((lang) => ({ lang, slug: loc.slug }))
    );
  } catch {
    return [];
  }
}

export const revalidate = 3600;

// ✅ Portable Text Custom Components
const ptComponents = {
  block: {
    h2: ({children}) => <h2 className="text-2xl md:text-3xl font-black mt-10 mb-5 text-slate-900 italic uppercase">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl md:text-2xl font-black mt-8 mb-4 text-slate-800">{children}</h3>,
    normal: ({children}) => <p className="text-base md:text-lg text-slate-600 leading-loose mb-6 font-medium text-justify">{children}</p>,
  },
};

// --- 3. SEO METADATA ---
export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';
  
  const query = `*[_type == "location" && slug.current == $slug][0]{ 
    nameAr, nameEn, 
    "seo": seo { metaTitleAr, metaTitleEn, metaDescAr, metaDescEn, keywordsAr, keywordsEn }
  }`;
  
  const data = await client.fetch(query, { slug });
  if (!data) return { title: isAr ? 'المنطقة غير موجودة' : 'Location Not Found' };

  const name = isAr ? data.nameAr : data.nameEn;
  const seo = data.seo;

  const title = isAr 
    ? (seo?.metaTitleAr || `عقارات ومشاريع ${name} | استثمر الآن`) 
    : (seo?.metaTitleEn || `Real Estate in ${name} | Invest Now`);
    
  const description = isAr ? seo?.metaDescAr : seo?.metaDescEn;

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: description,
    keywords: isAr ? seo?.keywordsAr : seo?.keywordsEn,
    alternates: {
      canonical: `${CONTACT_INFO.domain}/${lang}/locations/${slug}`,
    }
  };
}

export default async function LocationDetailPage({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  // 🔥 التعديل الجوهري هنا في الـ Query
  const query = `{
    "locationData": *[_type == "location" && slug.current == $slug][0]{
      _id, nameAr, nameEn, descriptionAr, descriptionEn, image
    },
    
    // ✅ تصحيح: غيرنا location->slug لـ city->slug عشان يجيب الأحياء صح
    "districtsWithProjects": *[_type == "district" && city->slug.current == $slug] | order(order asc) {
      _id, nameAr, nameEn, "slug": slug.current, image,
      "projects": *[_type == "project" && references(^._id)] | order(isNewLaunch desc, _createdAt desc) {
        _id, titleAr, titleEn, price, installments, downPayment,
        isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage,
        "developer": developer->{ nameAr, nameEn },
        "districtData": district->{ nameAr, nameEn }
      }
    },

    "generalProjects": *[_type == "project" && location->slug.current == $slug && !defined(district)] | order(isNewLaunch desc, _createdAt desc) {
        _id, titleAr, titleEn, price, installments, downPayment,
        isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage,
        "developer": developer->{ nameAr, nameEn }
    }
  }`;

  const data = await client.fetch(query, { slug });
  if (!data?.locationData) return notFound();

  const { locationData, districtsWithProjects, generalProjects } = data;
  const locName = isAr ? locationData.nameAr : locationData.nameEn;

  // ✅ فلتر لعرض الأحياء التي بها مشاريع فقط (ممكن تشيل الفلتر لو عايز تعرض الأحياء الفاضية)
  const activeDistricts = districtsWithProjects.filter(d => d.projects.length > 0);

  const breadcrumbItems = [
    { label: isAr ? 'المناطق' : 'Locations', href: `/${lang}/locations` },
    { label: locName }
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center bg-[#050505] overflow-hidden pt-20">
        {locationData.image && (
          <Image 
            src={urlFor(locationData.image).width(1920).url()} 
            alt={locName} fill priority className="object-cover opacity-50 scale-105 animate-slow-zoom" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-black/20 to-black/60 z-10" />

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex justify-center mb-8 text-white/70 text-[10px] md:text-xs uppercase tracking-widest">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>

          <div className="inline-flex items-center gap-2 bg-[#C02026]/10 border border-[#C02026]/20 px-4 py-1.5 rounded-full mb-6 text-white backdrop-blur-md">
            <MapPin size={14} className="text-[#C02026]" />
            <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'وجهة استثمارية مميزة' : 'Prime Destination'}</span>
          </div>
          
          <h1 className="text-4xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter italic leading-none drop-shadow-2xl">
            {isAr ? `عقارات ${locName}` : `${locName} Property`}
          </h1>
        </div>
      </section>

      {/* 2. DISTRICTS QUICK NAV */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-30">
        {activeDistricts.length > 0 ? (
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-gray-100">
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {activeDistricts.map((district) => (
                  <a key={district.slug} href={`#${district.slug}`} className="group flex flex-col items-center gap-3 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden relative shadow-md bg-slate-100">
                         {district.image ? (
                           <Image src={urlFor(district.image).width(200).url()} fill alt={district.nameEn} className="object-cover group-hover:scale-110 transition-transform" />
                         ) : <div className="w-full h-full flex items-center justify-center text-slate-300"><LayoutGrid size={24} /></div>}
                      </div>
                      <span className="font-black text-[11px] uppercase tracking-tight text-center text-slate-900">{isAr ? district.nameAr : district.nameEn}</span>
                  </a>
                ))}
             </div>
          </div>
        ) : (
          /* رسالة في حالة عدم وجود أحياء مرتبطة */
          <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              {isAr ? 'جاري إضافة الأحياء والمشاريع...' : 'Districts & Projects coming soon...'}
            </p>
          </div>
        )}
      </div>

      {/* 3. PROJECTS CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        
        {/* General Location Projects */}
        {generalProjects.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-12 border-s-4 border-[#C02026] ps-6">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter">
                  {isAr ? `أبرز مشاريع ${locName}` : `Featured in ${locName}`}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {generalProjects.map((project) => (
                    <ProjectCard key={project._id} lang={lang} data={project} isActive={true} />
                ))}
            </div>
          </section>
        )}

        {/* District-Specific Sections */}
        {activeDistricts.map((district) => (
          <section key={district._id} id={district.slug} className="scroll-mt-32">
            <div className="flex items-center justify-between mb-12 border-s-4 border-[#C02026] ps-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter">
                    {isAr ? `مشاريع ${district.nameAr}` : `${district.nameEn} Projects`}
                  </h2>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                    {isAr ? `استكشف أفضل الفرص في حي ${district.nameAr}` : `Explore top opportunities in ${district.nameEn}`}
                  </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {district.projects.map((project) => (
                    <ProjectCard key={project._id} lang={lang} data={project} isActive={true} />
                ))}
            </div>
          </section>
        ))}

        {/* 4. LOCATION GUIDE */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-20 border-t border-slate-200">
           <div className="lg:col-span-2 space-y-10">
              <div className="inline-flex items-center gap-3 text-[#C02026]">
                 <Info size={24} />
                 <span className="font-black uppercase tracking-[0.2em] text-[10px]">{isAr ? 'دليل الاستثمار' : 'Investment Guide'}</span>
              </div>
              <article className="prose prose-slate max-w-none">
                 <PortableText value={isAr ? locationData.descriptionAr : locationData.descriptionEn} components={ptComponents} />
              </article>
           </div>

           <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[#121621] p-10 rounded-[3rem] text-white shadow-2xl border-4 border-white">
                 <div className="w-16 h-16 bg-[#C02026] rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-xl">
                    <Building2 size={32} />
                 </div>
                 <h4 className="text-2xl font-black italic uppercase mb-4">{isAr ? 'احصل على استشارة' : 'Free Consultation'}</h4>
                 <p className="text-gray-400 text-sm mb-10 font-bold leading-loose">
                    {isAr ? `نساعدك في اختيار أفضل وحدة عقارية في ${locName} بناءً على ميزانيتك.` : `Helping you find the best property in ${locName} based on your budget.`}
                 </p>
                 <div className="space-y-3">
                    <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center justify-center gap-3 py-4 bg-[#C02026] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-[#C02026] transition-all">
                       <Phone size={18} /> {isAr ? 'اتصال مباشر' : 'Call Sales'}
                    </a>
                    <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#25D366] transition-all">
                       <MessageCircle size={18} /> WhatsApp
                    </a>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
}