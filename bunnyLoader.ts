// bunnyLoader.ts
export default function bunnyLoader({ src, width, quality }: { src: string, width: number, quality?: number }) {
  if (!src) return "";

  // 1. تبديل الدومين لـ Bunny (استخدمنا const هنا لأن القيمة لا تتغير)
  const normalizedSrc = src.replace('https://cdn.sanity.io', 'https://platform-images.b-cdn.net');

  // 2. تنظيف الرابط من أي Query Parameters قديمة (زي ?fit=max) لمنع تكرار علامة الـ ?
  const baseSrc = normalizedSrc.split('?')[0];

  // 3. بناء الباراميترز الجديدة لـ Bunny Optimizer
  const params = new URLSearchParams();
  params.append('w', width.toString());
  params.append('q', (quality || 75).toString());

  // 4. دمج الرابط الصافي مع الباراميترز الجديدة
  return `${baseSrc}?${params.toString()}`;
}