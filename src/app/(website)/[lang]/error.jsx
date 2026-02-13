'use client'; // ضروري جداً لأنها تستخدم useEffect

import { useEffect } from 'react';
import { RefreshCw, Home, AlertOctagon } from 'lucide-react';

export default function Error({ error, reset }) {
  
  useEffect(() => {
    console.error('Logged Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex flex-col items-center justify-center p-6 text-center font-sans" dir="rtl">
      
      <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-red-100 max-w-lg w-full">
        
        <div className="w-20 h-20 bg-red-50 text-[#C02026] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
           <AlertOctagon size={40} />
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">حدث خطأ غير متوقع!</h2>
        
        <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">
          نعتذر بشدة، واجهنا مشكلة تقنية بسيطة أثناء تحميل الصفحة.
          <br/>
          فريقنا يعمل على إصلاحها الآن.
        </p>

        <div className="flex flex-col gap-3">
          {/* زر إعادة المحاولة - يقوم بإعادة تحميل الجزء المعطل فقط */}
          <button
            onClick={() => reset()}
            className="w-full bg-[#C02026] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
          >
            <RefreshCw size={18} /> حاول مرة أخرى
          </button>
          
          <a 
            href="/" 
            className="w-full bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-95"
          >
             <Home size={18} /> العودة للرئيسية
          </a>
        </div>

      </div>
      
      <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
        Error 500 • Server Issue
      </p>
    </div>
  );
}