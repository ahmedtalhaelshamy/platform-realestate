import { defineField, defineType } from 'sanity'
import { Map, Share2, Search } from 'lucide-react'

export default defineType({
  name: 'location',
  title: 'المناطق (Locations)',
  type: 'document',
  icon: Map,
  
  // ✅ تقسيم الواجهة لثلاث تبويبات مريحة
  groups: [
    { name: 'main', title: '🏠 البيانات الأساسية', default: true },
    { name: 'content', title: '📝 المحتوى والمقال' },
    { name: 'seo', title: '🔍 SEO & Social' },
  ],

  fields: [
    // ================================
    // 1️⃣ البيانات الأساسية (Main Info)
    // ================================
    defineField({
      name: 'nameAr',
      title: 'اسم المنطقة (عربي)',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    
    defineField({
      name: 'nameEn',
      title: 'Area Name (English)',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    
    defineField({
      name: 'slug',
      title: 'رابط المنطقة (Slug)',
      description: 'الجزء الذي يظهر في رابط الموقع (URL). اضغط Generate ليتم إنشاؤه تلقائياً.',
      type: 'slug',
      group: 'main',
      options: { 
        source: 'nameEn', 
        maxLength: 96 
      },
      validation: (rule) => rule.required(),
    }),
    
    defineField({
      name: 'image',
      title: 'صورة الغلاف للمنطقة (Cover Image)',
      type: 'image',
      group: 'main',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'نص بديل للصورة (Alt Text)',
          type: 'string',
        }
      ]
    }),

    defineField({
      name: 'isFeatured',
      title: '⭐ منطقة مميزة (تظهر في الرئيسية)',
      type: 'boolean',
      group: 'main',
      initialValue: false
    }),

    defineField({
      name: 'order',
      title: 'ترتيب العرض (Sorting Order)',
      type: 'number',
      group: 'main',
      initialValue: 0,
    }),

    // ================================
    // 2️⃣ المحتوى والمقال (Content)
    // ================================
    defineField({
      name: 'descriptionAr',
      title: 'المقال التفصيلي (عربي)',
      description: 'اكتب هنا كل التفاصيل عن المنطقة، مميزاتها، وموقعها. يمكنك إضافة صور داخل النص.',
      type: 'array',
      group: 'content',
      of: [
        { 
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'عنوان رئيسي (H2)', value: 'h2'},
            {title: 'عنوان فرعي (H3)', value: 'h3'},
            {title: 'اقتباس', value: 'blockquote'},
          ],
        },
        { type: 'image', options: { hotspot: true } } // ✅ السماح بإضافة صور وسط الكلام
      ],
    }),

    defineField({
      name: 'descriptionEn',
      title: 'Detailed Article (English)',
      type: 'array',
      group: 'content',
      of: [
        { 
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
        },
        { type: 'image', options: { hotspot: true } }
      ],
    }),

    // ================================
    // 3️⃣ إعدادات السيو (SEO Settings)
    // ================================
    defineField({
      name: 'seo',
      title: 'إعدادات محركات البحث (SEO)',
      type: 'object',
      group: 'seo',
      icon: Search,
      fields: [
        // Meta Titles
        defineField({
          name: 'metaTitleAr',
          title: 'عنوان الصفحة في جوجل (Ar)',
          type: 'string',
          validation: Rule => Rule.max(60).warning('يفضل أن يكون أقل من 60 حرف'),
        }),
        defineField({
          name: 'metaTitleEn',
          title: 'Meta Title (En)',
          type: 'string',
          validation: Rule => Rule.max(60).warning('Should be under 60 characters'),
        }),

        // Meta Descriptions
        defineField({
          name: 'metaDescAr',
          title: 'وصف الصفحة في جوجل (Ar)',
          description: 'الوصف الذي يظهر تحت العنوان في نتائج البحث.',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160).warning('يفضل أن يكون أقل من 160 حرف'),
        }),
        defineField({
          name: 'metaDescEn',
          title: 'Meta Description (En)',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.max(160),
        }),

        // Keywords
        defineField({
          name: 'keywordsAr',
          title: 'الكلمات الدلالية (Keywords Ar)',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          }
        }),
        defineField({
          name: 'keywordsEn',
          title: 'Keywords (En)',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          }
        }),

        // Social Share Image
        defineField({
          name: 'openGraphImage',
          title: 'صورة المشاركة (Social Media Image)',
          description: 'الصورة التي تظهر عند مشاركة الرابط على فيسبوك أو واتساب (لو تركتها فارغة سيتم استخدام الصورة الرئيسية).',
          type: 'image',
          options: { hotspot: true },
        }),
      ]
    }),
  ],
  
  // شكل الكارت من بره في لوحة التحكم
  preview: {
    select: {
      titleAr: 'nameAr',
      titleEn: 'nameEn',
      media: 'image',
      isFeatured: 'isFeatured'
    },
    prepare(selection) {
      const { titleAr, titleEn, media, isFeatured } = selection
      return {
        title: titleAr || titleEn,
        subtitle: `${titleEn || ''} ${isFeatured ? '⭐ مميزة' : ''}`,
        media: media,
      }
    },
  },
})