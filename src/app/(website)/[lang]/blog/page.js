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
 * 🛠️ Blog Intelligence Hub - Standard 2026
 * تم تحسين الكود لضمان استقرار الـ Grid وتوافق الـ SEO بنسبة 100%
 * تم إضافة دعم WebP التلقائي والصور المتجاوبة (Responsive Images)
 */

// ✅ حارس النصوص لضمان عدم حدوث Objects Error
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

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === "ar";
  const baseUrl = CONTACT_INFO.domain.replace(/\/$/, '');
  
  // تعديل: جلب كائن الـ seo بالكامل لدعم معالجة الصور
  const query = `*[_type == "blogPage"][0].seo{
    metaTitleAr, metaTitleEn,
    metaDescAr, metaDescEn,
    openGraphImage
  }`;
  const seo = await client.fetch(query);

  const title = getSafeText(isAr 
    ? (seo?.metaTitleAr || "المدونة العقارية | تحليلات السوق المصري") 
    : (seo?.metaTitleEn || "Real Estate Blog | Egypt Market Insights"));

  // تحسين صورة الـ OG لتكون WebP وبمقاس مثالي للمشاركة
  const ogImageUrl = seo?.openGraphImage 
    ? urlFor(seo.openGraphImage).width(1200).height(630).auto('format').url()
    : `${baseUrl}/og-image.jpg`;

  return {
    title: `${title} | Platform`,
    description: getSafeText(isAr ? seo?.metaDescAr : seo?.metaDescEn),
    alternates: { 
      canonical: `${baseUrl}/${lang}/blog/`, 
      languages: {
        'ar': `${baseUrl}/ar/blog/`,
        'en': `${baseUrl}/en/blog/`,
      }
    },
    openGraph: {
      title,
      type: 'website',
      url: `${baseUrl}/${lang}/blog/`,
      images: [{ url: ogImageUrl }],
      locale: isAr ? 'ar_EG' : 'en_US',
    },
  };
}

export default async function BlogPage({ params }) {
  const { lang } = await params;
  const isAr = lang === "ar";

  // تعديل: جلب كائن mainImage بالكامل بدلاً من الرابط فقط لاستخدامه مع urlFor
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

  return (
    <main className="min-h-screen bg-white pb-32" dir={isAr ? "rtl" : "ltr"}>
      
      {/* 🚀 1. PREMIUM HERO SECTION */}
      <header className="relative overflow-hidden bg-[#080A0D] pt-32 pb-36 lg:pt-48 lg:pb-60 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C02026] via-transparent to-transparent pointer-events-none" aria-hidden="true" />
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="flex justify-center mb-10 overflow-x-auto hide-scrollbar">
            <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>
          
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md shadow-2xl">
                <Sparkles size={16} className="text-[#C02026] animate-pulse" />
                <span className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
                    {isAr ? "مركز التحليلات العقارية 2026" : "2026 MARKET INTELLIGENCE"}
                </span>
            </div>
            <h1 className="text-5xl md:text-[8rem] font-black text-white leading-[0.85] italic uppercase tracking-tighter drop-shadow-2xl">
              {isAr ? "دليلك الاستراتيجي" : "The Strategic Hub"}<span className="text-[#C02026] not-italic">.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto italic">
              {isAr ? "تقارير حصرية وتحليلات معمقة لمستقبل الاستثمار العقاري في مصر." : "Exclusive reports and deep dives into the future of Egypt's real estate market."}
            </p>
          </div>
        </div>
      </header>

      {/* 📰 2. BLOG GRID */}
      <section className="max-w-[1440px] mx-auto px-6 -mt-24 md:-mt-32 relative z-30" aria-labelledby="blog-heading">
        <h2 id="blog-heading" className="sr-only">{isAr ? "أحدث المقالات" : "Latest Articles"}</h2>
        
        {posts.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3" role="list">
            {posts.map((post) => {
              const postTitle = getSafeText(post.title);
              const postOverview = getSafeText(post.overview);
              const postFullUrl = `${CONTACT_INFO.domain}/${lang}/blog/${post.slug}/`;
              const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isAr ? `مهتم بمقال: ${postTitle}` : `Inquiry about: ${postTitle}`)}`;

              return (
                <article 
                  key={post._id} 
                  role="listitem"
                  className="group flex flex-col h-full bg-white rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-50 hover:shadow-[0_50px_100px_-20px_rgba(192,32,38,0.15)] transition-all duration-700 hover:-translate-y-2"
                >
                  {/* Image & Actions - تم إضافة تحسينات الصور المتجاوبة هنا */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.mainImage ? (
                      <Image 
                        // تحسين: استخدام urlFor المحسن مع auto('format') و fit('crop') لتوحيد المقاسات
                        src={urlFor(post.mainImage).width(800).height(500).auto('format').fit('crop').url()} 
                        fill 
                        className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                        alt={post.imageAlt || postTitle}
                        // تحسين: إضافة sizes لضمان تحميل المتصفح للصورة المناسبة لكل جهاز
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <Search size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080A0D]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                    
                    {/* Floating Hover Actions */}
                    <div className="absolute bottom-6 inset-x-8 flex justify-between items-center z-30 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                        <a 
                          href={whatsappLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={isAr ? "استفسار عبر واتساب" : "Inquire via WhatsApp"}
                          className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
                        >
                          <MessageCircle size={24} fill="currentColor" />
                        </a>
                        <PostActions url={postFullUrl} title={postTitle} lang={lang} />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-10 md:p-12 flex flex-col flex-grow text-start">
                    <div className="mb-6 flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#C02026]" aria-hidden="true" />
                        {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" aria-hidden="true" />
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#C02026]" aria-hidden="true" />
                        {post.estimatedReadingTime || 5} MIN
                      </div>
                    </div>

                    <h3 className="mb-6 text-2xl font-black text-slate-950 leading-[1.25] line-clamp-2 min-h-[3.8rem] group-hover:text-[#C02026] transition-colors duration-500 italic uppercase tracking-tighter">
                      <Link href={`/${lang}/blog/${post.slug}/`}>{postTitle}</Link>
                    </h3>

                    <p className="mb-10 text-slate-500 text-base md:text-lg leading-relaxed font-medium line-clamp-3 min-h-[5.2rem] italic">
                      {postOverview}
                    </p>

                    {/* Footer Link */}
                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                      <Link 
                        href={`/${lang}/blog/${post.slug}/`} 
                        aria-label={isAr ? `اقرأ المزيد عن ${postTitle}` : `Read more about ${postTitle}`}
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
          <div className="text-center py-48 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200" role="status">
            <Search size={64} className="mx-auto text-slate-200 mb-8 animate-pulse" aria-hidden="true" />
            <h2 className="text-2xl font-black text-slate-400 italic uppercase tracking-widest">
                {isAr ? "جاري تجهيز التحليلات الذكية..." : "Generating Intelligence..."}
            </h2>
          </div>
        )}
      </section>

      {/* Floating Mobile Sticky CTA */}
      <a 
        href={`https://wa.me/${whatsappNumber}`} 
        aria-label="Chat on WhatsApp"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(37,211,102,0.4)] md:hidden border-4 border-white active:scale-90 transition-transform"
      >
        <MessageCircle size={32} fill="currentColor" />
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}