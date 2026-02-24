"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { urlFor } from '@/sanity/image';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { Building2, Search, X, ChevronRight, ChevronLeft, MessageCircle, Phone, Briefcase } from 'lucide-react';

export default function DevelopersListClient({ initialDevelopers = [], lang }) {
  const isAr = lang === 'ar';
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const s = query.toLowerCase().trim();
    if (!s) return initialDevelopers;
    return initialDevelopers.filter(dev => 
      (dev.nameAr || "").includes(s) || (dev.nameEn || "").toLowerCase().includes(s)
    );
  }, [query, initialDevelopers]);

  const whatsappNum = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');

  return (
    <main className="min-h-screen bg-white pb-20 overflow-x-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🔍 HEADER & SEARCH */}
      <header className="relative bg-[#080A0D] pt-32 pb-40 px-4">
        <div className="relative z-50 max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8"><Breadcrumbs items={[{ label: isAr ? 'المطورين' : 'TITANS' }]} lang={lang} /></div>
          <h1 className="text-5xl md:text-[8rem] font-black text-white mb-12 tracking-tighter uppercase italic">
            {isAr ? 'عمالقة' : 'THE'} <span className="text-[#C02026] not-italic">{isAr ? 'التطوير' : 'TITANS'}</span>
          </h1>

          <div className="max-w-2xl mx-auto relative" ref={wrapperRef}>
            <Search className={`absolute ${isAr ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
            <input 
              type="text" value={query} onFocus={() => setIsOpen(true)}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              placeholder={isAr ? "ابحث عن مطور..." : "Search titans..."} 
              className="w-full bg-white rounded-full py-5 md:py-7 px-14 md:px-16 text-lg font-bold focus:ring-4 focus:ring-[#C02026]/20 outline-none text-slate-900 shadow-2xl"
            />
          </div>
        </div>
      </header>

      {/* 🏙️ GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
          {filtered.map((dev) => (
            <Link key={dev._id} href={`/${lang}/developers/${dev.slug}/`} className="group flex flex-col items-center text-center">
              <div className="aspect-square w-full relative mb-6 bg-slate-50 rounded-[2rem] md:rounded-[3rem] p-6 border border-slate-100 group-hover:border-[#C02026]/30 transition-all">
                {dev.logo ? (
                  <Image src={urlFor(dev.logo).width(400).url()} alt="logo" fill className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-700" />
                ) : <Building2 size={40} className="text-slate-200" />}
              </div>
              {/* ✅ سطر الحماية من التآكل */}
              <h2 className="text-base md:text-xl font-black text-slate-900 px-2 leading-tight uppercase italic overflow-visible w-full break-words">
                {isAr ? dev.nameAr : dev.nameEn}
              </h2>
              <div className="mt-3 text-[10px] font-black text-[#C02026] uppercase tracking-widest bg-red-50 px-4 py-1.5 rounded-full">
                {dev.projectsCount || 0} {isAr ? 'مشروع' : 'Units'}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🚀 THE ONLY CTA BOX (Mobile & Desktop) */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-[#080A0D] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 border-b-[10px] border-[#C02026] relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-start space-y-4">
              <h3 className="text-3xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
                {isAr ? 'شريك' : 'YOUR'} <span className="text-[#C02026] not-italic">{isAr ? 'النجاح' : 'PARTNER'}</span>
              </h3>
              <p className="text-slate-400 text-sm md:text-lg font-medium italic max-w-md">
                {isAr ? 'نساعدك في اختيار المطور الأنسب لاستثمارك مجاناً.' : 'Expert guidance to choose the right titan for your investment.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <a href={`https://wa.me/${whatsappNum}`} className="bg-[#25D366] text-white px-8 py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl">
                <MessageCircle size={20} fill="currentColor" /> WhatsApp
              </a>
              <a href={`tel:${CONTACT_INFO.phone}`} className="bg-white text-slate-900 px-8 py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl">
                <Phone size={20} fill="currentColor" /> {isAr ? 'اتصل بنا' : 'Call Now'}
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}