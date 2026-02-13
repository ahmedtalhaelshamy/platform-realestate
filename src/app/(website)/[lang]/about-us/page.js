import Image from 'next/image';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { PortableText } from '@portabletext/react';
import { CONTACT_INFO } from '@/components/constants/contact';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { Target, Lightbulb, Users, CheckCircle, Award, ArrowUpRight, MessageCircle } from 'lucide-react';

// ✅ الأداء: ISR لتحديث البيانات كل ساعة
export const revalidate = 3600; 

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

async function getAboutData() {
  const query = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
    ...,
    "seo": seo {
      metaTitleAr, metaTitleEn, metaDescAr, metaDescEn,
      keywordsAr, keywordsEn, "ogImage": openGraphImage.asset->url
    }
  }`;
  try {
    return await client.fetch(query);
  } catch (err) {
    console.error("Sanity Error:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getAboutData();
  if (!data) return { title: isAr ? 'من نحن' : 'About Us' };

  const seo = data.seo;
  const title = isAr ? (seo?.metaTitleAr || data.heroTitleAr) : (seo?.metaTitleEn || data.heroTitleEn);
  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: isAr ? seo?.metaDescAr : seo?.metaDescEn,
    alternates: { canonical: `${CONTACT_INFO.domain}/${lang}/about` },
    openGraph: { images: seo?.ogImage ? [{ url: seo.ogImage }] : [] }
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getAboutData();

  if (!data) return null;

  const t = {
    heroTitle: isAr ? data.heroTitleAr : data.heroTitleEn,
    storyTitle: isAr ? data.storyTitleAr : data.storyTitleEn,
    storyContent: isAr ? data.storyContentAr : data.storyContentEn,
    visionTitle: isAr ? 'رؤيتنا' : 'Our Vision',
    visionText: isAr ? data.visionAr : data.visionEn,
    missionTitle: isAr ? 'مهمتنا' : 'Our Mission',
    missionText: isAr ? data.missionAr : data.missionEn,
    ctaTitle: isAr ? 'هل لديك أي استفسار عقاري؟' : 'Have a Real Estate Inquiry?',
    ctaDesc: isAr ? 'نحن هنا لمساعدتك في اتخاذ القرار الاستثماري الصحيح. تواصل معنا مباشرة عبر الواتساب.' : 'We are here to help you make the right investment decision. Contact us directly via WhatsApp.',
    ctaBtn: isAr ? 'تواصل معنا عبر واتساب' : 'Contact us via WhatsApp'
  };

  const breadcrumbItems = [{ label: isAr ? 'من نحن' : 'About Us' }];

  return (
    <main className="min-h-screen bg-white text-slate-900 overflow-x-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] md:h-[80vh] w-full flex items-center justify-center text-center overflow-hidden bg-slate-950">
        {data.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={urlFor(data.heroImage).width(1920).quality(90).url()}
              alt={t.heroTitle || 'About Us'}
              fill
              className="object-cover brightness-[0.4] scale-105 animate-slow-zoom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60 md:opacity-40" />
          </div>
        )}
        
        <div className="relative z-10 px-6 max-w-5xl w-full pt-32 md:pt-40">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/90 text-xs md:text-sm font-black uppercase tracking-[0.2em]">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>
          
          <h1 className="text-4xl md:text-8xl font-black text-white mb-8 drop-shadow-2xl italic uppercase tracking-tighter leading-[1.1]">
            {t.heroTitle}
          </h1>
          <div className="w-24 h-2 bg-[#C02026] mx-auto rounded-full shadow-[0_0_20px_rgba(192,32,38,0.5)]"></div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      {data.stats && data.stats.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 relative z-20 -mt-12 md:-mt-16">
            <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-6 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                {data.stats.map((stat, idx) => (
                <div key={idx} className="relative group flex flex-col items-center">
                    {idx !== 0 && (
                      <div className="hidden lg:block absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-slate-100"></div>
                    )}
                    <span className="text-2xl md:text-3xl font-black text-[#C02026] block mb-1 transition-transform duration-500 group-hover:scale-110">
                    {stat.number}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] leading-tight max-w-[120px]">
                    {isAr ? stat.labelAr : stat.labelEn}
                    </span>
                </div>
                ))}
            </div>
        </div>
      )}

      {/* 3. OUR STORY */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-32 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="border-s-8 border-[#C02026] ps-6 md:ps-8">
                <span className="text-[#C02026] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">{isAr ? 'رحلتنا' : 'Our Journey'}</span>
                <h2 className="text-3xl md:text-6xl font-black text-slate-950 leading-[1.1] italic uppercase tracking-tighter">{t.storyTitle}</h2>
            </div>
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-[1.8] md:leading-[2] text-justify font-medium opacity-90">
              <PortableText value={t.storyContent} />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
               <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                  <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:bg-[#C02026] transition-colors duration-500">
                    <CheckCircle className="text-[#C02026] group-hover:text-white w-7 h-7" />
                  </div>
                  <span className="font-black text-slate-900 text-sm uppercase tracking-wider">{isAr ? 'شفافية كاملة' : 'Full Transparency'}</span>
               </div>
               <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                  <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:bg-[#C02026] transition-colors duration-500">
                    <Users className="text-[#C02026] group-hover:text-white w-7 h-7" />
                  </div>
                  <span className="font-black text-slate-900 text-sm uppercase tracking-wider">{isAr ? 'دعم احترافي' : 'Pro Support'}</span>
               </div>
            </div>
          </div>

          <div className="relative group order-1 lg:order-2">
            <div className="absolute -inset-4 bg-red-100/30 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative h-[400px] md:h-[750px] w-full rounded-[4rem] overflow-hidden shadow-2xl border-[12px] md:border-[20px] border-white transition-transform duration-1000 group-hover:scale-[1.01]">
              {data.storyImage && (
                <Image
                  src={urlFor(data.storyImage).width(1200).quality(100).url()}
                  alt="Platform Real Estate"
                  fill
                  className="object-cover transition-transform duration-[5s] group-hover:scale-110"
                />
              )}
            </div>
            <div className="absolute -bottom-6 ltr:-right-4 rtl:-left-4 md:ltr:right-10 md:rtl:left-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl flex items-center gap-4 md:gap-6 border border-slate-50">
               <div className="w-12 h-12 md:w-16 md:h-16 bg-[#C02026] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-900/20"><Award size={32} /></div>
               <div className="font-black text-slate-950 uppercase text-[10px] md:text-xs tracking-tighter leading-tight">
                  {isAr ? 'الأكثر موثوقية' : 'Most Trusted'} <br/> <span className="text-[#C02026] font-black text-base md:text-lg tracking-normal">2026</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISION & MISSION */}
      <section className="bg-slate-50 py-24 md:py-48 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-[150px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 md:mb-32 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-7xl font-black text-slate-950 mb-6 md:mb-10 italic uppercase tracking-tighter leading-none">{isAr ? 'بوصلة أهدافنا' : 'Strategic Focus'}</h2>
              <p className="text-slate-500 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">{isAr ? 'لا نكتفي ببيع العقار، بل نؤمن لك مستقبل استثمارك.' : 'We don’t just sell real estate, we secure your investment future.'}</p>
              <div className="h-2 w-24 bg-[#C02026] mx-auto rounded-full mt-10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
            <div className="bg-white p-10 md:p-24 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all duration-700 border border-white group hover:-translate-y-4">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-12 group-hover:bg-[#C02026] transition-all duration-700 group-hover:rotate-12">
                <Lightbulb size={45} className="text-[#C02026] group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-slate-950 mb-8 italic uppercase flex items-center gap-5">
                {t.visionTitle}
                <ArrowUpRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#C02026]" />
              </h3>
              <p className="text-slate-600 leading-[2] text-lg md:text-xl font-medium opacity-90">{t.visionText}</p>
            </div>
            <div className="bg-white p-10 md:p-24 rounded-[4rem] shadow-sm hover:shadow-2xl transition-all duration-700 border border-white group hover:-translate-y-4">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-12 group-hover:bg-[#C02026] transition-all duration-700 group-hover:rotate-12">
                <Target size={45} className="text-[#C02026] group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-slate-950 mb-8 italic uppercase flex items-center gap-5">
                {t.missionTitle}
                <ArrowUpRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#C02026]" />
              </h3>
              <p className="text-slate-600 leading-[2] text-lg md:text-xl font-medium opacity-90">{t.missionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ✅ NEW CTA SECTION - WhatsApp Integration */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative bg-slate-950 rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 overflow-hidden text-center shadow-2xl shadow-red-950/20">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/20 blur-[100px] rounded-full -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 blur-[80px] rounded-full -ml-20 -mb-20"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-6xl font-black text-white mb-6 italic uppercase tracking-tighter leading-tight">
              {t.ctaTitle}
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
              {t.ctaDesc}
            </p>
            
            <a 
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-10 py-5 bg-[#C02026] hover:bg-white hover:text-[#C02026] text-white rounded-2xl font-black uppercase italic tracking-wider transition-all duration-500 group shadow-xl shadow-red-900/40 hover:-translate-y-2"
            >
              <MessageCircle className="w-6 h-6 animate-pulse" />
              {t.ctaBtn}
              <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}