'use client';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items, lang = 'ar' }) {
  const isAr = lang === 'ar';
  
  // ✅ إصلاح المشكلة: تحديد الدومين الصحيح
  // 1. بيحاول يجيب الرابط من متغيرات البيئة
  // 2. لو مش موجود، بيستخدم الدومين الجديد بتاعك كبديل
  const domain = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.platformrealestate.co';
  
  // التأكد من عدم وجود "سلاش" / في آخر الرابط عشان ما يبقاش مزدوج
  const baseUrl = domain.replace(/\/$/, '');

  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) return null;

  const Separator = isAr ? ChevronLeft : ChevronRight;

  // ✅ SEO: تكوين بيانات Schema.org بالرابط الصحيح
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isAr ? 'الرئيسية' : 'Home',
        // هنا تم التعديل لاستخدام baseUrl المتغير
        "item": `${baseUrl}/${lang}` 
      },
      ...safeItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        // وهنا كمان تم التعديل
        "item": item.href ? `${baseUrl}${item.href}` : undefined
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

          {/* 2. باقي العناصر */}
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
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* CSS لإخفاء شريط التمرير */}
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </nav>
    </>
  );
}