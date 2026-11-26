'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * لينك كروت المشاريع: بدون prefetch تلقائي لكل كارت ظاهر،
 * والـ prefetch يحصل فقط عند نية الضغط (hover على الكمبيوتر، touchstart على الموبايل).
 */
export default function PrefetchLink({ href, onMouseEnter, onTouchStart, ...props }) {
  const router = useRouter();
  const prefetch = () => router.prefetch(href);

  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      onMouseEnter={(e) => { onMouseEnter?.(e); prefetch(); }}
      onTouchStart={(e) => { onTouchStart?.(e); prefetch(); }}
    />
  );
}
