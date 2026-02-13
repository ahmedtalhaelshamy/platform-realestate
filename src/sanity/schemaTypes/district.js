import { defineField, defineType } from 'sanity'
import { MapPin } from 'lucide-react'

export default defineType({
  name: 'district',
  title: 'الأحياء (Districts)',
  type: 'document',
  icon: MapPin,
  
  // ✅ 1. تنظيم الواجهة في تبويبات (Tabs)
  groups: [
    { name: 'main', title: 'البيانات الأساسية', default: true },
    { name: 'content', title: 'المحتوى والمقال' },
    { name: 'seo', title: 'SEO & Google 🚀' },
  ],

  fields: [
    // --- 🔹 تبويب البيانات الأساسية ---
    defineField({
      name: 'nameAr',
      title: 'اسم الحي (عربي)',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required().error('الاسم العربي مطلوب'),
    }),

    defineField({
      name: 'nameEn',
      title: 'District Name (English)',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required().error('English name is required'),
    }),

    defineField({
      name: 'slug',
      title: 'رابط الحي (Slug)',
      type: 'slug',
      group: 'main',
      options: { 
        source: 'nameEn', 
        maxLength: 96 
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'location',
      title: 'المنطقة التابع لها (Parent Location)',
      description: 'اختر المنطقة الكبرى التي يتبع لها هذا الحي (مثال: القاهرة الجديدة)',
      type: 'reference',
      group: 'main',
      to: [{ type: 'location' }], 
      validation: (rule) => rule.required().error('يجب ربط الحي بمنطقة رئيسية'),
    }),

    defineField({
      name: 'image',
      title: 'صورة الحي',
      type: 'image',
      group: 'main',
      options: { 
        hotspot: true 
      },
    }),

    // --- 🔹 تبويب المحتوى (Rich Text) ---
    defineField({
      name: 'descriptionAr',
      title: 'وصف الحي (عربي)',
      type: 'array',
      group: 'content',
      of: [
        { 
          type: 'block',
          // ✅ تم إضافة H2 و H3 لتحسين هيكلية المقال
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
        }
      ],
    }),

    defineField({
      name: 'descriptionEn',
      title: 'District Description (English)',
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
        }
      ],
    }),

    // --- 🔹 تبويب الـ SEO ---
    // ✅ استدعاء كبسولة الـ SEO
    defineField({
      name: 'seo',
      title: 'إعدادات محركات البحث',
      type: 'seo', // 👈 الربط بالملف الذي أنشأناه
      group: 'seo'
    })
  ],

  // تحسين العرض في القائمة
  preview: {
    select: {
      title: 'nameAr',
      subtitle: 'nameEn',
      areaAr: 'location.nameAr',
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle, areaAr, media } = selection
      return {
        title: title,
        subtitle: areaAr ? `${subtitle} - (${areaAr})` : subtitle,
        media: media,
      }
    },
  },
})