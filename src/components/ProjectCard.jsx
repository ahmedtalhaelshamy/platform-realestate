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
 * 🃏 ProjectCard - The Core Real Estate Unit (Refactored for 2026)
 * مُحسن بنسبة 100% للـ LCP وتجربة المستخدم وإمكانية الوصول
 */
export default function ProjectCard({ data: project, lang, priority = false }) {
  const [isInCompare, setIsInCompare] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAr = lang === 'ar';

  // ✅ تنظيف الأرقام وتجهيز روابط التواصل
  const whatsappNum = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');
  const phoneNum = (CONTACT_INFO.phone || "").toString().replace(/\s/g, '');

  const projectName = isAr ? project?.titleAr : project?.titleEn;
  const districtName = isAr ? project.district?.nameAr : project.district?.nameEn;
  const locationName = isAr ? project.locationData?.nameAr : project.locationData?.nameEn;

  const whatsappLink = useMemo(() => {
    const msg = isAr 
      ? `أريد الاستفسار عن مشروع: ${projectName}` 
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
            alert(isAr ? 'الحد الأقصى للمقارنة هو 4 مشاريع' : 'Maximum 4 projects for comparison');
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
    const url = `${window.location.origin}/${lang}/projects/${project.slug}/`;
    if (navigator.share) {
      navigator.share({ title: projectName, url });
    } else {
      navigator.clipboard.writeText(url);
      alert(isAr ? 'تم نسخ رابط المشروع' : 'Project link copied');
    }
  };

  if (!project) return null;

  const developer = isAr ? project.developer?.nameAr : project.developer?.nameEn;
  
  const formattedPrice = isAr 
    ? (new Intl.NumberFormat('ar-EG', { notation: "compact" }).format(project.price || 0) + ' ج.م')
    : (new Intl.NumberFormat('en-US', { notation: "compact" }).format(project.price || 0) + ' EGP');

  const projectUrl = `/${lang}/projects/${project.slug}/`;

  return (
    <div className="group relative bg-white rounded-[2rem] p-3 border border-slate-100 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden focus-within:ring-2 focus-within:ring-[#C02026]" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🖼️ Media Section */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 z-0">
        <Link href={projectUrl} className="block w-full h-full outline-none" tabIndex="-1" aria-hidden="true">
          <Image 
            src={project.mainImage ? urlFor(project.mainImage).format('webp').quality(80).url() : "/placeholder.jpg"}
            alt={projectName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[10s] ease-out group-hover:scale-110 will-change-transform"
            loading={priority ? "eager" : "lazy"} 
            fetchPriority={priority ? "high" : "auto"}
          />
        </Link>

        <div className="absolute top-4 inset-x-4 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2">
            {project.isNewLaunch && (
              <span className="bg-[#C02026] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                {isAr ? 'إطلاق حديث' : 'New Launch'}
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button 
              onClick={toggleCompare} 
              aria-label={isInCompare ? (isAr ? `إزالة ${projectName} من المقارنة` : `Remove ${projectName} from comparison`) : (isAr ? `إضافة ${projectName} للمقارنة` : `Add ${projectName} to compare`)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md backdrop-blur-md border outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#C02026] ${isInCompare ? 'bg-[#C02026] text-white border-[#C02026]' : 'bg-white/90 text-slate-800 border-white/20 hover:bg-[#C02026] hover:text-white'}`}
            >
              {mounted && isInCompare ? <Check size={18} /> : <GitCompare size={18} />}
            </button>
            <button 
              onClick={handleShare} 
              aria-label={isAr ? `مشاركة مشروع ${projectName}` : `Share project ${projectName}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/90 backdrop-blur-md text-slate-800 border border-white/20 shadow-md hover:bg-slate-900 hover:text-white transition-all outline-none"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 start-4 z-20 pointer-events-none">
            <div className="bg-slate-900/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/10 text-white font-bold text-sm tracking-tight italic">
              {formattedPrice}
            </div>
        </div>
      </div>

      {/* ℹ️ Content Info */}
      <div className="flex flex-col flex-grow px-2 text-start">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <Building2 size={12} className="shrink-0 text-[#C02026]" />
            <span className="text-[10px] font-black uppercase truncate max-w-[150px] italic">{developer}</span>
          </div>
        </div>

        <Link href={projectUrl} className="outline-none group/link block">
          {/* ✅ تم إضافة px-1 و overflow-visible لحل مشكلة "أكل" أول حرف */}
          <h3 className="text-xl font-black text-slate-900 leading-tight group-hover/link:text-[#C02026] transition-colors line-clamp-2 min-h-[3.2rem] italic uppercase tracking-tighter px-1 overflow-visible">
            {projectName}
          </h3>
        </Link>

        {/* المنطقة والحي */}
        <div className="flex items-start gap-2 text-slate-500 text-xs font-bold mb-5 mt-1 px-1">
          <MapPin size={14} className="text-[#C02026] shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            {districtName}{locationName ? `، ${locationName}` : ''}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
          <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 text-center transition-all hover:bg-white hover:border-[#C02026]/20">
            <p className="text-sm font-black text-slate-900 leading-none mb-1.5 italic">{project.installments || '0'} {isAr ? 'سنوات' : 'Years'}</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{isAr ? 'تقسيط' : 'Plan'}</p>
          </div>
          <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 text-center transition-all hover:bg-white hover:border-[#C02026]/20">
            <p className="text-sm font-black text-slate-900 leading-none mb-1.5 italic">{project.downPayment || '0'}%</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{isAr ? 'مقدم' : 'Down'}</p>
          </div>
        </div>
      </div>

      {/* 📞 CTA Actions */}
      <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-50">
        <a 
          href={`tel:${phoneNum}`} 
          aria-label={isAr ? `اتصال هاتفي بمبيعات ${projectName}` : `Call sales for ${projectName}`}
          className="flex-1 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-2 hover:bg-[#C02026] transition-all duration-300 shadow-md active:scale-95 group/btn outline-none focus-visible:ring-2 focus-visible:ring-[#C02026]"
        >
          <Phone size={16} fill="currentColor" className="group-hover/btn:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'اتصل الآن' : 'Call Now'}</span>
        </a>
        
        <a 
          href={whatsappLink} 
          target="_blank" rel="noopener noreferrer" 
          aria-label={isAr ? `تواصل عبر واتساب لمشروع ${projectName}` : `WhatsApp inquiry for ${projectName}`}
          className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20bd5a] shadow-md transition-all active:scale-95 outline-none"
        >
          <MessageCircle size={20} fill="currentColor" />
        </a>

        <Link 
          href={projectUrl} 
          aria-label={isAr ? `عرض كامل تفاصيل مشروع ${projectName}` : `View full details for ${projectName}`}
          className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm outline-none"
        >
          <ArrowUpRight size={20} />
        </Link>
      </div>
    </div>
  );
}