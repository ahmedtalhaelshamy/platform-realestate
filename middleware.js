import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. استثناء الملفات التقنية (الصور، السايت ماب، ملفات التحقق)
  // أي حاجة فيها "نقطة" زي .html, .png, .ico هنعديها فوراً
  const hasFileExtension = pathname.includes('.');
  
  if (hasFileExtension || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/studio')) {
    return NextResponse.next();
  }

  // 2. توجيه الصفحة الرئيسية (Root) فقط
  if (pathname === '/') {
    // قراءة لغة المتصفح
    const acceptLanguage = request.headers.get('accept-language');
    
    // لو المتصفح إنجليزي حوله EN، غير كدة خليه AR (الديفولت للمصريين)
    const preferredLanguage = acceptLanguage?.includes('en') ? 'en' : 'ar';
    
    return NextResponse.redirect(new URL(`/${preferredLanguage}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // ✅ ضفتلك studio|google هنا عشان نضمن إن الميدل وير مبيجيش جنبهم
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|studio).*)'],
};