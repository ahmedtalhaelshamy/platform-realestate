import ProjectCard from '@/components/ProjectCard';
import { CONTACT_INFO } from '@/components/constants/contact';
import { 
  Building2, LayoutGrid, Phone, ShieldCheck, 
  MessageCircle, HelpCircle, CheckCircle2 
} from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react'; 
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 

// ✅ 1. PERFORMANCE: ISR كل ساعة لضمان التحديث التلقائي
export const dynamic = 'force-static';
export const revalidate = 3600; 

// 🏁 الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

// ✅ دالة الأمان لمنع خطأ الـ Objects كأبناء لـ React
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

/**
 * ✅ نظام تنسيق النصوص الخاص بـ PortableText لضمان السيو
 */
const devPortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-6 text-slate-600 leading-relaxed text-justify text-base md:text-lg italic font-medium">{children}</p>,
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-4xl font-black text-slate-950 mt-16 mb-8 flex items-center gap-4 italic uppercase tracking-tighter">
        <span className="w-2 h-10 bg-[#C02026] rounded-full block" aria-hidden="true"></span>
        {children}
      </h2>
    ),
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-10 mb-5 italic uppercase">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-4 mb-10 text-slate-600 marker:text-[#C02026] font-medium">{children}</ul>,
  }
};

/**
 * ✅ 2. توليد المسارات SSG
 */
