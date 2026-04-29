import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Globe, MessageCircle, PhoneCall, Building2, MapPin, ArrowRight, Briefcase, Navigation, Cpu, CheckCircle2, HelpCircle, ChevronDown } from "lucide-react";
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import ShareBtn from '@/components/ShareBtn'; 

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

export async function generateStaticParams() {
  const query = `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, "lang": language }`;
  try {
    const posts = await client.fetch(query);
    return posts.map((post) => ({ lang: post.lang || 'ar', slug: post.slug }));
  } catch (error) { return []; }
}

export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === "ar";
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{ title, overview, seoTitle, seoDescription, mainImage }`, { slug });
  
  if (!post) return { title: { absolute: isAr ? "المقال غير موجود" : "Post Not Found" } };
  
  const cleanTitle = getSafeText(post.seoTitle || post.title);
  const ogImageUrl = post.mainImage ? urlFor(post.mainImage).url() : `${BASE_URL}/og-image.jpg`;
  
  return {
    title: { absolute: cleanTitle },
    description: getSafeText(post.seoDescription || post.overview).substring(0, 160),
    alternates: { 
      canonical: `${BASE_URL}/${lang}/blog/${slug}/`,
      languages: {
        'ar': `${BASE_URL}/ar/blog/${slug}/`,
        'en': `${BASE_URL}/en/blog/${slug}/`,
      }
    },
    openGraph: { 
      title: cleanTitle, 
      images: [{ url: ogImageUrl }], 
      locale: isAr ? 'ar_EG' : 'en_US', 
      type: 'article' 
    },
  };
}

export default async function PostPage({ params }) {
  const { lang, slug } = await params;
  const isAr = lang === "ar";

  // ✅ [AEO/GEO Update]: إضافة aiSummary و faqs للاستعلام
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ...,
      aiSummaryAr,
      aiSummaryEn,
      faqs,
      "relatedProjects": relatedProjects[]->{ _id, titleAr, titleEn, "slug": slug.current, mainImage },
      "relatedDistricts": relatedDistricts[]->{ _id, nameAr, nameEn, "slug": slug.current, image },
      "relatedDevelopers": relatedDevelopers[]->{ _id, nameAr, nameEn, "slug": slug.current, logo },
      "relatedLocations": relatedLocations[]->{ _id, nameAr, nameEn, "slug": slug.current, image },
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
    }`,
    { slug }
  );

  if (!post) return <div className="min-h-screen flex items-center justify-center font-black text-slate-400 italic uppercase">{isAr ? "عذراً، المقال غير متاح." : "Syncing..."}</div>;

  const cleanTitle = getSafeText(post.title);
  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const breadcrumbItems = [{ label: isAr ? "المدونة" : "Insights", href: `/${lang}/blog/` }, { label: cleanTitle }];
  const aiSummary = isAr ? post.aiSummaryAr : post.aiSummaryEn;
  const currentUrl = `${BASE_URL}/${lang}/blog/${slug}/`;

  // ✅ [AEO & GEO Schema]: Article + FAQPage
  const faqList = post.faqs?.map(faq => ({
    '@type': 'Question',
    'name': isAr ? faq.questionAr : faq.questionEn,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': isAr ? faq.answerAr : faq.answerEn
    }
  })).filter(q => q.name && q.acceptedAnswer.text) || [];

  const graphElements = [
    {
      '@type': 'Article',
      '@id': `${currentUrl}#article`,
      'headline': cleanTitle,
      'description': getSafeText(post.seoDescription || post.overview).substring(0, 160),
      'image': post.mainImage ? urlFor(post.mainImage).url() : '',
      'datePublished': post._createdAt,
      'dateModified': post._updatedAt || post._createdAt,
      'author': { '@type': 'Organization', 'name': 'Platform Real Estate' }
    }
  ];

  if (faqList.length > 0) {
    graphElements.push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#faq`,
      'mainEntity': faqList
    });
  }

  const components = {
    block: {
      h2: ({ children }) => <h2 className="text-3xl md:text-5xl font-black mt-20 mb-10 border-s-[12px] border-[#C02026] ps-8 italic uppercase leading-none text-slate-950">{children}</h2>,
      h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-black mt-12 mb-6 italic uppercase text-slate-900">{children}</h3>,
      normal: ({ children }) => <p className="mb-8 leading-relaxed text-slate-600 text-lg md:text-xl text-justify font-medium">{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="border-s-4 border-[#C02026] bg-slate-50 p-10 my-16 rounded-e-[3rem] italic font-bold text-2xl text-slate-800 shadow-sm relative">
          <span className="absolute top-4 start-4 text-6xl text-red-100 font-serif opacity-50">“</span>
          {children}
        </blockquote>
      ),
    },
    types: {
      image: ({ value }) => (
        <figure className="my-16">
          <div className="relative w-full h-[350px] md:h-[700px] overflow-hidden rounded-[3.5rem] shadow-xl">
            <Image src={urlFor(value).url()} alt={getSafeText(value.alt || post.title)} fill className="object-cover" />
          </div>
        </figure>
      ),
    },
  };

  const hasAnyRelations = post.relatedProjects?.length > 0 || post.relatedDistricts?.length > 0 || post.relatedDevelopers?.length > 0 || post.relatedLocations?.length > 0;

  return (
    <article className="min-h-screen bg-white pb-32 selection:bg-[#C02026] selection:text-white" dir={isAr ? "rtl" : "ltr"}>
      {/* ✅ حقن بيانات الـ SEO/GEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graphElements }) }} />
      
      {/* Header */}
      <header className="bg-slate-50 pt-32 pb-24 border-b border-slate-100 relative overflow-hidden text-start">
        <div className="container mx-auto max-w-5xl px-6 relative z-10">
          <nav className="mb-12"><Breadcrumbs items={breadcrumbItems} lang={lang} /></nav>
          <h1 className="text-4xl md:text-8xl font-black text-slate-950 leading-[0.9] tracking-tighter italic uppercase mb-10">{cleanTitle}</h1>
          <div className="flex flex-wrap items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <div className="flex items-center gap-3"><Calendar size={18} className="text-[#C02026]" /> {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div className="flex items-center gap-3 border-s-2 border-slate-200 ps-8"><Clock size={18} className="text-[#C02026]" /> {post.estimatedReadingTime || 5} {isAr ? "دقائق قراءة" : "min read"}</div>
          </div>
        </div>
      </header>

      {/* Feature Image */}
      <div className="container mx-auto max-w-[1200px] px-6 -mt-16 relative z-20">
        <div className="relative h-[450px] md:h-[750px] w-full overflow-hidden rounded-[4.5rem] shadow-2xl border-[12px] md:border-[20px] border-white">
          <Image src={urlFor(post.mainImage).url()} alt={cleanTitle} fill className="object-cover animate-slow-zoom" priority />
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-8 pt-24">
        
        {/* ✅ [GEO]: صندوق ملخص الذكاء الاصطناعي (يظهر قبل المقال لتشجيع القراءة) */}
        {aiSummary && aiSummary.length > 0 && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] p-10 mb-16 shadow-2xl border border-slate-800 relative overflow-hidden text-start">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#C02026]/20 rounded-full blur-[80px]" />
             <div className="flex items-center gap-4 mb-8">
               <Cpu className="text-[#C02026] w-10 h-10" />
               <h3 className="font-black text-2xl text-white italic uppercase tracking-wider">{isAr ? `نقاط تلخيصية سريعة` : `Article Key Takeaways`}</h3>
             </div>
             <ul className="grid gap-4">
               {aiSummary.map((point, i) => (
                 <li key={i} className="flex gap-4 text-slate-300 font-bold text-lg items-center">
                   <CheckCircle2 size={24} className="text-[#C02026] shrink-0" /><span>{point}</span>
                 </li>
               ))}
             </ul>
          </div>
        )}

        {/* جسم المقال الرئيسي */}
        <div className="prose prose-xl prose-slate max-w-none text-start">
          <PortableText value={post.body} components={components} />
        </div>

        {/* ✅ [AEO]: الأسئلة الشائعة للمقال (تغذي محركات الإجابات) */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="mt-20 bg-slate-50 p-10 md:p-16 rounded-[4rem] border border-slate-100" itemScope itemType="https://schema.org/FAQPage">
             <h2 className="text-3xl md:text-4xl font-black mb-12 flex items-center gap-4 italic uppercase tracking-tighter text-slate-900 text-start">
                <HelpCircle size={40} className="text-[#C02026]" />
                {isAr ? `أسئلة تهمك حول الموضوع` : `Frequently Asked Questions`}
             </h2>
             <div className="space-y-4">
                {post.faqs.map((faq, i) => {
                  const q = isAr ? faq.questionAr : faq.questionEn;
                  const a = isAr ? faq.answerAr : faq.answerEn;
                  if (!q || !a) return null;
                  return (
                    <details key={i} className="group bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 cursor-pointer text-start" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                      <summary className="flex justify-between items-center font-black text-lg outline-none uppercase italic text-slate-900">
                        <span itemProp="name">{q}</span>
                        <span className="text-[#C02026] group-open:rotate-180 transition-transform"><ChevronDown size={24}/></span>
                      </summary>
                      <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer" className="mt-6 text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-6">
                        <p itemProp="text">{a}</p>
                      </div>
                    </details>
                  );
                })}
             </div>
          </div>
        )}

        {/* Smart Related Entities Section */}
        {hasAnyRelations && (
          <div className="mt-20 p-10 md:p-16 bg-slate-50 rounded-[4rem] border border-slate-100 space-y-16">
            <header className="text-start space-y-4">
               <span className="text-[#C02026] text-[10px] font-black uppercase tracking-[0.4em]">{isAr ? "بيانات التحليل" : "Contextual Data"}</span>
               <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900">{isAr ? "أطراف ذات صلة بالخبر" : "Key Entities"}</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* 🏢 Projects */}
               {post.relatedProjects?.map((proj) => (
                 <Link key={proj._id} href={`/${lang}/projects/${proj.slug}/`} className="group flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <div className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden">
                      <Image src={urlFor(proj.mainImage).url()} alt="proj" fill className="object-cover group-hover:scale-110 transition-transform" unoptimized={true} />
                    </div>
                    <div className="text-start overflow-hidden">
                      <span className="text-[9px] font-black text-[#C02026] uppercase mb-1 block">{isAr ? "مشروع عقاري" : "Project"}</span>
                      <h4 className="font-black text-slate-900 truncate group-hover:text-[#C02026] transition-colors">{isAr ? proj.titleAr : proj.titleEn}</h4>
                    </div>
                 </Link>
               ))}

               {/* 🏗️ Developers */}
               {post.relatedDevelopers?.map((dev) => (
                 <Link key={dev._id} href={`/${lang}/developers/${dev.slug}/`} className="group flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <div className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden bg-slate-50 p-3">
                      <Image src={urlFor(dev.logo).url()} alt="dev" fill className="object-contain group-hover:scale-110 transition-transform" unoptimized={true} />
                    </div>
                    <div className="text-start">
                      <span className="text-[9px] font-black text-[#C02026] uppercase mb-1 block">{isAr ? "المطور العقاري" : "Developer"}</span>
                      <h4 className="font-black text-slate-900 group-hover:text-[#C02026] transition-colors">{isAr ? dev.nameAr : dev.nameEn}</h4>
                    </div>
                 </Link>
               ))}

               {/* 🌍 Locations */}
               {post.relatedLocations?.map((loc) => (
                 <Link key={loc._id} href={`/${lang}/locations/${loc.slug}/`} className="group flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <div className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden">
                      <Image src={urlFor(loc.image).url()} alt="loc" fill className="object-cover group-hover:scale-110 transition-transform" unoptimized={true} />
                    </div>
                    <div className="text-start">
                      <span className="text-[9px] font-black text-[#C02026] uppercase mb-1 block">{isAr ? "المدينة / المنطقة" : "City / Location"}</span>
                      <h4 className="font-black text-slate-900 group-hover:text-[#C02026] transition-colors">{isAr ? loc.nameAr : loc.nameEn}</h4>
                    </div>
                 </Link>
               ))}

               {/* 📍 Districts */}
               {post.relatedDistricts?.map((dist) => (
                 <Link key={dist._id} href={`/${lang}/districts/${dist.slug}/`} className="group flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <div className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden">
                      <Image src={urlFor(dist.image).url()} alt="dist" fill className="object-cover group-hover:scale-110 transition-transform" unoptimized={true} />
                    </div>
                    <div className="text-start">
                      <span className="text-[9px] font-black text-[#C02026] uppercase mb-1 block">{isAr ? "الحي السكني" : "District"}</span>
                      <h4 className="font-black text-slate-900 group-hover:text-[#C02026] transition-colors">{isAr ? dist.nameAr : dist.nameEn}</h4>
                    </div>
                 </Link>
               ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-24 py-12 border-y border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-5 text-slate-950 font-black italic uppercase tracking-tighter text-xl text-start">
            <div className="bg-[#C02026] w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl"><Globe size={22} /></div>
            {isAr ? "شارك هذه الرؤية العقارية:" : "Spread this market insight:"}
          </div>
          <div className="scale-125 transition-transform hover:scale-150"><ShareBtn title={cleanTitle} slug={`blog/${slug}/`} lang={lang} isAr={isAr} /></div>
        </div>

        {/* High-Conversion CTA */}
        <div className="mt-32 overflow-hidden rounded-[4.5rem] bg-[#080A0D] text-white relative shadow-2xl group border-b-[20px] border-[#C02026]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C02026]/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:scale-125 transition-transform duration-1000" />
          <div className="relative p-12 md:p-28 text-center md:text-start space-y-12">
            <h3 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{isAr ? "استثمارك الذكي يبدأ من هنا" : "Secure Your Future ROI Now"}</h3>
            <p className="text-slate-400 text-xl font-medium max-w-2xl italic leading-relaxed">{isAr ? "احصل على استشارة عقارية مجانية بناءً على أحدث تقارير السوق المصري." : "Get a bespoke real estate consultation based on our latest market intelligence."}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <a href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? `أريد استشارة بناءً على مقال: ${cleanTitle}` : `Inquiry based on: ${cleanTitle}`)}`} className="bg-[#25D366] text-white px-12 py-7 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95"><MessageCircle size={28} fill="currentColor" fillOpacity={0.2} /> {isAr ? "تواصل مع الخبراء" : "Consult a Specialist"}</a>
              <Link href={`/${lang}/contact/`} className="bg-white/5 backdrop-blur-xl text-white border-2 border-white/20 px-12 py-7 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:bg-[#C02026] hover:border-[#C02026] active:scale-95"><PhoneCall size={28} /> {isAr ? "حجز موعد مكالمة" : "Book VIP Call"}</Link>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.animate-slow-zoom { animation: slow-zoom 40s linear infinite alternate; } @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.15); } }` }} />
    </article>
  );
}