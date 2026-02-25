import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'إعدادات الأرشفة (SEO)',
  type: 'object',
  fields: [
    // --- 🌍 القسم العربي ---
    defineField({
      name: 'metaTitleAr',
      title: 'Meta Title (AR)',
      type: 'string',
      description: 'العنوان الذي يظهر في جوجل (عربي) - يفضل 60 حرف.',
      validation: Rule => Rule.max(60).warning('العنوان طويل جداً'),
    }),
    defineField({
      name: 'h1Ar', 
      title: 'H1 العنوان الرئيسي (AR)',
      type: 'string',
    }),
    defineField({
      name: 'metaDescAr',
      title: 'Meta Description (AR)',
      type: 'text',
      rows: 3,
      description: 'الوصف الذي يظهر في جوجل (عربي) - يفضل 160 حرف.',
      validation: Rule => Rule.max(160).warning('الوصف طويل جداً'),
    }),
    defineField({
      name: 'keywordsAr',
      title: 'Keywords (AR)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // --- 🌍 القسم الإنجليزي ---
    defineField({
      name: 'metaTitleEn',
      title: 'Meta Title (EN)',
      type: 'string',
    }),
    defineField({
      name: 'h1En', 
      title: 'H1 Main Heading (EN)',
      type: 'string',
    }),
    defineField({
      name: 'metaDescEn',
      title: 'Meta Description (EN)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'keywordsEn',
      title: 'Keywords (EN)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // --- 🖼️ الصورة الاجتماعية (Social Image) ---
    defineField({
      name: 'openGraphImage',
      title: 'Social Share Image',
      description: 'الصورة التي تظهر عند مشاركة الرابط (يفضل 1200x630px)',
      type: 'image',
      options: { hotspot: true }
    })
  ]
})