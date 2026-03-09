'use client';

import { useState, useEffect } from 'react';

/**
 * 📈 useInquiryCounter - Platform Social Proof Engine 2026
 * المهمة: محاكاة عدد الاستفسارات الحية لزيادة ثقة العميل (FOMO Effect).
 */
export function useInquiryCounter() {
  // نبدأ بـ 0 لضمان توافق الـ Server-Side Rendering ومنع أخطاء الـ Hydration
  const [count, setCount] = useState(0);

  useEffect(() => {
    const calculateCount = () => {
      const now = new Date();
      const hour = now.getHours(); 
      const minute = now.getMinutes();

      // --- إعدادات العداد الذكي ---
      const baseCount = 24;      // رقم بداية احترافي (أكثر من 20 ليعطي انطباع جيد)
      const ratePerHour = 1.8;   // معدل الزيادة لكل ساعة
      
      /**
       * 🧠 معادلة المحاكاة المتقدمة:
       * الأساس + (الساعة الحالية * المعدل) + (زيادة كل 15 دقيقة) 
       * أضفت معامل اليوم (now.getDate()) لضمان أن الرقم يختلف من يوم لآخر لنفس العميل.
       */
      const dayOffset = (now.getDate() % 5); // تغيير طفيف بناءً على اليوم
      let dynamicCount = baseCount + (hour * ratePerHour) + Math.floor(minute / 12) + dayOffset;

      // 🌙 منطق ساعات الهدوء (الفجر)
      // من 1 صباحاً لـ 7 صباحاً، الحركة تكون أهدأ بكثير
      if (hour >= 1 && hour < 7) {
        dynamicCount = baseCount + dayOffset + Math.floor(hour * 0.5);
      }

      setCount(Math.floor(dynamicCount));
    };

    // 1. الحساب الفوري عند دخول العميل للمتصفح
    calculateCount();

    // 2. تحديث الرقم كل دقيقة ليبدو العداد "نابضاً بالحياة"
    const interval = setInterval(calculateCount, 60000);

    return () => clearInterval(interval);
  }, []);

  return { 
    count, 
    // mounted: نعتبرها true بمجرد أن يحسب العداد أول قيمة أكبر من 0
    mounted: count > 0 
  };
}