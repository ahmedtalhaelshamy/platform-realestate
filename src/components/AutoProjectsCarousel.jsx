'use client';

import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { 
  ArrowLeft, ArrowRight, MapPin, 
  Phone, MessageCircle, Building2, ArrowUpRight 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../sanity/client'; 
import { CONTACT_INFO } from '../components/constants/contact'; 

// استيراد ستايلات Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function AutoProjectCarousel({ projects, lang, isAr, desktopSlides = 4 }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section 
      className="relative group/swiper px-2 md:px-6" 
      dir="ltr" 
      aria-label={isAr ? "معرض المشاريع المميزة" : "Featured Projects Carousel"}
    >
      
      {/* 🧭 أزرار التنقل - إضافة aria-label للوصول 100% */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1 z-30 opacity-0 group-hover/swiper:opacity-100 transition-all duration-500 hidden lg:block">
        <button 
          className="swiper-button-prev-custom bg-white/90 backdrop-blur-md text-slate-900 p-4 rounded-2xl shadow-2xl hover:bg-[#C02026] hover:text-white transition-all border border-white/20 active:scale-90"
          aria-label={isAr ? "المشروع السابق" : "Previous project"}
        >
           <ArrowLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-1 z-30 opacity-0 group-hover/swiper:opacity-100 transition-all duration-500 hidden lg:block">
        <button 
          className="swiper-button-next-custom bg-white/90 backdrop-blur-md text-slate-900 p-4 rounded-2xl shadow-2xl hover:bg-[#C02026] hover:text-white transition-all border border-white/20 active:scale-90"
          aria-label={isAr ? "المشروع التالي" : "Next project"}
        >
           <ArrowRight size={24} />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1.1}
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
          768: { slidesPerView: 2.2, spaceBetween: 24 },
          1024: { 
            slidesPerView: desktopSlides < 4 ? desktopSlides : 3, 
            spaceBetween: 28 
          },
          1440: { 
            slidesPerView: desktopSlides, 
            spaceBetween: 32 
          },
        }}
        className="pb-16 pt-6"
      >
        {projects.map((project, index) => (
          <SwiperSlide key={project._id || index} className="h-auto">
            <div dir={isAr ? "rtl" : "ltr"} className="h-full py-4">
               <CarouselProjectCard project={project} lang={lang} isAr={isAr} isPriority={index < 2} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

const CarouselProjectCard = ({ project, lang, isAr, isPriority }) => {
  const projectSlug = project.slug?.current || project.slug || "#";
  const projectUrl = `/${lang}/projects/${projectSlug}/`; // ✅ إضافة السلاش النهائية للسيو
  
  const formattedPrice = useMemo(() => {
    return project.price 
      ? new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', { 
          notation: 'compact', 
          maximumFractionDigits: 1 
        }).format(project.price) 
      : '---';
  }, [project.price, isAr]);

  const whatsappLink = `https://wa.me/${CONTACT_INFO.whatsapp?.replace(/\D/g,'')}?text=${encodeURIComponent(
    isAr ? `مهتم بمشروع: ${project.titleAr}` : `Inquiry about: ${project.titleEn}`
  )}`;

  const locationName = isAr 
    ? (project.location?.nameAr || project.districtData?.nameAr || project.district?.nameAr || "موقع متميز") 
    : (project.location?.nameEn || project.districtData?.nameEn || project.district?.nameEn || "Prime Location");

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-3.5 border border-slate-100 transition-all duration-500 flex flex-col h-full shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(192,32,38,0.15)] hover:-translate-y-2 overflow-hidden">
      
      {/* 🖼️ Image Section */}
      <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-5 bg-slate-100 shrink-0">
        <Link href={projectUrl} aria-label={isAr ? project.titleAr : project.titleEn}>
          {project.mainImage ? (
            <Image 
              src={urlFor(project.mainImage).width(600).height(450).quality(90).url()} 
              alt={isAr ? project.titleAr : project.titleEn}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              priority={isPriority}
              className="object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
              <Building2 size={48} />
            </div>
          )}
        </Link>

        {project.isNewLaunch && (
          <div className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} z-10 pointer-events-none`}>
            <span className="bg-[#C02026] text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase shadow-2xl tracking-tighter animate-pulse">
              {isAr ? 'إطلاق حديث' : 'New Launch'}
            </span>
          </div>
        )}
      </div>

      <div className="px-2 flex flex-col flex-grow text-start">
        {/* Developer Tag */}
        <div className="flex items-center gap-2 mb-2">
           <div className="bg-red-50 p-1.5 rounded-lg">
              <Building2 size={12} className="text-[#C02026]" />
           </div>
           <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide truncate">
             {isAr ? project.developer?.nameAr : project.developer?.nameEn}
           </span>
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight line-clamp-1 hover:text-[#C02026] transition-colors">
            <Link href={projectUrl}>
              {isAr ? project.titleAr : project.titleEn}
            </Link>
        </h3>

        {/* Location Info */}
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={14} className="text-[#C02026]" /> 
          <span className="text-xs font-bold text-slate-500 truncate">{locationName}</span>
        </div>

        {/* 📊 Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center transition-colors group-hover:bg-white group-hover:border-red-100">
             <span className="text-sm font-black text-slate-900 leading-none mb-1">{project.installments || '0'}</span>
             <span className="text-[9px] font-bold text-slate-500 uppercase">{isAr ? 'سنوات تقسيط' : 'Years Plan'}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center transition-colors group-hover:bg-white group-hover:border-red-100">
             <span className="text-sm font-black text-slate-900 leading-none mb-1">{project.downPayment || '0'}%</span>
             <span className="text-[9px] font-bold text-slate-500 uppercase">{isAr ? 'مقدم حجز' : 'Down Pay'}</span>
          </div>
        </div>

        {/* 💰 Price Container */}
        <div className="bg-slate-950 p-4 rounded-[1.8rem] flex items-center justify-between mb-5 mt-auto shadow-xl">
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tighter">
                {formattedPrice} <span className="text-[10px] text-red-500">{isAr ? 'ج.م' : 'EGP'}</span>
              </span>
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{isAr ? 'يبدأ من' : 'Starts From'}</span>
            </div>
            <Link 
              href={projectUrl} 
              aria-label={isAr ? "عرض تفاصيل المشروع" : "View project details"}
              className="bg-white/10 hover:bg-[#C02026] text-white w-10 h-10 rounded-xl transition-all flex items-center justify-center group/arrow"
            >
              <ArrowUpRight size={20} className="group-hover/arrow:rotate-45 transition-transform" />
            </Link>
        </div>

        {/* 📞 Contact Actions */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <a 
            href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
            aria-label={isAr ? "اتصال هاتفي بمبيعات المشروع" : "Call project sales"}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-100 text-slate-900 hover:bg-slate-950 hover:text-white transition-all font-black text-xs active:scale-95"
          >
            <Phone size={16} /> {isAr ? 'اتصال' : 'Call'}
          </a>
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label={isAr ? "استفسار عبر واتساب" : "Inquiry via WhatsApp"}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all font-black text-xs active:scale-95"
          >
            <MessageCircle size={16} /> {isAr ? 'واتساب' : 'WhatsApp'}
          </a>
        </div>
      </div>
    </div>
  );
};