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
  { id: 'ready', labelAr: 'استلام فوري', labelEn: 'Ready to Move', icon: Home, field: 'isReadyToMove' }, // مطابقة للسيكيما
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

  // 🧠 المنطق المحدث للفلترة التلقائية
  const displayProjects = useMemo(() => {
    if (!isMounted) return [];

    const currentTab = TABS.find(t => t.id === activeTab);
    
    // الفلترة بناءً على الحقول البوليان (Boolean) اللي جاية من Sanity
    let filtered = activeTab === 'all' 
      ? projects 
      : projects.filter(p => p[currentTab?.field] === true);

    return filtered.length > 0 ? shuffleArray(filtered) : [];
  }, [activeTab, projects, isMounted]);

  const whatsappLink = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(isAr ? 'أريد الاستفسار عن وحدات ومشاريع حصرية إضافية' : 'Inquiry about exclusive off-market projects')}`;

  if (!isMounted) {
    return <section className="py-24 bg-slate-50 min-h-[700px]" />;
  }

  return (
    <section className="py-24 bg-slate-50 relative font-sans overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        
        {/* HEADER */}
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
        </div>

        {/* TABS */}
        <div className="mb-16 overflow-x-auto pb-6 no-scrollbar flex justify-start">
          <div className="flex items-center gap-3 min-w-max p-1 bg-white rounded-full border border-slate-100 shadow-sm">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500
                    ${isActive 
                      ? 'bg-[#121621] text-white shadow-xl scale-105' 
                      : 'bg-transparent text-slate-500 hover:text-[#C02026]'
                    }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#C02026]' : 'text-slate-400'} />
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* SLIDER */}
        <div className="relative group/slider">
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

              {/* CTA CARD */}
              <SwiperSlide className="h-auto">
                <div className="h-full min-h-[500px] bg-[#121621] rounded-[3rem] p-12 flex flex-col justify-center items-center text-center relative overflow-hidden border border-white/5 shadow-2xl group/card">
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#C02026]/10 rounded-full blur-[100px]" />
                  <div className="relative z-10 space-y-8 w-full">
                    <div className="space-y-3">
                      <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter">
                        {isAr ? 'هل تبحث عن المزيد؟' : 'Seeking More?'}
                      </h3>
                      <p className="text-slate-400 text-sm font-bold">
                        {isAr ? 'تواصل معنا لعروض حصرية لم تُنشر بعد.' : 'Contact us for exclusive off-market deals.'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      <a href={`tel:${CONTACT_INFO.phone}`} className="bg-white text-slate-900 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl">
                        <Phone size={18} /> {isAr ? 'اتصل الآن' : 'Call Now'}
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          ) : (
            <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
              <p className="text-slate-300 font-black uppercase tracking-widest text-xs">
                {isAr ? 'لا توجد مشاريع في هذا القسم حالياً' : 'No Projects Found in this Category'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}