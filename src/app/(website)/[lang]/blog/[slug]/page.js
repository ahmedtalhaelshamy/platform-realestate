import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Globe, MessageCircle, PhoneCall, Building2, MapPin, ArrowRight, Briefcase, Navigation } from "lucide-react";
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import ShareBtn from '@/components/ShareBtn'; 

export const revalidate = 3600; 
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
  if (!post) return { title: isAr ? "المقال غير موجود" : "Post Not Found" };
  const cleanTitle = getSafeText(post.seoTitle || post.title);
  const ogImageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).auto('format').url() : `${BASE_URL}/og-image.jpg`;
  return {
    title: `${cleanTitle} | Platform`,
    description: getSafeText(post.seoDescription || post.overview).substring(0, 160),
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: `${BASE_URL}/${lang}/blog/${slug}/` },
    openGraph: { title: cleanTitle, images: [{ url: ogImageUrl }], locale: isAr ? 'ar_EG' : 'en_US', type: 'article' },
  };
}

export default async function PostPage({ params }) {
  const { lang, slug } = await params;
  const isAr = lang === "ar";

  // 🚀 الاستعلام الكامل لجلب كل أنواع العلاقات
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ...,
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
            <Image src={urlFor(value).auto('format').quality(90).url()} alt={getSafeText(value.alt || post.title)} fill className="object-cover" />
          </div>
        </figure>
      ),
    },
  };

  const hasAnyRelations = post.relatedProjects?.length > 0 || post.relatedDistricts?.length > 0 || post.relatedDevelopers?.length > 0 || post.relatedLocations?.length > 0;

  return (
    <article className="min-h-screen bg-white pb-32 selection:bg-[#C02026] selection:text-white" dir={isAr ? "rtl" : "ltr"}>
      
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
          <Image src={urlFor(post.mainImage).auto('format').quality(95).url()} alt={cleanTitle} fill className="object-cover animate-slow-zoom" priority />
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-8 pt-24">
        <div className="prose prose-xl prose-slate max-w-none text-start">
          <PortableText value={post.body} components={components} />
        </div>

        {/* 🚀 ✅ قسم الارتباطات الذكية الشامل (Related Data) */}
        {hasAnyRelations && (
          <div className="mt-32 p-10 md:p-16 bg-slate-50 rounded-[4rem] border border-slate-100 space-y-16">
            <header className="text-start space-y-4">
               <span className="text-[#C02026] text-[10px] font-black uppercase tracking-[0.4em]">{isAr ? "بيانات التحليل" : "Contextual Data"}</span>
               <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900">{isAr ? "أطراف ذات صلة بالخبر" : "Key Entities"}</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               {/* 🏢 المشاريع */}
               {post.relatedProjects?.map((proj) => (
                 <Link key={proj._id} href={`/${lang}/projects/${proj.slug}/`} className="group flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <div className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden">
                      <Image src={urlFor(proj.mainImage).width(200).url()} alt="proj" fill className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-start overflow-hidden">
                      <span className="text-[9px] font-black text-[#C02026] uppercase mb-1 block">{isAr ? "مشروع عقاري" : "Project"}</span>
                      <h4 className="font-black text-slate-900 truncate group-hover:text-[#C02026] transition-colors">{isAr ? proj.titleAr : proj.titleEn}</h4>
                    </div>
                 </Link>
               ))}

               {/* 🏗️ المطورين */}
               {post.relatedDevelopers?.map((dev) => (
                 <Link key={dev._id} href={`/${lang}/developers/${dev.slug}/`} className="group flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <div className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden bg-slate-50 p-3">
                      <Image src={urlFor(dev.logo).width(200).url()} alt="dev" fill className="object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-start">
                      <span className="text-[9px] font-black text-[#C02026] uppercase mb-1 block">{isAr ? "المطور العقاري" : "Developer"}</span>
                      <h4 className="font-black text-slate-900 group-hover:text-[#C02026] transition-colors">{isAr ? dev.nameAr : dev.nameEn}</h4>
                    </div>
                 </Link>
               ))}

               {/* 🌍 المناطق (المدن) */}
               {post.relatedLocations?.map((loc) => (
                 <Link key={loc._id} href={`/${lang}/locations/${loc.slug}/`} className="group flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <div className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden">
                      <Image src={urlFor(loc.image).width(200).url()} alt="loc" fill className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-start">
                      <span className="text-[9px] font-black text-[#C02026] uppercase mb-1 block">{isAr ? "المدينة / المنطقة" : "City / Location"}</span>
                      <h4 className="font-black text-slate-900 group-hover:text-[#C02026] transition-colors">{isAr ? loc.nameAr : loc.nameEn}</h4>
                    </div>
                 </Link>
               ))}

               {/* 📍 الأحياء */}
               {post.relatedDistricts?.map((dist) => (
                 <Link key={dist._id} href={`/${lang}/districts/${dist.slug}/`} className="group flex items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-red-100">
                    <div className="relative w-20 h-20 shrink-0 rounded-[1.5rem] overflow-hidden">
                      <Image src={urlFor(dist.image).width(200).url()} alt="dist" fill className="object-cover group-hover:scale-110 transition-transform" />
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