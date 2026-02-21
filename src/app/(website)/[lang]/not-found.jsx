'use client';

import Link from 'next/link';
import Image from 'next/image'; // أضفنا Image لدعم الصور المحسنة مستقبلاً
import { Home, ArrowRight, AlertTriangle, MessageCircle, Search } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🕵️ Custom 404 - The Premium Safety Net
 * تم تحسين تجربة المستخدم لتقليل "معدل الارتداد" (Bounce Rate)
 */
export default function NotFound() {
  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');

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
        
        {/* [إضافة اختيارية]: لوجو المنصة المحسن */}
        <div className="mb-8 flex justify-center opacity-20">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">
                Platform Real Estate
             </p>
        </div>

        {/* Icon & 404 - High Visual Impact */}
        <div className="mb-12 relative">
           <p className="text-[8rem] md:text-[12rem] font-black text-slate-50 leading-none select-none tracking-tighter italic">404</p>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded-[2rem] shadow-2xl shadow-red-500/10 border border-slate-50 animate-bounce-slow">
                 <AlertTriangle size={64} className="text-[#C02026]" aria-hidden="true" />
              </div>
           </div>
        </div>

        {/* Text Content - Clear Hierarchy */}
        <div className="space-y-8 mb-12">
           <div className="space-y-3 text-start md:text-center">
              <h1 id="not-found-heading" className="text-2xl md:text-5xl font-black text-slate-950 leading-tight italic tracking-tighter uppercase">
                 عذراً، ضللت الطريق <span className="text-[#C02026]">.</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg italic leading-relaxed">
                 الصفحة التي تبحث عنها غير موجودة، لكن لا تقلق؛ وجهتك القادمة هنا.
              </p>
           </div>
           
           <div className="w-24 h-1 bg-slate-100 mx-auto rounded-full" aria-hidden="true"></div>

           <div className="space-y-3" dir="ltr">
              <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Navigation Error</h2>
              <p className="text-slate-500 font-medium text-lg italic">The link is broken or the property has been moved.</p>
           </div>
        </div>

        {/* Actions - Smart Hub */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
           <Link 
             href="/ar/" 
             className="flex items-center justify-center gap-4 bg-[#121621] text-white px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#C02026] transition-all shadow-2xl active:scale-95 group"
           >
              <Home size={20} className="group-hover:animate-pulse" /> الرئيسية
           </Link>

           <a 
             href={`https://wa.me/${whatsappPhone}`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-center justify-center gap-4 bg-white text-slate-950 border-2 border-slate-100 px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:border-[#25D366] hover:text-[#25D366] transition-all shadow-xl active:scale-95 group"
           >
              مساعدة فورية <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
           </a>
        </div>

      </div>

      {/* Footer Hint */}
      <p className="mt-12 text-[10px] text-slate-400 font-black tracking-[0.4em] uppercase relative z-10 opacity-60">
        Platform Real Estate • Smart Navigation • 2026
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}} />
    </main>
  );
}