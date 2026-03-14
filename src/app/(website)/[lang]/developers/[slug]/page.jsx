import ProjectCard from '@/components/ProjectCard';
import { CONTACT_INFO } from '@/components/constants/contact';
import { 
  Building2, LayoutGrid, Phone, ShieldCheck, 
  MessageCircle, HelpCircle, CheckCircle2, ArrowRight, Calendar
} from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react'; 
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import Link from 'next/link';

// ✅ 1. PERFORMANCE: ISR كل ساعة
export const dynamic = 'force-static';
export const revalidate = false;
const BASE_URL = 'https://platformrealestate.co';

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
 * ✅ نظام تنسيق النصوص الخاص بـ PortableText
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
 * ✅ 3. الـ SEO Metadata: السيطرة اليدوية المطلقة
 */
export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const isAr = lang === 'ar';
  
  const data = await client.fetch(
    `*[_type == "developer" && slug.current == $slug && !(_id in path("drafts.**"))][0]{nameAr, nameEn, seoTitleAr, seoTitleEn, seoDescAr, seoDescEn, logo}`, 
    { slug }
  );
  
  if (!data) return { title: { absolute: isAr ? 'المطور غير موجود' : 'Titan Not Found' } };
  
  const devName = getSafeText(isAr ? data.nameAr : data.nameEn);
  const title = getSafeText(isAr ? (data.seoTitleAr || devName) : (data.seoTitleEn || devName));
  const description = getSafeText(isAr ? data.seoDescAr : data.seoDescEn);

  const ogImage = data.logo 
    ? urlFor(data.logo).url()
    : `${BASE_URL}/og-image.jpg`;

  return { 
    title: {
      absolute: title, // 🚀 سيطرة يدوية كاملة
    },
    description: description.substring(0, 160),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${lang}/developers/${slug}/`,
      languages: { 
        'ar': `${BASE_URL}/ar/developers/${slug}/`, 
        'en': `${BASE_URL}/en/developers/${slug}/` 
      },
    },
    openGraph: {
        title: `${devName} | Platform Real Estate`,
        description: description,
        url: `${BASE_URL}/${lang}/developers/${slug}/`,
        images: [{ url: ogImage }],
        locale: isAr ? 'ar_EG' : 'en_US',
        type: 'website',
    }
  };
}

async function getDeveloperData(slug, lang) {
  const query = `{
    "developer": *[_type == "developer" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id, nameAr, nameEn, descriptionAr, descriptionEn, logo, reviewTitle, faqs
    },
    "projects": *[_type == "project" && references(*[_type == "developer" && slug.current == $slug][0]._id) && !(_id in path("drafts.**"))] | order(isNewLaunch desc) {
      _id, titleAr, titleEn, price, installments, downPayment, isNewLaunch, isReadyToMove, mainImage, "slug": slug.current,
      "location": location->{ nameAr, nameEn }
    },
    "relatedPosts": *[_type == "post" && language == $lang && references(*[_type == "developer" && slug.current == $slug][0]._id)] | order(_createdAt desc)[0...3] {
      title, "slug": slug.current, mainImage, overview, _createdAt
    }
  }`;
  return await client.fetch(query, { slug, lang });
}

export default async function DeveloperDetailPage({ params }) {
  const { lang, slug } = await params; 
  const isAr = lang === 'ar';
  const data = await getDeveloperData(slug, lang);
  
  if (!data?.developer) return notFound();

  const { developer, projects, relatedPosts } = data;
  const devName = getSafeText(isAr ? developer.nameAr : developer.nameEn);
  
  const breadcrumbItems = [
    { label: isAr ? 'المطورين' : 'TITANS', href: `/${lang}/developers/` },
    { label: devName }
  ];

  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? `أريد استشارة حول مشاريع شركة ${devName}` : `Inquiry about ${devName} projects`)}`;

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-50/20 skew-x-12 translate-x-20 pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-10 flex justify-center md:justify-start overflow-x-auto hide-scrollbar">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 text-start">
            <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex items-center justify-center p-8 shrink-0 relative group">
                {developer.logo ? (
                 <Image 
                  src={urlFor(developer.logo).url()} 
                  alt={devName} 
                  width={250} height={250} 
                  className="object-contain relative z-10 transition-transform duration-700 group-hover:scale-110" 
                  priority 
                  sizes="(max-width: 768px) 192px, 256px"
                />
                ) : <Building2 size={64} className="text-slate-200 relative z-10" />}
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 text-[#C02026] bg-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-red-50">
                <ShieldCheck size={16} className="animate-pulse" /> {isAr ? 'شريك استراتيجي معتمد' : 'Strategic Legacy Partner'}
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none italic uppercase">{devName}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-slate-500 font-black text-xs uppercase tracking-widest">
                 <div className="flex items-center gap-2"><LayoutGrid size={20} className="text-slate-400" /><span>{projects.length} {isAr ? 'مشروع متاح' : 'Active Units'}</span></div>
                 <div className="flex items-center gap-2"><CheckCircle2 size={20} className="text-green-600" /><span>2026 {isAr ? 'تحديث البيانات' : 'Verified Data'}</span></div>
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
              <section id="portfolio">
                  <header className="mb-16 border-s-[12px] border-[#C02026] ps-8 text-start">
                     <h2 className="text-3xl md:text-6xl font-black text-slate-950 italic uppercase tracking-tighter leading-none mb-4">{isAr ? 'سابقة الأعمال' : 'Asset Portfolio'}</h2>
                     <p className="text-slate-500 font-bold text-sm md:text-lg italic">{isAr ? `استكشف أحدث مشاريع وفرص شركة ${devName}` : `Explore the latest investment opportunities from ${devName}`}</p>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
                    {projects.map((project) => (<ProjectCard key={project._id} lang={lang} data={project} />))}
                  </div>
              </section>

              {/* 📰 RELATED NEWS */}
              {relatedPosts && relatedPosts.length > 0 && (
                <section className="pt-20 border-t border-slate-100 text-start">
                  <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                    <div className="border-s-[12px] border-[#C02026] ps-8">
                      <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic leading-none">
                        {isAr ? `أخبار ${devName}` : `${devName} Insights`}
                      </h2>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-4">
                        {isAr ? 'تقارير حصرية وتحليلات السوق' : 'Exclusive reports & market intelligence'}
                      </p>
                    </div>
                    <Link href={`/${lang}/blog/`} className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C02026] transition-all shadow-xl">
                      {isAr ? 'كل الأخبار' : 'All News'}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-2 rtl:rotate-180" />
                    </Link>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedPosts.map((post) => (
                      <Link key={post.slug} href={`/${lang}/blog/${post.slug}/`} className="group flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
                        <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                          {post.mainImage && (
                            <Image 
                              src={urlFor(post.mainImage).url()} 
                              alt={post.title} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                            />
                          )}
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <span className="text-[10px] font-black text-[#C02026] uppercase mb-3 block">
                            {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}
                          </span>
                          <h3 className="text-lg font-black text-slate-900 mb-4 group-hover:text-[#C02026] transition-colors line-clamp-2 leading-tight italic uppercase">
                            {post.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* CORPORATE PROFILE */}
              <article className="bg-white border border-slate-50 rounded-[4rem] p-10 md:p-20 shadow-premium relative overflow-hidden text-start">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C02026]/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-12 italic uppercase tracking-tighter leading-none">
                  {getSafeText(developer.reviewTitle) || (isAr ? `حول شركة ${devName}` : `About ${devName}`)}
                </h2>
                <div className="prose prose-xl prose-slate max-w-none">
                  <PortableText value={isAr ? developer.descriptionAr : developer.descriptionEn} components={devPortableTextComponents} />
                </div>
              </article>

              {/* FAQs */}
              {developer.faqs?.length > 0 && (
                <section className="space-y-12">
                   <h2 className="text-3xl md:text-5xl font-black text-slate-950 flex items-center gap-5 italic uppercase tracking-tighter leading-none text-start">
                     <div className="p-4 bg-red-50 rounded-3xl text-[#C02026]"><HelpCircle size={40} strokeWidth={1.5} /></div>
                     {isAr ? 'الأسئلة الشائعة' : 'Titan FAQs'}
                   </h2>
                   <div className="grid grid-cols-1 gap-6">
                      {developer.faqs.map((faq, idx) => (
                        <div key={idx} className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 text-start hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                           <h3 className="text-xl md:text-2xl font-black text-slate-950 mb-6 flex gap-4 italic uppercase">
                              <span className="text-[#C02026]">Q.</span> {getSafeText(isAr ? faq.questionAr : faq.questionEn)}
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
                    <div className="absolute -top-16 -right-16 opacity-10 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none"><Building2 size={300} /></div>
                    <div className="relative z-10 text-start">
                        <div className="w-16 h-16 bg-[#C02026] rounded-3xl flex items-center justify-center mb-10 shadow-2xl">
                            <MessageCircle size={32} className="text-white" fill="currentColor" fillOpacity={0.2} />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black mb-8 leading-[0.9] italic uppercase tracking-tighter">{isAr ? 'تواصل مع المبيعات' : 'Direct VIP Access'}</h3>
                        <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed italic opacity-90">{isAr ? `نساعدك في اختيار الوحدة المثالية بمشاريع ${devName} والحصول على عروض حصرية.` : `Our elite advisors help you compare ROI and districts within ${devName} projects, 100% complimentary.`}</p>
                        <div className="space-y-4">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 w-full py-6 bg-[#25D366] hover:bg-[#1eb954] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95"><MessageCircle size={24} fill="currentColor" /> WhatsApp</a>
                            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-4 w-full py-6 bg-white text-slate-950 hover:bg-[#C02026] hover:text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95"><Phone size={24} fill="currentColor" /> {isAr ? 'اتصل الآن' : 'Call Sales'}</a>
                        </div>
                    </div>
                </section>
            </aside>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}