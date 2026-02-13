import { defineField, defineType } from 'sanity'
import { MapPin } from 'lucide-react'

export default defineType({
  name: 'district',
  title: 'الأحياء (Districts)',
  type: 'document',
  icon: MapPin,
  
  // ✅ تقسيم الواجهة
  groups: [
    { name: 'main', title: '🏠 البيانات الأساسية', default: true },
    { name: 'content', title: '📝 المحتوى والمقال' },
    { name: 'seo', title: '🔍 SEO & Google' },
  ],

  fields: [
    // ================================
    // 1️⃣ البيانات الأساسية (Main Info)
    // ================================
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

    // ✅ الحقل ده مهم جداً عشان يربط الحي بالمنطقة
    defineField({
      name: 'location', // (تأكدنا إن ده الاسم المستخدم في الكود الجديد)
      title: 'المنطقة التابع لها (Parent Location)',
      description: 'اختر المنطقة الكبرى التي يتبع لها هذا الحي (مثال: اختر القاهرة الجديدة لحي النرجس)',
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
      options: { hotspot: true },
    }),

    // ✅ (إضافة جديدة) حقل الترتيب عشان تتحكم مين يظهر الأول
    defineField({
      name: 'order',
      title: 'ترتيب العرض (Sorting Order)',
      type: 'number',
      group: 'main',
      initialValue: 0,
    }),

    // ================================
    // 2️⃣ المحتوى (Rich Text)
    // ================================
    defineField({
      name: 'descriptionAr',
      title: 'وصف الحي والمقال (عربي)',
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
        },
        { type: 'image', options: { hotspot: true } } // ✅ السماح بإضافة صور وسط الكلام
      ],
    }),

    // ================================
    // 3️⃣ إعدادات السيو (SEO)
    // ================================
    defineField({
      name: 'seo',
      title: 'إعدادات محركات البحث',
      type: 'seo', // ✅ استدعاء الكبسولة الجاهزة
      group: 'seo'
    })
  ],

  // تحسين شكل الكارت في القائمة
  preview: {
    select: {
      title: 'nameAr',
      subtitle: 'nameEn',
      areaAr: 'location.nameAr', // بيجيب اسم المنطقة الأب
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle, areaAr, media } = selection
      return {
        title: title,
        subtitle: areaAr ? `${subtitle} (تابع لـ: ${areaAr})` : subtitle,
        media: media,
      }
    },
  },
})