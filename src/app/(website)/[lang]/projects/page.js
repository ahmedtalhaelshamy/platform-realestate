import { client } from '@/sanity/client';
import ProjectCard from '@/components/ProjectCard';
import SearchFilter from '@/components/SearchFilter';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { Search, Sparkles, Building2 } from 'lucide-react';
import { Suspense } from 'react';
import { urlFor } from '@/sanity/image';

// ✅ 1. PERFORMANCE & CACHING
export const dynamic = 'force-static';
export const revalidate = 3600; 

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

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
 * 🔍 SEO Metadata: السيطرة اليدوية المطلقة
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

  // توجيه صورة الـ SEO لـ Bunny
  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).url()
    : `${CONTACT_INFO.domain}/og-image.jpg`;

  return {
    // 🚀 استخدام absolute لضمان السيطرة اليدوية ومنع التكرار
    title: {
      absolute: title,
    },
    description: getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn),
    metadataBase: new URL(CONTACT_INFO.domain),
    alternates: { 
      canonical: `${CONTACT_INFO.domain}/${lang}/projects/`,
      languages: {
        'ar': `${CONTACT_INFO.domain}/ar/projects/`,
        'en': `${CONTACT_INFO.domain}/en/projects/`,
        'x-default': `${CONTACT_INFO.domain}/ar/projects/`,
      }
    },
    openGraph: {
      title,
      description: getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn),
      url: `${CONTACT_INFO.domain}/${lang}/projects/`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

/**
 * 🛰️ Data Fetching Engine
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
    console.error("Data Fetch Error:", error);
    return [];
  }
}

function ProjectsLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 opacity-60">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[520px] bg-brand-gray-50 rounded-[3rem] animate-pulse border border-slate-100" />
            ))}
        </div>
    );
}

export default async function ProjectsPage({ params, searchParams }) {
  const { lang } = await params;
  const filters = await searchParams;
  const isAr = lang === 'ar';
  
  return (
    <main className={`min-h-screen bg-white selection:bg-brand-red selection:text-white ${isAr ? 'font-almarai' : 'font-jakarta'}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🚀 1. PREMIUM HERO SECTION */}
      <header className="relative bg-brand-dark pt-32 md:pt-52 pb-32 md:pb-48 px-6 overflow-hidden">
        <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[150px] animate-pulse pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C02026_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center mb-12 overflow-x-auto no-scrollbar" aria-label={isAr ? "مسار التنقل" : "Breadcrumb"}>
             <Breadcrumbs items={[{ label: isAr ? 'كتالوج المشاريع' : 'The Catalog', href: `/${lang}/projects/` }]} lang={lang} />
          </nav>

          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 backdrop-blur-md shadow-2xl">
                <Sparkles size={14} className="text-brand-red animate-pulse" aria-hidden="true" />
                {isAr ? 'استكشف أرقى العقارات في مصر' : 'The Most Exclusive Directory'}
            </div>

            <h1 className={`text-6xl md:text-[9.5rem] font-black text-white uppercase leading-[0.85] drop-shadow-2xl ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
                {filters.search ? (
                    <>
                        <span className="text-brand-red">{isAr ? 'نتائج' : 'Results'}</span><br/>
                        <span className="text-4xl md:text-8xl opacity-80">{filters.search}</span>
                    </>
                ) : (
                    <>{isAr ? 'كتالوج' : 'THE'}<br/><span className="text-brand-red not-italic">{isAr ? 'المشاريع' : 'CATALOG'}</span></>
                )}
            </h1>
          </div>

          <div className="max-w-5xl mx-auto mt-24">
             <div className="bg-white/5 backdrop-blur-3xl p-3 md:p-5 rounded-[3rem] border border-white/10 shadow-premium">
                <SearchFilter lang={lang} isAr={isAr} />
             </div>
          </div>
        </div>
      </header>

      {/* 🏙️ 2. PROJECTS GRID */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32" aria-live="polite">
        <Suspense key={JSON.stringify(filters)} fallback={<ProjectsLoading />}>
            <ProjectsGrid filters={filters} lang={lang} />
        </Suspense>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5); }
      `}} />
    </main>
  );
}

/**
 * 🛰️ Results Content
 */
async function ProjectsGrid({ filters, lang }) {
    const isAr = lang === 'ar';
    const projects = await getProjects(filters);

    if (projects.length === 0) {
        return (
            <div className="text-center py-48 bg-brand-gray-50 rounded-[4rem] border-2 border-dashed border-slate-200" role="status">
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-slate-50 transition-transform hover:scale-110 duration-500">
                   <Search size={48} className="text-slate-200" aria-hidden="true" />
                </div>
                <h2 className={`text-3xl md:text-5xl font-black text-brand-dark mb-6 uppercase ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
                    {isAr ? 'لا توجد نتائج تطابق بحثك' : 'No matches found'}
                </h2>
                <p className="text-slate-500 font-bold text-lg max-w-lg mx-auto mb-12 leading-relaxed">
                    {isAr 
                      ? 'جرب تعديل الفلاتر أو ابحث بكلمة أخرى، مستشارونا متاحون دائماً لمساعدتك في العثور على طلبك مجاناً.' 
                      : 'Try adjusting your search criteria. Our expert consultants are ready to assist you in finding your perfect asset.'}
                </p>
                <a 
                  href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`} 
                  className="inline-flex items-center gap-3 bg-brand-dark text-white px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-brand-red transition-all shadow-premium active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-brand-red/30"
                >
                    {isAr ? 'استشارة عقارية فورية' : 'Instant Advisory'}
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 lg:gap-16">
            {projects.map((project, index) => (
                <div key={project._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* تمرير unoptimized={true} داخلياً في ProjectCard لضمان عمل Bunny */}
                  <ProjectCard lang={lang} data={project} isPriority={index < 3} />
                </div>
            ))}
        </div>
    );
}