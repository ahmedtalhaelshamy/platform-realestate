import { defineField, defineType } from 'sanity'
import { Building2, Globe, Share2, Search, EyeOff, HelpCircle, MessageSquare } from 'lucide-react'

export default defineType({
  name: 'developer',
  title: 'المطورين (Developers)',
  type: 'document',
  icon: Building2,
  
  // ✅ تقسيم الواجهة
  groups: [
    { name: 'main', title: 'البيانات الأساسية', default: true },
    { name: 'content', title: 'المحتوى والمقال' },
    { name: 'seo_settings', title: '🔍 إعدادات SEO & Schema' }, 
  ],

  fields: [
    // --- 0. SEO & SCHEMA (تطوير شامل) ---
    defineField({
      name: 'seoTitleAr',
      title: 'عنوان SEO (Ar)',
      type: 'string',
      description: 'مثال: شركة إعمار مصر - سابقة الأعمال والمشاريع 2024',
      group: 'seo_settings',
      validation: Rule => Rule.max(60)
    }),
    defineField({
      name: 'seoDescAr',
      title: 'وصف SEO (Ar)',
      type: 'text',
      rows: 3,
      group: 'seo_settings',
      validation: Rule => Rule.max(160)
    }),
    // ✅ إضافة الكلمات الدلالية (Keywords)
    defineField({
      name: 'keywordsAr',
      title: 'الكلمات الدلالية (Ar Keywords)',
      type: 'array',
      group: 'seo_settings',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'اكتب الكلمة واضغط Enter (مثال: عقارات، إعمار، التجمع الخامس)'
    }),
    defineField({
      name: 'keywordsEn',
      title: 'Keywords (En)',
      type: 'array',
      group: 'seo_settings',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    }),
    // ✅ إضافة صورة مشاركة الرابط (OG Image)
    defineField({
      name: 'ogImage',
      title: 'صورة مشاركة الرابط (OG Image)',
      description: 'تظهر عند مشاركة الرابط على السوشيال ميديا (1200x630)',
      type: 'image',
      group: 'seo_settings',
      options: { hotspot: true }
    }),
    // ✅ التحكم في الأرشفة (Indexing)
    defineField({
      name: 'noIndex',
      title: 'إخفاء من محركات البحث (No-Index)',
      description: 'فعل هذا الخيار إذا كنت لا تريد أن تظهر هذه الصفحة في جوجل حالياً',
      type: 'boolean',
      initialValue: false,
      group: 'seo_settings',
      icon: EyeOff
    }),
    defineField({
      name: 'schemaType',
      title: 'نوع الصفحة (Schema Type)',
      type: 'string',
      group: 'seo_settings',
      readOnly: true, 
      initialValue: 'Organization',
      options: { list: ['Organization'] }
    }),
    defineField({
      name: 'socialProfiles',
      title: 'روابط السوشيال ميديا (Social Profiles)',
      description: 'ضع روابط فيسبوك، انستجرام، ولينكد إن الخاصة بالمطور (SameAs Schema).',
      type: 'array',
      group: 'seo_settings',
      of: [{ type: 'url' }],
      icon: Share2
    }),

    // --- 🔹 تبويب البيانات الأساسية ---
    defineField({
      name: 'nameAr',
      title: 'اسم المطور (عربي)',
      type: 'string',
      group: 'main',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'nameEn',
      title: 'Developer Name (English)',
      type: 'string',
      group: 'main',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'رابط الصفحة (Slug)',
      type: 'slug',
      group: 'main',
      options: { source: 'nameEn', maxLength: 96 },
      validation: rule => rule.required()
    }),
    defineField({
      name: 'logo',
      title: 'لوجو الشركة (PNG Transparent)',
      type: 'image',
      group: 'main',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Developer Logo',
        }
      ]
    }),

    // ✅ حقل جديد: عنوان الرأي (Review Headline)
    defineField({
      name: 'reviewTitle',
      title: 'عنوان قسم المراجعة (Review Title)',
      description: 'مثال: لماذا نثق في مشاريع هذا المطور؟',
      type: 'string',
      group: 'main',
    }),

    defineField({
      name: 'badges',
      title: 'شارات التميز (Badges)',
      type: 'array',
      group: 'main',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '🛡️ مطور استراتيجي (Strategic Partner)', value: 'strategic' },
          { title: '🏆 رائد السوق (Market Leader)', value: 'market_leader' },
          { title: '💎 خبير العقارات الفاخرة (Luxury Expert)', value: 'luxury' },
          { title: '🌍 مطور دولي (Global Developer)', value: 'global' },
          { title: '⭐ الأعلى مبيعاً (Best Seller)', value: 'best_seller' },
          { title: '⚡ الأسرع تسليماً (Fast Delivery)', value: 'fast_delivery' },
          { title: '📈 أعلى عائد (High ROI)', value: 'high_roi' },
          { title: '🌱 عمارة مستدامة (Sustainable)', value: 'sustainable' },
        ],
      },
    }),
    
    defineField({
      name: 'foundedYear',
      title: 'سنة التأسيس (Founded Year)',
      type: 'number',
      group: 'main',
    }),
    defineField({
      name: 'website',
      title: 'الموقع الرسمي للمطور (اختياري)',
      type: 'url',
      group: 'main',
      icon: Globe
    }),

    // --- 🔹 تبويب المحتوى ---
    defineField({
      name: 'descriptionAr',
      title: 'نبذة عن الشركة (عربي)',
      type: 'array', 
      group: 'content',
      of: [{type: 'block'}], 
    }),
    defineField({
      name: 'descriptionEn',
      title: 'About Developer (English)',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}]
    }),

    // ✅ حقل جديد: الأسئلة الشائعة (FAQs)
    defineField({
      name: 'faqs',
      title: 'الأسئلة الشائعة (FAQs)',
      description: 'أضف أسئلة وأجوبة تهم العميل بخصوص هذا المطور لتحسين الـ SEO',
      type: 'array',
      group: 'content',
      icon: HelpCircle,
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'سؤال وجواب',
          fields: [
            { name: 'questionAr', title: 'السؤال (عربي)', type: 'string' },
            { name: 'answerAr', title: 'الجواب (عربي)', type: 'text', rows: 3 },
            { name: 'questionEn', title: 'Question (English)', type: 'string' },
            { name: 'answerEn', title: 'Answer (English)', type: 'text', rows: 3 },
          ],
          preview: {
            select: {
              title: 'questionAr',
              subtitle: 'answerAr'
            }
          }
        }
      ]
    }),
  ],

  preview: {
    select: {
      title: 'nameAr',
      subtitle: 'nameEn',
      media: 'logo'
    }
  }
})