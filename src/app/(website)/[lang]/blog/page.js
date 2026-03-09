import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, Clock, 
  ArrowUpRight, Globe, Search, Sparkles,
  MessageCircle 
} from "lucide-react";
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import PostActions from './PostActions';

/**
 * ✅ حارس النصوص لضمان عدم حدوث Objects Error
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

export const revalidate = 3600;

const BASE_URL = CONTACT_INFO.domain.replace(/\/$/, '');

/**
 * 🔍 SEO Metadata: السيطرة اليدوية المطلقة وتوجيه الصور لـ Bunny
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === "ar";
  
  const query = `*[_type == "blogPage"][0].seo{
    metaTitleAr, metaTitleEn,
    metaDescAr, metaDescEn,
    openGraphImage
  }`;
  const seo = await client.fetch(query);

  const title = getSafeText(isAr 
    ? (seo?.metaTitleAr || "المدونة العقارية | تحليلات السوق المصري") 
    : (seo?.metaTitleEn || "Real Estate Blog | Egypt Market Insights"));

  const desc = getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn);

  // توجيه صورة الـ OG لـ Bunny للمساهمة في سرعة الأرشفة
  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).url() 
    : `${BASE_URL}/og-blog.jpg`;

  return {
    title: {
      absolute: title, // 🚀 سيطرة يدوية كاملة من سانتي
    },
    description: desc,
    alternates: { 
      canonical: `${BASE_URL}/${lang}/blog/`, 
      languages: {
        'ar': `${BASE_URL}/ar/blog/`,
        'en': `${BASE_URL}/en/blog/`,
      }
    },
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `${BASE_URL}/${lang}/blog/`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      locale: isAr ? 'ar_EG' : 'en_US',
    },
  };
}

export default async function BlogPage({ params }) {
  const { lang } = await params;
  const isAr = lang === "ar";

  const query = `*[_type == "post"] | order(select(language == $lang => 1, 0) desc, _createdAt desc) {
      _id, title, overview, language,
      "slug": slug.current,
      mainImage,
      "imageAlt": mainImage.alt,
      _createdAt,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180) 
    }`;

  const posts = await client.fetch(query, { lang });
  const whatsappNumber = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  
  const breadcrumbItems = [
    { label: isAr ? "المدونة العقارية" : "Insights Hub", href: `/${lang}/blog/` }
  ];

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": isAr ? "مدونة بلاتفورم العقارية" : "Platform Real Estate Blog",
    "url": `${BASE_URL}/${lang}/blog/`,
    "description": isAr ? "تحليلات معمقة للسوق العقاري المصري" : "Deep insights into the Egyptian Real Estate market",
    "publisher": {
      "@type": "Organization",
      "name": "Platform",
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/logo.png` }
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": getSafeText(post.title),
      "url": `${BASE_URL}/${lang}/blog/${post.slug}/`,
      "datePublished": post._createdAt,
      "image": post.mainImage ? urlFor(post.mainImage).url() : ""
    }))
  };

  return (
    <main className={`min-h-screen bg-white pb-32 ${isAr ? 'font-almarai' : 'font-jakarta'}`} dir={isAr ? "rtl" : "ltr"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      
      {/* 🚀 1. PREMIUM HERO SECTION */}
      <header className="relative overflow-hidden bg-[#080A0D] pt-32 pb-36 lg:pt-48 lg:pb-60 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C02026] via-transparent to-transparent pointer-events-none" aria-hidden="true" />
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="flex justify-center mb-10 overflow-x-auto hide-scrollbar">
            <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>
          
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md">
                <Sparkles size={16} className="text-[#C02026] animate-pulse" />
                <span className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
                    {isAr ? "مركز التحليلات العقارية 2026" : "2026 MARKET INTELLIGENCE"}
                </span>
            </div>
            <h1 className="text-5xl md:text-[8rem] font-black text-white leading-[0.85] italic uppercase tracking-tighter drop-shadow-2xl">
              {isAr ? "دليلك الاستراتيجي" : "The Strategic Hub"}<span className="text-[#C02026] not-italic">.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto italic opacity-90">
              {isAr ? "تقارير حصرية وتحليلات معمقة لمستقبل الاستثمار العقاري في مصر." : "Exclusive reports and deep dives into the future of Egypt's real estate market."}
            </p>
          </div>
        </div>
      </header>

      {/* 📰 2. BLOG GRID */}
      <section className="max-w-[1440px] mx-auto px-6 -mt-24 md:-mt-32 relative z-30">
        <h2 className="sr-only">{isAr ? "أحدث المقالات" : "Latest Articles"}</h2>
        
        {posts.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const postTitle = getSafeText(post.title);
              const postOverview = getSafeText(post.overview);
              const postFullUrl = `${BASE_URL}/${lang}/blog/${post.slug}/`;
              const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isAr ? `أنا مهتم بمعرفة تفاصيل حول المقال الاستراتيجي: ${postTitle}` : `I'm interested in the market report: ${postTitle}`)}`;

              return (
                <article 
                  key={post._id} 
                  className="group flex flex-col h-full bg-white rounded-[3.5rem] overflow-hidden shadow-premium border border-slate-50 hover:shadow-hover transition-all duration-700 hover:-translate-y-2 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.mainImage ? (
                      <Image 
                        src={urlFor(post.mainImage).url()} 
                        fill 
                        className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                        alt={post.imageAlt || postTitle}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <Search size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating Actions */}
                    <div className="absolute bottom-6 inset-x-8 flex justify-between items-center z-30 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                        <a 
                          href={whatsappLink} 
                          target="_blank" rel="noopener noreferrer"
                          className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
                        >
                          <MessageCircle size={24} fill="currentColor" />
                        </a>
                        <PostActions url={postFullUrl} title={postTitle} lang={lang} />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-10 md:p-12 flex flex-col flex-grow text-start">
                    <div className="mb-6 flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#C02026]" />
                        {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#C02026]" />
                        {post.estimatedReadingTime || 5} MIN
                      </div>
                    </div>

                    <h3 className="mb-6 text-2xl font-black text-slate-950 leading-[1.3] line-clamp-2 min-h-[3.8rem] group-hover:text-[#C02026] transition-colors duration-500 italic uppercase tracking-tighter">
                      <Link href={`/${lang}/blog/${post.slug}/`}>{postTitle}</Link>
                    </h3>

                    <p className="mb-10 text-slate-500 text-base md:text-lg leading-relaxed font-medium line-clamp-3 min-h-[5.2rem] italic opacity-80">
                      {postOverview}
                    </p>

                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                      <Link 
                        href={`/${lang}/blog/${post.slug}/`} 
                        className="flex items-center gap-3 text-xs font-black text-slate-950 uppercase tracking-[0.3em] group/btn"
                      >
                        <span className="group-hover/btn:text-[#C02026] transition-colors">{isAr ? "اقرأ التقرير" : "Full Report"}</span>
                        <ArrowUpRight size={18} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 text-[#C02026]" />
                      </Link>
                      
                      {post.language !== lang && (
                        <div className="flex items-center gap-2 text-[9px] font-black bg-slate-50 px-3 py-1.5 rounded-xl text-slate-400 border border-slate-100">
                          <Globe size={12} /> {post.language.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-48 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <Search size={64} className="mx-auto text-slate-200 mb-8 animate-pulse" />
            <h2 className="text-2xl font-black text-slate-400 italic uppercase tracking-widest">
                {isAr ? "جاري تجهيز التحليلات الذكية..." : "Generating Intelligence..."}
            </h2>
          </div>
        )}
      </section>

      {/* Floating Mobile Sticky WhatsApp */}
      <a 
        href={`https://wa.me/${whatsappNumber}`} 
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-5 rounded-[2rem] shadow-2xl md:hidden border-4 border-white active:scale-90 transition-transform"
        aria-label="WhatsApp Support"
      >
        <MessageCircle size={32} fill="currentColor" />
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-premium { box-shadow: 0 30px 60px -15px rgba(0,0,0,0.05); }
        .shadow-hover { box-shadow: 0 50px 100px -20px rgba(192,32,38,0.15); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; opacity: 0; }
      `}} />
    </main>
  );
}