import { google } from 'googleapis';
import { NextResponse } from 'next/server';

/**
 * 🤖 Google Indexing Gateway - Platform Real Estate Standard
 * المهمة: إخطار جوجل فوراً عند إضافة أو تحديث مشروع لضمان أرشفة لحظية.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    // أضفت "type" كخيار مستقبلي لو حبيت تأرشف (blog) أو (projects) بنفس الكود
    const { secret, slug, lang = 'ar', type = 'projects' } = body;

    // 1. التحقق من كلمة السر (Webhook Secret) لضمان الأمان
    if (secret !== process.env.INDEXING_SECRET) {
      console.error('Indexing Auth Failed: Invalid Secret');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    // 2. معالجة المفتاح الخاص (Handling \n properly for production servers like Vercel)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (!privateKey) {
      throw new Error("GOOGLE_PRIVATE_KEY is missing in Environment Variables");
    }

    // 3. إعداد الصلاحيات والاتصال بـ Google API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing('v3');

    // 4. بناء الرابط الموحد المعتمد (Strict Trailing Slash for SEO)
    // النتيجة المضمونة: https://platformrealestate.co/ar/projects/slug-name/
    const urlToIndex = `https://platformrealestate.co/${lang}/${type}/${slug}/`;

    // 5. إرسال إشعار "تحديث الرابط" لجوجل
    const response = await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url: urlToIndex,
        type: 'URL_UPDATED',
      },
    });

    // تسجيل النجاح في الـ Logs لمراقبة الأداء
    console.log(`Successfully notified Google about: ${urlToIndex}`);

    return NextResponse.json({ 
      success: true,
      message: 'Google Indexing triggered successfully!', 
      url: urlToIndex,
      data: response.data 
    });

  } catch (error) {
    console.error('Indexing API Critical Error:', error.message);
    return NextResponse.json({ 
      success: false,
      message: 'Indexing failed', 
      error: error.message 
    }, { status: 500 });
  }
}