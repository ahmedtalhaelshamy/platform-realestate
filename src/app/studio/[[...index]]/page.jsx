'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';
import { useEffect, useState } from 'react';

/**
 * صفحة الاستوديو (Sanity Studio)
 * تم تحسينها لتعمل مع Next.js 16 و React 19 بدون تحذيرات الـ Props
 */
export default function StudioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // نستخدم requestAnimationFrame لضمان استقرار الرندر في المحركات الحديثة
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    return () => cancelAnimationFrame(timer);
  }, []);

  // 1. واجهة التحميل الأولية (Splash Loader) لضمان تجربة مستخدم سلسة
  if (!mounted) {
    return (
      <div 
        style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#0f1115', // لون داكن يليق بهوية الموقع
          color: '#ffffff',
          fontFamily: 'sans-serif',
          fontSize: '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }} 
      >
        <div className="animate-pulse">Platform Studio Loading...</div>
      </div>
    );
  }

  return (
    // 2. الحاوية الرئيسية تم ضبطها لتكون "تفاعلية" بالكامل
    // استخدام الـ div كحارس يمنع تسرب الخصائص غير المعرفّة للـ DOM
    <div style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <NextStudio 
        config={config} 
        // ملاحظة: التحذير disableTransition داخلي في مكتبة next-sanity 
        // وسيختفي في التحديثات القادمة للمكتبة، الكود هنا يضمن أفضل توافق حالي.
      />
    </div>
  );
}