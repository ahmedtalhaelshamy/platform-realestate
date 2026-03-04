'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Building2, ArrowUpRight } from 'lucide-react';
import { client, urlFor } from '../sanity/client'; 

export default function CityCarousel({ lang }) {
  const currentLang = lang || 'ar';
  const isAr = currentLang === 'ar';
  
  const scrollRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const query = `*[_type == "location" && defined(slug.current)] | order(order asc) {
          _id, 
          nameAr, 
          nameEn, 
          "slug": slug.current, 
          image,
          "projectCount": count(*[_type == "project" && references(^._id)])
        }`;
        const data = await client.fetch(query);
        setLocations(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally { 
        setLoading(false); 
      }
    }
    fetchLocations();
  }, []);

  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollWidth = container.offsetWidth * 0.8;
      const scrollAmount = direction === 'next' ? scrollWidth : -scrollWidth;
      
      const finalScroll = isAr ? -scrollAmount : scrollAmount;
      container.scrollBy({ left: finalScroll, behavior: 'smooth' });
    }
  }, [isAr]);

  if (loading) {
    return (
      <section className="py-24 bg-white" aria-busy="true">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[300px] md:min-w-[400px] h-[450px] bg-slate-50 rounded-[3.5rem] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (locations.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-white font-sans overflow-hidden" aria-labelledby="carousel-heading">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 text-start">
            <div className="flex items-center gap-3">
               <span className="w-12 h-1.5 bg-[#C02026] rounded-full"></span>
               <span className="text-[11px] font-black text-[#C02026] uppercase tracking-[0.3em]">
                 {isAr ? 'خارطة استثماراتك' : 'Investment Map'}
               </span>
            </div>
            <h2 id="carousel-heading" className="text-4xl md:text-6xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
              {isAr ? 'أهم المدن العقارية' : 'Prime Locations'}
            </h2>
          </div>

          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('prev')} 
              className="w-16 h-16 flex items-center justify-center border-2 border-slate-100 rounded-3xl hover:bg-slate-950 hover:text-white transition-all duration-500 shadow-sm active:scale-90"
              aria-label="Previous"
            >
              {isAr ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
            </button>
            <button 
              onClick={() => scroll('next')} 
              className="w-16 h-16 flex items-center justify-center bg-[#C02026] text-white rounded-3xl hover:bg-slate-950 transition-all duration-500 shadow-xl active:scale-90"
              aria-label="Next"
            >
              {isAr ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
            </button>
          </div>
        </div>
        
        {/* --- Carousel --- */}
        <div 
          ref={scrollRef} 
          className="flex gap-6 md:gap-10 overflow-x-auto hide-scrollbar pb-12 pt-4 snap-x snap-mandatory scroll-smooth px-2"
        >
          {locations.map((city, index) => (
            <Link 
              key={city._id} 
              href={`/${currentLang}/locations/${city.slug}/`} 
              className="relative min-w-[320px] md:min-w-[450px] h-[500px] md:h-[600px] rounded-[3.5rem] overflow-hidden group shadow-2xl transition-all duration-700 block snap-center border border-slate-100 bg-slate-200"
            >
              {/* 🚀 Image Optimization Engine */}
              <div className="absolute inset-0 z-0">
                {city.image ? (
                <Image 
                  // ✅ LCP Fix: تقليل الجودة لـ 60% لتصغير الحجم للنص
                  src={urlFor(city.image).quality(60).auto('format').url()} 
                  alt={isAr ? city.nameAr : city.nameEn} 
                  fill 
                  quality={60} 
                  priority={index < 2}
                  loading={index < 2 ? "eager" : "lazy"} // ✅ تحميل الصور المخفية ببطء
                  decoding="async" // ✅ منع تجميد المتصفح
                  fetchPriority={index < 2 ? "high" : "auto"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out opacity-90 group-hover:opacity-100" 
                />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <Building2 size={64} className="text-slate-300" />
                  </div>
                )}
                
                {/* ✅ تم تحسين التظليل لضمان مقروئية النص دون الحاجة لهوفر */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
              </div>
              
              {/* --- Content --- */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20 text-start">
                
                {/* ✅ تم إزالة الـ Translate-y-4 لضمان ظهور الاسم دائماً */}
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-6xl font-black text-white italic leading-[0.85] tracking-tighter uppercase drop-shadow-2xl transition-all duration-700 group-hover:text-[#C02026]">
                    {isAr ? city.nameAr : city.nameEn}
                  </h3>
                  
                  {/* شريط المعلومات الظاهر دائماً لرفع تجربة المستخدم */}
                  <div className="flex items-center gap-3 transition-all duration-700">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#C02026] rounded-full animate-pulse" />
                        <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">
                          {city.projectCount} {isAr ? 'مشروع متاح' : 'Assets Available'}
                        </span>
                    </div>
                    
                    {/* زرار فرعي يظهر بشكل أوضح عند الهوفر */}
                    <div className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
                      {/* ✅ RTL Fix: قلب السهم في النسخة العربية */}
                      <ArrowUpRight size={24} className="rtl:-scale-x-100" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}