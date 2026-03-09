'use client';

import { useState, useMemo } from 'react';
import ProjectCard from '../ProjectCard'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Scrollbar, FreeMode, Pagination } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/free-mode';

import { 
  LayoutGrid, Rocket, Home, TrendingUp, Star, 
  Phone, MessageCircle, ArrowLeft, ArrowRight
} from 'lucide-react';

import { CONTACT_INFO } from '@/components/constants/contact';

const TABS = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: LayoutGrid, field: null },
  { id: 'new', labelAr: 'إطلاق حديث', labelEn: 'New Launch', icon: Rocket, field: 'isNewLaunch' },
  { id: 'ready', labelAr: 'استلام فوري', labelEn: 'Ready to Move', icon: Home, field: 'isReadyToMove' }, 
  { id: 'investment', labelAr: 'فرص استثمارية', labelEn: 'Investment', icon: TrendingUp, field: 'isInvestmentOpportunity' },
  { id: 'featured', labelAr: 'مشاريع مميزة', labelEn: 'Featured', icon: Star, field: 'isFeatured' },
];

/**
 * 🏆 FeaturedProjects - 2026 Premium Slider
 * تم التحسين لضمان توافق السلايدر مع Bunny.net والـ RTL الصارم.
 */
export default function FeaturedProjects({ projects = [], isAr, lang }) {
  const [activeTab, setActiveTab] = useState('all');

  // ✅ التصفية الذكية باستخدام useMemo
  const filteredProjects = useMemo(() => {
    const currentTab = TABS.find(t => t.id === activeTab);
    return activeTab === 'all' 
      ? projects 
      : projects.filter(p => p[currentTab?.field] === true);
  }, [activeTab, projects]);

  const whatsappNum = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');
  const phoneNum = (CONTACT_INFO.phone || "").toString().replace(/\D/g, '');

  const whatsappLink = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(isAr ? 'أريد الاستفسار عن وحدات ومشاريع حصرية' : 'Inquiry about exclusive projects')}`;

  return (
    <section 
      className="py-32 bg-white relative overflow-hidden group/featured" 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="max-w-[1440px] mx-auto px-6 relative">
        
        {/* 1. Header Section */}
        <div className="mb-16 space-y-4 text-start">
          <div className="flex items-center gap-3 text-brand-red">
             <span className="w-12 h-[2px] bg-brand-red" />
             <span className={`text-[10px] font-black uppercase ${isAr ? 'tracking-wider' : 'tracking-[0.4em]'}`}>
               {isAr ? 'مختاراتنا العقارية' : 'Curated Portfolio'}
             </span>
          </div>
          <h2 className={`text-5xl md:text-8xl font-black text-slate-900 uppercase ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
            {isAr ? 'أبرز المشاريع' : 'Featured Assets'}<span className="text-brand-red not-italic">.</span>
          </h2>
        </div>

        {/* 2. Interactive Tabs */}
        <div className="mb-16 flex overflow-x-auto no-scrollbar pb-4 scroll-smooth">
          <div className="flex bg-slate-50 p-2 rounded-full border border-slate-100 shadow-inner" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-brand-red ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-lg scale-105' 
                    : 'text-slate-600 hover:text-brand-red hover:bg-white'
                }`}
              >
                <tab.icon size={16} aria-hidden="true" />
                {isAr ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 🚀 أزرار التنقل المخصصة (دعم الـ RTL الصارم) */}
        <button 
          type="button"
          className="featured-prev absolute start-8 top-[60%] z-30 hidden lg:flex w-16 h-16 bg-white/95 backdrop-blur-md text-slate-900 rounded-full shadow-premium items-center justify-center border border-slate-100 hover:bg-brand-red hover:text-white transition-all opacity-0 group-hover/featured:opacity-100 -translate-y-1/2 active:scale-90 outline-none"
          aria-label={isAr ? "السابق" : "Previous"}
        >
           <ArrowLeft size={28} className="rtl:rotate-180" aria-hidden="true" />
        </button>
        <button 
          type="button"
          className="featured-next absolute end-8 top-[60%] z-30 hidden lg:flex w-16 h-16 bg-white/95 backdrop-blur-md text-slate-900 rounded-full shadow-premium items-center justify-center border border-slate-100 hover:bg-brand-red hover:text-white transition-all opacity-0 group-hover/featured:opacity-100 -translate-y-1/2 active:scale-90 outline-none"
          aria-label={isAr ? "التالي" : "Next"}
        >
           <ArrowRight size={28} className="rtl:rotate-180" aria-hidden="true" />
        </button>

        {/* 3. Optimized Swiper Slider */}
        <div className="relative min-h-[550px]">
          <Swiper
            // ✅ الحل الجذري لمشاكل تغيير اللغة
            key={`${lang}-${activeTab}`} 
            dir={isAr ? 'rtl' : 'ltr'}
            modules={[Navigation, Autoplay, Scrollbar, FreeMode, Pagination]}
            navigation={{
              prevEl: '.featured-prev',
              nextEl: '.featured-next',
            }}
            spaceBetween={24}
            slidesPerView={1.2}
            freeMode={true}
            watchSlidesProgress={true}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            scrollbar={{ draggable: true, hide: false }}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 24 },
              768: { slidesPerView: 2.2, spaceBetween: 30, freeMode: false },
              1024: { slidesPerView: 2.8, spaceBetween: 32 },
              1280: { slidesPerView: 3.2, spaceBetween: 40 },
            }}
            className="!pb-24 !overflow-visible"
          >
            {filteredProjects.map((project, index) => (
              <SwiperSlide key={project._id} className="h-auto">
                 {/* ✅ تحسين الـ LCP: المشروع الأول يحمل صورته فوراً من Bunny */}
                 <ProjectCard 
                   lang={lang} 
                   data={project} 
                   isPriority={index === 0} 
                 />
              </SwiperSlide>
            ))}

            {/* 📞 Premium CTA Slide */}
            <SwiperSlide className="h-auto">
              <div className="h-full min-h-[520px] bg-slate-900 rounded-[3rem] p-12 flex flex-col justify-center items-center text-center relative overflow-hidden group/cta border-b-[8px] border-brand-red shadow-premium">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative z-10 space-y-10 w-full">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto border border-white/10 shadow-2xl group-hover/cta:scale-110 transition-transform duration-500">
                     <TrendingUp size={32} className="text-brand-red" aria-hidden="true" />
                  </div>
                  
                  <h3 className={`text-white text-3xl md:text-5xl font-black uppercase leading-none ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
                    {isAr ? 'هل تبحث عن\nفرصة استثنائية؟' : 'Looking for\nSomething Else?'}
                  </h3>

                  <div className="space-y-4 w-full">
                    <a 
                      href={`tel:${phoneNum}`} 
                      className="flex items-center justify-center gap-4 bg-white text-slate-900 w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all shadow-xl active:scale-95"
                    >
                      <Phone size={18} aria-hidden="true" /> {isAr ? 'اتصل بمستشارك' : 'Call Specialist'}
                    </a>
                    <a 
                      href={whatsappLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-4 bg-[#25D366] text-white w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#20bd5a] transition-colors shadow-xl active:scale-95"
                    >
                      <MessageCircle size={18} fill="currentColor" aria-hidden="true" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .swiper-button-next, .swiper-button-prev { display: none !important; }
        .featured-prev.swiper-button-disabled, 
        .featured-next.swiper-button-disabled {
           opacity: 0.2 !important;
           cursor: not-allowed;
           pointer-events: none;
        }
        .swiper-scrollbar { 
          bottom: 0px !important; 
          height: 4px !important; 
          background: rgba(0,0,0,0.05) !important; 
          border-radius: 10px !important;
        }
        .swiper-scrollbar-drag { 
          background: #C02026 !important; 
          border-radius: 10px !important;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}