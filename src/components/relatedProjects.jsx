'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { client } from '../sanity/client'; 
import ProjectCard from './ProjectCard';
import { ChevronLeft, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function RelatedProjects({ lang, currentId, locationId }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAr = lang === 'ar';

  // 1. جلب البيانات بناءً على "الموقع المشترك" - أولوية سيو وتسويق
  const fetchRelated = useCallback(async () => {
    try {
      // الاستعلام يبحث عن مشاريع في نفس المنطقة أولاً، ويستثني المشروع الحالي
      const query = `*[_type == "project" && _id != $currentId] | order(location._ref == $locationId desc, _createdAt desc)[0...8] {
        _id,
        titleAr,
        titleEn,
        price,
        installments,
        downPayment,
        "slug": slug.current,
        mainImage,
        "locationAr": location->nameAr,
        "locationEn": location->nameEn,
        "developerAr": developer->nameAr,
        "developerEn": developer->nameEn
      }`;
      const data = await client.fetch(query, { 
        currentId: currentId || "", 
        locationId: locationId || "" 
      });
      setProjects(data);
    } catch (err) {
      console.error("Related Projects Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentId, locationId]);

  useEffect(() => {
    fetchRelated();
  }, [fetchRelated]);

  // 2. دالة التمرير اليدوي (UX Best Practice)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 3. منطق التمرير التلقائي (Auto-Pilot)
  useEffect(() => {
    if (loading || projects.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      const slider = scrollRef.current;
      if (slider) {
        const { scrollLeft, clientWidth, scrollWidth } = slider;
        const isEnd = isAr 
          ? Math.abs(scrollLeft) >= (scrollWidth - clientWidth - 50)
          : scrollLeft >= (scrollWidth - clientWidth - 50);

        if (isEnd) {
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const step = isAr ? -400 : 400;
          slider.scrollBy({ left: step, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, isAr, loading, projects.length]);

  if (loading) return (
    <div className="py-24 text-center">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#C02026] rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400 font-medium italic">{isAr ? 'نختار لك أفضل البدائل...' : 'Selecting best alternatives...'}</p>
    </div>
  );

  if (projects.length === 0) return null;

  return (
    <section className="py-20 bg-[#FDFDFD] border-t border-slate-50 relative overflow-hidden">
      
      {/* Header مع لمسة فخامة */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#C02026]" />
            <span className="text-[#C02026] text-[10px] font-black uppercase tracking-[0.4em]">
              {isAr ? 'اقتراحات حصرية' : 'Exclusive Matches'}
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
            {isAr ? 'خيارات استثمارية مشابهة' : 'Related Opportunities'}
          </h3>
        </div>

        {/* أزرار التحكم - ضرورية جداً للموبايل والـ Desktop */}
        <div className="hidden md:flex gap-3">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#C02026] hover:text-white transition-all duration-500"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#C02026] hover:text-white transition-all duration-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div 
        className="relative group/container"
        onMouseEnter={() => setIsPaused(true)}  
        onMouseLeave={() => setIsPaused(false)} 
      >
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-16 hide-scrollbar snap-x snap-mandatory px-6 md:px-[calc((100vw-1280px)/2)]"
        >
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="min-w-[300px] md:min-w-[420px] snap-start transition-transform duration-700 hover:scale-[0.98]"
            >
              <ProjectCard lang={lang} data={project} />
            </div>
          ))}

          {/* كارت "شاهد الكل" بتصميم عصري */}
          <div className="min-w-[300px] flex items-center justify-center">
            <Link 
              href={`/${lang}/projects`}
              className="group flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 rounded-3xl rotate-12 border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:rotate-0 group-hover:border-[#C02026] group-hover:bg-[#C02026] transition-all duration-700">
                <ArrowUpRight size={32} className="text-slate-300 group-hover:text-white transition-colors" />
              </div>
              <div className="text-center">
                <span className="block font-black text-xs text-slate-900 uppercase tracking-widest">
                  {isAr ? 'اكتشف كافة المشاريع' : 'View All Assets'}
                </span>
                <span className="block text-[10px] text-[#C02026] font-bold mt-1">
                  {isAr ? '+500 وحدة متاحة' : '+500 Units Available'}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}