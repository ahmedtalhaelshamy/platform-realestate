'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🟢 WhatsAppBtn - 2026 Premium Floating Action Button
 * تم التحسين لضمان التمركز الدقيق للـ Tooltip وتوافق الـ Hydration.
 */
export default function WhatsAppBtn({ lang, phoneNumber }) {
  const isAr = lang === 'ar';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🛠️ ذكاء اختيار الرقم: Sanity أولاً ثم الثوابت
  const rawNumber = phoneNumber || CONTACT_INFO.whatsapp;
  const cleanedNumber = rawNumber?.toString().replace(/\D/g, '');

  const defaultMessage = isAr 
    ? 'مرحباً، أريد الاستفسار عن تفاصيل الاستثمار العقاري والوحدات المتاحة.' 
    : 'Hello, I would like to inquire about real estate investment details and available units.';
  
  const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(defaultMessage)}`;

  // حماية الـ Hydration
  if (!mounted) return null;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank"
      rel="noopener noreferrer"
      // ✅ تم ضبط التموضع المنطقي ليعمل في الجهتين بذكاء
      className={`
        fixed bottom-8 end-6 md:bottom-10 md:end-10 z-[9999] w-14 h-14 md:w-16 md:h-16 
        bg-[#25D366] text-white rounded-full 
        flex items-center justify-center 
        shadow-[0_15px_30px_-5px_rgba(37,211,102,0.4)] 
        hover:bg-[#20bd5a] hover:scale-110 hover:-translate-y-2 
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        group outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50
      `}
      aria-label={isAr ? "تواصل معنا عبر واتساب" : "Contact via WhatsApp"}
    >
      <MessageCircle 
        size={32} 
        strokeWidth={2.2} 
        className="group-hover:rotate-12 transition-transform duration-300"
      />
      
      {/* 📡 تأثير النبض الاحترافي لجذب الانتباه */}
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-[ping_2s_ease-in-out_infinite] opacity-40 pointer-events-none"></span>
      
      {/* تأثير الهوفر البصري */}
      <span className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>

      {/* 💬 Tooltip - تم ضبط التمركز ليكون مسطرة */}
      <span className={`
        absolute bottom-full mb-5 px-5 py-2.5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl
        opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap
        start-1/2 -translate-x-1/2 shadow-2xl
      `}>
        {isAr ? 'تحدث مع مستشارك' : 'Chat with advisor'}
        {/* سهم التولتيب */}
        <span className="absolute top-full start-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-950"></span>
      </span>
    </a>
  );
}