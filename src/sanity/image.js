import createImageUrlBuilder from '@sanity/image-url';

// سحب البيانات مباشرة من البيئة (Environment Variables)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source) => {
  const urlBuilder = builder.image(source);
  
  // حفظ الدالة الأصلية للـ url
  const originalUrl = urlBuilder.url.bind(urlBuilder);

  // إعادة تعريف دالة url لتبديل الدومين لـ Bunny CDN
  urlBuilder.url = function() {
    const sanityUrl = originalUrl();
    if (!sanityUrl) return '';
    
    // تحويل أي رابط طالع من سانتي لـ Bunny فوراً
    return sanityUrl.replace('https://cdn.sanity.io', 'https://platform-images.b-cdn.net');
  };

  return urlBuilder;
};