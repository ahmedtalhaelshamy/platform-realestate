'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, ArrowLeft, Building2, MapPin, Calendar, Wallet, 
  GitCompare, CheckCircle2, Paintbrush, 
  Home, Ruler, Star, Sparkles, Trash2, ArrowRight
} from 'lucide-react';
import { client, urlFor } from '@/sanity/client';
import { CONTACT_INFO } from '@/components/constants/contact';

export default function ComparePage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;
  const isAr = lang === 'ar';
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFullDetails() {
      const stored = JSON.parse(localStorage.getItem('compare_projects') || '[]');
      if (stored.length === 0) {
        setLoading(false);
        return;
      }
      const ids = stored.map(p => p._id);
      const query = `*[_type == "project" && _id in $ids] {
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
      } catch (error) { console.error("Fetch Error:", error); } 
      finally { setLoading(false); }
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-[#C02026] rounded-full animate-spin"></div>
    </div>
  );

  if (projects.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
       <div className="bg-white p-10 rounded-[3rem] shadow-xl max-w-lg border border-slate-100">
          <GitCompare size={48} className="mx-auto text-slate-300 mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">{isAr ? 'لا توجد مقارنات' : 'Comparison Empty'}</h1>
          <p className="text-slate-500 mb-8">{isAr ? 'أضف بعض المشاريع لتبدأ المقارنة' : 'Add some projects to start comparing'}</p>
          <Link href={`/${lang}/projects`} className="inline-flex items-center gap-2 bg-[#121621] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#C02026] transition-colors">
            {isAr ? 'تصفح المشاريع' : 'Browse Projects'} <ArrowLeft size={18} className={isAr ? '' : 'rotate-180'} />
          </Link>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-32 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="max-w-[1920px] mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#C02026] mb-2">
              <Sparkles size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? 'مصفوفة القرار' : 'Decision Matrix'}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              {isAr ? 'مقارنة المشاريع' : 'Compare Properties'}
            </h1>
          </div>
          <button onClick={clearAll} className="flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors">
            <Trash2 size={16} /> {isAr ? 'مسح الكل' : 'Clear All'}
          </button>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky start-0 z-30 bg-white p-4 md:p-8 w-[130px] md:w-[300px] text-start border-b border-e border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hidden md:block">{isAr ? 'المواصفات' : 'Specs'}</span>
                      <span className="md:hidden text-slate-400 flex justify-center"><GitCompare size={20}/></span>
                  </th>
                  {projects.map(p => (
                    <th key={p._id} className="snap-center p-4 md:p-8 min-w-[260px] md:min-w-[380px] border-b border-slate-100 relative align-top">
                      <button onClick={() => removeItem(p._id)} className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-6 h-6 md:w-8 md:h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100">
                        <X size={14} />
                      </button>
                      <div className="relative aspect-[4/3] rounded-2xl md:rounded-[2rem] overflow-hidden mb-4 md:mb-6 shadow-lg group">
                        {p.mainImage && <Image src={urlFor(p.mainImage).width(600).url()} alt={p.titleEn} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        <div className="absolute bottom-3 start-3 md:bottom-4 md:start-4 text-white">
                           <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">{isAr ? p.district?.nameAr : p.district?.nameEn}</p>
                        </div>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black text-slate-900 leading-tight mb-2 line-clamp-2">{isAr ? p.titleAr : p.titleEn}</h3>
                      <Link href={`/${lang}/projects/${p.slug}`} className="text-[10px] md:text-xs font-bold text-[#C02026] hover:underline flex items-center gap-1">
                        {isAr ? 'عرض المشروع' : 'View Project'} <ArrowRight size={14} className={isAr ? 'rotate-180' : ''}/>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                <CompareRow icon={<Building2 size={18}/>} label={isAr ? 'المطور' : 'Developer'} projects={projects} field={isAr ? 'developer.nameAr' : 'developer.nameEn'} isBold />
                <CompareRow icon={<Wallet size={18}/>} label={isAr ? 'السعر' : 'Price'} projects={projects} field="price" formatCurrency={formatCurrency} isPrice />
                <CompareRow icon={<Ruler size={18}/>} label={isAr ? 'المساحة' : 'Area'} projects={projects} field="minArea" suffix={isAr ? 'م²' : 'm²'} />
                <CompareRow icon={<CheckCircle2 size={18}/>} label={isAr ? 'المقدم' : 'Down Payment'} projects={projects} field="downPayment" suffix="%" />
                <CompareRow icon={<Calendar size={18}/>} label={isAr ? 'التقسيط' : 'Installments'} projects={projects} field="installments" suffix={isAr ? 'سنوات' : 'Years'} />
                <CompareRow icon={<Home size={18}/>} label={isAr ? 'الاستلام' : 'Delivery'} projects={projects} field="deliveryDate" />
                <CompareRow icon={<Paintbrush size={18}/>} label={isAr ? 'التشطيب' : 'Finishing'} projects={projects} field="finishingType" />
                
                {/* Rating Row */}
                <tr className="group hover:bg-slate-50/30 transition-colors">
                   <td className="sticky start-0 z-20 bg-white p-4 md:p-8 font-bold text-[10px] md:text-xs uppercase tracking-widest text-slate-500 border-e border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                      <div className="flex flex-col md:flex-row items-center md:gap-3 gap-1 text-center md:text-start">
                        <Star size={16} className="text-yellow-500 fill-yellow-500 md:w-[18px]" /> 
                        <span>{isAr ? 'التقييم' : 'Rating'}</span>
                      </div>
                   </td>
                   {projects.map(p => (
                     <td key={p._id} className="snap-center p-4 md:p-8 text-center md:text-start">
                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 justify-center md:justify-start">
                           <span className="text-xl md:text-2xl font-black text-slate-900">{p.editorRating || '-'}</span>
                           <span className="text-[10px] md:text-xs font-bold text-slate-400">/ 10</span>
                        </div>
                     </td>
                   ))}
                </tr>

                {/* Amenities Row */}
                <tr className="group hover:bg-slate-50/30 transition-colors">
                   <td className="sticky start-0 z-20 bg-white p-4 md:p-8 font-bold text-[10px] md:text-xs uppercase tracking-widest text-slate-500 border-e border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                      <div className="flex flex-col md:flex-row items-center md:gap-3 gap-1 text-center md:text-start">
                        <Sparkles size={16} className="text-purple-500 md:w-[18px]" /> 
                        <span>{isAr ? 'المميزات' : 'Amenities'}</span>
                      </div>
                   </td>
                   {projects.map(p => (
                     <td key={p._id} className="snap-center p-4 md:p-8 align-top">
                        <div className="flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start">
                           {p.amenities?.slice(0, 4).map((a, i) => (
                              <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 md:px-3 rounded-lg text-[9px] md:text-[10px] font-bold">{a.replace(/_/g, ' ')}</span>
                           ))}
                           {p.amenities?.length > 4 && <span className="text-[9px] md:text-[10px] text-slate-400 px-1 py-1">+{p.amenities.length - 4}</span>}
                        </div>
                     </td>
                   ))}
                </tr>

                {/* Actions Footer */}
                <tr>
                   <td className="sticky start-0 z-20 bg-white p-4 md:p-8 border-e border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"></td>
                   {projects.map(p => (
                     <td key={p._id} className="snap-center p-4 md:p-8">
                        <a href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=I am interested in ${p.titleEn}`} target="_blank" className="w-full block bg-[#25D366] hover:bg-[#1da851] text-white text-center py-3 md:py-4 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-green-500/20 transition-all active:scale-95">
                           {isAr ? 'تواصل واتساب' : 'WhatsApp'}
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

