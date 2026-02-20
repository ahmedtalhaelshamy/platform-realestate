'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareBtn({ title, slug, lang, isAr }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault(); // منع أي سلوك افتراضي
    e.stopPropagation(); // منع تفعيل أحداث الكارت الأب

    // ✅ توحيد الرابط مع السيو (بدون www ومع سلاش نهائية)
    const baseUrl = 'https://platformrealestate.co';
    const url = `${baseUrl}/${lang}/projects/${slug}/`;
    
    const shareData = {
      title: title,
      text: isAr ? `شاهد هذا المشروع المميز: ${title}` : `Check out this project: ${title}`,
      url: url,
    };

    try {
      // 1. محاولة استخدام المشاركة الأصلية للمتصفح (موبايل)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 2. البديل للكمبيوتر: نسخ الرابط للـ Clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // تجاهل الأخطاء الناتجة عن إلغاء المستخدم للمشاركة
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      // ✅ إضافة aria-label لضمان درجة 100% في Accessibility
      aria-label={copied 
        ? (isAr ? "تم نسخ الرابط" : "Link copied") 
        : (isAr ? "مشاركة المشروع" : "Share Project")
      }
      // ✅ تعريف حالة الزر لبرامج قراءة الشاشة
      aria-live="polite"
      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-md border ${
        copied 
        ? 'bg-green-500 text-white border-green-500 scale-105' 
        : 'bg-white/90 text-slate-900 border-white/20 hover:bg-slate-900 hover:text-white'
      }`}
    >
      {copied ? <Check size={20} /> : <Share2 size={20} />}
    </button>
  );
}