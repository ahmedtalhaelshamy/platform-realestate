import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Building2, Award, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { PortableText } from '@portabletext/react';

// ✅ دالة الأمان لمنع خطأ الـ Objects كأبناء لـ React
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  return String(val);
};

/**
 * 🏢 AboutSection Component - Optimized for SEO & 2026 Performance
 * يدعم اللغتين تلقائياً وبأداء LCP فائق السرعة
 */
async function getAboutData() {
  const query = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
    _id,
    storyTitleAr, storyTitleEn,
    storyContentAr, storyContentEn,
    storyImage,
    stats
  }`;
  
  return await client.fetch(query, {}, { next: { revalidate: 3600 } });
}

export default async function AboutSection({ lang }) {
  const isAr = lang === 'ar';
  const data = await getAboutData();

  // --- تجهيز البيانات الآمنة ---
  const title = isAr 
    ? getSafeText(data?.storyTitleAr || 'بلاتفورم للتسويق العقاري') 
    : getSafeText(data?.storyTitleEn || 'Platform Real Estate');

  const content = isAr ? data?.storyContentAr : data?.storyContentEn;

  const firstStat = data?.stats?.[0];
  const statValue = getSafeText(firstStat?.number || '+15');
  const statLabel = isAr ? getSafeText(firstStat?.labelAr || 'خبرة') : getSafeText(firstStat?.labelEn || 'Experience');

  const features = [
    {
      icon: <Award size={28} strokeWidth={1.5} />,
      title: isAr ? 'خبرة استشارية' : 'Expert Consultant',
      desc: isAr ? 'نخبة من كبار المستشارين العقاريين' : 'Elite real estate advisory team'
    },
    {
      icon: <Building2 size={28} strokeWidth={1.5} />,
      title: isAr ? 'تنوع عقاري' : 'Diverse Portfolio',
      desc: isAr ? 'سكني، تجاري، إداري، ساحلي' : 'Res., Com., Admin, Coastal'
    },
    {
      icon: <ShieldCheck size={28} strokeWidth={1.5} />,
      title: isAr ? 'أمان وموثوقية' : 'Trusted Guide',
      desc: isAr ? 'تعاقدات قانونية موثقة 100%' : '100% Secure & Verified'
    },
    {
      icon: <TrendingUp size={28} strokeWidth={1.5} />,
      title: isAr ? 'أعلى عائد' : 'High ROI',
      desc: isAr ? 'فرص استثمارية لزيادة رأس المال' : 'Best Capital Appreciation'
    }
  ];

  return (
    <section 
      id="about" 
      className={`py-16 md:py-32 bg-white overflow-hidden scroll-mt-20 ${isAr ? 'font-almarai' : 'font-jakarta'}`}
      dir={isAr ? 'rtl' : 'ltr'}
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-24">
          
          {/* ℹ️ النص التعريفي - Text Content */}
          <article className="flex-1 space-y-10 w-full text-start">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="w-12 h-1 bg-brand-red rounded-full" aria-hidden="true"></span>
                 <span className={`text-[10px] font-black text-brand-red uppercase ${isAr ? 'tracking-wider' : 'tracking-[0.4em]'}`}>
                   {isAr ? 'من نحن' : 'Who We Are'}
                 </span>
              </div>
              
              <h2 id="about-heading" className={`text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] uppercase ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
                Platform <br />
                <span className="text-brand-red not-italic">{title}</span>
              </h2>
            </header>

            {/* ✅ تحسين الـ Prose: دعم الخطوط والمسافات البينية للمحتوى الديناميكي */}
            <div className="space-y-6 text-slate-600 text-lg md:text-xl leading-relaxed">
              {content ? (
                <div className="prose prose-lg md:prose-xl prose-slate max-w-none 
                                prose-p:leading-relaxed prose-p:text-justify 
                                prose-headings:text-slate-900 prose-headings:font-black">
                   <PortableText value={content} />
                </div>
              ) : (
                <p className="animate-pulse">{isAr ? 'جاري مزامنة البيانات...' : 'Synchronizing intel...'}</p>
              )}
            </div>

            <div className="pt-4">
              <Link 
                href={`/${lang}/contact/`} 
                className="group inline-flex items-center gap-5 bg-brand-dark text-white px-8 md:px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-red transition-all duration-500 shadow-premium active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-brand-red/30"
              >
                <span>{isAr ? 'تواصل مع مستشارك الآن' : 'Contact Your Consultant'}</span>
                <ArrowRight size={20} className={`transition-transform duration-500 ${isAr ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />
              </Link>
            </div>
          </article>

          {/* 🖼️ الصورة التعريفية - Optimized LCP Element */}
          <div className="flex-1 w-full relative">
            <div className="relative h-[450px] md:h-[650px] w-full rounded-[3.5rem] overflow-hidden shadow-premium border-[12px] border-brand-gray-50 group">
              {data?.storyImage ? (
                <Image 
                  // ✅ تحسين: تحديد الأبعاد وطلب WebP لتقليل حجم الـ LCP
                  src={urlFor(data.storyImage).width(1000).height(1400).format('webp').quality(80).url()}
                  alt={isAr ? `عن شركة بلاتفورم العقارية` : `About Platform Real Estate`}
                  fill
                  priority={true} // أهم تعديل للأداء: تحميل فوري للصورة الرئيسية
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out will-change-transform"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-100 animate-pulse" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none"></div>

              {/* 🏆 بطاقة الإحصائيات الفاخرة - Logical Property (end-10) */}
              <div className={`absolute bottom-10 end-10 bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white flex items-center gap-6 group-hover:-translate-y-2 transition-transform duration-700`}>
                <div className="bg-brand-red p-4 rounded-2xl text-white shadow-lg">
                    <Star size={28} fill="currentColor" className="animate-pulse" aria-hidden="true" />
                </div>
                <div className="text-start">
                  <span className="block text-3xl md:text-5xl font-black text-slate-900 leading-none tracking-tighter">
                    {statValue}
                  </span>
                  <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest mt-2 block">
                    {statLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ⚡ مميزات الشركة - Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-16 border-t border-slate-100">
          {features.map((item, index) => (
            <div key={index} className="flex items-start gap-6 p-6 rounded-3xl hover:bg-brand-gray-50 transition-all duration-500 group border border-transparent hover:border-slate-100">
              <div className="w-16 h-16 shrink-0 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:-rotate-6">
                {item.icon}
              </div>
              <div className="space-y-2 text-start">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-red transition-colors uppercase tracking-tight">{item.title}</h3>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}