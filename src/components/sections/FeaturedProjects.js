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
  ChevronLeft, ChevronRight, Phone, MessageCircle 
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

export default function FeaturedProjects({ projects = [], isAr, lang }) {
  const [activeTab, setActiveTab] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🧠 فلترة المشاريع مع التبديل السلس
  const displayProjects = useMemo(() => {
    if (!isMounted) return [];

    const currentTab = TABS.find(t => t.id === activeTab);
    
    let filtered = activeTab === 'all' 
      ? projects 
      : projects.filter(p => p[currentTab?.field] === true);

    return filtered.length > 0 ? shuffleArray(filtered) : [];
  }, [activeTab, projects, isMounted]);

  // تجهيز روابط التواصل
  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? 'أريد الاستفسار عن وحدات ومشاريع حصرية إضافية' : 'Inquiry about exclusive off-market projects')}`;

  if (!isMounted) {
    return <section className="py-24 bg-slate-50 min-h-[700px]" aria-hidden="true" />;
  }

  return (
    <section 
      className="py-24 bg-slate-50 relative font-sans overflow-hidden" 
      dir={isAr ? 'rtl' : 'ltr'}
      aria-labelledby="featured-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 text-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#C02026]">
               <span className="w-12 h-[2px] bg-[#C02026]" aria-hidden="true"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                 {isAr ? 'مختاراتنا العقارية' : 'Curated Portfolio'}
               </span>
            </div>
            <h2 id="featured-heading" className="text-4xl md:text-6xl font-black text-slate-900 leading-none italic uppercase tracking-tighter">
              {isAr ? 'أبرز المشاريع' : 'Featured Assets'}<span className="text-[#C02026]">.</span>
            </h2>
          </div>
        </div>

        {/* TABS - Accessibility Upgraded to Tablist */}
        <div className="mb-16 overflow-x-auto pb-6 no-scrollbar flex justify-start">
          <div 
            className="flex items-center gap-3 min-w-max p-1 bg-white rounded-full border border-slate-100 shadow-sm"
            role="tablist"
            aria-label="Project categories"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="project-slider"
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 active:scale-95
                    ${isActive 
                      ? 'bg-[#121621] text-white shadow-xl scale-105' 
                      : 'bg-transparent text-slate-500 hover:text-[#C02026]'
                    }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#C02026]' : 'text-slate-400'} aria-hidden="true" />
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* SLIDER */}
        <div className="relative group/slider" id="project-slider" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {displayProjects.length > 0 ? (
            <Swiper
              key={activeTab} 
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Navigation, Autoplay, Scrollbar]}
              spaceBetween={24}
              slidesPerView={1.15}
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

              {/* CTA CARD - Upgraded for Accessibility & UX */}
              <SwiperSlide className="h-auto">
                <div className="h-full min-h-[500px] bg-[#121621] rounded-[3rem] p-10 flex flex-col justify-center items-center text-center relative overflow-hidden border border-white/5 shadow-2xl group/card">
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#C02026]/10 rounded-full blur-[100px]" aria-hidden="true" />
                  
                  <div className="relative z-10 space-y-10 w-full">
                    <div className="space-y-4">
                      <h3 className="text-white text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-tight">
                        {isAr ? 'هل تبحث عن المزيد؟' : 'Seeking More?'}
                      </h3>
                      <p className="text-slate-400 text-sm font-medium max-w-[250px] mx-auto">
                        {isAr ? 'تواصل معنا الآن للحصول على قائمة الوحدات الحصرية المتاحة حالياً.' : 'Contact us for the full inventory of exclusive off-market deals.'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                      <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                         aria-label={isAr ? "اتصال هاتف مبيعات" : "Call sales team"}
                         className="bg-white text-slate-950 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-transform hover:-translate-y-1 active:scale-95">
                        <Phone size={18} fill="currentColor" /> {isAr ? 'اتصال مباشر' : 'Call Now'}
                      </a>
                      
                      <a href={whatsappLink} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         aria-label={isAr ? "استفسار عبر واتساب" : "Inquiry via WhatsApp"}
                         className="bg-[#25D366] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-transform hover:-translate-y-1 active:scale-95">
                        <MessageCircle size={18} fill="currentColor" /> {isAr ? 'واتساب مباشر' : 'WhatsApp'}
                      </a>
                    </div>

                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                       {isAr ? 'متاحون على مدار الساعة' : 'Available 24/7'}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          ) : (
            <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100" role="alert">
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                {isAr ? 'لا توجد مشاريع في هذا القسم حالياً' : 'No Projects Found in this Category'}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .project-swiper .swiper-scrollbar {
          background: rgba(0,0,0,0.05) !important;
          height: 4px !important;
          bottom: 40px !important;
          width: 50% !important;
          left: 25% !important;
        }
        .project-swiper .swiper-scrollbar-drag {
          background: #C02026 !important;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}