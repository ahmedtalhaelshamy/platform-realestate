import { Shield, Lock, Eye, Mail, Phone, ArrowLeftRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { client } from '@/sanity/client'; 
import { urlFor } from '@/sanity/image';

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
 * ✅ SEO Metadata: Optimized for Security Compliance
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');

  const query = `*[_type == "privacyPage"][0].seo`;
  const seo = await client.fetch(query);

  const title = isAr 
    ? getSafeText(seo?.metaTitleAr || `سياسة الخصوصية والأمان | ${CONTACT_INFO.siteNameAr}`)
    : getSafeText(seo?.metaTitleEn || `Privacy & Data Security | ${CONTACT_INFO.siteNameEn}`);

  const description = isAr 
    ? getSafeText(seo?.metaDescAr || 'نحن نلتزم بأعلى معايير حماية البيانات والخصوصية لعملائنا في منصة بلاتفورم العقارية.') 
    : getSafeText(seo?.metaDescEn || 'At Platform, we adhere to the highest standards of data protection and privacy for our clients.');

  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).format('webp').url() 
    : `${baseUrl}/og-image.jpg`;

  return {
    title: {
      absolute: title,
    },
    description: description,
    metadataBase: new URL(baseUrl),
    alternates: { 
      canonical: `${baseUrl}/${lang}/privacy/` 
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/privacy/`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    }
  };
}

export default async function PrivacyPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const email = CONTACT_INFO?.email;
  const phone = CONTACT_INFO?.phone;

  // ✅ SEO: بيانات منظمة لتعزيز موثوقية الموقع (E-E-A-T)
  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": isAr ? "سياسة الخصوصية" : "Privacy Policy",
    "description": isAr ? "معايير حماية البيانات في بلاتفورم" : "Data protection standards at Platform",
    "publisher": {
      "@type": "Organization",
      "name": "Platform Real Estate"
    }
  };

  const sections = [
    {
      icon: Eye,
      title: isAr ? '1. جمع البيانات الشخصية' : '1. Data Collection',
      text: isAr ? 'نجمع البيانات التي تساهم في تحسين تجربتكم العقارية، مثل الاسم ورقم الهاتف، ونلتزم بمعالجتها بسرية تامة لضمان تقديم أفضل العروض المناسبة لاحتياجاتكم الاستثمارية.' : 'We collect data that enhances your experience, such as names and phone numbers, processed with strict confidentiality to match your investment needs.'
    },
    {
      icon: Lock,
      title: isAr ? '2. بروتوكولات الأمان' : '2. Security Protocols',
      text: isAr ? 'بياناتكم محمية عبر أنظمة تشفير SSL متقدمة وتقنيات حماية السيرفرات لمنع أي وصول غير مصرح به، مما يضمن أمان استثماراتكم ومعلوماتكم الشخصية على مدار الساعة.' : 'Your data is secured via advanced SSL encryption and server protection layers to prevent unauthorized access, keeping your info safe 24/7.'
    },
    {
      icon: ArrowLeftRight,
      title: isAr ? '3. سياسة عدم الإفصاح' : '3. Non-Disclosure',
      text: isAr ? 'نضمن بشكل قاطع عدم مشاركة أو بيع بياناتكم لأي أطراف ثالثة خارج منظومة شركائنا المعتمدين والمطورين العقاريين اللازمين لتنفيذ طلباتكم الاستشارية فقط.' : 'We strictly guarantee that your data will never be sold or shared with third parties outside our certified partner network and essential developers.'
    }
  ];

  return (
    <main 
      className={`min-h-screen bg-white pt-32 md:pt-48 pb-24 selection:bg-red-50 ${isAr ? 'font-almarai' : 'font-jakarta'}`} 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }} />

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <nav className="mb-12 opacity-80" aria-label="Breadcrumb">
           <Breadcrumbs items={[{ label: isAr ? 'سياسة الخصوصية' : 'Privacy Policy' }]} lang={lang} />
        </nav>

        {/* 🏆 Luxury Header Card */}
        <header className="relative bg-[#080A0D] border border-slate-800 rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 mb-20 overflow-hidden shadow-2xl">
           {/* Glow Effects */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" aria-hidden="true" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C02026]/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" aria-hidden="true" />

           <div className="relative z-10 flex flex-col items-center text-center space-y-10">
              <div className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl text-[#C02026] shadow-2xl animate-bounce-slow">
                <Shield size={64} strokeWidth={1.5} aria-hidden="true" />
              </div>
              
              <div className="space-y-6">
                <h1 id="privacy-heading" className={`text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none ${isAr ? '' : 'italic tracking-tighter'}`}>
                  {isAr ? 'سياسة' : 'Privacy'} <span className="text-[#C02026] not-italic">{isAr ? 'الخصوصية' : 'Policy'}</span>
                </h1>
                <div className="h-1.5 w-24 bg-[#C02026] mx-auto rounded-full" aria-hidden="true" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                  {isAr ? 'حماية بياناتكم هي أولويتنا القصوى لعام 2026' : 'Data Integrity is our 2026 top priority'}
                </p>
              </div>
           </div>
        </header>

        {/* 📜 Content Grid - Lists of Articles */}
        <div className="grid gap-8 md:gap-12 mb-24" role="list">
          {sections.map((section, index) => (
            <article 
              key={index} 
              role="listitem"
              className="group p-10 md:p-14 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:border-[#C02026]/20 transition-all duration-700 hover:bg-white hover:shadow-2xl"
            >
              <div className="flex flex-col md:flex-row gap-10 items-start text-start">
                <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-400 group-hover:bg-[#C02026] group-hover:text-white transition-all duration-500 shadow-xl shrink-0">
                  <section.icon size={36} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div className="space-y-6">
                  <h2 className={`text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-[#C02026] transition-colors ${isAr ? '' : 'italic'}`}>
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg md:text-xl font-medium">
                    {section.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 📞 Contact - Premium Support Card */}
        <div className="bg-[#080A0D] border border-slate-800 rounded-[4rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl group">
           <div className="absolute inset-0 bg-[#C02026]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" aria-hidden="true" />
           
           <div className="relative z-10 space-y-12">
              <div className="space-y-6">
                <h3 className={`text-3xl md:text-6xl font-black uppercase tracking-tight leading-tight ${isAr ? '' : 'italic tracking-tighter'}`}>
                  {isAr ? 'هل لديك استفسار أمني؟' : 'Security Inquiry?'}
                </h3>
                <p className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl mx-auto italic">
                  {isAr ? 'فريق الدعم القانوني والتقني متاح للإجابة على تساؤلاتكم بخصوص حماية البيانات والخصوصية.' : 'Our elite legal and technical team is ready to address your concerns regarding data integrity.'}
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                <a 
                  href={`mailto:${email}`} 
                  className="bg-white text-slate-950 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#C02026] hover:text-white transition-all shadow-xl flex items-center gap-4 active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                >
                  <Mail size={22} className="opacity-50" aria-hidden="true" /> {email}
                </a>
                <a 
                  href={`tel:${phone?.replace(/\s/g, '')}`} 
                  className="bg-[#C02026] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl flex items-center gap-4 active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-[#C02026]/30"
                >
                  <Phone size={22} className="opacity-50 text-white" aria-hidden="true" /> {phone}
                </a>
              </div>
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce-slow { animation: bounce-slow 5s ease-in-out infinite; }
      `}} />
    </main>
  );
}