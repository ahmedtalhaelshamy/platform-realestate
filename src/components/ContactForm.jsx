'use client';

import { useState } from 'react';
import { 
  Send, User, Phone, MessageSquare, MapPin, 
  ExternalLink, Sun, Moon, Clock, ShieldCheck, Loader2 
} from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact'; 

/**
 * 📱 PhoneNumberDisplay - لعرض الرقم بتنسيق بريميوم
 */
const PhoneNumberDisplay = () => {
  const rawNumber = (CONTACT_INFO.phone || "").toString();
  // تنسيق الرقم المصري: +20 100 401 1040
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
    
    const whatsappPhone = (CONTACT_INFO.whatsapp || "").toString().replace(/\D/g, '');

    const messageTemplate = isAr 
      ? `*طلب حجز موعد جديد:*%0A-----------------------%0A👤 *الاسم:* ${formData.name}%0A📱 *الهاتف:* ${formData.phone}%0A⏰ *الوقت المفضل:* ${formData.preferredTime}%0A📝 *الرسالة:* ${formData.message || 'لا يوجد'}%0A-----------------------`
      : `*New Booking Request:*%0A-----------------------%0A👤 *Name:* ${formData.name}%0A📱 *Phone:* ${formData.phone}%0A⏰ *Preferred Time:* ${formData.preferredTime}%0A📝 *Message:* ${formData.message || 'N/A'}%0A-----------------------`;

    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${messageTemplate}`;
    
    // محاكاة معالجة لتعزيز الثقة قبل التوجيه
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-premium border border-slate-50 relative overflow-hidden group" role="region" aria-labelledby="form-title" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🎨 Background Glow */}
      <div className="absolute top-0 end-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl -z-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000" aria-hidden="true" />

      <header className="text-center mb-10 space-y-3">
        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-red mb-4 shadow-inner">
            <ShieldCheck size={32} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h2 id="form-title" className={`text-3xl md:text-5xl font-black text-slate-950 uppercase leading-none ${isAr ? 'tracking-normal' : 'italic tracking-tighter'}`}>
            {isAr ? 'حجز موعد' : 'Book a Call'}<span className="text-brand-red not-italic">.</span>
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
          className="flex flex-col items-center bg-slate-50 hover:bg-white p-5 rounded-[2rem] border border-transparent hover:border-brand-red/20 transition-all duration-500 shadow-sm hover:shadow-xl group/card outline-none"
        >
            <span className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest group-hover/card:text-brand-red transition-colors">
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
          className="flex flex-col items-center bg-slate-50 hover:bg-white p-5 rounded-[2rem] border border-transparent hover:border-brand-red/20 transition-all duration-500 shadow-sm hover:shadow-xl group/card outline-none"
        >
            <span className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest group-hover/card:text-brand-red transition-colors flex items-center gap-2">
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
            <User size={14} className="text-brand-red" /> {isAr ? 'الاسم بالكامل' : 'Full Name'}
          </label>
          <input 
            id="full-name" type="text" name="name" required 
            value={formData.name} onChange={handleChange} 
            placeholder={isAr ? 'أدخل اسمك بالكامل...' : 'Your name...'} 
            className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none font-bold text-slate-950" 
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
            <label htmlFor="phone-number" className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
              <Phone size={14} className="text-brand-red" /> {isAr ? 'رقم التواصل' : 'Contact Number'}
            </label>
            <input 
              id="phone-number" type="tel" name="phone" required 
              pattern="[0-9+ ]*"
              value={formData.phone} onChange={handleChange} 
              placeholder="+20 1..." dir="ltr" 
              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none font-mono font-bold text-slate-950 text-start" 
            />
        </div>

        {/* Preferred Time Hub */}
        <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
               <Clock size={14} className="text-brand-red" /> {isAr ? 'الوقت المفضل للاتصال' : 'Preferred Callback Time'}
            </label>
            <div className="grid grid-cols-3 gap-3" role="radiogroup">
                {[
                    { id: 'صباحاً', en: 'Morning', icon: <Sun size={16} /> },
                    { id: 'مساءً', en: 'Evening', icon: <Moon size={16} /> },
                    { id: 'أي وقت', en: 'Any time', icon: <Clock size={16} /> }
                ].map((option) => {
                    const label = isAr ? option.id : option.en;
                    const isSelected = formData.preferredTime === label;
                    return (
                        <button
                            key={option.id} type="button"
                            onClick={() => setTime(label)}
                            aria-pressed={isSelected}
                            className={`flex flex-col items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all duration-500 active:scale-95 outline-none ${
                                isSelected
                                ? 'bg-brand-red border-brand-red text-white shadow-lg scale-105'
                                : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                            }`}
                        >
                            {option.icon}
                            <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message-input" className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
            <MessageSquare size={14} className="text-brand-red" /> {isAr ? 'رسالة إضافية' : 'Extra Intel'}
          </label>
          <textarea 
            id="message-input" name="message" rows={3} 
            value={formData.message} onChange={handleChange} 
            placeholder={isAr ? 'مهتم بمشروع معين؟ أخبرنا هنا...' : 'Interested in a specific compound?'} 
            className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none font-bold text-slate-950 resize-none"
          />
        </div>

        {/* CTA Button */}
        <div aria-live="polite">
          <button
            type="submit"
            disabled={status !== 'idle'}
            className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 flex items-center justify-center gap-4 mt-8 group active:scale-95 outline-none ${
              status === 'success' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-950 hover:bg-brand-red text-white'
            }`}
          >
            {status === 'loading' ? (
                <> <Loader2 size={20} className="animate-spin" /> {isAr ? 'جاري التحضير...' : 'Processing...'}</>
            ) : status === 'success' ? (
                <> <ShieldCheck size={20} /> {isAr ? 'تم التوجيه بنجاح' : 'Redirected Successfully'}</>
            ) : (
                <>
                  {isAr ? 'تأكيد الحجز عبر واتساب' : 'Confirm via WhatsApp'}
                  <Send size={20} className="rtl:-scale-x-100 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}