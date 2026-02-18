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

// ✅ إجبار الصفحة على أن تكون Static بالكامل لضمان سرعة الأرشفة
export const dynamic = 'force-static';
export const revalidate = 3600; 

/**
 * ✅ نظام تنسيق النصوص - تحسين القراءة
 */
const devPortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-6 text-slate-600 leading-loose text-justify text-base md:text-lg">{children}</p>,
    h2: ({ children }) => (
      <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-10 mb-5 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-[#C02026] rounded-full block"></span>
        {children}
      </h2>
    ),
    h3: ({ children }) => <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-3 mb-8 text-slate-600 marker:text-[#C02026]">{children}</ul>,
  }
};

/**
 * ✅ 1. توليد المسارات وقت الـ Build (SSG)
 */
export async function generateStaticParams() {
  try {
    const query = `*[_type == "developer" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current }`;
    const developers = await client.fetch(query);
    return developers.flatMap((dev) =>
      ['ar', 'en'].map((lang) => ({ lang, slug: dev.slug }))
    );
  } catch (error) {
    console.error("Static Params Error:", error);
    return [];
  }
}

/**
 * ✅ 2. الـ SEO Metadata (الربط المتبادل بين اللغات)
 */
export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const isAr = lang === 'ar';
  
  const data = await client.fetch(
    `*[_type == "developer" && slug.current == $slug && !(_id in path("drafts.**"))][0]{nameAr, nameEn, seoTitleAr, seoTitleEn, seoDescAr, seoDescEn}`, 
    { slug }
  );
  
  if (!data) return { title: 'Not Found' };
  
  const title = isAr ? (data.seoTitleAr || data.nameAr) : (data.seoTitleEn || data.nameEn);
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');

  return { 
    title: `${title} | Platform Real Estate`, 
    description: isAr ? data.seoDescAr : data.seoDescEn,
    
    // 🛡️ الربط الاحترافي (Hreflang) لمنع مشاكل الفهرسة في جوجل
    alternates: {
      canonical: `${baseUrl}/${lang}/developers/${slug}/`,
      languages: {
        'ar': `${baseUrl}/ar/developers/${slug}/`,
        'en': `${baseUrl}/en/developers/${slug}/`,
        'x-default': `${baseUrl}/ar/developers/${slug}/`,
      },
    },
    openGraph: {
        locale: isAr ? 'ar_EG' : 'en_US',
        type: 'website',
    }
  };
}

/**
 * ✅ دالة جلب البيانات
 */
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

