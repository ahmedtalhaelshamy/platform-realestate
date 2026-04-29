import { defineField, defineType } from 'sanity'
import { Cog, Phone, Cpu, HelpCircle, Share2 } from 'lucide-react'

export default defineType({
  name: 'siteSettings',
  title: '⚙️ إعدادات الموقع (Site Settings)',
  type: 'document',
  icon: Cog,
  
  // ✅ تنظيم المجموعات لتشمل الذكاء الاصطناعي وبيانات الثقة
  groups: [
    { name: 'hero', title: 'واجهة الصفحة الرئيسية', default: true },
    { name: 'social', title: 'السوشيال ميديا' },
    { name: 'contact', title: '📞 بيانات التواصل (E-E-A-T)' }, // مجموعة جديدة للثقة
    { name: 'aiFeatures', title: '🤖 ذكاء اصطناعي (GEO & AEO)' }, // مجموعة جديدة للمحركات التوليدية
    { name: 'seo', title: 'SEO & Google' },
  ],

  fields: [
    // --- 🏆 1. HERO SECTION ---
    defineField({
      name: 'titleAr',
      title: 'اسم الموقع / العنوان - عربي',
      type: 'string',
      group: 'hero',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'titleEn',
      title: 'Site Name / Title (English)',
      type: 'string',
      group: 'hero',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'descriptionAr',
      title: 'وصف الموقع المختصر - عربي (يظهر في الفوتر)',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Site Description (English - Footer)',
      type: 'text',
      rows: 3,
      group: 'hero'
    }),
    defineField({
      name: 'heroImage',
      title: 'صورة خلفية الهيرو الرئيسية',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text (SEO)', type: 'string' }
      ]
    }),

    // --- 📞 2. CONTACT INFO (Trust Signals / E-E-A-T) ---
    // هذه البيانات ضرورية جداً لمحركات الذكاء الاصطناعي لإثبات أنكم كيان حقيقي
    defineField({
      name: 'contactInfo',
      title: 'بيانات التواصل والمقر الرسمي',
      type: 'object',
      group: 'contact',
      icon: Phone,
      fields: [
        { name: 'phone', title: 'رقم الهاتف الرسمي', type: 'string' },
        { name: 'whatsapp', title: 'رقم الواتساب', type: 'string' },
        { name: 'email', title: 'البريد الإلكتروني الرسمي', type: 'string' },
        { name: 'addressAr', title: 'عنوان المقر (عربي)', type: 'string' },
        { name: 'addressEn', title: 'Headquarters Address (En)', type: 'string' },
      ]
    }),

    // --- 🤖 3. AI & ANSWER ENGINE FEATURES (GEO & AEO) ---
    defineField({
      name: 'aiSummaryAr',
      title: 'خلاصة تعريف الموقع للذكاء الاصطناعي (Ar)',
      type: 'array',
      group: 'aiFeatures',
      icon: Cpu,
      of: [{type: 'string'}],
      description: 'أهم 3-4 نقاط تميز المنصة (تستخدمها ChatGPT وجوجل للتعريف بموقعكم في الإجابات المباشرة).'
    }),
    defineField({
      name: 'aiSummaryEn',
      title: 'Global AI Summary (En)',
      type: 'array',
      group: 'aiFeatures',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'globalFaqs',
      title: 'أسئلة شائعة عامة عن السوق (AEO)',
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
      description: 'أضف أسئلة عامة مثل: "لماذا استثمر في عقارات مصر؟" لتظهر كإجابة مباشرة في المحركات.'
    }),

    // --- 🌐 4. SOCIAL MEDIA ---
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
      group: 'social'
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      group: 'social'
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'social'
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube URL',
      type: 'url',
      group: 'social'
    }),
    defineField({
      name: 'tiktok',
      title: 'TikTok URL',
      type: 'url',
      group: 'social'
    }),

    // --- 🔍 5. SEO SETTINGS ---
    defineField({
      name: 'metaTitleAr',
      title: 'العنوان الأساسي للسيو (عربي)',
      description: 'اكتب هنا عنوان الصفحة كما تريده أن يظهر في جوجل (بدون اسم الموقع)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaTitleEn',
      title: 'Meta Title (English)',
      description: 'Page title as it appears in search engines (without site name)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescAr',
      title: 'وصف السيو (عربي)',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
    defineField({
      name: 'metaDescEn',
      title: 'Meta Description (English)',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),

    // الحفاظ على الحقول القديمة كما هي لضمان عدم فقدان أي داتا
    defineField({
      name: 'seo', 
      title: 'SEO الإعدادات العامة (القديمة)',
      type: 'seo', 
      group: 'seo',
    }),
    defineField({
      name: 'projectsSeo',
      title: 'SEO صفحة المشاريع',
      type: 'seo',
      group: 'seo',
    }),
  ],

  preview: {
    select: { title: 'titleAr' },
    prepare({ title }) {
      return {
        title: title || 'إعدادات الموقع',
        subtitle: 'الهيرو، السوشيال ميديا، والسيو',
        media: Cog
      }
    }
  }
})