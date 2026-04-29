import { Users, Cpu, HelpCircle } from 'lucide-react'

// 1. تعريف الكائن وتعيينه لمتغير (Variable Assignment)
const developersPageSchema = {
  name: 'developersPage',
  title: 'صفحة المطورين (الرئيسية)',
  type: 'document',
  icon: Users,

  // تنظيم الحقول في مجموعات (Tabs) لتظهر في Sanity Studio
  groups: [
    { name: 'content', title: 'المحتوى الرئيسي', default: true },
    { name: 'aiFeatures', title: '🤖 الذكاء الاصطناعي والأسئلة (GEO & AEO)' },
    { name: 'seo', title: 'SEO إعدادات البحث' },
  ],

  fields: [
    { 
      name: 'titleAr', 
      title: 'عنوان الصفحة - عربي', 
      type: 'string',
      initialValue: 'شركاء النجاح',
      group: 'content' 
    },
    { 
      name: 'titleEn', 
      title: 'Page Title - English', 
      type: 'string',
      initialValue: 'Our Titans',
      group: 'content' 
    },

    // ==========================================
    // 🤖 حقول الذكاء الاصطناعي (GEO & AEO Updates)
    // ==========================================
    {
      name: 'aiSummaryAr',
      title: 'نقاط تلخيصية للذكاء الاصطناعي (Ar)',
      type: 'array',
      group: 'aiFeatures',
      icon: Cpu,
      of: [{type: 'string'}],
      description: 'أهم 3-4 نقاط تلخص قوة المطورين الموجودين في هذه الصفحة (مثال: نضم أفضل 50 مطور في مصر).'
    },
    {
      name: 'aiSummaryEn',
      title: 'AI Summary Highlights (En)',
      type: 'array',
      group: 'aiFeatures',
      of: [{type: 'string'}]
    },
    {
      name: 'faqs',
      title: 'الأسئلة الشائعة العامة عن المطورين (AEO FAQ Schema)',
      type: 'array',
      group: 'aiFeatures',
      icon: HelpCircle,
      of: [{
        type: 'object',
        fields: [
          {name: 'questionAr', title: 'السؤال (عربي)', type: 'string', description: 'مثال: من هو أفضل مطور في التجمع الخامس؟'},
          {name: 'answerAr', title: 'الجواب (عربي)', type: 'text', rows: 3},
          {name: 'questionEn', title: 'Question (English)', type: 'string'},
          {name: 'answerEn', title: 'Answer (English)', type: 'text', rows: 3}
        ]
      }],
      description: 'أسئلة عامة عن المطورين لتتصدر بها إجابات ChatGPT وجوجل المباشرة.'
    },

    // ==========================================
    // المحتوى والسيو
    // ==========================================
    {
      name: 'developersList',
      title: 'قائمة المطورين (ترتيب يدوي إن لزم الأمر)',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'اسم المطور', type: 'string' },
            { 
              name: 'logo', 
              title: 'اللوجو', 
              type: 'image',
              options: { hotspot: true } 
            }
          ]
        }
      ]
    },

    // إضافة حقل السيو
    {
      name: 'seo',
      title: 'إعدادات الأرشفة والسيو',
      type: 'seo', // يعتمد على ملف objects/seo.js لديك
      group: 'seo' 
    }
  ],

  preview: {
    select: { title: 'titleAr' },
    prepare({ title }) {
      return {
        title: title || 'صفحة المطورين',
        subtitle: 'الصفحة الرئيسية لعرض المطورين',
        media: Users
      }
    }
  }
};

// 2. تصدير المتغير كـ default
export default developersPageSchema;