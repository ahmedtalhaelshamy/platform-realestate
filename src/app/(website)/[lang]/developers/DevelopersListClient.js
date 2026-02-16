"use client";

import { useState, useMemo } from 'react';
import { urlFor } from '@/sanity/image';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { 
  Building2, Search, ShieldCheck, Briefcase, 
  MessageCircle, Phone, ArrowUpRight, Sparkles, X 
} from 'lucide-react';

export default function DevelopersListClient({ initialDevelopers, lang }) {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ التحسين البرمجي: فلترة فائقة السرعة باستخدام useMemo
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
      
      {/* 🚀 1. THE ARCHITECTURAL HERO (Merged & Optimized) */}
      <header className="relative bg-[#050505] pt-32 pb-40 md:pt-48 md:pb-60 overflow-hidden">
        {/* Background Effects - Real Estate Luxury Style */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#C02026 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#C02026]/15 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8 opacity-60">
            <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>

          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-8 backdrop-blur-md shadow-2xl">
            <Sparkles size={14} className="text-[#C02026]" />
            {isAr ? 'نخبة المطورين في مصر' : 'Egypt’s Real Estate Titans'}
          </div>

          <h1 className="text-6xl md:text-[9.5rem] font-black text-white mb-8 tracking-tighter uppercase leading-[0.8] italic">
            {isAr ? 'عمالقة' : 'THE'}<br/>
            <span className="text-[#C02026] not-italic">{isAr ? 'التطوير' : 'TITANS'}</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto opacity-80 italic mb-16">
            {isAr 
              ? `دليلك الشامل لـ ${initialDevelopers.length} مطور عقاري يشكلون مستقبل الاستثمار.` 
              : `Your definitive guide to ${initialDevelopers.length} developers shaping the future.`}
          </p>

          {/* 🔍 INTEGRATED LIVE SEARCH (Inside Hero Flow) */}
          <div className="max-w-3xl mx-auto relative group translate-y-20 md:translate-y-28">
             <div className="relative">
                <Search className={`absolute ${isAr ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C02026] transition-colors`} size={22} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? "ابحث عن مطور (سوديك، إعمار، بالم هيلز...)" : "Search developer (Sodic, Emaar, Palm Hills...)"} 
                    className="w-full bg-white border-[3px] border-transparent rounded-[2rem] py-6 px-16 text-lg font-bold focus:ring-[15px] focus:ring-[#C02026]/10 focus:border-[#C02026] outline-none transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] text-slate-900 placeholder:text-slate-300"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className={`absolute ${isAr ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 bg-slate-100 p-2 rounded-full text-slate-400 hover:bg-[#C02026] hover:text-white transition-all`}>
                    <X size={16} />
                  </button>
                )}
             </div>
          </div>
        </div>
      </header>

      {/* 🏙️ 2. THE TITANS GRID */}
      <section className="max-w-7xl mx-auto px-6 pt-56 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {filteredDevelopers.map((dev) => (
            <article key={dev._id} className="group">
              <Link href={`/${lang}/developers/${dev.slug}`} className="block h-full">
                {/* Card UI: 15 Years Experience Standard
                   - Red Border on Hover
                   - Logo grayscale to color transition
                */}
                <div className="relative bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(192,32,38,0.18)] group-hover:-translate-y-4 group-hover:border-[#C02026] overflow-hidden h-full flex flex-col items-center">
                  
                  {/* Logo Container */}
                  <div className="h-32 md:h-40 w-full relative mb-8 flex items-center justify-center bg-[#F8F9FA] rounded-[2.5rem] p-6 transition-colors duration-500 group-hover:bg-white">
                    {dev.logo ? (
                      <Image 
                        src={urlFor(dev.logo).width(400).url()} 
                        alt={isAr ? dev.nameAr : dev.nameEn} 
                        fill 
                        className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                      />
                    ) : <Building2 size={40} className="text-slate-200" />}
                    
                    <div className="absolute top-4 right-4 text-[#C02026] opacity-0 group-hover:opacity-100 transition-all">
                        <ShieldCheck size={18} />
                    </div>
                  </div>

                  <div className="text-center mt-auto">
                    <h2 className="text-lg md:text-xl font-black text-slate-900 group-hover:text-[#C02026] transition-colors line-clamp-1 uppercase tracking-tighter italic mb-3">
                      {isAr ? dev.nameAr : dev.nameEn}
                    </h2>
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 rounded-full group-hover:bg-[#C02026]/5 transition-colors">
                      <Briefcase size={12} className="text-[#C02026]" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                        {dev.projectsCount || 0} {isAr ? 'مشروع' : 'Projects'}
                      </span>
                    </div>
                  </div>

                  {/* Corner Icon */}
                  <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight size={20} className="text-[#C02026]" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Empty State - SEO Friendly */}
        {filteredDevelopers.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
             <Building2 size={60} className="mx-auto text-slate-100 mb-6" />
             <p className="text-slate-400 font-black italic tracking-widest text-xs uppercase">
                {isAr ? 'عفواً، لا يوجد مطور بهذا الاسم' : 'No titan found matching your search'}
             </p>
          </div>
        )}
      </section>

      {/* 📞 3. CONVERSION SECTION (CTA) */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="relative bg-[#0A0A0A] rounded-[4rem] p-10 md:p-24 overflow-hidden shadow-2xl border-b-[15px] border-[#C02026]">
            {/* Background Branding Decor */}
            <div className="absolute -bottom-20 -right-20 opacity-5 rotate-12 text-white">
                <Building2 size={600} />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-right">
                    <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-tight mb-8">
                        {isAr ? 'مستشارك العقاري' : 'Your Legacy'}<br/>
                        <span className="text-[#C02026]">{isAr ? 'الأكثر ثقة' : 'PARTNER'}</span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0">
                        {isAr 
                          ? 'نحن نضع خبرة 15 عاماً في السوق المصري بين يديك لمساعدتك في اختيار المطور الأنسب لاستثمارك.' 
                          : 'Leverage 15 years of Egyptian market mastery to choose the developer that fits your vision.'}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-end">
                    <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} className="group flex items-center justify-center gap-4 bg-[#25D366] text-white px-12 py-7 rounded-3xl font-black uppercase text-sm tracking-widest transition-all hover:scale-105 shadow-2xl shadow-green-900/20">
                        <MessageCircle size={24} /> WhatsApp
                    </a>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="group flex items-center justify-center gap-4 bg-white text-slate-900 px-12 py-7 rounded-3xl font-black uppercase text-sm tracking-widest transition-all hover:bg-[#C02026] hover:text-white">
                        <Phone size={24} /> {isAr ? 'اتصل الآن' : 'Call Now'}
                    </a>
                </div>
            </div>
        </div>
      </section>

    </main>
  );
}