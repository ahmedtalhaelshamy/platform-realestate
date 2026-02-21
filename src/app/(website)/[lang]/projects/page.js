import { client } from '@/sanity/client';
import ProjectCard from '@/components/ProjectCard';
import SearchFilter from '@/components/SearchFilter';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { Search, Sparkles } from 'lucide-react';
import { Suspense } from 'react';
import { urlFor } from '@/sanity/image'; // استيراد المحرك لمعالجة صور الـ Metadata

// ✅ 1. PERFORMANCE & CACHING
export const dynamic = 'force-static';
export const revalidate = 3600; 

// ✅ 2. توليد اللغات مسبقاً
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

// ✅ دالة الأمان المحسنة
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

/**
 * 🔍 SEO Metadata المحسنة
 * تم تحسين صورة الـ OG لتكون WebP تلقائياً عند المشاركة
 */
export async function generateMetadata({ params, searchParams }) {
  const { lang } = await params;
  const sParams = await searchParams;
  const isAr = lang === 'ar';
  
  const seo = await client.fetch(`*[_type == "siteSettings"][0].projectsSeo`);

  let title = isAr 
    ? getSafeText(seo?.metaTitleAr || 'عقارات للبيع في مصر') 
    : getSafeText(seo?.metaTitleEn || 'Properties for Sale in Egypt');

  if (sParams.search) {
    title = isAr ? `نتائج البحث عن ${sParams.search}` : `Results for ${sParams.search}`;
  }

  // تحسين صورة المشاركة الاجتماعية لتكون خفيفة وبصيغة WebP
  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).auto('format').url()
    : `${CONTACT_INFO.domain}/og-image.jpg`;

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn),
    alternates: { 
      canonical: `${CONTACT_INFO.domain}/${lang}/projects/` 
    },
    openGraph: {
      title,
      images: [{ url: ogImageUrl }],
    }
  };
}

/**
 * 🛰️ دالة جلب البيانات
 * تأكدنا من جلب كائن الصورة بالكامل mainImage لدعم التجاوب الذكي
 */
async function getProjects(filters) {
  const { search, location, developer, type } = filters; 
  let filterQuery = `_type == "project" && !(_id in path("drafts.**"))`;
  
  if (search) filterQuery += ` && (titleAr match $search || titleEn match $search)`;
  if (location) filterQuery += ` && location->slug.current == $location`;
  if (developer) filterQuery += ` && developer->slug.current == $developer`;
  if (type) filterQuery += ` && projectType == $type`;

  const query = `*[${filterQuery}] | order(isNewLaunch desc, _createdAt desc) {
    _id, titleAr, titleEn, price, installments, downPayment,
    isNewLaunch, isReadyToMove, isVerified, projectType,
    "slug": slug.current,
    mainImage,
    "districtData": district->{ nameAr, nameEn },
    "locationData": location->{ nameAr, nameEn },
    "developer": developer->{ nameAr, nameEn }
  }`;

  try {
    return await client.fetch(query, { 
        search: search ? `*${search}*` : "", 
        location: location || null,
        developer: developer || null,
        type: type || null
    });
  } catch (error) {
    return [];
  }
}

function ProjectsLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 opacity-60">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[500px] bg-slate-100 rounded-[3rem] animate-pulse" />
            ))}
        </div>
    );
}

/**
 * 🏗️ المكون الأساسي لصفحة الكتالوج
 */
export default async function ProjectsPage({ params, searchParams }) {
  const { lang } = await params;
  const filters = await searchParams;
  const isAr = lang === 'ar';
  
  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🚀 1. PREMIUM HERO SECTION */}
      <header className="relative bg-[#080A0D] pt-32 md:pt-52 pb-32 md:pb-48 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C02026]/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C02026_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center mb-12 overflow-x-auto hide-scrollbar">
             <Breadcrumbs items={[{ label: isAr ? 'كتالوج المشاريع' : 'The Catalog', href: `/${lang}/projects/` }]} lang={lang} />
          </nav>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 backdrop-blur-md shadow-2xl">
                <Sparkles size={14} className="text-[#C02026] animate-pulse" />
                {isAr ? 'استكشف أرقى العقارات في مصر' : 'The Most Exclusive Directory'}
            </div>

            <h1 className="text-6xl md:text-[9.5rem] font-black text-white italic uppercase leading-[0.8] tracking-tighter drop-shadow-2xl">
                {filters.search ? (
                    <>
                        <span className="text-[#C02026]">{isAr ? 'نتائج' : 'Results'}</span><br/>
                        <span className="text-4xl md:text-8xl not-italic opacity-80">{filters.search}</span>
                    </>
                ) : (
                    <>{isAr ? 'كتالوج' : 'THE'}<br/><span className="text-[#C02026] not-italic">{isAr ? 'المشاريع' : 'CATALOG'}</span></>
                )}
            </h1>
          </div>

          {/* SearchBar Interface */}
          <div className="max-w-5xl mx-auto mt-24">
             <div className="bg-white/5 backdrop-blur-3xl p-3 md:p-5 rounded-[3rem] md:rounded-[4rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                 <SearchFilter lang={lang} isAr={isAr} />
             </div>
          </div>
        </div>
      </header>

      {/* 🏙️ 2. PROJECTS GRID */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <Suspense key={JSON.stringify(filters)} fallback={<ProjectsLoading />}>
            <ProjectsGrid filters={filters} lang={lang} />
        </Suspense>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}

/**
 * 🛰️ المكون الداخلي لمعالجة البيانات
 */
async function ProjectsGrid({ filters, lang }) {
    const isAr = lang === 'ar';
    const projects = await getProjects(filters);

    if (projects.length === 0) {
        return (
            <div className="text-center py-48 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-slate-100">
                   <Search size={48} className="text-slate-200" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-6 italic uppercase tracking-tighter">
                    {isAr ? 'لا توجد نتائج تطابق بحثك' : 'No matches found'}
                </h2>
                <p className="text-slate-500 font-medium text-lg max-w-lg mx-auto mb-12 leading-relaxed italic">
                    {isAr 
                      ? 'جرب تعديل الفلاتر أو ابحث بكلمة أخرى، مستشارونا متاحون دائماً لمساعدتك في العثور على طلبك مجاناً.' 
                      : 'Try adjusting your search criteria. Our experts are ready to assist you in finding your perfect asset.'}
                </p>
                <a 
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                  className="inline-block bg-slate-950 text-white px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-[#C02026] transition-all shadow-2xl active:scale-95"
                >
                    {isAr ? 'استشارة عقارية فورية' : 'Instant Advisory'}
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
            {projects.map((project) => (
                <article key={project._id}>
                  {/* هنا ProjectCard اللي عدلناه مسبقاً هيقوم بكل شغل الـ WebP والتجاوب */}
                  <ProjectCard lang={lang} data={project} />
                </article>
            ))}
        </div>
    );
}