// src/sanity/lib/client.js

import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// تأكد من أن القيم موجودة في ملف .env الخاص بك
// NEXT_PUBLIC_SANITY_PROJECT_ID
// NEXT_PUBLIC_SANITY_DATASET

export const client = createClient({
  projectId: projectId || "8zxxxxxx", // استبدل 8zxxxxxx بالـ ID الحقيقي الخاص بك كاحتياط
  dataset: dataset || "production",
  apiVersion: apiVersion || "2026-01-30",
  useCdn: true, 
  // نصيحة: اترك useCdn: true لجلب البيانات بسرعة في المدونة
  // إلا إذا كنت تستخدم التحديث اللحظي (Webhooks) فاجعلها false
})

/**
 * استشارة فنية:
 * تأكد أن ملف الـ env.js (الموجود في المجلد المجاور) 
 * يقوم بتصدير القيم من ملف الـ .env.local هكذا:
 * * export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
 * export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
 */