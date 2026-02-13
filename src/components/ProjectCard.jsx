'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/client'; 
import { CONTACT_INFO } from '@/components/constants/contact'; 
import { 
  MapPin, 
  ArrowUpRight,
  Phone,
  MessageCircle,
  Building2,
  GitCompare, 
  Check,
  Share2 
} from 'lucide-react';

export default function ProjectCard({ data: project, lang }) {
  const [isInCompare, setIsInCompare] = useState(false);
  const isAr = lang === 'ar';

  // التحقق من حالة المقارنة (محسن)
  const checkCompareState = useCallback(() => {
    try {
      const current = JSON.parse(localStorage.getItem('compare_projects') || '[]');
      setIsInCompare(current.some(p => p._id === project?._id));
    } catch (e) { console.error(e); }
  }, [project?._id]);

  useEffect(() => {
    checkCompareState();
    window.addEventListener('compareUpdated', checkCompareState);
    window.addEventListener('storage', checkCompareState);
    return () => {
      window.removeEventListener('compareUpdated', checkCompareState);
      window.removeEventListener('storage', checkCompareState);
    };
  }, [checkCompareState]);

  if (!project) return null;

  const toggleCompare = (e) => {
    e.preventDefault(); e.stopPropagation();
    try {
      const current = JSON.parse(localStorage.getItem('compare_projects') || '[]');
      if (isInCompare) {
        const updated = current.filter(p => p._id !== project._id);
        localStorage.setItem('compare_projects', JSON.stringify(updated));
      } else {
        if (current.length >= 4) return alert(isAr ? '4 مشاريع كحد أقصى' : 'Max 4 projects');
        localStorage.setItem('compare_projects', JSON.stringify([...current, project]));
      }
      window.dispatchEvent(new Event('compareUpdated'));
    } catch (e) { console.error(e); }
  };

  const handleShare = async (e) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/${lang}/projects/${project.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: isAr ? project.titleAr : project.titleEn,
          url: url
        });
      } catch (err) { /* ignore */ }
    } else {
      navigator.clipboard.writeText(url);
      alert(isAr ? 'تم نسخ الرابط' : 'Link copied');
    }
  };

  // تنسيق السعر بشكل احترافي (مثلاً: 5.2M ج.م)
  const formattedPrice = project.price 
    ? new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', { 
        notation: "compact", 
        maximumFractionDigits: 1 
      }).format(project.price) + (isAr ? ' ج.م' : ' EGP')
    : (isAr ? 'اتصل للسعر' : 'Call for price');

  const whatsappLink = `https://wa.me/${CONTACT_INFO.whatsapp?.replace(/\D/g,'')}?text=${encodeURIComponent(
    isAr ? `استفسار عن: ${project.titleAr}` : `Inquiry about: ${project.titleEn}`
  )}`;

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-3 border border-slate-100 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 📸 Image & Actions Section */}
      <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-4 bg-slate-100">
        <Image 
          src={project.mainImage ? urlFor(project.mainImage).width(600).height(450).quality(90).url() : "/placeholder.jpg"}
          alt={isAr ? project.titleAr : project.titleEn}
          fill
          priority={project.isNewLaunch}
          className="object-cover transition-transform duration-[2s] group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Overlay Buttons - تظهر بوضوح عند الـ Hover */}
        <div className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-20 flex flex-col gap-2 transition-all duration-500 md:opacity-0 md:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0`}>
          <button 
            onClick={toggleCompare}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md border ${
              isInCompare ? 'bg-[#C02026] text-white border-[#C02026]' : 'bg-white/90 text-slate-900 border-white/20 hover:bg-slate-950 hover:text-white'
            }`}
          >
            {isInCompare ? <Check size={20} strokeWidth={3} /> : <GitCompare size={20} />}
          </button>

          <button 
            onClick={handleShare}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/20 bg-white/90 text-slate-900 hover:bg-slate-950 hover:text-white"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Badges */}
        <div className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} z-10 flex flex-col gap-2`}>
          {project.isNewLaunch && (
            <span className="bg-[#C02026] text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase shadow-xl tracking-tighter animate-pulse">
              {isAr ? 'إطلاق جديد' : 'New Launch'}
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className={`absolute bottom-4 ${isAr ? 'left-4' : 'right-4'} z-10`}>
           <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/20 text-slate-900 font-black text-sm">
              {formattedPrice}
           </div>
        </div>
      </div>

      {/* 📝 Content Section */}
      <div className="flex flex-col flex-grow px-2 pb-2">
        <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                <Building2 size={12} />
                <span className="text-[10px] font-bold uppercase truncate max-w-[80px]">
                  {isAr ? (project.developer?.nameAr || "مطور معتمد") : (project.developer?.nameEn || "Developer")}
                </span>
            </div>
            <div className="flex items-center gap-1 text-[#C02026] bg-red-50 px-2.5 py-1 rounded-lg">
                <MapPin size={12} /> 
                <span className="text-[10px] font-bold truncate max-w-[100px]">
                  {isAr ? (project.districtData?.nameAr || "موقع متميز") : (project.districtData?.nameEn || "Prime Location")}
                </span>
            </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-[#C02026] transition-colors line-clamp-2 min-h-[3.5rem]">
          <Link href={`/${lang}/projects/${project.slug}`}>
            {isAr ? project.titleAr : project.titleEn}
          </Link>
        </h3>

        {/* Features Row */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-slate-50 p-3 rounded-[1.2rem] border border-slate-100 flex flex-col items-center">
             <span className="text-xs font-black text-slate-900">{project.installments || '0'}</span>
             <span className="text-[9px] text-slate-400 font-bold uppercase">{isAr ? 'سنوات تقسيط' : 'Yrs Plan'}</span>
          </div>
          <div className="flex-1 bg-slate-50 p-3 rounded-[1.2rem] border border-slate-100 flex flex-col items-center">
             <span className="text-xs font-black text-slate-900">{project.downPayment || '0'}%</span>
             <span className="text-[9px] text-slate-400 font-bold uppercase">{isAr ? 'مقدم' : 'Down Pay'}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto flex items-center gap-2">
            <a 
              href={`tel:${CONTACT_INFO.phone}`} 
              className="flex-1 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-2 hover:bg-[#C02026] transition-all duration-300 shadow-lg active:scale-95"
            >
                <Phone size={18} />
                <span className="text-xs font-bold">{isAr ? 'اتصل' : 'Call'}</span>
            </a>
            
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-300 border border-green-100 active:scale-95"
            >
                <MessageCircle size={20} />
            </a>
            
            <Link 
              href={`/${lang}/projects/${project.slug}`} 
              className="w-12 h-12 rounded-2xl bg-red-50 text-[#C02026] flex items-center justify-center hover:bg-[#C02026] hover:text-white transition-all duration-300 border border-red-100 active:scale-95"
            >
                <ArrowUpRight size={20} />
            </Link>
        </div>
      </div>
    </div>
  );
}