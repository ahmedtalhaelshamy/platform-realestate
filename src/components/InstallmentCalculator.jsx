'use client'

import { useState, useMemo, useCallback } from 'react';
import { MessageCircle, Calculator, Wallet, Calendar, Coins, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

export default function InstallmentCalculator({ 
  initialPrice, 
  initialDownPayment, 
  initialYears, 
  lang, 
  projectName 
}) {
  const isAr = lang === 'ar';
  const [price, setPrice] = useState(initialPrice || 5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(initialDownPayment || 10);
  const [years, setYears] = useState(initialYears || 7);

  const calculation = useMemo(() => {
    const downValue = (price * downPaymentPercent) / 100;
    const monthly = (price - downValue) / (years * 12);
    return { downValue, monthly, remaining: price - downValue };
  }, [price, downPaymentPercent, years]);

  const formatCurrency = (val) => 
    new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US', {
      style: 'currency', currency: 'EGP', maximumFractionDigits: 0
    }).format(val);

  const handleWhatsApp = useCallback(() => {
    const msg = isAr 
      ? `*خطة سداد مخصصة من بلاتفورم*\n\n🏗️ المشروع: *${projectName}*\n💰 السعر: ${formatCurrency(price)}\n💵 المقدم: ${downPaymentPercent}% (${formatCurrency(calculation.downValue)})\n🗓️ سنوات التقسيط: ${years}\n📉 القسط الشهري: *${formatCurrency(calculation.monthly)}*`
      : `*Custom Payment Plan*\n\n🏗️ Project: *${projectName}*\n💰 Price: ${formatCurrency(price)}\n💵 Down: ${downPaymentPercent}% (${formatCurrency(calculation.downValue)})\n🗓️ Period: ${years} Years\n📉 Monthly: *${formatCurrency(calculation.monthly)}*`;
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  }, [isAr, projectName, price, downPaymentPercent, calculation]);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden font-sans group transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        
        {/* --- قسم المدخلات (The Laboratory) --- */}
        <div className="flex-1 p-8 md:p-12 space-y-10">
          <header className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-red-50 rounded-xl text-[#C02026]">
                <Calculator size={20} />
              </span>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                {isAr ? 'هندسة التمويل العقاري' : 'Financial Engineering'}
              </h3>
            </div>
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">
                {isAr ? 'صمم خطة سدادك' : 'Design Your Plan'}
            </h2>
          </header>

          <div className="space-y-12">
            {/* القيمة الكلية */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Coins size={14} className="text-[#C02026]" /> {isAr ? 'سعر الوحدة التقديري' : 'Target Price'}
                </label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="bg-slate-50 border-none text-right font-black text-slate-900 w-32 rounded-lg py-1 px-2 focus:ring-2 focus:ring-[#C02026]/20 transition-all"
                />
              </div>
              <input type="range" min="1000000" max="50000000" step="100000" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#C02026]" />
              <div className="flex justify-between text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                <span>1M</span><span>50M</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* المقدم */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Wallet size={14} className="text-[#C02026]" /> {isAr ? 'نسبة المقدم' : 'Down Payment'}
                  </label>
                  <span className="text-sm font-black text-[#C02026] bg-red-50 px-2 py-1 rounded-md">{downPaymentPercent}%</span>
                </div>
                <input type="range" min="0" max="50" step="5" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900" />
              </div>

              {/* مدة التقسيط */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Calendar size={14} className="text-[#C02026]" /> {isAr ? 'مدة التقسيط' : 'Duration'}
                  </label>
                  <span className="text-sm font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{years} {isAr ? 'سنة' : 'Years'}</span>
                </div>
                <input type="range" min="1" max="15" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900" />
              </div>
            </div>
          </div>
        </div>

        {/* --- بطاقة النتائج (The Premium Insight) --- */}
        <div className="lg:w-[380px] bg-slate-950 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* لمسات فنية خلفية */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C02026] opacity-20 blur-[80px] rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600 opacity-10 blur-[80px] rounded-full" />
          
          <div className="relative z-10 space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] leading-none">{isAr ? 'القسط الشهري المتوقع' : 'Estimated Monthly'}</p>
              <div className="space-y-1">
                <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none transition-all duration-300">
                  {formatCurrency(calculation.monthly)}
                </h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">
                    {isAr ? `لمدة ${years * 12} شهر` : `For ${years * 12} Months`}
                </p>
              </div>
            </div>

            <div className="space-y-5 pt-8 border-t border-white/5">
              <div className="flex justify-between items-center group/item">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isAr ? 'المقدم كاش' : 'Cash Down'}</span>
                <span className="text-sm font-black group-hover:text-[#C02026] transition-colors">{formatCurrency(calculation.downValue)}</span>
              </div>
              <div className="flex justify-between items-center group/item">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isAr ? 'المبلغ المتبقي' : 'Remaining'}</span>
                <span className="text-sm font-black">{formatCurrency(calculation.remaining)}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-10">
            <button 
              onClick={handleWhatsApp} 
              className="w-full bg-[#C02026] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 shadow-[0_15px_40px_-10px_rgba(192,32,38,0.4)] group/btn"
            >
              <MessageCircle size={20} fill="currentColor" />
              {isAr ? 'تحليل كامل للخطة' : 'Full Plan Analysis'}
              <ArrowRight size={16} className={`transition-transform duration-300 group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
            <p className="text-[9px] text-center text-slate-600 mt-6 font-bold uppercase tracking-widest">
                {isAr ? 'أرقام استرشادية لعام 2026' : 'Guideline Figures 2026'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}