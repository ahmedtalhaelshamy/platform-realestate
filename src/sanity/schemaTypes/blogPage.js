export default {
  name: 'blogPage',
  title: 'إعدادات صفحة المدونة',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'عنوان الصفحة الداخلي',
      type: 'string',
      initialValue: 'إعدادات المدونة',
      readOnly: true,
    },
    {
      name: 'seo',
      title: 'إعدادات الأرشفة (SEO)',
      type: 'object',
      fields: [
        { name: 'metaTitleAr', title: 'عنوان الميتا (عربي)', type: 'string' },
        { name: 'metaTitleEn', title: 'Meta Title (English)', type: 'string' },
        { name: 'metaDescAr', title: 'وصف الميتا (عربي)', type: 'text' },
        { name: 'metaDescEn', title: 'Meta Description (English)', type: 'text' },
        { name: 'keywordsAr', title: 'الكلمات المفتاحية (عربي)', type: 'array', of: [{type: 'string'}] },
        { name: 'keywordsEn', title: 'Keywords (English)', type: 'array', of: [{type: 'string'}] },
        { name: 'openGraphImage', title: 'صورة المشاركة (OG Image)', type: 'image' },
      ]
    }
  ]
}