import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { Building2, ArrowRight, ArrowLeft, Star, ShieldCheck, Briefcase } from 'lucide-react';
// 1. استيراد المكون السحري لحل مشكلة الـ Object
import { PortableText } from '@portabletext/react';

// ✅ تحديث دوري (ISR)
export const revalidate = 3600; 

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

/**
 * 🔍 SEO Metadata
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  
  const query = `*[_type == "siteSettings"][0].developersSeo`;
  const seo = await client.fetch(query);

  const title = isAr 
    ? (seo?.metaTitleAr || 'أفضل المطورين العقاريين في مصر') 
    : (seo?.metaTitleEn || 'Top Real Estate Developers in Egypt');

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: isAr ? seo?.metaDescAr : seo?.metaDescEn,
    keywords: isAr ? seo?.keywordsAr : seo?.keywordsEn,
    alternates: {
      canonical: `${CONTACT_INFO.domain}/${lang}/developers`,
    },
    openGraph: {
      title: title,
      description: isAr ? seo?.metaDescAr : seo?.metaDescEn,
      images: seo?.openGraphImage ? [{ url: urlFor(seo.openGraphImage).width(1200).url() }] : [],
      type: 'website',
    }
  };
}

/**
 * 📡 جلب بيانات المطورين
 */
async function getDevelopers() {
  const query = `*[_type == "developer"] | order(order asc) {
    _id,
    nameAr, nameEn,
    "slug": slug.current,
    logo,
    descriptionAr, descriptionEn,
    "projectsCount": count(*[_type == "project" && references(^._id)])
  }`;
  
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Developers Fetch Error:", error);
    return [];
  }
}

export default async function DevelopersPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const developers = await getDevelopers();

  const breadcrumbItems = [{ label: isAr ? 'المطورين العقاريين' : 'Developers' }];

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-[#C02026] selection:text-white overflow-x-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION */}
      <section className="bg-slate-950 pt-36 md:pt-56 pb-32 md:pb-48 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C02026]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-6xl mx-auto animate-fade-in-up">
          <div className="flex justify-center mb-10 opacity-50 hover:opacity-100 transition-opacity">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>

          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-full text-white/90 text-[10px] md:text-xs font-black uppercase mb-10 tracking-[0.3em] shadow-2xl">
            <ShieldCheck size={16} className="text-[#C02026]" />
            {isAr ? 'شركاء استراتيجيون معتمدون' : 'Certified Strategic Partners'}
          </div>
          
          <h1 className="text-5xl md:text-9xl font-black text-white mb-10 tracking-tighter italic uppercase leading-[0.85] drop-shadow-2xl">
            {isAr ? 'رواد التطوير' : 'The Titans'}<span className="text-[#C02026]">.</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto italic opacity-80">
            {isAr 
              ? 'نحن ننتقي شركاءنا بعناية لضمان أمان استثماراتكم. اكتشف نخبة المطورين الذين يشكلون وجه مصر الجديد.' 
              : 'We select our partners with precision to ensure your investment security. Explore the elite developers shaping Egypt’s new skyline.'}
          </p>
        </div>
      </section>

      {/* 2. DEVELOPERS GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 -mt-20 md:-mt-32 relative z-20 pb-40">
        {developers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {developers.map((dev) => (
              <Link 
                key={dev._id} 
                href={`/${lang}/developers/${dev.slug}`}
                className="group bg-white rounded-[3.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-[#C02026]/20 hover:shadow-[0_40px_80px_rgba(192,32,38,0.1)] hover:-translate-y-3 transition-all duration-700 flex flex-col h-full relative"
              >
                <div className="h-56 w-full relative mb-10 flex items-center justify-center bg-slate-50 rounded-[3rem] p-12 transition-all duration-500 group-hover:bg-white border border-slate-50">
                  {dev.logo ? (
                    <Image 
                      src={urlFor(dev.logo).width(500).url()} 
                      alt={isAr ? dev.nameAr : dev.nameEn} 
                      fill 
                      className="object-contain p-10 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />
                  ) : <Building2 size={64} className="text-slate-200" />}
                  
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl text-[#C02026] border border-red-50 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <Star size={18} fill="currentColor" />
                  </div>
                </div>

                <div className="flex-grow space-y-4 mb-10 px-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-0.5 bg-[#C02026] rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'مطور عقاري' : 'Official Developer'}</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-[#C02026] transition-colors duration-300 leading-none">
                    {isAr ? dev.nameAr : dev.nameEn}
                  </h2>
                  
                  {/* ✅ الحل النهائي هنا: استخدمنا PortableText بدلاً من <p> مباشرة */}
                  <div className="text-slate-500 text-sm md:text-base leading-[1.8] line-clamp-3 font-medium opacity-80 overflow-hidden">
                    {isAr ? (
                      dev.descriptionAr && <PortableText value={dev.descriptionAr} />
                    ) : (
                      dev.descriptionEn && <PortableText value={dev.descriptionEn} />
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl text-[#C02026] flex items-center justify-center group-hover:bg-[#C02026] group-hover:text-white transition-all duration-500">
                      <Briefcase size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-900 group-hover:text-[#C02026] transition-colors">
                           {String(dev.projectsCount || 0).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'المشاريع' : 'Projects'}</span>
                    </div>
                  </div>
                  
                  <div className="w-14 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-[#C02026] transition-all duration-500 shadow-xl overflow-hidden relative group/btn">
                      <span className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                      {isAr ? <ArrowLeft size={20} className="relative z-10" /> : <ArrowRight size={20} className="relative z-10" />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-48 bg-white rounded-[4rem] border border-slate-100 shadow-2xl">
            <Building2 size={80} className="mx-auto text-slate-100 mb-8 animate-pulse" />
            <h3 className="text-slate-400 text-xl font-black italic uppercase tracking-[0.3em] animate-pulse">
               {isAr ? 'يتم جلب بيانات الشركاء...' : 'Fetching Global Partners...'}
            </h3>
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
      `}} />
    </main>
  );
}