'use client';

import Link from 'next/link';
import Image from 'next/image'; // أضفنا Image لدعم الصور المحسنة
import { urlFor } from '@/sanity/image'; // استيراد المحرك المحسن
import { Home, Search, Map, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🕵️ Custom 404 Page - The "Safe Navigation" Standard
 * تم تصميمها لتحويل تجربة "التوهان" إلى تجربة "استكشاف"
 */
export default function NotFound() {
  // ملاحظة: بما أن هذه الصفحة Global، يفضل وضع محتوى ثنائي اللغة
  
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative">
      
      {/* Background Brand Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-red-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-slate-100 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
        
        {/* [إضافة اختيارية]: شعار المنصة المحسن بتقنية WebP */}
        {/* لو عندك حقل لوجو في Sanity تقدر تستخدمه هنا بنفس التكنيك */}
        <div className="flex justify-center mb-[-2rem]">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C02026] opacity-20">
                Platform Real Estate
            </p>
        </div>

        {/* Animated 404 Visual */}
        <div className="relative inline-block">
          <h1 className="text-[12rem] md:text-[20rem] font-black text-slate-900 leading-none tracking-tighter italic opacity-5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-[#C02026] rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(192,32,38,0.3)] flex items-center justify-center animate-bounce-slow">
              <Search size={64} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Textual Guidance */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter">
            يبدو أنك ضللت الطريق <span className="text-[#C02026]">.</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-2xl font-medium max-w-2xl mx-auto italic leading-relaxed">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نساعدك في العودة للمسار الصحيح.
          </p>
        </div>

        {/* Smart Navigation Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/ar/"
            className="group p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-[#C02026] hover:text-white transition-all duration-500 text-start space-y-4 shadow-sm"
          >
            <Home size={32} className="text-[#C02026] group-hover:text-white transition-colors" />
            <h3 className="font-black uppercase tracking-tight text-xl">الرئيسية</h3>
            <p className="text-sm opacity-70 font-medium">العودة لنقطة الانطلاق واستكشاف العروض.</p>
          </Link>

          <Link 
            href="/ar/projects/"
            className="group p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-[#C02026] hover:text-white transition-all duration-500 text-start space-y-4 shadow-sm"
          >
            <Map size={32} className="text-[#C02026] group-hover:text-white transition-colors" />
            <h3 className="font-black uppercase tracking-tight text-xl">المشاريع</h3>
            <p className="text-sm opacity-70 font-medium">تصفح أقوى الكتالوجات العقارية في مصر.</p>
          </Link>

          <a 
            href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g,'')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-[#25D366] hover:text-white transition-all duration-500 text-start space-y-4 shadow-sm"
          >
            <MessageCircle size={32} className="text-[#25D366] group-hover:text-white transition-colors" />
            <h3 className="font-black uppercase tracking-tight text-xl">مساعدة</h3>
            <p className="text-sm opacity-70 font-medium">تحدث مع مستشار عقاري الآن عبر واتساب.</p>
          </a>
        </div>

        {/* Footer Link */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
             Platform Real Estate • Navigation Error
           </p>
           <Link href="/ar/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[#C02026] transition-colors group">
             Go back to safety <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        body { background-color: #ffffff; }
      `}} />
    </main>
  );
}