'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, Building2, Wallet, GitCompare, 
  CheckCircle2, Paintbrush, Home, Ruler, 
  Star, Sparkles, Trash2, ArrowRight, 
  MessageCircle, ArrowUpRight, Info
} from 'lucide-react';
import { client, urlFor } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ حارس النصوص لضمان عدم حدوث Objects Error
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  if (typeof val === 'object' && val.children) {
    return val.children.map(child => child.text).join('');
  }
  return String(val);
};

export default function CompareClient({ lang }) {
  const isAr = lang === 'ar';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📡 جلب البيانات مع تأمين المسودات
  useEffect(() => {
    async function fetchFullDetails() {
      const stored = JSON.parse(localStorage.getItem('compare_projects') || '[]');
      if (stored.length === 0) {
        setLoading(false);
        return;
      }
      const ids = stored.map(p => p._id);
      const query = `*[_type == "project" && _id in $ids && !(_id in path("drafts.**"))] {
        _id, titleAr, titleEn, price, installments, downPayment,
        minArea, deliveryDate, finishingType, projectType, editorRating,
        "slug": slug.current, mainImage,
        "developer": developer->{ nameAr, nameEn },
        "location": location->{ nameAr, nameEn }
      }`;
      try {
        const fullData = await client.fetch(query, { ids });
        setProjects(fullData);
      } catch (error) { 
        console.error("Compare Fetch Error:", error); 
      } finally { 
        setLoading(false); 
      }
    }
    fetchFullDetails();
  }, []);

  const removeItem = (id) => {
    const updated = projects.filter(p => p._id !== id);
    setProjects(updated);
    localStorage.setItem('compare_projects', JSON.stringify(updated.map(p => ({_id: p._id}))));
    window.dispatchEvent(new Event('storage')); 
  };

  const clearAll = () => {
    if(confirm(isAr ? 'هل أنت متأكد من مسح جدول المقارنة؟' : 'Clear all projects from matrix?')) {
      setProjects([]);
      localStorage.removeItem('compare_projects');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const formatCurrency = (val) => {
    if (!val) return isAr ? 'عند الطلب' : 'On Request';
    return new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', {
      style: 'decimal', maximumFractionDigits: 0
    }).format(val) + (isAr ? ' ج.م' : ' EGP');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#C02026] rounded-full animate-spin"></div>
    </div>
  );

  if (projects.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] p-6 text-center">
       <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 max-w-lg w-full animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <GitCompare size={48} className="text-slate-200" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">
            {isAr ? 'مصفوفة المقارنة فارغة' : 'Empty Matrix'}
          </h1>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium italic">
            {isAr ? 'ابدأ بإضافة المشاريع التي تهمك لمقارنة الأسعار والمواصفات بدقة.' : 'Start adding projects to compare features, prices, and ROI.'}
          </p>
          <Link href={`/${lang}/projects/`} className="flex items-center justify-center gap-4 bg-slate-950 text-white px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#C02026] transition-all shadow-2xl active:scale-95">
            {isAr ? 'استكشف المشاريع' : 'Browse Projects'} <ArrowRight size={18} className={isAr ? 'rotate-180' : ''} />
          </Link>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32 pt-40" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-[1700px] mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4 text-start">
            <div className="inline-flex items-center gap-3 bg-[#C02026] text-white px-5 py-2 rounded-2xl shadow-xl shadow-red-500/20">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? 'مستشارك الذكي' : 'Smart Advisor'}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
              {isAr ? 'المقارنة' : 'The Matrix'}
            </h1>
            <div className="flex items-center gap-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" /> {isAr ? 'متطابق' : 'Identical'}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" /> {isAr ? 'مختلف' : 'Different'}
              </p>
            </div>
          </div>
          <button onClick={clearAll} className="flex items-center gap-3 text-slate-400 hover:text-red-600 font-black text-xs uppercase tracking-[0.3em] transition-all group pb-2 border-b-2 border-transparent hover:border-red-600">
            <Trash2 size={18} className="group-hover:rotate-12 transition-transform" /> {isAr ? 'مسح الجدول' : 'Clear All'}
          </button>
        </header>

        {/* ✅ Interactive Comparison Table */}
        <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative">
          <div className="overflow-x-auto hide-scrollbar snap-x">
            <table className="w-full border-collapse" role="grid">
              <thead>
                <tr>
                  <th className="sticky start-0 z-50 bg-white/95 backdrop-blur-xl p-10 min-w-[200px] md:min-w-[350px] text-start border-e border-slate-50">
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">{isAr ? 'المواصفات الفنية' : 'Technical Specs'}</span>
                  </th>
                  {projects.map(p => {
                    const title = getSafeText(isAr ? p.titleAr : p.titleEn);
                    return (
                      <th key={p._id} className="snap-center p-10 min-w-[320px] md:min-w-[450px] border-b border-slate-50 relative align-top">
                        <button onClick={() => removeItem(p._id)} aria-label="Remove" className="absolute top-8 end-8 z-30 w-12 h-12 bg-white/90 backdrop-blur shadow-2xl rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:scale-110 transition-all border border-slate-100">
                          <X size={20} />
                        </button>
                        <div className="relative aspect-[16/11] rounded-[3rem] overflow-hidden mb-10 shadow-2xl group">
                          {p.mainImage && (
                            <Image 
                              src={urlFor(p.mainImage).width(800).quality(90).url()} 
                              alt={title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080A0D] via-transparent to-transparent opacity-80" />
                          <div className="absolute bottom-6 start-8 text-white text-start">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C02026] mb-2">{getSafeText(isAr ? p.location?.nameAr : p.location?.nameEn)}</p>
                             <h3 className="text-xl md:text-2xl font-black leading-tight line-clamp-1 italic uppercase tracking-tighter">{title}</h3>
                          </div>
                        </div>
                        <Link href={`/${lang}/projects/${p.slug}/`} className="inline-flex items-center gap-3 bg-slate-50 text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white transition-all w-full justify-center shadow-sm">
                          {isAr ? 'تفاصيل كاملة' : 'Full Specs'} <ArrowUpRight size={16} />
                        </Link>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                <CompareRow icon={<Building2 size={20}/>} label={isAr ? 'المطور' : 'Developer'} projects={projects} field={isAr ? 'developer.nameAr' : 'developer.nameEn'} isBold isAr={isAr} />
                <CompareRow icon={<Wallet size={20}/>} label={isAr ? 'السعر' : 'Price'} projects={projects} field="price" formatCurrency={formatCurrency} isPrice isAr={isAr} />
                <CompareRow icon={<Ruler size={20}/>} label={isAr ? 'المساحة' : 'Space'} projects={projects} field="minArea" suffix={isAr ? 'م²' : 'm²'} isAr={isAr} />
                <CompareRow icon={<CheckCircle2 size={20}/>} label={isAr ? 'المقدم' : 'Down Payment'} projects={projects} field="downPayment" suffix="%" isAr={isAr} />
                <CompareRow icon={<GitCompare size={20}/>} label={isAr ? 'سنوات القسط' : 'Plan'} projects={projects} field="installments" suffix={isAr ? 'سنوات' : 'Years'} isAr={isAr} />
                <CompareRow icon={<Home size={20}/>} label={isAr ? 'الاستلام' : 'Delivery'} projects={projects} field="deliveryDate" isAr={isAr} />
                <CompareRow icon={<Paintbrush size={20}/>} label={isAr ? 'التشطيب' : 'Finish'} projects={projects} field="finishingType" isAr={isAr} />
                <CompareRow icon={<Star size={20} className="text-amber-500 fill-amber-500" />} label={isAr ? 'التقييم' : 'Rating'} projects={projects} field="editorRating" suffix="/10" isScore isAr={isAr} />

                {/* Sticky Contact Footer */}
                <tr className="bg-slate-50/50">
                   <td className="sticky start-0 z-30 bg-white/80 backdrop-blur-md p-10 border-e border-slate-50">
                      <div className="flex items-center gap-3 text-slate-900 font-black text-[11px] uppercase tracking-[0.3em]">
                        <Info size={16} className="text-[#C02026]" /> {isAr ? 'احجز الآن' : 'Take Action'}
                      </div>
                   </td>
                   {projects.map(p => (
                     <td key={p._id} className="p-10">
                        <a 
                          href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(isAr ? `استفسار عن مقارنة مشروع ${getSafeText(p.titleAr)}` : `Inquiry about ${getSafeText(p.titleEn)} from comparison`)}`} 
                          target="_blank" 
                          className="w-full flex items-center justify-center gap-4 bg-[#25D366] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-green-500/20 hover:scale-105 transition-all active:scale-95"
                        >
                            <MessageCircle size={22} fill="currentColor" fillOpacity={0.2} /> {isAr ? 'عرض خاص' : 'Get VIP Offer'}
                        </a>
                     </td>
                   ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ مكون الصف الذكي مع Logic المقارنة البصرية
function CompareRow({ icon, label, projects, field, formatCurrency, suffix = "", isPrice, isBold, isScore, isAr }) {
  
  const getValue = (obj, path) => {
    if (!obj || !path) return null;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const areAllValuesEqual = useMemo(() => {
    if (projects.length <= 1) return null;
    const firstVal = getValue(projects[0], field);
    return projects.every(p => getValue(p, field) === firstVal);
  }, [projects, field]);

  const highlightClass = projects.length > 1 
    ? (areAllValuesEqual ? "bg-emerald-50/40 text-emerald-800" : "bg-rose-50/40 text-rose-800")
    : "";

  return (
    <tr className={`group transition-all duration-500 ${highlightClass}`}>
      <td className="sticky start-0 z-30 bg-white/90 backdrop-blur-md p-10 font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 border-e border-slate-50 group-hover:bg-slate-100 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#C02026] group-hover:scale-110 transition-transform">{icon}</span> 
            <span className="leading-none">{label}</span>
          </div>
          {projects.length > 1 && (
            areAllValuesEqual 
              ? <CheckCircle2 size={14} className="text-emerald-500" /> 
              : <Info size={14} className="text-rose-500 animate-pulse" />
          )}
        </div>
      </td>
      
      {projects.map(p => {
        const val = getValue(p, field);
        const cleanVal = getSafeText(val);
        return (
          <td key={p._id} className="p-10 align-middle text-center md:text-start">
             {isPrice ? (
                <span className="text-2xl md:text-3xl font-black italic tracking-tighter whitespace-nowrap">
                  {formatCurrency(val)}
                </span>
             ) : isScore ? (
                <div className="flex items-baseline gap-1 justify-center md:justify-start">
                  <span className="text-3xl md:text-4xl font-black italic">{cleanVal || '8.5'}</span>
                  <span className="text-[11px] font-black opacity-30">{suffix}</span>
                </div>
             ) : (
                <span className={`text-base md:text-lg ${isBold ? 'font-black uppercase italic tracking-tighter' : 'font-bold'}`}>
                   {cleanVal ? `${cleanVal} ${suffix}` : <span className="opacity-10 font-normal">N/A</span>}
                </span>
             )}
          </td>
        );
      })}
    </tr>
  );
}