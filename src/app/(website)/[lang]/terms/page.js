import { ShieldCheck, Gavel, Scale, FileWarning, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { CONTACT_INFO } from '@/components/constants/contact';

// 1. أرشفة الصفحة (SEO) من Sanity
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const query = `*[_type == "termsPage"][0].seo`;
  const seo = await client.fetch(query);

  const title = isAr 
    ? (seo?.metaTitleAr || `الشروط والأحكام | ${CONTACT_INFO.siteNameAr}`)
    : (seo?.metaTitleEn || `Terms & Conditions | ${CONTACT_INFO.siteNameEn}`);

  const description = isAr 
    ? (seo?.metaDescAr || 'تعرف على شروط استخدام منصة بلاتفورم العقارية لضمان تجربة استثمارية آمنة.') 
    : (seo?.metaDescEn || 'Learn about the terms of use for Platform Real Estate to ensure a secure investment experience.');

  return {
    title,
    description,
    alternates: { canonical: `${CONTACT_INFO.domain}/${lang}/terms` },
    openGraph: {
      title,
      description,
      images: seo?.openGraphImage ? [{ url: urlFor(seo.openGraphImage).width(1200).url() }] : []
    }
  };
}

export default async function TermsPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  // جلب الـ H1 من السانتي لو موجود
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
    <main className="min-h-screen pt-32 pb-20 bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🔴 Hero Section */}
      <section className="relative py-24 overflow-hidden bg-slate-50 border-b border-red-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C02026]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex p-4 bg-red-50 text-[#C02026] rounded-3xl mb-8 animate-pulse shadow-lg shadow-red-200">
            <ShieldCheck size={48} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic uppercase tracking-tighter mb-6 leading-none">
            {h1Text ? h1Text : (
              <>{isAr ? 'الشروط' : 'Terms'} <span className="text-[#C02026]">{isAr ? 'والأحكام' : '& Conditions'}</span></>
            )}
          </h1>

          <div className="w-24 h-2 bg-[#C02026] mx-auto mb-8 rounded-full" />
          <p className="text-slate-500 max-w-2xl mx-auto font-bold text-lg leading-relaxed">
            {isAr 
              ? 'اتفاقية استخدام منصة بلاتفورم العقارية والقواعد المنظمة للتعاملات.' 
              : 'The usage agreement for Platform Real Estate and the rules governing transactions.'}
          </p>
        </div>
      </section>

      {/* 🔴 Terms Content */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {terms.map((item, index) => {
             const Icon = item.icon;
             return (
              <div key={index} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 hover:border-[#C02026]/30 transition-all duration-500 group">
                <div className="w-16 h-16 bg-red-50 text-[#C02026] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#C02026] group-hover:text-white transition-all duration-500 shadow-inner">
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#C02026] italic uppercase tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>
             );
          })}
        </div>

        {/* 🔴 CTA Section */}
        <div className="mt-24 p-10 md:p-16 bg-slate-950 rounded-[3.5rem] text-white relative overflow-hidden group shadow-2xl shadow-red-950/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/20 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:scale-125 transition-transform duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-start">
              <h4 className="text-3xl md:text-5xl font-black italic uppercase mb-4 tracking-tight">
                {isAr ? 'هل لديك تساؤل قانوني؟' : 'Need Legal Support?'}
              </h4>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                {isAr 
                  ? 'مستشارونا العقاريون جاهزون لتوضيح كافة البنود التعاقدية لضمان استثمار آمن.' 
                  : 'Our consultants are ready to clarify all contractual terms to ensure a safe investment.'}
              </p>
            </div>
            <Link 
              href={`/${lang}/#contact`}
              className="bg-[#C02026] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 flex items-center gap-3 shadow-xl active:scale-95 text-center"
            >
              <MessageCircle size={20} />
              {isAr ? 'تحدث معنا الآن' : 'Speak with Us'}
            </Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        ::selection { background-color: #C02026; color: white; }
      `}} />
    </main>
  );
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}