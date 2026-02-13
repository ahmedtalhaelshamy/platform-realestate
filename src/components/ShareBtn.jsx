'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { CONTACT_INFO } from '@/components/constants/contact';

export default function ShareBtn({ title, slug, lang, isAr }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault(); // منع فتح رابط المشروع
    e.stopPropagation(); // منع تفعيل الكارت

    // تكوين الرابط الكامل
    const url = `${CONTACT_INFO.domain}/${lang}/projects/${slug}`;
    const shareData = {
      title: title,
      text: isAr ? `شاهد هذا المشروع المميز: ${title}` : `Check out this project: ${title}`,
      url: url,
    };

    try {
      // 1. محاولة استخدام المشاركة الأصلية للمتصفح (للموبايل)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 2. البديل للكمبيوتر: نسخ الرابط
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      title={isAr ? 'مشاركة المشروع' : 'Share Project'}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-md border ${
        copied 
        ? 'bg-green-500 text-white border-green-500' 
        : 'bg-white/90 text-slate-900 border-white hover:bg-[#121621] hover:text-white'
      }`}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
    </button>
  );
}