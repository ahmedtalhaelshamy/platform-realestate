'use client';

import { useState } from 'react';
import { Send, User, Phone, Mail, MessageSquare, MapPin, ExternalLink, Sun, Moon, Clock } from 'lucide-react';

// ✅ المصدر الوحيد للحقيقة
import { CONTACT_INFO } from '../components/constants/contact'; 

const PhoneNumberDisplay = () => {
  const rawNumber = CONTACT_INFO.phone;
  const formattedNumber = rawNumber.replace(/(\+20)(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  
  return (
    <div dir="ltr" className="font-sans font-bold text-lg text-slate-800 flex items-center gap-1 justify-center">
      {formattedNumber}
    </div>
  );
};

export default function ContactForm({ isAr }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredTime: isAr ? 'أي وقت' : 'Any time' // إضافة حقل الوقت المفضل
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // دالة لتغيير الوقت المفضل
  const setTime = (time) => {
    setFormData(prev => ({ ...prev, preferredTime: time }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. تجهيز نص الرسالة وتنسيقه للواتساب ليشمل الوقت المفضل
    const text = isAr 
      ? `*طلب حجز موعد جديد:*%0a-----------------------%0a👤 *الاسم:* ${formData.name}%0a📱 *الهاتف:* ${formData.phone}%0a⏰ *الوقت المفضل:* ${formData.preferredTime}%0a📧 *الإيميل:* ${formData.email || 'غير متوفر'}%0a📝 *الرسالة:* ${formData.message}`
      : `*New Booking Request:*%0a-----------------------%0a👤 *Name:* ${formData.name}%0a📱 *Phone:* ${formData.phone}%0a⏰ *Preferred Time:* ${formData.preferredTime}%0a📧 *Email:* ${formData.email || 'N/A'}%0a📝 *Message:* ${formData.message}`;

    // ✅ 2. استخدام رقم الواتساب المخصص
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\+/g, '')}?text=${text}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#C02026]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <header className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
            {isAr ? 'حجز موعد' : 'Book an Appointment'}
        </h3>
        <p className="text-gray-500 font-medium text-sm md:text-base max-w-xs mx-auto leading-relaxed">
            {isAr 
            ? 'املأ بياناتك وسيتم توجيهك لتأكيد الحجز عبر الواتساب.' 
            : 'Fill in your details to confirm your booking via WhatsApp.'}
        </p>
      </header>

      {/* منطقة التواصل السريع كما هي */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <a href={`tel:${CONTACT_INFO.phone}`} className="block bg-slate-50 hover:bg-green-50 p-4 rounded-2xl border border-slate-100 hover:border-[#25D366] transition-all duration-300 group text-center no-underline">
            <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest group-hover:text-green-600 transition-colors">
                {isAr ? 'اتصال مباشر' : 'Direct Call'}
            </p>
            <div className="text-slate-800 group-hover:text-[#25D366] transition-colors flex justify-center items-center gap-2">
                <Phone size={20} className="shrink-0" />
                <PhoneNumberDisplay /> 
            </div>
        </a>
        <a href={CONTACT_INFO.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block bg-slate-50 hover:bg-red-50 p-4 rounded-2xl border border-slate-100 hover:border-[#C02026] transition-all duration-300 group text-center no-underline relative overflow-hidden">
            <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest group-hover:text-[#C02026] transition-colors flex items-center justify-center gap-1">
                {isAr ? 'زيارة الفرع' : 'Visit HQ'} <ExternalLink size={10} />
            </p>
            <div className="text-slate-800 group-hover:text-[#C02026] transition-colors flex justify-center items-center gap-2 text-xs md:text-sm font-bold">
                <MapPin size={18} className="shrink-0" />
                <span className="line-clamp-1">{isAr ? CONTACT_INFO.addressAr : CONTACT_INFO.addressEn}</span>
            </div>
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide px-1">
            <User size={14} /> {isAr ? 'الاسم بالكامل' : 'Full Name'}
          </label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder={isAr ? 'مثال: أحمد محمد' : 'Ex: John Doe'} className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#C02026] focus:bg-white transition-all outline-none font-medium" />
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide px-1">
              <Phone size={14} /> {isAr ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+20..." dir="ltr" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#C02026] focus:bg-white transition-all outline-none font-medium text-left" />
        </div>

        {/* ✅ إضافة اختيار الوقت المفضل (صباحاً/مساءً/أي وقت) */}
        <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide px-1">
               <Clock size={14} /> {isAr ? 'الوقت المفضل للاتصال' : 'Preferred Calling Time'}
            </label>
            <div className="grid grid-cols-3 gap-3">
                {[
                    { id: 'صباحاً', en: 'Morning', icon: <Sun size={14} /> },
                    { id: 'مساءً', en: 'Evening', icon: <Moon size={14} /> },
                    { id: 'أي وقت', en: 'Any time', icon: <Clock size={14} /> }
                ].map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => setTime(isAr ? option.id : option.en)}
                        className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 ${
                            formData.preferredTime === (isAr ? option.id : option.en)
                            ? 'bg-[#C02026] border-[#C02026] text-white shadow-md'
                            : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-300'
                        }`}
                    >
                        {option.icon}
                        <span className="text-[10px] font-bold">{isAr ? option.id : option.en}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide px-1">
            <MessageSquare size={14} /> {isAr ? 'رسالة اختيارية' : 'Optional Message'}
          </label>
          <textarea name="message" rows="3" value={formData.message} onChange={handleChange} placeholder={isAr ? 'أنا مهتم بمشروع...' : 'I am interested in...'} className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#C02026] focus:bg-white transition-all outline-none font-medium resize-none"></textarea>
        </div>

        {/* زر الإرسال المعدل */}
        <button
          type="submit"
          className="w-full py-4 bg-slate-900 hover:bg-[#C02026] text-white rounded-xl font-black text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 mt-6 group"
        >
          {isAr ? 'تأكيد الحجز' : 'Confirm Booking'}
          <Send size={20} className={`${isAr ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
        </button>
      </form>
    </div>
  );
}