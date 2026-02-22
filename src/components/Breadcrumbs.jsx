'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

/**
 * 🗺️ Breadcrumbs Component - SEO & UX Optimized 2026
 * يدعم اللغتين تلقائياً ويولد بيانات منظمة لمحركات البحث (BreadcrumbList Schema)
 */
export default function Breadcrumbs({ items, lang = 'ar' }) {
  const isAr = lang === 'ar';
  
  // توحيد الدومين الأساسي بأمان للـ Schema
  const domain = process.env.NEXT_PUBLIC_BASE_URL || 'https://platformrealestate.co';
  const baseUrl = domain.replace(/\/$/, '');

  // حماية من البيانات غير الصالحة
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

  // اختيار الأيقونة الفاصلة بناءً على اتجاه اللغة
  const SeparatorIcon = isAr ? ChevronLeft : ChevronRight;

  // ✅ SEO: إنشاء بيانات Schema.org بصيغة JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isAr ? 'الرئيسية' : 'Home',
        "item": `${baseUrl}/${lang}/` 
      },
      ...safeItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item?.label || '',
        "item": item?.href ? `${baseUrl}${item.href}${item.href.endsWith('/') ? '' : '/'}` : undefined
      }))
    ]
  };

  return (
    <>
      {/* 🤖 بيانات السكيما لمحركات البحث لظهار المسار في نتائج جوجل */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav 
        aria-label={isAr ? "مسار التنقل" : "Breadcrumb"} 
        className="w-full mb-8 select-none animate-fade-in-up"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <ol className="flex items-center overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar text-sm font-bold">
          
          {/* 🏠 1. رابط الرئيسية - محسّن للوصول */}
          <li className="flex items-center shrink-0">
            <Link 
              href={`/${lang}/`} 
              className="flex items-center gap-2 text-slate-500 hover:text-brand-red transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-lg group"
              aria-label={isAr ? 'العودة للرئيسية' : 'Back to Home'}
            >
              <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-brand-red/10 transition-colors">
                <Home size={16} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <span className="hidden sm:inline-block font-black uppercase tracking-widest text-[10px]">
                {isAr ? 'الرئيسية' : 'Home'}
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
                {/* الفاصل أيقوني - لا يقرأه قارئ الشاشة */}
                <SeparatorIcon size={14} className="mx-2 md:mx-3 text-slate-300 shrink-0" aria-hidden="true" />

                {itemHref && !isLast ? (
                  <Link 
                    href={itemHref.endsWith('/') ? itemHref : `${itemHref}/`} 
                    className="text-slate-500 hover:text-brand-red transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-md py-1 px-1 font-bold text-[11px] md:text-xs uppercase tracking-tight italic"
                  >
                    {itemLabel}
                  </Link>
                ) : (
                  // العنصر الأخير (الصفحة الحالية): يتم إبرازه باللون الأحمر ومنع تآكله
                  <span 
                    className="text-brand-red font-black text-[11px] md:text-xs uppercase tracking-tight italic max-w-[180px] md:max-w-[350px] truncate cursor-default leading-relaxed px-1"
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

        <style dangerouslySetInnerHTML={{ __html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      </nav>
    </>
  );
}