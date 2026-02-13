// 1. تعريف الحقول بشكل منفصل لزيادة تنظيم الكود وسهولة صيانته
const seoFields = [
  { 
    name: 'metaTitleAr', 
    type: 'string', 
    title: 'عنوان الميتا (عربي)',
    validation: Rule => Rule.max(60).warning('العنوان المفضل لجوجل لا يتجاوز 60 حرفاً')
  },
  { name: 'metaTitleEn', type: 'string', title: 'Meta Title (English)' },
  { 
    name: 'metaDescAr', 
    type: 'text', 
    title: 'وصف الميتا (عربي)', 
    rows: 3,
    validation: Rule => Rule.max(160).warning('الوصف المفضل لجوجل لا يتجاوز 160 حرفاً')
  },
  { name: 'metaDescEn', type: 'text', title: 'Meta Description (English)', rows: 3 },
  { 
    name: 'openGraphImage', 
    type: 'image', 
    title: 'صورة المشاركة (Social Image)',
    options: { hotspot: true }
  },
];

// 2. تعريف المصفوفة في متغير ثابت قبل التصدير (لحل تحذير Linter)
const legalPagesSchemas = [
  // سكيما صفحة الشروط والأحكام
  {
    name: 'termsPage',
    type: 'document',
    title: 'إعدادات صفحة الشروط والأحكام',
    fields: [
      { 
        name: 'title', 
        type: 'string', 
        title: 'اسم الصفحة (داخلي)', 
        initialValue: 'الشروط والأحكام', 
        readOnly: true 
      },
      { 
        name: 'seo', 
        type: 'object', 
        title: 'إعدادات الـ SEO والأرشفة', 
        fields: seoFields 
      }
    ]
  },
  // سكيما صفحة خريطة الموقع
  {
    name: 'sitemapPage',
    type: 'document',
    title: 'إعدادات صفحة خريطة الموقع',
    fields: [
      { 
        name: 'title', 
        type: 'string', 
        title: 'اسم الصفحة (داخلي)', 
        initialValue: 'خريطة الموقع', 
        readOnly: true 
      },
      { 
        name: 'seo', 
        type: 'object', 
        title: 'إعدادات الـ SEO والأرشفة', 
        fields: seoFields 
      }
    ]
  }
];

// 3. التصدير النهائي للمتغير
export default legalPagesSchemas;