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
 * تم تحسينه ليعمل بتناغم مع نظام الـ WebP في ProjectCard وإضافة أزرار التنقل للديسكتوب
 */
export default function FeaturedProjects({ projects = [], isAr, lang }) {
  const [activeTab, setActiveTab] = useState('all');

  // ✅ التصفية الذكية: يتم استخدام useMemo لضمان عدم إعادة الحساب إلا عند تغيير التبويب
  const filteredProjects = useMemo(() => {
    const currentTab = TABS.find(t => t.id === activeTab);
    return activeTab === 'all' 
      ? projects 
      : projects.filter(p => p[currentTab?.field] === true);
  }, [activeTab, projects]);

  // تأمين الأرقام لمنع خطأ replace 
  const whatsappNum = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');
  const phoneNum = (CONTACT_INFO.phone || "").toString().replace(/\D/g, '');

  const whatsappLink = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(isAr ? 'أريد الاستفسار عن وحدات ومشاريع حصرية' : 'Inquiry about exclusive projects')}`;

  return (
    <section 
      className="py-32 bg-white relative overflow-hidden group/featured" 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 relative">
        
        {/* 1. Header Section - Optimized for LCP */}
        <div className="mb-16 space-y-4 text-start">
          <div className="flex items-center gap-3 text-[#C02026]">
             <span className="w-12 h-[2px] bg-[#C02026]" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">
               {isAr ? 'مختاراتنا العقارية' : 'Curated Portfolio'}
             </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 italic uppercase tracking-tighter">
            {isAr ? 'أبرز المشاريع' : 'Featured Assets'}<span className="text-[#C02026]">.</span>
          </h2>
        </div>

        {/* 2. Interactive Tabs - High Accessibility */}
        <div className="mb-16 flex overflow-x-auto no-scrollbar pb-4 scroll-smooth">
          <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-100 shadow-inner" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[#121621] text-white shadow-2xl scale-105' 
                    : 'text-slate-400 hover:text-[#C02026] hover:bg-white'
                }`}
              >
                <tab.icon size={16} />
                {isAr ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 🚀 أزرار التنقل المخصصة (تظهر فقط على الديسكتوب وتختفي في الموبايل) */}
        <button 
          className="featured-prev absolute left-0 md:left-4 top-[60%] z-30 hidden lg:flex w-16 h-16 bg-white/90 backdrop-blur-md text-slate-900 rounded-full shadow-2xl items-center justify-center border border-slate-100 hover:bg-[#C02026] hover:text-white transition-all opacity-0 group-hover/featured:opacity-100 -translate-y-1/2 active:scale-90"
          aria-label={isAr ? "السابق" : "Previous"}
        >
           <ArrowLeft size={28} />
        </button>
        <button 
          className="featured-next absolute right-0 md:right-4 top-[60%] z-30 hidden lg:flex w-16 h-16 bg-white/90 backdrop-blur-md text-slate-900 rounded-full shadow-2xl items-center justify-center border border-slate-100 hover:bg-[#C02026] hover:text-white transition-all opacity-0 group-hover/featured:opacity-100 -translate-y-1/2 active:scale-90"
          aria-label={isAr ? "التالي" : "Next"}
        >
           <ArrowRight size={28} />
        </button>

        {/* 3. Optimized Swiper Slider */}
        <div className="relative min-h-[550px]">
          <Swiper
            // ✅ ربط الأزرار المخصصة بالـ Swiper
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
            {filteredProjects.map((project) => (
              <SwiperSlide key={project._id} className="h-auto">
                 <ProjectCard lang={lang} data={project} />
              </SwiperSlide>
            ))}

            {/* 📞 Premium CTA Slide */}
            <SwiperSlide className="h-auto">
              <div className="h-full min-h-[520px] bg-[#121621] rounded-[3.5rem] p-12 flex flex-col justify-center items-center text-center relative overflow-hidden group/cta border-b-[12px] border-[#C02026] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C02026]/20 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10 space-y-10">
                  <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto border border-white/10 shadow-2xl group-hover/cta:scale-110 transition-transform duration-500">
                     <TrendingUp size={32} className="text-[#C02026]" />
                  </div>
                  
                  <h3 className="text-white text-3xl md:text-4xl font-black italic uppercase leading-tight tracking-tighter">
                    {isAr ? 'هل تبحث عن\nفرصة استثنائية؟' : 'Looking for\nSomething Else?'}
                  </h3>

                  <div className="space-y-4 w-full">
                    <a 
                      href={`tel:${phoneNum}`} 
                      className="flex items-center justify-center gap-4 bg-white text-slate-950 w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#C02026] hover:text-white transition-all shadow-2xl active:scale-95"
                    >
                      <Phone size={18} /> {isAr ? 'اتصل بمستشارك' : 'Call Specialist'}
                    </a>
                    <a 
                      href={whatsappLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-4 bg-[#25D366] text-white w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl active:scale-95"
                    >
                      <MessageCircle size={18} fill="currentColor" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        /* إخفاء الأزرار الافتراضية إذا ظهرت */
        .swiper-button-next, .swiper-button-prev { display: none !important; }
        
        /* تفعيل الأزرار المخصصة للعمل عند الهوفر فقط في شاشات الكمبيوتر */
        .featured-prev, .featured-next {
           cursor: pointer;
        }
        .featured-prev.swiper-button-disabled, 
        .featured-next.swiper-button-disabled {
           opacity: 0.3 !important;
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
      `}</style>
    </section>
  );
}