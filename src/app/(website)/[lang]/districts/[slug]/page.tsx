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

// ✅ 1. إجبار الصفحة على أن تكون Static بالكامل لضمان أرشفة سريعة
export const dynamic = 'force-static';
export const revalidate = 3600; 

// 🏁 الدومين الموحد المعتمد (بدون www) لضمان قوة السيو
const BASE_URL = 'https://platformrealestate.co';

// ✅ 2. توليد المسارات مسبقاً (SSG) لكل الأحياء واللغات
export async function generateStaticParams() {
  const query = `*[_type == "district" && defined(slug.current) && !(_id in path("drafts.**"))]{ 
    "slug": slug.current 
  }`;
  try {
    const districts = await client.fetch(query);
    return districts.flatMap((dist: any) => [
      { lang: 'ar', slug: dist.slug },
      { lang: 'en', slug: dist.slug },
    ]);
  } catch (error) {
    console.error("Static Params Error:", error);
    return [];
  }
}

// ✅ 3. الميتا داتا للأرشفة (SEO) - الربط الدولي ومنع التكرار (Hreflang)
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
  
  const name = isAr ? district.nameAr : district.nameEn;
  const title = isAr ? (district.seoTitleAr || name) : (district.seoTitleEn || name);
  const description = isAr ? district.seoDescAr : district.seoDescEn;

  // 🔗 بناء الروابط المتقاطعة (Hreflang)
  const arPath = `${BASE_URL}/ar/districts/${slug}/`;
  const enPath = `${BASE_URL}/en/districts/${slug}/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${title} | Platform Real Estate`,
    description: description || (isAr 
      ? `استكشف أفضل الوحدات والمشاريع العقارية في حي ${name}. مقارنة أسعار وأنظمة سداد.` 
      : `Explore top properties and real estate projects in ${name} district. Compare prices and payment plans.`),
    
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar-EG': arPath,
        'en-US': enPath,
        'x-default': arPath, // النسخة العربية هي الافتراضية
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

// ✅ 4. نظام التنسيق البصري للمحتوى (تم حل مشكلة TypeScript هنا)
const ptComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-black mt-12 mb-6 text-slate-900 border-s-4 border-[#C02026] ps-4 leading-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-slate-800">{children}</h3>,
    normal: ({ children }) => <p className="text-base md:text-lg text-slate-600 leading-9 mb-6 text-justify font-medium">{children}</p>,
  },
};

