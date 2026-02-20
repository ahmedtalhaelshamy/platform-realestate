import Image from 'next/image';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { PortableText } from '@portabletext/react';
import { CONTACT_INFO } from '@/components/constants/contact';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { Target, Lightbulb, Users, CheckCircle, Award, ArrowUpRight, MessageCircle } from 'lucide-react';

// ✅ PERFORMANCE: ISR كل ساعة لضمان التحديث التلقائي
export const revalidate = 3600; 

// 🏁 الدومين الموحد المعتمد للسيو
const BASE_URL = 'https://platformrealestate.co';

// ✅ دالة الأمان المحسنة لمنع خطأ الـ Objects كأبناء لـ React
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

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

async function getAboutData() {
  const query = `*[_type == "aboutPage"][0]{
    ...,
    "seo": seo {
      metaTitleAr, metaTitleEn, metaDescAr, metaDescEn,
      "ogImage": openGraphImage.asset->url
    }
  }`;
  try {
    return await client.fetch(query);
  } catch (err) {
    console.error("Sanity About Page Error:", err);
    return null;
  }
}

/**
 * ✅ SEO Metadata (International Routing)
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getAboutData();
  const baseUrl = BASE_URL;

  const title = getSafeText(isAr ? (data?.seo?.metaTitleAr || data?.heroTitleAr) : (data?.seo?.metaTitleEn || data?.heroTitleEn));
  const desc = getSafeText(isAr ? data?.seo?.metaDescAr : data?.seo?.metaDescEn);
  
  const arPath = `${baseUrl}/ar/about/`;
  const enPath = `${baseUrl}/en/about/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${title} | Platform`,
    description: desc,
    alternates: { 
      canonical: currentPath,
      languages: { 'ar': arPath, 'en': enPath }
    },
    openGraph: {
      title,
      description: desc,
      url: currentPath,
      images: data?.seo?.ogImage ? [{ url: data.seo.ogImage }] : [`${baseUrl}/og-about.jpg`],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getAboutData();

  if (!data) return null;

  const t = {
    heroTitle: getSafeText(isAr ? data.heroTitleAr : data.heroTitleEn),
    storyTitle: getSafeText(isAr ? data.storyTitleAr : data.storyTitleEn),
    visionTitle: isAr ? 'رؤيتنا' : 'Our Vision',
    missionTitle: isAr ? 'مهمتنا' : 'Our Mission',
    ctaTitle: isAr ? 'هل تبحث عن استثمار آمن؟' : 'Seeking a Secure Investment?',
    ctaDesc: isAr ? 'خبراؤنا متاحون الآن لمساعدتك في اتخاذ القرار الاستثماري الأذكى في السوق المصري.' : 'Our experts are ready to guide you toward the smartest investment in the Egyptian market.',
  };

  const breadcrumbItems = [
    { label: isAr ? 'من نحن' : 'About Us', href: `/${lang}/about/` }
  ];

  // 🏆 [SEO] Schema Markup - Organization
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn,
    'url': `${BASE_URL}/${lang}/about/`,
    'logo': `${BASE_URL}/logo.png`,
    'description': getSafeText(isAr ? data?.seo?.metaDescAr : data?.seo?.metaDescEn),
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'New Cairo',
      'addressCountry': 'EG'
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      
      {/* 🚀 1. PREMIUM HERO SECTION */}
      <header className="relative min-h-[70vh] md:min-h-[85vh] w-full flex items-center justify-center text-center overflow-hidden bg-[#080A0D]">
        {data.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={urlFor(data.heroImage).width(1920).quality(90).url()}
              alt={t.heroTitle}
              fill
              className="object-cover brightness-[0.5] scale-105 animate-slow-zoom"
              priority
            />
            {/* Ambient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#080A0D]/50 via-transparent to-white" aria-hidden="true" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C02026] via-transparent to-transparent" aria-hidden="true" />
          </div>
        )}
        
        <div className="relative z-10 px-6 max-w-6xl w-full pt-40 md:pt-48">
          <nav className="inline-flex justify-center mb-10 overflow-x-auto hide-scrollbar" aria-label="Breadcrumb">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </nav>
          
          <h1 className="text-4xl md:text-[9rem] font-black text-white mb-10 italic uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
            {t.heroTitle}
          </h1>
          <div className="w-28 h-2 bg-[#C02026] mx-auto rounded-full shadow-[0_0_30px_rgba(192,32,38,0.6)] animate-pulse" aria-hidden="true" />
        </div>
      </header>

      {/* 📊 2. STATS SECTION - Floating UI */}
      {data.stats && data.stats.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 relative z-20 -mt-16 md:-mt-24" aria-label="Company Statistics">
            <div className="bg-white/90 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 p-8 md:p-14 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
                {data.stats.map((stat, idx) => (
                <div key={idx} className="relative group flex flex-col items-center">
                    {idx !== 0 && (
                      <div className="hidden lg:block absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-slate-100" aria-hidden="true" />
                    )}
                    <span className="text-3xl md:text-5xl font-black text-[#C02026] block mb-2 transition-transform duration-700 group-hover:scale-110 italic tracking-tighter">
                      {stat.number}
                    </span>
                    <span className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-[0.2em] leading-tight max-w-[140px] italic">
                      {isAr ? stat.labelAr : stat.labelEn}
                    </span>
                </div>
                ))}
            </div>
        </section>
      )}

      {/* 📜 3. OUR STORY SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 py-24 md:py-48" aria-labelledby="story-heading">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-40 items-center">
          <div className="space-y-12 order-2 lg:order-1 text-start">
            <header className="border-s-[12px] border-[#C02026] ps-8">
                <span className="text-[#C02026] font-black uppercase tracking-[0.4em] text-[11px] mb-4 block">{isAr ? 'قصة نجاحنا' : 'The Legacy'}</span>
                <h2 id="story-heading" className="text-4xl md:text-7xl font-black text-slate-950 leading-[0.9] italic uppercase tracking-tighter">{t.storyTitle}</h2>
            </header>
            
            <div className="prose prose-xl prose-slate max-w-none text-slate-600 leading-relaxed text-justify font-medium italic opacity-95">
              <PortableText value={isAr ? data.storyContentAr : data.storyContentEn} />
            </div>
            
            {/* Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
                {[
                  { icon: CheckCircle, label: isAr ? 'شفافية استثمارية' : 'Financial Integrity' },
                  { icon: Users, label: isAr ? 'استشارات حصرية' : 'Elite Support' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-8 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-700 group hover:-translate-y-2">
                    <div className="bg-white p-5 rounded-2xl shadow-xl group-hover:bg-[#C02026] transition-all duration-700">
                      <item.icon size={32} className="text-[#C02026] group-hover:text-white" strokeWidth={1.5} />
                    </div>
                    <span className="font-black text-slate-950 text-sm md:text-base uppercase tracking-tighter italic">{item.label}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative group order-1 lg:order-2">
            <div className="absolute -inset-6 bg-red-100/40 rounded-[5rem] blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" aria-hidden="true" />
            <div className="relative h-[450px] md:h-[800px] w-full rounded-[4.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[15px] md:border-[25px] border-white transition-all duration-[1.5s] group-hover:rotate-1">
              {data.storyImage && (
                <Image
                  src={urlFor(data.storyImage).width(1200).quality(100).url()}
                  alt="Platform Real Estate Executive Board"
                  fill
                  className="object-cover transition-transform duration-[8s] group-hover:scale-110"
                />
              )}
            </div>
            
            {/* Trusted Badge */}
            <div className="absolute -bottom-8 ltr:-right-6 rtl:-left-6 md:ltr:right-12 md:rtl:left-12 bg-[#080A0D] text-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl flex items-center gap-6 border-b-[10px] border-[#C02026] animate-bounce-slow">
                <div className="w-16 h-16 bg-[#C02026] rounded-2xl flex items-center justify-center text-white shadow-2xl"><Award size={40} strokeWidth={1.5} /></div>
                <div className="text-start">
                  <p className="font-black uppercase text-[10px] md:text-xs tracking-[0.3em] text-slate-400 mb-1">{isAr ? 'الوسيط الأكثر ثقة' : 'Industry Authority'}</p>
                  <p className="font-black text-2xl md:text-3xl italic tracking-tighter uppercase leading-none">Est. 2026</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 4. VISION & MISSION - Strategic Cards */}
      <section className="bg-slate-50 py-32 md:py-56 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-[180px] -mr-64 -mt-64" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="text-center mb-24 md:mb-40 max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-8xl font-black text-slate-950 italic uppercase tracking-tighter leading-none">{isAr ? 'بوصلة أهدافنا' : 'The DNA'}</h2>
              <p className="text-slate-500 text-lg md:text-3xl font-medium leading-relaxed italic">{isAr ? 'مهمتنا ليست مجرد بيع العقارات، بل هندسة مستقبلك الاستثماري.' : 'We don’t navigate the market; we lead the way to your legacy.'}</p>
              <div className="h-2 w-32 bg-[#C02026] mx-auto rounded-full" aria-hidden="true" />
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            {[
              { icon: Lightbulb, title: t.visionTitle, text: data.visionAr, textEn: data.visionEn },
              { icon: Target, title: t.missionTitle, text: data.missionAr, textEn: data.missionEn }
            ].map((card, i) => (
              <article key={i} className="bg-white p-12 md:p-28 rounded-[4.5rem] shadow-sm hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.1)] transition-all duration-1000 border border-white group hover:-translate-y-4">
                <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-16 group-hover:bg-[#C02026] transition-all duration-700 group-hover:rotate-12 shadow-inner">
                  <card.icon size={56} className="text-[#C02026] group-hover:text-white transition-all duration-500" strokeWidth={1.2} />
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-slate-950 mb-10 italic uppercase tracking-tighter flex items-center gap-6">
                  {card.title}
                  <ArrowUpRight className="opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 text-[#C02026]" size={48} />
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg md:text-2xl font-medium opacity-95 italic text-start">{isAr ? card.text : card.textEn}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 📞 5. HIGH-CONVERSION CTA */}
      <section className="max-w-[1440px] mx-auto px-6 py-24 md:py-40">
        <div className="relative bg-[#080A0D] rounded-[4.5rem] p-12 md:p-32 overflow-hidden text-center shadow-2xl border-b-[20px] border-[#C02026] group">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C02026]/15 blur-[120px] rounded-full -mr-48 -mt-48 group-hover:scale-125 transition-transform duration-1000" aria-hidden="true" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
              {t.ctaTitle}
            </h2>
            <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed italic">
              {t.ctaDesc}
            </p>
            
            <a 
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(isAr ? 'أريد استشارة عقارية متخصصة' : 'I need a bespoke property consultation')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact on WhatsApp"
              className="inline-flex items-center gap-5 px-14 py-8 bg-[#25D366] hover:bg-white hover:text-[#080A0D] text-white rounded-[2.5rem] font-black uppercase italic tracking-widest transition-all duration-700 group shadow-[0_30px_60px_rgba(37,211,102,0.2)] active:scale-95"
            >
              <MessageCircle size={32} fill="currentColor" fillOpacity={0.2} className="animate-pulse" />
              <span className="text-lg md:text-xl">{isAr ? 'استشارة فورية مجانية' : 'Instant VIP Access'}</span>
              <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 40s linear infinite alternate; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}