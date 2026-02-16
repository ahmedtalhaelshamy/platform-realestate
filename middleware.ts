import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ استثناء الملفات التقنية (عشان جوجل يشوف الصور والسايت ماب)
  // لو الطلب لملف زي sitemap.xml أو صورة، سيبه يمر بسلام
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || // زي logo.png
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // 2️⃣ توجيه الصفحة الرئيسية (/) للغة العربية أوتوماتيكياً
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ar', request.url));
  }

  // 3️⃣ منع الدخول على مسارات اللغة "حاف" (اختياري)
  // لو حد كتب /ar/ فقط، سيبه يكمل للرئيسية
  
  return NextResponse.next();
}

// 4️⃣ الفلتر (Matcher): حدد للمحرك متى يتدخل الميدل وير
export const config = {
  matcher: [
    // تشغيل الميدل وير على كل المسارات ما عدا ملفات النظام والصور
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};