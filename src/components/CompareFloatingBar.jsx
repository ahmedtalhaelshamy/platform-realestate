'use client';

import { useState, useEffect, useCallback } from 'react';
import { GitCompare, X, Zap } from 'lucide-react';
import Link from 'next/link';

export default function CompareFloatingBar({ lang }) {
  const [items, setItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAr = lang === 'ar';

  const updateItems = useCallback(() => {
    try {
      const data = JSON.parse(localStorage.getItem('compare_projects') || '[]');
      if (data.length > items.length) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      setItems(data);
    } catch (e) {
      console.error("Compare Storage Error:", e);
    }
  }, [items.length]);

  useEffect(() => {
    updateItems();
    window.addEventListener('compareUpdated', updateItems);
    window.addEventListener('storage', updateItems);
    return () => {
      window.removeEventListener('compareUpdated', updateItems);
      window.removeEventListener('storage', updateItems);
    };
  }, [updateItems]);

  const clearCompare = () => {
    localStorage.removeItem('compare_projects');
    updateItems();
    window.dispatchEvent(new Event('compareUpdated'));
  };

  if (items.length === 0) return null;

  return (
    /**
     * ✅ الحل الجذري للاختفاء:
     * md:bottom-12 للديسك توب.
     * bottom-36 للموبايل (مساحة كافية جداً للهيدر السفلي وأزرار الاتصال).
     * z-[9999] لضمان الظهور فوق الـ Navbar وأي Overlay آخر.
     */
    <div className="fixed bottom-36 md:bottom-12 left-1/2 -translate-x-1/2 z-[9999] w-fit min-w-[290px] md:min-w-[450px] px-4 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
      
      <div className={`
        relative flex items-center gap-3 md:gap-5 p-2 md:p-3 
        bg-slate-900/90 backdrop-blur-3xl border border-white/20 
        rounded-full shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)]
        transition-all duration-500 ${isAnimating ? 'scale-110 border-red-500' : 'scale-100'}
      `}>
        
        {/* مؤشر العدد (The Badge) */}
        <div className="flex items-center gap-3 ps-4">
          <div className="relative">
             <div className="bg-[#C02026] text-white p-2.5 md:p-3 rounded-full shadow-lg shadow-red-900/40">
                <GitCompare size={20} className={`${isAnimating ? 'animate-spin' : ''}`} />
             </div>
             <span className="absolute -top-1 -right-1 bg-white text-[#C02026] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {items.length}
             </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">
              {isAr ? 'المقارنة' : 'Compare'}
            </span>
            <span className="text-xs font-bold text-white whitespace-nowrap">
               {isAr ? `${items.length} مشاريع` : `${items.length} Projects`}
            </span>
          </div>
        </div>

        {/* زر الأكشن الرئيسي (Premium Pill) */}
        <Link 
          href={`/${lang}/compare`}
          className="bg-white hover:bg-[#C02026] text-slate-950 hover:text-white px-6 md:px-10 py-3 md:py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group shadow-xl active:scale-95"
        >
          {isAr ? 'قارن الآن' : 'View Now'}
          <Zap size={16} className="fill-current group-hover:animate-pulse" />
        </Link>

        {/* زر المسح الصغير */}
        <button 
          onClick={clearCompare}
          className="me-3 p-2 text-white/20 hover:text-red-500 transition-colors group"
          title={isAr ? 'مسح الكل' : 'Clear All'}
        >
          <X size={20} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* Glow Effect Background */}
        <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
      </div>
    </div>
  );
}