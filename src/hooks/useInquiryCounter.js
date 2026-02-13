// src/hooks/useInquiryCounter.js
'use client';

import { useState, useEffect } from 'react';

export function useInquiryCounter() {
  // نبدأ بـ 0، وهذا يعني ضمناً أن المكون لم يحسب الرقم بعد (Server/Initial State)
  const [count, setCount] = useState(0);

  useEffect(() => {
    // دالة الحساب المعتمدة على الوقت
    const calculateCount = () => {
      const now = new Date();
      // استخدم التوقيت المحلي للمستخدم لضمان الاتساق
      const hour = now.getHours(); 
      const minute = now.getMinutes();

      // الثوابت (يمكنك تعديلها للتحكم في الزيادة)
      const baseCount = 19; // رقم البداية الثابت
      const ratePerHour = 2; // معدل الزيادة لكل ساعة
      
      // المعادلة: الأساس + (الساعة * المعدل) + (زيادة طفيفة كل 15 دقيقة)
      let dynamicCount = baseCount + (hour * ratePerHour) + Math.floor(minute / 15);

      // تصفير منطقي في الساعات الأولى من الصباح (مثلاً من 12 منتصف الليل لـ 6 صباحاً)
      if (hour < 6) {
        dynamicCount = baseCount + Math.floor(hour / 1.5);
      }

      setCount(dynamicCount);
    };

    // 1. الحساب الفوري عند التحميل
    calculateCount();

    // 2. تحديث الرقم كل دقيقة ليبقى "حياً"
    const interval = setInterval(calculateCount, 60000);

    // تنظيف الذاكرة عند الخروج
    return () => clearInterval(interval);
  }, []);

  return { 
    count, 
    // ✅ خدعة احترافية:
    // بدلاً من state منفصل، نعتبر أن الموقع "mounted" إذا كان العداد أكبر من 0
    mounted: count > 0 
  };
}