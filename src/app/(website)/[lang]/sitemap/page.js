import { client } from '@/sanity/client';
import Link from 'next/link';
import { MapPin, Building2, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';
import { urlFor } from '@/sanity/image'; // استيراد المحرك لضمان تحسين صور المشاركة

// 🏁 الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

// ✅ دالة الأمان لمنع خطأ الـ Objects Error
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  if (typeof val === 'object' && val.children) {
    return val.children.map(child => child.text).join('');
  }
  return "";
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
 * ✅ 1. Metadata: تحسين الأرشفة الدولية وصور الـ OG
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  // محاولة جلب إعدادات السيو لخريطة الموقع من Sanity إذا وجدت
  const seo = await client.fetch(`*[_type == "siteSettings"][0].sitemapSeo`);
  
  const title = isAr ? 'خريطة الموقع الشاملة' : 'Complete Site Map';
  const arPath = `${BASE_URL}/ar/sitemap/`;
  const enPath = `${BASE_URL}/en/sitemap/`;
  const currentPath = isAr ? arPath : enPath;

  // تحسين: ضمان تحويل صورة المشاركة لـ WebP تلقائياً بوزن خفيف
  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).auto('format').url()
    : `${BASE_URL}/og-image.jpg`;

  return {
    title: `${title} | Platform Real Estate`,
    description: isAr 
      ? 'اكتشف دليلنا الشامل لجميع المشاريع العقارية، المناطق الاستثمارية، وأبرز المطورين في مصر.' 
      : 'Explore our full directory of real estate projects, investment locations, and top developers in Egypt.',
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar-EG': arPath,
        'en-US': enPath,
        'x-default': arPath,
      },
    },
    openGraph: {
      title: `${title} | Platform`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    }
  };
}

/**
 * ✅ 2. HTML Sitemap Component
 */
export default async function HTMLSitemap({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getData();

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
      title: isAr ? 'المطورون العقاريون' : 'Trusted Developers', 
      items: data.developers, 
      path: 'developers', 
      icon: Building2 
    },
  ];

  return (
    <main 
      className="min-h-screen pt-40 pb-20 bg-white" 
      dir={isAr ? 'rtl' : 'ltr'}
      aria-labelledby="sitemap-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <header className="mb-24 text-center md:text-start">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <span className="w-12 h-1 bg-[#C02026] rounded-full" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C02026]">
              {isAr ? 'الفهرس العقاري' : 'The Real Estate Index'}
            </span>
          </div>
          <h1 id="sitemap-heading" className="text-5xl md:text-8xl font-black text-slate-900 italic uppercase tracking-tighter leading-none mb-8">
            {isAr ? 'خريطة' : 'Site'} <span className="text-[#C02026]">{isAr ? 'الموقع' : 'Map'}</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed italic">
            {isAr 
              ? 'دليل سريع للوصول إلى كافة مشاريعنا العقارية وأهم المطورين في السوق المصري.' 
              : 'Quick access to all our real estate listings and key developers in the Egyptian market.'}
          </p>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {sections.map((section, idx) => (
            <nav key={idx} aria-label={section.title} className="space-y-10">
              {/* Section Title */}
              <div className="flex items-center gap-4 text-[#C02026] border-b-2 border-slate-50 pb-6 group">
                <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-[#C02026] group-hover:text-white transition-all duration-500">
                   <section.icon size={28} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-950">
                  {section.title}
                </h2>
              </div>

              {/* Links List */}
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
                        className="group flex items-center justify-between text-slate-500 hover:text-[#C02026] transition-all font-bold text-sm md:text-base border-b border-transparent hover:border-red-50 pb-1"
                      >
                        <span className="truncate max-w-[85%]">{itemLabel}</span>
                        {isAr ? (
                          <ChevronLeft size={16} className="opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" aria-hidden="true" />
                        ) : (
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                        )}
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
        body { background-color: #ffffff; }
        ::selection { background-color: #C02026; color: white; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}} />
    </main>
  );
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}