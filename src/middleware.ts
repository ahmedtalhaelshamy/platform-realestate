import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ar', 'en'];
const defaultLocale = 'ar';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ منطقة الأمان: تجاهل أي طلب للملفات التالية تماماً
  if (
    pathname.startsWith('/_next') ||     // ملفات نكست التقنية
    pathname.startsWith('/api') ||       // طلبات الـ API
    pathname.startsWith('/studio') ||    // لوحة تحكم سانتي (مهم جداً)
    pathname.includes('.') ||            // الصور والملفات (png, jpg, ico)
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // 2️⃣ منع الـ Loop: لو الرابط فيه لغة فعلاً (/ar أو /en)، متبعتهوش في حتة تانية
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3️⃣ تحديد اللغة: شم لغة المتصفح، لو إنجليزي حوله لـ en، غير كدة ar
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = defaultLocale;

  if (acceptLanguage && acceptLanguage.toLowerCase().startsWith('en')) {
    detectedLocale = 'en';
  }

  // 4️⃣ التحويل النهائي:
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;
  
  // نستخدم 307 (Temporary Redirect) أثناء التجربة عشان المتصفح ميكيش الخطأ
  return NextResponse.redirect(url, 307);
}

// الماتشر: الفلتر اللي بيحدد الميدل وير يشتغل فين
export const config = {
  matcher: [
    // يشتغل على كل المسارات ما عدا المذكور بالأسفل
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|studio).*)',
  ],
};