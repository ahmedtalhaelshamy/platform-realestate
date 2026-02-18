import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { secret, slug } = body;

    // 1. التحقق من كلمة السر المرسلة من Sanity
    if (secret !== process.env.INDEXING_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. معالجة المفتاح الخاص لضمان قبول الأسطر الجديدة
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (!privateKey) {
      throw new Error("GOOGLE_PRIVATE_KEY is missing");
    }

    // 3. إعداد الصلاحيات للاتصال بجوجل
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing('v3');

    // 4. بناء الرابط (تم إضافة www ليطابق إعدادات Search Console الخاصة بك)
    const urlToIndex = `https://www.platformrealestate.co/ar/projects/${slug}`;

    // 5. إرسال الطلب لجوجل
    const response = await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url: urlToIndex,
        type: 'URL_UPDATED',
      },
    });

    return NextResponse.json({ 
      message: 'تم تحديث جوجل بنجاح!', 
      url: urlToIndex,
      data: response.data 
    });

  } catch (error) {
    console.error('Indexing Error:', error.message);
    return NextResponse.json({ 
      message: 'فشلت الفهرسة', 
      error: error.message 
    }, { status: 500 });
  }
}