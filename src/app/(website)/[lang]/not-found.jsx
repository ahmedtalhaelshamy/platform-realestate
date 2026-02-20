'use client';

import Link from 'next/link';
import { Home, ArrowRight, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <main 
      className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center font-sans selection:bg-[#C02026] selection:text-white relative overflow-hidden"
      role="main"
      aria-labelledby="not-found-heading"
    >
      
      {/* Background Decor - Premium Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-red-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-white/80 backdrop-blur-xl p-8 md:p-16 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white/50">
        
        {/* Icon & 404 - High Visual Impact */}
        <div className="mb-12 relative">
           <p className="text-[8rem] md:text-[12rem] font-black text-slate-50 leading-none select-none tracking-tighter italic">404</p>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded-[2rem] shadow-2xl shadow-red-500/10 border border-slate-50 animate-bounce">
                 <AlertTriangle size={64} className="text-[#C02026]" aria-hidden="true" />
              </div>
           </div>
        </div>

        {/* Text Content - Clear Hierarchy */}
        <div className="space-y-8 mb-12">
           <div className="space-y-3 text-start md:text-center">
              <h1 id="not-found-heading" className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">عذراً، هذه الصفحة غير موجودة</h1>
              <p className="text-slate-500 font-medium text-lg italic">يبدو أنك وصلت إلى رابط خاطئ أو تم نقل الصفحة.</p>
           </div>
           
           <div className="w-24 h-1 bg-slate-100 mx-auto rounded-full" aria-hidden="true"></div>

           <div className="space-y-3" dir="ltr">
              <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Page Not Found</h2>
              <p className="text-slate-500 font-medium text-lg italic">It seems you've landed on a broken link or the page has moved.</p>
           </div>
        </div>

        {/* Actions - UX Best Practices */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
           {/* زر العودة للرئيسية (عربي) - توحيد السيو بالسلاش النهائية */}
           <Link 
             href="/ar/" 
             aria-label="العودة للصفحة الرئيسية باللغة العربية"
             className="flex items-center justify-center gap-3 bg-[#121621] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#C02026] transition-all shadow-2xl active:scale-95 group"
           >
              <Home size={20} className="group-hover:animate-pulse" /> الرئيسية
           </Link>

           {/* زر العودة للرئيسية (English) - توحيد السيو بالسلاش النهائية */}
           <Link 
             href="/en/" 
             aria-label="Back to home page in English"
             className="flex items-center justify-center gap-3 bg-white text-slate-950 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-[#C02026] hover:text-[#C02026] transition-all shadow-xl active:scale-95 group"
           >
              Home Page <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

      </div>

      {/* Footer Hint for Tech/SEO */}
      <p className="mt-12 text-[10px] text-slate-400 font-black tracking-[0.4em] uppercase relative z-10 opacity-60">
        Status Code: 404 • Resource Not Found • Platform 2026
      </p>

    </main>
  );
}