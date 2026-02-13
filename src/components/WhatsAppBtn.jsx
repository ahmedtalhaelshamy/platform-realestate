'use client';

import { MessageCircle } from 'lucide-react';
// ✅ استيراد الثوابت (Single Source of Truth)
import { CONTACT_INFO } from '../components/constants/contact';

export default function WhatsAppBtn({ lang }) {
  const isAr = lang === 'ar';

  return (
    <a 
      // ✅ استخدام الرقم من ملف الثوابت ديناميكياً
      href={`https://wa.me/${CONTACT_INFO.whatsapp}`} 
      target="_blank"
      // ✅ إضافة attributes للأمان والـ SEO عند فتح روابط خارجية
      rel="noopener noreferrer"
      aria-label={isAr ? "تواصل معنا عبر واتساب" : "Chat with us on WhatsApp"}
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
      
      {/* تأثير نبض (Pulse) لجذب الانتباه - UX Enhancement */}
      <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-75"></span>
    </a>
  );
}