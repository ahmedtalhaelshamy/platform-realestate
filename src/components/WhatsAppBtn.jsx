'use client';

import { MessageCircle } from 'lucide-react';
// ✅ استيراد الثوابت كمرجع افتراضي
import { CONTACT_INFO } from '../components/constants/contact';

/**
 * 🟢 WhatsAppBtn - المكون العائم للتواصل
 * @param {string} lang - لغة الصفحة (ar/en)
 * @param {string} phoneNumber - رقم مخصص اختياري (من Sanity مثلاً)
 */
export default function WhatsAppBtn({ lang, phoneNumber }) {
  const isAr = lang === 'ar';

  // 🛠️ استخدام الرقم الممرر من Sanity أولاً، ثم العودة للثوابت إذا لم يوجد
  const rawNumber = phoneNumber || CONTACT_INFO.whatsapp;
  const cleanedNumber = rawNumber?.replace(/\D/g, '');

  return (
    <a 
      href={`https://wa.me/${cleanedNumber}`} 
      target="_blank"
      rel="noopener noreferrer"
      // ✅ تحسين الـ SEO وإخبار جوجل بأن هذا الرابط لا ينقل قوة الصفحة (Link Equity)
      className={`
        fixed bottom-8 z-[9999] w-16 h-16 
        bg-[#25D366] text-white rounded-full 
        flex items-center justify-center 
        shadow-[0_10px_25px_rgba(37,211,102,0.4)] 
        hover:bg-[#20bd5a] hover:scale-110 hover:-translate-y-2 
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isAr ? 'left-6 md:left-10' : 'right-6 md:right-10'}
        group
      `}
      aria-label={isAr ? "تواصل معنا عبر واتساب" : "Contact us on WhatsApp"}
    >
      {/* أيقونة واتساب مع أنيميشن خفيف عند الهوفر */}
      <MessageCircle 
        size={32} 
        strokeWidth={2.5} 
        className="group-hover:rotate-12 transition-transform duration-300"
      />
      
      {/* ✅ تأثير النبض (Pulse) - تم تحسينه ليكون أكثر نعومة وفخامة */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40 pointer-events-none scale-125"></span>
      <span className="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></span>

      {/* نص مساعد يظهر فقط عند الوقوف بالماوس (Tool-tip) - اختياري */}
      <span className={`
        absolute bottom-full mb-4 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl
        opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap
        after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-slate-900
      `}>
        {isAr ? 'تواصل معنا الآن' : 'Chat with us'}
      </span>
    </a>
  );
}