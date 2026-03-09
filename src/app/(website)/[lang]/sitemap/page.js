import { client } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';
import Link from 'next/link';
import { urlFor } from '@/sanity/image';
import { MapPin, Building2, Home, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

/**
 * ✅ SEO Metadata: السيطرة اليدوية المطلقة وتوحيد الروابط
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const baseUrl = 'https://platformrealestate.co';
  const currentUrl = `${baseUrl}/${lang}/sitemap/`;

  const title = lang === 'ar' 
    ? `خريطة الموقع | ${CONTACT_INFO.siteNameAr}` 
    : `Visual Sitemap | ${CONTACT_INFO.siteNameEn}`;

  return {
    // 🚀 استخدام absolute لضمان السيطرة اليدوية ومنع التكرار
    title: {
      absolute: title,
    },
    description: lang === 'ar' 
      ? "تصفح الفهرس الشامل لكافة مشاريعنا العقارية، المناطق، وأبرز المطورين في مصر." 
      : "Browse our complete index of real estate projects, prime locations, and industry titans.",
    alternates: {
      canonical: currentUrl,
      languages: {
        'ar': `${baseUrl}/ar/sitemap/`,
        'en': `${baseUrl}/en/sitemap/`,
        'x-default': `${baseUrl}/ar/sitemap/`,
      },
    },
  };
}

async function getSitemapData() {
  const query = `{
    "projects": *[_type == "project" && !(_id in path("drafts.**"))] | order(_createdAt desc) { _id, titleAr, titleEn, "slug": slug.current },
    "developers": *[_type == "developer" && !(_id in path("drafts.**"))] | order(order asc) { _id, nameAr, nameEn, "slug": slug.current },
    "districts": *[_type == "district" && !(_id in path("drafts.**"))] { _id, nameAr, nameEn, "slug": slug.current }
  }`;
  return await client.fetch(query);
}

export default async function VisualSitemapPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getSitemapData();
  const baseUrl = 'https://platformrealestate.co';

  const allItems = [
    ...data.projects.map(i => ({ ...i, path: 'projects' })),
    ...data.developers.map(i => ({ ...i, path: 'developers' })),
    ...data.districts.map(i => ({ ...i, path: 'districts' }))
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isAr ? "خريطة الموقع" : "Site Index",
    "numberOfItems": allItems.length,
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": isAr ? (item.titleAr || item.nameAr) : (item.titleEn || item.nameEn),
      "url": `${baseUrl}/${lang}/${item.path}/${item.slug}/`
    }))
  };

  return (
    <main className={`min-h-screen bg-white pt-32 pb-20 px-6 selection:bg-[#C02026] selection:text-white overflow-x-hidden ${isAr ? 'font-almarai' : 'font-jakarta'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-7xl mx-auto">
        <header className="mb-20 border-s-8 border-[#C02026] ps-6 text-start">
          <h1 className="text-5xl md:text-8xl font-black text-slate-950 uppercase italic tracking-tighter overflow-visible pr-4 leading-[0.9]">
            {isAr ? 'خريطة' : 'VISUAL'}<br/>
            <span className="text-[#C02026] not-italic">{isAr ? 'المحتوى' : 'SITEMAP'}</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
          {/* Projects */}
          <section className="space-y-8 text-start">
            <div className="flex items-center gap-3 text-[#C02026] border-b border-slate-100 pb-4">
              <Home size={22} />
              <h2 className="text-xl font-black italic uppercase overflow-visible pr-2">{isAr ? 'المشاريع' : 'Projects'}</h2>
            </div>
            <ul className="space-y-3">
              {data.projects.map(p => (
                <li key={p._id}>
                  <Link href={`/${lang}/projects/${p.slug}/`} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <span className="font-bold text-slate-700 group-hover:text-[#C02026] text-sm overflow-visible pr-4">
                      {isAr ? p.titleAr : p.titleEn}
                    </span>
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-[#C02026] transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Titans */}
          <section className="space-y-8 text-start">
            <div className="flex items-center gap-3 text-[#C02026] border-b border-slate-100 pb-4">
              <Building2 size={22} />
              <h2 className="text-xl font-black italic uppercase overflow-visible pr-2">{isAr ? 'المطورون' : 'Titans'}</h2>
            </div>
            <ul className="space-y-3">
              {data.developers.map(d => (
                <li key={d._id}>
                  <Link href={`/${lang}/developers/${d.slug}/`} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <span className="font-bold text-slate-700 group-hover:text-[#C02026] text-sm overflow-visible pr-4">
                      {isAr ? d.nameAr : d.nameEn}
                    </span>
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-[#C02026]" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Districts */}
          <section className="space-y-8 text-start">
            <div className="flex items-center gap-3 text-[#C02026] border-b border-slate-100 pb-4">
              <MapPin size={22} />
              <h2 className="text-xl font-black italic uppercase overflow-visible pr-2">{isAr ? 'الأحياء' : 'Districts'}</h2>
            </div>
            <ul className="space-y-3">
              {data.districts.map(dist => (
                <li key={dist._id}>
                  <Link href={`/${lang}/districts/${dist.slug}/`} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <span className="font-bold text-slate-700 group-hover:text-[#C02026] text-sm overflow-visible pr-4">
                      {isAr ? dist.nameAr : dist.nameEn}
                    </span>
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-[#C02026]" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        [dir="rtl"] .text-start { text-align: right !important; }
        h1, h2, span { overflow: visible !important; }
      `}} />
    </main>
  );
}