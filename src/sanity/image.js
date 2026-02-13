import imageUrlBuilder from '@sanity/image-url'
import { client } from './client' // تأكد أن client.js موجود في نفس المجلد src/sanity/

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  if (!source) return { url: () => "" }; // حماية إضافية لو مفيش صورة
  return builder.image(source)
}