import ProjectCard from '@/components/ProjectCard';
import { CONTACT_INFO } from '@/components/constants/contact';
import { Building2, Info, LayoutGrid, Phone, ShieldCheck, MessageCircle, EyeOff, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react'; 
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 

export const revalidate = 3600; 

const devPortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-6 text-slate-600 leading-[1.8] text-justify font-medium text-lg opacity-90">{children}</p>,
    h2: ({children}) => <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6 italic uppercase tracking-tight border-b-2 border-red-50 pb-2">{children}</h2>,
  }
};

export async function generateStaticParams() {
  try {
    const query = `*[_type == "developer" && defined(slug.current)]{ "slug": slug.current }`;
    const developers = await client.fetch(query);
    const languages = ['ar', 'en'];

    return developers.flatMap((dev) =>
      languages.map((lang) => ({ lang, slug: dev.slug }))
    );
  } catch (error) {
    console.error("Static Params Error:", error);
    return [];
  }
}

// ✅ تحسين الـ Metadata لقراءة الحقول الجديدة (Keywords, OG Image, Indexing)
export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const isAr = lang === 'ar';
  
  const query = `*[_type == "developer" && slug.current == $slug][0]{ 
    nameAr, nameEn, seoTitleAr, seoDescAr, keywordsAr, keywordsEn, noIndex,
    "ogImageUrl": ogImage.asset->url,
    "logoUrl": logo.asset->url
  }`;
  const data = await client.fetch(query, { slug });
  
  if (!data) return { title: isAr ? 'المطور غير موجود' : 'Developer Not Found' };

  const devName = isAr ? data.nameAr : data.nameEn;
  const keywords = isAr ? data.keywordsAr : data.keywordsEn;
  const finalOgImage = data.ogImageUrl || data.logoUrl;

  return {
    title: isAr ? (data.seoTitleAr || `${devName} | مشاريع وعروض 2026`) : (data.seoTitleAr || `${devName} | Projects & Offers 2026`),
    description: isAr ? data.seoDescAr : data.seoDescAr, 
    keywords: keywords?.join(', '),
    robots: {
      index: !data.noIndex,
      follow: !data.noIndex,
    },
    alternates: { canonical: `${CONTACT_INFO.domain}/${lang}/developers/${slug}` },
    openGraph: {
      title: isAr ? data.nameAr : data.nameEn,
      images: finalOgImage ? [{ url: finalOgImage }] : [],
      type: 'website'
    }
  };
}

// ✅ تحديث الـ Query لجلب حقول (Review Title & FAQs)
async function getDeveloperData(slug) {
  const query = `{
    "developer": *[_type == "developer" && slug.current == $slug][0]{
      _id, nameAr, nameEn, descriptionAr, descriptionEn, logo, noIndex,
      reviewTitle, faqs
    },
    "projects": *[_type == "project" && references(*[_type == "developer" && slug.current == $slug][0]._id)] | order(isNewLaunch desc) {
      ...,
      "slug": slug.current,
      "developer": developer->{ nameAr, nameEn, logo },
      "districtData": districtData->{ nameAr, nameEn },
      "location": location->{ nameAr, nameEn }
    }
  }`;
  return await client.fetch(query, { slug });
}

