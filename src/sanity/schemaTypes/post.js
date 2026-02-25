export const post = {
  name: 'post',
  title: 'المقالات (Blog)',
  type: 'document',
  fieldsets: [
    { name: 'seo', title: 'إعدادات الأرشفة والظهور (SEO)', options: { collapsible: true, collapsed: true } },
    { name: 'relations', title: 'الروابط والارتباطات (Internal Links)', options: { collapsible: true } }
  ],
  fields: [
    { 
      name: 'title', 
      type: 'string', 
      title: 'عنوان المقال الرئيسي (H1)',
      description: 'العنوان الذي يظهر داخل صفحة المقال',
      validation: Rule => Rule.required() 
    },
    { 
      name: 'slug', 
      type: 'slug', 
      title: 'رابط المقال (Slug)', 
      options: { source: 'title' },
      validation: Rule => Rule.required()
    },
    { 
      name: 'language', 
      type: 'string', 
      title: 'اللغة', 
      options: { 
        list: [
          { title: 'العربية', value: 'ar' },
          { title: 'English', value: 'en' }
        ] 
      },
      validation: Rule => Rule.required()
    },
    { 
      name: 'mainImage', 
      type: 'image', 
      title: 'الصورة الرئيسية', 
      options: { hotspot: true },
      validation: Rule => Rule.required(),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'وصف الصورة (Alt Text)',
        }
      ]
    },
    { 
      name: 'overview', 
      type: 'text', 
      title: 'نبذة مختصرة',
      description: 'تظهر في كارت المقال وفي نتائج البحث',
      validation: Rule => Rule.required().max(200)
    },
    { 
      name: 'body', 
      type: 'array', 
      title: 'المحتوى التفصيلي', 
      of: [
        { 
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2 (H2)', value: 'h2' },
            { title: 'Heading 3 (H3)', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ]
        }, 
        { type: 'image', options: { hotspot: true } }
      ] 
    },

    // 🚀 قسم العلاقات (تم إضافة المنطقة والمطور والحي والمشروع)
    {
      name: 'relatedProjects',
      title: 'مشاريع مرتبطة بالخبر',
      type: 'array',
      fieldset: 'relations',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'اختر المشاريع التي يتحدث عنها هذا المقال'
    },
    {
      name: 'relatedDevelopers',
      title: 'مطورون عقاريون مرتبطون',
      type: 'array',
      fieldset: 'relations',
      of: [{ type: 'reference', to: [{ type: 'developer' }] }],
      description: 'اختر المطورين المذكورين في هذا الخبر'
    },
    {
      name: 'relatedLocations',
      title: 'مناطق مرتبطة (المدن)',
      type: 'array',
      fieldset: 'relations',
      of: [{ type: 'reference', to: [{ type: 'location' }] }],
      description: 'اختر المناطق الكبرى المرتبطة (مثل: القاهرة الجديدة، العاصمة الإدارية)'
    },
    {
      name: 'relatedDistricts',
      title: 'أحياء ومناطق فرعية مرتبطة',
      type: 'array',
      fieldset: 'relations',
      of: [{ type: 'reference', to: [{ type: 'district' }] }],
      description: 'اختر الأحياء الدقيقة (مثل: التجمع الخامس، منطقة المستثمرين)'
    },

    // قسم السيو (SEO Metadata)
    {
      name: 'seoTitle',
      type: 'string',
      title: 'عنوان السيو (Meta Title)',
      fieldset: 'seo',
      validation: Rule => Rule.max(70)
    },
    {
      name: 'seoDescription',
      type: 'text',
      title: 'وصف السيو (Meta Description)',
      fieldset: 'seo',
      rows: 3,
      validation: Rule => Rule.max(160)
    },
    {
      name: 'keywords',
      type: 'array',
      title: 'الكلمات المفتاحية (Keywords)',
      fieldset: 'seo',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'language',
      media: 'mainImage'
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === 'ar' ? '🇸🇦 العربية' : '🇺🇸 English',
        media
      }
    }
  }
}