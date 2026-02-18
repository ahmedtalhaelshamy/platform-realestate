'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, Building2, MapPin, Calendar, Wallet, 
  GitCompare, CheckCircle2, Paintbrush, 
  Home, Ruler, Star, Sparkles, Trash2, ArrowRight, 
  MessageCircle, ArrowUpRight, Info
} from 'lucide-react';
import { client, urlFor } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

export default function CompareClient({ lang }) {
  const isAr = lang === 'ar';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ جلب البيانات وضمان مزامنة الـ LocalStorage
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
        "slug": slug.current, mainImage, amenities,
        "developer": developer->{ nameAr, nameEn },
        "location": location->{ nameAr, nameEn },
        "district": district->{ nameAr, nameEn }
      }`;
      try {
        const fullData = await client.fetch(query, { ids });
        setProjects(fullData);
      } catch (error) { 
        console.error("Fetch Error:", error); 
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
    setProjects([]);
    localStorage.removeItem('compare_projects');
    window.dispatchEvent(new Event('storage'));
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
       <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 max-w-lg w-full">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <GitCompare size={40} className="text-slate-300" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">{isAr ? 'قائمة المقارنة فارغة' : 'No Properties to Compare'}</h1>
          <p className="text-slate-500 mb-10 leading-relaxed">{isAr ? 'لم تقم بإضافة أي مشاريع للمقارنة بعد. استكشف أرقى العقارات وأضف ما ينال إعجابك.' : 'Start adding projects to compare features, prices, and payment plans.'}</p>
          <Link href={`/${lang}/projects`} className="flex items-center justify-center gap-3 bg-[#111827] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#C02026] transition-all shadow-xl shadow-slate-200">
            {isAr ? 'تصفح المشاريع الآن' : 'Explore Projects'} <ArrowRight size={18} className={isAr ? 'rotate-180' : ''} />
          </Link>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 pt-32" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[#C02026] bg-red-50 px-3 py-1 rounded-full">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'القرار الذكي' : 'Smart Decision'}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
              {isAr ? 'جدول المقارنة' : 'Comparison Matrix'}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" /> {isAr ? 'الأخضر: قيم متطابقة' : 'Green: Identical Values'}
              <span className="w-2 h-2 bg-rose-500 rounded-full ms-4" /> {isAr ? 'الأحمر: قيم مختلفة' : 'Red: Different Values'}
            </p>
          </div>
          <button onClick={clearAll} className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-colors group">
            <Trash2 size={16} className="group-hover:shake" /> {isAr ? 'مسح الجدول' : 'Clear Matrix'}
          </button>
        </div>

        {/* ✅ Table Container */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide snap-x">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky start-0 z-40 bg-white/90 backdrop-blur-md p-6 md:p-10 min-w-[140px] md:min-w-[300px] text-start border-b border-e border-slate-50">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{isAr ? 'المواصفات' : 'Criteria'}</span>
                  </th>
                  {projects.map(p => (
                    <th key={p._id} className="snap-center p-6 md:p-10 min-w-[280px] md:min-w-[400px] border-b border-slate-50 relative align-top">
                      <button onClick={() => removeItem(p._id)} className="absolute top-6 end-6 z-20 w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all border border-slate-50">
                        <X size={18} />
                      </button>
                      <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 shadow-xl group">
                        {p.mainImage && <Image src={urlFor(p.mainImage).width(800).url()} alt={p.titleEn} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 start-6 text-white text-start">
                           <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">{isAr ? p.location?.nameAr : p.location?.nameEn}</p>
                           <h3 className="text-lg md:text-xl font-black leading-tight line-clamp-1 italic uppercase">{isAr ? p.titleAr : p.titleEn}</h3>
                        </div>
                      </div>
                      <Link href={`/${lang}/projects/${p.slug}`} className="inline-flex items-center gap-2 bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C02026] hover:text-white transition-all w-full justify-center">
                        {isAr ? 'عرض التفاصيل' : 'Full Specs'} <ArrowUpRight size={14} />
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                <CompareRow icon={<Building2 size={18}/>} label={isAr ? 'المطور' : 'Developer'} projects={projects} field={isAr ? 'developer.nameAr' : 'developer.nameEn'} isBold />
                <CompareRow icon={<Wallet size={18}/>} label={isAr ? 'السعر الكلي' : 'Total Price'} projects={projects} field="price" formatCurrency={formatCurrency} isPrice />
                <CompareRow icon={<Ruler size={18}/>} label={isAr ? 'المساحة' : 'Min Area'} projects={projects} field="minArea" suffix={isAr ? 'م²' : 'm²'} />
                <CompareRow icon={<CheckCircle2 size={18}/>} label={isAr ? 'المقدم' : 'Down Payment'} projects={projects} field="downPayment" suffix="%" />
                <CompareRow icon={<Calendar size={18}/>} label={isAr ? 'سنوات التقسيط' : 'Installments'} projects={projects} field="installments" suffix={isAr ? 'سنوات' : 'Years'} />
                <CompareRow icon={<Home size={18}/>} label={isAr ? 'حالة الاستلام' : 'Delivery'} projects={projects} field="deliveryDate" />
                <CompareRow icon={<Paintbrush size={18}/>} label={isAr ? 'التشطيب' : 'Finishing'} projects={projects} field="finishingType" />
                
                {/* Score Row with Comparison Logic */}
                <CompareRow icon={<Star size={18} className="text-yellow-500 fill-yellow-500" />} label={isAr ? 'التقييم' : 'Score'} projects={projects} field="editorRating" suffix="/10" isScore />

                {/* Actions Footer */}
                <tr className="bg-slate-50/30">
                   <td className="sticky start-0 z-30 bg-white/80 backdrop-blur-md p-6 md:p-10 border-e border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Info size={14} /> {isAr ? 'تواصل' : 'Action'}
                      </div>
                   </td>
                   {projects.map(p => (
                     <td key={p._id} className="p-6 md:p-10">
                        <a href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(isAr ? `أريد الاستفسار عن مشروع ${p.titleAr}` : `Inquiry about ${p.titleEn}`)}`} target="_blank" className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/20 hover:scale-105 transition-transform active:scale-95">
                            <MessageCircle size={20} fill="currentColor" /> {isAr ? 'استفسار سريع' : 'Get Offer'}
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

