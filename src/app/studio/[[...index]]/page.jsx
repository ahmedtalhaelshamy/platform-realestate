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
          backgroundColor: '#080A0D', // تطابق مع لون الـ Footer الداكن
          color: '#ffffff',
          fontFamily: 'sans-serif',
          gap: '20px'
        }} 
      >
        {/* لوجو بسيط متحرك للتحميل */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTop: '3px solid #C02026',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ 
          fontSize: '10px', 
          letterSpacing: '0.4em', 
          textTransform: 'uppercase',
          fontWeight: '900',
          opacity: 0.6
        }} className="animate-pulse">
          Platform Studio Loading
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        `}} />
      </div>
    );
  }

  // 2. الحاوية الرئيسية للاستوديو
  // تم عزل الاستوديو تماماً لضمان عدم تأثره بأي Global CSS للموقع
  return (
    <div 
      className="sanity-studio-wrapper"
      style={{ 
        height: '100vh', 
        width: '100%', 
        overflow: 'hidden',
        position: 'fixed', // لضمان عدم وجود سكرول خارجي
        top: 0,
        left: 0,
        zIndex: 99999
      }}
    >
      <NextStudio 
        config={config} 
        // تفعيل هذا الخيار لضمان عدم حدوث وميض (Flicker) أثناء التنقل
        unstable_noOverscroll={true}
      />
    </div>
  );
}