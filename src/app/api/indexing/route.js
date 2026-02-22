import { google } from 'googleapis';
import { NextResponse } from 'next/server';

/**
 * 🤖 Google Indexing Gateway - Platform Real Estate Standard 2026
 * التحديث: معالجة ذكية للروابط لضمان مطابقة ملكية URL في Search Console.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    
    // 1. استلام البيانات
    const { secret, slug, lang = 'ar', type = 'projects' } = body;

    // 2. التحقق من أمن الطلب
    if (!process.env.INDEXING_SECRET || secret !== process.env.INDEXING_SECRET) {
      console.error('Indexing Auth Failed: Invalid Secret Key');
      return NextResponse.json({ success: false, message: 'Unauthorized Access' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ success: false, message: 'Resource Slug is required' }, { status: 400 });
    }

    // 3. معالجة المفاتيح الخاصة (Vercel Fix)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

    if (!privateKey || !clientEmail) {
      throw new Error("Google Credentials missing in Environment Variables");
    }

    // 4. إعداد الصلاحيات
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing('v3');

    // 5. بناء الرابط مع ضمان وجود الـ Trailing Slash (/) في النهاية
    // جوجل تعتبر example.com/page و example.com/page/ رابطين مختلفين تماماً
    // التعديل هنا يضمن إضافة الـ / دائماً لمطابقة الـ URL Prefix الموثق
    const baseUrl = 'https://platformrealestate.co';
    const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
    const urlToIndex = `${baseUrl}/${lang}/${type}/${cleanSlug}/`.replace(/\/+$/, '/');

    // 6. تنفيذ الطلب
    const response = await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url: urlToIndex,
        type: 'URL_UPDATED',
      },
    });

    console.log(`✅ [Indexing Success]: ${urlToIndex}`);

    return NextResponse.json({ 
      success: true,
      message: 'Google notified successfully', 
      url: urlToIndex,
      data: response.data 
    });

  } catch (error) {
    // 7. تحسين سجل الأخطاء لكشف السبب الحقيقي (Detailed Error Logging)
    console.error('❌ [Indexing API Error]:', {
      message: error.message,
      googleDetails: error.response?.data || 'Check Search Console Permissions'
    });

    return NextResponse.json({ 
      success: false,
      message: 'Indexing operation failed', 
      error: error.message,
      details: error.response?.data?.error?.message || 'Permission Denied'
    }, { status: 500 });
  }
}