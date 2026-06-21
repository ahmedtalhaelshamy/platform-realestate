'use client';

import { useState, useEffect, useCallback } from 'react';
import { GitCompare, X, Zap } from 'lucide-react';
import Link from 'next/link';

export default function CompareFloatingBar({ lang }) {
  const [items, setItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const isAr = lang === 'ar';

  const updateItems = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const data = JSON.parse(localStorage.getItem('compare_projects') || '[]');
      if (data.length > items.length && mounted) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      setItems(data);
    } catch (e) {
      console.error("Compare Storage Error:", e);
    }
  }, [items.length, mounted]);

  useEffect(() => {
    setMounted(true); 
    updateItems();
    
    window.addEventListener('compareUpdated', updateItems);
    window.addEventListener('storage', updateItems); 
    
    return () => {
      window.removeEventListener('compareUpdated', updateItems);
      window.removeEventListener('storage', updateItems);
    };
  }, [updateItems]);

  const clearCompare = (e) => {
    e.preventDefault();
    localStorage.removeItem('compare_projects');
    updateItems();
    window.dispatchEvent(new Event('compareUpdated'));
  };

  if (!mounted || items.length === 0) return null;

  return (
    // ✅ 1. الحاوية الخارجية: inset-x-0 مع flex justify-center تضمن التوسيط المثالي بدون مشاكل RTL
    <div 
      role="status" 
      aria-live="polite"
      className="fixed bottom-24 md:bottom-10 inset-x-0 z-[9000] flex justify-center px-4 pointer-events-none animate-fade-in-up"
    >
      {/* ✅ 2. الحاوية الداخلية: عرض مرن w-full بحد أقصى max-w-[380px] عشان تناسب شاشات الموبايل الصغيرة */}
      <div className={`
        pointer-events-auto
        relative flex items-center justify-between gap-2 md:gap-6 p-2 md:p-3 
        w-full max-w-[380px] md:w-max md:max-w-none
        bg-slate-950/90 backdrop-blur-2xl border border-white/10 
        rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        will-change-transform
        ${isAnimating ? 'scale-105 border-brand-red/50 shadow-brand-red/20' : 'scale-100'}
      `}>
        
        {/* قسم العداد */}
        <div className="flex items-center gap-2 md:gap-4 ps-2 md:ps-4 border-e border-white/10 pe-3 shrink-0">
          <div className="relative">
             <div className={`
               p-2.5 md:p-3 rounded-full shadow-lg transition-all duration-500
               ${isAnimating ? 'bg-red-600 scale-110' : 'bg-brand-red'}
             `}>
                <GitCompare size={18} className={`text-white md:w-5 md:h-5 ${isAnimating ? 'rotate-12' : ''} transition-transform`} aria-hidden="true" />
             </div>
             <span className="absolute -top-1.5 -end-1.5 md:-top-1 md:-end-1 bg-white text-brand-red text-[10px] font-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-xl border-2 border-brand-red">
                {items.length}
             </span>
          </div>
          
          {/* النص يختفي في الشاشات الصغيرة جداً لتوفير المساحة */}
          <div className="flex-col text-start hidden sm:flex">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">
              {isAr ? 'قائمة المقارنة' : 'Compare List'}
            </span>
            <span className="text-xs font-black text-white italic whitespace-nowrap">
                {isAr ? `${items.length} مشاريع` : `${items.length} Saved`}
            </span>
          </div>
        </div>

        {/* زر المقارنة - flex-1 عشان ياخد المساحة المتبقية بمرونة */}
        <Link 
          href={`/${lang}/compare/`}
          className="bg-white hover:bg-brand-red text-slate-900 hover:text-white flex-1 md:flex-none justify-center px-4 md:px-10 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2 group active:scale-95 shadow-xl outline-none whitespace-nowrap"
        >
          <span>{isAr ? 'قارن الآن' : 'Compare'}</span>
          <Zap size={14} className="fill-current group-hover:scale-125 transition-transform shrink-0" aria-hidden="true" />
        </Link>

        {/* زر الإغلاق */}
        <button 
          onClick={clearCompare}
          className="p-2 text-white/30 hover:text-red-500 transition-all duration-300 group rounded-full hover:bg-white/5 shrink-0"
          aria-label={isAr ? `مسح القائمة` : `Clear list`}
        >
          <X size={18} className="md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-500" aria-hidden="true" />
        </button>

        <div className="absolute inset-0 bg-brand-red/5 rounded-full blur-2xl -z-10 animate-pulse pointer-events-none" />
      </div>
    </div>
  );
}