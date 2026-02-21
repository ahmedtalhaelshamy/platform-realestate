'use client';

import { useEffect } from 'react';
import Image from 'next/image'; // أضفنا دعم الصور المحسنة
import { urlFor } from '@/sanity/image'; // استيراد المحرك المحسن
import { RefreshCw, Home, AlertOctagon } from 'lucide-react';

/**
 * 🚨 Global Error Component - Premium Standard 2026
 * تم ضبطه ليعمل كـ "شبكة أمان" تمنع فقدان العميل عند حدوث مشاكل برمجية
 */
export default function Error({ error, reset }) {
  
  useEffect(() => {
    // إرسال الخطأ لخدمات التتبع (مثلاً Sentry) لو موجودة
    console.error('CRITICAL_SITE_ERROR:', error);
  }, [error]);

  return (
    <main 
      className="min-h-screen bg-[#FFF5F5] flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden"
      role="alert"
      aria-live="assertive"
      aria-labelledby="error-heading"
    >
      
      {/* Background Decor - Premium Red Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-slate-200 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full bg-white/90 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(192,32,38,0.15)] border border-white">
        
        {/* [تحسين]: مكان مخصص للوجو بـ WebP لو حبيت تضيفه مستقبلاً من السانتي */}
        <div className="mb-8 opacity-20">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#C02026]">
                Platform Real Estate
            </p>
        </div>

        {/* Animated Icon Container */}
        <div className="w-24 h-24 bg-red-50 text-[#C02026] rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner relative group">
           <AlertOctagon size={48} className="group-hover:rotate-12 transition-transform duration-500" aria-hidden="true" />
           <div className="absolute inset-0 rounded-[2rem] border-2 border-red-200 animate-ping opacity-20" />
        </div>

        {/* Textual Content - Arabic & English for reliability */}
        <div className="space-y-8 mb-12 text-start md:text-center">
            <div className="space-y-3">
              <h1 id="error-heading" className="text-2xl md:text-4xl font-black text-slate-900 leading-tight italic uppercase tracking-tighter">
                حدث خطأ تقني غير متوقع
              </h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed italic">
                نعتذر منك، واجهنا مشكلة أثناء معالجة طلبك. فريقنا يعمل على إصلاحها الآن.
              </p>
            </div>
            
            <div className="w-24 h-1 bg-red-100 mx-auto rounded-full" aria-hidden="true" />

            <div className="space-y-2" dir="ltr">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Unexpected Error</h2>
              <p className="text-slate-500 font-medium">Something went wrong on our end. Please try again.</p>
            </div>
        </div>

        {/* Action Buttons - UX Focused */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => reset()}
            aria-label="إعادة تحميل الصفحة"
            className="w-full bg-[#C02026] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-2xl shadow-red-500/30 active:scale-95 group"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" /> حاول مرة أخرى
          </button>
          
          <a 
            href="/ar/" 
            aria-label="العودة للرئيسية"
            className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
          >
             <Home size={20} /> العودة للرئيسية
          </a>
        </div>

      </div>
      
      {/* Technical Metadata */}
      <div className="mt-12 space-y-2 relative z-10 opacity-50">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">
          Internal Server Error • Code 500
        </p>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
          Platform Real Estate • System Guardian
        </p>
      </div>

    </main>
  );
}