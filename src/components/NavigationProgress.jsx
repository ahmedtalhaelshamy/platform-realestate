'use client';

import { useEffect, useRef } from 'react';

export const NAVIGATION_START_EVENT = 'navigation:start';

const currentUrl = () => window.location.pathname + window.location.search;

/**
 * شريط تحميل رفيع أعلى الصفحة يظهر فور أي تنقل داخلي ويختفي عند فتح الصفحة.
 * يتحكم في الـ DOM مباشرة (بدون re-render) حتى يظهر فوراً، والحركة transform/opacity فقط.
 *  - البداية: ضغطة على لينك داخلي، أو حدث navigation:start (للتنقل البرمجي router.push).
 *  - النهاية: تغيّر الرابط (App Router يحدّث history عند عرض الصفحة الجديدة).
 */
export default function NavigationProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    let startUrl = null; // null = لا يوجد تنقل جارٍ
    let animation = null;
    let safetyTimer = null;

    const finish = () => {
      if (startUrl === null) return;
      startUrl = null;
      clearTimeout(safetyTimer);
      animation?.cancel();
      animation = bar.animate(
        [
          { transform: 'scaleX(0.9)', opacity: 1 },
          { transform: 'scaleX(1)', opacity: 1, offset: 0.5 },
          { transform: 'scaleX(1)', opacity: 0 },
        ],
        { duration: 400, easing: 'ease-out' }
      );
    };

    const start = () => {
      startUrl = currentUrl();
      clearTimeout(safetyTimer);
      animation?.cancel();
      bar.style.transformOrigin = document.documentElement.dir === 'rtl' ? 'right' : 'left';
      animation = bar.animate(
        [
          { transform: 'scaleX(0.15)', opacity: 1 },
          { transform: 'scaleX(0.9)', opacity: 1 },
        ],
        { duration: 8000, easing: 'cubic-bezier(0.1, 0.7, 0.1, 1)', fill: 'forwards' }
      );
      safetyTimer = setTimeout(finish, 20000);
    };

    const onClick = (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || event.target.closest('button')) return;
      if ((anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // نفس الصفحة (أو hash فقط): لا يوجد تنقل
      if (url.pathname + url.search === currentUrl()) return;
      start();
    };

    const checkArrived = () => {
      // setTimeout: Next يستدعي history داخل دورة render
      setTimeout(() => {
        if (startUrl !== null && currentUrl() !== startUrl) finish();
      }, 0);
    };

    const { pushState, replaceState } = window.history;
    window.history.pushState = function (...args) {
      pushState.apply(this, args);
      checkArrived();
    };
    window.history.replaceState = function (...args) {
      replaceState.apply(this, args);
      checkArrived();
    };

    // capture: لأن Link يستدعي preventDefault
    document.addEventListener('click', onClick, true);
    window.addEventListener(NAVIGATION_START_EVENT, start);
    window.addEventListener('popstate', finish);

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener(NAVIGATION_START_EVENT, start);
      window.removeEventListener('popstate', finish);
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
      clearTimeout(safetyTimer);
      animation?.cancel();
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      data-nav-progress=""
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 3,
        background: '#C02026',
        opacity: 0,
        transform: 'scaleX(0)',
        zIndex: 2147483647,
        pointerEvents: 'none',
      }}
    />
  );
}
