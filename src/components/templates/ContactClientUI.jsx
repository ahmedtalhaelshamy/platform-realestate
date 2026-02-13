'use client';

import { useState } from 'react';
import { 
  ArrowRight, ArrowUpRight, MapPin, Phone, Mail, 
  Send, Loader2, CheckCircle, Globe, Clock, 
  MessageCircle, Sun, Moon, User
} from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

export default function ContactClientUI({ settings, isAr }) {
  const [formStatus, setFormStatus] = useState('idle');
  const [preferredTime, setPreferredTime] = useState('any'); 
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const data = {
    phone: settings?.phone || CONTACT_INFO.phone,
    whatsapp: settings?.whatsapp || CONTACT_INFO.whatsapp,
    email: settings?.email || CONTACT_INFO.email,
    address: isAr 
      ? (settings?.addressAr || CONTACT_INFO.addressAr) 
      : (settings?.addressEn || CONTACT_INFO.addressEn),
    mapLocation: settings?.mapLocation || "New Cairo, Egypt"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    // تجهيز نص رسالة الواتساب
    const timeLabels = {
      morning: isAr ? 'صباحاً' : 'Morning',
      evening: isAr ? 'مساءً' : 'Evening',
      any: isAr ? 'أي وقت' : 'Any time'
    };

    const text = isAr 
      ? `*طلب حجز موعد جديد*%0A-----------------------%0A👤 *الاسم:* ${formData.name}%0a📱 *الهاتف:* ${formData.phone}%0a⏰ *الوقت المفضل:* ${timeLabels[preferredTime]}%0a📝 *الرسالة:* ${formData.message || 'لا يوجد'}%0a-----------------------`
      : `*New Booking Request*%0A-----------------------%0a👤 *Name:* ${formData.name}%0a📱 *Phone:* ${formData.phone}%0a⏰ *Preferred Time:* ${timeLabels[preferredTime]}%0a📝 *Message:* ${formData.message || 'N/A'}%0a-----------------------`;

    // تنظيف رقم الواتساب وفتح الرابط
    const whatsappNumber = data.whatsapp.replace(/\+/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 4000);
    }, 1000);
  };

  return (
    // ✅ خلفية فاتحة شفافة لتندمج مع الصفحة الأب
    <div className="relative w-full text-slate-900 font-sans selection:bg-[#C02026] selection:text-white" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* الخلفية الزخرفية (فاتحة جداً) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-blue-50 rounded-full blur-[100px] opacity-60" />
         <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-red-50 rounded-full blur-[100px] opacity-60" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8 lg:py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* =======================
              LEFT: INFO (Dark Text on Light)
              ======================= */}
          <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-32">
            
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                  {isAr ? 'متاحون الآن' : 'Online Now'}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-slate-900">
                {isAr ? 'استثمارك' : 'Your Vision,'} <br />
                <span className="text-[#C02026]">
                  {isAr ? 'يستحق الأفضل.' : 'Our Mission.'}
                </span>
              </h1>

              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md border-s-4 border-[#C02026] ps-6">
                {isAr 
                  ? 'لا نبيع مجرد عقارات، نحن نصيغ مستقبلك الاستثماري. تواصل مع نخبة الخبراء في السوق المصري.' 
                  : 'We don’t just sell properties; we craft your investment future. Connect with Egypt’s elite market experts.'}
              </p>
            </div>

            {/* Contact Cards (White with Shadow) */}
            <div className="space-y-5 pt-4">
               <div className="flex flex-col sm:flex-row gap-4">
                  {/* Call Button */}
                  <a 
                    href={`tel:${data.phone}`} 
                    className="flex-1 bg-white text-slate-900 border border-slate-100 h-20 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#C02026] hover:text-white hover:border-[#C02026] transition-all duration-300 shadow-xl shadow-slate-200/50 group"
                  >
                     <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                        <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                     </div>
                     <span className="text-lg">{isAr ? 'اتصال' : 'Call'}</span>
                  </a>

                  {/* WhatsApp Button */}
                  <a 
                    href={`https://wa.me/${data.whatsapp.replace(/\+/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-white text-slate-900 border border-slate-100 h-20 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 shadow-xl shadow-slate-200/50 group"
                  >
                     <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-colors">
                        <MessageCircle size={20} />
                     </div>
                     <span className="text-lg">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                  </a>
               </div>
               
               {/* Location */}
               <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.mapLocation)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#C02026]/10 text-[#C02026] flex items-center justify-center">
                        <MapPin size={18} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</p>
                        <span className="text-sm font-bold text-slate-800">{data.address}</span>
                     </div>
                  </div>
                  <ArrowUpRight size={18} className="text-slate-400 group-hover:text-[#C02026] transition-colors" />
               </a>
            </div>

          </div>

          {/* =======================
              RIGHT: FORM (White Card)
              ======================= */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              
              {/* Form Header */}
              <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">{isAr ? 'حجز موعد' : 'Book Appointment'}</h2>
                    <p className="text-slate-500 text-sm mt-2">{isAr ? 'املأ البيانات وسنتصل بك.' : 'Fill details, we will call you.'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-full">
                    <Globe className="text-[#C02026]" size={28} />
                  </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Modern Inputs (Gray Backgrounds) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{isAr ? 'الاسم' : 'Name'}</label>
                    <input 
                      required 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:border-[#C02026] focus:bg-white focus:outline-none transition-all placeholder-slate-400 font-bold" 
                      placeholder={isAr ? 'الاسم بالكامل' : 'Full Name'} 
                    />
                  </div>
                  <div className="group space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                    <input 
                      required 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:border-[#C02026] focus:bg-white focus:outline-none transition-all dir-ltr font-mono font-bold" 
                      placeholder="+20 1xxxxxxxxx" 
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{isAr ? 'الوقت المفضل' : 'Preferred Time'}</label>
                   <div className="grid grid-cols-3 gap-3">
                      {['morning', 'evening', 'any'].map((time) => (
                        <button 
                          key={time}
                          type="button" 
                          onClick={() => setPreferredTime(time)} 
                          className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                            preferredTime === time 
                            ? 'border-[#C02026] bg-[#C02026] text-white shadow-lg shadow-[#C02026]/20' 
                            : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                           {time === 'morning' ? <Sun size={16}/> : time === 'evening' ? <Moon size={16}/> : <Clock size={16}/>}
                           <span className="text-[10px] font-bold uppercase">{isAr ? (time === 'morning' ? 'صباحاً' : time === 'evening' ? 'مساءً' : 'أي وقت') : time}</span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Message */}
                <div className="group space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{isAr ? 'رسالة (اختياري)' : 'Message (Optional)'}</label>
                    <textarea 
                      rows={3} 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:border-[#C02026] focus:bg-white focus:outline-none transition-all resize-none font-medium" 
                      placeholder="..."
                    />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={formStatus !== 'idle'}
                  className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 ${
                    formStatus === 'success' ? 'bg-green-600 text-white' : 'bg-[#0F1115] text-white hover:bg-[#C02026]'
                  }`}
                >
                  {formStatus === 'submitting' ? (
                    <> <Loader2 className="animate-spin" size={18} /> {isAr ? 'جاري الإرسال...' : 'Sending...'} </>
                  ) : formStatus === 'success' ? (
                    <> <CheckCircle size={18} /> {isAr ? 'تم بنجاح' : 'Done'} </>
                  ) : (
                    <> {isAr ? 'تأكيد الحجز عبر واتساب' : 'Confirm via WhatsApp'} <ArrowRight size={18} className={isAr ? 'rotate-180' : ''}/> </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}