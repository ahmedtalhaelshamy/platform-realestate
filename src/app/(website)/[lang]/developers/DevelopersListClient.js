"use client"; // تفعيل التفاعل اللحظي

import { useState, useMemo } from 'react';
import { urlFor } from '@/sanity/image';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { 
  Building2, Search, ShieldCheck, Briefcase, Award, 
  MessageCircle, Phone, ArrowUpRight, Sparkles, X, Filter
} from 'lucide-react';

export default function DevelopersListClient({ initialDevelopers, lang }) {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ فلترة المطورين لحظياً (أداء فائق باستخدام useMemo)
  const filteredDevelopers = useMemo(() => {
    return initialDevelopers.filter((dev) => {
      const name = isAr ? dev.nameAr : dev.nameEn;
      const otherName = isAr ? dev.nameEn : dev.nameAr;
      const search = searchQuery.toLowerCase();
      return (
        name?.toLowerCase().includes(search) || 
        otherName?.toLowerCase().includes(search)
      );
    });
  }, [searchQuery, initialDevelopers, isAr]);

  const breadcrumbItems = [{ label: isAr ? 'المطورين العقاريين' : 'Developers' }];

  return (
    <main className="min-h-screen bg-[#FDFDFD] selection:bg-[#C02026] selection:text-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. ARCHITECTURAL HERO SECTION */}
      <section className="relative bg-[#050505] pt-40 pb-48 md:pt-60 md:pb-72 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#C02026 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C02026]/10 rounded-full blur-[120px] animate-pulse" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-12 opacity-50"><Breadcrumbs items={breadcrumbItems} lang={lang} /></div>
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-10 backdrop-blur-md shadow-2xl">
            <Sparkles size={14} className="text-[#C02026]" />
            {isAr ? 'أكبر تجمع للمطورين العقاريين' : 'The Largest Developer Hub'}
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85] italic">
            {isAr ? 'عمالقة' : 'THE'}<br/>
            <span className="text-[#C02026] not-italic">{isAr ? 'التطوير' : 'TITANS'}</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto opacity-70 italic font-sans">
            {isAr 
              ? `نستعرض معك ${initialDevelopers.length} مطور عقاري يشكلون خارطة الاستثمار في مصر.` 
              : `Exploring ${initialDevelopers.length} developers shaping the investment landscape of Egypt.`}
          </p>
        </div>
      </section>

      {/* 2. LIVE SEARCH INTERFACE (Sticky) */}
      <section className="sticky top-20 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-2xl shadow-black/5">
        <div className="max-w-4xl mx-auto px-6 py-5">
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#C02026] transition-colors" size={22} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? "ابحث عن مطور (سوديك، إعمار، بالم هيلز...)" : "Search developer (Sodic, Emaar, Palm Hills...)"} 
                    className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-5 px-16 text-md font-bold focus:ring-8 focus:ring-[#C02026]/5 focus:border-[#C02026] outline-none transition-all shadow-xl text-slate-900 placeholder:text-slate-300"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2 bg-slate-100 p-2 rounded-full text-slate-400 hover:bg-[#C02026] hover:text-white transition-all">
                    <X size={16} />
                  </button>
                )}
            </div>
        </div>
      </section>

      {/* 3. THE GRAND GRID - OPTIMIZED FOR 400+ ITEMS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {filteredDevelopers.map((dev) => (
            <article key={dev._id} className="group relative">
              <Link href={`/${lang}/developers/${dev.slug}`} className="block h-full">
                {/* ✅ Luxury Card Logic:
                   الكرت مصمم بـ Border Hover باللون الأحمر كما طلبت، مع بروز اللوجو بشكل شيك
                */}
                <div className="relative bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(192,32,38,0.15)] group-hover:-translate-y-4 group-hover:border-[#C02026]/40 overflow-hidden h-full flex flex-col items-center">
                  
                  {/* Logo Area */}
                  <div className="h-32 md:h-40 w-full relative mb-8 flex items-center justify-center bg-[#FBFBFC] rounded-[2.5rem] p-6 transition-all duration-700 group-hover:bg-white">
                    {dev.logo ? (
                      <Image 
                        src={urlFor(dev.logo).width(400).url()} 
                        alt={isAr ? dev.nameAr : dev.nameEn} 
                        fill 
                        className="object-contain p-4 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                      />
                    ) : <Building2 size={40} className="text-slate-200" />}
                    
                    <div className="absolute top-4 right-4 text-[#C02026] opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
                        <ShieldCheck size={18} />
                    </div>
                  </div>

                  <div className="text-center mt-auto space-y-2">
                    <h2 className="text-lg md:text-xl font-black text-slate-900 group-hover:text-[#C02026] transition-colors line-clamp-1 uppercase tracking-tighter italic">
                      {isAr ? dev.nameAr : dev.nameEn}
                    </h2>
                    <div className="flex items-center justify-center gap-2 opacity-60">
                      <Briefcase size={12} className="text-[#C02026]" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                        {dev.projectsCount || 0} {isAr ? 'مشروع' : 'Projects'}
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight size={18} className="text-[#C02026]" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredDevelopers.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-slate-200">
             <Building2 size={60} className="mx-auto text-slate-100 mb-6 animate-pulse" />
             <p className="text-slate-400 font-black italic tracking-widest text-xs uppercase">
                {isAr ? 'لم نجد مطوراً بهذا الاسم في قاعدتنا' : 'No developer found in our titans database'}
             </p>
          </div>
        )}
      </section>

      {/* 4. CONVERSION FOOTER - CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="relative bg-[#0A0A0A] rounded-[4rem] p-10 md:p-24 overflow-hidden shadow-2xl border-b-[12px] border-[#C02026]">
            <div className="absolute -bottom-20 -right-20 opacity-10 rotate-12 text-white"><Building2 size={500} /></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-center lg:text-right">
                <div>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight mb-8">
                        {isAr ? 'تبحث عن المطور الأكثر ثقة؟' : 'Seeking the Most Trusted Titan?'}
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0">
                        {isAr 
                          ? 'استشارتنا مجانية تماماً. دعنا نساعدك في مقارنة المطورين واختيار المشروع المناسب لأهدافك.' 
                          : 'Our 15-year mastery provides a surgical evaluation of every developer. Start your legacy with us.'}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                    <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} className="group flex items-center justify-center gap-4 bg-[#25D366] text-white px-10 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-105 shadow-xl shadow-green-900/20">
                        <MessageCircle size={22} /> WhatsApp
                    </a>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="group flex items-center justify-center gap-4 bg-white text-slate-900 px-10 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:bg-[#C02026] hover:text-white shadow-2xl">
                        <Phone size={22} /> {isAr ? 'اتصل الآن' : 'Call Support'}
                    </a>
                </div>
            </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 20s linear infinite alternate; }
      `}} />
    </main>
  );
}