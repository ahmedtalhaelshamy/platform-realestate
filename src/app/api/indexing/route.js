import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { secret, slug, lang = 'ar' } = body; // جعل اللغة ديناميكية (اختياري)

    // 1. التحقق من كلمة السر (Webhook Secret)
    if (secret !== process.env.INDEXING_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    // 2. معالجة المفتاح الخاص
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (!privateKey) {
      throw new Error("GOOGLE_PRIVATE_KEY is missing in Environment Variables");
    }

    // 3. إعداد الصلاحيات
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing('v3');

    // 4. بناء الرابط الموحد (بدون www ومع سلاش نهائية لضمان أرشفة 100% صح)
    // النتيجة ستكون: https://platformrealestate.co/ar/projects/slug-name/
    const urlToIndex = `https://platformrealestate.co/${lang}/projects/${slug}/`;

    // 5. إرسال الطلب لجوجل
    const response = await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url: urlToIndex,
        type: 'URL_UPDATED',
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Google Indexing triggered successfully!', 
      url: urlToIndex,
      data: response.data 
    });

  } catch (error) {
    console.error('Indexing Error:', error.message);
    return NextResponse.json({ 
      success: false,
      message: 'Indexing failed', 
      error: error.message 
    }, { status: 500 });
  }
}