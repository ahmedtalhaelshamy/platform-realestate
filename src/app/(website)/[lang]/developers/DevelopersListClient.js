"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { urlFor } from '@/sanity/image';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import { Building2, Search, X, ChevronRight, ChevronLeft, MessageCircle, Phone, Calendar, ArrowRight, MapPin, Home } from 'lucide-react';

export default function DevelopersListClient({ 
  initialDevelopers = [], 
  initialPosts = [], 
  initialProjects = [],  // ✅ تمت إضافتها للبحث
  initialAreas = [],     // ✅ تمت إضافتها للبحث
  initialDistricts = [], // ✅ تمت إضافتها للبحث
  lang 
}) {
  const isAr = lang === 'ar';
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handler = (e) => { 
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false); 
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 1. فلترة شبكة المطورين بالأسفل (تقتصر على المطورين فقط)
  const filteredDevelopers = useMemo(() => {
    const s = query.toLowerCase().trim();
    if (!s) return initialDevelopers;
    return initialDevelopers.filter(dev => 
      (dev.nameAr || "").includes(s) || (dev.nameEn || "").toLowerCase().includes(s)
    );
  }, [query, initialDevelopers]);

  // 2. فلترة الاقتراحات المنسدلة (محرك بحث شامل - Omni Search)
  const searchSuggestions = useMemo(() => {
    const s = query.toLowerCase().trim();
    if (!s) return [];
    
    const results = [];

    // أ. البحث في المطورين (أول 3 نتائج)
    initialDevelopers.filter(dev => (dev.nameAr || "").includes(s) || (dev.nameEn || "").toLowerCase().includes(s))
      .slice(0, 3).forEach(dev => results.push({
        _id: dev._id,
        title: isAr ? dev.nameAr : dev.nameEn,
        typeLabel: isAr ? 'مطور' : 'Developer',
        url: `/${lang}/developers/${dev.slug}/`,
        image: dev.logo,
        icon: 'developer',
        subtitle: `${dev.projectsCount || 0} ${isAr ? 'مشروع' : 'Projects'}`
      }));

    // ب. البحث في المشاريع (أول 3 نتائج)
    initialProjects.filter(p => (p.titleAr || "").includes(s) || (p.titleEn || "").toLowerCase().includes(s))
      .slice(0, 3).forEach(p => results.push({
        _id: p._id,
        title: isAr ? p.titleAr : p.titleEn,
        typeLabel: isAr ? 'مشروع' : 'Project',
        url: `/${lang}/projects/${p.slug}/`,
        image: p.mainImage,
        icon: 'project',
        subtitle: isAr ? 'عرض تفاصيل المشروع' : 'View Details'
      }));

    // ج. البحث في المناطق (أول نتيجتين)
    initialAreas.filter(a => (a.nameAr || "").includes(s) || (a.nameEn || "").toLowerCase().includes(s))
      .slice(0, 2).forEach(a => results.push({
        _id: a._id,
        title: isAr ? a.nameAr : a.nameEn,
        typeLabel: isAr ? 'منطقة' : 'Area',
        url: `/${lang}/areas/${a.slug}/`,
        image: null,
        icon: 'area',
        subtitle: isAr ? 'تصفح المنطقة' : 'Explore Area'
      }));

    // د. البحث في الأحياء (أول نتيجتين)
    initialDistricts.filter(d => (d.nameAr || "").includes(s) || (d.nameEn || "").toLowerCase().includes(s))
      .slice(0, 2).forEach(d => results.push({
        _id: d._id,
        title: isAr ? d.nameAr : d.nameEn,
        typeLabel: isAr ? 'حي' : 'District',
        url: `/${lang}/districts/${d.slug}/`,
        image: null,
        icon: 'district',
        subtitle: isAr ? 'تصفح الحي' : 'Explore District'
      }));

    return results;
  }, [query, initialDevelopers, initialProjects, initialAreas, initialDistricts, isAr, lang]);

  const whatsappNum = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');

  return (
    <main className="min-h-screen bg-white pb-20 overflow-x-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🔍 HEADER & SEARCH */}
      <header className="relative bg-[#080A0D] pt-32 pb-40 px-4">
        <div className="relative z-50 max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Breadcrumbs items={[{ label: isAr ? 'المطورين' : 'TITANS' }]} lang={lang} />
          </div>
          <h1 className="text-5xl md:text-[8rem] font-black text-white mb-12 tracking-tighter uppercase italic leading-none">
            {isAr ? 'عمالقة' : 'THE'} <span className="text-[#C02026] not-italic">{isAr ? 'التطوير' : 'TITANS'}</span>
          </h1>

          {/* 🔍 منطقة البحث الشامل */}
          <div className="max-w-2xl mx-auto relative" ref={wrapperRef}>
            <Search className={`absolute ${isAr ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-slate-400 z-10`} size={20} />
            <input 
              type="text" 
              value={query} 
              onFocus={() => setIsOpen(true)}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              placeholder={isAr ? "ابحث عن مطور، مشروع، منطقة..." : "Search developers, projects, areas..."} 
              className="relative w-full bg-white rounded-full py-5 md:py-7 px-14 md:px-16 text-lg font-bold focus:ring-4 focus:ring-[#C02026]/20 outline-none text-slate-900 shadow-2xl transition-all"
            />

            {/* ✅ القائمة المنسدلة للبحث الشامل */}
            {isOpen && query.trim().length > 0 && (
              <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                {searchSuggestions.length > 0 ? (
                  <ul className="max-h-[26rem] overflow-y-auto hide-scrollbar py-2">
                    {searchSuggestions.map((item) => (
                      <li key={`${item.typeLabel}-${item._id}`}>
                        <Link 
                          href={item.url} 
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group ${isAr ? 'text-right' : 'text-left'}`}
                        >
                          {/* أيقونة العنصر الديناميكية */}
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl p-2 shrink-0 border border-slate-200 group-hover:border-[#C02026]/30 transition-all flex items-center justify-center overflow-hidden relative">
                            {item.image ? (
                              <Image src={urlFor(item.image).width(100).url()} alt={item.title} fill className="object-contain p-1" unoptimized={true} />
                            ) : (
                              item.icon === 'developer' ? <Building2 size={20} className="text-slate-400" /> :
                              item.icon === 'project' ? <Home size={20} className="text-slate-400" /> :
                              <MapPin size={20} className="text-slate-400" />
                            )}
                          </div>
                          
                          {/* تفاصيل العنصر مع حماية الـ min-w-0 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[8px] font-black text-white bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-widest group-hover:bg-[#C02026] transition-colors">
                                {item.typeLabel}
                              </span>
                            </div>
                            <h4 className="text-base font-black text-slate-900 group-hover:text-[#C02026] truncate italic uppercase transition-colors pr-2">
                              {item.title}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 pr-1">
                              {item.subtitle}
                            </p>
                          </div>
                          
                          <ChevronLeft className={`text-slate-300 group-hover:text-[#C02026] transition-transform shrink-0 ${isAr ? '' : 'rotate-180'}`} size={20} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-10 text-center px-6">
                    <Search className="mx-auto text-slate-200 mb-3" size={32} />
                    <p className="text-sm font-bold text-slate-500 italic uppercase">
                      {isAr ? 'لم نجد أي نتائج متطابقة' : 'No matching results found'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">
                      {isAr ? 'تأكد من الحروف أو جرب البحث بكلمة أخرى' : 'Check the spelling or try a different keyword'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🏙️ DEVELOPERS GRID (يعرض المطورين فقط) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
          {filteredDevelopers.map((dev) => (
            <Link key={dev._id} href={`/${lang}/developers/${dev.slug}/`} className="group flex flex-col items-center text-center">
              <div className="aspect-square w-full relative mb-6 bg-slate-50 rounded-[2rem] md:rounded-[3rem] p-6 border border-slate-100 group-hover:border-[#C02026]/30 transition-all">
                {dev.logo ? (
                  <Image src={urlFor(dev.logo).width(400).url()} alt="logo" fill className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-700" unoptimized={true} />
                ) : <div className="w-full h-full flex items-center justify-center"><Building2 size={40} className="text-slate-200" /></div>}
              </div>
              <h2 className="text-base md:text-xl font-black text-slate-900 px-2 leading-tight uppercase italic overflow-visible w-full break-words">
                {isAr ? dev.nameAr : dev.nameEn}
              </h2>
              <div className="mt-3 text-[10px] font-black text-[#C02026] uppercase tracking-widest bg-red-50 px-4 py-1.5 rounded-full">
                {dev.projectsCount || 0} {isAr ? 'مشروع' : 'Projects'}
              </div>
            </Link>
          ))}
          {filteredDevelopers.length === 0 && (
             <div className="col-span-full py-10 text-center">
               <p className="text-slate-400 font-bold">{isAr ? 'لا يوجد مطورين مطابقين للبحث الحالي' : 'No developers match your current search'}</p>
             </div>
          )}
        </div>
      </section>

      {/* 📰 ✅ قسم أخبار العمالقة (TITAN INTEL) */}
      {initialPosts && initialPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div className={`text-center ${isAr ? 'md:text-right' : 'md:text-left'}`}>
              <span className="text-[#C02026] font-black uppercase tracking-[0.4em] text-[10px] block mb-2">{isAr ? 'تقارير وتحليلات' : 'MARKET REPORTS'}</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
                {isAr ? 'أخبار العمالقة' : 'TITAN INTEL'}
              </h2>
            </div>
            <Link href={`/${lang}/blog/`} className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C02026] transition-all shadow-xl">
               {isAr ? 'كل الأخبار' : 'All Insights'}
               <ArrowRight size={16} className={`transition-transform group-hover:translate-x-2 ${isAr ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initialPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/${lang}/blog/${post.slug}/`} className="group flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                  {post.mainImage && (
                    <Image src={urlFor(post.mainImage).width(600).url()} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s] " unoptimized={true} />
                  )}
                  <div className={`absolute top-6 ${isAr ? 'right-6' : 'left-6'}`}>
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                      {isAr ? 'أخبار الشركات' : 'Corporate'}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1 text-start">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    <Calendar size={12} className="text-[#C02026]" />
                    {new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-[#C02026] transition-colors leading-tight italic uppercase">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                    {post.overview}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 🚀 THE ONLY CTA BOX */}
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
              <a href={`https://wa.me/${whatsappNum}`} className="bg-[#25D366] text-white px-8 py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform">
                <MessageCircle size={20} fill="currentColor" /> WhatsApp
              </a>
              <a href={`tel:${CONTACT_INFO.phone}`} className="bg-white text-slate-900 px-8 py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform">
                <Phone size={20} fill="currentColor" /> {isAr ? 'اتصل بنا' : 'Call Now'}
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}