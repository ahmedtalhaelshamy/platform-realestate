'use client'

import { useState, useMemo, useCallback } from 'react';
import { MessageCircle, Calculator, Wallet, Calendar, Coins, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 📈 Premium Real Estate Calculator 2026
 * تم التحسين لضمان دقة الأرقام وسلاسة تجربة المستخدم في الـ RTL.
 */
export default function InstallmentCalculator({ 
  initialPrice, 
  initialDownPayment, 
  initialYears, 
  lang, 
  projectName = "Platform Real Estate" 
}) {
  const isAr = lang === 'ar';
  
  // التحكم في المدخلات مع حماية القيم الافتراضية
  const [price, setPrice] = useState(initialPrice || 5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(initialDownPayment || 10);
  const [years, setYears] = useState(initialYears || 7);

  // 📉 محرك العمليات الحسابية
  const calculation = useMemo(() => {
    const downValue = (price * downPaymentPercent) / 100;
    const remainingAmount = price - downValue;
    const totalMonths = Math.max(years, 1) * 12;
    const monthlyInstallment = Math.floor(remainingAmount / totalMonths); // رقم صحيح لشكل أفضل

    return { 
      downValue, 
      monthly: monthlyInstallment, 
      remaining: remainingAmount 
    };
  }, [price, downPaymentPercent, years]);

  // 💰 تنسيق العملة
  const formatCurrency = (val) => 
    new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', {
      style: 'currency', 
      currency: 'EGP', 
      maximumFractionDigits: 0
    }).format(val);

  // 📱 إرسال تقرير السداد عبر واتساب
  const handleWhatsApp = useCallback(() => {
    const cleanedPhone = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');
    
    const msg = isAr 
      ? `*خطة سداد مخصصة من بلاتفورم*%0A%0A🏗️ المشروع: *${projectName}*%0A💰 السعر: ${formatCurrency(price)}%0A💵 المقدم: ${downPaymentPercent}% (${formatCurrency(calculation.downValue)})%0A🗓️ سنوات التقسيط: ${years}%0A📉 القسط الشهري: *${formatCurrency(calculation.monthly)}*`
      : `*Custom Payment Plan*%0A%0A🏗️ Project: *${projectName}*%0A💰 Price: ${formatCurrency(price)}%0A💵 Down: ${downPaymentPercent}% (${formatCurrency(calculation.downValue)})%0A🗓️ Period: ${years} Years%0A📉 Monthly: *${formatCurrency(calculation.monthly)}*`;
    
    window.open(`https://wa.me/${cleanedPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  }, [isAr, projectName, price, downPaymentPercent, years, calculation]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-premium border border-slate-50 overflow-hidden group transition-all duration-700" dir={isAr ? 'rtl' : 'ltr'}>
      
      

      <div className="flex flex-col lg:flex-row min-h-[550px]">
        
        {/* 🧪 قسم المدخلات */}
        <div className="flex-1 p-8 md:p-16 space-y-12 bg-white">
          <header className="space-y-3 text-start">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-red/10 rounded-2xl text-brand-red">
                <Calculator size={24} strokeWidth={2} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isAr ? 'هندسة الاستثمار' : 'Investment Logic'}
              </h3>
            </div>
            <h2 className={`text-3xl md:text-5xl font-black text-slate-900 uppercase leading-none ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
                {isAr ? 'صمم خطة سدادك' : 'Tailor Your Plan'}
            </h2>
          </header>

          <div className="space-y-14">
            {/* سعر الوحدة */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label htmlFor="price-range" className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Coins size={14} className="text-brand-red" /> {isAr ? 'سعر الوحدة' : 'Property Price'}
                </label>
                <div className="text-2xl font-black text-slate-900 italic tracking-tighter">
                    {formatCurrency(price)}
                </div>
              </div>
              <input 
                id="price-range"
                type="range" min="1000000" max="50000000" step="100000" value={price} 
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-red transition-all" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* نسبة المقدم */}
              <div className="space-y-6">
                <div className="flex justify-between items-center text-start">
                  <label htmlFor="downpayment-range" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Wallet size={14} className="text-brand-red" /> {isAr ? 'المقدم' : 'Down Payment'}
                  </label>
                  <span className="text-sm font-black text-white bg-slate-950 px-3 py-1 rounded-xl italic">%{downPaymentPercent}</span>
                </div>
                <input 
                  id="downpayment-range"
                  type="range" min="0" max="50" step="5" value={downPaymentPercent} 
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-red" 
                />
              </div>

              {/* مدة التقسيط */}
              <div className="space-y-6">
                <div className="flex justify-between items-center text-start">
                  <label htmlFor="years-range" className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-brand-red" /> {isAr ? 'المدة' : 'Duration'}
                  </label>
                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl italic">{years} {isAr ? 'سنوات' : 'Years'}</span>
                </div>
                <input 
                  id="years-range"
                  type="range" min="1" max="15" step="1" value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-red" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* 🏆 بطاقة النتائج */}
        <div className="lg:w-[420px] bg-[#0F1115] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 end-0 w-64 h-64 bg-brand-red/10 rounded-full blur-[100px] -me-32 -mt-32 pointer-events-none" />
          
          <div className="relative z-10 space-y-16 text-start">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">
                {isAr ? 'القسط الشهري' : 'Monthly Installment'}
              </p>
              <div className="space-y-2">
                <p className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter leading-none">
                  {formatCurrency(calculation.monthly)}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest italic">
                        {isAr ? `ثابت لمدة ${years * 12} شهر` : `Fixed for ${years * 12} Months`}
                    </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
              <div className="flex justify-between items-center group/item">
                <span className="text-xs text-slate-500 font-black uppercase tracking-widest">{isAr ? 'المقدم النقدي' : 'Cash Down'}</span>
                <span className="text-base font-black text-white italic">{formatCurrency(calculation.downValue)}</span>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className="text-xs text-slate-500 font-black uppercase tracking-widest">{isAr ? 'المتبقي' : 'Remaining'}</span>
                <span className="text-base font-black text-slate-400 italic">{formatCurrency(calculation.remaining)}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-12 space-y-6">
            <button 
              onClick={handleWhatsApp} 
              className="w-full bg-brand-red text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 shadow-2xl group/btn"
            >
              <MessageCircle size={20} fill="currentColor" />
              {isAr ? 'أرسل لي الخطة كاملة' : 'Get Full Schedule'}
              <ArrowRight size={18} className="rtl:rotate-180 transition-transform duration-500 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
            </button>
            
            <p className="text-[9px] text-center text-slate-600 font-black uppercase tracking-widest leading-relaxed italic">
                {isAr 
                  ? 'الأرقام تقريبية وتخضع لشروط المطور العقاري' 
                  : 'Estimates based on current developer terms'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}