export default async function DeveloperDetailPage({ params }) {
  const { lang, slug } = await params; 
  const isAr = lang === 'ar';
  const data = await getDeveloperData(slug);
  
  if (!data?.developer) return notFound();

  const { developer, projects } = data;
  const breadcrumbItems = [
    { label: isAr ? 'المطورين' : 'Developers', href: `/${lang}/developers/` },
    { label: isAr ? developer.nameAr : developer.nameEn }
  ];

  return (
    <main className="min-h-screen bg-white selection:bg-red-100" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🏗️ 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-50/30 skew-x-12 translate-x-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-8 flex justify-center md:justify-start">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-40 h-40 md:w-52 md:h-52 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center p-6 shrink-0 hover:shadow-md transition-shadow">
                {developer.logo ? (
                  <Image src={urlFor(developer.logo).width(400).url()} alt={developer.nameEn} width={200} height={200} className="object-contain" priority />
                ) : <Building2 size={48} className="text-slate-200" />}
            </div>
            
            <div className="text-center md:text-start space-y-4">
              <div className="inline-flex items-center gap-2 text-[#C02026] bg-red-50 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                <ShieldCheck size={14} /> {isAr ? 'مطور عقاري معتمد' : 'Verified Developer'}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                {isAr ? developer.nameAr : developer.nameEn}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-6 text-slate-500 font-bold text-sm">
                 <div className="flex items-center gap-2">
                    <LayoutGrid size={18} className="text-slate-400" />
                    <span>{projects.length} {isAr ? 'مشروع متاح' : 'Live Projects'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-green-500" />
                    <span>2026 {isAr ? 'تحديث' : 'Update'}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📄 2. MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-8 space-y-24">
              
              {/* ✅ PROJECTS SECTION */}
              <section id="portfolio">
                  <div className="mb-10">
                     <h2 className="text-3xl font-black text-slate-900 mb-2">
                        {isAr ? 'سابقة الأعمال' : 'Project Portfolio'}
                     </h2>
                     <p className="text-slate-500 font-medium">{isAr ? `استكشف أحدث مشاريع شركة ${developer.nameAr}` : `Explore the latest from ${developer.nameEn}`}</p>
                  </div>
                  
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {projects.map((project) => (
                        <ProjectCard key={project._id} lang={lang} data={project} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <Building2 size={40} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-400 font-bold">{isAr ? 'لا توجد مشاريع مضافة حالياً' : 'Portfolio being updated'}</p>
                    </div>
                  )}
              </section>

              {/* ✅ CORPORATE PROFILE */}
              <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative">
                <h2 className="text-3xl font-black text-slate-900 mb-8">
                  {developer.reviewTitle || (isAr ? `لماذا تختار ${developer.nameAr}؟` : `About ${developer.nameEn}`)}
                </h2>
                <article className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 leading-relaxed">
                  <PortableText value={isAr ? developer.descriptionAr : developer.descriptionEn} components={devPortableTextComponents} />
                </article>
              </section>

              {/* ✅ FAQs */}
              {developer.faqs && developer.faqs.length > 0 && (
                <section className="space-y-8">
                   <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                      <HelpCircle className="text-[#C02026]" /> {isAr ? 'أسئلة شائعة' : 'FAQs'}
                   </h2>
                   <div className="grid grid-cols-1 gap-4">
                      {developer.faqs.map((faq, idx) => (
                        <div key={idx} className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100">
                           <h3 className="text-lg font-black text-slate-900 mb-3 flex gap-3">
                              <span className="text-[#C02026]">Q.</span> {isAr ? faq.questionAr : faq.questionEn}
                           </h3>
                           <p className="text-slate-600 leading-relaxed ps-8">{isAr ? faq.answerAr : faq.answerEn}</p>
                        </div>
                      ))}
                   </div>
                </section>
              )}
            </div>

            {/* ✅ 3. PREMIUM SIDEBAR CTA */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C02026]/20 blur-[60px]" />
                    
                    <div className="relative z-10 text-center md:text-start">
                        <div className="w-14 h-14 bg-[#C02026] rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                           <MessageCircle size={28} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-black mb-4 leading-tight">
                          {isAr ? 'احصل على عرض خاص الآن' : 'Get a Private Offer'}
                        </h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            {isAr 
                              ? `مستشارونا العقاريون يساعدونك في اختيار الوحدة المثالية بمشاريع ${developer.nameAr} بأفضل نظام سداد.` 
                              : `Our experts will help you find the best payment plans in ${developer.nameEn} projects.`}
                        </p>

                        <div className="space-y-4">
                           <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center justify-center gap-3 w-full bg-[#C02026] hover:bg-white hover:text-black py-4 rounded-2xl font-black transition-all group">
                              <Phone size={18} className="group-hover:rotate-12 transition-transform" />
                              <span className="text-sm uppercase tracking-widest">{isAr ? 'اتصل بنا' : 'Call Sales'}</span>
                           </a>
                           
                           <a href={`https://wa.me/${CONTACT_INFO.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/20 hover:bg-[#25D366] hover:border-[#25D366] py-4 rounded-2xl font-black transition-all">
                              <MessageCircle size={18} />
                              <span className="text-sm uppercase tracking-widest">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                           </a>
                        </div>
                        
                        <p className="mt-8 text-[10px] text-slate-500 text-center uppercase tracking-[0.2em] font-bold">
                           {isAr ? 'خدمة مجانية 100% ' : '100% Free - Zero Commission'}
                        </p>
                    </div>
                </div>
            </aside>
        </div>
      </div>
    </main>
  );
}