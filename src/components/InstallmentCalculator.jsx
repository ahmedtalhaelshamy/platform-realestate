'use client'

import { useState, useMemo, useCallback } from 'react';
import { MessageCircle, Calculator, Wallet, Calendar, Coins, ArrowRight, TrendingDown } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 📈 Premium Real Estate Calculator 2026
 * تم تحسينه للـ SEO وإمكانية الوصول (A11y) ودعم كامل للاتجاهات (RTL/LTR)
 */
export default function InstallmentCalculator({ 
  initialPrice, 
  initialDownPayment, 
  initialYears, 
  lang, 
  projectName = "Platform Real Estate" // توفير قيمة افتراضية قوية
}) {
  const isAr = lang === 'ar';
  
  // التحكم في المدخلات مع قيم افتراضية قوية
  const [price, setPrice] = useState(initialPrice || 5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(initialDownPayment || 10);
  const [years, setYears] = useState(initialYears || 7);

  // 📉 العمليات الحسابية (تتم تلقائياً عند تغيير أي قيمة)
  const calculation = useMemo(() => {
    const downValue = (price * downPaymentPercent) / 100;
    const remainingAmount = price - downValue;
    const totalMonths = Math.max(years, 1) * 12;
    const monthlyInstallment = remainingAmount / totalMonths;

    return { 
      downValue, 
      monthly: monthlyInstallment, 
      remaining: remainingAmount 
    };
  }, [price, downPaymentPercent, years]);

  // 💰 دالة تنسيق العملة الاحترافية
  const formatCurrency = (val) => 
    new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', {
      style: 'currency', 
      currency: 'EGP', 
      maximumFractionDigits: 0
    }).format(val);

  // 📱 معالج الواتساب: يرسل "تقرير سداد" كامل لفريق المبيعات
  const handleWhatsApp = useCallback(() => {
    // حماية: تنظيف الرقم من أي رموز مسبقة
    const cleanedPhone = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');
    
    const msg = isAr 
      ? `*خطة سداد مخصصة من بلاتفورم*%0A%0A🏗️ المشروع: *${projectName}*%0A💰 السعر: ${formatCurrency(price)}%0A💵 المقدم: ${downPaymentPercent}% (${formatCurrency(calculation.downValue)})%0A🗓️ سنوات التقسيط: ${years}%0A📉 القسط الشهري: *${formatCurrency(calculation.monthly)}*`
      : `*Custom Payment Plan*%0A%0A🏗️ Project: *${projectName}*%0A💰 Price: ${formatCurrency(price)}%0A💵 Down: ${downPaymentPercent}% (${formatCurrency(calculation.downValue)})%0A🗓️ Period: ${years} Years%0A📉 Monthly: *${formatCurrency(calculation.monthly)}*`;
    
    window.open(`https://wa.me/${cleanedPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  }, [isAr, projectName, price, downPaymentPercent, years, calculation]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl md:rounded-[3.5rem] shadow-premium border border-slate-50 overflow-hidden font-sans group transition-all duration-700" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col lg:flex-row min-h-[550px]">
        
        {/* 🧪 قسم المدخلات (The Configuration Zone) */}
        <div className="flex-1 p-8 md:p-16 space-y-12 bg-white">
          <header className="space-y-3 text-start">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-red/10 rounded-2xl text-brand-red shadow-inner">
                <Calculator size={24} strokeWidth={2} />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {isAr ? 'هندسة الاستثمار' : 'Investment Logic'}
              </h3>
            </div>
            <h2 className={`text-3xl md:text-5xl font-black text-slate-900 uppercase leading-none ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
                {isAr ? 'صمم خطة سدادك' : 'Tailor Your Plan'}
            </h2>
          </header>

          <div className="space-y-14">
            {/* سعر الوحدة - ✅ A11y Fix */}
            <div className="group/input space-y-6">
              <div className="flex justify-between items-end">
                <label htmlFor="price-range" className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Coins size={14} className="text-brand-red" /> {isAr ? 'سعر الوحدة التقديري' : 'Estimated Price'}
                </label>
                <div className="text-2xl font-black text-slate-900 italic tracking-tighter" aria-live="polite">
                    {formatCurrency(price)}
                </div>
              </div>
              <input 
                id="price-range"
                type="range" min="1000000" max="50000000" step="100000" value={price} 
                onChange={(e) => setPrice(Number(e.target.value))}
                aria-valuemin="1000000" aria-valuemax="50000000" aria-valuenow={price} aria-valuetext={formatCurrency(price)}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-red hover:accent-slate-900 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* نسبة المقدم - ✅ A11y Fix */}
              <div className="space-y-6">
                <div className="flex justify-between items-center text-start">
                  <label htmlFor="downpayment-range" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Wallet size={14} className="text-brand-red" /> {isAr ? 'نسبة المقدم' : 'Down Payment'}
                  </label>
                  <span className="text-sm font-black text-white bg-slate-900 px-3 py-1 rounded-xl italic" aria-live="polite">%{downPaymentPercent}</span>
                </div>
                <input 
                  id="downpayment-range"
                  type="range" min="0" max="50" step="5" value={downPaymentPercent} 
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  aria-valuemin="0" aria-valuemax="50" aria-valuenow={downPaymentPercent} aria-valuetext={`${downPaymentPercent}%`}
                  className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-red outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2" 
                />
              </div>

              {/* مدة التقسيط - ✅ A11y Fix */}
              <div className="space-y-6">
                <div className="flex justify-between items-center text-start">
                  <label htmlFor="years-range" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-brand-red" /> {isAr ? 'مدة التقسيط' : 'Plan Duration'}
                  </label>
                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl italic" aria-live="polite">{years} {isAr ? 'سنوات' : 'Years'}</span>
                </div>
                <input 
                  id="years-range"
                  type="range" min="1" max="15" step="1" value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  aria-valuemin="1" aria-valuemax="15" aria-valuenow={years} aria-valuetext={`${years} ${isAr ? 'سنوات' : 'Years'}`}
                  className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-red outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* 🏆 بطاقة النتائج الفخمة (The Result Hub) - ✅ RTL Fix for Backgrounds */}
        <div className="lg:w-[420px] bg-[#0F1115] p-10 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* تم استخدام الخصائص المنطقية (end/start) لتأثير الإضاءة */}
          <div className="absolute top-0 end-0 w-64 h-64 bg-brand-red/10 rounded-full blur-[100px] -me-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] -ms-24 -mb-24 pointer-events-none" />
          
          <div className="relative z-10 space-y-16 text-start">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none">
                {isAr ? 'القسط الشهري المتوقع' : 'Target Monthly Installment'}
              </p>
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter leading-none transition-all duration-300">
                  {formatCurrency(calculation.monthly)}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl mt-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">
                        {isAr ? `ثابت لمدة ${years * 12} شهر` : `Fixed for ${years * 12} Months`}
                    </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/10">
              <div className="flex justify-between items-center group/item">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{isAr ? 'المقدم النقدي' : 'Cash Down Payment'}</span>
                <span className="text-base font-black text-white italic">{formatCurrency(calculation.downValue)}</span>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{isAr ? 'إجمالي المتبقي' : 'Remaining Balance'}</span>
                <span className="text-base font-black text-slate-300 italic">{formatCurrency(calculation.remaining)}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-12 space-y-6 mt-8 lg:mt-0">
            <button 
              onClick={handleWhatsApp} 
              aria-label={isAr ? 'أرسل الخطة عبر واتساب' : 'Send plan via WhatsApp'}
              className="w-full bg-brand-red text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 shadow-premium group/btn outline-none focus-visible:ring-4 focus-visible:ring-brand-red/50"
            >
              <MessageCircle size={20} fill="currentColor" />
              {isAr ? 'أرسل لي الخطة كاملة' : 'Request Full Schedule'}
              {/* السهم يعكس اتجاهه تلقائياً بناءً على اللغة */}
              <ArrowRight size={18} className="rtl:-scale-x-100 transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </button>
            
            <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                {isAr 
                  ? 'الأرقام تقريبية وتخضع لشروط المطور العقاري لعام 2026' 
                  : 'Estimates based on developer terms as of 2026'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}