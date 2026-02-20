'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { client, urlFor } from '../sanity/client'; 

export default function CityCarousel({ lang }) {
  const currentLang = lang || 'ar';
  const isAr = currentLang === 'ar';
  
  const scrollRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب البيانات مع حساب عدد المشاريع (Aggregated Query)
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

  // 2. منطق التمرير المحسن (دعم RTL/LTR)
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
      <section className="py-24 bg-white border-t border-slate-50" aria-busy="true" aria-live="polite">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-10 w-48 bg-slate-100 rounded-2xl animate-pulse mb-12"></div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[320px] h-[480px] bg-slate-50 rounded-[3rem] animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (locations.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-white border-t border-slate-50 font-sans overflow-hidden" aria-labelledby="carousel-heading">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 text-start">
            <div className="flex items-center gap-3">
               <span className="w-12 h-1.5 bg-[#C02026] rounded-full"></span>
               <span className="text-[11px] font-black text-[#C02026] uppercase tracking-[0.3em]">
                 {isAr ? 'خارطة استثماراتك' : 'Investment Map'}
               </span>
            </div>
            <h2 id="carousel-heading" className="text-4xl md:text-6xl font-black text-slate-900 italic uppercase leading-[0.9] tracking-tighter">
              {isAr ? 'أهم المدن العقارية' : 'Prime Locations'}
            </h2>
          </div>

          {/* Luxury Navigation Buttons */}
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('prev')} 
              aria-label={isAr ? "المدينة السابقة" : "Previous Location"}
              className="w-16 h-16 flex items-center justify-center border-2 border-slate-100 rounded-3xl hover:bg-slate-950 hover:border-slate-950 hover:text-white transition-all duration-500 group active:scale-90"
            >
              {isAr ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
            </button>
            <button 
              onClick={() => scroll('next')} 
              aria-label={isAr ? "المدينة التالية" : "Next Location"}
              className="w-16 h-16 flex items-center justify-center bg-[#C02026] text-white rounded-3xl hover:bg-slate-950 transition-all duration-500 shadow-xl shadow-red-900/20 active:scale-90"
            >
              {isAr ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
            </button>
          </div>
        </div>
        
        {/* --- Carousel Container --- */}
        <div 
          ref={scrollRef} 
          className="flex gap-6 md:gap-10 overflow-x-auto hide-scrollbar pb-12 pt-4 snap-x snap-mandatory scroll-smooth px-2"
          role="list"
        >
          {locations.map((city) => (
            <Link 
              key={city._id} 
              href={`/${currentLang}/locations/${city.slug}/`} 
              role="listitem"
              aria-label={isAr ? `عرض مشاريع في ${city.nameAr}` : `View projects in ${city.nameEn}`}
              className="relative min-w-[300px] md:min-w-[400px] h-[450px] md:h-[550px] rounded-[3.5rem] overflow-hidden group shadow-2xl hover:shadow-red-900/10 transition-all duration-700 block snap-center border border-slate-50"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 z-0">
                {city.image ? (
                  <Image 
                    src={urlFor(city.image).width(800).height(1100).quality(90).auto('format').url()} 
                    alt={isAr ? `مدينة ${city.nameAr}` : `${city.nameEn} City`} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" 
                    sizes="(max-width: 768px) 90vw, 400px"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Building2 size={64} className="text-slate-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
              </div>
              
              {/* Content Layer */}
              <div className="absolute inset-0 flex flex-col justify-end p-10 z-10 text-start">
                <div className="mb-4 overflow-hidden">
                  <h3 className="text-3xl md:text-5xl font-black text-white italic leading-tight drop-shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 pb-2">
                    {isAr ? city.nameAr : city.nameEn}
                  </h3>
                </div>
                
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                    <span className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-black text-white uppercase tracking-widest shadow-xl flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#C02026] rounded-full animate-pulse" />
                      {city.projectCount} {isAr ? 'مشروع حصري' : 'Exclusive Projects'}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-950 shadow-lg" aria-hidden="true">
                      <ChevronRight size={20} className={isAr ? 'rotate-180' : ''} />
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