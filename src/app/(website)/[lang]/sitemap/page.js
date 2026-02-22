import { client } from '@/sanity/client';
import Link from 'next/link';
import { MapPin, Building2, LayoutGrid, ChevronRight } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';
import { urlFor } from '@/sanity/image';

// 🏁 الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

/**
 * ✅ دالة الأمان لمنع خطأ الـ Objects
 */
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

async function getData() {
  const query = `{
    "projects": *[_type == "project" && defined(slug.current)]{ titleAr, titleEn, "slug": slug.current },
    "locations": *[_type == "location" && defined(slug.current)]{ nameAr, nameEn, "slug": slug.current },
    "developers": *[_type == "developer" && defined(slug.current)]{ nameAr, nameEn, "slug": slug.current }
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 3600 } });
}

/**
 * ✅ Metadata: تحسين الأرشفة الدولية
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const seo = await client.fetch(`*[_type == "siteSettings"][0].sitemapSeo`);
  
  const title = isAr ? 'خريطة الموقع الشاملة' : 'Complete Site Map';
  const arPath = `${BASE_URL}/ar/sitemap/`;
  const enPath = `${BASE_URL}/en/sitemap/`;
  const currentPath = isAr ? arPath : enPath;

  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).format('webp').url()
    : `${BASE_URL}/og-image.jpg`;

  return {
    title: `${title} | Platform`,
    description: isAr 
      ? 'دليل بلاتفورم العقاري الشامل: ابحث عن المشاريع، المناطق، وأبرز المطورين في مكان واحد.' 
      : 'Platform Comprehensive Index: Find projects, locations, and top developers in one place.',
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar-EG': arPath,
        'en-US': enPath,
      },
    },
    openGraph: {
      title,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    }
  };
}

export default async function HTMLSitemap({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getData();

  // ✅ SEO: بيانات منظمة لتعريف جوجل بالملاحة
  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isAr ? "خريطة الموقع" : "Site Map",
    "description": "Index of all real estate assets, locations, and developers"
  };

  const sections = [
    { 
      title: isAr ? 'المشاريع العقارية' : 'Real Estate Projects', 
      items: data.projects, 
      path: 'projects', 
      icon: LayoutGrid 
    },
    { 
      title: isAr ? 'المناطق والمدن' : 'Prime Locations', 
      items: data.locations, 
      path: 'locations', 
      icon: MapPin 
    },
    { 
      title: isAr ? 'المطورون العقاريون' : 'The Titans', 
      items: data.developers, 
      path: 'developers', 
      icon: Building2 
    },
  ];

  return (
    <main 
      className={`min-h-screen pt-40 pb-24 bg-white selection:bg-brand-red selection:text-white ${isAr ? 'font-almarai' : 'font-jakarta'}`} 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* --- Header Section --- */}
        <header className="mb-24 text-center md:text-start space-y-6">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <span className="w-12 h-1 bg-brand-red rounded-full" aria-hidden="true" />
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] text-brand-red ${isAr ? 'tracking-wider' : ''}`}>
              {isAr ? 'الفهرس العقاري' : 'The Real Estate Index'}
            </span>
          </div>
          <h1 id="sitemap-heading" className={`text-5xl md:text-8xl font-black text-brand-dark uppercase leading-none ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
            {isAr ? 'خريطة' : 'Site'} <span className="text-brand-red not-italic">{isAr ? 'الموقع' : 'Map'}</span>
          </h1>
          <p className="text-slate-600 font-bold text-lg max-w-2xl leading-relaxed opacity-80">
            {isAr 
              ? 'دليل سريع للوصول المباشر إلى كافة مشاريعنا العقارية وأهم المطورين في السوق المصري.' 
              : 'Direct access directory to our full portfolio of luxury assets and market leaders.'}
          </p>
        </header>

        {/* --- Sitemap Content Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {sections.map((section, idx) => (
            <nav key={idx} aria-label={section.title} className="space-y-10">
              {/* Section Branding */}
              <div className="flex items-center gap-4 text-brand-red border-b border-brand-gray-50 pb-6 group">
                <div className="p-3 bg-brand-red/5 rounded-2xl group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shadow-inner">
                   <section.icon size={28} strokeWidth={2} />
                </div>
                <h2 className={`text-2xl font-black text-brand-dark uppercase ${isAr ? 'tracking-normal' : 'italic tracking-tight'}`}>
                  {section.title}
                </h2>
              </div>

              {/* Links List - Optimized Contrast */}
              <ul className="space-y-4">
                {section.items.map((item, i) => {
                  const itemLabel = isAr 
                    ? getSafeText(item.titleAr || item.nameAr) 
                    : getSafeText(item.titleEn || item.nameEn);
                    
                  return (
                    <li key={i}>
                      <Link 
                        href={`/${lang}/${section.path}/${item.slug}/`}
                        aria-label={isAr ? `عرض ${itemLabel}` : `View ${itemLabel}`}
                        className="group flex items-center justify-between text-slate-600 hover:text-brand-red transition-all font-bold text-base border-b border-transparent hover:border-brand-red/10 pb-2"
                      >
                        <span className="truncate max-w-[85%]">{itemLabel}</span>
                        {/* استخدام منطق السهم الواحد مع الانعكاس التلقائي */}
                        <ChevronRight 
                          size={16} 
                          className="opacity-0 group-hover:opacity-100 transition-all transform rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" 
                          aria-hidden="true" 
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
      `}} />
    </main>
  );
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}