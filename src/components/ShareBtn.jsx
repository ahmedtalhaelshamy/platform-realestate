'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

/**
 * 🔗 ShareBtn - 2026 UX & SEO Elite Standard
 * تم إصلاح التداخل مع مسار التصفح عبر تثبيت المحاذاة لليسار
 */
export default function ShareBtn({ title, slug, lang, isAr }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    const baseUrl = 'https://platformrealestate.co';
    const cleanSlug = String(slug || '').replace(/^\/|\/$/g, ''); 
    const url = `${baseUrl}/${lang}/projects/${cleanSlug}/`;
    
    const shareData = {
      title: title,
      text: isAr ? `شاهد هذا المشروع المميز في بلاتفورم: ${title}` : `Check out this premier project on Platform: ${title}`,
      url: url,
    };

    try {
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
      } else {
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
        aria-live="polite"
        className={`
          group w-11 h-11 rounded-2xl flex items-center justify-center 
          transition-all duration-300 shadow-md backdrop-blur-md border 
          outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-1
          will-change-transform active:scale-95 relative z-10
          ${copied 
            ? 'bg-[#10B981] text-white border-[#10B981] shadow-[#10B981]/20' 
            : 'bg-white/95 text-slate-800 border-white/20 hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-xl'
          }
        `}
      >
        {copied ? (
          <Check size={18} strokeWidth={3} className="animate-in zoom-in duration-300" aria-hidden="true" />
        ) : (
          <Share2 size={18} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
        )}
      </button>

      {/* 🚀 إصلاح الـ Tooltip: تم الغاء الـ translate-x واستخدام left-0 للتثبيت شمال دائماً */}
      <div 
        className={`
          absolute bottom-full mb-3 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg
          pointer-events-none whitespace-nowrap shadow-xl transition-all duration-300
          left-0 
          ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
        style={{ direction: 'ltr' }} 
        aria-hidden="true"
      >
        {isAr ? 'تم نسخ الرابط!' : 'Link Copied!'}
        {/* سهم التولتيب مثبت لليسار أيضاً */}
        <span className="absolute top-full left-4 border-4 border-transparent border-t-slate-900"></span>
      </div>
    </div>
  );
}