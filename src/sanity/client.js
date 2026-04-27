// مسار الملف: src/sanity/client.js
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

/**
 * إعدادات العميل لـ Sanity
 * تم تغيير useCdn إلى true لزيادة الحصة المجانية إلى مليون طلب شهرياً
 * ولتحسين سرعة الموقع باستخدام النسخ المخزنة (Cache).
 */
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', 
  useCdn: true, // الآن ستحصل على مليون طلب مجاني بدلاً من 250 ألف
})

const builder = imageUrlBuilder(client)

/**
 * دالة توليد روابط الصور
 * معدلة لتدعم الـ Bunny CDN تلقائياً إذا كان مفعلاً لديك
 */
export function urlFor(source) {
  if (!source) return '';

  const url = builder.image(source).url();

  // نصيحة احترافية: إذا كان لديك رابط Bunny Pull Zone، 
  // يمكنك فك التعليق عن السطرين القادمين لتبديل الروابط تلقائياً
  // const bunnyDomain = 'https://your-zone-name.b-cdn.net'; 
  // return url.replace('https://cdn.sanity.io', bunnyDomain);

  return url;
}