export async function generateStaticParams() {
  try {
    const query = `*[_type == "developer" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;
    const developers = await client.fetch(query);
    const languages = ['ar', 'en'];
    return developers.flatMap((dev) =>
      languages.map((lang) => ({ lang, slug: dev.slug }))
    );
  } catch (error) {
    return [];
  }
}

/**
 * ✅ 3. الـ SEO Metadata (Hreflang & Canonical)
 */
export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const isAr = lang === 'ar';
  
  const data = await client.fetch(
    `*[_type == "developer" && slug.current == $slug && !(_id in path("drafts.**"))][0]{nameAr, nameEn, seoTitleAr, seoTitleEn, seoDescAr, seoDescEn, logo}`, 
    { slug }
  );
  
  if (!data) return { title: 'Titan Not Found' };
  
  const devName = getSafeText(isAr ? data.nameAr : data.nameEn);
  const title = getSafeText(isAr ? (data.seoTitleAr || devName) : (data.seoTitleEn || devName));
  const description = getSafeText(isAr ? data.seoDescAr : data.seoDescEn);

  // تحسين صورة الـ OG لتكون نسخة WebP من شعار المطور
  const ogImage = data.logo 
    ? urlFor(data.logo).width(1200).height(630).auto('format').url()
    : `${BASE_URL}/og-image.jpg`;

  const arPath = `${BASE_URL}/ar/developers/${slug}/`;
  const enPath = `${BASE_URL}/en/developers/${slug}/`;
  const currentPath = isAr ? arPath : enPath;

  return { 
    title: `${title} | Platform`, 
    description: description.substring(0, 160),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: { 'ar': arPath, 'en': enPath },
    },
    openGraph: {
        title: `${devName} | Platform Real Estate`,
        url: currentPath,
        images: [{ url: ogImage }],
        locale: isAr ? 'ar_EG' : 'en_US',
        type: 'website',
    }
  };
}

async function getDeveloperData(slug) {
  const query = `{
    "developer": *[_type == "developer" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id, nameAr, nameEn, descriptionAr, descriptionEn, logo, reviewTitle, faqs
    },
    "projects": *[_type == "project" && references(*[_type == "developer" && slug.current == $slug][0]._id) && !(_id in path("drafts.**"))] | order(isNewLaunch desc) {
      _id, titleAr, titleEn, price, installments, downPayment, isNewLaunch, isReadyToMove, mainImage, "slug": slug.current,
      "location": location->{ nameAr, nameEn }
    }
  }`;
  return await client.fetch(query, { slug });
}

/**
 * 🏗️ المكون الرئيسي
 */
export default async function DeveloperDetailPage({ params }) {
  const { lang, slug } = await params; 
  const isAr = lang === 'ar';
  const data = await getDeveloperData(slug);
  
  if (!data?.developer) return notFound();

  const { developer, projects } = data;
  const devName = getSafeText(isAr ? developer.nameAr : developer.nameEn);
  
  const breadcrumbItems = [
    { label: isAr ? 'المطورين' : 'TITANS', href: `/${lang}/developers/` },
    { label: devName }
  ];

  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? `أريد استشارة حول مشاريع شركة ${devName}` : `Inquiry about ${devName} projects`)}`;

  // 🏆 [SEO] Schema Markup - تحسين مسار اللوجو ليكون WebP
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    'name': devName,
    'description': getSafeText(isAr ? developer.descriptionAr : developer.descriptionEn).substring(0, 200),
    'logo': developer.logo ? urlFor(developer.logo).auto('format').url() : `${BASE_URL}/logo.png`,
    'url': `${BASE_URL}/${lang}/developers/${slug}/`
  };

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-50/20 skew-x-12 translate-x-20 pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-10 flex justify-center md:justify-start overflow-x-auto hide-scrollbar">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 text-start">
            {/* Logo Glass Card - تم تحسين اللوجو هنا */}
            <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center p-8 shrink-0 relative group">
                <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />
                {developer.logo ? (
                  <Image 
                    // تحسين: WebP تلقائي مع تحديد الأحجام المتجاوبة
                    src={urlFor(developer.logo).width(600).auto('format').quality(90).url()} 
                    alt={`${devName} corporate logo`} 
                    width={250} 
                    height={250} 
                    className="object-contain relative z-10 transition-transform duration-700 group-hover:scale-110" 
                    priority 
                    // إخبار المتصفح بحجم اللوجو الحقيقي على الشاشة
                    sizes="(max-width: 768px) 192px, 256px"
                  />
                ) : <Building2 size={64} className="text-slate-200 relative z-10" />}
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 text-[#C02026] bg-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-red-50">
                <ShieldCheck size={16} className="animate-pulse" /> {isAr ? 'شريك استراتيجي معتمد' : 'Strategic Legacy Partner'}
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none italic uppercase">
                {devName}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-slate-500 font-black text-xs uppercase tracking-widest">
                 <div className="flex items-center gap-2">
                    <LayoutGrid size={20} className="text-slate-400" />
                    <span>{projects.length} {isAr ? 'مشروع متاح' : 'Active Units'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <span>2026 {isAr ? 'تحديث البيانات' : 'Verified Data'}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="max-w-[1440px] mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-8 space-y-32">
              
              {/* PROJECTS PORTFOLIO */}
              <section id="portfolio" aria-labelledby="portfolio-heading">
                  <header className="mb-16 border-s-[12px] border-[#C02026] ps-8 text-start">
                     <h2 id="portfolio-heading" className="text-3xl md:text-6xl font-black text-slate-950 italic uppercase tracking-tighter leading-none mb-4">
                        {isAr ? 'سابقة الأعمال' : 'Asset Portfolio'}
                     </h2>
                     <p className="text-slate-500 font-bold text-sm md:text-lg italic">{isAr ? `استكشف أحدث مشاريع وفرص شركة ${devName}` : `Explore the latest investment opportunities from ${devName}`}</p>
                  </header>
                  
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14" role="list">
                      {projects.map((project) => (
                        <article key={project._id} role="listitem">
                          {/* الـ ProjectCard داخلياً يعالج صوره بـ WebP كما فعلنا سابقاً */}
                          <ProjectCard lang={lang} data={project} />
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
                        <Building2 size={64} className="mx-auto text-slate-200 mb-6 animate-pulse" aria-hidden="true" />
                        <p className="text-slate-400 font-black text-xl italic uppercase tracking-widest">{isAr ? 'جاري تحديث قائمة المشاريع' : 'Portfolio Syncing...'}</p>
                    </div>
                  )}
              </section>

              {/* CORPORATE PROFILE ARTICLE */}
              <article className="bg-white border border-slate-50 rounded-[4rem] p-10 md:p-20 shadow-2xl shadow-slate-100/50 relative overflow-hidden text-start">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C02026]/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-12 italic uppercase tracking-tighter leading-none">
                  {getSafeText(developer.reviewTitle) || (isAr ? `حول شركة ${devName}` : `About ${devName}`)}
                </h2>
                <div className="prose prose-xl prose-slate max-w-none prose-headings:italic prose-headings:tracking-tighter prose-img:rounded-[3rem]">
                  <PortableText value={isAr ? developer.descriptionAr : developer.descriptionEn} components={devPortableTextComponents} />
                </div>
              </article>

              {/* FAQs SECTION */}
              {developer.faqs && developer.faqs.length > 0 && (
                <section className="space-y-12" aria-labelledby="faq-heading">
                   <h2 id="faq-heading" className="text-3xl md:text-5xl font-black text-slate-950 flex items-center gap-5 italic uppercase tracking-tighter leading-none text-start">
                      <div className="p-4 bg-red-50 rounded-3xl text-[#C02026]"><HelpCircle size={40} strokeWidth={1.5} /></div>
                      {isAr ? 'الأسئلة الشائعة' : 'Titan FAQs'}
                   </h2>
                   <div className="grid grid-cols-1 gap-6" role="list">
                      {developer.faqs.map((faq, idx) => (
                        <div key={idx} role="listitem" className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 text-start group hover:bg-white hover:shadow-2xl transition-all duration-500">
                           <h3 className="text-xl md:text-2xl font-black text-slate-950 mb-6 flex gap-4 italic uppercase">
                              <span className="text-[#C02026] not-italic">Q.</span> {getSafeText(isAr ? faq.questionAr : faq.questionEn)}
                           </h3>
                           <p className="text-slate-600 leading-relaxed text-lg font-medium ps-10 italic border-s-2 border-slate-200">{getSafeText(isAr ? faq.answerAr : faq.answerEn)}</p>
                        </div>
                      ))}
                   </div>
                </section>
              )}
            </div>

            {/* STICKY SIDEBAR CTA */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 h-full">
                <section className="bg-[#080A0D] rounded-[4rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border-b-[16px] border-[#C02026] group">
                    <div className="absolute -top-16 -right-16 opacity-10 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none" aria-hidden="true">
                        <Building2 size={300} />
                    </div>
                    
                    <div className="relative z-10 text-start">
                        <div className="w-16 h-16 bg-[#C02026] rounded-3xl flex items-center justify-center mb-10 shadow-2xl">
                            <MessageCircle size={32} className="text-white" fill="currentColor" fillOpacity={0.2} />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black mb-8 leading-[0.9] italic uppercase tracking-tighter">
                          {isAr ? 'تواصل مباشر مع المبيعات' : 'Direct VIP Access'}
                        </h3>
                        <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed italic">
                            {isAr 
                              ? `مستشارونا العقاريون يساعدونك في اختيار الوحدة المثالية بمشاريع ${devName} والحصول على عروض حصرية.` 
                              : `Our elite consultants bridge the gap between your vision and ${devName}’s finest assets. 100% Free.`}
                        </p>

                        <div className="space-y-4">
                            <a href={whatsappUrl} 
                               target="_blank" rel="noopener noreferrer"
                               aria-label="Connect via WhatsApp"
                               className="flex items-center justify-center gap-4 w-full py-6 bg-[#25D366] hover:bg-[#1eb954] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95">
                                <MessageCircle size={24} fill="currentColor" /> WhatsApp
                            </a>
                            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                               aria-label="Call sales team"
                               className="flex items-center justify-center gap-4 w-full py-6 bg-white text-slate-950 hover:bg-[#C02026] hover:text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl active:scale-95">
                                <Phone size={24} fill="currentColor" /> {isAr ? 'اتصل الآن' : 'Call Sales'}
                            </a>
                        </div>
                        <p className="mt-10 text-[10px] text-slate-500 text-center uppercase tracking-[0.3em] font-black italic">
                           {isAr ? 'خدمة استشارية مجانية 100% ' : '100% Free Advisory Service'}
                        </p>
                    </div>
                </section>
            </aside>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}