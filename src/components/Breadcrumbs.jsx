'use client';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items, lang = 'ar' }) {
  const isAr = lang === 'ar';
  
  // ✅ 1. فحص أمان للمصفوفة لتجنب الخطأ (Fix Runtime Error)
  const safeItems = Array.isArray(items) ? items : [];

  // إذا لم تكن هناك عناصر (أو كانت المصفوفة فارغة)، لا نعرض شيئاً أو نعرض فقط الرئيسية
  if (safeItems.length === 0) return null;

  // تحديد اتجاه السهم بناءً على اللغة (RTL/LTR Support)
  const Separator = isAr ? ChevronLeft : ChevronRight;

  // ✅ SEO: تكوين بيانات Schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isAr ? 'الرئيسية' : 'Home',
        "item": `https://platform-eg.com/${lang}` // يُفضل استبدال الدومين بالدومين الحقيقي للمشروع
      },
      ...safeItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? `https://platform-eg.com${item.href}` : undefined
      }))
    ]
  };

  return (
    <>
      {/* حقن بيانات السكيما لمحركات البحث */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav 
        aria-label="Breadcrumb" 
        className="w-full mb-6 select-none"
      >
        <ol className="flex items-center overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar text-sm md:text-base font-medium text-slate-500">
          
          {/* 1. رابط الرئيسية */}
          <li className="flex items-center shrink-0">
            <Link 
              href={`/${lang}`} 
              className="flex items-center gap-1.5 hover:text-[#C02026] transition-colors focus:outline-none focus:text-[#C02026]"
              aria-label={isAr ? 'العودة للرئيسية' : 'Back to Home'}
            >
              <Home size={18} strokeWidth={2} className="mb-0.5" />
              <span className="hidden md:inline-block">{isAr ? 'الرئيسية' : 'Home'}</span>
            </Link>
          </li>

          {/* 2. باقي العناصر (نستخدم safeItems) */}
          {safeItems.map((item, index) => {
            const isLast = index === safeItems.length - 1;

            return (
              <li key={index} className="flex items-center shrink-0">
                {/* الفاصل */}
                <Separator size={16} className="mx-2 text-slate-300 rtl:rotate-0 shrink-0" aria-hidden="true" />

                {item.href && !isLast ? (
                  // عنصر قابل للنقر
                  <Link 
                    href={item.href} 
                    className="hover:text-[#C02026] transition-colors focus:outline-none focus:text-[#C02026]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  // العنصر الحالي (غير قابل للنقر + مميز)
                  <span 
                    className="text-[#C02026] font-bold max-w-[150px] md:max-w-[300px] truncate cursor-default"
                    aria-current="page"
                    title={item.label} // Tooltip للاسم الكامل في حالة القص
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* CSS لإخفاء شريط التمرير (Keep UI Clean) */}
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </nav>
    </>
  );
}