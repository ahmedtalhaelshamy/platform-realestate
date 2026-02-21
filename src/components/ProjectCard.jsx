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
 * 🃏 ProjectCard - The Core Real Estate Unit
 * تم تحسينه للتعامل مع صور WebP/AVIF وتأمين الروابط من أخطاء الـ undefined
 */
export default function ProjectCard({ data: project, lang }) {
  const [isInCompare, setIsInCompare] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isAr = lang === 'ar';

  // ✅ حماية الروابط: تنظيف الأرقام باستخدام نمط الأمان المعتمد
  const whatsappNum = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');
  const phoneNum = (CONTACT_INFO.phone || "").toString().replace(/\s/g, '');

  const whatsappLink = useMemo(() => {
    const projectName = isAr ? project?.titleAr : project?.titleEn;
    const msg = isAr 
      ? `أريد الاستفسار عن مشروع: ${projectName}` 
      : `Inquiry about: ${projectName}`;
    return `https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`;
  }, [project, isAr, whatsappNum]);

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
      navigator.share({ title: isAr ? project.titleAr : project.titleEn, url });
    } else {
      navigator.clipboard.writeText(url);
      alert(isAr ? 'تم نسخ رابط المشروع' : 'Project link copied');
    }
  };

  if (!project) return null;

  const district = isAr ? project.district?.nameAr : project.district?.nameEn;
  const developer = isAr ? project.developer?.nameAr : project.developer?.nameEn;
  
  const formattedPrice = isAr 
    ? (new Intl.NumberFormat('ar-EG', { notation: "compact" }).format(project.price || 0) + ' ج.م')
    : (new Intl.NumberFormat('en-US', { notation: "compact" }).format(project.price || 0) + ' EGP');

  const projectUrl = `/${lang}/projects/${project.slug}/`;

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-3 border border-slate-100 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(192,32,38,0.15)] hover:-translate-y-2 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🖼️ Media Section - Optimized for Next.js Image */}
      <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-5 bg-slate-100 z-0">
        <Link href={projectUrl}>
          <Image 
            // السحر هنا: auto('format') + quality(85) لضمان أصغر حجم WebP ممكن
            src={project.mainImage 
              ? urlFor(project.mainImage).width(800).height(600).auto('format').fit('crop').quality(85).url() 
              : "/placeholder.jpg"
            }
            alt={isAr ? project.titleAr : project.titleEn}
            fill
            // sizes: بتعرف المتصفح إن الكارت بياخد 1/3 الشاشة في الديسك توب وكامل الشاشة في الموبايل
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
            loading="lazy" 
          />
        </Link>

        {/* Badges Hub */}
        <div className="absolute top-4 inset-x-4 z-20 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {project.isNewLaunch && (
              <span className="bg-[#C02026] text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-2xl animate-pulse">
                {isAr ? 'إطلاق حديث' : 'New Launch'}
              </span>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={toggleCompare} 
              aria-label="Add to comparison"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-xl backdrop-blur-md border ${isInCompare ? 'bg-[#C02026] text-white border-[#C02026]' : 'bg-white/90 text-slate-900 border-white/20 hover:bg-[#C02026] hover:text-white'}`}
            >
              {isInCompare ? <Check size={20} /> : <GitCompare size={20} />}
            </button>
            <button 
              onClick={handleShare} 
              aria-label="Share project"
              className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/90 backdrop-blur-md text-slate-900 border border-white/20 shadow-xl hover:bg-black hover:text-white transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Floating Price Tag */}
        <div className="absolute bottom-4 inset-inline-start-4">
            <div className="bg-slate-950/90 backdrop-blur-xl px-5 py-2.5 rounded-2xl shadow-2xl border border-white/10 text-white font-black text-sm italic tracking-tighter">
              {formattedPrice}
            </div>
        </div>
      </div>

      {/* ℹ️ Info Content */}
      <div className="flex flex-col flex-grow px-2 text-start">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <Building2 size={12} className="shrink-0 text-[#C02026]" />
            <span className="text-[10px] font-black uppercase truncate max-w-[120px]">{developer}</span>
          </div>
        </div>

        <Link href={projectUrl}>
          {/* ✅ الحل هنا: إضافة px-2 لمنع القص وتغيير tracking-tighter لـ tracking-tight */}
          <h3 className="text-xl font-black text-slate-950 mb-3 leading-[1.4] hover:text-[#C02026] transition-colors line-clamp-2 min-h-[3.2rem] italic tracking-tight px-2">
            {isAr ? project.titleAr : project.titleEn}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6 px-2">
          <MapPin size={14} className="text-[#C02026]" />
          <span className="truncate">{district || (isAr ? 'موقع متميز' : 'Prime Location')}</span>
        </div>

        {/* 📊 Key Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100 text-center group-hover:bg-white group-hover:border-red-50 transition-colors">
            <p className="text-sm font-black text-slate-900 leading-none mb-1">{project.installments || '0'} {isAr ? 'سنوات' : 'Years'}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? 'تقسيط' : 'Plan'}</p>
          </div>
          <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100 text-center group-hover:bg-white group-hover:border-red-50 transition-colors">
            <p className="text-sm font-black text-slate-900 leading-none mb-1">{project.downPayment || '0'}%</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? 'مقدم' : 'Down'}</p>
          </div>
        </div>
      </div>

      {/* 📞 Call to Action Hub */}
      <div className="mt-auto flex items-center gap-2.5 pt-4 border-t border-slate-50">
        <a 
          href={`tel:${phoneNum}`} 
          aria-label={isAr ? "اتصال هاتفي بمبيعات المشروع" : "Call project sales"}
          className="flex-1 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center gap-3 hover:bg-[#C02026] transition-all duration-500 shadow-xl active:scale-95 group/btn"
        >
          <Phone size={18} fill="currentColor" className="group-hover/btn:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? 'اتصال' : 'Call'}</span>
        </a>
        
        <a 
          href={whatsappLink} 
          target="_blank" rel="noopener noreferrer" 
          aria-label={isAr ? "استفسار عبر واتساب" : "Inquiry via WhatsApp"}
          className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center hover:bg-green-600 shadow-xl hover:shadow-green-500/20 transition-all active:scale-95"
        >
          <MessageCircle size={22} fill="currentColor" />
        </a>

        <Link 
          href={projectUrl} 
          className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center border border-slate-100 hover:bg-slate-950 hover:text-white transition-all shadow-sm"
        >
          <ArrowUpRight size={22} />
        </Link>
      </div>
    </div>
  );
}