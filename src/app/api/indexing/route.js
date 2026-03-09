import { google } from 'googleapis';
import { NextResponse } from 'next/server';

/**
 * 🤖 Google Indexing Gateway - Platform Real Estate Standard 2026
 * المهمة: أرشفة المشاريع، المطورين، المناطق، والأحياء فور النشر.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    
    // 1. استلام البيانات مع القيم الافتراضية
    const { secret, slug, lang = 'ar', type = 'project' } = body;

    // 2. التحقق من أمن الطلب
    if (!process.env.INDEXING_SECRET || secret !== process.env.INDEXING_SECRET) {
      console.error('❌ Indexing Auth Failed: Invalid Secret');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
    }

    // 3. معالجة بيانات الاعتماد الخاصة بجوجل
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

    if (!privateKey || !clientEmail) {
      throw new Error("Google Credentials missing in Vercel environment variables");
    }

    // 4. إعداد نظام الصلاحيات
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing('v3');

    // 5. بناء الرابط بذكاء (Mapping) ليتوافق مع هيكل الموقع الجديد
    const baseUrl = 'https://platformrealestate.co';
    
    // تنظيف الـ slug من أي مائلات زائدة في البداية أو النهاية
    const cleanSlug = slug.toString().replace(/^\/+|\/+$/g, '');

    let folderName = 'projects'; 
    if (type === 'developer') folderName = 'developers';
    if (type === 'location')  folderName = 'locations'; 
    if (type === 'district')  folderName = 'districts'; 
    if (type === 'post')      folderName = 'blog'; 
    if (type === 'project')   folderName = 'projects';

    // بناء الرابط النهائي مع ضمان الـ Trailing Slash (المعيار الذهبي للسيو)
    const urlToIndex = `${baseUrl}/${lang}/${folderName}/${cleanSlug}/`;

    // 6. إخطار جوجل بالرابط الجديد أو المحدث
    // ملاحظة: نستخدم URL_UPDATED لأنها تعمل للروابط الجديدة والمعدلة معاً
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
      url: urlToIndex, 
      status: response.statusText,
      data: response.data 
    });

  } catch (error) {
    // 7. تسجيل الخطأ بالتفصيل
    console.error('❌ [Indexing Error]:', {
      message: error.message,
      googleDetails: error.response?.data || 'Ensure service account is owner in Search Console'
    });

    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.response?.data?.error?.message || 'Permission Denied or Sync Issue'
    }, { status: 500 });
  }
}