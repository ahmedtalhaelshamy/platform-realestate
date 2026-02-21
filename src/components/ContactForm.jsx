'use client';

import { useState } from 'react';
import { 
  Send, User, Phone, MessageSquare, MapPin, 
  ExternalLink, Sun, Moon, Clock, ShieldCheck, Loader2 
} from 'lucide-react';
import { CONTACT_INFO } from '../components/constants/contact'; 

/**
 * 📱 PhoneNumberDisplay - Component لإظهار الرقم بتنسيق جمالي
 * تم التأمين ضد أي قيم فارغة لمنع الـ Crash
 */
const PhoneNumberDisplay = () => {
  const rawNumber = (CONTACT_INFO.phone || "").toString();
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
    
    // محاكاة معالجة بسيطة قبل التوجيه لتعزيز المصداقية
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-50 relative overflow-hidden group" role="region" aria-labelledby="form-title">
      
      {/* 🎨 Premium Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C02026]/5 rounded-full blur-3xl -z-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>

      <header className="text-center mb-10 space-y-3">
        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#C02026] mb-4 shadow-inner">
            <ShieldCheck size={32} strokeWidth={1.5} />
        </div>
        <h2 id="form-title" className="text-3xl md:text-4xl font-black text-slate-950 italic uppercase tracking-tighter leading-none">
            {isAr ? 'حجز موعد' : 'Book a Call'}<span className="text-[#C02026]">.</span>
        </h2>
        <p className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
            {isAr 
            ? 'ابدأ رحلة استثمارك العقاري اليوم بتأكيد موعدك.' 
            : 'Initiate your investment journey by securing a slot.'}
        </p>
      </header>

      {/* Quick Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <a 
          href={`tel:${(CONTACT_INFO.phone || "").replace(/\s/g, '')}`} 
          className="flex flex-col items-center bg-slate-50 hover:bg-white p-5 rounded-[2rem] border border-transparent hover:border-[#C02026]/20 transition-all duration-500 shadow-sm hover:shadow-xl group/card"
        >
            <span className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-[0.3em] group-hover/card:text-[#C02026] transition-colors">
                {isAr ? 'اتصال مباشر' : 'Direct Call'}
            </span>
            <div className="text-slate-900 flex items-center gap-3">
                <Phone size={18} className="text-[#C02026]" />
                <PhoneNumberDisplay /> 
            </div>
        </a>

        <a 
          href={CONTACT_INFO.googleMapsUrl} 
          target="_blank" rel="noopener noreferrer" 
          className="flex flex-col items-center bg-slate-50 hover:bg-white p-5 rounded-[2rem] border border-transparent hover:border-[#C02026]/20 transition-all duration-500 shadow-sm hover:shadow-xl group/card"
        >
            <span className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-[0.3em] group-hover/card:text-[#C02026] transition-colors flex items-center gap-2">
                {isAr ? 'المقر الرئيسي' : 'Visit HQ'} <ExternalLink size={10} />
            </span>
            <div className="text-slate-900 flex items-center gap-3 text-xs font-black italic uppercase truncate max-w-full">
                <MapPin size={18} className="text-[#C02026] shrink-0" />
                <span className="truncate">{isAr ? CONTACT_INFO.addressAr : CONTACT_INFO.addressEn}</span>
            </div>
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-start relative z-10">
        
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="full-name" className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
            <User size={14} className="text-[#C02026]" /> {isAr ? 'الاسم بالكامل' : 'Full Name'}
          </label>
          <input 
            id="full-name" type="text" name="name" required 
            value={formData.name} onChange={handleChange} 
            placeholder={isAr ? 'أدخل اسمك بالكامل...' : 'Your name...'} 
            className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#C02026] focus:bg-white transition-all outline-none font-bold italic text-slate-950" 
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
            <label htmlFor="phone-number" className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
              <Phone size={14} className="text-[#C02026]" /> {isAr ? 'رقم التواصل' : 'Contact Number'}
            </label>
            <input 
              id="phone-number" type="tel" name="phone" required 
              value={formData.phone} onChange={handleChange} 
              placeholder="+20 1..." dir="ltr" 
              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#C02026] focus:bg-white transition-all outline-none font-mono font-bold text-slate-950" 
            />
        </div>

        {/* Preferred Time Hub */}
        <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-2 flex items-center gap-2">
               <Clock size={14} className="text-[#C02026]" /> {isAr ? 'الوقت المفضل للاتصال' : 'Preferred Callback Time'}
            </label>
            <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Preferred time">
                {[
                    { id: 'صباحاً', en: 'Morning', icon: <Sun size={16} /> },
                    { id: 'مساءً', en: 'Evening', icon: <Moon size={16} /> },
                    { id: 'أي وقت', en: 'Any time', icon: <Clock size={16} /> }
                ].map((option) => {
                    const isSelected = formData.preferredTime === (isAr ? option.id : option.en);
                    return (
                        <button
                            key={option.id} type="button"
                            onClick={() => setTime(isAr ? option.id : option.en)}
                            aria-pressed={isSelected}
                            className={`flex flex-col items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all duration-500 active:scale-95 ${
                                isSelected
                                ? 'bg-[#C02026] border-[#C02026] text-white shadow-[0_15px_30px_-10px_rgba(192,32,38,0.4)] scale-105'
                                : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'
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
            <MessageSquare size={14} className="text-[#C02026]" /> {isAr ? 'رسالة إضافية' : 'Extra Intel'}
          </label>
          <textarea 
            id="message-input" name="message" rows="3" 
            value={formData.message} onChange={handleChange} 
            placeholder={isAr ? 'مهتم بمشروع معين؟ أخبرنا هنا...' : 'Interested in a specific compound?'} 
            className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#C02026] focus:bg-white transition-all outline-none font-bold italic text-slate-950 resize-none"
          ></textarea>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          disabled={status !== 'idle'}
          className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 flex items-center justify-center gap-4 mt-8 group active:scale-95 ${
            status === 'success' ? 'bg-green-600 text-white' : 'bg-[#121621] hover:bg-[#C02026] text-white'
          }`}
        >
          {status === 'loading' ? (
              <> <Loader2 size={20} className="animate-spin" /> {isAr ? 'جاري التحضير...' : 'Processing...'}</>
          ) : status === 'success' ? (
              <> {isAr ? 'تم التوجيه بنجاح' : 'Redirected Successfully'}</>
          ) : (
              <>
                {isAr ? 'تأكيد الحجز عبر واتساب' : 'Confirm via WhatsApp'}
                <Send size={20} className={`${isAr ? 'rotate-180' : ''} group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform`} />
              </>
          )}
        </button>
      </form>
    </div>
  );
}