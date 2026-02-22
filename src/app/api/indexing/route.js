import { google } from 'googleapis';
import { NextResponse } from 'next/server';

/**
 * 🤖 Google Indexing Gateway - Platform Real Estate Standard 2026
 * المهمة: إخطار جوجل فوراً لضمان أرشفة لحظية للمشاريع والمقالات.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    
    // 1. استلام البيانات مع الحفاظ على الخيارات الافتراضية الذكية
    const { secret, slug, lang = 'ar', type = 'projects' } = body;

    // 2. التحقق من أمن الطلب (Security Shield)
    if (!process.env.INDEXING_SECRET || secret !== process.env.INDEXING_SECRET) {
      console.error('Indexing Auth Failed: Missing or Invalid Secret Key');
      return NextResponse.json({ success: false, message: 'Unauthorized Access' }, { status: 401 });
    }

    // 3. التحقق من وجود المعرف (Slug)
    if (!slug) {
      return NextResponse.json({ success: false, message: 'Resource Slug is required' }, { status: 400 });
    }

    // 4. معالجة المفتاح الخاص لبيئات Vercel/Production
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

    if (!privateKey || !clientEmail) {
      throw new Error("Critical Google Credentials (Private Key or Client Email) are missing");
    }

    // 5. إعداد نظام الصلاحيات المعتمد من جوجل
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing('v3');

    // 6. بناء الرابط الموحد المعتمد (Strict Trailing Slash Enforcement)
    // النتيجة: https://platformrealestate.co/ar/projects/district-one-west/
    const urlToIndex = `https://platformrealestate.co/${lang}/${type}/${slug}/`;

    // 7. تنفيذ طلب الإرسال (The Core Action)
    // نستخدم URL_UPDATED لأنه يصلح للإضافة الجديدة والتحديث معاً
    const response = await indexing.urlNotifications.publish({
      auth,
      requestBody: {
        url: urlToIndex,
        type: 'URL_UPDATED',
      },
    });

    // 8. تسجيل العملية بنجاح في سجلات النظام
    console.log(`[Indexing Success] Google notified for: ${urlToIndex}`);

    return NextResponse.json({ 
      success: true,
      message: 'Google Indexing triggered successfully!', 
      url: urlToIndex,
      googleResponse: response.data 
    });

  } catch (error) {
    // معالجة الأخطاء الحرجة وتسجيلها بدقة
    console.error('Indexing API Error Log:', {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json({ 
      success: false,
      message: 'Indexing operation failed', 
      error: error.message 
    }, { status: 500 });
  }
}