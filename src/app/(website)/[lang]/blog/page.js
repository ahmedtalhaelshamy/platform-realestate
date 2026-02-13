import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { 
  Newspaper, Calendar, Clock, 
  ArrowUpRight, Globe, Search, Sparkles,
  MessageCircle 
} from "lucide-react";
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import PostActions from './PostActions';

/**
 * 🛠️ التعديلات التي تمت:
 * 1. إضافة min-h لكل كارت لضمان استقامة الـ Grid.
 * 2. استخدام line-clamp بشكل صارم على العنوان والوصف.
 * 3. ضبط الـ Padding والـ Gap لمنع تداخل العناصر.
 * 4. جعل الصورة تأخذ مساحة ثابتة aspect-ratio.
 */

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === "ar";
  
  const query = `*[_type == "blogPage"][0].seo{
    metaTitleAr, metaTitleEn,
    metaDescAr, metaDescEn,
    keywordsAr, keywordsEn,
    "ogImage": openGraphImage.asset->url
  }`;
  const seo = await client.fetch(query);

  const title = isAr 
    ? (seo?.metaTitleAr || "المدونة العقارية | تحليلات السوق المصري") 
    : (seo?.metaTitleEn || "Real Estate Blog | Egypt Market Insights");

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: isAr ? seo?.metaDescAr : seo?.metaDescEn,
    alternates: { canonical: `${CONTACT_INFO.domain}/${lang}/blog` },
    openGraph: {
      title,
      type: 'website',
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
    },
  };
}

export default async function BlogPage({ params }) {
  const { lang } = await params;
  const isAr = lang === "ar";

  const query = `*[_type == "post"] | order(select(language == $lang => 1, 0) desc, _createdAt desc) {
      _id, title, overview, language,
      "slug": slug.current,
      "mainImage": mainImage.asset->url,
      "imageAlt": mainImage.alt,
      _createdAt,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180) 
    }`;

  const posts = await client.fetch(query, { lang });
  const whatsappNumber = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const breadcrumbItems = [{ label: isAr ? "المدونة العقارية" : "Property Insights" }];

  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 pb-32" dir={isAr ? "rtl" : "ltr"}>
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0A0C10] pt-32 pb-32 lg:pt-48 lg:pb-52 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C02026] via-transparent to-transparent" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="flex justify-center mb-10"><Breadcrumbs items={breadcrumbItems} lang={lang} /></div>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <Sparkles size={14} className="text-[#C02026]" />
                <span className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-widest">
                    {isAr ? "مركز المعرفة العقارية 2026" : "2026 KNOWLEDGE HUB"}
                </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-none italic uppercase tracking-tighter">
              {isAr ? "دليلك الاستراتيجي" : "The Strategic Hub"}<span className="text-[#C02026]">.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* 2. BLOG GRID - المصحح */}
      <section className="container mx-auto px-6 -mt-24 relative z-30">
        {posts.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const postFullUrl = `${CONTACT_INFO.domain}/${lang}/blog/${post.slug}`;
              const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(isAr ? `مهتم بمقال: ${post.title}` : `Inquiry about: ${post.title}`)}`;

              return (
                <article 
                  key={post._id} 
                  className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.mainImage && (
                      <Image 
                        src={post.mainImage} 
                        fill 
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                        alt={post.imageAlt || post.title}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating Buttons */}
                    <div className="absolute bottom-4 inset-x-6 flex justify-between items-center z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <a href={whatsappLink} target="_blank" className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                          <MessageCircle size={22} fill="currentColor" />
                        </a>
                        <PostActions url={postFullUrl} title={post.title} lang={lang} />
                    </div>
                  </div>

                  {/* Content Area - هنا تم الإصلاح */}
                  <div className="p-8 md:p-10 flex flex-col flex-grow">
                    <div className="mb-4 flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Calendar size={14} className="text-[#C02026]" />
                      {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <Clock size={14} className="text-[#C02026]" />
                      {post.estimatedReadingTime || 5} MIN
                    </div>

                    {/* العنوان - محدد بسطرين كحد أقصى لمنع التداخل */}
                    <h2 className="mb-4 text-2xl font-black text-slate-900 dark:text-white leading-[1.2] line-clamp-2 min-h-[3.6rem] group-hover:text-[#C02026] transition-colors duration-300">
                      <Link href={`/${lang}/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {/* الوصف - محدد بـ 3 أسطر لضمان تساوي الكروت */}
                    <p className="mb-8 text-slate-500 text-sm md:text-base leading-relaxed font-medium line-clamp-3 min-h-[4.5rem]">
                      {post.overview}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <Link 
                        href={`/${lang}/blog/${post.slug}`} 
                        className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest group/btn"
                      >
                        <span className="group-hover/btn:text-[#C02026] transition-colors">{isAr ? "اقرأ التقرير" : "Full Report"}</span>
                        <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                      </Link>
                      
                      {post.language !== lang && (
                        <div className="flex items-center gap-1 text-[10px] font-black bg-slate-100 px-2 py-1 rounded-md text-slate-500">
                          <Globe size={10} /> {post.language.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
            <Search size={48} className="mx-auto text-slate-200 mb-6" />
            <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">
                {isAr ? "جاري تجهيز التحليلات..." : "Preparing Intelligence..."}
            </h2>
          </div>
        )}
      </section>

      {/* Floating Mobile WhatsApp */}
      <a href={`https://api.whatsapp.com/send?phone=${whatsappNumber}`} className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-5 rounded-full shadow-2xl md:hidden border-4 border-white"><MessageCircle size={30} fill="currentColor" /></a>
    </main>
  );
}