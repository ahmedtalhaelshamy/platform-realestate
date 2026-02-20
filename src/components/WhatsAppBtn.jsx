'use client';

import { MessageCircle } from 'lucide-react';
// ✅ استيراد الثوابت
import { CONTACT_INFO } from '../components/constants/contact';

export default function WhatsAppBtn({ lang }) {
  const isAr = lang === 'ar';

  // 🛠️ تنظيف الرقم من أي مسافات أو رموز لضمان عمل الرابط 100%
  const cleanedNumber = CONTACT_INFO.whatsapp.replace(/\D/g, '');

  return (
    <a 
      // ✅ استخدام الرقم المنظف
      href={`https://wa.me/${cleanedNumber}`} 
      target="_blank"
      // ✅ حماية الخصوصية والسيو
      rel="noopener noreferrer"
      // ✅ المفتاح السحري لرفع نتيجة الـ Accessibility في Lighthouse
      aria-label={isAr ? "تواصل معنا عبر واتساب" : "Contact us on WhatsApp"}
      className={`
        fixed bottom-6 z-[999] w-14 h-14 
        bg-[#25D366] text-white rounded-full 
        flex items-center justify-center 
        shadow-[0_4px_14px_rgba(37,211,102,0.4)] 
        hover:bg-[#20bd5a] hover:scale-110 hover:-translate-y-1 
        transition-all duration-300 ease-out
        ${isAr ? 'left-5 md:left-8' : 'right-5 md:right-8'}
      `}
    >
      <MessageCircle size={30} strokeWidth={2.5} />
      
      {/* تأثير نبض (Pulse) - ممتاز لجذب الانتباه */}
      <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-75 pointer-events-none"></span>
    </a>
  );
}