// ✅ المكون الذكي للصف مع منطق المقارنة اللوني
function CompareRow({ icon, label, projects, field, formatCurrency, suffix = "", isPrice, isBold, isScore }) {
  
  // دالة لجلب القيمة العميقة من الكائن
  const getValue = (obj, path) => {
    if (!obj || !path) return null;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // ✅ منطق المقارنة: التحقق مما إذا كانت جميع القيم في الصف متطابقة
  const areAllValuesEqual = useMemo(() => {
    if (projects.length <= 1) return null;
    const firstVal = getValue(projects[0], field);
    return projects.every(p => getValue(p, field) === firstVal);
  }, [projects, field]);

  // تحديد اللون بناءً على التطابق
  const getHighlightClass = () => {
    if (projects.length <= 1) return "";
    return areAllValuesEqual 
      ? "bg-emerald-50/50 text-emerald-700" 
      : "bg-rose-50/50 text-rose-700";
  };

  const getStatusIcon = () => {
    if (projects.length <= 1) return null;
    return areAllValuesEqual 
      ? <CheckCircle2 size={12} className="text-emerald-500" /> 
      : <Info size={12} className="text-rose-500" />;
  };

  return (
    <tr className={`group transition-colors ${getHighlightClass()}`}>
      <td className="sticky start-0 z-30 bg-white/80 backdrop-blur-md p-6 md:p-10 font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-400 border-e border-slate-50 group-hover:bg-slate-100 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#C02026] group-hover:scale-110 transition-transform">{icon}</span> 
            <span className="leading-tight">{label}</span>
          </div>
          {getStatusIcon()}
        </div>
      </td>
      
      {projects.map(p => {
        const val = getValue(p, field);
        return (
          <td key={p._id} className="p-6 md:p-10 align-middle text-center md:text-start transition-all">
             {isPrice ? (
                <span className="text-xl md:text-2xl font-black italic whitespace-nowrap">
                  {formatCurrency(val)}
                </span>
             ) : isScore ? (
                <div className="flex items-baseline gap-1 justify-center md:justify-start">
                  <span className="text-2xl md:text-3xl font-black italic">{val || '8.5'}</span>
                  <span className="text-[10px] font-black opacity-40">{suffix}</span>
                </div>
             ) : (
                <span className={`text-sm md:text-base ${isBold ? 'font-black uppercase italic' : 'font-bold'}`}>
                   {val ? `${val} ${suffix}` : <span className="opacity-20 font-normal">N/A</span>}
                </span>
             )}
          </td>
        );
      })}
    </tr>
  );
}