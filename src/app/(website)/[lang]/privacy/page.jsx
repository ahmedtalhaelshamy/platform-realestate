import { Shield, Lock, Eye, Mail, Phone, ArrowLeftRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { client } from '@/sanity/client'; 
import { urlFor } from '@/sanity/image';

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

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export const revalidate = 3600;

/**
 * ✅ Metadata Function
 * تم إضافة .auto('format') لضمان تحويل صورة المشاركة لـ WebP تلقائياً
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
    ? getSafeText(seo?.metaDescAr || 'نحن نلتزم بأعلى معايير حماية البيانات والخصوصية لعملائنا في منصة بلاتفورم.') 
    : getSafeText(seo?.metaDescEn || 'At Platform, we adhere to the highest standards of data protection and privacy for our clients.');

  // تحسين صورة الـ OG لتكون WebP وبمقاس مثالي للمشاركة الاجتماعية
  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).auto('format').url() 
    : `${baseUrl}/og-image.jpg`;

  return {
    title: title,
    description: description,
    alternates: { 
      canonical: `${baseUrl}/${lang}/privacy/` 
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/privacy/`,
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

export default async function PrivacyPage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const email = CONTACT_INFO?.email;
  const phone = CONTACT_INFO?.phone;
  const whatsappPhone = CONTACT_INFO?.whatsapp?.replace(/\D/g, '');

  const sections = [
    {
      icon: Eye,
      title: isAr ? '1. جمع البيانات الشخصية' : '1. Personal Data Collection',
      text: isAr ? 'نجمع البيانات التي تساهم في تحسين تجربتكم العقارية، مثل الاسم ورقم الهاتف، ونلتزم بمعالجتها بسرية تامة لضمان تقديم أفضل العروض المناسبة لاحتياجاتكم.' : 'We collect data that enhances your real estate experience, such as names and phone numbers, ensuring all information is processed with strict confidentiality to provide the best offers.'
    },
    {
      icon: Lock,
      title: isAr ? '2. بروتوكولات الأمان' : '2. Security Protocols',
      text: isAr ? 'بياناتكم محمية عبر أنظمة تشفير SSL متقدمة وتقنيات حماية السيرفرات لمنع أي وصول غير مصرح به، مما يضمن أمان استثماراتكم ومعلوماتكم الشخصية.' : 'Your data is secured via advanced SSL encryption and server protection technologies to prevent unauthorized access, ensuring your investments and personal info stay safe.'
    },
    {
      icon: ArrowLeftRight,
      title: isAr ? '3. سياسة عدم الإفصاح' : '3. Non-Disclosure Policy',
      text: isAr ? 'نضمن بشكل قاطع عدم مشاركة أو بيع بياناتكم لأي أطراف ثالثة خارج منظومة شركائنا المعتمدين والمطورين العقاريين اللازمين لتنفيذ طلباتكم فقط.' : 'We strictly guarantee that your data will not be shared or sold to third parties outside our certified partner network and developers necessary to fulfill your requests.'
    }
  ];

  return (
    <main 
      className="min-h-screen bg-white pt-32 md:pt-48 pb-20 selection:bg-red-50" 
      dir={isAr ? 'rtl' : 'ltr'}
      aria-labelledby="privacy-heading"
    >
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <nav className="mb-10 opacity-70 hover:opacity-100 transition-opacity" aria-label="Breadcrumb">
           <Breadcrumbs items={[{ label: isAr ? 'سياسة الخصوصية' : 'Privacy Policy' }]} lang={lang} />
        </nav>

        {/* 🏆 Luxury Header */}
        <header className="relative bg-slate-950 rounded-[3.5rem] p-12 md:p-24 mb-16 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
           {/* Glow Effects */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" aria-hidden="true" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C02026]/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" aria-hidden="true" />

           <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] text-[#C02026] shadow-2xl animate-bounce-slow">
                <Shield size={64} strokeWidth={1.5} />
              </div>
              
              <div className="space-y-4">
                <h1 id="privacy-heading" className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
                  {isAr ? 'سياسة' : 'Privacy'} <span className="text-[#C02026]">{isAr ? 'الخصوصية' : 'Policy'}</span>
                </h1>
                <div className="h-1.5 w-24 bg-[#C02026] mx-auto rounded-full" aria-hidden="true" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
                  {isAr ? 'حماية بياناتكم هي أولويتنا القصوى لعام 2026' : 'Your data protection is our 2026 top priority'}
                </p>
              </div>
           </div>
        </header>

        {/* 📜 Content Grid */}
        <div className="grid gap-10 mb-20" role="list">
          {sections.map((section, index) => (
            <article 
              key={index} 
              role="listitem"
              className="group p-10 md:p-14 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:border-red-100 transition-all duration-700 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(192,32,38,0.1)]"
            >
              <div className="flex flex-col md:flex-row gap-10 items-start text-start">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-[#C02026] group-hover:text-white transition-all duration-500 shadow-xl shrink-0">
                  <section.icon size={40} strokeWidth={1.5} />
                </div>
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 italic uppercase tracking-tight leading-none group-hover:text-[#C02026] transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg md:text-xl font-medium opacity-90">
                    {section.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 📞 Contact - Premium CTA Card */}
        <div className="bg-[#C02026] rounded-[4rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl shadow-red-950/40 group">
           <div className="absolute inset-0 bg-slate-950 opacity-0 group-hover:opacity-20 transition-opacity duration-1000" aria-hidden="true" />
           
           <div className="relative z-10 space-y-12">
              <div className="space-y-4">
                <h3 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight">
                  {isAr ? 'هل لديك استفسار أمني؟' : 'Security Questions?'}
                </h3>
                <p className="text-white/80 font-medium text-lg md:text-xl max-w-2xl mx-auto italic">
                  {isAr ? 'فريق الدعم القانوني والتقني متاح للإجابة على تساؤلاتكم بخصوص حماية البيانات والخصوصية.' : 'Our technical and legal support team is available to answer your concerns regarding data protection.'}
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                <a 
                  href={`mailto:${email}`} 
                  aria-label={isAr ? `إرسال بريد إلكتروني إلى ${email}` : `Send email to ${email}`}
                  className="bg-white text-slate-950 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all shadow-2xl flex items-center gap-4 active:scale-95"
                >
                  <Mail size={22} className="text-[#C02026]" fill="currentColor" fillOpacity={0.1} /> {email}
                </a>
                <a 
                  href={`tel:${phone?.replace(/\s/g, '')}`} 
                  aria-label={isAr ? `اتصل بنا على ${phone}` : `Call us at ${phone}`}
                  className="bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-slate-950 transition-all shadow-2xl flex items-center gap-4 border border-white/10 active:scale-95"
                >
                  <Phone size={22} className="text-[#C02026]" fill="currentColor" fillOpacity={0.1} /> {phone}
                </a>
              </div>
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce-slow { animation: bounce-slow 5s ease-in-out infinite; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}