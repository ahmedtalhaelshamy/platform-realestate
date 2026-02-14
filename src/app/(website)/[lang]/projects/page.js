import { client } from '@/sanity/client';
import ProjectCard from '@/components/ProjectCard';
import SearchBar from '@/components/SearchFilter';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { LayoutGrid, Search, Loader2, Sparkles } from 'lucide-react';
import { Suspense } from 'react';

// ✅ 1. إجبار الصفحة على أن تكون Static بالكامل لضمان سرعة الأرشفة
export const dynamic = 'force-static';
export const revalidate = 3600; 

// ✅ 2. توليد اللغات مسبقاً (ar / en) لتحويل الـ ƒ إلى ●
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

const safeString = (val) => {
  if (typeof val === 'string') return val;
  if (!val) return "";
  if (Array.isArray(val)) return val.map(b => b.children?.map(c => c.text).join('')).join(' ');
  return String(val);
};

/**
 * 🔍 جلب المشاريع - مضاف إليها فلتر المسودات (Drafts) لضمان استقرار الـ Build
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
    console.error("Fetch Error:", error);
    return [];
  }
}

/**
 * 🛡️ هيكل التحميل (Skeleton Loader)
 */
function ProjectsLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 opacity-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[450px] bg-slate-100 rounded-[2.5rem] animate-pulse" />
            ))}
        </div>
    );
}

/**
 * 🔍 SEO Metadata
 */
export async function generateMetadata({ params, searchParams }) {
  const { lang } = await params;
  const sParams = await searchParams;
  const isAr = lang === 'ar';
  const seo = await client.fetch(`*[_type == "siteSettings"][0].projectsSeo`);

  let title = isAr 
    ? safeString(seo?.metaTitleAr || 'عقارات للبيع في مصر') 
    : safeString(seo?.metaTitleEn || 'Properties for Sale in Egypt');

  if (sParams.search) {
    title = isAr ? `نتائج البحث عن ${sParams.search}` : `Results for ${sParams.search}`;
  }

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: safeString(isAr ? seo?.metaDescAr : seo?.metaDescEn),
    alternates: { canonical: `${CONTACT_INFO.domain}/${lang}/projects` },
  };
}

/**
 * 🏗️ المكون الأساسي للصفحة
 */
export default async function ProjectsPage({ params, searchParams }) {
  const { lang } = await params;
  const filters = await searchParams;
  const isAr = lang === 'ar';
  
  return (
    <main className="min-h-screen bg-[#FDFDFD]" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🚀 1. HERO SECTION (Static Content) */}
      <section className="relative bg-[#050505] pt-36 md:pt-52 pb-32 md:pb-48 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C02026]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C02026_0.5px,transparent_0.5px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-center mb-12 opacity-50 hover:opacity-100 transition-opacity">
             <Breadcrumbs items={[{ label: isAr ? 'كتالوج المشاريع' : 'The Catalog' }]} lang={lang} />
          </div>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 backdrop-blur-md">
                <Sparkles size={14} className="text-[#C02026]" />
                {isAr ? 'استكشف أرقى العقارات' : 'The Most Exclusive Directory'}
            </div>

            <h1 className="text-5xl md:text-[9rem] font-black text-white italic uppercase leading-[0.8] tracking-tighter drop-shadow-2xl">
                {filters.search ? (
                    <>
                        <span className="text-[#C02026]">{isAr ? 'نتائج' : 'Results'}</span><br/>
                        <span className="text-4xl md:text-7xl not-italic opacity-80">{safeString(filters.search)}</span>
                    </>
                ) : (
                    <>{isAr ? 'كتالوج' : 'THE'}<br/><span className="text-[#C02026] not-italic">{isAr ? 'المشاريع' : 'CATALOG'}</span></>
                )}
            </h1>
          </div>

          {/* SearchBar Overlay */}
          <div className="max-w-5xl mx-auto mt-20 relative">
             <div className="relative bg-white/5 backdrop-blur-2xl p-2 md:p-4 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl">
                 <SearchBar lang={lang} />
             </div>
          </div>
        </div>
      </section>

      {/* 🚀 2. PROJECTS GRID (Streaming Suspense) */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <Suspense key={JSON.stringify(filters)} fallback={<ProjectsLoading />}>
            <ProjectsGrid filters={filters} lang={lang} />
        </Suspense>
      </section>

    </main>
  );
}

/**
 * 🛰️ مكون جلب وعرض البيانات
 */
async function ProjectsGrid({ filters, lang }) {
    const isAr = lang === 'ar';
    const projects = await getProjects(filters);

    if (projects.length === 0) {
        return (
            <div className="text-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100 animate-in fade-in zoom-in-95">
                <Search size={80} className="mx-auto text-slate-200 mb-8" />
                <h2 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">
                    {isAr ? 'لا يوجد نتائج تطابق بحثك' : 'No results found'}
                </h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                    {isAr 
                      ? 'جرب تعديل الفلاتر أو ابحث بكلمة أخرى، مستشارونا متاحون دائماً لمساعدتك في العثور على طلبك.' 
                      : 'Try adjusting filters or different keywords. Our experts are ready to assist you for free.'}
                </p>
                <div className="flex justify-center">
                    <a href={`tel:${CONTACT_INFO.phone}`} className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#C02026] transition-all shadow-xl active:scale-95">
                        {isAr ? 'استشارة عقارية مجانية' : 'Free Advice'}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 animate-in fade-in duration-1000">
            {projects.map((project) => (
                <ProjectCard key={project._id} lang={lang} data={project} />
            ))}
        </div>
    );
}