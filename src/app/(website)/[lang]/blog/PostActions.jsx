'use client';

import { Share2, Check, Copy } from 'lucide-react';
import { useState } from 'react';

/**
 * 🛠️ PostActions - 2026 Engagement Standard
 * تم تحسينه ليكون متوافقاً مع تجربة المستخدم السريعة في Platform Real Estate
 * الدالة getSafeText تضمن عدم توقف الكود إذا كانت البيانات قادمة من Sanity Objects
 */
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  if (typeof val === 'object' && val.children) {
    return val.children.map(child => child.text).join('');
  }
  return String(val);
};

export default function PostActions({ url, title, lang }) {
  const [copied, setCopied] = useState(false);
  const isAr = lang === 'ar';
  
  // تأمين العنوان والرابط لضمان عدم حدوث Runtime Errors
  const cleanTitle = getSafeText(title);
  const cleanUrl = typeof url === 'string' ? url : typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async (e) => {
    e.preventDefault(); // منع الانتقال لصفحة المقال لو الزرار جوه كارت (Card)
    e.stopPropagation(); // منع التأثير على العناصر الأب (Event Bubbling)
    
    // 📱 محاولة استخدام نظام المشاركة الأصلي للموبايل (Native Share)
    // ده بيسمح للمستخدم يشارك مباشرة على الواتساب أو انستجرام بسهولة
    if (navigator.share) {
      try {
        await navigator.share({
          title: cleanTitle,
          text: isAr ? `اكتشف هذا العقار المميز: ${cleanTitle}` : `Check out this property: ${cleanTitle}`,
          url: cleanUrl,
        });
      } catch (err) {
        console.log('Share interaction ended');
      }
    } 
    // 💻 في حالة الديسكتوب: نسخ الرابط للمحافظة على سرعة الحركة
    else {
      try {
        await navigator.clipboard.writeText(cleanUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy link', err);
      }
    }
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={handleShare}
        type="button"
        aria-label={copied 
          ? (isAr ? "تم نسخ الرابط" : "Link Copied") 
          : (isAr ? "شارك هذا المقال" : "Share this article")
        }
        className={`
          relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
          ${copied 
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-110' 
            : 'bg-white/90 backdrop-blur-xl text-slate-900 shadow-2xl hover:bg-[#C02026] hover:text-white border border-slate-100 hover:-translate-y-1 active:scale-95'
          }
          group/share
        `}
      >
        {copied ? (
          <Check size={20} strokeWidth={3} className="animate-in zoom-in duration-300" />
        ) : (
          <Share2 size={20} strokeWidth={2} className="group-hover/share:scale-110 transition-transform" />
        )}

        {/* 💡 Smart Tooltip - Desktop Enhanced */}
        <span className={`
          absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none transition-all duration-300
          ${copied ? 'opacity-100 -top-14' : 'group-hover/share:opacity-100'}
        `}>
          {copied ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "مشاركة" : "Share")}
          {/* Arrow Icon */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
        </span>
      </button>
    </div>
  );
}