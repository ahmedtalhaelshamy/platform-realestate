import { ShieldCheck } from 'lucide-react' // أيقونة حماية احترافية

export default {
  name: 'privacyPage',
  title: 'صفحة سياسة الخصوصية',
  type: 'document',
  icon: ShieldCheck, // إضافة أيقونة لتمييز الصفحة في القائمة الجانبية
  fields: [
    { 
      name: 'titleAr', 
      title: 'العنوان الرئيسي - عربي (H1)', 
      type: 'string',
      initialValue: 'سياسة الخصوصية'
    },
    { 
      name: 'titleEn', 
      title: 'Main Title - English (H1)', 
      type: 'string',
      initialValue: 'Privacy Policy'
    },
    {
      name: 'seo',
      title: 'إعدادات الأرشفة (SEO Settings)',
      type: 'seo', // 👈 تم التعديل من seoFields إلى seo ليتطابق مع name ملف الـ SEO
    }
  ],
  preview: {
    select: {
      title: 'titleAr',
    },
    prepare({ title }) {
      return {
        title: title || 'سياسة الخصوصية',
        subtitle: 'إدارة نصوص الأرشفة والحماية',
        media: ShieldCheck
      }
    }
  }
}