import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. استثناء الملفات التقنية (الصور والسايت ماب)
  const isPublicFile = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/api');
  if (isPublicFile || pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  // 2. السحر هنا: لو دخل على الدومين الرئيسي (/)
  if (pathname === '/') {
    // قراءة لغة المتصفح (مثلاً: en-US, ar-EG)
    const acceptLanguage = request.headers.get('accept-language');
    
    // لو لغته فيها 'en'، ودره للنسخة الإنجليزي، غير كدة ودره للعربي
    const preferredLanguage = acceptLanguage?.includes('en') ? 'en' : 'ar';
    
    return NextResponse.redirect(new URL(`/${preferredLanguage}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};