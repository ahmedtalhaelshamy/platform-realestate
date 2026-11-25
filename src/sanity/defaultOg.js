import { cache } from 'react';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { hasImage } from '@/sanity/hasImage';

const SITE = 'https://platformrealestate.co';

/**
 * صورة OG الافتراضية للموقع: من إعدادات Sanity (siteSettings.seo.openGraphImage)،
 * ثم صورة الـ Hero، وأخيراً /logo.webp الموجود في public.
 * (og-image.png/.jpg غير موجودين في public، فكانت الروابط القديمة 404)
 */
export const getDefaultOgImage = cache(async () => {
  try {
    const s = await client.fetch(
      `*[_type == "siteSettings"][0]{ "og": seo.openGraphImage, "hero": heroImage }`,
      {},
      { next: { revalidate: 3600 } }
    );
    const src = hasImage(s?.og) ? s.og : hasImage(s?.hero) ? s.hero : null;
    if (src) {
      const url = urlFor(src).width(1200).height(630).fit('crop').format('jpg').url();
      if (url) return url;
    }
  } catch (e) {
    console.error('Default OG fetch error:', e);
  }
  return `${SITE}/logo.webp`;
});
