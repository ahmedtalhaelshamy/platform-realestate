import Image from 'next/image';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { PortableText } from '@portabletext/react';
import { CONTACT_INFO } from '@/components/constants/contact';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { Target, Lightbulb, Users, CheckCircle, Award, ArrowUpRight, MessageCircle } from 'lucide-react';

// ✅ PERFORMANCE: ISR لضمان سرعة التحميل وتحديث البيانات دورياً
export const revalidate = 3600; 

const BASE_URL = 'https://platformrealestate.co';

const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
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
  return await client.fetch(query);
}

/**
 * ✅ SEO Metadata
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getAboutData();
  const baseUrl = BASE_URL;

  const title = getSafeText(isAr ? (data?.seo?.metaTitleAr || data?.heroTitleAr) : (data?.seo?.metaTitleEn || data?.heroTitleEn));
  const desc = getSafeText(isAr ? data?.seo?.metaDescAr : data?.seo?.metaDescEn);
  
  const arPath = `${baseUrl}/ar/about-us/`;
  const enPath = `${baseUrl}/en/about-us/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${title} | Platform`,
    description: desc,
    alternates: { 
      canonical: currentPath,
      languages: { 
        'ar-EG': arPath, 
        'en-US': enPath,
        'x-default': enPath 
      }
    },
    openGraph: {
      title,
      description: desc,
      url: currentPath,
      images: data?.seo?.ogImage ? [{ url: data.seo.ogImage }] : [`${baseUrl}/og-about.jpg`],
      locale: isAr ? 'ar_EG' : 'en_US',
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
    trustLabel: isAr ? 'الوسيط الأكثر ثقة' : 'Industry Authority',
    ctaTitle: isAr ? 'هل تبحث عن استثمار آمن؟' : 'Seeking a Secure Investment?',
    ctaDesc: isAr ? 'خبراؤنا متاحون الآن لمساعدتك في اتخاذ القرار الاستثماري الأذكى.' : 'Our experts are ready to guide you toward the smartest investment.',
    ctaBtn: isAr ? 'استشارة فورية مجانية' : 'Instant VIP Access',
    waText: isAr ? 'أريد استشارة عقارية متخصصة' : 'I need a bespoke property consultation'
  };

  const breadcrumbItems = [
    { label: isAr ? 'من نحن' : 'About Us', href: `/${lang}/about-us/` }
  ];

  // 🏆 [SEO] Schema Markup - تم تحديث الموقع بناءً على رابط الخريطة الجديد
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn,
    'url': `${BASE_URL}/${lang}/about-us/`,
    'logo': `${BASE_URL}/logo.png`,
    'image': `${BASE_URL}/og-about.jpg`,
    'description': getSafeText(isAr ? data?.seo?.metaDescAr : data?.seo?.metaDescEn),
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': isAr ? '43، المنطقه العاشره اللوتس الجنوبيه' : '43, 10th District, South Lotus',
      'addressLocality': 'New Cairo',
      'addressRegion': 'Cairo',
      'postalCode': '11835',
      'addressCountry': 'EG'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 30.0180442,
      'longitude': 31.5164184
    },
    'telephone': '+201004011040'
  };

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {/* باقي الأقسام (Hero, Stats, Story, Vision, CTA) تظل كما هي */}
      <header className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center text-center overflow-hidden bg-[#080A0D]">
        {data.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={urlFor(data.heroImage).width(1920).quality(90).url()}
              alt={t.heroTitle}
              fill
              className="object-cover brightness-[0.4] animate-slow-zoom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white" />
          </div>
        )}
        <div className="relative z-10 px-6 max-w-6xl pt-32">
          <nav className="inline-flex justify-center mb-8"><Breadcrumbs items={breadcrumbItems} lang={lang} /></nav>
          <h1 className="text-4xl md:text-[8.5rem] font-black text-white italic uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
            {t.heroTitle}
          </h1>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 relative z-20 -mt-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-10 md:p-16 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center border border-slate-100">
          {data.stats?.map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <span className="text-4xl md:text-6xl font-black text-[#C02026] italic tracking-tighter">{stat.number}</span>
              <span className="block text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">{isAr ? stat.labelAr : stat.labelEn}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-32 md:py-56">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10 text-start">
            <div className="border-s-8 border-[#C02026] ps-8">
               <h2 className="text-5xl md:text-8xl font-black text-slate-950 leading-none italic uppercase tracking-tighter">{t.storyTitle}</h2>
            </div>
            <div className="prose prose-xl text-slate-600 italic leading-relaxed">
              <PortableText value={isAr ? data.storyContentAr : data.storyContentEn} />
            </div>
          </div>
          <div className="relative group">
            <div className="relative h-[500px] md:h-[750px] rounded-[4rem] overflow-hidden border-[15px] border-white shadow-2xl transition-transform duration-1000 group-hover:scale-[1.02]">
              {data.storyImage && (
                <Image src={urlFor(data.storyImage).width(1000).url()} alt="Platform Story" fill className="object-cover" />
              )}
            </div>
            <div className={`absolute -bottom-10 ${isAr ? '-left-5' : '-right-5'} bg-[#080A0D] text-white p-10 rounded-[3rem] shadow-2xl border-b-8 border-[#C02026]`}>
                <p className="font-bold uppercase text-[10px] tracking-widest text-slate-400 mb-2">{t.trustLabel}</p>
                <p className="font-black text-3xl italic tracking-tighter uppercase">Est. 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { icon: Lightbulb, title: t.visionTitle, text: isAr ? data.visionAr : data.visionEn },
            { icon: Target, title: t.missionTitle, text: isAr ? data.missionAr : data.missionEn }
          ].map((card, i) => (
            <div key={i} className="bg-white p-12 md:p-20 rounded-[4rem] shadow-sm hover:shadow-xl transition-all duration-700 group border border-white">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#C02026] transition-colors">
                <card.icon size={40} className="text-[#C02026] group-hover:text-white" />
              </div>
              <h3 className="text-4xl font-black text-slate-950 mb-6 italic uppercase tracking-tighter">{card.title}</h3>
              <p className="text-slate-600 text-lg leading-relaxed italic">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="bg-[#080A0D] rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden shadow-2xl border-b-[15px] border-[#C02026]">
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">{t.ctaTitle}</h2>
            <p className="text-slate-400 text-xl md:text-2xl italic max-w-3xl mx-auto">{t.ctaDesc}</p>
            <a 
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(t.waText)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-12 py-6 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl"
            >
              <MessageCircle size={24} fill="currentColor" fillOpacity={0.2} />
              {t.ctaBtn}
              <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-slow-zoom { animation: slow-zoom 30s linear infinite alternate; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
      `}} />
    </main>
  );
}