function CompareRow({ icon, label, projects, field, formatCurrency, suffix = "", isPrice, isBold }) {
  const getValue = (obj, path) => {
    if (!obj || !path) return null;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // ✅ كشف القيم المتشابهة لتلوينها
  const checkSimilarity = (currentVal) => {
    if (!currentVal || projects.length < 2) return false;
    const otherValues = projects.map(p => getValue(p, field)).filter(v => v !== currentVal);
    // إذا كانت القيمة الحالية موجودة في بقية المشاريع
    return projects.filter(p => getValue(p, field) === currentVal).length > 1;
  };

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="sticky start-0 z-20 bg-white group-hover:bg-slate-50/50 p-4 md:p-8 font-bold text-[10px] md:text-xs uppercase tracking-widest text-slate-500 border-e border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors">
        <div className="flex flex-col md:flex-row items-center md:gap-3 gap-1 text-slate-400 text-center md:text-start">
          <span className="text-[#C02026] [&>svg]:w-[16px] [&>svg]:h-[16px] md:[&>svg]:w-[18px] md:[&>svg]:h-[18px]">{icon}</span> 
          <span className="leading-tight">{label}</span>
        </div>
      </td>
      
      {projects.map(p => {
        const val = getValue(p, field);
        const isSimilar = checkSimilarity(val);

        return (
          <td key={p._id} className={`snap-center p-4 md:p-8 align-middle text-center md:text-start transition-colors ${isSimilar ? 'bg-emerald-50/40' : ''}`}>
             {isPrice ? (
                <span className={`text-lg md:text-xl font-black whitespace-nowrap ${isSimilar ? 'text-emerald-700' : 'text-[#C02026]'}`}>
                  {formatCurrency(val)}
                </span>
             ) : (
                <span className={`text-xs md:text-sm ${isBold ? 'font-black text-slate-900' : 'font-bold text-slate-700'} ${isSimilar ? 'bg-emerald-100/50 text-emerald-800 px-2 py-1 rounded-md border border-emerald-200/50' : ''}`}>
                   {val ? `${val} ${suffix}` : <span className="text-slate-300">-</span>}
                </span>
             )}
          </td>
        );
      })}
    </tr>
  );
}