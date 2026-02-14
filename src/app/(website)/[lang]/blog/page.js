import { client } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, Clock, ArrowUpRight, Sparkles, Search, MessageCircle, Globe 
} from "lucide-react";
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import PostActions from './PostActions';

// ✅ 1. تحويل الصفحة لـ Static (SSG) - هذا يحل مشكلة الـ Dynamic في الـ Build
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export const revalidate = 3600; 

// ✅ 2. SEO Metadata - تصحيح استخراج الروابط
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === "ar";
  
  // تصحيح الاستعلام لجلب رابط الصورة مباشرة من سانتي
  const query = `*[_type == "siteSettings"][0].blogSeo{
    metaTitleAr, metaTitleEn,
    metaDescAr, metaDescEn,
    "ogImage": openGraphImage.asset->url
  }`;
  const seo = await client.fetch(query);

  const title = isAr 
    ? (seo?.metaTitleAr || "المدونة العقارية") 
    : (seo?.metaTitleEn || "Real Estate Blog");

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: isAr ? seo?.metaDescAr : seo?.metaDescEn,
    alternates: { canonical: `${CONTACT_INFO.domain}/${lang}/blog` },
    openGraph: {
      title,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
    },
  };
}

export default async function BlogPage({ params }) {
  const { lang } = await params;
  const isAr = lang === "ar";

  // استعلام جلب المقالات
  const query = `*[_type == "post" && language == $lang] | order(_createdAt desc) {
      _id, title, overview, language,
      "slug": slug.current,
      "mainImage": mainImage.asset->url,
      "imageAlt": mainImage.alt,
      _createdAt,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180) 
  }`;

  const posts = await client.fetch(query, { lang });
  const whatsappNumber = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const breadcrumbItems = [{ label: isAr ? "المدونة" : "Blog" }];

  return (
    <main className="min-h-screen bg-white" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#050505] pt-32 pb-40 lg:pt-48 lg:pb-64 text-center">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C02026]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="flex justify-center mb-12 opacity-40"><Breadcrumbs items={breadcrumbItems} lang={lang} /></div>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-xl">
                <Sparkles size={14} className="text-[#C02026]" />
                <span className="text-white/90 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Market Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-9xl font-black text-white italic tracking-tighter leading-none">
              {isAr ? "عقل العقار" : "INSIGHTS"}<span className="text-[#C02026]">.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 md:-mt-32 relative z-30 pb-40">
        {posts.length > 0 ? (
          <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const postFullUrl = `${CONTACT_INFO.domain}/${lang}/blog/${post.slug}`;
              // ✅ تصحيح كتابة الرابط هنا باستخدام ${}
              const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isAr ? `مهتم بمقال: ${post.title}` : `Inquiry: ${post.title}`)}`;

              return (
                <article key={post._id} className="group flex flex-col h-full bg-white rounded-[3.5rem] overflow-hidden shadow-sm border border-slate-100 hover:border-[#C02026]/20 transition-all duration-700">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.mainImage && (
                      <Image src={post.mainImage} fill className="object-cover transition-transform duration-[2s] group-hover:scale-110" alt={post.title} sizes="33vw" priority />
                    )}
                    <div className="absolute bottom-6 inset-x-6 flex justify-between items-center z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                        <a href={whatsappLink} target="_blank" className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                          <MessageCircle size={22} fill="currentColor" />
                        </a>
                        <PostActions url={postFullUrl} title={post.title} lang={lang} />
                    </div>
                  </div>

                  <div className="p-8 md:p-10 flex flex-col flex-grow">
                    <div className="mb-6 flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar size={14} className="text-[#C02026]" />
                      {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <Clock size={14} className="text-[#C02026]" />
                      {post.estimatedReadingTime || 4} MIN
                    </div>
                    <h2 className="mb-4 text-2xl font-black text-slate-950 leading-[1.3] line-clamp-2 min-h-[4rem]">
                      <Link href={`/${lang}/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="mb-10 text-slate-500 text-sm md:text-base line-clamp-3 min-h-[4.5rem]">
                      {post.overview}
                    </p>
                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                      <Link href={`/${lang}/blog/${post.slug}`} className="flex items-center gap-2 text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] group/btn">
                        <span className="group-hover/btn:text-[#C02026] transition-colors">{isAr ? "عرض التقرير" : "Access"}</span>
                        <ArrowUpRight size={16} className="text-[#C02026]" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
            <Search size={48} className="mx-auto text-slate-100 mb-6" />
            <h2 className="text-xl font-black text-slate-300 uppercase italic">Updating Insights...</h2>
          </div>
        )}
      </section>
    </main>
  );
}