// مسار الملف: src/sanity/client.js
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

/**
 * إعدادات العميل لـ Sanity
 * تم تفعيل useCdn لحل مشكلة استهلاك الـ API وتوفير 1,000,000 طلب مجاني.
 */
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', 
  useCdn: true, // تفعيل الـ CDN لفتح الحظر عن الموقع
})

const builder = imageUrlBuilder(client)

/**
 * دالة توليد روابط الصور
 * تم إرجاعها لشكلها الأصلي المتوافق مع الكود الحالي للموقع لمنع أخطاء الـ Build
 */
export function urlFor(source) {
  return builder.image(source)
}