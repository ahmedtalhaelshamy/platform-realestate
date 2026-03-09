'use client';

import { useState, useEffect, useCallback } from 'react';
import { GitCompare, X, Zap } from 'lucide-react';
import Link from 'next/link';

/**
 * 📊 CompareFloatingBar - Premium 2026 UX
 * تم تحسينه ليكون متوافقاً مع معايير الأداء (Lighthouse) ودعم الـ RTL الصارم.
 */
export default function CompareFloatingBar({ lang }) {
  const [items, setItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const isAr = lang === 'ar';

  // 1. تحديث البيانات من الـ LocalStorage
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

  // 2. إدارة التنصت على التغييرات (Event Bus)
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
    // إخطار باقي المكونات (مثل أزرار Compare في كروت المشاريع)
    window.dispatchEvent(new Event('compareUpdated'));
  };

  // SSR Safe Guard
  if (!mounted || items.length === 0) return null;

  return (
    <div 
      role="status" 
      aria-live="polite"
      // ✅ تم تصحيح الـ CSS لضمان التوسط الدقيق في العربي والإنجليزي
      className="fixed bottom-32 md:bottom-10 start-1/2 -translate-x-1/2 z-[9000] w-fit min-w-[300px] md:min-w-[480px] px-4 animate-fade-in-up"
    >
      {/* Container with High-End Glassmorphism */}
      <div className={`
        relative flex items-center gap-3 md:gap-6 p-2 md:p-3 
        bg-slate-950/90 backdrop-blur-2xl border border-white/10 
        rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        will-change-transform
        ${isAnimating ? 'scale-105 border-brand-red/50 shadow-brand-red/20' : 'scale-100'}
      `}>
        
        {/* Counter Section */}
        <div className="flex items-center gap-4 ps-4 border-e border-white/10 pe-2">
          <div className="relative">
             <div className={`
               p-3 rounded-full shadow-lg transition-all duration-500
               ${isAnimating ? 'bg-red-600 scale-110' : 'bg-brand-red'}
             `}>
                <GitCompare size={20} className={`text-white ${isAnimating ? 'rotate-12' : ''} transition-transform`} aria-hidden="true" />
             </div>
             {/* عداد دائري - Logical Property (end-1) */}
             <span className="absolute -top-1 -end-1 bg-white text-brand-red text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-xl border-2 border-brand-red">
                {items.length}
             </span>
          </div>
          
          <div className="flex flex-col text-start hidden sm:flex">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">
              {isAr ? 'قائمة المقارنة' : 'Compare List'}
            </span>
            <span className="text-xs font-black text-white italic whitespace-nowrap">
                {isAr ? `${items.length} مشاريع مختارة` : `${items.length} Assets Saved`}
            </span>
          </div>
        </div>

        {/* Action Button - توحيد الرابط بـ Trailing Slash */}
        <Link 
          href={`/${lang}/compare/`}
          className="bg-white hover:bg-brand-red text-slate-900 hover:text-white px-6 md:px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 group active:scale-95 shadow-xl outline-none"
        >
          {isAr ? 'قارن الآن' : 'Compare'}
          <Zap size={14} className="fill-current group-hover:scale-125 transition-transform" aria-hidden="true" />
        </Link>

        {/* Clear Button */}
        <button 
          onClick={clearCompare}
          className="me-4 p-2.5 text-white/30 hover:text-red-500 transition-all duration-300 group rounded-full hover:bg-white/5"
          aria-label={isAr ? `مسح القائمة` : `Clear list`}
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-500" aria-hidden="true" />
        </button>

        {/* Aura Glow Effect */}
        <div className="absolute inset-0 bg-brand-red/5 rounded-full blur-2xl -z-10 animate-pulse pointer-events-none" />
      </div>
    </div>
  );
}