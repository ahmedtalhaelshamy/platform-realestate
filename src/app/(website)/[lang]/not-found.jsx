'use client';

import Link from 'next/link';
import { Home, ArrowRight, AlertTriangle, MessageCircle, LayoutGrid } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🕵️ Custom 404 - The Premium Safety Net 2026
 * تم تحسينه ليكون RTL-Friendly بالكامل وتقليل معدل الارتداد
 */
export default function NotFound() {
  // تنظيف رقم الواتساب برمجياً
  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');

  return (
    <main 
      className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-brand-red selection:text-white relative overflow-hidden"
      role="main"
    >
      
      {/* Background Decor - Logical Placement (start/end) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute top-[-10%] start-[-10%] w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] bg-brand-red/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-white/90 backdrop-blur-2xl p-10 md:p-20 rounded-[3.5rem] shadow-premium border border-white/50 transition-all duration-700 hover:shadow-2xl">
        
        {/* Brand Recognition */}
        <div className="mb-10 flex justify-center opacity-30">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-dark">
                Platform Real Estate
             </p>
        </div>

        {/* 404 Visual Impact - Using Italic for Premium Look */}
        <div className="mb-14 relative">
           <p className="text-[9rem] md:text-[13rem] font-black text-slate-100 leading-none select-none tracking-tighter italic opacity-80">404</p>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-premium border border-slate-50 animate-bounce-slow">
                 <AlertTriangle size={60} className="text-brand-red" aria-hidden="true" />
              </div>
           </div>
        </div>

        {/* Message Content - Bilingual Balance */}
        <div className="space-y-10 mb-14">
           <div className="space-y-4 text-center">
              <h1 className="text-3xl md:text-5xl font-black text-brand-dark leading-tight uppercase tracking-tight">
                 عذراً، ضللت الطريق <span className="text-brand-red">.</span>
              </h1>
              <p className="text-slate-500 font-bold text-lg md:text-xl leading-relaxed">
                 الصفحة التي تبحث عنها غير موجودة حالياً، ربما تم نقلها أو تغيير رابطها.
              </p>
           </div>
           
           <div className="w-24 h-1.5 bg-brand-gray-50 mx-auto rounded-full" aria-hidden="true"></div>

           <div className="space-y-2 opacity-60">
              <h2 className="text-lg md:text-xl font-black text-brand-dark tracking-widest uppercase italic">Navigation Error</h2>
              <p className="text-slate-500 font-bold text-sm uppercase">The property listing or page link is no longer active.</p>
           </div>
        </div>

        {/* Actions - The Retention Hub */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           {/* الرئيسية */}
           <Link 
             href="/ar/" 
             className="flex-1 flex items-center justify-center gap-3 bg-brand-dark text-white px-8 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-red transition-all shadow-xl active:scale-95 group outline-none focus-visible:ring-4 focus-visible:ring-brand-red/20"
           >
              <Home size={18} className="group-hover:scale-110 transition-transform" /> الرئيسية
           </Link>

           {/* المشاريع - لإبقاء العميل في الموقع */}
           <Link 
             href="/ar/projects/" 
             className="flex-1 flex items-center justify-center gap-3 bg-slate-100 text-brand-dark px-8 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all active:scale-95 group outline-none focus-visible:ring-4 focus-visible:ring-brand-dark/20"
           >
              <LayoutGrid size={18} /> استكشف المشاريع
           </Link>

           {/* الدعم الفوري */}
           <a 
             href={`https://wa.me/${whatsappPhone}`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex-1 flex items-center justify-center gap-3 bg-white text-[#25D366] border-2 border-slate-100 px-8 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:border-[#25D366] transition-all shadow-lg active:scale-95 group outline-none focus-visible:ring-4 focus-visible:ring-green-500/20"
           >
              مساعدة <MessageCircle size={18} className="fill-current opacity-20" />
           </a>
        </div>

      </div>

      {/* Footer Branding */}
      <p className="mt-14 text-[10px] text-slate-400 font-black tracking-[0.5em] uppercase relative z-10">
        Platform Real Estate • Smart Recovery • 2026
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
      `}} />
    </main>
  );
}