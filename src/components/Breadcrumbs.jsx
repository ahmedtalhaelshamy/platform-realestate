'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

/**
 * 🗺️ Breadcrumbs Component - SEO & UX Optimized
 * يضمن هذا المكون تجربة تصفح سلسة مع تعزيز أرشفة جوجل عبر JSON-LD.
 */
export default function Breadcrumbs({ items, lang = 'ar' }) {
  // ✅ التخلص من أي متغير وسيط لتفادي أخطاء الـ Scope في Next.js Build
  
  // توحيد الدومين الأساسي بأمان
  const domain = process.env.NEXT_PUBLIC_BASE_URL || 'https://platformrealestate.co';
  const baseUrl = domain.replace(/\/$/, '');

  // حماية من الأخطاء لو كانت الداتا فاضية أو مش Array
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

  // تحديد أيقونة الفاصل بناءً على اللغة مباشرة
  const Separator = lang === 'ar' ? ChevronLeft : ChevronRight;

  // ✅ SEO: إنشاء بيانات Schema.org بصيغة JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": lang === 'ar' ? 'الرئيسية' : 'Home',
        "item": `${baseUrl}/${lang}/` 
      },
      ...safeItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item?.label || '',
        // ضمان إضافة سلاش نهائية في بيانات السكيما لتطابق الروابط الفعلية
        "item": item?.href ? `${baseUrl}${item.href}${item.href.endsWith('/') ? '' : '/'}` : undefined
      }))
    ]
  };

  return (
    <>
      {/* 🤖 حقن بيانات السكيما لمحركات البحث */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav 
        aria-label="Breadcrumb" 
        className="w-full mb-6 select-none animate-in fade-in slide-in-from-top-2 duration-700"
      >
        <ol className="flex items-center overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar text-sm md:text-base font-medium text-slate-500">
          
          {/* 🏠 1. رابط الرئيسية */}
          <li className="flex items-center shrink-0">
            <Link 
              href={`/${lang}/`} 
              className="flex items-center gap-2 hover:text-[#C02026] transition-all duration-300 focus:outline-none focus:text-[#C02026] group"
              aria-label={lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            >
              <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-red-50 transition-colors">
                <Home size={16} strokeWidth={2.5} className="mb-0.5" />
              </div>
              <span className="hidden md:inline-block font-black uppercase tracking-widest text-[10px]">
                {lang === 'ar' ? 'الرئيسية' : 'Home'}
              </span>
            </Link>
          </li>

          {/* 🔗 2. مسارات التنقل الديناميكية */}
          {safeItems.map((item, index) => {
            const isLast = index === safeItems.length - 1;
            const itemLabel = item?.label || '';
            const itemHref = item?.href || '';

            return (
              <li key={index} className="flex items-center shrink-0">
                <Separator size={14} className="mx-2 text-slate-300 rtl:rotate-0 shrink-0 opacity-60" aria-hidden="true" />

                {itemHref && !isLast ? (
                  <Link 
                    href={itemHref.endsWith('/') ? itemHref : `${itemHref}/`} 
                    className="hover:text-[#C02026] transition-all duration-300 focus:outline-none font-bold text-[11px] md:text-sm uppercase tracking-tighter italic"
                  >
                    {itemLabel}
                  </Link>
                ) : (
                  <span 
                    className="text-[#C02026] font-black text-[11px] md:text-sm uppercase tracking-tighter italic max-w-[150px] md:max-w-[300px] truncate cursor-default"
                    aria-current="page"
                    title={itemLabel}
                  >
                    {itemLabel}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </nav>
    </>
  );
}