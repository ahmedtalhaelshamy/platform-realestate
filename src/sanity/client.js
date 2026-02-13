// مسار الملف: src/sanity/client.js
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // تأكد أن هذا المتغير موجود في .env
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', // أو التاريخ الذي تستخدمه
  useCdn: false, // نجعلها false لضمان تحديث البيانات فوراً
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}