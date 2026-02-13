'use client'

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

export default function PostActions({ url, title, lang }) {
  const [copied, setCopied] = useState(false);
  const isAr = lang === 'ar';

  const handleShare = async (e) => {
    e.preventDefault(); // منع الانتقال لصفحة المقال عند الضغط على المشاركة
    e.stopPropagation(); // منع التأثير على العناصر الأب
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="w-10 h-10 bg-white/90 backdrop-blur-md text-slate-900 rounded-full flex items-center justify-center shadow-2xl hover:bg-[#C02026] hover:text-white transition-all border border-slate-100 group/share"
      title={isAr ? "شارك المقال" : "Share Article"}
    >
      {copied ? (
        <Check size={18} className="text-green-500 group-hover/share:text-white" />
      ) : (
        <Share2 size={18} />
      )}
    </button>
  );
}