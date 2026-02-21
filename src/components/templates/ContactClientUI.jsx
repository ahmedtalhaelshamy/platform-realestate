'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  ArrowRight, ArrowUpRight, MapPin, Phone, 
  Loader2, CheckCircle, Globe, Clock, 
  MessageCircle, Sun, Moon, User, ShieldCheck
} from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🛠️ دالة الأمان لمنع خطأ الـ Objects كأبناء لـ React
 * تضمن استقرار المكون حتى لو كانت البيانات من Sanity غير منتظمة
 */
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  
  if (Array.isArray(val)) {
    return val
      .map(block => {
        if (typeof block === 'string') return block;
        if (block.children) return block.children.map(child => child.text || "").join('');
        return "";
      })
      .join(' ');
  }
  
  if (typeof val === 'object' && val.children) {
    return val.children.map(child => child.text || "").join('');
  }
  
  return "";
};

const PhoneNumberDisplay = ({ number }) => {
  // تنسيق الرقم للعرض الجمالي: +20 100 401 1040
  const formattedNumber = number.replace(/(\+20)(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  return (
    <span dir="ltr" className="font-sans font-bold text-lg text-slate-800 flex items-center gap-1 justify-center">
      {formattedNumber}
    </span>
  );
};

export default function ContactClientUI({ settings, isAr }) {
  const [formStatus, setFormStatus] = useState('idle');
  const [preferredTime, setPreferredTime] = useState('any'); 
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  // ✅ جلب البيانات وتأمينها باستخدام getSafeText
  const data = {
    phone: getSafeText(settings?.phone || CONTACT_INFO.phone),
    whatsapp: getSafeText(settings?.whatsapp || CONTACT_INFO.whatsapp),
    email: getSafeText(settings?.email || CONTACT_INFO.email),
    address: isAr 
      ? getSafeText(settings?.addressAr || CONTACT_INFO.addressAr) 
      : getSafeText(settings?.addressEn || CONTACT_INFO.addressEn),
    mapLocation: settings?.googleMapsUrl || CONTACT_INFO.googleMapsUrl
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    const timeLabels = {
      morning: isAr ? 'صباحاً' : 'Morning',
      evening: isAr ? 'مساءً' : 'Evening',
      any: isAr ? 'أي وقت' : 'Any time'
    };

    const text = isAr 
      ? `*طلب حجز موعد جديد*%0A-----------------------%0A👤 *الاسم:* ${formData.name}%0a📱 *الهاتف:* ${formData.phone}%0a⏰ *الوقت المفضل:* ${timeLabels[preferredTime]}%0a📝 *الرسالة:* ${formData.message || 'لا يوجد'}%0a-----------------------`
      : `*New Booking Request*%0A-----------------------%0a👤 *Name:* ${formData.name}%0a📱 *Phone:* ${formData.phone}%0a⏰ *Preferred Time:* ${timeLabels[preferredTime]}%0a📝 *Message:* ${formData.message || 'N/A'}%0a-----------------------`;

    const whatsappNumber = data.whatsapp.replace(/\D/g, ''); 
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    // تجربة مستخدم احترافية: محاكاة معالجة البيانات قبل فتح واتساب
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setFormStatus('success');
      setTimeout(() => {
        setFormStatus('idle');
        setFormData({ name: '', phone: '', message: '' }); 
      }, 4000);
    }, 1200);
  };

  return (
    <main className="relative w-full text-slate-900 font-sans selection:bg-[#C02026] selection:text-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🎨 خلفيات بريميوم متدرجة */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-red-50/50 rounded-full blur-[120px] opacity-40 animate-pulse" />
         <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-slate-100 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8 lg:py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* ℹ️ الجانب الأيسر: معلومات الاتصال */}
          <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-32 text-start">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  {isAr ? 'مستشارونا متاحون الآن' : 'Experts Online Now'}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-slate-950 italic uppercase">
                {isAr ? 'استثمارك' : 'Your Vision,'} <br />
                <span className="text-[#C02026]">
                  {isAr ? 'يستحق الأفضل.' : 'Our Mission.'}
                </span>
              </h1>

              <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed max-w-md border-s-8 border-[#C02026] ps-8 italic">
                {isAr 
                  ? 'نحن لا نبيع العقارات، نحن نؤمن مستقبلك. تواصل مع نخبة الخبراء للحصول على عرض حصري.' 
                  : 'We don’t just list properties; we secure your legacy. Connect with elite advisors for a bespoke offer.'}
              </p>
            </div>

            <div className="space-y-5 pt-4">
               <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href={`tel:${data.phone.replace(/\s/g, '')}`} 
                    className="flex-1 bg-white text-slate-900 border border-slate-100 h-24 rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-[#C02026] hover:text-white transition-all duration-500 shadow-2xl shadow-slate-200/50 group active:scale-95"
                  >
                     <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                        <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                     </div>
                     <span className="text-xl italic uppercase">{isAr ? 'اتصال' : 'Call'}</span>
                  </a>

                  <a 
                    href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-white text-slate-900 border border-slate-100 h-24 rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-[#25D366] hover:text-white transition-all duration-500 shadow-2xl shadow-slate-200/50 group active:scale-95"
                  >
                     <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                        <MessageCircle size={24} />
                     </div>
                     <span className="text-xl italic uppercase">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                  </a>
               </div>
               
               <a 
                 href={data.mapLocation} 
                 target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-50 shadow-xl hover:shadow-2xl transition-all group active:scale-[0.99]"
               >
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-[#C02026]/5 text-[#C02026] flex items-center justify-center shadow-inner">
                        <MapPin size={24} />
                     </div>
                     <div className="text-start">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</p>
                        <span className="text-sm md:text-base font-black text-slate-900 italic uppercase">{data.address}</span>
                     </div>
                  </div>
                  <ArrowUpRight size={20} className="text-slate-300 group-hover:text-[#C02026] transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
               </a>
            </div>
          </div>

          {/* 📝 الجانب الأيمن: نموذج حجز المواعيد */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-50 p-10 md:p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C02026]/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
              
              <div className="flex justify-between items-start mb-12 text-start relative z-10">
                  <div className="space-y-2">
                    <h2 id="form-heading" className="text-3xl md:text-5xl font-black text-slate-950 italic uppercase tracking-tighter leading-none">{isAr ? 'احجز موعدك' : 'Book a Call'}</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{isAr ? 'دعنا نبدأ رحلة استثمارك اليوم' : 'Initiate your investment journey'}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-3xl shadow-inner text-[#C02026]">
                    <ShieldCheck size={32} strokeWidth={1.5} />
                  </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10 text-start relative z-10" aria-labelledby="form-heading">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="name-field" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] ps-2 flex items-center gap-2">
                      <User size={14} className="text-[#C02026]" /> {isAr ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <input 
                      id="name-field"
                      required 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-6 py-5 text-slate-950 focus:border-[#C02026] focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-bold italic" 
                      placeholder={isAr ? 'أدخل اسمك هنا...' : 'Your name...'} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="phone-field" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] ps-2 flex items-center gap-2">
                      <Phone size={14} className="text-[#C02026]" /> {isAr ? 'رقم الهاتف' : 'Contact Number'}
                    </label>
                    <input 
                      id="phone-field"
                      required 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-6 py-5 text-slate-950 focus:border-[#C02026] focus:bg-white focus:outline-none transition-all dir-ltr font-mono font-bold" 
                      placeholder="+20 1..." 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] ps-2">{isAr ? 'متى نواصل معك؟' : 'Preferred Callback Time'}</label>
                   <div className="grid grid-cols-3 gap-4" role="radiogroup" aria-label="Preferred time">
                     {[
                       { id: 'morning', icon: <Sun size={18}/>, ar: 'صباحاً', en: 'Morning' },
                       { id: 'evening', icon: <Moon size={18}/>, ar: 'مساءً', en: 'Evening' },
                       { id: 'any', icon: <Clock size={18}/>, ar: 'أي وقت', en: 'Any time' }
                     ].map((time) => (
                       <button 
                         key={time.id}
                         type="button" 
                         onClick={() => setPreferredTime(time.id)} 
                         aria-pressed={preferredTime === time.id}
                         className={`py-4 md:py-6 rounded-[1.5rem] border-2 flex flex-col items-center justify-center gap-3 transition-all duration-500 active:scale-95 ${
                           preferredTime === time.id 
                           ? 'border-[#C02026] bg-[#C02026] text-white shadow-[0_20px_40px_-10px_rgba(192,32,38,0.3)] scale-105' 
                           : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                         }`}
                       >
                          {time.icon}
                          <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? time.ar : time.en}</span>
                       </button>
                     ))}
                   </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="msg-field" className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] ps-2">{isAr ? 'ملاحظات إضافية' : 'Extra Intel'}</label>
                    <textarea 
                      id="msg-field"
                      rows={3} 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-6 py-5 text-slate-950 focus:border-[#C02026] focus:bg-white focus:outline-none transition-all resize-none font-bold italic" 
                      placeholder={isAr ? 'مهتم بمشروع معين؟ أخبرنا هنا...' : 'Interested in a specific compound?'}
                    />
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus !== 'idle'}
                  className={`w-full py-7 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl active:scale-95 hover:-translate-y-1 ${
                    formStatus === 'success' ? 'bg-green-600 text-white' : 'bg-[#0F1115] text-white hover:bg-[#C02026]'
                  }`}
                >
                  {formStatus === 'submitting' ? (
                    <> <Loader2 className="animate-spin" size={22} /> {isAr ? 'جاري تأمين اتصالك...' : 'Securing Connection...'} </>
                  ) : formStatus === 'success' ? (
                    <> <CheckCircle size={22} /> {isAr ? 'تم إرسال طلبك بنجاح' : 'Request Sent Successfully'} </>
                  ) : (
                    <> {isAr ? 'تأكيد الحجز عبر واتساب' : 'Confirm via WhatsApp'} <ArrowRight size={22} className={isAr ? 'rotate-180' : ''}/> </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}} />
    </main>
  );
}