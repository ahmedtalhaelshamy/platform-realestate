'use client';

import Link from 'next/link';
import { Home, Search, Map, MessageCircle, ArrowRight, Compass } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🕵️ Custom 404 Page - The "Safe Navigation" Standard
 * تم تحسينها لتكون نقطة تحويل (Conversion Point) بدلاً من كونها طريقاً مسدوداً
 */
export default function NotFound() {
  // ملاحظة: هذه الصفحة تظهر عندما لا يجد Next.js مساراً مطابقاً.
  
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative font-jakarta">
      
      {/* 🌌 Background Accents (Premium Blurs) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-red-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-slate-100 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center space-y-16">
        
        {/* 🏷️ Brand Identifier */}
        <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-12 h-1 bg-[#C02026] rounded-full mb-2" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                Platform Real Estate • 2026 Intelligence
            </p>
        </div>

        {/* 🔢 404 Visual Experience */}
        <div className="relative inline-block py-10">
          <h1 className="text-[15rem] md:text-[25rem] font-black text-slate-900 leading-none tracking-tighter italic opacity-[0.03] select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-[3.5rem] bg-[#C02026]/10 animate-ping" />
                {/* Main Icon Box */}
                <div className="relative w-32 h-32 md:w-44 md:h-44 bg-[#C02026] rounded-[3rem] shadow-premium flex items-center justify-center animate-float">
                  <Compass size={64} className="text-white" strokeWidth={1.5} />
                </div>
            </div>
          </div>
        </div>

        {/* 📝 Bilingual Guidance */}
        <div className="space-y-6 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter leading-tight">
             <span className="block md:inline">ضللت الطريق؟</span>
             <span className="text-[#C02026] md:mx-4">Lost in space?</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-2xl font-medium italic leading-relaxed opacity-80">
            الصفحة التي تبحث عنها قد تم نقلها أو لم تعد موجودة. لا تقلق، خبراؤنا هنا لإعادتك للمسار الصحيح.
          </p>
        </div>

        {/* 🧭 Smart Navigation Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link 
            href="/ar/"
            className="group p-10 bg-white rounded-[3rem] border border-slate-100 hover:border-[#C02026] transition-all duration-500 text-start space-y-6 shadow-sm hover:shadow-premium"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#C02026] transition-colors">
                <Home size={28} className="text-[#C02026] group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2">
                <h3 className="font-black uppercase tracking-tight text-xl text-slate-900">الرئيسية <span className="text-slate-300 font-light block text-xs tracking-widest mt-1">HOME BASE</span></h3>
                <p className="text-sm text-slate-500 font-medium italic line-clamp-2">العودة لاستكشاف أحدث الفرص العقارية.</p>
            </div>
          </Link>

          <Link 
            href="/ar/projects/"
            className="group p-10 bg-white rounded-[3rem] border border-slate-100 hover:border-[#C02026] transition-all duration-500 text-start space-y-6 shadow-sm hover:shadow-premium"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#C02026] transition-colors">
                <Map size={28} className="text-[#C02026] group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2">
                <h3 className="font-black uppercase tracking-tight text-xl text-slate-900">المشاريع <span className="text-slate-300 font-light block text-xs tracking-widest mt-1">INVENTORY</span></h3>
                <p className="text-sm text-slate-500 font-medium italic line-clamp-2">تصفح أكبر كتالوج للمشاريع في مصر.</p>
            </div>
          </Link>

          <a 
            href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g,'')}?text=I'm lost on the site, need help!`}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-10 bg-white rounded-[3rem] border border-slate-100 hover:border-[#25D366] transition-all duration-500 text-start space-y-6 shadow-sm hover:shadow-premium"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                <MessageCircle size={28} className="text-[#25D366] group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2">
                <h3 className="font-black uppercase tracking-tight text-xl text-slate-900">المساعدة <span className="text-slate-300 font-light block text-xs tracking-widest mt-1">VIP SUPPORT</span></h3>
                <p className="text-sm text-slate-500 font-medium italic line-clamp-2">تحدث الآن مع مستشار عقاري متخصص.</p>
            </div>
          </a>
        </div>

        {/* 🔻 Footer Meta */}
        <div className="pt-16 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-50 opacity-40">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
             © 2026 Platform Real Estate • Secure Navigation
           </p>
           <button 
             onClick={() => window.history.back()}
             className="flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:text-[#C02026] transition-colors group"
           >
             Go back safely <ArrowRight size={16} className="rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.08); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}