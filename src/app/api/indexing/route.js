import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { secret, slug } = body;

    // التأكد من أن الطلب قادم من Sanity
    if (secret !== process.env.INDEXING_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing('v3');
    // بناء الرابط الخاص بمشاريع هايد بارك وغيرها
    const urlToIndex = `https://platformrealestate.co/ar/projects/${slug}`;

    await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url: urlToIndex,
        type: 'URL_UPDATED',
      },
    });

    return NextResponse.json({ message: 'تم إرسال طلب الفهرسة بنجاح' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}