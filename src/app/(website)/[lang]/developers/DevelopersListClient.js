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

// ✅ دالة الأمان المحسنة لمنع خطأ الـ Objects كأبناء لـ React
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

export default function DevelopersListClient({ initialDevelopers = [], lang }) {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ فلترة فائقة السرعة مع تأمين النصوص من أي Object Errors
  const filteredDevelopers = useMemo(() => {
    return initialDevelopers.filter((dev) => {
      const name = getSafeText(isAr ? dev.nameAr : dev.nameEn).toLowerCase();
      const otherName = getSafeText(isAr ? dev.nameEn : dev.nameAr).toLowerCase();
      const search = searchQuery.toLowerCase();
      return name.includes(search) || otherName.includes(search);
    });
  }, [searchQuery, initialDevelopers, isAr]);

  const breadcrumbItems = [
    { label: isAr ? 'المطورين العقاريين' : 'TITANS', href: `/${lang}/developers/` }
  ];

  // تجهيز روابط التواصل بنظافة تامة
  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isAr ? 'أريد معرفة قائمة أفضل المطورين الموثوقين' : 'I want to know the top verified developers list')}`;

  return (
    <main className="min-h-screen bg-white selection:bg-[#C02026] selection:text-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🚀 1. THE ARCHITECTURAL HERO */}
      <header className="relative bg-[#080A0D] pt-32 pb-40 md:pt-48 md:pb-60 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(#C02026 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} aria-hidden="true" />
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#C02026]/15 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8 overflow-x-auto hide-scrollbar">
            <Breadcrumbs items={breadcrumbItems} lang={lang} />
          </div>

          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-10 backdrop-blur-md shadow-2xl">
            <Sparkles size={14} className="text-[#C02026] animate-pulse" />
            {isAr ? 'نخبة المطورين في مصر' : 'Egypt’s Real Estate Titans'}
          </div>

          <h1 className="text-6xl md:text-[9.5rem] font-black text-white mb-8 tracking-tighter uppercase leading-[0.8] italic drop-shadow-2xl">
            {isAr ? 'عمالقة' : 'THE'}<br/>
            <span className="text-[#C02026] not-italic">{isAr ? 'التطوير' : 'TITANS'}</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto opacity-90 italic mb-16">
            {isAr 
              ? `دليلك الاستثماري لـ ${initialDevelopers.length} مطور عقاري يشكلون خارطة المستقبل في مصر.` 
              : `Your definitive portal to ${initialDevelopers.length} developers shaping Egypt’s real estate future.`}
          </p>

          {/* 🔍 LIVE SEARCH - UX & SEO Optimized */}
          <div className="max-w-3xl mx-auto relative group translate-y-20 md:translate-y-28 z-30">
             <div className="relative">
                <label htmlFor="dev-search" className="sr-only">{isAr ? 'ابحث عن مطور' : 'Search for a developer'}</label>
                <Search className={`absolute ${isAr ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C02026] transition-colors`} size={24} aria-hidden="true" />
                <input 
                    id="dev-search"
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? "ابحث عن مطور (سوديك، إعمار، بالم هيلز...)" : "Search titan (Sodic, Emaar, Palm Hills...)"} 
                    className="w-full bg-white border-[4px] border-transparent rounded-[2.5rem] py-7 px-20 text-xl font-black focus:border-[#C02026] outline-none transition-all shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] text-slate-900 placeholder:text-slate-300 italic"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    aria-label="Clear search"
                    className={`absolute ${isAr ? 'left-8' : 'right-8'} top-1/2 -translate-y-1/2 bg-slate-100 p-2.5 rounded-full text-slate-500 hover:bg-[#C02026] hover:text-white transition-all active:scale-90`}
                  >
                    <X size={18} />
                  </button>
                )}
             </div>
          </div>
        </div>
      </header>

      {/* 🏙️ 2. THE TITANS GRID */}
      <section className="max-w-[1440px] mx-auto px-6 pt-64 pb-32" aria-label="Developers Grid">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12" role="list">
          {filteredDevelopers.map((dev) => {
            const devName = getSafeText(isAr ? dev.nameAr : dev.nameEn);
            return (
              <article key={dev._id} role="listitem" className="group">
                <Link 
                  href={`/${lang}/developers/${dev.slug}/`} 
                  aria-label={isAr ? `عرض ملف شركة ${devName}` : `View ${devName} profile`}
                  className="block h-full"
                >
                  <div className="relative bg-white rounded-[3rem] p-8 md:p-12 border border-slate-50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(192,32,38,0.15)] group-hover:-translate-y-3 group-hover:border-[#C02026]/20 overflow-hidden h-full flex flex-col items-center text-center">
                    
                    {/* Logo Glass Container - تم تحسين الصور هنا */}
                    <div className="h-32 md:h-44 w-full relative mb-10 flex items-center justify-center bg-slate-50 rounded-[2.5rem] p-8 transition-all duration-700 group-hover:bg-white">
                      {dev.logo ? (
                        <Image 
                          // تحسين: WebP تلقائي مع تحديد عرض مناسب
                          src={urlFor(dev.logo).width(400).auto('format').quality(90).url()} 
                          alt={`${devName} brand logo`} 
                          fill 
                          // تحسين: إخبار المتصفح بحجم الصورة حسب الجهاز (Responsive Sizes)
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                        />
                      ) : <Building2 size={48} className="text-slate-200" aria-hidden="true" />}
                      
                      <div className="absolute top-6 right-6 text-[#C02026] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0" aria-hidden="true">
                          <ShieldCheck size={22} fill="currentColor" fillOpacity={0.1} />
                      </div>
                    </div>

                    <div className="mt-auto space-y-4">
                      <h2 className="text-xl md:text-2xl font-black text-slate-950 group-hover:text-[#C02026] transition-colors line-clamp-1 uppercase tracking-tighter italic">
                        {devName}
                      </h2>
                      <div className="inline-flex items-center gap-2.5 py-2.5 px-6 bg-slate-50 rounded-2xl group-hover:bg-[#C02026] group-hover:text-white transition-all duration-500 shadow-inner">
                        <Briefcase size={14} aria-hidden="true" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">
                          {dev.projectsCount || 0} {isAr ? 'مشروع متاح' : 'Active Projects'}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Accent */}
                    <div className={`absolute bottom-8 ${isAr ? 'left-10' : 'right-10'} opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 duration-700`} aria-hidden="true">
                      <ArrowUpRight size={24} className="text-[#C02026]" />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredDevelopers.length === 0 && (
          <div className="text-center py-48 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200" role="status">
             <Building2 size={80} className="mx-auto text-slate-200 mb-8 animate-pulse" aria-hidden="true" />
             <h2 className="text-2xl font-black text-slate-400 italic uppercase tracking-widest">
                {isAr ? 'عفواً، لم نجد مطور بهذا الاسم' : 'No Titan found matching your criteria'}
             </h2>
             <p className="mt-4 text-slate-400 font-medium">{isAr ? 'جرب البحث بكلمات أبسط أو تواصل معنا' : 'Try simplifying your search or contact support'}</p>
          </div>
        )}
      </section>

      {/* 📞 3. PREMIUM CONVERSION SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 pb-40">
        <div className="relative bg-[#080A0D] rounded-[4.5rem] p-12 md:p-28 overflow-hidden shadow-2xl border-b-[20px] border-[#C02026] group">
            {/* Ambient Background Decor */}
            <div className="absolute -bottom-32 -right-32 opacity-10 group-hover:rotate-12 transition-transform duration-[2s] pointer-events-none" aria-hidden="true">
                <Building2 size={700} />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-start space-y-10">
                    <div className="space-y-4">
                      <h2 className="text-4xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.85]">
                          {isAr ? 'استشارك العقاري' : 'YOUR LEGACY'}<br/>
                          <span className="text-[#C02026] not-italic">{isAr ? 'الأكثر ثقة' : 'PARTNER'}</span>
                      </h2>
                      <div className="h-2 w-32 bg-[#C02026] rounded-full mx-auto lg:mx-0" aria-hidden="true" />
                    </div>
                    <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed italic">
                        {isAr 
                          ? 'نحن نضع خبرة 15 عاماً في السوق المصري بين يديك لمساعدتك في اختيار المطور الأنسب والأكثر أماناً لاستثمارك.' 
                          : 'Leverage 15 years of Egyptian market mastery to align your vision with the most secure industry leaders.'}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-end">
                    <a 
                      href={whatsappUrl} 
                      target="_blank" rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-4 bg-[#25D366] text-white px-12 py-8 rounded-[2.5rem] font-black uppercase text-sm tracking-widest transition-all hover:scale-105 shadow-[0_20px_50px_rgba(37,211,102,0.3)] active:scale-95"
                    >
                        <MessageCircle size={28} fill="currentColor" className="opacity-20" /> WhatsApp
                    </a>
                    <a 
                      href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                      className="group flex items-center justify-center gap-4 bg-white text-slate-950 px-12 py-8 rounded-[2.5rem] font-black uppercase text-sm tracking-widest transition-all hover:bg-[#C02026] hover:text-white shadow-2xl active:scale-95"
                    >
                        <Phone size={28} fill="currentColor" className="opacity-10" /> {isAr ? 'اتصل الآن' : 'Call Now'}
                    </a>
                </div>
            </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 30s linear infinite alternate; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}