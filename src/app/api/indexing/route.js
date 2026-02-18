import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { secret, slug } = body;

    // التحقق من كلمة السر
    if (secret !== process.env.INDEXING_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // معالجة المفتاح لضمان قبول الأسطر الجديدة سواء كانت حقيقية أو رموز \n
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (!privateKey) {
      throw new Error("GOOGLE_PRIVATE_KEY is missing");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing('v3');
    const urlToIndex = `https://platformrealestate.co/ar/projects/${slug}`;

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