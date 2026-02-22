import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Globe, MessageCircle, PhoneCall } from "lucide-react";
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import ShareBtn from '@/components/ShareBtn'; 

// ✅ PERFORMANCE: ISR كل ساعة لضمان سرعة التحديث
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
 * ✅ 1. توليد المسارات الثابتة (SSG)
 */
export async function generateStaticParams() {
  const query = `*[_type == "post" && defined(slug.current)]{
    "slug": slug.current,
    "lang": language
  }`;
  try {
    const posts = await client.fetch(query);
    return posts.map((post) => ({
      lang: post.lang || 'ar', 
      slug: post.slug,
    }));
  } catch (error) {
    return [];
  }
}

/**
 * ✅ 2. Metadata Function (تم إضافة تحسين صور الـ OG)
 */
export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === "ar";
  
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title, overview, seoTitle, seoDescription, keywords,
      mainImage
    }`,
    { slug }
  );

  if (!post) return { title: isAr ? "المقال غير موجود" : "Post Not Found" };

  const cleanTitle = getSafeText(post.seoTitle || post.title);
  const cleanDesc = getSafeText(post.seoDescription || post.overview);

  // تحسين صورة المشاركة لتكون WebP وبمقاس مثالي
  const ogImageUrl = post.mainImage 
    ? urlFor(post.mainImage).width(1200).height(630).auto('format').url()
    : `${BASE_URL}/og-image.jpg`;

  const arPath = `${BASE_URL}/ar/blog/${slug}/`;
  const enPath = `${BASE_URL}/en/blog/${slug}/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${cleanTitle} | Platform`,
    description: cleanDesc.substring(0, 160),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar': arPath,
        'en': enPath,
        'x-default': arPath,
      },
    },
    openGraph: {
      title: cleanTitle,
      description: cleanDesc,
      url: currentPath,
      images: [{ url: ogImageUrl }],
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'article',
    },
  };
}

/**
 * ✅ 3. Main Page Component
 */
export default async function PostPage({ params }) {
  const { lang, slug } = await params;
  const isAr = lang === "ar";

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ...,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
    }`,
    { slug }
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center font-black text-2xl italic uppercase text-slate-400">
      {isAr ? "عذراً، هذا التقرير غير متاح حالياً." : "Report Syncing..."}
    </div>
  );

  const cleanTitle = getSafeText(post.title);
  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const breadcrumbItems = [
    { label: isAr ? "المدونة" : "Insights", href: `/${lang}/blog/` },
    { label: cleanTitle }
  ];

  // ✅ PortableText Custom Components - تم تحسين صور المقال لـ WebP والتجاوب
  const components = {
    block: {
      h2: ({ children }) => <h2 className="text-3xl md:text-5xl font-black mt-20 mb-10 border-s-[12px] border-[#C02026] ps-8 italic uppercase tracking-tighter leading-none text-slate-950">{children}</h2>,
      h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-black mt-12 mb-6 italic uppercase text-slate-900 tracking-tight">{children}</h3>,
      normal: ({ children }) => <p className="mb-8 leading-relaxed text-slate-600 text-lg md:text-xl text-justify font-medium">{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="border-s-4 border-[#C02026] bg-slate-50 p-10 my-16 rounded-e-[3rem] italic font-bold text-2xl text-slate-800 shadow-sm relative">
          <span className="absolute top-4 start-4 text-6xl text-red-100 font-serif leading-none opacity-50">“</span>
          {children}
        </blockquote>
      ),
    },
    types: {
      image: ({ value }) => (
        <figure className="my-16">
          <div className="relative w-full h-[350px] md:h-[700px] overflow-hidden rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
           <Image
  // تحسين: WebP تلقائي وتجاوب ذكي للصور داخل المحتوى
  src={urlFor(value).auto('format').quality(90).url()}
  alt={getSafeText(value.alt || post.title)}
  fill
  sizes="(max-width: 768px) 100vw, 1200px"
  className="object-cover"
/>
          </div>
          {value.caption && <figcaption className="mt-6 text-center text-sm text-slate-400 font-black uppercase tracking-[0.3em] italic">{getSafeText(value.caption)}</figcaption>}
        </figure>
      ),
    },
  };

  // 🏆 [SEO] Schema Markup - Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': cleanTitle,
    'description': getSafeText(post.overview).substring(0, 160),
    'image': [urlFor(post.mainImage).auto('format').url()],
    'datePublished': post._createdAt,
    'author': [{
        '@type': 'Organization',
        'name': CONTACT_INFO.siteNameEn,
        'url': BASE_URL
    }]
  };

  return (
    <article className="min-h-screen bg-white pb-32 selection:bg-[#C02026] selection:text-white" dir={isAr ? "rtl" : "ltr"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* 🏗️ Hero Header */}
      <header className="bg-slate-50 pt-32 pb-24 border-b border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/5 rounded-full blur-[100px] -mr-48 -mt-48" aria-hidden="true" />
        
        <div className="container mx-auto max-w-5xl px-6 relative z-10">
          <nav className="mb-12 flex justify-center md:justify-start overflow-x-auto hide-scrollbar">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </nav>

          <div className="max-w-4xl space-y-10 text-start">
              <h1 className="text-4xl md:text-8xl font-black text-slate-950 leading-[0.9] tracking-tighter italic uppercase">
                {cleanTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-[#C02026]" />
                  {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-3 border-s-2 border-slate-200 ps-8">
                  <Clock size={18} className="text-[#C02026]" />
                  {post.estimatedReadingTime || 5} {isAr ? "دقائق قراءة" : "min read"}
                </div>
              </div>
          </div>
        </div>
      </header>

      {/* 🖼️ Feature Image Section - تم تحسين صورة المقال الرئيسية */}
      <div className="container mx-auto max-w-[1200px] px-6 -mt-16 relative z-20">
        <div className="relative h-[450px] md:h-[750px] w-full overflow-hidden rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[12px] md:border-[20px] border-white">
          <Image 
  // تحسين: استخدام WebP والتجاوب الذكي مع الشاشات
  src={urlFor(post.mainImage).auto('format').quality(95).url()} 
  alt={cleanTitle} 
  fill 
  sizes="100vw"
  className="object-cover animate-slow-zoom" 
  priority 
/>
        </div>
      </div>

      {/* 📝 Content Body Area */}
      <div className="container mx-auto max-w-4xl px-8 pt-24">
        
        {/* Language Warning if applicable */}
        {post.language !== lang && (
          <div className="mb-12 flex items-center gap-4 p-6 bg-amber-50 border-s-8 border-amber-500 rounded-3xl text-amber-900 font-bold shadow-sm italic">
            <Globe size={24} className="shrink-0 animate-pulse" />
            <p>{isAr ? "نعتذر، هذا التحليل متوفر حالياً باللغة الإنجليزية فقط." : "Note: This market insight is currently available in Arabic only."}</p>
          </div>
        )}

        {/* PortableText Content */}
        <div className="prose prose-xl prose-slate max-w-none prose-headings:italic prose-headings:tracking-tighter prose-img:rounded-[3rem] text-start">
          <PortableText value={post.body} components={components} />
        </div>

        {/* 🔗 Premium Social Sharing */}
        <div className="mt-24 py-12 border-y border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-5 text-slate-950 font-black italic uppercase tracking-tighter text-xl">
                <div className="bg-[#C02026] w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl"><Globe size={22} /></div>
                {isAr ? "شارك هذه الرؤية العقارية:" : "Spread this market insight:"}
            </div>
            <div className="scale-125 transform transition-transform hover:scale-150"><ShareBtn title={cleanTitle} slug={`blog/${slug}/`} lang={lang} isAr={isAr} /></div>
        </div>

        {/* 🚀 High-Conversion CTA Section */}
        <div className="mt-32 overflow-hidden rounded-[4.5rem] bg-[#080A0D] text-white relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] group border-b-[20px] border-[#C02026]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C02026]/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:scale-125 transition-transform duration-1000" aria-hidden="true" />
          
          <div className="relative p-12 md:p-28 text-center md:text-start space-y-12">
            <h3 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              {isAr ? "استثمارك الذكي يبدأ من هنا" : "Secure Your Future ROI Now"}
            </h3>
            <p className="text-slate-400 text-xl font-medium max-w-2xl italic leading-relaxed">
               {isAr ? "احصل على استشارة عقارية مجانية بناءً على أحدث تقارير السوق المصري." : "Get a bespoke real estate consultation based on our latest market intelligence."}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <a 
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? `أريد استشارة بناءً على مقال: ${cleanTitle}` : `Inquiry based on: ${cleanTitle}`)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="WhatsApp Us"
                className="bg-[#25D366] text-white px-12 py-7 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95"
              >
                <MessageCircle size={28} fill="currentColor" fillOpacity={0.2} /> {isAr ? "تواصل مع الخبراء" : "Consult a Specialist"}
              </a>
              <Link 
                href={`/${lang}/contact/`} 
                aria-label="Contact Page"
                className="bg-white/5 backdrop-blur-xl text-white border-2 border-white/20 px-12 py-7 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:bg-[#C02026] hover:border-[#C02026] active:scale-95"
              >
                <PhoneCall size={28} /> {isAr ? "حجز موعد مكالمة" : "Book VIP Call"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
        .animate-slow-zoom { animation: slow-zoom 40s linear infinite alternate; }
        body { background-color: #ffffff; }
      `}} />
    </article>
  );
}