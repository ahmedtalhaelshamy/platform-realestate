'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/image'; 
import { CONTACT_INFO } from '@/components/constants/contact'; 
import { 
  MapPin, ArrowUpRight, Phone, MessageCircle, 
  Building2, GitCompare, Check, Share2 
} from 'lucide-react';

/**
 * 🃏 ProjectCard - Elite Performance & RTL Mastery (2026)
 * تم الإصلاح: حذف unoptimized للسماح لـ Bunny Loader بالعمل.
 */
export default function ProjectCard({ data: project, lang, isPriority = false }) {
  const [isInCompare, setIsInCompare] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAr = lang === 'ar';

  const whatsappNum = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');
  const phoneNum = (CONTACT_INFO.phone || "").toString().replace(/\s/g, '');

  const projectName = isAr ? project?.titleAr : project?.titleEn;
  const districtName = isAr ? project.district?.nameAr : project.district?.nameEn;
  const locationName = isAr ? project.locationData?.nameAr : project.locationData?.nameEn;

  const whatsappLink = useMemo(() => {
    const msg = isAr 
      ? `استفسار عن مشروع: ${projectName}` 
      : `Inquiry about: ${projectName}`;
    return `https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`;
  }, [projectName, isAr, whatsappNum]);

  useEffect(() => {
    setMounted(true);
    const checkState = () => {
      try {
        const current = JSON.parse(localStorage.getItem('compare_projects') || '[]');
        setIsInCompare(current.some(p => p._id === project?._id));
      } catch (e) { console.error("Compare Check Error:", e); }
    };
    checkState();
    window.addEventListener('compareUpdated', checkState);
    return () => window.removeEventListener('compareUpdated', checkState);
  }, [project?._id]);

  const toggleCompare = (e) => {
    e.preventDefault(); e.stopPropagation();
    try {
      let current = JSON.parse(localStorage.getItem('compare_projects') || '[]');
      if (isInCompare) {
        current = current.filter(p => p._id !== project._id);
      } else {
        if (current.length >= 4) {
            alert(isAr ? 'الحد الأقصى للمقارنة هو 4 مشاريع' : 'Max 4 projects for comparison');
            return;
        }
        current.push({ _id: project._id });
      }
      localStorage.setItem('compare_projects', JSON.stringify(current));
      window.dispatchEvent(new Event('compareUpdated'));
      setIsInCompare(!isInCompare);
    } catch (e) { console.error("Toggle Compare Error:", e); }
  };

  const handleShare = (e) => {
    e.preventDefault(); e.stopPropagation();
    const url = `https://platformrealestate.co/${lang}/projects/${project.slug}/`;
    if (navigator.share) {
      navigator.share({ title: projectName, url });
    } else {
      navigator.clipboard.writeText(url);
      alert(isAr ? 'تم نسخ الرابط' : 'Link copied');
    }
  };

  if (!project) return null;

  const developer = isAr ? project.developer?.nameAr : project.developer?.nameEn;
  
  const formattedPrice = isAr 
    ? (new Intl.NumberFormat('ar-EG', { notation: "compact" }).format(project.price || 0) + ' ج.م')
    : (new Intl.NumberFormat('en-US', { notation: "compact" }).format(project.price || 0) + ' EGP');

  const projectUrl = `/${lang}/projects/${project.slug}/`;

  return (
    <div 
      className={`group relative bg-white rounded-[2.5rem] p-4 border border-slate-100 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-premium hover:-translate-y-1.5 overflow-hidden`} 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      
      {/* 🖼️ Media Section - Optimized Image Delivery */}
      <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-6 bg-slate-100 shrink-0">
        <Link href={projectUrl} className="block w-full h-full">
          {/* ✅ تم حذف unoptimized ليعمل Bunny Loader تلقائياً */}
          <Image 
            src={project.mainImage ? urlFor(project.mainImage).url() : "/placeholder.jpg"}
            alt={projectName}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover transition-transform duration-[10s] group-hover:scale-110 will-change-transform"
            priority={isPriority}
          />
        </Link>

        {/* Labels & Actions - Logical Props */}
        <div className="absolute top-4 start-4 end-4 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2">
            {project.isNewLaunch && (
              <span className="bg-[#C02026] text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl animate-pulse">
                {isAr ? 'إطلاق حديث' : 'New Launch'}
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button 
              onClick={toggleCompare} 
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-xl backdrop-blur-md border ${isInCompare ? 'bg-[#C02026] text-white border-[#C02026]' : 'bg-white/90 text-slate-800 border-white/20 hover:bg-[#C02026] hover:text-white'}`}
            >
              {mounted && isInCompare ? <Check size={20} /> : <GitCompare size={20} />}
            </button>
            <button 
              onClick={handleShare} 
              className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/90 backdrop-blur-md text-slate-800 border border-white/20 shadow-xl hover:bg-slate-950 hover:text-white transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 start-4 z-20 pointer-events-none">
            <div className="bg-slate-950/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-2xl border border-white/10 text-white font-black text-sm italic tracking-tighter">
              {formattedPrice}
            </div>
        </div>
      </div>

      {/* ℹ️ Content Info */}
      <div className={`flex flex-col flex-grow px-2 text-start`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-slate-600 bg-brand-gray-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <Building2 size={12} className="shrink-0 text-[#C02026]" />
            <span className="text-[10px] font-black uppercase truncate max-w-[150px] italic">{developer}</span>
          </div>
        </div>

        <Link href={projectUrl} className="group/link block">
          <h3 className={`text-xl font-black text-slate-900 ${isAr ? 'leading-snug' : 'leading-tight tracking-tighter uppercase italic'} group-hover/link:text-[#C02026] transition-colors line-clamp-2 min-h-[3.2rem]`}>
            {projectName}
          </h3>
        </Link>

        <div className="flex items-start gap-2 text-slate-500 text-[11px] font-bold mb-6 mt-2">
          <MapPin size={14} className="text-[#C02026] shrink-0 mt-0.5" />
          <span className="line-clamp-1 italic">
            {districtName}{locationName ? `، ${locationName}` : ''}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
          <div className="bg-brand-gray-50 p-3.5 rounded-[1.5rem] border border-slate-100 text-center transition-all hover:bg-white hover:border-[#C02026]/20">
            <p className="text-sm font-black text-slate-900 leading-none mb-1.5 italic">{project.installments || '0'} {isAr ? 'سنوات' : 'Yrs'}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{isAr ? 'تقسيط' : 'Plan'}</p>
          </div>
          <div className="bg-brand-gray-50 p-3.5 rounded-[1.5rem] border border-slate-100 text-center transition-all hover:bg-white hover:border-[#C02026]/20">
            <p className="text-sm font-black text-slate-900 leading-none mb-1.5 italic">{project.downPayment || '0'}%</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{isAr ? 'مقدم' : 'Down'}</p>
          </div>
        </div>
      </div>

      {/* 📞 CTA Actions */}
      <div className="mt-auto flex items-center gap-2 pt-5 border-t border-slate-50">
        <a 
          href={`tel:${phoneNum}`} 
          className="flex-1 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center gap-3 hover:bg-[#C02026] transition-all duration-300 shadow-xl active:scale-95 group/btn"
        >
          <Phone size={16} fill="currentColor" className={`${isAr ? 'rotate-[270deg]' : ''} group-hover/btn:rotate-12 transition-transform`} />
          <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'اتصل الآن' : 'Call Now'}</span>
        </a>
        
        <a 
          href={whatsappLink} 
          target="_blank" rel="noopener noreferrer" 
          className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20bd5a] shadow-xl transition-all active:scale-95"
        >
          <MessageCircle size={24} fill="currentColor" />
        </a>

        <Link 
          href={projectUrl} 
          className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200 hover:bg-slate-950 hover:text-white transition-all shadow-sm group/arrow"
        >
          <ArrowUpRight size={22} className="group-hover/arrow:rotate-45 transition-transform" />
        </Link>
      </div>
    </div>
  );
}