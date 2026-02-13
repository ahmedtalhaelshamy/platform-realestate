import { Shield, Lock, Eye, Mail, Phone, MapPin, Globe, Scale, ArrowLeftRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { client } from '@/sanity/client'; 
import { urlFor } from '@/sanity/image';

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const query = `*[_type == "privacyPage"][0].seo`;
  const seo = await client.fetch(query);

  const title = isAr 
    ? (seo?.metaTitleAr || `سياسة الخصوصية والأمان | ${CONTACT_INFO.siteNameAr}`)
    : (seo?.metaTitleEn || `Privacy & Data Security | ${CONTACT_INFO.siteNameEn}`);

  const description = isAr 
    ? (seo?.metaDescAr || 'نحن نلتزم بأعلى معايير حماية البيانات والخصوصية لعملائنا في منصة بلاتفورم.') 
    : (seo?.metaDescEn || 'At Platform, we adhere to the highest standards of data protection and privacy for our clients.');

  return {
    title: title,
    description: description,
    alternates: { canonical: `${CONTACT_INFO.domain}/${lang}/privacy` },
    openGraph: {
      title,
      description,
      url: `${CONTACT_INFO.domain}/${lang}/privacy`,
      images: seo?.openGraphImage ? [{ url: urlFor(seo.openGraphImage).width(1200).url() }] : []
    }
  };
}

export default async function PrivacyPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const email = CONTACT_INFO?.email || 'info@platform-eg.com';
  const phone = CONTACT_INFO?.phone || '+201000000000';

  const sections = [
    {
      icon: Eye,
      title: isAr ? '1. جمع البيانات الشخصية' : '1. Personal Data Collection',
      text: isAr ? 'نجمع البيانات التي تساهم في تحسين تجربتكم العقارية، مثل الاسم ورقم الهاتف، ونلتزم بمعالجتها بسرية تامة.' : 'We collect data that enhances your real estate experience, ensuring all information is processed with strict confidentiality.'
    },
    {
      icon: Lock,
      title: isAr ? '2. بروتوكولات الأمان' : '2. Security Protocols',
      text: isAr ? 'بياناتكم محمية عبر أنظمة تشفير SSL متقدمة لمنع أي وصول غير مصرح به لضمان أمان استثماراتكم.' : 'Your data is secured via advanced SSL encryption to prevent unauthorized access, ensuring your investments stay safe.'
    },
    {
      icon: ArrowLeftRight,
      title: isAr ? '3. سياسة عدم الإفصاح' : '3. Non-Disclosure Policy',
      text: isAr ? 'نضمن عدم مشاركة أو بيع بياناتكم لأي أطراف ثالثة خارج منظومة شركائنا المعتمدين لتنفيذ طلباتكم.' : 'We guarantee that your data will not be shared or sold to third parties outside our certified partner network.'
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-32 md:pt-48 pb-20 selection:bg-red-50" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Breadcrumbs - Integrated with subtle red accent */}
        <nav className="mb-10 opacity-70 hover:opacity-100 transition-opacity">
           <Breadcrumbs items={[{ label: isAr ? 'سياسة الخصوصية' : 'Privacy Policy' }]} lang={lang} />
        </nav>

        {/* 🏆 Luxury Header - Red & Dark Branding */}
        <header className="relative bg-slate-950 rounded-[3.5rem] p-12 md:p-24 mb-16 overflow-hidden shadow-2xl">
           {/* Background Brand Decoration */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/20 rounded-full blur-[120px] -mr-48 -mt-48" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C02026]/10 rounded-full blur-[100px] -ml-32 -mb-32" />

           <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-[#C02026] shadow-2xl animate-bounce-slow">
                <Shield size={56} />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
                  {isAr ? 'سياسة' : 'Privacy'} <span className="text-[#C02026]">{isAr ? 'الخصوصية' : 'Policy'}</span>
                </h1>
                <div className="h-1.5 w-24 bg-[#C02026] mx-auto rounded-full" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                  {isAr ? 'حماية بياناتكم هي أولويتنا القصوى' : 'Your data protection is our top priority'}
                </p>
              </div>
           </div>
        </header>

        {/* 📜 Content Grid - Modern Cards */}
        <div className="grid gap-8 mb-20">
          {sections.map((section, index) => (
            <div key={index} className="group p-8 md:p-12 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-red-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-red-900/5">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#C02026] shadow-xl group-hover:bg-[#C02026] group-hover:text-white transition-all duration-500 shrink-0">
                  <section.icon size={32} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium opacity-80">
                    {section.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 📞 Contact - High-End CTA */}
        <div className="bg-[#C02026] rounded-[4rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl shadow-red-900/40 group">
           <div className="absolute inset-0 bg-slate-950 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
           <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                  {isAr ? 'هل لديك استفسار أمني؟' : 'Security Questions?'}
                </h3>
                <p className="text-white/80 font-medium text-lg max-w-2xl mx-auto">
                  {isAr ? 'فريق الدعم القانوني والتقني متاح للإجابة على تساؤلاتكم بخصوص حماية البيانات.' : 'Our technical and legal support team is available to answer your concerns regarding data protection.'}
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                <a href={`mailto:${email}`} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl flex items-center gap-3">
                  <Mail size={18} className="text-[#C02026]" /> {email}
                </a>
                <a href={`tel:${phone}`} className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl flex items-center gap-3 border border-white/10">
                  <Phone size={18} className="text-[#C02026]" /> {phone}
                </a>
              </div>
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}} />
    </main>
  );
}