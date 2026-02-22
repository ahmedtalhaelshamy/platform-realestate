"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { urlFor } from '@/sanity/image';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { Building2, Search, ShieldCheck, Briefcase, X, ArrowUpRight, ChevronRight, ChevronLeft } from 'lucide-react';

// ✅ 1. دوال الحماية (خارج المكون للأداء)
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  if (typeof val === 'object' && val.children) return val.children.map(child => child.text).join('');
  return String(val);
};

const normalize = (text) => {
  return text.toLowerCase().trim()
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
};

export default function DevelopersListClient({ initialDevelopers = [], lang }) {
  const isAr = lang === 'ar';
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // إغلاق القائمة عند الضغط بالخارج
  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ 2. منطق الفلترة الموحد (عربي + إنجليزي)
  const filtered = useMemo(() => {
    const s = normalize(query);
    if (!s) return initialDevelopers;
    return initialDevelopers.filter(dev => 
      normalize(getSafeText(dev.nameAr)).includes(s) || 
      normalize(getSafeText(dev.nameEn)).includes(s)
    );
  }, [query, initialDevelopers]);

  // الاقتراحات (أول 5 نتائج)
  const suggestions = query.length > 0 ? filtered.slice(0, 5) : [];

  return (
    <main className={`min-h-screen bg-white ${isAr ? 'font-almarai' : 'font-jakarta'}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🚀 HERO & SMART SEARCH */}
      <header className="relative bg-[#080A0D] pt-32 pb-48 md:pt-48 md:pb-60 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C02026_0.5px,transparent_0.5px)] [background-size:30px_30px]" />
        
        <div className="relative z-50 max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-10">
            <Breadcrumbs items={[{ label: isAr ? 'المطورين' : 'TITANS' }]} lang={lang} />
          </div>
          
          <h1 className="text-6xl md:text-[9.5rem] font-black text-white mb-8 tracking-tighter uppercase leading-[0.8] italic drop-shadow-2xl">
            {isAr ? 'عمالقة' : 'THE'} <span className="text-[#C02026] not-italic">{isAr ? 'التطوير' : 'TITANS'}</span>
          </h1>

          {/* 🔍 Search Box Container */}
          <div className="max-w-3xl mx-auto relative mt-20" ref={wrapperRef}>
            <div className="relative z-50">
              <Search className={`absolute ${isAr ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 text-slate-400`} size={24} />
              <input 
                type="text" 
                value={query}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                placeholder={isAr ? "ابحث بالعربي أو English..." : "Search Titans (Bilingual)..."} 
                className="w-full bg-white border-4 border-transparent rounded-[2.5rem] py-8 px-20 text-xl font-black focus:border-[#C02026] outline-none shadow-2xl text-slate-900 italic transition-all"
              />
              {query && (
                <button onClick={() => { setQuery(""); setIsOpen(false); }} className={`absolute ${isAr ? 'left-8' : 'right-8'} top-1/2 -translate-y-1/2 bg-slate-100 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all`}>
                  <X size={18} />
                </button>
              )}
            </div>

            {/* ✨ Elegant Suggestions Box ✨ */}
            {isOpen && suggestions.length > 0 && (
              <div className="absolute top-[110%] inset-x-0 bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C02026]">{isAr ? 'نتائج مقترحة' : 'Top Matches'}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase italic">{filtered.length} {isAr ? 'مطور' : 'titans'}</span>
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                  {suggestions.map((dev) => (
                    <Link 
                      key={dev._id} 
                      href={`/${lang}/developers/${dev.slug}/`}
                      className="flex items-center gap-5 p-5 hover:bg-red-50 transition-all group border-b border-slate-50 last:border-0"
                    >
                      <div className="w-14 h-14 bg-white rounded-2xl p-2 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {dev.logo ? <Image src={urlFor(dev.logo).width(80).url()} alt="logo" width={40} height={40} className="object-contain" /> : <Building2 size={20} className="text-slate-200" />}
                      </div>
                      <div className="flex-grow text-start">
                        <h4 className="text-base font-black uppercase italic tracking-tighter text-slate-900 group-hover:text-[#C02026]">{getSafeText(isAr ? dev.nameAr : dev.nameEn)}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{dev.projectsCount || 0} {isAr ? 'مشروع' : 'Units'}</p>
                      </div>
                      <div className="text-slate-200 group-hover:text-[#C02026] transition-colors">
                        {isAr ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🏙️ TITANS GRID */}
      <section className="max-w-[1440px] mx-auto px-6 pt-32 pb-40 relative z-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-14">
            {filtered.map((dev) => {
               const name = getSafeText(isAr ? dev.nameAr : dev.nameEn);
               return (
                 <Link key={dev._id} href={`/${lang}/developers/${dev.slug}/`} className="group relative bg-white rounded-[3.5rem] p-10 border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 flex flex-col items-center text-center">
                    <div className="h-32 md:h-44 w-full relative mb-10 flex items-center justify-center bg-slate-50 rounded-[3rem] p-8 group-hover:bg-white transition-colors overflow-hidden">
                      {dev.logo ? (
                        <Image src={urlFor(dev.logo).width(400).auto('format').url()} alt={name} fill className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                      ) : <Building2 size={48} className="text-slate-200" />}
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-950 group-hover:text-[#C02026] transition-colors uppercase italic tracking-tighter line-clamp-1">{name}</h2>
                    <div className="mt-6 inline-flex items-center gap-2 py-3 px-6 bg-slate-50 rounded-2xl group-hover:bg-[#C02026] group-hover:text-white transition-all shadow-inner font-black uppercase text-[10px] tracking-widest">
                      <Briefcase size={14} /> {dev.projectsCount || 0} {isAr ? 'مشروع' : 'Units'}
                    </div>
                 </Link>
               );
            })}
          </div>
        ) : (
          <div className="py-40 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <Search size={64} className="mx-auto text-slate-200 mb-6 animate-pulse" />
             <h2 className="text-2xl font-black text-slate-400 italic uppercase tracking-widest">{isAr ? 'لا توجد نتائج' : 'No matches found'}</h2>
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}