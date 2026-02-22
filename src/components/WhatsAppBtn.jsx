'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
// ✅ استيراد الثوابت كمرجع افتراضي
import { CONTACT_INFO } from '@/components/constants/contact';

/**
 * 🟢 WhatsAppBtn - المكون العائم للتواصل (Smart Floating Action Button)
 * @param {string} lang - لغة الصفحة (ar/en)
 * @param {string} phoneNumber - رقم مخصص اختياري (من Sanity مثلاً)
 */
export default function WhatsAppBtn({ lang, phoneNumber }) {
  const isAr = lang === 'ar';
  const [mounted, setMounted] = useState(false);

  // تجنب أخطاء الـ Hydration عن طريق التأكد من التحميل في المتصفح أولاً
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🛠️ استخدام الرقم الممرر من Sanity أولاً، ثم العودة للثوابت إذا لم يوجد
  const rawNumber = phoneNumber || CONTACT_INFO.whatsapp;
  const cleanedNumber = rawNumber?.toString().replace(/\D/g, '');

  // 🚀 ميزة بيعية (Upselling): رسالة ذكية مسبقة الصياغة لفريق المبيعات
  const defaultMessage = isAr 
    ? 'مرحباً، أريد الاستفسار عن تفاصيل الاستثمار العقاري والوحدات المتاحة.' 
    : 'Hello, I would like to inquire about real estate investment details and available units.';
  
  const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(defaultMessage)}`;

  // لا تقم برندر المكون على السيرفر لتجنب تعارض الكلاسات
  if (!mounted) return null;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank"
      rel="noopener noreferrer"
      // ✅ استخدام Logical Properties (end-6) لضبط الاتجاه تلقائياً بدون شروط معقدة
      className={`
        fixed bottom-8 end-6 md:end-10 z-[9000] w-14 h-14 md:w-16 md:h-16 
        bg-[#25D366] text-white rounded-full 
        flex items-center justify-center 
        shadow-[0_10px_25px_rgba(37,211,102,0.4)] 
        hover:bg-[#20bd5a] hover:scale-110 hover:-translate-y-2 
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        group outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50
      `}
      aria-label={isAr ? "تواصل مع المبيعات عبر واتساب" : "Contact Sales via WhatsApp"}
    >
      {/* أيقونة واتساب مع أنيميشن خفيف عند الهوفر */}
      <MessageCircle 
        size={32} 
        strokeWidth={2.2} 
        className="group-hover:rotate-12 transition-transform duration-300"
      />
      
      {/* ✅ تأثير النبض (Pulse) المستمر لجذب الانتباه بشكل أنيق */}
      <span className="absolute inset-0 rounded-full border border-[#25D366] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75 pointer-events-none"></span>
      
      {/* تأثير الهوفر الداخلي */}
      <span className="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></span>

      {/* نص مساعد يظهر فقط عند الوقوف بالماوس (Tool-tip) - تم تصليح الـ RTL */}
      <span className={`
        absolute bottom-full mb-4 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl
        opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap
        start-1/2 -translate-x-1/2 rtl:translate-x-1/2
        shadow-xl
      `}>
        {isAr ? 'تحدث مع مستشارك الآن' : 'Chat with your consultant'}
        {/* سهم التولتيب المضبوط بالاتجاهات المنطقية */}
        <span className="absolute top-full start-1/2 -translate-x-1/2 rtl:translate-x-1/2 border-8 border-transparent border-t-slate-900"></span>
      </span>
    </a>
  );
}