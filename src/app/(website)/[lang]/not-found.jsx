'use client';

import Link from 'next/link';
import { Home, Search, ArrowRight, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center font-sans selection:bg-[#C02026] selection:text-white">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-red-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/50">
        
        {/* Icon & 404 */}
        <div className="mb-8 relative">
           <h1 className="text-[8rem] md:text-[10rem] font-black text-slate-100 leading-none select-none">404</h1>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-4 rounded-3xl shadow-lg shadow-red-500/10 border border-slate-50 animate-bounce">
                 <AlertTriangle size={48} className="text-[#C02026]" />
              </div>
           </div>
        </div>

        {/* Text Content (Bilingual) */}
        <div className="space-y-6 mb-10">
           <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">عذراً، هذه الصفحة غير موجودة</h2>
              <p className="text-slate-500">يبدو أنك وصلت إلى رابط خاطئ أو تم نقل الصفحة.</p>
           </div>
           
           <div className="w-16 h-1 bg-slate-100 mx-auto rounded-full"></div>

           <div className="space-y-2" dir="ltr">
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Page Not Found</h2>
              <p className="text-slate-500">It seems you've landed on a broken link or the page has moved.</p>
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           {/* زر العودة للرئيسية (عربي) */}
           <Link 
             href="/ar" 
             className="flex items-center justify-center gap-2 bg-[#121621] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#C02026] transition-all shadow-xl hover:shadow-red-500/20"
           >
              <Home size={18} /> الرئيسية
           </Link>

           {/* زر العودة للرئيسية (English) */}
           <Link 
             href="/en" 
             className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:border-[#C02026] hover:text-[#C02026] transition-all"
           >
              Home Page <ArrowRight size={18} />
           </Link>
        </div>

      </div>

      {/* Footer Hint */}
      <p className="mt-8 text-xs text-slate-400 font-bold tracking-widest uppercase relative z-10">
        Error Code: 404 • Not Found
      </p>

    </div>
  );
}