import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// اللغات اللي السايت بيدعمها
const locales = ['ar', 'en'];
const defaultLocale = 'ar';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ استثناء الملفات التقنية، الصور، والـ Sanity Studio (مهم جداً!)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') || // عشان لوحة التحكم متهنجش
    pathname.includes('.') || 
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // 2️⃣ هل الرابط الحالي فيه لغة فعلاً؟ (مثلاً /ar/about)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // 3️⃣ لو مفيش لغة، نبدأ عملية "الذكاء الاصطناعي" ونشم لغة المتصفح
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = defaultLocale;

  if (acceptLanguage) {
    // لو لقى إن المتصفح لغته الأساسية إنجليزي، نغير الـ locale
    if (acceptLanguage.toLocaleLowerCase().startsWith('en')) {
      detectedLocale = 'en';
    }
  }

  // 4️⃣ التحويل النهائي للغة المناسبة
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;
  
  return NextResponse.redirect(url);
}

// الماتشر: بنقول للميدل وير يشتغل على كل الصفحات ماعدا الحاجات اللي ذكرناها فوق
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|studio).*)',
  ],
};