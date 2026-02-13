import { Mail } from 'lucide-react'

// ✅ الخطوة 1: تعريف الكائن في متغير ثابت (Named Assignment)
const contactPage = {
  name: 'contactPage',
  title: 'إدارة صفحة اتصل بنا',
  type: 'document',
  icon: Mail,
  // ✅ تحسين: إضافة Fieldsets لتنظيم الواجهة لمدخل البيانات
  fieldsets: [
    { name: 'contentAr', title: 'المحتوى العربي', options: { collapsible: true } },
    { name: 'contentEn', title: 'English Content', options: { collapsible: true } },
  ],
  fields: [
    { 
      name: 'titleAr', 
      title: 'العنوان الرئيسي (العربية)', 
      type: 'string',
      initialValue: 'تواصل معنا',
      fieldset: 'contentAr' // ربط الحقل بمجموعة اللغة العربية
    },
    { 
      name: 'titleEn', 
      title: 'Main Title (English)', 
      type: 'string',
      initialValue: 'Contact Us',
      fieldset: 'contentEn' // ربط الحقل بمجموعة اللغة الإنجليزية
    },
    {
      name: 'seo',
      title: 'إعدادات الأرشفة (SEO Settings)',
      description: 'تأكد من ملء الكلمات المفتاحية باللغتين لتحسين الظهور في محركات البحث [SEO 2026]',
      type: 'seo', 
    }
  ],
  preview: {
    select: { title: 'titleAr' },
    prepare({ title }) {
      return {
        title: title || 'صفحة اتصل بنا',
        subtitle: 'إعدادات النصوص و SEO',
        media: Mail
      }
    }
  }
};

// ✅ الخطوة 2: تصدير المتغير كـ Default
export default contactPage;