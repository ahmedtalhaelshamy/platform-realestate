import createImageUrlBuilder from '@sanity/image-url'
import { client } from './client' // تأكد إن المسار لملف client صح

const builder = createImageUrlBuilder(client)

export function urlFor(source) {
  // ✅ شيلنا الشرط عشان الدالة ترجع دايماً Builder يقبل الـ width والـ height
  return builder.image(source)
}