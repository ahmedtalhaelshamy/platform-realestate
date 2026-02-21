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

// ✅ 1. توليد المسارات الثابتة (SSG) لسرعة خارقة
export async function generateStaticParams() {
  const query = `*[_type == "location" && defined(slug.current)]{ "slug": slug.current }`;
  const locations = await client.fetch(query);
  
  return locations.flatMap((loc) => [
    { lang: 'ar', slug: loc.slug },
    { lang: 'en', slug: loc.slug },
  ]);
}

export const revalidate = 3600; 

/**
 * ✅ 2. الـ SEO Metadata (تم تحسين الـ OG Image هنا)
 */
export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  const data = await client.fetch(
    `*[_type == "location" && slug.current == $slug][0]{ 
      nameAr, nameEn, seoTitleAr, seoTitleEn, seoDescAr, seoDescEn, image 
    }`,
    { slug }
  );

  if (!data) return { title: 'Location Not Found' };

  const name = isAr ? getSafeText(data.nameAr) : getSafeText(data.nameEn);
  const title = isAr ? getSafeText(data.seoTitleAr || name) : getSafeText(data.seoTitleEn || name);
  const description = isAr ? getSafeText(data.seoDescAr) : getSafeText(data.seoDescEn);

  // تحسين صورة الـ OG لتكون WebP تلقائياً
  const ogImageUrl = data.image 
    ? urlFor(data.image).width(1200).height(630).auto('format').url()
    : `${BASE_URL}/og-image.jpg`;

  const arPath = `${BASE_URL}/ar/locations/${slug}/`;
  const enPath = `${BASE_URL}/en/locations/${slug}/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${title} | Platform`,
    description: description || (isAr ? `اكتشف أفضل العقارات في ${name}` : `Discover best properties in ${name}`),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar': arPath,
        'en': enPath,
        'x-default': arPath,
      },
    },
    openGraph: {
      title: `${name} | Platform Real Estate`,
      url: currentPath,
      images: [{ url: ogImageUrl }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

// ✅ تنسيق محتوى المقال SEO
const ptComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-black mt-12 mb-6 text-slate-900 border-s-4 border-[#C02026] ps-4 leading-tight italic uppercase tracking-tighter">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-slate-800 italic uppercase">{children}</h3>,
    normal: ({ children }) => <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6 text-justify font-medium">{children}</p>,
  },
};

/**
 * 🏗️ المكون الرئيسي
 */
export default async function LocationDetailPage({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  const query = `{
    "locationData": *[_type == "location" && slug.current == $slug][0]{
      _id, nameAr, nameEn, descriptionAr, descriptionEn, image
    },
    "districts": *[_type == "district" && location->slug.current == $slug] | order(order asc) {
      _id, nameAr, nameEn, "slug": slug.current, image,
      "projects": *[_type == "project" && references(^._id) && !(_id in path("drafts.**"))] | order(isNewLaunch desc, _createdAt desc) { 
          _id, titleAr, titleEn, price, installments, downPayment, 
          isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage, 
          "developer": developer->{nameAr, nameEn},
          "location": location->{nameAr, nameEn},
          "districtData": district->{ nameAr, nameEn }
      }
    },
    "generalProjects": *[_type == "project" && location->slug.current == $slug && !defined(district) && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...6] {
       _id, titleAr, titleEn, price, installments, downPayment, 
       isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage,
       "developer": developer->{nameAr, nameEn},
       "location": location->{nameAr, nameEn},
       "districtData": district->{ nameAr, nameEn }
    }
  }`;

  const data = await client.fetch(query, { slug });
  if (!data?.locationData) return notFound();

  const { locationData, districts, generalProjects } = data;
  const locName = isAr ? getSafeText(locationData.nameAr) : getSafeText(locationData.nameEn);

  const breadcrumbItems = [
    { label: isAr ? 'المناطق' : 'Locations', href: `/${lang}/locations/` },
    { label: locName }
  ];

  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? `استفسار عن العقارات في ${locName}` : `Inquiry about properties in ${locName}`)}`;

  return (
    <main className="min-h-screen bg-[#F8FAFC]" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION - تم تحسين صورة الهيرو لـ WebP وتجاوب الشاشات */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {locationData.image && (
          <Image 
            // تحسين: إضافة .auto('format') لضمان WebP وتحديد sizes
            src={urlFor(locationData.image).width(1920).auto('format').quality(90).url()} 
            alt={locName} 
            fill 
            sizes="100vw"
            className="object-cover opacity-60 scale-105 animate-slow-zoom" 
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-black/20 to-black/60 z-10" />
        
        <div className="relative z-20 text-center text-white px-6 max-w-5xl">
          <nav className="mb-10 flex justify-center overflow-x-auto hide-scrollbar">
            <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </nav>
          <div className="inline-flex items-center gap-3 bg-[#C02026] text-white px-5 py-2 rounded-full mb-8 shadow-2xl border border-white/10">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">
              {isAr ? 'فرص استثمارية حصرية 2026' : 'Exclusive 2026 Opportunities'}
            </span>
          </div>
          <h1 className="text-5xl md:text-9xl font-black mb-6 drop-shadow-2xl italic uppercase tracking-tighter leading-none">
            {locName}
          </h1>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 relative z-30">
        
        {/* 2. DISTRICTS QUICK NAV - تم تحسين صور الأحياء الدائرية */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 -mt-28 mb-32 relative z-40">
          {districts.map((dist) => {
            const distName = isAr ? getSafeText(dist.nameAr) : getSafeText(dist.nameEn);
            return (
              <Link key={dist._id} href={`/${lang}/districts/${dist.slug}/`} 
                    className="group flex flex-col items-center gap-5 transition-transform hover:-translate-y-2">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full p-1.5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 transition-all duration-700 group-hover:ring-4 group-hover:ring-[#C02026] overflow-hidden">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-50">
                    {dist.image ? (
                      <Image 
                        // تحسين: .auto('format') للتحويل لـ WebP وتحديد sizes للموبايل
                        src={urlFor(dist.image).width(300).auto('format').url()} 
                        fill 
                        sizes="(max-width: 768px) 96px, 128px"
                        alt={distName} 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><LayoutGrid size={40} /></div>}
                  </div>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 bg-white px-5 py-2 rounded-2xl shadow-xl group-hover:bg-[#C02026] group-hover:text-white transition-all">
                  {distName}
                </span>
              </Link>
            );
          })}
        </div>

        {/* 3. MAIN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8 space-y-32">
            
            {/* Districts Projects Sections */}
            {districts.map((district) => (
              district.projects && district.projects.length > 0 && (
                <section key={district._id} id={district.slug} className="scroll-mt-32">
                  <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-s-[12px] border-[#C02026] ps-8 gap-6">
                    <div className="text-start">
                      <h2 className="text-3xl md:text-6xl font-black text-slate-950 italic uppercase tracking-tighter leading-none">
                        {isAr ? `مشاريع ${getSafeText(district.nameAr)}` : `${getSafeText(district.nameEn)} Projects`}
                      </h2>
                      <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mt-4">
                        {isAr ? `استكشف أفضل العقارات في ${getSafeText(district.nameAr)}` : `Top Assets in ${getSafeText(district.nameEn)}`}
                      </p>
                    </div>
                    <Link href={`/${lang}/districts/${district.slug}/`} className="inline-flex items-center gap-3 text-[#C02026] font-black text-[11px] uppercase tracking-widest hover:underline whitespace-nowrap">
                      {isAr ? 'عرض الكل' : 'View All'} <ArrowRight size={16} className={isAr ? 'rotate-180' : ''} />
                    </Link>
                  </header>
                  {/* الـ ProjectCard داخلياً يعالج صوره بـ WebP كما فعلنا سابقاً */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
                    {district.projects.map((project) => (
                      <ProjectCard key={project._id} data={project} lang={lang} />
                    ))}
                  </div>
                </section>
              )
            ))}

            {/* General Projects in Location */}
            {generalProjects.length > 0 && (
              <section className="bg-white p-10 md:p-16 rounded-[4rem] border border-slate-100 shadow-sm">
                <h2 className="text-3xl md:text-5xl font-black mb-16 text-slate-950 italic uppercase tracking-tighter leading-none text-start">
                  {isAr ? `أحدث الفرص في ${locName}` : `Global Opportunities in ${locName}`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {generalProjects.map((project) => (
                    <ProjectCard key={project._id} data={project} lang={lang} />
                  ))}
                </div>
              </section>
            )}

            {/* Investment Guide Section */}
            {(locationData.descriptionAr || locationData.descriptionEn) && (
              <article className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl shadow-slate-200/40 border border-slate-50 text-start">
                <div className="flex items-center gap-5 mb-12 text-[#C02026]">
                    <div className="p-4 bg-red-50 rounded-3xl"><Info size={40} strokeWidth={1.5} /></div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">{isAr ? 'دليل الاستثمار العقاري' : 'Investment Guide'}</h2>
                </div>
                <div className="prose prose-xl prose-slate max-w-none prose-img:rounded-[3rem] prose-headings:italic">
                  <PortableText 
                    value={isAr ? locationData.descriptionAr : locationData.descriptionEn} 
                    components={ptComponents} 
                  />
                </div>
              </article>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 h-full">
            <div className="lg:sticky lg:top-32 space-y-10">
                
                {/* Consultant Card */}
                <div className="bg-[#080A0D] text-white p-10 md:p-14 rounded-[4rem] shadow-2xl border-b-[16px] border-[#C02026] relative overflow-hidden group">
                    <div className="absolute -top-16 -right-16 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                        <Building2 size={300} />
                    </div>
                    
                    <div className="relative z-10 text-start">
                        <div className="inline-flex items-center gap-3 bg-[#C02026] px-5 py-2 rounded-2xl text-[10px] font-black uppercase mb-10 shadow-xl">
                            <CheckCircle size={14} /> {isAr ? 'مستشار عقاري معتمد' : 'Verified Partner'}
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black mb-8 leading-[0.9] italic uppercase tracking-tighter">
                            {isAr ? `محتاج مساعدة في ${locName}؟` : `Need help in ${locName}?`}
                        </h3>
                        <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed italic">
                            {isAr 
                                ? `فريقنا يساعدك في مقارنة الأسعار واختيار أفضل حي سكني أو تجاري في المنطقة مجاناً.` 
                                : `Our experts help you compare pricing and find the best district for your investment, 100% free.`}
                        </p>

                        <div className="space-y-4">
                            <a href={whatsappUrl} 
                                 target="_blank" rel="noopener noreferrer"
                                 className="flex items-center justify-center gap-4 w-full py-6 bg-[#25D366] hover:bg-[#1eb954] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95">
                                <MessageCircle size={24} fill="currentColor" /> WhatsApp
                            </a>
                            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                               className="flex items-center justify-center gap-4 w-full py-6 bg-white text-slate-950 hover:bg-[#C02026] hover:text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95">
                                <Phone size={24} fill="currentColor" /> {isAr ? 'اتصل الآن' : 'Call Sales'}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Browse by District List */}
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl text-start">
                    <h5 className="text-[12px] font-black uppercase text-slate-400 mb-8 tracking-[0.3em]">{isAr ? 'تصفح حسب الحي' : 'Browse Districts'}</h5>
                    <div className="flex flex-wrap gap-3">
                        {districts.map(d => (
                            <Link key={d._id} href={`/${lang}/districts/${d.slug}/`} className="px-6 py-3 bg-slate-50 hover:bg-[#C02026] hover:text-white rounded-2xl text-xs font-black text-slate-600 transition-all uppercase tracking-tighter italic border border-slate-50">
                                {isAr ? getSafeText(d.nameAr) : getSafeText(d.nameEn)}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
          </aside>

        </div>
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