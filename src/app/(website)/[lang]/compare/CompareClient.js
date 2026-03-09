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

/**
 * ✅ حارس النصوص لضمان عدم حدوث أخطاء Objects
 */
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
  const [isMounted, setIsMounted] = useState(false);

  // 🛡️ حل مشكلة الـ Hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 📡 جلب البيانات من LocalStorage و Sanity
  useEffect(() => {
    if (!isMounted) return;

    async function fetchFullDetails() {
      try {
        const storedData = localStorage.getItem('compare_projects');
        const stored = storedData ? JSON.parse(storedData) : [];
        
        if (stored.length === 0) {
          setLoading(false);
          return;
        }

        const ids = stored.map(p => p._id);
        const query = `*[_type == "project" && _id in $ids && !(_id in path("drafts.**"))] {
          _id, titleAr, titleEn, price, installments, downPayment,
          minArea, deliveryDate, finishingType, editorRating,
          "slug": slug.current, mainImage,
          "developer": developer->{ nameAr, nameEn },
          "location": location->{ nameAr, nameEn }
        }`;

        const fullData = await client.fetch(query, { ids });
        
        const sortedData = ids.map(id => fullData.find(f => f._id === id)).filter(Boolean);
        setProjects(sortedData);
      } catch (error) {
        console.error("Compare Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFullDetails();
  }, [isMounted]);

  const removeItem = (id) => {
    const updated = projects.filter(p => p._id !== id);
    setProjects(updated);
    localStorage.setItem('compare_projects', JSON.stringify(updated.map(p => ({ _id: p._id }))));
    window.dispatchEvent(new Event('storage'));
  };

  const clearAll = () => {
    if (confirm(isAr ? 'هل أنت متأكد من مسح مصفوفة المقارنة؟' : 'Clear the entire matrix?')) {
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

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#C02026] rounded-full animate-spin"></div>
    </div>
  );

  if (projects.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] p-6 text-center">
       <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-slate-100 max-w-2xl w-full animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-10 text-slate-300 shadow-inner">
            <GitCompare size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter">
            {isAr ? 'مصفوفة المقارنة فارغة' : 'Matrix is Empty'}
          </h1>
          <p className="text-slate-500 mb-12 text-lg font-medium italic">
            {isAr ? 'ابدأ بإضافة المشاريع التي تهمك لمقارنة المواصفات بدقة.' : 'Start adding projects to the matrix to compare features effectively.'}
          </p>
          <Link href={`/${lang}/projects/`} className="inline-flex items-center gap-4 bg-slate-950 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#C02026] transition-all shadow-2xl active:scale-95">
            {isAr ? 'استكشف المشاريع' : 'Browse Inventory'} <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
       </div>
    </div>
  );

  return (
    <main className={`min-h-screen bg-[#FDFDFD] pb-32 pt-40`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-[1750px] mx-auto px-4 md:px-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-6 text-start">
            <div className="inline-flex items-center gap-3 bg-[#C02026] text-white px-5 py-2.5 rounded-2xl shadow-xl">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'مستشارك الذكي' : 'Smart Advisor'}</span>
            </div>
            <h1 className="text-5xl md:text-9xl font-black text-slate-950 leading-none italic tracking-tighter uppercase">
              {isAr ? 'المقارنة' : 'The Matrix'}
            </h1>
            <div className="flex items-center gap-8">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> {isAr ? 'متطابق' : 'Identical'}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" /> {isAr ? 'مختلف' : 'Different'}
              </p>
            </div>
          </div>
          <button onClick={clearAll} className="flex items-center gap-3 text-slate-400 hover:text-red-600 font-black text-xs uppercase tracking-widest transition-all pb-2 border-b-2 border-transparent hover:border-red-600 active:scale-90">
            <Trash2 size={18} /> {isAr ? 'مسح الجدول' : 'Flush Matrix'}
          </button>
        </header>

        {/* ✅ Comparison Table */}
        <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative">
          <div className="overflow-x-auto hide-scrollbar snap-x">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky start-0 z-50 bg-white/95 backdrop-blur-xl p-10 min-w-[200px] md:min-w-[380px] text-start border-e border-slate-50 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)]">
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">{isAr ? 'المواصفات الفنية' : 'Market Intelligence'}</span>
                  </th>
                  {projects.map((p, idx) => {
                    const title = getSafeText(isAr ? p.titleAr : p.titleEn);
                    return (
                      <th key={p._id} className="snap-center p-10 min-w-[340px] md:min-w-[480px] border-b border-slate-50 relative align-top">
                        <button onClick={() => removeItem(p._id)} className="absolute top-8 end-8 z-30 w-12 h-12 bg-white/90 backdrop-blur shadow-xl rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-600 transition-all border border-slate-100">
                          <X size={22} />
                        </button>
                        <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden mb-10 shadow-2xl group">
                          {p.mainImage && (
                            <Image 
                              src={urlFor(p.mainImage).url()} 
                              alt={title} 
                              fill 
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                              priority={idx < 2}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-80" />
                          <div className="absolute bottom-6 start-8 text-white text-start">
                              <p className="text-[10px] font-black uppercase tracking-widest text-[#C02026] mb-2">{getSafeText(isAr ? p.location?.nameAr : p.location?.nameEn)}</p>
                              <h3 className="text-xl md:text-2xl font-black leading-tight italic uppercase tracking-tighter line-clamp-1">{title}</h3>
                          </div>
                        </div>
                        <Link href={`/${lang}/projects/${p.slug}/`} className="inline-flex items-center gap-4 bg-slate-50 text-slate-950 px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all w-full justify-center shadow-sm">
                          {isAr ? 'تفاصيل كاملة' : 'Full Specs'} <ArrowUpRight size={18} />
                        </Link>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                <CompareRow icon={<Building2 size={20}/>} label={isAr ? 'المطور' : 'Developer'} projects={projects} field={isAr ? 'developer.nameAr' : 'developer.nameEn'} isBold isAr={isAr} />
                <CompareRow icon={<Wallet size={20}/>} label={isAr ? 'السعر' : 'Price'} projects={projects} field="price" formatCurrency={formatCurrency} isPrice isAr={isAr} />
                <CompareRow icon={<Ruler size={20}/>} label={isAr ? 'المساحة' : 'Space'} projects={projects} field="minArea" suffix={isAr ? ' م²' : ' m²'} isAr={isAr} />
                <CompareRow icon={<CheckCircle2 size={20}/>} label={isAr ? 'المقدم' : 'Down Payment'} projects={projects} field="downPayment" suffix="%" isAr={isAr} />
                <CompareRow icon={<GitCompare size={20}/>} label={isAr ? 'التقسيط' : 'Plan'} projects={projects} field="installments" suffix={isAr ? ' سنوات' : ' Years'} isAr={isAr} />
                <CompareRow icon={<Home size={20}/>} label={isAr ? 'الاستلام' : 'Delivery'} projects={projects} field="deliveryDate" isAr={isAr} />
                <CompareRow icon={<Paintbrush size={20}/>} label={isAr ? 'التشطيب' : 'Finish'} projects={projects} field="finishingType" isAr={isAr} />
                <CompareRow icon={<Star size={20} className="text-amber-500 fill-amber-500" />} label={isAr ? 'التقييم' : 'Rating'} projects={projects} field="editorRating" suffix="/10" isScore isAr={isAr} />

                <tr className="bg-slate-50/50">
                   <td className="sticky start-0 z-30 bg-white/80 backdrop-blur-md p-10 border-e border-slate-50">
                      <div className="flex items-center gap-4 text-slate-950 font-black text-[11px] uppercase tracking-[0.3em]">
                        <span className="text-[#C02026]"><Info size={18} /></span> {isAr ? 'احجز الآن' : 'Inquire Now'}
                      </div>
                   </td>
                   {projects.map(p => (
                     <td key={p._id} className="p-10">
                        <a 
                          href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(isAr ? `استفسار عن مقارنة مشروع ${getSafeText(p.titleAr)}` : `Special inquiry about ${getSafeText(p.titleEn)} from comparison matrix`)}`} 
                          target="_blank" rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-4 bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                        >
                            <MessageCircle size={22} fill="currentColor" fillOpacity={0.2} /> {isAr ? 'عرض خاص' : 'VIP Offer'}
                        </a>
                     </td>
                   ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}

// ✅ مكون الصف الذكي
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
    ? (areAllValuesEqual ? "bg-emerald-50/30" : "bg-rose-50/30")
    : "";

  return (
    <tr className={`group transition-all duration-500 ${highlightClass}`}>
      <td className="sticky start-0 z-30 bg-white/95 backdrop-blur-md p-10 font-black text-[11px] uppercase tracking-widest text-slate-400 border-e border-slate-100 group-hover:bg-slate-50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#C02026] group-hover:scale-110 transition-transform">{icon}</span> 
            <span className="leading-none">{label}</span>
          </div>
          {projects.length > 1 && (
            areAllValuesEqual 
              ? <CheckCircle2 size={16} className="text-emerald-500" /> 
              : <Info size={16} className="text-rose-500 animate-pulse" />
          )}
        </div>
      </td>
      
      {projects.map(p => {
        const val = getValue(p, field);
        const cleanVal = getSafeText(val);
        return (
          <td key={p._id} className="p-10 align-middle text-center md:text-start transition-colors">
             {isPrice ? (
                <span className="text-2xl md:text-3xl font-black italic tracking-tighter whitespace-nowrap text-slate-900">
                  {formatCurrency(val)}
                </span>
             ) : isScore ? (
                <div className="flex items-baseline gap-1 justify-center md:justify-start">
                  <span className="text-3xl md:text-4xl font-black italic text-slate-900">{cleanVal || '8.5'}</span>
                  <span className="text-[11px] font-black opacity-30">{suffix}</span>
                </div>
             ) : (
                <span className={`text-base md:text-lg ${isBold ? 'font-black uppercase italic tracking-tighter text-slate-950' : 'font-bold text-slate-700'}`}>
                   {cleanVal ? `${cleanVal}${suffix}` : <span className="opacity-10 font-normal">N/A</span>}
                </span>
             )}
          </td>
        );
      })}
    </tr>
  );
}