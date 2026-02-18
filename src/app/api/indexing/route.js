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

    // 2. معالجة المفتاح الخاص لحل مشكلة الـ DECODER unsupported
    // نقوم باستبدال الـ \n النصية بأسطر حقيقية
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n')
      : undefined;

    if (!privateKey) {
      throw new Error("GOOGLE_PRIVATE_KEY is missing in environment variables");
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
    const urlToIndex = `https://platformrealestate.co/ar/projects/${slug}`;

    // 4. إرسال الطلب لجوجل
    const response = await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url: urlToIndex,
        type: 'URL_UPDATED',
      },
    });

    return NextResponse.json({ 
      message: 'Successfully notified Google', 
      url: urlToIndex,
      data: response.data 
    });

  } catch (error) {
    console.error('Indexing API Error:', error.message);
    return NextResponse.json({ 
      message: 'Indexing failed', 
      error: error.message 
    }, { status: 500 });
  }
}