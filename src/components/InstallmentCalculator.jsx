'use client'

import { useState, useMemo, useCallback } from 'react';
import { MessageCircle, Calculator, Wallet, Calendar, Coins, ArrowRight, TrendingDown } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 📈 Premium Real Estate Calculator 2026
 * تم تحسينه ليعطي نتائج فورية مع واجهة مستخدم فخمة تتناسب مع مستوى "بلاتفورم"
 */
export default function InstallmentCalculator({ 
  initialPrice, 
  initialDownPayment, 
  initialYears, 
  lang, 
  projectName 
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
    <div className="max-w-5xl mx-auto bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50 overflow-hidden font-sans group transition-all duration-700" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col lg:flex-row min-h-[550px]">
        
        {/* 🧪 قسم المدخلات (The Configuration Zone) */}
        <div className="flex-1 p-10 md:p-16 space-y-12 bg-white">
          <header className="space-y-3 text-start">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-2xl text-[#C02026] shadow-inner">
                <Calculator size={24} strokeWidth={2} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                {isAr ? 'هندسة الاستثمار' : 'Investment Logic'}
              </h3>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                {isAr ? 'صمم خطة سدادك' : 'Tailor Your Plan'}
            </h2>
          </header>

          <div className="space-y-14">
            {/* سعر الوحدة */}
            <div className="group/input space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Coins size={14} className="text-[#C02026]" /> {isAr ? 'سعر الوحدة التقديري' : 'Estimated Price'}
                </label>
                <div className="text-2xl font-black text-slate-900 italic tracking-tighter">
                    {formatCurrency(price)}
                </div>
              </div>
              <input 
                type="range" min="1000000" max="50000000" step="100000" value={price} 
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#C02026] hover:accent-slate-900 transition-all" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* نسبة المقدم */}
              <div className="space-y-6">
                <div className="flex justify-between items-center text-start">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Wallet size={14} className="text-[#C02026]" /> {isAr ? 'نسبة المقدم' : 'Down Payment'}
                  </label>
                  <span className="text-sm font-black text-white bg-slate-900 px-3 py-1 rounded-xl italic">%{downPaymentPercent}</span>
                </div>
                <input 
                  type="range" min="0" max="50" step="5" value={downPaymentPercent} 
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#C02026]" 
                />
              </div>

              {/* مدة التقسيط */}
              <div className="space-y-6">
                <div className="flex justify-between items-center text-start">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} className="text-[#C02026]" /> {isAr ? 'مدة التقسيط' : 'Plan Duration'}
                  </label>
                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl italic">{years} {isAr ? 'سنوات' : 'Years'}</span>
                </div>
                <input 
                  type="range" min="1" max="15" step="1" value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#C02026]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* 🏆 بطاقة النتائج الفخمة (The Result Hub) */}
        <div className="lg:w-[420px] bg-[#0F1115] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C02026]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] -ml-24 -mb-24" />
          
          <div className="relative z-10 space-y-16 text-start">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] leading-none">
                {isAr ? 'القسط الشهري المتوقع' : 'Target Monthly Installment'}
              </p>
              <div className="space-y-2">
                <p className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-2 duration-700">
                  {formatCurrency(calculation.monthly)}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">
                        {isAr ? `ثابت لمدة ${years * 12} شهر` : `Fixed for ${years * 12} Months`}
                    </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
              <div className="flex justify-between items-center group/item">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{isAr ? 'المقدم النقدي' : 'Cash Down Payment'}</span>
                <span className="text-base font-black text-white italic">{formatCurrency(calculation.downValue)}</span>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{isAr ? 'إجمالي المتبقي' : 'Remaining Balance'}</span>
                <span className="text-base font-black text-slate-300 italic">{formatCurrency(calculation.remaining)}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-12 space-y-6">
            <button 
              onClick={handleWhatsApp} 
              className="w-full bg-[#C02026] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all duration-500 flex items-center justify-center gap-4 active:scale-95 shadow-[0_20px_50px_-10px_rgba(192,32,38,0.5)] group/btn"
            >
              <MessageCircle size={22} fill="currentColor" />
              {isAr ? 'أرسل لي الخطة كاملة' : 'Request Full Schedule'}
              <ArrowRight size={18} className={`transition-transform duration-500 group-hover:translate-x-2 ${isAr ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
            </button>
            
            <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-[0.3em] leading-relaxed">
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