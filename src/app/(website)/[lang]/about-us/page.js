import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { CONTACT_INFO } from '@/components/constants/contact';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { Target, Lightbulb, Users, CheckCircle, Award, ArrowUpRight, MessageCircle } from 'lucide-react';

// ✅ PERFORMANCE: ISR لتحديث البيانات كل ساعة تلقائياً
export const revalidate = 3600; 

const BASE_URL = 'https://platformrealestate.co';

// دالة حماية النصوص
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
 * ✅ SEO Metadata: تحسين الروابط والسيطرة اليدوية المطلقة
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const data = await getAboutData();

  const title = getSafeText(isAr ? (data?.seo?.metaTitleAr || data?.heroTitleAr) : (data?.seo?.metaTitleEn || data?.heroTitleEn));
  const desc = getSafeText(isAr ? data?.seo?.metaDescAr : data?.seo?.metaDescEn);
  
  const currentPath = `${BASE_URL}/${lang}/about-us/`;

  return {
    // 🚀 استخدام absolute لضمان السيطرة اليدوية من سانتي فقط
    title: {
      absolute: title,
    },
    description: desc,
    alternates: { 
      canonical: currentPath,
      languages: { 
        'ar': `${BASE_URL}/ar/about-us/`, 
        'en': `${BASE_URL}/en/about-us/`,
      }
    },
    openGraph: {
      title,
      description: desc,
      url: currentPath,
      images: data?.seo?.ogImage ? [{ url: data.seo.ogImage }] : [`${BASE_URL}/og-about.jpg`],
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
    trustLabel: isAr ? 'الوسيط الأكثر ثقة' : 'Industry Authority',
    ctaTitle: isAr ? 'هل تبحث عن استثمار آمن؟' : 'Seeking a Secure Investment?',
    ctaDesc: isAr ? 'خبراؤنا متاحون الآن لمساعدتك في اتخاذ القرار الاستثماري الأذكى.' : 'Our experts are ready to guide you toward the smartest investment.',
    ctaBtn: isAr ? 'استشارة فورية مجانية' : 'Instant VIP Access',
    waText: isAr ? 'أريد استشارة عقارية متخصصة من بلاتفورم' : 'I need a bespoke property consultation from Platform'
  };

  const breadcrumbItems = [
    { label: isAr ? 'من نحن' : 'About Us', href: `/${lang}/about-us/` }
  ];

  // 🏆 [SEO] Schema Markup - RealEstateAgent
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn,
    'url': `${BASE_URL}/${lang}/about-us/`,
    'logo': `${BASE_URL}/logo.webp`,
    'image': `${BASE_URL}/og-about.jpg`,
    'description': getSafeText(isAr ? data?.seo?.metaDescAr : data?.seo?.metaDescEn),
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': isAr ? '43، المنطقه العاشره اللوتس الجنوبيه' : '43, 10th District, South Lotus',
      'addressLocality': 'New Cairo',
      'addressRegion': 'Cairo',
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
    <main className={`min-h-screen bg-white ${isAr ? 'font-almarai' : 'font-jakarta'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* 🚀 Hero Section */}
      <header className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center text-center overflow-hidden bg-[#080A0D]">
        {data.heroImage && (
          <div className="absolute inset-0">
           <Image
              src={urlFor(data.heroImage).url()}
              alt={t.heroTitle}
              fill
              className="object-cover opacity-40 animate-slow-zoom"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white" />
          </div>
        )}
        <div className="relative z-10 px-6 max-w-6xl pt-32 animate-fade-in">
          <nav className="inline-flex justify-center mb-12"><Breadcrumbs items={breadcrumbItems} lang={lang} /></nav>
          <h1 className="text-5xl md:text-[8.5rem] font-black text-white italic uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
            {t.heroTitle}
          </h1>
        </div>
      </header>

      {/* 📊 Stats Section */}
      <section className="max-w-6xl mx-auto px-6 relative z-20 -mt-24">
        <div className="bg-white/95 backdrop-blur-xl rounded-[4rem] shadow-premium p-10 md:p-20 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center border border-slate-100">
          {data.stats?.map((stat, idx) => (
            <div key={idx} className="space-y-3">
              <span className="text-5xl md:text-7xl font-black text-[#C02026] italic tracking-tighter">{stat.number}</span>
              <span className="block text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">{isAr ? stat.labelAr : stat.labelEn}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 📖 Story Section */}
      <section className="max-w-7xl mx-auto px-6 py-32 md:py-60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 text-start">
            <div className="border-s-[12px] border-[#C02026] ps-10">
                <h2 className="text-6xl md:text-[7rem] font-black text-slate-950 leading-none italic uppercase tracking-tighter">{t.storyTitle}</h2>
            </div>
            <div className="prose prose-2xl text-slate-600 italic leading-relaxed font-medium">
              <PortableText value={isAr ? data.storyContentAr : data.storyContentEn} />
            </div>
          </div>
          <div className="relative group">
            <div className="relative h-[600px] md:h-[850px] rounded-[5rem] overflow-hidden border-[20px] border-white shadow-premium transition-transform duration-1000 group-hover:scale-[1.02]">
              {data.storyImage && (
                <Image 
                  src={urlFor(data.storyImage).url()} 
                  alt="Platform Official Story" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
            <div className={`absolute -bottom-12 ${isAr ? '-left-8' : '-right-8'} bg-[#080A0D] text-white p-12 rounded-[3.5rem] shadow-2xl border-b-[12px] border-[#C02026]`}>
                <p className="font-bold uppercase text-[10px] tracking-[0.3em] text-slate-400 mb-3">{t.trustLabel}</p>
                <p className="font-black text-4xl italic tracking-tighter uppercase">Est. 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* 💡 Vision & Mission */}
      <section className="bg-slate-50 py-40 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { icon: Lightbulb, title: t.visionTitle, text: isAr ? data.visionAr : data.visionEn },
            { icon: Target, title: t.missionTitle, text: isAr ? data.missionAr : data.missionEn }
          ].map((card, i) => (
            <div key={i} className="bg-white p-14 md:p-24 rounded-[5rem] shadow-sm hover:shadow-premium transition-all duration-700 group border border-white">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-12 group-hover:bg-[#C02026] transition-colors">
                <card.icon size={48} className="text-[#C02026] group-hover:text-white" />
              </div>
              <h3 className="text-5xl font-black text-slate-950 mb-8 italic uppercase tracking-tighter">{card.title}</h3>
              <p className="text-slate-600 text-xl leading-relaxed italic opacity-90">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📞 Final CTA */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="bg-[#080A0D] rounded-[5rem] p-16 md:p-36 text-center relative overflow-hidden shadow-2xl border-b-[20px] border-[#C02026] group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="relative z-10 space-y-12">
            <h2 className="text-6xl md:text-[9rem] font-black text-white italic uppercase tracking-tighter leading-tight">{t.ctaTitle}</h2>
            <p className="text-slate-400 text-xl md:text-3xl italic max-w-4xl mx-auto opacity-80">{t.ctaDesc}</p>
            <a 
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(t.waText)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-5 px-16 py-8 bg-[#25D366] text-white rounded-3xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl hover:-translate-y-2 active:scale-95"
            >
              <MessageCircle size={28} fill="currentColor" fillOpacity={0.2} />
              {t.ctaBtn}
              <ArrowUpRight size={24} />
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-premium { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.06); }
        .animate-slow-zoom { animation: slow-zoom 40s linear infinite alternate; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
      `}} />
    </main>
  );
}