export default async function DeveloperDetailPage({ params }) {
  const { lang, slug } = await params; 
  const isAr = lang === 'ar';
  
  const data = await getDeveloperData(slug);
  const developer = data?.developer;
  const projects = data?.projects || [];

  if (!developer) return notFound();

  const breadcrumbItems = [
    { label: isAr ? 'المطورين' : 'Developers', href: `/${lang}/developers` },
    { label: isAr ? developer.nameAr : developer.nameEn }
  ];

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-red-50" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🏗️ HERO SECTION */}
      <section className="bg-slate-950 pt-36 md:pt-52 pb-24 md:pb-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C02026]/10 rounded-full blur-[150px] animate-pulse" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="mb-10 opacity-60">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </nav>

          <div className="flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-16">
            <div className="relative group shrink-0">
               <div className="w-44 h-44 md:w-64 md:h-64 bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl flex items-center justify-center border-[8px] border-white/5 relative transition-all duration-500 group-hover:scale-[1.03] overflow-hidden">
                  {developer.logo ? (
                    <div className="relative w-full h-full p-8 md:p-12">
                      <Image 
                        src={urlFor(developer.logo).width(600).url()} 
                        alt={developer.nameEn} 
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <Building2 size={60} className="text-slate-200" />
                  )}
               </div>
            </div>
            
            <div className="text-center md:text-start flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full text-white/90 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                <ShieldCheck size={16} className="text-[#C02026]" />
                {isAr ? 'مطور معتمد لدى بلات فورم' : 'Platform Verified Developer'}
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter leading-tight uppercase">
                {isAr ? developer.nameAr : developer.nameEn}<span className="text-[#C02026]">.</span>
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-white/5 backdrop-blur-md text-white flex px-6 py-3 rounded-2xl font-black items-center gap-3 border border-white/10 shadow-xl">
                   <LayoutGrid size={20} className="text-[#C02026]" />
                   <span className="text-xl">{String(projects.length).padStart(2, '0')}</span>
                   <span className="text-[10px] opacity-50 uppercase tracking-widest">{isAr ? 'مشروع' : 'Projects'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📄 CONTENT & PROJECTS GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-20 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
           <div className="lg:col-span-8 space-y-20">
              
              {/* ✅ الترتيب الجديد: 1. PROJECTS SECTION */}
              <section>
                  <div className="flex items-center justify-between mb-10 px-2">
                     <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-4">
                        <span className="w-10 h-2 bg-[#C02026] rounded-full" />
                        {/* تعديل اللون هنا */}
                        {isAr ? (
                          <>
                            <span className="text-[#C02026]">سابقة الاعمال</span> 
                                                      </>
                        ) : (
                          <>
                            <span className="text-[#C02026]">Success</span> Stories
                          </>
                        )}
                     </h2>
                  </div>
                  
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {projects.map((project) => (
                        <ProjectCard key={project._id} lang={lang} data={project} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-slate-400 font-bold italic uppercase tracking-widest">
                       {isAr ? 'لا توجد مشاريع مضافة حالياً' : 'No projects listed yet'}
                    </div>
                  )}
              </section>

              {/* ✅ الترتيب الجديد: 2. CORPORATE PROFILE & REVIEW TITLE */}
              <div className="bg-white p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#C02026]"><Info size={28} /></div>
                   <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
                     {developer.reviewTitle ? developer.reviewTitle : (isAr ? 'عن المطور' : 'Corporate Profile')}
                   </h2>
                </div>

                <article className="prose prose-slate max-w-none">
                  {developer.descriptionAr || developer.descriptionEn ? (
                    <PortableText 
                      value={isAr ? developer.descriptionAr : developer.descriptionEn} 
                      components={devPortableTextComponents}
                    />
                  ) : (
                    <p className="text-slate-400 italic">{isAr ? 'الوصف قيد التحديث...' : 'Description being updated...'}</p>
                  )}
                </article>
              </div>

              {/* ✅ إضافة قسم الأسئلة الشائعة (FAQs) */}
              {developer.faqs && developer.faqs.length > 0 && (
                <section className="space-y-10">
                   <div className="flex items-center gap-4 px-2">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><HelpCircle size={22} /></div>
                      <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">{isAr ? 'أسئلة شائعة' : 'Common Questions'}</h2>
                   </div>
                   <div className="space-y-4">
                      {developer.faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                           <h3 className="text-lg font-black text-slate-900 mb-3">{isAr ? faq.questionAr : faq.questionEn}</h3>
                           <p className="text-slate-600 leading-relaxed font-medium">{isAr ? faq.answerAr : faq.answerEn}</p>
                        </div>
                      ))}
                   </div>
                </section>
              )}

           </div>

           <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/10">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C02026]/20 rounded-full blur-3xl" />
                    
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                       <MessageCircle size={32} className="text-[#C02026]" />
                    </div>

                    <h3 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">{isAr ? 'احجز استشارتك' : 'Book a Meeting'}</h3>
                    <p className="text-slate-400 text-sm mb-10 leading-relaxed">
                        {isAr 
                          ? `احصل على تفاصيل الأسعار وأنظمة السداد لمشاريع ${developer.nameAr} فوراً.` 
                          : `Get direct pricing and payment plans for ${developer.nameEn} projects.`}
                    </p>

                    <div className="space-y-4">
                       <a href={`tel:${CONTACT_INFO.phone}`} className="w-full bg-[#C02026] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 group">
                          <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                          <span className="text-sm uppercase tracking-widest">{isAr ? 'اتصال مباشر' : 'Call Now'}</span>
                       </a>
                       
                       <a href={`https://wa.me/${CONTACT_INFO.whatsapp?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="w-full bg-white/5 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#25D366] transition-all border border-white/10 active:scale-95">
                          <MessageCircle size={20} />
                          <span className="text-sm uppercase tracking-widest">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                       </a>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-[#C02026]"><ShieldCheck size={24} /></div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Safety Guarantee</p>
                      <p className="text-slate-900 font-black text-xs uppercase">{isAr ? 'شراء من المطور مباشرة' : 'Direct Developer Pricing'}</p>
                    </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}