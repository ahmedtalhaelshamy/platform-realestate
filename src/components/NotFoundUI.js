'use client';

import Link from 'next/link';
import { Home, AlertTriangle, MessageCircle, LayoutGrid } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

export default function NotFoundUI({ lang }) {
  const isAr = lang === 'ar';
  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-brand-red selection:text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute top-[-10%] start-[-10%] w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] bg-brand-red/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-white/90 backdrop-blur-2xl p-10 md:p-20 rounded-[3.5rem] shadow-2xl border border-white/50">
        <div className="mb-14 relative">
            <p className="text-[9rem] md:text-[13rem] font-black text-slate-100 leading-none select-none tracking-tighter italic opacity-80">404</p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-50 animate-bounce-slow">
                 <AlertTriangle size={60} className="text-brand-red" />
              </div>
            </div>
        </div>

        <div className="space-y-10 mb-14 text-start">
           <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight uppercase">
              {isAr ? 'عذراً، ضللت الطريق' : 'Lost your way?'}<span className="text-brand-red">.</span>
           </h1>
           <p className="text-slate-500 font-bold text-lg md:text-xl leading-relaxed">
              {isAr 
                ? 'الصفحة التي تبحث عنها غير موجودة حالياً، ربما تم نقلها أو تغيير رابطها.' 
                : 'The page or listing you are looking for is no longer active.'}
           </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link href={`/${lang}/`} className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-red transition-all">
              <Home size={18} /> {isAr ? 'الرئيسية' : 'Home'}
           </Link>
           <Link href={`/${lang}/projects/`} className="flex-1 flex items-center justify-center gap-3 bg-slate-100 text-slate-900 px-8 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
              <LayoutGrid size={18} /> {isAr ? 'المشاريع' : 'Projects'}
           </Link>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-bounce-slow { animation: bounce-slow 4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}} />
    </main>
  );
}