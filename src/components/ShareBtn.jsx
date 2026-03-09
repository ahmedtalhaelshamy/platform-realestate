'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

/**
 * 🔗 ShareBtn - 2026 UX & SEO Elite Standard
 * تم إصلاح بناء الروابط لضمان أفضل ظهور على واتساب ومنصات التواصل.
 */
export default function ShareBtn({ title, slug, lang, isAr }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    // ✅ بناء الرابط المعياري لضمان السيو 100%
    const baseUrl = 'https://platformrealestate.co';
    const cleanSlug = String(slug || '').replace(/^\/+|\/+$/g, ''); 
    const url = `${baseUrl}/${lang}/projects/${cleanSlug}/`;
    
    const shareData = {
      title: title,
      text: isAr ? `شاهد هذا المشروع المميز في بلاتفورم: ${title}` : `Check out this premier project on Platform: ${title}`,
      url: url,
    };

    try {
      // 📱 تفعيل المشاركة الأصلية للموبايل
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
      } else {
        // 💻 تفعيل النسخ للديسكتوب
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
        console.warn('Share system unavailable:', err.message);
      }
    }
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={handleShare}
        type="button"
        aria-label={copied 
          ? (isAr ? "تم نسخ الرابط بنجاح" : "Link copied successfully") 
          : (isAr ? "مشاركة تفاصيل المشروع" : "Share project details")
        }
        className={`
          group w-11 h-11 rounded-2xl flex items-center justify-center 
          transition-all duration-300 shadow-lg backdrop-blur-md border 
          outline-none focus-visible:ring-2 focus-visible:ring-[#C02026]
          will-change-transform active:scale-90 relative z-10
          ${copied 
            ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20' 
            : 'bg-white/95 text-slate-800 border-white/20 hover:bg-slate-950 hover:text-white hover:border-slate-950'
          }
        `}
      >
        {copied ? (
          <Check size={18} strokeWidth={3} className="animate-in zoom-in duration-300" />
        ) : (
          <Share2 size={18} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-12" />
        )}
      </button>

      {/* 🚀 Tooltip - ثابت لليسار لضمان الظهور الصحيح في كافة الشاشات */}
      <div 
        aria-hidden="true"
        className={`
          absolute bottom-full mb-3 px-3 py-1.5 bg-slate-950 text-white text-[10px] font-black rounded-lg
          pointer-events-none whitespace-nowrap shadow-2xl transition-all duration-300
          start-0 
          ${copied ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'}
        `}
      >
        <span className="uppercase tracking-widest">
            {isAr ? 'تم النسخ!' : 'Link Copied!'}
        </span>
        {/* سهم التولتيب */}
        <span className="absolute top-full start-4 border-4 border-transparent border-t-slate-950"></span>
      </div>
    </div>
  );
}