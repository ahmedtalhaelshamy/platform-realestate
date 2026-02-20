import { client } from '@/sanity/client';
import Link from 'next/link';
import { MapPin, Building2, LayoutGrid, ChevronLeft } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

// 🏁 الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

async function getData() {
  const query = `{
    "projects": *[_type == "project" && defined(slug.current)]{ titleAr, titleEn, "slug": slug.current },
    "locations": *[_type == "location" && defined(slug.current)]{ nameAr, nameEn, "slug": slug.current },
    "developers": *[_type == "developer" && defined(slug.current)]{ nameAr, nameEn, "slug": slug.current }
  }`;
  return await client.fetch(query);
}

/**
 * ✅ 1. Metadata: عشان جوجل يفهم إن الصفحة دي هي الفهرس الرسمي
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const title = isAr ? 'خريطة الموقع' : 'Sitemap';
  const arPath = `${BASE_URL}/ar/sitemap/`;
  const enPath = `${BASE_URL}/en/sitemap/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${title} | Platform Real Estate`,
    description: isAr ? 'دليل شامل لجميع المشاريع والمناطق والمطورين' : 'Full directory of projects, locations, and developers',
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar-EG': arPath,
        'en-US': enPath,
        'x-default': arPath,
      },
    },
  };
}

/**
 * ✅ 2. Component الأساسي
 */
export default async function HTMLSitemap({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getData();

  const sections = [
    { title: isAr ? 'المشاريع العقارية' : 'Real Estate Projects', items: data.projects, path: 'projects', icon: LayoutGrid },
    { title: isAr ? 'المناطق والمدن' : 'Prime Locations', items: data.locations, path: 'locations', icon: MapPin },
    { title: isAr ? 'المطورون العقاريون' : 'Trusted Developers', items: data.developers, path: 'developers', icon: Building2 },
  ];

  return (
    <main className="min-h-screen pt-40 pb-20 bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic uppercase tracking-tighter mb-6">
            {isAr ? 'خريطة' : 'Site'} <span className="text-[#C02026]">{isAr ? 'الموقع' : 'Map'}</span>
          </h1>
          <div className="w-24 h-2 bg-[#C02026] mx-auto rounded-full" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-8">
              <div className="flex items-center gap-4 text-[#C02026] border-b border-red-50 pb-4">
                <section.icon size={24} />
                <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-900">{section.title}</h2>
              </div>
              <ul className="space-y-4">
                {section.items.map((item, i) => (
                  <li key={i}>
                    {/* ✅ تحديث: إضافة / في نهاية الرابط لضمان السرعة ومنع الـ Redirects */}
                    <Link 
                      href={`/${lang}/${section.path}/${item.slug}/`}
                      className="group flex items-center justify-between text-slate-500 hover:text-[#C02026] transition-all font-bold text-sm"
                    >
                      <span>{isAr ? (item.titleAr || item.nameAr) : (item.titleEn || item.nameEn)}</span>
                      <ChevronLeft size={14} className={`opacity-0 group-hover:opacity-100 transition-all ${isAr ? '' : 'rotate-180'}`} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}