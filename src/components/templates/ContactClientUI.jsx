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

export default function ContactClientUI({ settings, isAr }) {
  const [formStatus, setFormStatus] = useState('idle');
  const [preferredTime, setPreferredTime] = useState('any'); 
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  // ✅ جلب البيانات وتأمينها
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
    <main className={`relative w-full overflow-hidden bg-white selection:bg-brand-red selection:text-white ${isAr ? 'font-almarai' : 'font-jakarta'}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🎨 Premium Background Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 start-0 w-[50vw] h-[50vw] bg-brand-red/5 rounded-full blur-[120px] opacity-40 animate-pulse" />
         <div className="absolute bottom-0 end-0 w-[40vw] h-[40vw] bg-brand-gray-50 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-12 lg:py-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* ℹ️ الجانب الأيسر: معلومات الاتصال */}
          <div className="lg:col-span-5 space-y-14 lg:sticky lg:top-32 text-start">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  {isAr ? 'مستشارونا متاحون الآن' : 'Experts Online Now'}
                </span>
              </div>
              
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] text-brand-dark uppercase ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>
                {isAr ? 'استثمارك' : 'Your Vision,'} <br />
                <span className="text-brand-red not-italic">
                  {isAr ? 'يستحق الأفضل.' : 'Our Mission.'}
                </span>
              </h1>

              <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-md border-s-8 border-brand-red ps-8 font-medium italic">
                {isAr 
                  ? 'نحن لا نبيع العقارات، نحن نؤمن مستقبلك. تواصل مع نخبة الخبراء للحصول على عرض حصري.' 
                  : 'We don’t just list properties; we secure your legacy. Connect with elite advisors for a bespoke offer.'}
              </p>
            </div>

            <div className="space-y-6">
               <div className="flex flex-col sm:flex-row gap-5">
                  <a 
                    href={`tel:${data.phone.replace(/\s/g, '')}`} 
                    className="flex-1 bg-white text-brand-dark border border-slate-100 h-28 rounded-[2.5rem] font-black flex items-center justify-center gap-4 hover:bg-brand-red hover:text-white transition-all duration-500 shadow-premium group active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-brand-red/20"
                  >
                     <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-white/20 flex items-center justify-center transition-colors shadow-inner">
                        <Phone size={26} className="group-hover:rotate-12 transition-transform" />
                     </div>
                     <span className="text-xl uppercase tracking-tight">{isAr ? 'اتصال' : 'Call'}</span>
                  </a>

                  <a 
                    href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 bg-white text-brand-dark border border-slate-100 h-28 rounded-[2.5rem] font-black flex items-center justify-center gap-4 hover:bg-[#25D366] hover:text-white transition-all duration-500 shadow-premium group active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-green-500/20"
                  >
                     <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 group-hover:bg-white/20 flex items-center justify-center transition-colors shadow-inner">
                        <MessageCircle size={26} />
                     </div>
                     <span className="text-xl uppercase tracking-tight">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                  </a>
               </div>
               
               <a 
                 href={data.mapLocation} 
                 target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-between p-6 md:p-8 rounded-[2.5rem] bg-white border border-slate-50 shadow-premium hover:shadow-2xl transition-all group active:scale-[0.99] outline-none focus-visible:ring-4 focus-visible:ring-brand-red/10"
               >
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-3xl bg-brand-red/5 text-brand-red flex items-center justify-center shadow-inner">
                        <MapPin size={28} />
                     </div>
                     <div className="text-start">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</p>
                        <span className="text-sm md:text-lg font-black text-brand-dark uppercase tracking-tight line-clamp-1">{data.address}</span>
                     </div>
                  </div>
                  <ArrowUpRight size={24} className="text-slate-300 group-hover:text-brand-red transition-all transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:-translate-y-1" />
               </a>
            </div>
          </div>

          {/* 📝 الجانب الأيمن: نموذج حجز المواعيد */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-100 p-8 md:p-16 rounded-[4rem] shadow-premium relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl -me-40 -mt-40 transition-transform duration-1000 group-hover:scale-150" />
              
              <div className="flex justify-between items-start mb-16 text-start relative z-10">
                  <div className="space-y-3">
                    <h2 id="form-heading" className={`text-3xl md:text-5xl font-black text-brand-dark uppercase leading-none ${isAr ? 'tracking-tight' : 'italic tracking-tighter'}`}>{isAr ? 'احجز موعدك' : 'Book a Call'}</h2>
                    <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">{isAr ? 'دعنا نبدأ رحلة استثمارك اليوم' : 'Initiate your investment journey'}</p>
                  </div>
                  <div className="bg-brand-gray-50 p-5 rounded-[2rem] shadow-inner text-brand-red">
                    <ShieldCheck size={36} strokeWidth={1.5} aria-hidden="true" />
                  </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12 text-start relative z-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label htmlFor="name-field" className="text-[11px] font-black text-brand-dark uppercase tracking-widest ps-2 flex items-center gap-2">
                      <User size={14} className="text-brand-red" /> {isAr ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <input 
                      id="name-field"
                      required 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-brand-gray-50 border-2 border-transparent rounded-2xl px-6 py-5 text-brand-dark font-bold text-lg focus:border-brand-red focus:bg-white focus:outline-none transition-all placeholder:text-slate-300" 
                      placeholder={isAr ? 'أدخل اسمك هنا...' : 'Your name...'} 
                    />
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="phone-field" className="text-[11px] font-black text-brand-dark uppercase tracking-widest ps-2 flex items-center gap-2">
                      <Phone size={14} className="text-brand-red" /> {isAr ? 'رقم الهاتف' : 'Contact Number'}
                    </label>
                    <input 
                      id="phone-field"
                      required 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-brand-gray-50 border-2 border-transparent rounded-2xl px-6 py-5 text-brand-dark font-black text-lg focus:border-brand-red focus:bg-white focus:outline-none transition-all dir-ltr font-mono" 
                      placeholder="+20 1..." 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                   <label className="text-[11px] font-black text-brand-dark uppercase tracking-widest ps-2">{isAr ? 'متى نواصل معك؟' : 'Preferred Callback Time'}</label>
                   <div className="grid grid-cols-3 gap-4" role="radiogroup">
                     {[
                       { id: 'morning', icon: <Sun size={20}/>, ar: 'صباحاً', en: 'Morning' },
                       { id: 'evening', icon: <Moon size={20}/>, ar: 'مساءً', en: 'Evening' },
                       { id: 'any', icon: <Clock size={20}/>, ar: 'أي وقت', en: 'Any time' }
                     ].map((time) => (
                       <button 
                         key={time.id}
                         type="button" 
                         onClick={() => setPreferredTime(time.id)} 
                         aria-pressed={preferredTime === time.id}
                         className={`py-5 md:py-8 rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-500 active:scale-95 outline-none ${
                           preferredTime === time.id 
                           ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105' 
                           : 'border-brand-gray-50 bg-brand-gray-50 text-slate-400 hover:border-slate-200 hover:text-brand-dark'
                         }`}
                       >
                          {time.icon}
                          <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? time.ar : time.en}</span>
                       </button>
                     ))}
                   </div>
                </div>

                <div className="space-y-4">
                    <label htmlFor="msg-field" className="text-[11px] font-black text-brand-dark uppercase tracking-widest ps-2">{isAr ? 'ملاحظات إضافية' : 'Extra Intel'}</label>
                    <textarea 
                      id="msg-field"
                      rows={3} 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-brand-gray-50 border-2 border-transparent rounded-2xl px-6 py-5 text-brand-dark font-bold text-lg focus:border-brand-red focus:bg-white focus:outline-none transition-all resize-none" 
                      placeholder={isAr ? 'مهتم بمشروع معين؟ أخبرنا هنا...' : 'Interested in a specific compound?'}
                    />
                </div>

                <div aria-live="polite">
                  <button 
                    type="submit" 
                    disabled={formStatus !== 'idle'}
                    className={`w-full py-8 rounded-[2.5rem] font-black text-sm md:text-base uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl active:scale-95 hover:-translate-y-1 outline-none ${
                      formStatus === 'success' ? 'bg-green-600 text-white' : 'bg-brand-dark text-white hover:bg-brand-red'
                    }`}
                  >
                    {formStatus === 'submitting' ? (
                      <> <Loader2 className="animate-spin" size={24} /> {isAr ? 'جاري تأمين اتصالك...' : 'Securing Connection...'} </>
                    ) : formStatus === 'success' ? (
                      <> <CheckCircle size={24} /> {isAr ? 'تم إرسال طلبك بنجاح' : 'Request Sent Successfully'} </>
                    ) : (
                      <> 
                        {isAr ? 'تأكيد الحجز عبر واتساب' : 'Confirm via WhatsApp'} 
                        <ArrowRight size={24} className={`transition-transform duration-500 ${isAr ? 'rotate-180' : ''}`}/> 
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
        .dir-ltr { direction: ltr !important; text-align: left !important; }
        [dir="rtl"] .dir-ltr { text-align: right !important; }
      `}} />
    </main>
  );
}