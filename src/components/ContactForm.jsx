'use client';

import { useState } from 'react';
import { 
  Send, User, Phone, MessageSquare, MapPin, 
  ExternalLink, Sun, Moon, Clock, ShieldCheck, Loader2 
} from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact'; 

/**
 * 📱 PhoneNumberDisplay - Component لإظهار الرقم بتنسيق جمالي
 * تم التأمين ضد أي قيم فارغة لمنع الـ Crash
 */
const PhoneNumberDisplay = () => {
  const rawNumber = (CONTACT_INFO.phone || "").toString();
  // تنسيق الرقم المصري، وإذا كان مختلفاً سيعرضه كما هو
  const formattedNumber = rawNumber.replace(/(\+20)(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  
  return (
    <span dir="ltr" className="font-sans font-black text-lg text-slate-900 flex items-center gap-1 justify-center">
      {formattedNumber || "Contact Us"}
    </span>
  );
};

export default function ContactForm({ isAr }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    preferredTime: isAr ? 'أي وقت' : 'Any time'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setTime = (time) => {
    setFormData(prev => ({ ...prev, preferredTime: time }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // تنظيف رقم الواتساب لضمان عمل الرابط عالمياً
    const whatsappPhone = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');

    const text = isAr 
      ? `*طلب حجز موعد جديد:*%0A-----------------------%0A👤 *الاسم:* ${formData.name}%0A📱 *الهاتف:* ${formData.phone}%0A⏰ *الوقت المفضل:* ${formData.preferredTime}%0A📝 *الرسالة:* ${formData.message || 'لا يوجد'}%0A-----------------------`
      : `*New Booking Request:*%0A-----------------------%0A👤 *Name:* ${formData.name}%0A📱 *Phone:* ${formData.phone}%0A⏰ *Preferred Time:* ${formData.preferredTime}%0A📝 *Message:* ${formData.message || 'N/A'}%0A-----------------------`;

    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${text}`;
    
    // محاكاة معالجة بسيطة قبل التوجيه لتعزيز المصداقية (UX Trick)
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-50 relative overflow-hidden group" role="region" aria-labelledby="form-title" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🎨 Premium Background Accents - Logical Property (end-0) */}
      <div className="absolute top-0 end-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl -z-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>

      <header className="text-center mb-10 space-y-3">
        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-red mb-4 shadow-inner">
            <ShieldCheck size={32} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h2 id="form-title" className={`text-3xl md:text-4xl font-black text-slate-950 uppercase leading-none ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
            {isAr ? 'حجز موعد' : 'Book a Call'}<span className="text-brand-red">.</span>
        </h2>
        <p className={`text-slate-500 font-bold text-xs md:text-sm uppercase max-w-xs mx-auto leading-relaxed ${isAr ? 'tracking-widest' : 'tracking-[0.2em]'}`}>
            {isAr 
            ? 'ابدأ رحلة استثمارك العقاري اليوم بتأكيد موعدك.' 
            : 'Initiate your investment journey by securing a slot.'}
        </p>
      </header>

      {/* Quick Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <a 
          href={`tel:${(CONTACT_INFO.phone || "").replace(/\s/g, '')}`} 
          aria-label={isAr ? "اتصال مباشر" : "Direct Call"}
          className="flex flex-col items-center bg-slate-50 hover:bg-white p-5 rounded-[2rem] border border-transparent hover:border-brand-red/20 transition-all duration-500 shadow-sm hover:shadow-xl group/card outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:border-brand-red"
        >
            <span className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-[0.3em] group-hover/card:text-brand-red transition-colors">
                {isAr ? 'اتصال مباشر' : 'Direct Call'}
            </span>
            <div className="text-slate-900 flex items-center gap-3">
                <Phone size={18} className="text-brand-red" aria-hidden="true" />
                <PhoneNumberDisplay /> 
            </div>
        </a>

        <a 
          href={CONTACT_INFO.googleMapsUrl} 
          target="_blank" rel="noopener noreferrer" 
          aria-label={isAr ? "موقع المقر الرئيسي على الخريطة" : "Visit HQ location on map"}
          className="flex flex-col items-center bg-slate-50 hover:bg-white p-5 rounded-[2rem] border border-transparent hover:border-brand-red/20 transition-all duration-500 shadow-sm hover:shadow-xl group/card outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:border-brand-red"
        >
            <span className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-[0.3em] group-hover/card:text-brand-red transition-colors flex items-center gap-2">
                {isAr ? 'المقر الرئيسي' : 'Visit HQ'} <ExternalLink size={10} aria-hidden="true" />
            </span>
            <div className="text-slate-900 flex items-center gap-3 text-xs font-black italic uppercase truncate max-w-full">
                <MapPin size={18} className="text-brand-red shrink-0" aria-hidden="true" />
                <span className="truncate">{isAr ? CONTACT_INFO.addressAr : CONTACT_INFO.addressEn}</span>
            </div>
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-start relative z-10">
        
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="full-name" className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
            <User size={14} className="text-brand-red" aria-hidden="true" /> {isAr ? 'الاسم بالكامل' : 'Full Name'}
          </label>
          <input 
            id="full-name" type="text" name="name" required 
            value={formData.name} onChange={handleChange} 
            placeholder={isAr ? 'أدخل اسمك بالكامل...' : 'Your name...'} 
            className={`w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:ring-1 focus:ring-brand-red focus:bg-white transition-all outline-none font-bold text-slate-950 ${isAr ? '' : 'italic'}`} 
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
            <label htmlFor="phone-number" className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
              <Phone size={14} className="text-brand-red" aria-hidden="true" /> {isAr ? 'رقم التواصل' : 'Contact Number'}
            </label>
            <input 
              id="phone-number" type="tel" name="phone" required 
              value={formData.phone} onChange={handleChange} 
              placeholder="+20 1..." dir="ltr" 
              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:ring-1 focus:ring-brand-red focus:bg-white transition-all outline-none font-mono font-bold text-slate-950 text-end md:text-start" 
            />
        </div>

        {/* Preferred Time Hub */}
        <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
               <Clock size={14} className="text-brand-red" aria-hidden="true" /> {isAr ? 'الوقت المفضل للاتصال' : 'Preferred Callback Time'}
            </label>
            <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label={isAr ? "الوقت المفضل" : "Preferred time"}>
                {[
                    { id: 'صباحاً', en: 'Morning', icon: <Sun size={16} aria-hidden="true" /> },
                    { id: 'مساءً', en: 'Evening', icon: <Moon size={16} aria-hidden="true" /> },
                    { id: 'أي وقت', en: 'Any time', icon: <Clock size={16} aria-hidden="true" /> }
                ].map((option) => {
                    const isSelected = formData.preferredTime === (isAr ? option.id : option.en);
                    return (
                        <button
                            key={option.id} type="button"
                            onClick={() => setTime(isAr ? option.id : option.en)}
                            aria-pressed={isSelected}
                            className={`flex flex-col items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all duration-500 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${
                                isSelected
                                ? 'bg-brand-red border-brand-red text-white shadow-[0_15px_30px_-10px_rgba(192,32,38,0.4)] scale-105'
                                : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                            }`}
                        >
                            {option.icon}
                            <span className="text-[9px] font-black uppercase tracking-tighter">{isAr ? option.id : option.en}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message-input" className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
            <MessageSquare size={14} className="text-brand-red" aria-hidden="true" /> {isAr ? 'رسالة إضافية' : 'Extra Intel'}
          </label>
          <textarea 
            id="message-input" name="message" rows="3" 
            value={formData.message} onChange={handleChange} 
            placeholder={isAr ? 'مهتم بمشروع معين؟ أخبرنا هنا...' : 'Interested in a specific compound?'} 
            className={`w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:ring-1 focus:ring-brand-red focus:bg-white transition-all outline-none font-bold text-slate-950 resize-none ${isAr ? '' : 'italic'}`}
          ></textarea>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          disabled={status !== 'idle'}
          className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 flex items-center justify-center gap-4 mt-8 group active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
            status === 'success' 
            ? 'bg-[#10B981] text-white focus-visible:ring-[#10B981]' 
            : 'bg-[#121621] hover:bg-brand-red text-white focus-visible:ring-brand-red'
          }`}
        >
          {status === 'loading' ? (
              <> <Loader2 size={20} className="animate-spin" aria-hidden="true" /> {isAr ? 'جاري التحضير...' : 'Processing...'}</>
          ) : status === 'success' ? (
              <> {isAr ? 'تم التوجيه بنجاح' : 'Redirected Successfully'}</>
          ) : (
              <>
                {isAr ? 'تأكيد الحجز عبر واتساب' : 'Confirm via WhatsApp'}
                {/* ✅ RTL Fix: قلب السهم وضبط اتجاه الحركة ليتوافق مع اللغة */}
                <Send size={20} className="rtl:-scale-x-100 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
              </>
          )}
        </button>
      </form>
    </div>
  );
}