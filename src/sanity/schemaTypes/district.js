import { defineField, defineType } from 'sanity'
import { MapPin, Cpu, HelpCircle } from 'lucide-react'

export default defineType({
  name: 'district',
  title: 'الأحياء (Districts)',
  type: 'document',
  icon: MapPin,
  
  // ✅ تقسيم الواجهة
  groups: [
    { name: 'main', title: '🏠 البيانات الأساسية', default: true },
    { name: 'content', title: '📝 المحتوى والمقال' },
    { name: 'aiFeatures', title: '🤖 ذكاء اصطناعي (GEO & AEO)' },
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

    defineField({
      name: 'location',
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

    defineField({
      name: 'order',
      title: 'ترتيب العرض (Sorting Order)',
      type: 'number',
      group: 'main',
      initialValue: 0,
    }),

    // ==========================================
    // 2️⃣ حقول الذكاء الاصطناعي (GEO & AEO Updates)
    // ==========================================
    defineField({
      name: 'aiSummaryAr',
      title: 'نقاط تلخيصية للذكاء الاصطناعي (Ar) - GEO',
      type: 'array',
      group: 'aiFeatures',
      icon: Cpu,
      of: [{type: 'string'}],
      description: 'أضف أهم 3 نقاط تميز هذا الحي (مثال: القرب من الجامعة الأمريكية، هدوء تام، مرافق متكاملة).'
    }),
    defineField({
      name: 'aiSummaryEn',
      title: 'AI Summary Highlights (En)',
      type: 'array',
      group: 'aiFeatures',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'faqs',
      title: 'أسئلة شائعة عن الحي (AEO FAQ Schema)',
      type: 'array',
      group: 'aiFeatures',
      icon: HelpCircle,
      of: [{
        type: 'object',
        fields: [
          {name: 'questionAr', title: 'السؤال (عربي)', type: 'string'},
          {name: 'answerAr', title: 'الجواب (عربي)', type: 'text', rows: 3},
          {name: 'questionEn', title: 'Question (English)', type: 'string'},
          {name: 'answerEn', title: 'Answer (English)', type: 'text', rows: 3}
        ]
      }],
      description: 'الأسئلة التي يطرحها الناس غالباً عن هذا الحي (مثل: ما هي أسعار المتر في حي النرجس؟).'
    }),

    // ================================
    // 3️⃣ المحتوى (Rich Text)
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
        { type: 'image', options: { hotspot: true } }
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
        { type: 'image', options: { hotspot: true } }
      ],
    }),

    // ================================
    // 4️⃣ إعدادات السيو (SEO)
    // ================================
    defineField({
      name: 'seo',
      title: 'إعدادات محركات البحث',
      type: 'seo', 
      group: 'seo'
    })
  ],

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
        subtitle: areaAr ? `${subtitle} (تابع لـ: ${areaAr})` : subtitle,
        media: media,
      }
    },
  },
})