export default async function DistrictPage({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  // ✅ جلب بيانات الحي + مشاريع الحي
  const query = `{
    "district": *[_type == "district" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id, nameAr, nameEn, descriptionAr, descriptionEn, image,
      "location": location->{_id, nameAr, nameEn, "slug": slug.current},
      "projects": *[_type == "project" && references(^._id) && !(_id in path("drafts.**"))] | order(isNewLaunch desc, _createdAt desc) {
        _id, titleAr, titleEn, price, installments, downPayment, 
        isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage, 
        "developer": developer->{nameAr, nameEn}
      }
    }
  }`;

  const data = await client.fetch(query, { slug });
  if (!data?.district) return notFound();

  const { district } = data;
  const distName = isAr ? district.nameAr : district.nameEn;
  const parentLocName = isAr ? district.location.nameAr : district.location.nameEn;

  // جلب مشاريع المنطقة الكبرى للـ Cross-Selling
  const locationProjectsQuery = `*[_type == "project" && location._ref == $locationId && !references($districtId) && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...6] {
    _id, titleAr, titleEn, price, installments, downPayment, 
    isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage, 
    "developer": developer->{nameAr, nameEn}
  }`;

  const locationProjects = await client.fetch(locationProjectsQuery, { 
    locationId: district.location._id, 
    districtId: district._id 
  });

  // ✅ توحيد الروابط لتنتهي بـ / لضمان عدم حدوث Redirects داخلية
  const breadcrumbItems = [
    { label: isAr ? 'المناطق' : 'Locations', href: `/${lang}/locations/` },
    { label: parentLocName, href: `/${lang}/locations/${district.location.slug}/` },
    { label: distName }
  ];

  return (
    <main className="min-h-screen bg-[#FDFDFD]" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[45vh] md:h-[55vh] w-full bg-slate-900 overflow-hidden">
        {district.image ? (
          <Image 
            src={urlFor(district.image).width(1920).url()} 
            alt={distName} fill className="object-cover opacity-60 scale-105 animate-slow-zoom" priority 
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-slate-900/40 to-black/20 z-10" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center z-20">
            <nav className="mb-6"><Breadcrumbs items={breadcrumbItems} lang={lang} /></nav>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 italic uppercase tracking-tighter drop-shadow-2xl leading-none">{distName}</h1>
            <div className="inline-flex items-center gap-2 bg-[#C02026] px-4 py-1.5 rounded-full shadow-xl">
                <MapPin size={14} />
                <span className="text-xs font-black uppercase tracking-widest">{parentLocName}</span>
            </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        
        {/* 2. SPECIFIC DISTRICT PROJECTS */}
        <section id="projects-grid">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-s-8 border-[#C02026] ps-6">
              <div>
                <span className="text-[#C02026] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">{isAr ? 'نتائج البحث في الحي' : 'District Inventory'}</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic uppercase">
                    {isAr ? `مشاريع ${distName}` : `Projects in ${distName}`}
                </h2>
              </div>
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 font-black text-slate-700">
                {district.projects.length} {isAr ? 'عقارات متاحة' : 'Units'}
              </div>
          </div>
          
          {district.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {district.projects.map((proj: any) => (<ProjectCard key={proj._id} data={proj} lang={lang} />))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-black">{isAr ? 'جاري إضافة مشاريع جديدة لهذا الحي' : 'No direct projects yet.'}</p>
            </div>
          )}
        </section>

        {/* 3. CONTENT & SIDEBAR CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-8 order-2 lg:order-1">
                {(district.descriptionAr || district.descriptionEn) && (
                  <section className="bg-white p-8 md:p-16 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-50">
                    <div className="flex items-center gap-3 mb-10">
                        <Info size={32} className="text-[#C02026]" />
                        <h3 className="text-3xl font-black text-slate-900 italic uppercase">
                            {isAr ? `لماذا تختار ${distName}؟` : `Why Choose ${distName}?`}
                        </h3>
                    </div>
                    <article className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-img:rounded-[2.5rem]">
                      <PortableText value={isAr ? district.descriptionAr : district.descriptionEn} components={ptComponents} />
                    </article>
                  </section>
                )}
            </div>

            <aside className="lg:col-span-4 lg:sticky lg:top-28 order-1 lg:order-2">
                <div className="bg-[#111827] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border-b-8 border-[#C02026]">
                    <div className="absolute -top-10 -right-10 opacity-10 rotate-12"><Building2 size={150} /></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-[#C02026] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            <Sparkles size={12} /> {isAr ? 'عرض حصري' : 'Limited Offer'}
                        </div>
                        <h4 className="text-2xl font-black mb-4 leading-tight">
                            {isAr ? `احجز معاينتك في ${distName} الآن` : `Book your tour in ${distName}`}
                        </h4>
                        <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                            {isAr ? `نحن نساعدك في المقارنة بين أفضل الكمبوندات في حي ${distName} للوصول لأفضل سعر.` : `We help you compare the best compounds in ${distName} to get the best deal.`}
                        </p>
                        
                        <div className="space-y-4">
                            <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-5 bg-[#25D366] hover:bg-[#1eb954] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-green-500/10">
                                <MessageCircle size={18} /> WhatsApp
                            </a>
                            <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center justify-center gap-3 w-full py-5 bg-white text-slate-900 hover:bg-[#C02026] hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95">
                                <Phone size={18} /> {isAr ? 'اتصال مباشر' : 'Call Now'}
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        {/* 4. CROSS-SELLING */}
        {locationProjects.length > 0 && (
          <section className="pt-20 border-t border-slate-100">
            <div className="flex items-center justify-between mb-12 border-s-4 border-slate-200 ps-6">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 italic uppercase tracking-tighter leading-none">
                        {isAr ? `أبرز مشاريع ${parentLocName}` : `Top in ${parentLocName}`}
                    </h2>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-3">
                        {isAr ? `فرص إضافية استثمارية في ${parentLocName} بالكامل` : `More investment opportunities across ${parentLocName}`}
                    </p>
                </div>
                <Link href={`/${lang}/locations/${district.location.slug}/`} className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-[#C02026] hover:text-white px-8 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest text-slate-900 group">
                    {isAr ? 'كل المشاريع' : 'All Projects'} <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locationProjects.map((proj: any) => (<ProjectCard key={proj._id} data={proj} lang={lang} />))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}