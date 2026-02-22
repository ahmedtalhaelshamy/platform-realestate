import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { secret, slug, lang = 'ar', type = 'projects' } = body;

    // التحقق من الأمان
    if (!process.env.INDEXING_SECRET || secret !== process.env.INDEXING_SECRET) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    // ---------------------------------------------------------
    // 👇👇 ده الجزء اللي سألت عليه (مكانه هنا بالظبط) 👇👇
    // ---------------------------------------------------------
    const indexing = google.indexing('v3');

    // بناء الرابط ليكون مطابقاً تماماً لما هو موثق في Search Console و Vercel
    const baseUrl = 'https://platformrealestate.co'; 
    const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
    
    // إجبار الرابط على الانتهاء بـ / ليتطابق مع الـ URL Prefix الموثق
    const urlToIndex = `${baseUrl}/${lang}/${type}/${cleanSlug}/`.replace(/\/+$/, '/');

    const response = await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url: urlToIndex,
        type: 'URL_UPDATED',
      },
    });
    // ---------------------------------------------------------
    // 👆👆 نهاية الجزء اللي سألت عليه 👆👆
    // ---------------------------------------------------------

    console.log(`✅ [Success]: ${urlToIndex}`);
    return NextResponse.json({ success: true, url: urlToIndex, data: response.data });

  } catch (error) {
    console.error('❌ [Indexing Error]:', error.response?.data || error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.response?.data?.error?.message || 'Permission Denied'
    }, { status: 500 });
  }
}