import { ShieldCheck, Gavel, Scale, FileWarning, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ دالة الأمان لمنع خطأ الـ Objects
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

// 1. أرشفة الصفحة (SEO) - تحسين الروابط والـ Metadata
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');

  const query = `*[_type == "termsPage"][0].seo`;
  const seo = await client.fetch(query);

  const title = isAr 
    ? getSafeText(seo?.metaTitleAr || `الشروط والأحكام | ${CONTACT_INFO.siteNameAr}`)
    : getSafeText(seo?.metaTitleEn || `Terms & Conditions | ${CONTACT_INFO.siteNameEn}`);

  const description = isAr 
    ? getSafeText(seo?.metaDescAr || 'تعرف على شروط استخدام منصة بلاتفورم العقارية لضمان تجربة استثمارية آمنة.') 
    : getSafeText(seo?.metaDescEn || 'Learn about the terms of use for Platform Real Estate to ensure a secure investment experience.');

  // تحسين: استخدام auto('format') لضمان تحويل صورة المشاركة لـ WebP تلقائياً
  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).auto('format').url() 
    : `${baseUrl}/og-image.jpg`;

  return {
    title: title,
    description: description,
    alternates: { 
      // ✅ توحيد السلاش النهائية للسيو
      canonical: `${baseUrl}/${lang}/terms/` 
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/terms/`,
      images: [{ 
        url: ogImageUrl,
        width: 1200,
        height: 630,
      }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

export default async function TermsPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  // جلب البيانات من Sanity
  const seoData = await client.fetch(`*[_type == "termsPage"][0].seo`);
  const h1Text = isAr ? seoData?.h1Ar : seoData?.h1En;

  const terms = [
    {
      title: isAr ? "دقة المعلومات والأسعار" : "Information & Pricing Accuracy",
      icon: Scale,
      content: isAr 
        ? "نحن نبذل قصارى جهدنا لضمان دقة الأسعار والمساحات، ولكن جميع البيانات مستمدة من المطورين العقاريين وقد تخضع للتعديل بناءً على تحديثات السوق أو قرارات المطور دون إخطار مسبق." 
        : "We strive to ensure accuracy in pricing and areas. However, all data is provided by developers and is subject to change based on market updates or developer decisions without prior notice."
    },
    {
      title: isAr ? "إخلاء المسؤولية القانونية" : "Legal Disclaimer",
      icon: FileWarning,
      content: isAr 
        ? "تعمل منصة بلاتفورم كبوابة تسويقية واستشارية. المسؤولية القانونية النهائية عن جودة التنفيذ، مواعيد الاستلام، وصياغة العقود تقع على عاتق المطور العقاري صاحب المشروع." 
        : "Platform acts as a marketing and advisory portal. Final legal responsibility for execution quality, delivery dates, and contracts lies with the project developer."
    },
    {
      title: isAr ? "حقوق النشر والملكية" : "Copyright & Ownership",
      icon: Gavel,
      content: isAr 
        ? "المحتوى المرئي والنصوص والتحليلات الخاصة بالمحررين هي ملكية فكرية محمية. يمنع منعاً باتاً اقتباسها أو إعادة نشرها لأغراض تجارية دون الحصول على موافقة خطية منا." 
        : "Visual content, text, and expert analyses are protected intellectual property. Unauthorized reproduction or commercial use is strictly prohibited without our written consent."
    }
  ];

  return (
    <main 
      className="min-h-screen pt-32 pb-20 bg-white selection:bg-[#C02026] selection:text-white" 
      dir={isAr ? 'rtl' : 'ltr'}
      aria-labelledby="main-heading"
    >
      
      {/* 🔴 Hero Section - Visual Identity */}
      <section className="relative py-24 overflow-hidden bg-slate-50 border-b border-slate-100" aria-labelledby="terms-hero-title">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C02026]/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex p-5 bg-white text-[#C02026] rounded-[2rem] mb-10 shadow-[0_20px_50px_rgba(192,32,38,0.15)] border border-red-50 animate-bounce">
            <ShieldCheck size={48} strokeWidth={1.5} />
          </div>
          
          <h1 id="main-heading" className="text-4xl md:text-7xl font-black text-slate-950 italic uppercase tracking-tighter mb-8 leading-none">
            {h1Text ? h1Text : (
              <>{isAr ? 'الشروط' : 'Terms'} <span className="text-[#C02026]">{isAr ? 'والأحكام' : '& Conditions'}</span></>
            )}
          </h1>

          <div className="w-24 h-1.5 bg-[#C02026] mx-auto mb-10 rounded-full" aria-hidden="true" />
          
          <p className="text-slate-600 max-w-2xl mx-auto font-medium text-lg md:text-xl leading-relaxed italic">
            {isAr 
              ? 'اتفاقية استخدام منصة بلاتفورم العقارية والقواعد المنظمة للتعاملات الاستثمارية.' 
              : 'The usage agreement for Platform Real Estate and the rules governing investment transactions.'}
          </p>
        </div>
      </section>

      {/* 🔴 Terms Content Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24" aria-label="Detailed Terms">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {terms.map((item, index) => {
             const Icon = item.icon;
             return (
              <article 
                key={index} 
                className="p-10 rounded-[3rem] bg-white border border-slate-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:border-[#C02026]/20 transition-all duration-500 group hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#C02026] group-hover:text-white transition-all duration-500 shadow-inner">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight mb-6 group-hover:text-[#C02026] transition-colors text-start">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium text-lg text-justify">
                  {item.content}
                </p>
              </article>
             );
          })}
        </div>

        {/* 🔴 CTA Section - Premium Footer Card */}
        <div className="mt-32 p-10 md:p-20 bg-slate-950 rounded-[4rem] text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" aria-hidden="true" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-start">
            <div className="max-w-2xl text-center lg:text-start space-y-6">
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                {isAr ? 'هل لديك تساؤل قانوني؟' : 'Need Legal Support?'}
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic">
                {isAr 
                  ? 'مستشارونا العقاريون متاحون لتوضيح كافة البنود التعاقدية لضمان استثمار آمن وموثوق 100%.' 
                  : 'Our consultants are available to clarify all contractual terms to ensure a 100% safe investment.'}
              </p>
            </div>
            
            <Link 
              href={`/${lang}/contact/`}
              aria-label={isAr ? "تحدث مع مستشارك القانوني" : "Speak with a legal consultant"}
              className="bg-white text-slate-950 px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#C02026] hover:text-white transition-all duration-500 flex items-center gap-4 shadow-2xl active:scale-95 text-center shrink-0"
            >
              <MessageCircle size={24} fill="currentColor" className="opacity-20" />
              {isAr ? 'تحدث معنا الآن' : 'Speak with Us'}
            </Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth !important; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}