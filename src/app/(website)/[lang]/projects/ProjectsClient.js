"use client";

import { useState, useMemo, useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';
import { Search, X, Sparkles, Building2, Cpu, CheckCircle2, LayoutGrid } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const BASE_URL = 'https://platformrealestate.co';

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

export default function ProjectsClient({ initialProjects = [], lang }) {
  const [searchQuery, setSearchQuery] = useState("");
  const isAr = lang === 'ar';

  // ✅ منطق الفلترة الفائق السرعة
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const title = getSafeText(isAr ? project.titleAr : project.titleEn).toLowerCase();
      const search = searchQuery.toLowerCase().trim();
      return title.includes(search);
    });
  }, [searchQuery, initialProjects, isAr]);

  // ✅ [GEO/AEO Schema]: توليد بيانات مهيكلة ديناميكية للقائمة
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isAr ? "كتالوج المشاريع العقارية" : "Real Estate Projects Catalog",
    "numberOfItems": filteredProjects.length,
    "itemListElement": filteredProjects.slice(0, 20).map((proj, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${BASE_URL}/${lang}/projects/${proj.slug}/`,
      "name": isAr ? proj.titleAr : proj.titleEn
    }))
  };

  const breadcrumbItems = [
    { label: isAr ? 'كتالوج المشاريع' : 'The Catalog', href: `/${lang}/projects/` }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* حقن السكيما الديناميكية */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* 🚀 1. HERO & SEARCH HEADER */}
      <header className="relative bg-[#080A0D] pt-32 pb-40 md:pt-48 md:pb-60 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C02026_0.5px,transparent_0.5px)] [background-size:30px_30px]" aria-hidden="true" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8 overflow-x-auto hide-scrollbar">
            <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>

          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-10 backdrop-blur-md">
            <Sparkles size={14} className="text-[#C02026] animate-pulse" />
            {isAr ? 'عقارات استثمارية حصرية 2026' : 'Exclusive 2026 Asset Directory'}
          </div>

          <h1 className="text-6xl md:text-[9.5rem] font-black text-white mb-8 tracking-tighter uppercase leading-[0.8] italic drop-shadow-2xl">
            {isAr ? 'كتالوج' : 'THE'}<br/>
            <span className="text-[#C02026] not-italic">{isAr ? 'المشاريع' : 'CATALOG'}</span>
          </h1>

          {/* 🔍 LIVE SEARCH INTERFACE */}
          <div className="max-w-3xl mx-auto relative group translate-y-24 z-30">
            <div className="relative">
              <Search className={`absolute ${isAr ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C02026] transition-colors`} size={24} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن مشروع محدد..." : "Search for a property..."} 
                className="w-full bg-white border-[4px] border-transparent rounded-[2.5rem] py-7 px-20 text-xl font-black focus:border-[#C02026] outline-none transition-all shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] text-slate-900 placeholder:text-slate-200 italic"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className={`absolute ${isAr ? 'left-8' : 'right-8'} top-1/2 -translate-y-1/2 bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-[#C02026] hover:text-white transition-all`}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ✅ [GEO]: Market Snapshot Section (محرك الذكاء الاصطناعي يعشق هذه البيانات) */}
      <section className="max-w-4xl mx-auto mt-24 mb-10 px-6 animate-in fade-in duration-1000">
          <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4 text-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm text-[#C02026]"><Cpu size={32} /></div>
                  <div>
                      <h3 className="font-black text-slate-900 uppercase italic text-sm">{isAr ? 'تحليل المحتوى الذكي' : 'AI Content Analysis'}</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{isAr ? 'بيانات السوق المحدثة لحظياً' : 'Live Real-Time Market Data'}</p>
                  </div>
              </div>
              <div className="flex gap-6">
                  <div className="text-center">
                      <span className="block font-black text-2xl text-slate-900">{filteredProjects.length}</span>
                      <span className="text-[9px] font-black text-[#C02026] uppercase tracking-tighter">{isAr ? 'مشروع متاح' : 'Active Units'}</span>
                  </div>
                  <div className="w-[1px] h-10 bg-slate-200" />
                  <div className="text-center">
                      <span className="block font-black text-2xl text-slate-900">2026</span>
                      <span className="text-[9px] font-black text-[#C02026] uppercase tracking-tighter">{isAr ? 'تحديث البيانات' : 'Market Year'}</span>
                  </div>
              </div>
          </div>
      </section>

      {/* 🏙️ 2. PROJECTS GRID */}
      <section className="max-w-[1440px] mx-auto px-6 pt-20 pb-32">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14" itemScope itemType="https://schema.org/ItemList">
            {filteredProjects.map((project, index) => (
              <article 
                key={project._id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                {/* بيانات دلالية مخفية للـ AI */}
                <meta itemProp="position" content={index + 1} />
                <meta itemProp="url" content={`${BASE_URL}/${lang}/projects/${project.slug}/`} />
                <meta itemProp="name" content={isAr ? project.titleAr : project.titleEn} />
                
                <ProjectCard 
                  lang={lang} 
                  data={project} 
                  isPriority={index < 6}
                />
              </article>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-48 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <Building2 size={80} className="mx-auto text-slate-200 mb-8 animate-pulse" />
            <h2 className="text-2xl font-black text-slate-400 italic uppercase tracking-widest">
              {isAr ? 'عفواً، لا توجد نتائج لهذا البحث' : 'No projects match your search'}
            </h2>
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}