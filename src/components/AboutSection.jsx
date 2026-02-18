import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Building2, Award, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { PortableText } from '@portabletext/react';

/**
 * 🏢 AboutSection Component
 */
async function getAboutData() {
  const query = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
    _id,
    storyTitleAr, storyTitleEn,
    storyContentAr, storyContentEn,
    storyImage,
    stats
  }`;
  
  // إلغاء الكاش
  return await client.fetch(query, {}, { cache: 'no-store' });
}

export default async function AboutSection({ lang }) {
  const isAr = lang === 'ar';
  const data = await getAboutData();


  // --- تجهيز البيانات ---
  const title = isAr 
    ? data?.storyTitleAr || 'بلاتفورم للتسويق العقاري' 
    : data?.storyTitleEn || 'Platform Real Estate';

  const content = isAr ? data?.storyContentAr : data?.storyContentEn;

  const firstStat = data?.stats?.[0];
  const statValue = firstStat?.number || '+15';
  const statLabel = isAr ? (firstStat?.labelAr || 'خبرة') : (firstStat?.labelEn || 'Experience');

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
      className="py-16 md:py-24 bg-white overflow-hidden scroll-mt-20"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20">
          
          <article className="flex-1 space-y-8 w-full">
            <header className="space-y-4">
              <div className="flex items-center gap-2">
                 <span className="w-10 h-1 bg-[#C02026] rounded-full"></span>
                 <span className="text-xs font-bold text-[#C02026] uppercase tracking-[0.2em]">
                   {isAr ? 'من نحن' : 'Who We Are'}
                 </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.2]">
                Platform Real Estate <br />
                <span className="text-[#C02026]">{title}</span>
              </h2>
            </header>

            <div className="space-y-6 text-slate-600 text-base md:text-lg leading-relaxed font-medium text-justify">
              {content ? (
                <PortableText value={content} />
              ) : (
                <p>{isAr ? 'جاري تحميل البيانات...' : 'Loading content...'}</p>
              )}
            </div>

            <div className="pt-2">
              <Link 
                href={`/${lang}/contact`} 
                className="group inline-flex items-center gap-3 bg-[#121621] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#C02026] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
              >
                <span>{isAr ? 'تواصل مع مستشارك الآن' : 'Contact Your Consultant'}</span>
                <ArrowRight size={18} className={`transition-transform duration-300 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Link>
            </div>
          </article>

          <div className="flex-1 w-full relative">
            <div className="relative h-[400px] md:h-[550px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
              <Image 
                src={data?.storyImage ? urlFor(data.storyImage).width(800).url() : "/images/placeholder.jpg"}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>

              <div className={`absolute bottom-6 md:bottom-10 ${isAr ? 'right-6 md:right-10' : 'left-6 md:left-10'} bg-white/90 backdrop-blur-xl p-4 md:p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white flex items-center gap-4`}>
                <div className="bg-[#C02026]/10 p-3 md:p-4 rounded-full text-[#C02026]">
                   <Star size={24} fill="currentColor" className="animate-pulse" />
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-black text-slate-900 leading-none">
                    {statValue}
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {statLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
          {features.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-300 group">
              <div className="w-14 h-14 shrink-0 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-[#C02026] group-hover:bg-[#C02026] group-hover:text-white transition-all duration-300 shadow-sm">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-800 group-hover:text-[#C02026] transition-colors">{item.title}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wide leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}