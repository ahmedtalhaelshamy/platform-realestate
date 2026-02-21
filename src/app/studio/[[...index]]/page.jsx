'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';
import { useEffect, useState } from 'react';

/**
 * 🛠️ Sanity Studio Page - Standard 2026
 * Optimized for React 19 & Next.js 16
 * تم ضبط الحاويات لضمان عدم حدوث تداخل مع ستايلات الموقع الأساسي
 */
export default function StudioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // استخدام ريفريش الفريم لضمان نظافة العملية (Clean Mount)
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    return () => cancelAnimationFrame(timer);
  }, []);

  // 1. واجهة التحميل الفاخرة (Premium Splash Loader)
  // تم تحسين الألوان لتطابق هوية بلاتفورم (Platform Real Estate)
  if (!mounted) {
    return (
      <div 
        role="status"
        aria-label="Loading Studio"
        style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#080A0D', 
          color: '#ffffff',
          fontFamily: 'var(--font-jakarta), sans-serif', // استخدام الخط الأساسي للمشروع
          gap: '24px'
        }} 
      >
        {/* لوجو بسيط متحرك للتحميل بألوان البراند */}
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(192, 32, 38, 0.1)',
          borderTop: '4px solid #C02026',
          borderRadius: '50%',
          animation: 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite'
        }} />
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
            <div style={{ 
              fontSize: '11px', 
              letterSpacing: '0.5em', 
              textTransform: 'uppercase',
              fontWeight: '900',
              color: '#C02026'
            }} className="animate-pulse">
              Platform Studio
            </div>
            <div style={{ 
              fontSize: '9px', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase',
              fontWeight: '600',
              opacity: 0.4
            }}>
              Market Intelligence 2026
            </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
          /* إخفاء أي عناصر قد تظهر بالخطأ أثناء التحميل */
          body { margin: 0; padding: 0; background-color: #080A0D; }
        `}} />
      </div>
    );
  }

  // 2. الحاوية الرئيسية للاستوديو
  // تم استخدام عزل تام (Absolute Isolation) لضمان أن الاستوديو يعمل كـ Micro-frontend مستقل
  return (
    <div 
      className="sanity-studio-wrapper"
      style={{ 
        height: '100vh', 
        width: '100%', 
        overflow: 'hidden',
        position: 'fixed', 
        top: 0,
        left: 0,
        zIndex: 99999,
        backgroundColor: '#ffffff' // الاستوديو داخلياً يفضل الخلفية الفاتحة للتعديل
      }}
    >
      <NextStudio 
        config={config} 
        // تفعيل هذا الخيار لضمان عدم حدوث وميض (Flicker) أثناء التنقل بين المخططات (Schemas)
        unstable_noOverscroll={true}
      />
    </div>
  );
}