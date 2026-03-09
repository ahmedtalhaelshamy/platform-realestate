import { ShieldCheck, Gavel, Scale, FileWarning, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { CONTACT_INFO } from '@/components/constants/contact';
import Breadcrumbs from '@/components/Breadcrumbs'; 

/**
 * 🛠️ دالة الأمان لمنع خطأ الـ Objects
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

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export const revalidate = 3600;

/**
 * ✅ SEO Metadata: السيطرة اليدوية المطلقة وتوجيه الصور لـ Bunny
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const baseUrl = 'https://platformrealestate.co';
  const currentUrl = `${baseUrl}/${lang}/terms/`;

  const query = `*[_type == "termsPage"][0].seo`;
  const seo = await client.fetch(query);

  const title = isAr 
    ? getSafeText(seo?.metaTitleAr || `الشروط والأحكام | ${CONTACT_INFO.siteNameAr}`)
    : getSafeText(seo?.metaTitleEn || `Terms & Conditions | ${CONTACT_INFO.siteNameEn}`);

  const description = isAr 
    ? getSafeText(seo?.metaDescAr || 'تعرف على شروط استخدام منصة بلاتفورم العقارية لضمان تجربة استثمارية آمنة.') 
    : getSafeText(seo?.metaDescEn || 'Learn about the terms of use for Platform Real Estate to ensure a secure investment experience.');

  // توجيه صورة الـ OG لـ Bunny لضمان سرعة المعاينة
  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).url() 
    : `${baseUrl}/og-image.jpg`;

  return {
    // 🚀 استخدام absolute لضمان السيطرة اليدوية ومنع التكرار
    title: {
      absolute: title,
    },
    description: description,
    metadataBase: new URL(baseUrl),
    alternates: { 
      canonical: currentUrl,
      languages: {
        'ar': `${baseUrl}/ar/terms/`,
        'en': `${baseUrl}/en/terms/`,
        'x-default': `${baseUrl}/ar/terms/`,
      }
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      images: [{ 
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title
      }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

export default async function TermsPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const seoData = await client.fetch(`*[_type == "termsPage"][0].seo`);
  const h1Text = isAr ? seoData?.h1Ar : seoData?.h1En;

  // ✅ SEO: بيانات منظمة لتعزيز الموثوقية
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": isAr ? "الشروط والأحكام" : "Terms and Conditions",
    "description": isAr ? "اتفاقية الاستخدام لمنصة بلاتفورم" : "Platform usage agreement",
    "publisher": {
      "@type": "Organization",
      "name": "Platform Real Estate"
    }
  };

  const terms = [
    {
      title: isAr ? "دقة المعلومات والأسعار" : "Info Accuracy",
      icon: Scale,
      content: isAr 
        ? "نحن نبذل قصارى جهدنا لضمان دقة الأسعار والمساحات، ولكن جميع البيانات مستمدة من المطورين العقاريين وقد تخضع للتعديل بناءً على تحديثات السوق دون إخطار مسبق." 
        : "We strive for pricing accuracy; however, all data is developer-sourced and subject to market fluctuations without prior notice."
    },
    {
      title: isAr ? "المسؤولية القانونية" : "Legal Responsibility",
      icon: FileWarning,
      content: isAr 
        ? "تعمل بلاتفورم كبوابة تسويقية واستشارية. المسؤولية النهائية عن جودة التنفيذ وصياغة العقود تقع قانونياً على عاتق المطور العقاري صاحب المشروع." 
        : "Platform acts as an advisory portal. Final legal responsibility for project execution and contracts lies solely with the project developer."
    },
    {
      title: isAr ? "حقوق الملكية الفكرية" : "Intellectual Property",
      icon: Gavel,
      content: isAr 
        ? "المحتوى المرئي والتحليلات الخاصة بنا هي ملكية فكرية محمية. يمنع اقتباسها أو إعادة نشرها لأغراض تجارية دون موافقة خطية صريحة." 
        : "All visual content and expert analyses are protected. Commercial reproduction is strictly prohibited without explicit written consent."
    }
  ];

  return (
    <main 
      className={`min-h-screen pt-32 pb-20 bg-white selection:bg-brand-red selection:text-white ${isAr ? 'font-almarai' : 'font-jakarta'}`} 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      
      <section className="relative py-24 overflow-hidden bg-brand-gray-50 border-b border-slate-100" aria-labelledby="main-heading">
        <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-10">
             <Breadcrumbs items={[{ label: isAr ? 'الشروط والأحكام' : 'Terms' }]} lang={lang} />
          </div>
          <div className="inline-flex p-5 bg-white text-brand-red rounded-[2rem] mb-10 shadow-premium border border-red-50 animate-bounce" aria-hidden="true">
            <ShieldCheck size={48} strokeWidth={1.5} />
          </div>
          
          <h1 id="main-heading" className={`text-4xl md:text-7xl font-black text-brand-dark uppercase mb-8 leading-[1.1] ${isAr ? 'tracking-normal px-4' : 'italic tracking-tighter'}`}>
            {h1Text ? h1Text : (
              <>{isAr ? 'الشروط' : 'Terms'} <span className="text-brand-red">{isAr ? 'والأحكام' : '& Conditions'}</span></>
            )}
          </h1>

          <div className="w-24 h-1.5 bg-brand-red mx-auto mb-10 rounded-full" aria-hidden="true" />
          
          <p className="text-slate-700 max-w-2xl mx-auto font-bold text-lg md:text-xl leading-relaxed opacity-80">
            {isAr 
              ? 'اتفاقية استخدام منصة بلاتفورم العقارية والقواعد المنظمة للتعاملات الاستثمارية.' 
              : 'The official usage agreement for Platform Real Estate governing all premium investment transactions.'}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24" aria-label={isAr ? "بنود الاستخدام" : "Usage Terms"}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12" role="list">
          {terms.map((item, index) => {
             const Icon = item.icon;
             return (
              <article 
                key={index} 
                className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-premium hover:border-brand-red/20 transition-all duration-500 group hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-brand-gray-50 text-slate-400 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shadow-inner" aria-hidden="true">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h2 className={`text-2xl font-black text-brand-dark uppercase mb-6 group-hover:text-brand-red transition-colors text-start ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
                  {item.title}
                </h2>
                <p className="text-slate-600 leading-relaxed font-medium text-lg text-justify">
                  {item.content}
                </p>
              </article>
             );
          })}
        </div>

        <div className="mt-32 p-10 md:p-20 bg-brand-dark rounded-[4rem] text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 end-0 w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] -me-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" aria-hidden="true" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-start">
            <div className="max-w-2xl text-center lg:text-start space-y-6">
              <h2 className={`text-3xl md:text-5xl font-black text-white uppercase leading-none ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
                {isAr ? 'هل لديك تساؤل قانوني؟' : 'Need Legal Support?'}
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic">
                {isAr 
                  ? 'مستشارونا العقاريون متاحون لتوضيح كافة البنود التعاقدية لضمان استثمار آمن وموثوق 100%.' 
                  : 'Our elite consultants are available to clarify all contractual terms to ensure a 100% secure investment.'}
              </p>
            </div>
            
            <Link 
              href={`/${lang}/contact/`}
              aria-label={isAr ? "تواصل معنا للاستفسار القانوني" : "Contact us for legal inquiry"}
              className="bg-white text-brand-dark px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all duration-500 flex items-center gap-4 shadow-2xl active:scale-95 shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            >
              <MessageCircle size={24} aria-hidden="true" className="opacity-40" />
              {isAr ? 'تحدث معنا الآن' : 'Speak with Us'}
            </Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
      `}} />
    </main>
  );
}