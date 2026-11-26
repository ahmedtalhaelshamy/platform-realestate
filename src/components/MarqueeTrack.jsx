'use client';

import { useEffect, useRef } from 'react';

const SPEED_DESKTOP = 60; // px/s
const SPEED_MOBILE = 50; // px/s

// عرض العنصر + المسافة (px) حسب مقاسات DeveloperLogoItem و gap الشريط: تقدير أولي قبل القياس الفعلي
const STEP_DESKTOP = 496;
const STEP_MOBILE = 312;

/**
 * شريط متحرك بسرعة ثابتة بالبكسل/ثانية مهما كان عدد العناصر،
 * ويتوقف وهو خارج الشاشة. الحركة نفسها CSS transform (keyframes في الصفحة).
 * المحتوى مكرر 3 مرات، فكل دورة تقطع ثلث العرض.
 */
export default function MarqueeTrack({ uniqueCount, className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const track = ref.current;
    const mobile = window.matchMedia('(max-width: 768px)');

    const setDuration = () => {
      const distance = track.scrollWidth / 3;
      const speed = mobile.matches ? SPEED_MOBILE : SPEED_DESKTOP;
      if (distance > 0) track.style.animationDuration = `${distance / speed}s`;
    };

    const resize = new ResizeObserver(setDuration);
    resize.observe(track);
    mobile.addEventListener('change', setDuration);

    // نراقب الإطار الثابت وليس الشريط المتحرك نفسه
    const visibility = new IntersectionObserver(([entry]) => {
      track.dataset.offscreen = String(!entry.isIntersecting);
    });
    visibility.observe(track.parentElement);

    return () => {
      resize.disconnect();
      visibility.disconnect();
      mobile.removeEventListener('change', setDuration);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        '--marquee-duration': `${(uniqueCount * STEP_DESKTOP) / SPEED_DESKTOP}s`,
        '--marquee-duration-mobile': `${(uniqueCount * STEP_MOBILE) / SPEED_MOBILE}s`,
      }}
    >
      {children}
    </div>
  );
}
