'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertOctagon } from 'lucide-react';

/**
 * 🚨 Global Error Component - Platform Real Estate Standard 2026
 * مُصمم ليكون "حارس النظام" الذي يوجه العميل بهدوء عند حدوث خطأ برمجى.
 */
export default function Error({ error, reset, params }) {
  const isAr = params?.lang === 'ar';

  useEffect(() => {
    // تسجيل الخطأ في السيرفر أو خدمات التتبع (مثل Sentry)
    console.error('SYSTEM_CRITICAL_LOG:', error);
  }, [error]);

  return (
    <main 
      className={`min-h-screen bg-brand-gray-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden ${isAr ? 'font-almarai' : 'font-jakarta'}`}
      dir={isAr ? 'rtl' : 'ltr'}
      role="alert"
      aria-live="assertive"
      aria-labelledby="error-heading"
    >
      
      {/* 🎨 Premium Background Accents - Logical Properties (start/end) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50" aria-hidden="true">
        <div className="absolute top-[-5%] start-[-10%] w-[50vw] h-[50vw] bg-brand-red/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] end-[-10%] w-[40vw] h-[40vw] bg-brand-dark/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full bg-white/95 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] shadow-premium border border-white transition-all duration-700 hover:shadow-2xl">
        
        {/* Branding Placeholder */}
        <div className="mb-10 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-dark">
                Platform Real Estate
            </p>
        </div>

        {/* Animated Guard Icon */}
        <div className="relative w-24 h-24 bg-red-50 text-brand-red rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-inner group">
           <AlertOctagon size={48} className="group-hover:rotate-12 transition-transform duration-500" aria-hidden="true" />
           {/* الموجة التحذيرية */}
           <div className="absolute inset-0 rounded-[2.5rem] border-2 border-brand-red animate-ping opacity-20" />
        </div>

        {/* Textual Content - Optimized Leading for Arabic */}
        <div className="space-y-8 mb-14">
            <div className="space-y-4">
              <h1 id="error-heading" className={`text-3xl md:text-5xl font-black text-brand-dark leading-tight uppercase ${isAr ? 'tracking-normal px-2' : 'italic tracking-tighter'}`}>
                {isAr ? 'حدث خطأ تقني عارض' : 'System Anomaly'}
              </h1>
              <p className="text-slate-500 font-bold text-lg md:text-xl leading-relaxed">
                {isAr 
                  ? 'نعتذر عن هذا الانقطاع المفاجئ. فريقنا التقني يعمل الآن على استعادة الخدمة بأسرع وقت.' 
                  : 'An unexpected glitch occurred. Our elite team is already on it to restore your experience.'}
              </p>
            </div>
            
            <div className="w-24 h-1.5 bg-brand-red/10 mx-auto rounded-full" aria-hidden="true" />

            <div className="space-y-2 opacity-50">
              <h2 className="text-sm font-black text-brand-dark tracking-widest uppercase italic">Code 500 • Internal Error</h2>
              <p className="text-[11px] font-bold uppercase">{isAr ? 'حالة النظام: تحت المراجعة' : 'Status: Under Investigation'}</p>
            </div>
        </div>

        {/* Action Hub - High Conversion Focus */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => reset()}
            aria-label={isAr ? "إعادة محاولة تحميل الصفحة" : "Retry loading page"}
            className="w-full bg-brand-red text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-red-700 transition-all shadow-xl shadow-brand-red/20 active:scale-95 group outline-none focus-visible:ring-4 focus-visible:ring-brand-red/30"
          >
            <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-700" /> 
            {isAr ? 'حاول مرة أخرى' : 'Attempt Recovery'}
          </button>
          
          <Link 
            href={`/${params?.lang || 'ar'}/`} 
            aria-label={isAr ? "العودة للصفحة الرئيسية" : "Back to home"}
            className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 transition-all active:scale-95 shadow-xl group outline-none focus-visible:ring-4 focus-visible:ring-brand-dark/20"
          >
             <Home size={22} /> 
             {isAr ? 'العودة للرئيسية' : 'Return to HQ'}
          </Link>
        </div>

      </div>
      
      {/* Infrastructure Tag */}
      <div className="mt-14 space-y-2 relative z-10 opacity-60">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.6em]">
          Platform Core Support • 2026
        </p>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
          Secure Cloud Intelligence • Egypt
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
      `}} />
    </main>
  );
}