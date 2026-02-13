import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. القائمة البيضاء: استثناء كامل لكل ما هو ملف ثابت (صور، سيو، أيقونات)
  // ده بيمنع ظهور 404 على الصور اللي جننتنا
  const isPublicFile = pathname.match(/\.(.*)$/); 
  const isNextInternal = pathname.startsWith('/_next');
  const isImagesFolder = pathname.startsWith('/images/');
  const isStaticAssets = pathname.startsWith('/static/');

  if (isPublicFile || isNextInternal || isImagesFolder || isStaticAssets) {
    return NextResponse.next();
  }

  // 2. فحص وجود اللغة في بداية المسار
  const locales = ['ar', 'en'];
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 3. المنطق السحري: لو المسار "غلط" أو "ناقص لغة" -> حوله للعربي فورا
  if (!hasLocale) {
    // تصحيح المسار: لو داخل على /contact يروح لـ /ar/contact
    const url = request.nextUrl.clone();
    url.pathname = `/ar${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 4. الـ Matcher: الفلتر اللي بيحدد الميدل وير يشتغل فين
export const config = {
  matcher: [
    // تشغيل الميدل وير على كل المسارات ماعدا:
    // api (الخلفية), studio (سانتي), والملفات اللي استثنيناها فوق
    '/((?!api|studio|_next/static|_next/image|favicon.ico|images|static).*)',
  ],
};