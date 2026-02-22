'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { client } from '../sanity/client'; 
import ProjectCard from './ProjectCard';
import { ChevronLeft, ChevronRight, Sparkles, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

/**
 * 🛠️ دالة الأمان لضمان عدم حدوث Crash بسبب البيانات
 */
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  return String(val);
};

export default function RelatedProjects({ lang, currentId, locationId }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAr = lang === 'ar';

  // 1. جلب البيانات بذكاء (ترتيب حسب المنطقة ثم الأحدث)
  const fetchRelated = useCallback(async () => {
    try {
      const query = `*[_type == "project" && _id != $currentId] | order(location._ref == $locationId desc, _createdAt desc)[0...8] {
        _id, titleAr, titleEn, price, installments, downPayment,
        "slug": slug.current, mainImage,
        "location": location->{ nameAr, nameEn },
        "developer": developer->{ nameAr, nameEn }
      }`;
      const data = await client.fetch(query, { 
        currentId: currentId || "", 
        locationId: locationId || "" 
      });
      setProjects(data);
    } catch (err) {
      console.error("Related Projects Intel Error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentId, locationId]);

  useEffect(() => {
    fetchRelated();
  }, [fetchRelated]);

  // 2. منطق التمرير اليدوي المحسن (RTL Safe)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // ✅ تعديل العبقرية: عكس المنطق في الـ RTL لأن التمرير يعمل بشكل مختلف
      let scrollAmount = direction === 'left' ? -clientWidth / 1.2 : clientWidth / 1.2;
      
      // في المتصفحات الحديثة، الاتجاه يمين في الـ RTL هو سالب
      if (isAr) {
        scrollAmount = direction === 'left' ? clientWidth / 1.2 : -clientWidth / 1.2;
      }
      
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 3. التمرير التلقائي الاحترافي (Auto-Pilot) - تم تحسين استقراره
  useEffect(() => {
    if (loading || projects.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      const slider = scrollRef.current;
      if (slider) {
        const { scrollLeft, clientWidth, scrollWidth } = slider;
        
        // التحقق من الوصول للنهاية بناءً على اللغة
        const isEnd = isAr 
          ? Math.abs(scrollLeft) >= (scrollWidth - clientWidth - 50)
          : scrollLeft >= (scrollWidth - clientWidth - 50);

        if (isEnd) {
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const step = isAr ? -350 : 350;
          slider.scrollBy({ left: step, behavior: 'smooth' });
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, isAr, loading, projects.length]);

  if (loading) return (
    <div className="py-32 text-center bg-white" role="status" aria-live="polite">
      <Loader2 className="w-12 h-12 text-brand-red animate-spin mx-auto mb-6 opacity-20" aria-hidden="true" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
        {isAr ? 'نحلل أفضل البدائل الاستثمارية...' : 'Analyzing Portfolio Matches...'}
      </p>
    </div>
  );

  if (projects.length === 0) return null;

  return (
    <section 
      className="py-24 bg-white border-t border-slate-50 relative overflow-hidden"
      aria-labelledby="related-title"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background Decor - تم استخدام end-0 للتوافق مع اللغتين */}
      <div className="absolute top-0 end-0 w-[30vw] h-[30vw] bg-brand-red/5 rounded-full blur-[120px] -z-10 opacity-40 pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mb-16 flex items-end justify-between relative z-10">
        <div className="space-y-4 text-start">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-brand-red" aria-hidden="true" />
            <span className={`text-brand-red text-[10px] font-bold uppercase ${isAr ? 'tracking-wider' : 'tracking-[0.4em]'}`}>
              {isAr ? 'فرص قد تهمك' : 'Market Recommendations'}
            </span>
          </div>
          <h2 id="related-title" className={`text-4xl md:text-6xl font-black text-slate-900 uppercase leading-none ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
            {isAr ? 'عقارات مشابهة' : 'Related Assets'}<span className="text-brand-red">.</span>
          </h2>
        </div>

        {/* Navigation Arrows - ✅ A11y & RTL Fixed */}
        <div className="hidden md:flex gap-4">
          <button 
            onClick={() => scroll('left')}
            aria-label={isAr ? "المشاريع السابقة" : "Previous projects"}
            className="w-14 h-14 rounded-2xl border border-slate-100 flex items-center justify-center bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <ChevronLeft size={24} className="rtl:-scale-x-100" />
          </button>
          <button 
            onClick={() => scroll('right')}
            aria-label={isAr ? "المشاريع التالية" : "Next projects"}
            className="w-14 h-14 rounded-2xl bg-brand-red text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:bg-red-800 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
          >
            <ChevronRight size={24} className="rtl:-scale-x-100" />
          </button>
        </div>
      </div>

      {/* 🎡 Slider Engine */}
      <div 
        className="relative group/container z-10"
        onMouseEnter={() => setIsPaused(true)}  
        onMouseLeave={() => setIsPaused(false)} 
        onFocus={() => setIsPaused(true)} // إيقاف عند استخدام الكيبورد
        onBlur={() => setIsPaused(false)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-20 hide-scrollbar snap-x snap-mandatory px-6 md:px-12 scroll-smooth"
          role="region"
          aria-label={isAr ? "قائمة العقارات المشابهة" : "Related properties list"}
          tabIndex="0"
        >
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="min-w-[310px] md:min-w-[440px] snap-start transition-all duration-700 hover:scale-[0.99]"
            >
              {/* ProjectCard handles WebP transformation internally */}
              <ProjectCard lang={lang} data={project} />
            </div>
          ))}

          {/* 🔗 Explore More Card */}
          <div className="min-w-[300px] flex items-center justify-center ps-10 snap-start">
            <Link 
              href={`/${lang}/projects/`} 
              className="group flex flex-col items-center gap-8 outline-none rounded-3xl focus-visible:ring-4 focus-visible:ring-brand-red p-6"
              aria-label={isAr ? "عرض جميع المشاريع" : "View all projects"}
            >
              <div className="w-24 h-24 rounded-[2.5rem] rtl:-rotate-12 ltr:rotate-12 border-2 border-dashed border-slate-300 flex items-center justify-center group-hover:rotate-0 group-hover:border-brand-red group-hover:bg-brand-red transition-all duration-700 shadow-sm group-hover:shadow-premium">
                <ArrowUpRight size={32} className="text-slate-400 group-hover:text-white transition-colors rtl:-scale-x-100" />
              </div>
              <div className="text-center space-y-2">
                <span className={`block font-black text-xs text-slate-900 uppercase ${isAr ? 'tracking-widest' : 'tracking-[0.2em] italic'}`}>
                  {isAr ? 'اكتشف كل المحفظة' : 'View Full Portfolio'}
                </span>
                <div className="h-1 w-12 bg-red-100 mx-auto rounded-full group-hover:w-20 group-hover:bg-brand-red transition-all duration-500" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}