import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🏁 إعدادات اللغات
const locales = ['ar', 'en'];
const defaultLocale = 'ar';

/**
 * 🛰️ Proxy (المعروف سابقاً بـ Middleware)
 * تم تغيير اسم الدالة ليتوافق مع معايير Next.js 16
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1️⃣ استثناء الروابط التقنية والإدارية
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.includes('.') || 
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2️⃣ التحقق من وجود اللغة في الرابط
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // إضافة السلاش النهائية لو الرابط لغة فقط (مثل /ar) لتوحيد السيو
    const isOnlyLocale = locales.some(locale => pathname === `/${locale}`);
    if (isOnlyLocale) {
      return NextResponse.redirect(new URL(`${pathname}/${search}`, request.url));
    }
    return NextResponse.next();
  }

  // 3️⃣ كشف لغة المستخدم
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = defaultLocale;

  if (acceptLanguage) {
    if (acceptLanguage.toLowerCase().split(',')[0].startsWith('en')) {
      detectedLocale = 'en';
    }
  }

  // 4️⃣ التحويل النهائي بالسلاش النهائية (Trailing Slash)
  const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const redirectUrl = new URL(
    `/${detectedLocale}${cleanPath}${search}`,
    request.url
  );

  return NextResponse.redirect(redirectUrl, 307);
}

// 🎯 الماتشر (Matcher)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|studio|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};