import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'
import { hasImage, emptyImageBuilder } from '../hasImage'

// إعداد الـ Builder باستخدام بيانات المشروع والـ Dataset
const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * دالة urlFor المحسنة
 * .auto('format'): لتحويل الصورة تلقائياً لـ WebP أو AVIF حسب المتصفح.
 * .fit('max'): لضمان عدم تكبير الصورة عن حجمها الأصلي.
 */
export const urlFor = (source) => {
  if (!hasImage(source)) return emptyImageBuilder;

  // بنرجع الـ builder عشان تقدر تضيف عليه .width() أو .height() براحتك في الكود
  return builder.image(source).auto('format').fit('max');
}