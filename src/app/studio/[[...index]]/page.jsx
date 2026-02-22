'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';
import { useEffect, useState } from 'react';

/**
 * 🛠️ Sanity Studio Page - Platform Real Estate 2026
 * Optimized for React 19 & Next.js 16 (Elite Standard)
 */
export default function StudioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // نضمن أن الرندر يحدث فقط في المتصفح
    setMounted(true);
    
    // منع السكرول في الخلفية أثناء وجود الاستوديو
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // 1. واجهة التحميل الفاخرة (Premium Splash Loader)
  if (!mounted) {
    return (
      <div 
        role="status"
        aria-label="Loading Platform Studio"
        style={{ 
          height: '100vh', 
          width: '100vw',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#080A0D', 
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999999
        }} 
      >
        {/* Spinner بألوان البراند */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(192, 32, 38, 0.1)',
          borderTop: '3px solid #C02026',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }} />
        
        <div style={{ 
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
            <div style={{ 
              fontSize: '10px', 
              letterSpacing: '0.4em', 
              textTransform: 'uppercase',
              fontWeight: '900',
              color: '#C02026',
              fontFamily: 'sans-serif'
            }} className="animate-pulse">
              Platform Studio
            </div>
            <div style={{ 
              fontSize: '8px', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase',
              color: '#ffffff',
              opacity: 0.3,
              fontFamily: 'sans-serif'
            }}>
              Initializing Market Intel 2026
            </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
          body { margin: 0 !important; padding: 0 !important; background-color: #080A0D !important; }
        `}} />
      </div>
    );
  }

  // 2. الحاوية الرئيسية للاستوديو (Isolated Canvas)
  return (
    <div 
      className="sanity-studio-container"
      style={{ 
        height: '100vh', 
        width: '100%', 
        overflow: 'hidden',
        position: 'fixed', 
        top: 0,
        left: 0,
        zIndex: 99999,
        backgroundColor: '#ffffff'
      }}
    >
      <NextStudio 
        config={config} 
        unstable_noOverscroll={true}
      />
    </div>
  );
}