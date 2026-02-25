import { Users } from 'lucide-react'

// 1. تعريف الكائن وتعيينه لمتغير (Variable Assignment)
const developersPageSchema = {
  name: 'developersPage',
  title: 'صفحة المطورين (الرئيسية)',
  type: 'document',
  icon: Users,

  // تنظيم الحقول في مجموعات (Tabs) لتظهر في Sanity Studio
  groups: [
    { name: 'content', title: 'المحتوى الرئيسي', default: true },
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

    // إضافة حقل السيو الذي كان مفقوداً في لقطة الشاشة
    {
      name: 'seo',
      title: 'إعدادات الأرشفة والسيو',
      type: 'seo', 
      group: 'seo' 
    },

    {
      name: 'developersList',
      title: 'قائمة المطورين',
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
    }
  ],

  preview: {
    select: { title: 'titleAr' },
    prepare({ title }) {
      return {
        title: title || 'صفحة المطورين',
        media: Users
      }
    }
  }
};

// 2. تصدير المتغير كـ default
export default developersPageSchema;