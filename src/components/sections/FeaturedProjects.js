'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ProjectCard from '../ProjectCard'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

import { 
  LayoutGrid, Rocket, Home, TrendingUp, Star, 
  MessageCircle, ChevronLeft, ChevronRight, Phone 
} from 'lucide-react';

import { CONTACT_INFO } from '@/components/constants/contact';

// --- 1. CONFIGURATION ---
const TABS = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: LayoutGrid, field: null },
  { id: 'new', labelAr: 'إطلاق حديث', labelEn: 'New Launch', icon: Rocket, field: 'isNewLaunch' },
  { id: 'ready', labelAr: 'استلام فوري', labelEn: 'Ready to Move', icon: Home, field: 'isReadyToMove' },
  { id: 'investment', labelAr: 'فرص استثمارية', labelEn: 'Investment', icon: TrendingUp, field: 'isInvestmentOpportunity' },
  { id: 'featured', labelAr: 'مشاريع مميزة', labelEn: 'Featured', icon: Star, field: 'isFeatured' },
];

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// =================================================================================================
// MAIN COMPONENT
// =================================================================================================
export default function FeaturedProjects({ projects = [], isAr, lang }) {
  const [activeTab, setActiveTab] = useState('all');
  const [displayProjects, setDisplayProjects] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // تصفية المشاريع بناءً على التاب النشط
  useEffect(() => {
    if (!isMounted) return;

    let filtered = activeTab === 'all' 
      ? projects 
      : projects.filter(p => p[TABS.find(t => t.id === activeTab)?.field] === true);

    setDisplayProjects(filtered.length > 0 ? shuffleArray(filtered) : []);
  }, [activeTab, projects, isMounted]);

  // روابط التواصل
  const whatsappLink = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(isAr ? 'أريد الاستفسار عن وحدات ومشاريع حصرية إضافية' : 'Inquiry about exclusive off-market projects')}`;

  if (!isMounted) {
    return <section className="py-24 bg-slate-50 min-h-[700px]" />;
  }

  return (
    <section className="py-24 bg-slate-50 relative font-sans overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        
        {/* --- 2. HEADER (SEO & UI) --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4 text-start">
            <div className="flex items-center gap-3 text-[#C02026]">
               <span className="w-12 h-[2px] bg-[#C02026]"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                 {isAr ? 'مختاراتنا العقارية' : 'Curated Portfolio'}
               </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-none italic uppercase tracking-tighter">
              {isAr ? 'أبرز المشاريع' : 'Featured Assets'}<span className="text-[#C02026]">.</span>
            </h2>
          </div>
          <p className="text-slate-400 font-bold max-w-xs text-sm leading-relaxed hidden md:block">
            {isAr 
              ? 'تصفح قائمة مختارة من أفخم المشاريع العقارية بأفضل أنظمة سداد في مصر.' 
              : 'Explore a selected list of premium projects with the best payment plans in Egypt.'}
          </p>
        </div>

        {/* --- 3. INTERACTIVE TABS (UX) --- */}
        <div className="mb-16 overflow-x-auto pb-6 scrollbar-hide flex justify-start md:justify-start">
          <div className="flex items-center gap-3 min-w-max p-1 bg-white rounded-full border border-slate-100 shadow-sm">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500
                    ${isActive 
                      ? 'bg-[#121621] text-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] scale-105' 
                      : 'bg-transparent text-slate-500 hover:text-[#C02026]'
                    }`}
                >
                  <tab.icon size={14} className={isActive ? 'text-[#C02026]' : 'text-slate-400'} />
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- 4. SWIPER ENGINE --- */}
        <div className="relative group/slider">
          
          {/* Navigation Buttons (Desktop) */}
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden xl:flex absolute top-1/2 -translate-y-1/2 -left-8 z-30 w-16 h-16 bg-white rounded-full shadow-2xl items-center justify-center text-slate-900 hover:bg-[#C02026] hover:text-white transition-all duration-500 opacity-0 group-hover/slider:opacity-100 border border-slate-50 active:scale-90"
          >
            {isAr ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
          </button>

          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden xl:flex absolute top-1/2 -translate-y-1/2 -right-8 z-30 w-16 h-16 bg-white rounded-full shadow-2xl items-center justify-center text-slate-900 hover:bg-[#C02026] hover:text-white transition-all duration-500 opacity-0 group-hover/slider:opacity-100 border border-slate-50 active:scale-90"
          >
            {isAr ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
          </button>

          {displayProjects.length > 0 ? (
            <Swiper
              key={activeTab} 
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Navigation, Autoplay, Scrollbar]}
              spaceBetween={24}
              slidesPerView={1.15}
              grabCursor={true}
              speed={1000}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              scrollbar={{ draggable: true, hide: false }}
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 24 },
                1024: { slidesPerView: 2.5, spaceBetween: 32 },
                1280: { slidesPerView: 3, spaceBetween: 40 },
              }}
              className="!pb-24 !overflow-visible project-swiper"
            >
              {displayProjects.map((project, idx) => (
                <SwiperSlide key={`${project._id}-${idx}`} className="h-auto">
                   <ProjectCard lang={lang} data={project} />
                </SwiperSlide>
              ))}

              {/* ✅ 🚀 THE "EXPLORE MORE" CTA CARD (The closer) */}
              <SwiperSlide className="h-auto">
                <div className="h-full min-h-[500px] bg-[#121621] rounded-[3rem] p-12 flex flex-col justify-center items-center text-center relative overflow-hidden border border-white/5 shadow-2xl group/card">
                  {/* Decorative Glow */}
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#C02026]/10 rounded-full blur-[100px] group-hover/card:bg-[#C02026]/20 transition-all duration-1000" />
                  
                  <div className="relative z-10 space-y-8 w-full">
                    <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover/card:rotate-12 transition-all duration-500">
                      <Star className="text-[#C02026] fill-[#C02026]" size={36} />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-white text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">
                        {isAr ? 'هل تبحث عن المزيد؟' : 'Seeking More?'}
                      </h3>
                      <p className="text-slate-400 text-sm font-bold leading-relaxed max-w-[280px] mx-auto">
                        {isAr 
                          ? 'لدينا قائمة حصرية من الوحدات والمشاريع "Off-Market" لم تُعرض بعد.' 
                          : 'Discover exclusive off-market units and private investment deals today.'}
                      </p>
                    </div>

                    {/* 🚀 Dual Conversion Buttons */}
                    <div className="flex flex-col gap-3 w-full pt-6">
                      
                      {/* زر الاتصال الجديد (Primary Focus) */}
                      <a 
                        href={`tel:${CONTACT_INFO.phone}`} 
                        className="bg-white text-slate-900 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#C02026] hover:text-white transition-all active:scale-95 shadow-2xl"
                      >
                        <Phone size={18} /> {isAr ? 'اتصل الآن' : 'Call Directly'}
                      </a>

                      {/* زر الواتساب (Secondary Focus) */}
                      <a 
                        href={whatsappLink} 
                        target="_blank"
                        className="bg-[#25D366] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-green-500/10"
                      >
                        <MessageCircle size={20} /> {isAr ? 'واتساب' : 'WhatsApp'}
                      </a>
                    </div>
                  </div>

                  <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#C02026]/5 rounded-full blur-[100px]" />
                </div>
              </SwiperSlide>
            </Swiper>
          ) : (
            <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner">
              <p className="text-slate-300 font-black uppercase tracking-widest text-xs">
                {isAr ? 'لا توجد مشاريع مطابقة حالياً' : 'No Assets Found in this Category'}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .project-swiper .swiper-scrollbar { 
          background: rgba(226, 232, 240, 0.5); 
          height: 3px !important; 
          bottom: -10px !important; 
          width: 60% !important;
          left: 20% !important;
        }
        .project-swiper .swiper-scrollbar-drag { background: #C02026; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}