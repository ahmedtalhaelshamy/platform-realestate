'use client';

import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, FreeMode } from 'swiper/modules';
import { 
  ArrowLeft, ArrowRight, MapPin, 
  Phone, MessageCircle, Building2, ArrowUpRight 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/client'; 
import { CONTACT_INFO } from '@/components/constants/contact'; 

// استيراد ستايلات Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

// ✅ دالة الأمان لمنع خطأ الـ Objects كأبناء لـ React
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  return String(val);
};

/**
 * 🏆 AutoProjectCarousel - Premium Auto-Slider 2026
 * مُحسن للأداء العالي (LCP) ودعم كامل للغات (RTL/LTR)
 */
export default function AutoProjectCarousel({ projects, lang, desktopSlides = 4 }) {
  const isArabic = lang === 'ar';

  if (!projects || projects.length === 0) return null;

  return (
    <section 
      className="relative group/swiper px-2 md:px-6" 
      dir={isArabic ? "rtl" : "ltr"} // ضروري للـ Swiper لكي يعمل السحب بشكل صحيح
      aria-label={isArabic ? "معرض المشاريع المميزة" : "Featured Projects Carousel"}
    >
      
      {/* 🧭 أزرار التنقل المخصصة - باستخدام Logical Properties (start/end) */}
      <div className="absolute top-1/2 -translate-y-1/2 start-1 z-30 opacity-0 group-hover/swiper:opacity-100 transition-all duration-500 hidden lg:block">
        <button 
          className="swiper-button-prev-custom bg-white/95 backdrop-blur-md text-slate-900 p-4 rounded-2xl shadow-premium hover:bg-brand-red hover:text-white transition-all border border-white/20 active:scale-90 outline-none focus-visible:ring-4 focus-visible:ring-brand-red/30"
          aria-label={isArabic ? "المشروع السابق" : "Previous project"}
        >
           <ArrowLeft size={24} className="rtl:-scale-x-100" />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 end-1 z-30 opacity-0 group-hover/swiper:opacity-100 transition-all duration-500 hidden lg:block">
        <button 
          className="swiper-button-next-custom bg-white/95 backdrop-blur-md text-slate-900 p-4 rounded-2xl shadow-premium hover:bg-brand-red hover:text-white transition-all border border-white/20 active:scale-90 outline-none focus-visible:ring-4 focus-visible:ring-brand-red/30"
          aria-label={isArabic ? "المشروع التالي" : "Next project"}
        >
           <ArrowRight size={24} className="rtl:-scale-x-100" />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Navigation, Pagination, FreeMode]}
        dir={isArabic ? "rtl" : "ltr"} // إخبار السلايدر باتجاه الصفحة
        spaceBetween={24}
        slidesPerView={1.1}
        freeMode={true}
        loop={projects.length >= 4}
        speed={1000}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          640: { slidesPerView: 1.5, spaceBetween: 20 },
          768: { slidesPerView: 2.2, spaceBetween: 24, freeMode: false },
          1024: { 
            slidesPerView: desktopSlides < 4 ? desktopSlides : 3, 
            spaceBetween: 28 
          },
          1440: { 
            slidesPerView: desktopSlides, 
            spaceBetween: 32 
          },
        }}
        className="pb-16 pt-6 !overflow-visible"
      >
        {projects.map((project, index) => (
          <SwiperSlide key={project._id || index} className="h-auto">
            <div className="h-full py-4">
               {/* تمرير خاصية الأولوية لأول كارتين فقط لتحسين الـ LCP */}
               <CarouselProjectCard project={project} lang={lang} isPriority={index < 2} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullet-active { background: #C02026 !important; }
        .swiper-pagination { bottom: 0 !important; }
      `}} />
    </section>
  );
}

/**
 * 🃏 CarouselProjectCard - Optimized Internal Component
 */
const CarouselProjectCard = ({ project, lang, isPriority }) => {
  const isArabic = lang === 'ar';

  const projectSlug = project?.slug?.current || project?.slug || "#";
  const projectUrl = `/${lang}/projects/${projectSlug}/`; 
  
  const formattedPrice = useMemo(() => {
    return project?.price 
      ? new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-US', { 
          notation: 'compact', 
          maximumFractionDigits: 1 
        }).format(project.price) 
      : '---';
  }, [project?.price, isArabic]);

  const whatsappNum = (CONTACT_INFO?.whatsapp || "").toString().replace(/\D/g,'');
  const phoneNum = (CONTACT_INFO?.phone || "").toString().replace(/\D/g,'');

  const whatsappLink = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    isArabic ? `مهتم بمشروع: ${getSafeText(project?.titleAr)}` : `Inquiry about: ${getSafeText(project?.titleEn)}`
  )}`;

  const locationName = isArabic 
    ? getSafeText(project?.location?.nameAr || project?.districtData?.nameAr || project?.district?.nameAr || "موقع متميز") 
    : getSafeText(project?.location?.nameEn || project?.districtData?.nameEn || project?.district?.nameEn || "Prime Location");

  return (
    <div className="group relative bg-white rounded-3xl p-3.5 border border-slate-100 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-premium hover:-translate-y-1.5 overflow-hidden">
      
      {/* 🖼️ Optimized Image Section */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 shrink-0">
        <Link href={projectUrl} aria-label={isArabic ? project?.titleAr : project?.titleEn} className="outline-none">
          {project?.mainImage ? (
          <Image 
  src={urlFor(project.mainImage).format('webp').quality(80).url()} 
  alt={isArabic ? getSafeText(project?.titleAr) : getSafeText(project?.titleEn)}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isPriority}
  className="object-cover transition-transform duration-[2s] group-hover:scale-110 will-change-transform"
/>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
              <Building2 size={48} aria-hidden="true" />
            </div>
          )}
        </Link>

        {project?.isNewLaunch && (
          <div className={`absolute top-4 start-4 z-10 pointer-events-none`}>
            <span className="bg-brand-red text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase shadow-lg tracking-wider animate-pulse">
              {isArabic ? 'إطلاق حديث' : 'New Launch'}
            </span>
          </div>
        )}
      </div>

      <div className="px-1 flex flex-col flex-grow text-start">
        {/* Developer Tag */}
        <div className="flex items-center gap-2 mb-2">
           <div className="bg-brand-red/5 p-1 rounded-md">
              <Building2 size={12} className="text-brand-red" aria-hidden="true" />
           </div>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
             {isArabic ? getSafeText(project?.developer?.nameAr) : getSafeText(project?.developer?.nameEn)}
           </span>
        </div>

        {/* Project Title */}
        <h3 className={`text-lg font-black text-slate-900 mb-2 leading-tight line-clamp-1 hover:text-brand-red transition-colors ${isArabic ? 'tracking-normal' : 'italic tracking-tight'}`}>
            <Link href={projectUrl} className="outline-none focus-visible:underline">
              {isArabic ? getSafeText(project?.titleAr) : getSafeText(project?.titleEn)}
            </Link>
        </h3>

        {/* Location Info */}
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={14} className="text-brand-red" aria-hidden="true" /> 
          <span className="text-xs font-bold text-slate-500 truncate">{locationName}</span>
        </div>

        {/* 📊 Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center transition-colors group-hover:bg-white group-hover:border-red-50">
             <span className="text-sm font-black text-slate-900 leading-none mb-1">{project?.installments || '0'}</span>
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{isArabic ? 'سنة تقسيط' : 'Years Plan'}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center transition-colors group-hover:bg-white group-hover:border-red-50">
             <span className="text-sm font-black text-slate-900 leading-none mb-1">{project?.downPayment || '0'}%</span>
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{isArabic ? 'مقدم حجز' : 'Down Pay'}</span>
          </div>
        </div>

        {/* 💰 Price Container */}
        <div className="bg-slate-950 p-4 rounded-2xl flex items-center justify-between mb-5 mt-auto shadow-lg">
            <div className="flex flex-col text-start">
              <span className="text-lg font-black text-white tracking-tighter">
                {formattedPrice} <span className="text-[10px] text-brand-red">{isArabic ? 'ج.م' : 'EGP'}</span>
              </span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{isArabic ? 'يبدأ من' : 'Starts From'}</span>
            </div>
            <Link 
              href={projectUrl} 
              aria-label={isArabic ? "عرض تفاصيل المشروع" : "View project details"}
              className="bg-white/10 hover:bg-brand-red text-white w-10 h-10 rounded-xl transition-all flex items-center justify-center group/arrow outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowUpRight size={20} className="group-hover/arrow:rotate-45 transition-transform" />
            </Link>
        </div>

        {/* 📞 Contact Actions */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <a 
            href={`tel:${phoneNum}`} 
            aria-label={isArabic ? "اتصال بمبيعات المشروع" : "Call sales"}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-100 text-slate-900 hover:bg-slate-950 hover:text-white transition-all font-bold text-xs active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
          >
            <Phone size={16} aria-hidden="true" /> {isArabic ? 'اتصال' : 'Call'}
          </a>
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label={isArabic ? "استفسار عبر واتساب" : "Inquiry via WhatsApp"}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all font-bold text-xs active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            <MessageCircle size={16} aria-hidden="true" /> {isArabic ? 'واتساب' : 'WhatsApp'}
          </a>
        </div>
      </div>
    </div>
  );
}