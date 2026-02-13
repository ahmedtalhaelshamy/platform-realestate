export const post = {
  name: 'post',
  title: 'المقالات (Blog)',
  type: 'document',
  // ✅ إضافة مجموعات لتنظيم الحقول (Fieldsets)
  fieldsets: [
    { name: 'seo', title: 'إعدادات الأرشفة والظهور (SEO)', options: { collapsible: true, collapsed: true } }
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
          description: 'مهم جداً لمحركات البحث ولتسهيل القراءة لذوي الاحتياجات الخاصة'
        }
      ]
    },
    { 
      name: 'overview', 
      type: 'text', 
      title: 'نبذة مختصرة',
      description: 'تظهر في كارت المقال في الصفحة الرئيسية والمدونة',
      validation: Rule => Rule.required().max(200)
    },
    { 
      name: 'body', 
      type: 'array', 
      title: 'المحتوى التفصيلي', 
      description: 'استخدم العناوين (H2, H3) لتنظيم المقال برمجياً لسيو أفضل',
      of: [
        { 
          type: 'block',
          // ✅ تخصيص العناوين لضمان SEO هيكلي سليم
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

    // 🚀 ✅ قسم السيو المطور (SEO Metadata)
    {
      name: 'seoTitle',
      type: 'string',
      title: 'عنوان السيو (Meta Title)',
      fieldset: 'seo',
      description: 'العنوان الذي يظهر في نتائج بحث جوجل (يفضل 60 حرف)',
      validation: Rule => Rule.max(70)
    },
    {
      name: 'seoDescription',
      type: 'text',
      title: 'وصف السيو (Meta Description)',
      fieldset: 'seo',
      rows: 3,
      description: 'الوصف الذي يظهر تحت العنوان في جوجل (يفضل 160 حرف)',
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

  // تحسين شكل عرض المقال داخل قائمة Sanity
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