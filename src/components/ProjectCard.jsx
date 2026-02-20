'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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

  // ✅ 1. منطق التحقق من حالة المقارنة
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

  // ✅ 2. وظيفة إضافة/حذف المقارنة
  const toggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      let current = JSON.parse(localStorage.getItem('compare_projects') || '[]');
      if (isInCompare) {
        current = current.filter(p => p._id !== project._id);
      } else {
        if (current.length >= 4) {
          alert(isAr ? 'يمكنك مقارنة 4 مشاريع كحد أقصى' : 'Max 4 projects for comparison');
          return;
        }
        current.push({ _id: project._id });
      }
      localStorage.setItem('compare_projects', JSON.stringify(current));
      window.dispatchEvent(new Event('compareUpdated'));
      setIsInCompare(!isInCompare);
    } catch (e) { console.error(e); }
  };

  // ✅ 3. وظيفة المشاركة
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/${lang}/projects/${project.slug}/`;
    if (navigator.share) {
      navigator.share({
        title: isAr ? project.titleAr : project.titleEn,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert(isAr ? 'تم نسخ الرابط' : 'Link copied');
    }
  };

  if (!project) return null;

  const districtName = useMemo(() => {
    const d = project.district || project.districtData;
    return isAr ? d?.nameAr : d?.nameEn;
  }, [project, isAr]);

  const cityName = useMemo(() => {
    const l = project.location || project.locationData;
    return isAr ? l?.nameAr : l?.nameEn;
  }, [project, isAr]);

  const formattedPrice = useMemo(() => {
    if (!project.price) return isAr ? 'اتصل للسعر' : 'Call for Price';
    return new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', { notation: "compact", maximumFractionDigits: 1 }).format(project.price) + (isAr ? ' ج.م' : ' EGP');
  }, [project.price, isAr]);

  const whatsappLink = useMemo(() => {
    const projectName = isAr ? project.titleAr : project.titleEn;
    const msg = isAr ? `أريد الاستفسار عن مشروع: ${projectName}` : `Inquiry about: ${projectName}`;
    return `https://wa.me/${CONTACT_INFO.whatsapp?.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`;
  }, [project, isAr]);

  const projectUrl = `/${lang}/projects/${project.slug}/`;

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-3 border border-slate-100 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-2 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* ⚠️ تم فك تداخل الـ Link للسماح للأزرار بالعمل بشكل مستقل ولتحسين إمكانية الوصول */}
      
      {/* 1. الصورة والبادجات */}
      <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-5 bg-slate-50 z-0">
        <Link href={projectUrl} aria-label={isAr ? project.titleAr : project.titleEn}>
          <Image 
            src={project.mainImage ? urlFor(project.mainImage).width(600).height(450).quality(90).url() : "/placeholder.jpg"}
            alt={isAr ? project.titleAr : project.titleEn}
            fill priority={project.isNewLaunch}
            className="object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
        </Link>

        {/* أزرار الإجراءات السريعة فوق الصورة */}
        <div className="absolute top-4 inset-x-4 z-20 flex justify-between items-start pointer-events-none">
          <div>
            {project.isNewLaunch && (
              <div className="bg-[#C02026] text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase shadow-xl">
                {isAr ? 'إطلاق جديد' : 'New Launch'}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button 
              onClick={toggleCompare} 
              aria-label={isAr ? "إضافة للمقارنة" : "Add to compare"}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-lg backdrop-blur-md border ${isInCompare ? 'bg-[#C02026] text-white border-[#C02026]' : 'bg-white/90 text-slate-900 border-white/20'}`}
            >
              {isInCompare ? <Check size={20} /> : <GitCompare size={20} />}
            </button>
            <button 
              onClick={handleShare} 
              aria-label={isAr ? "مشاركة المشروع" : "Share project"}
              className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/90 backdrop-blur-md text-slate-900 border border-white/20 shadow-lg hover:bg-slate-900 hover:text-white transition-all"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
             <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-white/20 text-slate-950 font-black text-sm w-fit">
                {formattedPrice}
             </div>
        </div>
      </div>

      {/* 2. محتوى المعلومات */}
      <div className="flex flex-col flex-grow px-2 pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Building2 size={12} />
                <span className="text-[9px] font-black uppercase truncate max-w-[80px]">
                  {isAr ? project.developer?.nameAr : project.developer?.nameEn}
                </span>
            </div>
            
            <div className="flex items-center gap-1 text-[#C02026] bg-red-50 px-3 py-1.5 rounded-xl border border-red-50">
                <MapPin size={12} /> 
                <span className="text-[9px] font-black truncate max-w-[150px]">
                  {cityName || (isAr ? "موقع متميز" : "Prime Location")}
                </span>
            </div>
        </div>

        <Link href={projectUrl} className="block">
          <h3 className="text-xl font-black text-slate-950 mb-1 leading-tight hover:text-[#C02026] transition-colors line-clamp-2 min-h-[3.5rem] tracking-tight">
              {isAr ? project.titleAr : project.titleEn}
          </h3>
        </Link>

        <div className="text-sm font-bold text-slate-500 mb-5 flex items-center gap-1">
           {districtName && (
             <>
               <MapPin size={12} className="text-[#C02026]" />
               {districtName}
             </>
           )}
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-slate-50/50 p-3 rounded-[1.5rem] border border-slate-100 flex flex-col items-center justify-center">
             <span className="text-xs font-black text-slate-900">{project.installments || '0'} {isAr ? 'سنوات' : 'Years'}</span>
             <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{isAr ? 'التقسيط' : 'Installments'}</span>
          </div>
          <div className="flex-1 bg-slate-50/50 p-3 rounded-[1.5rem] border border-slate-100 flex flex-col items-center justify-center">
             <span className="text-xs font-black text-slate-900">{project.downPayment || '0'}%</span>
             <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{isAr ? 'المقدم' : 'Down Payment'}</span>
          </div>
        </div>
      </div>

      {/* 3. شريط التواصل */}
      <div className="px-2 pb-2 mt-auto flex items-center gap-2">
          <a href={`tel:${CONTACT_INFO.phone}`} 
             aria-label={isAr ? "اتصل بنا هاتفياً" : "Call us now"}
             className="flex-1 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center gap-2 hover:bg-[#C02026] transition-all shadow-xl active:scale-95">
              <Phone size={18} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest">{isAr ? 'اتصل الآن' : 'Call'}</span>
          </a>
          <a href={whatsappLink} 
             target="_blank" 
             rel="noopener noreferrer" 
             aria-label={isAr ? "تواصل معنا عبر واتساب" : "Contact via WhatsApp"}
             className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all border border-green-100 active:scale-95 shadow-lg">
              <MessageCircle size={22} fill="currentColor" />
          </a>
          <Link 
            href={projectUrl}
            aria-label={isAr ? "عرض تفاصيل المشروع" : "View project details"}
            className="w-14 h-14 rounded-2xl bg-red-50 text-[#C02026] flex items-center justify-center border border-red-100 hover:bg-[#C02026] hover:text-white transition-all duration-500 active:scale-95 shadow-md"
          >
              <ArrowUpRight size={22} />
          </Link>
      </div>
    </div>
  );
}