// schemas/sitemapPage.js

export default {
  name: 'sitemapPage',
  type: 'document',
  title: 'إعدادات صفحة خريطة الموقع',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'عنوان الصفحة الداخلي',
      initialValue: 'خريطة الموقع - Sitemap',
      readOnly: true, // للقراءة فقط لأنه مجرد تعريف للوثيقة في لوحة التحكم
    },
    {
      name: 'seo',
      type: 'object',
      title: 'إعدادات محركات البحث (SEO)',
      fields: [
        {
          name: 'metaTitleAr',
          type: 'string',
          title: 'عنوان الصفحة (عربي)',
          description: 'مثال: خريطة الموقع | بلاتفورم للاستثمار العقاري',
        },
        {
          name: 'metaTitleEn',
          type: 'string',
          title: 'Meta Title (English)',
          description: 'Example: Site Map | Platform Real Estate',
        },
        {
          name: 'metaDescAr',
          type: 'text',
          title: 'وصف الصفحة (عربي)',
          description: 'وصف قصير يظهر في نتائج بحث جوجل (160 حرفاً بحد أقصى)',
        },
        {
          name: 'metaDescEn',
          type: 'text',
          title: 'Meta Description (English)',
        },
        {
          name: 'keywordsAr',
          type: 'string',
          title: 'كلمات مفتاحية (عربي)',
        },
        {
          name: 'keywordsEn',
          type: 'string',
          title: 'Keywords (English)',
        },
        {
          name: 'openGraphImage',
          type: 'image',
          title: 'صورة المشاركة (Social Image)',
          description: 'الصورة التي تظهر عند مشاركة رابط خريطة الموقع على السوشيال ميديا',
          options: {
            hotspot: true,
          },
        },
      ],
    },
  ],
};