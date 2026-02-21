'use client';

import { useState, useEffect, useCallback } from 'react';
import { GitCompare, X, Zap } from 'lucide-react';
import Link from 'next/link';

/**
 * 📊 CompareFloatingBar - Premium 2026 UX
 * تم تحسينه ليكون "SSR-Safe" ويمنع أخطاء التزامن بين السيرفر والمتصفح
 */
export default function CompareFloatingBar({ lang }) {
  const [items, setItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false); // حماية من أخطاء الـ Hydration
  const isAr = lang === 'ar';

  // 1. وظيفة تحديث البيانات من المتصفح
  const updateItems = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const data = JSON.parse(localStorage.getItem('compare_projects') || '[]');
      // تأثير بصري عند إضافة عنصر جديد
      if (data.length > items.length && mounted) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      setItems(data);
    } catch (e) {
      console.error("Compare Storage Error:", e);
    }
  }, [items.length, mounted]);

  // 2. إدارة دورة حياة المكون والتنصت على التغييرات
  useEffect(() => {
    setMounted(true); // نؤكد أن المكون تم تحميله في المتصفح
    updateItems();
    
    window.addEventListener('compareUpdated', updateItems);
    window.addEventListener('storage', updateItems); // للتزامن لو العميل فاتح أكتر من Tab
    
    return () => {
      window.removeEventListener('compareUpdated', updateItems);
      window.removeEventListener('storage', updateItems);
    };
  }, [updateItems]);

  const clearCompare = () => {
    localStorage.removeItem('compare_projects');
    updateItems();
    // إخطار باقي المكونات (مثل ProjectCard) أن القائمة أصبحت فارغة
    window.dispatchEvent(new Event('compareUpdated'));
  };

  // حماية: لا تظهر أي شيء حتى يتأكد React من التحميل في المتصفح
  if (!mounted || items.length === 0) return null;

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="fixed bottom-32 md:bottom-10 left-1/2 -translate-x-1/2 z-[9999] w-fit min-w-[300px] md:min-w-[480px] px-4"
    >
      {/* Container with High-End Glassmorphism */}
      <div className={`
        relative flex items-center gap-3 md:gap-6 p-2 md:p-3.5 
        bg-slate-900/80 backdrop-blur-2xl border border-white/10 
        rounded-full shadow-[0_40px_100px_-15px_rgba(0,0,0,0.7)]
        transition-all duration-700 ease-out
        ${isAnimating ? 'scale-110 border-red-500 shadow-red-900/20' : 'scale-100'}
      `}>
        
        {/* Counter Badge Section */}
        <div className="flex items-center gap-4 ps-4 border-e border-white/10 pe-2">
          <div className="relative">
             <div className={`
               p-3 rounded-full shadow-2xl transition-all duration-500
               ${isAnimating ? 'bg-red-600' : 'bg-[#C02026]'}
             `}>
                <GitCompare size={22} className={`text-white ${isAnimating ? 'rotate-180' : ''} transition-transform duration-500`} aria-hidden="true" />
             </div>
             <span className="absolute -top-1 -right-1 bg-white text-[#C02026] text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-2xl border-2 border-[#C02026]">
                {items.length}
             </span>
          </div>
          
          <div className="flex flex-col text-start hidden sm:flex">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] leading-none mb-1">
              {isAr ? 'قائمة المقارنة' : 'Compare List'}
            </span>
            <span className="text-xs font-black text-white italic">
               {isAr ? `${items.length} مشاريع مختارة` : `${items.length} Saved Assets`}
            </span>
          </div>
        </div>

        {/* Action Button - The "Hero" of the Bar */}
        <Link 
          href={`/${lang}/compare/`}
          className="bg-white hover:bg-[#C02026] text-slate-950 hover:text-white px-8 md:px-12 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3 group active:scale-95 shadow-2xl"
        >
          {isAr ? 'بدء المقارنة' : 'Compare Now'}
          <Zap size={16} className="fill-current group-hover:scale-125 transition-transform" aria-hidden="true" />
        </Link>

        {/* Clear Button */}
        <button 
          onClick={clearCompare}
          className="me-4 p-2.5 text-white/30 hover:text-red-500 transition-all duration-300 group rounded-full hover:bg-white/5"
          aria-label={isAr ? 'مسح الكل' : 'Clear All'}
        >
          <X size={22} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* Animated Aura Glow */}
        <div className="absolute inset-0 bg-[#C02026]/10 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
      </div>
    </div>
  );
}