import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Globe, MessageCircle, PhoneCall } from "lucide-react";
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import ShareBtn from '@/components/ShareBtn'; 

// ✅ PERFORMANCE & CACHING
export const revalidate = 3600; 

// 🏁 الدومين الموحد المعتمد لضمان قوة السيو
const BASE_URL = 'https://platformrealestate.co';

/**
 * ✅ 1. توليد الصفحات الثابتة (SSG) لكل المقالات واللغات
 */
export async function generateStaticParams() {
  const query = `*[_type == "post" && defined(slug.current)]{
    "slug": slug.current,
    "lang": language
  }`;
  const posts = await client.fetch(query);

  return posts.map((post) => ({
    lang: post.lang || 'ar', 
    slug: post.slug,
  }));
}

/**
 * ✅ 2. Metadata Function - حل مشكلة التكرار وربط اللغات (Hreflang)
 */
export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === "ar";
  
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title, overview, seoTitle, seoDescription, keywords,
      "ogImage": mainImage.asset->url
    }`,
    { slug }
  );

  if (!post) return { title: isAr ? "المقال غير موجود" : "Post Not Found" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.overview;

  // 🔗 بناء الروابط المتقاطعة للغتين (Hreflang)
  const arPath = `${BASE_URL}/ar/blog/${slug}/`;
  const enPath = `${BASE_URL}/en/blog/${slug}/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: description,
    keywords: post.keywords?.join(', '),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar-EG': arPath,
        'en-US': enPath,
        'x-default': arPath,
      },
    },
    openGraph: {
      title,
      description,
      url: currentPath,
      images: [{ url: post.ogImage || '/og-image.jpg' }],
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
    <div className="text-center py-40 font-black text-2xl italic uppercase">
      {isAr ? "عذراً، هذا المقال غير متاح حالياً." : "Article Not Found."}
    </div>
  );

  const isDifferentLanguage = post.language !== lang;
  const whatsappNumber = CONTACT_INFO.whatsapp.replace(/\D/g, '');

  // ✅ توحيد الروابط في الـ Breadcrumbs لتنتهي بـ /
  const breadcrumbItems = [
    { label: isAr ? "المدونة" : "Blog", href: `/${lang}/blog/` },
    { label: post.title }
  ];

  // ✅ PortableText Custom Components
  const components = {
    block: {
      h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter italic uppercase">{children}</h1>,
      h2: ({ children }) => <h2 className="text-3xl font-black mt-16 mb-6 border-s-8 border-[#C02026] ps-6 italic uppercase tracking-tighter">{children}</h2>,
      h3: ({ children }) => <h3 className="text-2xl font-bold mt-10 mb-4 tracking-tight">{children}</h3>,
      normal: ({ children }) => <p className="mb-6 leading-[1.8] text-slate-600 dark:text-slate-400 text-justify">{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="border-s-4 border-[#C02026] bg-slate-50 dark:bg-slate-900 p-8 my-10 rounded-e-3xl italic font-medium text-xl">
          {children}
        </blockquote>
      ),
    },
    types: {
      image: ({ value }) => (
        <figure className="my-12">
          <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden rounded-[2.5rem] shadow-2xl">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || post.title}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && <figcaption className="mt-4 text-center text-sm text-slate-400 font-bold italic">{value.caption}</figcaption>}
        </figure>
      ),
    },
  };

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-20 selection:bg-[#C02026] selection:text-white" dir={isAr ? "rtl" : "ltr"}>
      
      {/* 🏗️ Hero Header */}
      <header className="bg-slate-50 dark:bg-slate-900/50 pt-32 pb-16 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto max-w-4xl px-4 text-center md:text-start">
          <nav className="mb-10 flex justify-center md:justify-start">
             <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </nav>

          {isDifferentLanguage && (
            <div className="mb-8 flex items-center gap-3 p-5 bg-amber-50 dark:bg-amber-900/20 border-s-4 border-amber-500 rounded-2xl text-amber-800 dark:text-amber-200 text-sm font-bold shadow-sm">
              <Globe size={20} className="shrink-0 animate-pulse" />
              <p>{isAr ? "هذا المقال متوفر حالياً باللغة الإنجليزية فقط." : "This article is currently available in Arabic only."}</p>
            </div>
          )}

          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1] mb-10 tracking-tighter italic uppercase">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#C02026]" />
              {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 border-s-2 border-slate-200 ps-8">
              <Clock size={16} className="text-[#C02026]" />
              {post.estimatedReadingTime || 5} {isAr ? "دقائق قراءة" : "min read"}
            </div>
          </div>
        </div>
      </header>

      {/* 🖼️ Main Image */}
      <div className="container mx-auto max-w-5xl px-4 -mt-12 relative z-10">
        <div className="relative h-[400px] md:h-[650px] w-full overflow-hidden rounded-[4rem] shadow-2xl border-[15px] border-white dark:border-slate-900">
          <Image src={urlFor(post.mainImage).width(1600).url()} alt={post.title} fill className="object-cover" priority />
        </div>
      </div>

      {/* 📝 Body Content */}
      <div className="container mx-auto max-w-3xl px-6 pt-20">
        <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none">
          <PortableText value={post.body} components={components} />
        </div>

        {/* 🔗 Social Sharing - تم توحيد الرابط بـ / */}
        <div className="mt-20 py-10 border-y border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-slate-900 dark:text-white font-black italic uppercase tracking-widest text-sm">
                <span className="bg-[#C02026] w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"><Globe size={18} /></span>
                {isAr ? "شارك هذه الرؤية مع دائرتك:" : "Share these insights:"}
            </div>
            <div className="scale-125"><ShareBtn title={post.title} slug={`blog/${slug}/`} lang={lang} isAr={isAr} /></div>
        </div>

        {/* 🚀 Premium CTA */}
        <div className="mt-24 overflow-hidden rounded-[3.5rem] bg-slate-950 text-white relative shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C02026]/10 rounded-full blur-[120px]" />
          <div className="relative p-12 md:p-24 text-center">
            <h3 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter leading-none">
              {isAr ? "استثمارك الذكي يبدأ بضغطة واحدة" : "Smart Investment Starts Here"}
            </h3>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isAr ? `مهتم بالتفاصيل حول: ${post.title}` : `Inquiry about: ${post.title}`)}`} target="_blank" className="bg-[#25D366] text-white px-12 py-6 rounded-3xl font-black text-lg hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl">
                <MessageCircle size={24} fill="currentColor" /> {isAr ? "تواصل فوراً" : "Connect Now"}
              </a>
              <Link href={`/${lang}/contact/`} className="bg-white/5 backdrop-blur-md text-white border-2 border-white/20 px-12 py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:bg-[#C02026] hover:border-[#C02026]">
                <PhoneCall size={24} /> {isAr ? "حجز موعد" : "Book Call"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}