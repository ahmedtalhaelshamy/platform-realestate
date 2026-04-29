import { defineField, defineType } from 'sanity'
import { Building2, Cpu, HelpCircle, Lightbulb } from 'lucide-react'

// 1. إعدادات المحتوى الغني الموحدة
const richTextConfig = [
  { 
    type: 'block',
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'Heading 2', value: 'h2'}, 
      {title: 'Heading 3', value: 'h3'}, 
      {title: 'Quote', value: 'blockquote'},
    ]
  },
  { 
    type: 'image', 
    options: { hotspot: true }, 
    fields: [
      { 
        name: 'alt', 
        title: 'Alt Text', 
        type: 'string', 
        validation: Rule => Rule.required().warning('يفضل إضافة وصف للصورة')
      }
    ]
  }
];

// 2. إعدادات حقول الصور المكررة
const imageFields = [
  { 
    name: 'alt', 
    title: 'نص بديل (Alt Text - SEO)', 
    type: 'string', 
    validation: Rule => Rule.required().warning('مهم جداً للـ SEO')
  },
  { 
    name: 'caption', 
    title: 'تعليق (Caption)', 
    type: 'string',
  }
];

export default defineType({
  name: 'project',
  title: 'المشاريع (Projects)',
  type: 'document',
  icon: Building2,
  
  fieldsets: [
    { name: 'meta', title: '⚙️ إعدادات SEO والتهيئة (Config)', options: { collapsible: true } }, 
    { name: 'hero', title: '1. الهيرو والعنوان (Hero)', options: { collapsible: true } }, 
    { name: 'badges', title: '🏷️ شارات وتميز (Badges)', options: { columns: 2 } }, 
    { name: 'infoBar', title: '2. شريط المعلومات (Info Bar)', options: { collapsible: true } }, 
    { name: 'aiFeatures', title: '🤖 ذكاء اصطناعي (AI & Answer Engine)', options: { collapsible: true } }, // مجموعة جديدة لـ GEO
    { name: 'intro', title: '3. المقدمة (Introduction)', options: { collapsible: true } },
    { name: 'locationSec', title: '4. قسم الموقع (Location)', options: { collapsible: true } },
    { name: 'projectDetails', title: '5. تفاصيل المشروع (Project Details)', options: { collapsible: true } },
    { name: 'projectArea', title: '6. مساحة المشروع (Master Plan)', options: { collapsible: true } },
    { name: 'facilitiesArea', title: '7. المرافق والخدمات (Facilities)', options: { collapsible: true } },
    { name: 'unitsSec', title: '8. الوحدات (Units)', options: { collapsible: true } },
    { name: 'pricesSec', title: '9. الأسعار (Prices)', options: { collapsible: true } },
    { name: 'paymentSec', title: '10. أنظمة الدفع (Payment Plans)', options: { collapsible: true } },
    { name: 'opinionSec', title: '11. رأي شخصي (Review)', options: { collapsible: true } },
    { name: 'analysis', title: '12. تحليل وأسئلة (Analysis)', options: { collapsible: true } },
  ],

  fields: [
    // --- 0. SEO & CONFIG ---
    defineField({ name: 'customH1Ar', title: 'H1 مخصص (Ar)', type: 'string', fieldset: 'meta' }),
    defineField({ name: 'customH1En', title: 'H1 Custom (En)', type: 'string', fieldset: 'meta' }),
    defineField({ name: 'seoKeywordAr', title: 'الكلمة المفتاحية (Ar)', type: 'string', fieldset: 'meta' }),
    defineField({ name: 'seoKeywordEn', title: 'SEO Keyword (En)', type: 'string', fieldset: 'meta' }),
    
    defineField({ 
      name: 'seo', 
      title: 'إعدادات SEO المتقدمة والبيانات المنظمة', 
      type: 'object', 
      fieldset: 'meta',
      fields: [
        { name: 'metaTitleAr', title: 'Title (Ar)', type: 'string' },
        { name: 'metaTitleEn', title: 'Title (En)', type: 'string' },
        { name: 'metaDescAr', title: 'Description (Ar)', type: 'text', rows: 3 },
        { name: 'metaDescEn', title: 'Description (En)', type: 'text', rows: 3 },
        { name: 'ogImage', title: 'صورة المشاركة (OG Image)', type: 'image' },
        {
          name: 'schemaType',
          title: 'نوع الصفحة (Schema Type)',
          type: 'string',
          initialValue: 'RealEstateListing',
          options: {
            list: [
              { title: 'عرض مشروع (RealEstateListing)', value: 'RealEstateListing' },
              { title: 'مقال مراجعة (Article)', value: 'Article' }
            ]
          }
        },
        {
          name: 'noIndex',
          title: 'منع الأرشفة (No Index)',
          type: 'boolean',
          initialValue: false,
        }
      ]
    }),

    // --- 1. HERO ---
    defineField({ name: 'titleAr', title: 'اسم المشروع الرسمي (Ar)', type: 'string', fieldset: 'hero', validation: Rule => Rule.required() }),
    defineField({ name: 'titleEn', title: 'Official Project Name (En)', type: 'string', fieldset: 'hero' }),
    defineField({ name: 'displayNameAr', title: 'اسم العرض المختصر (Ar)', type: 'string', fieldset: 'hero' }),
    defineField({ name: 'displayNameEn', title: 'Display Name (En)', type: 'string', fieldset: 'hero' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titleEn' }, fieldset: 'hero', validation: Rule => Rule.required() }),
    
    defineField({ 
      name: 'mainImage', 
      title: 'صورة الهيرو الخلفية', 
      type: 'image', 
      options: { hotspot: true }, 
      fields: imageFields, 
      fieldset: 'hero' 
    }),
    
    defineField({ name: 'location', title: 'المنطقة (City)', type: 'reference', to: [{ type: 'location' }], fieldset: 'hero' }),
    defineField({ name: 'district', title: 'الحي (District)', type: 'reference', to: [{ type: 'district' }], fieldset: 'hero' }),
    defineField({ name: 'developer', title: 'المطور العقاري', type: 'reference', to: [{ type: 'developer' }], fieldset: 'hero' }),
    defineField({ name: 'price', title: 'سعر البدء (للهيرو)', type: 'number', fieldset: 'hero' }),
    defineField({ name: 'brochure', title: 'ملف البروشور (PDF)', type: 'file', fieldset: 'hero' }),

    // --- BADGES ---
    defineField({ name: 'isNewLaunch', title: '🚀 إطلاق حديث', type: 'boolean', fieldset: 'badges', initialValue: false }),
    defineField({ name: 'isReadyToMove', title: '🔑 استلام فوري', type: 'boolean', fieldset: 'badges', initialValue: false }),
    defineField({ name: 'isSoldOut', title: '🚫 مباع بالكامل', type: 'boolean', fieldset: 'badges', initialValue: false }),
    defineField({ name: 'isFeatured', title: '⭐ مميز', type: 'boolean', fieldset: 'badges', initialValue: false }),
    defineField({ name: 'isInvestmentOpportunity', title: '📈 فرصة استثمارية', type: 'boolean', fieldset: 'badges', initialValue: false }),

    // --- 🔹 قسم الذكاء الاصطناعي (NEW FOR GEO) ---
    defineField({
      name: 'aiSummaryAr',
      title: 'ملخص المشروع للذكاء الاصطناعي (Ar)',
      type: 'array',
      fieldset: 'aiFeatures',
      of: [{ type: 'string' }],
      icon: Lightbulb,
      description: 'أهم 3-4 نقاط تجذب العميل (يستخدمها ChatGPT وجوجل للرد السريع على "لماذا أشتري في هذا المشروع؟").'
    }),
    defineField({
      name: 'aiSummaryEn',
      title: 'AI Insights Summary (En)',
      type: 'array',
      fieldset: 'aiFeatures',
      of: [{ type: 'string' }],
    }),

    // --- 2. INFO BAR ---
    defineField({ 
      name: 'finishingType', 
      title: 'نوع التشطيب', 
      type: 'string', 
      fieldset: 'infoBar',
      options: {
        list: [
          { title: 'بدون تشطيب (Core & Shell)', value: 'Core & Shell' },
          { title: 'نصف تشطيب (Semi Finished)', value: 'Semi Finished' },
          { title: 'تشطيب كامل (Fully Finished)', value: 'Fully Finished' },
          { title: 'بالفرش والتكييفات (Furnished)', value: 'Furnished' }
        ]
      }
    }),
    defineField({ name: 'minArea', title: 'مساحات تبدأ من (متر)', type: 'number', fieldset: 'infoBar' }),
    defineField({ 
      name: 'projectType', 
      title: 'نوع الوحدات', 
      type: 'array', 
      fieldset: 'infoBar',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'شقق (Apartments)', value: 'Apartments' },
          { title: 'فيلات (Villas)', value: 'Villas' },
          { title: 'شاليهات (Chalets)', value: 'Chalets' },
          { title: 'تجاري (Commercial)', value: 'Commercial' },
          { title: 'إداري (Admin)', value: 'Admin' },
          { title: 'طبي (Medical)', value: 'Medical' },
          { title: 'فندقي (Hotel)', value: 'Hotel' }
        ],
        layout: 'grid' 
      }
    }),
    defineField({ 
      name: 'deliveryDate', 
      title: 'موعد الاستلام', 
      type: 'string', 
      fieldset: 'infoBar',
      options: {
        list: [
          { title: 'استلام فوري (Ready to Move)', value: 'Ready to Move' },
          { title: '2024', value: '2024' }, { title: '2025', value: '2025' },
          { title: '2026', value: '2026' }, { title: '2027', value: '2027' },
          { title: '2028', value: '2028' }, { title: '2029', value: '2029' },
          { title: '2030', value: '2030' }, { title: 'TBD', value: 'TBD' }
        ]
      }
    }),
    defineField({ name: 'downPayment', title: 'المقدم %', type: 'number', fieldset: 'infoBar' }),
    defineField({ name: 'installments', title: 'سنوات التقسيط', type: 'number', fieldset: 'infoBar' }),

    // --- 3. INTRODUCTION ---
    defineField({ name: 'introTitleAr', title: 'عنوان المقدمة (Ar)', type: 'string', fieldset: 'intro' }),
    defineField({ name: 'introTitleEn', title: 'Intro Title (En)', type: 'string', fieldset: 'intro' }),
    defineField({ name: 'introContentAr', title: 'مقال المقدمة (Ar)', type: 'array', of: richTextConfig, fieldset: 'intro' }),
    defineField({ name: 'introContentEn', title: 'Intro Content (En)', type: 'array', of: richTextConfig, fieldset: 'intro' }),

    // --- 4. LOCATION ---
    defineField({ name: 'locationTitleAr', title: 'عنوان الموقع (Ar)', type: 'string', fieldset: 'locationSec' }),
    defineField({ name: 'locationTitleEn', title: 'Location Title (En)', type: 'string', fieldset: 'locationSec' }),
    defineField({ name: 'locationImage', title: 'صورة الموقع/الخريطة', type: 'image', options: { hotspot: true }, fields: imageFields, fieldset: 'locationSec' }),
    defineField({ name: 'geoPoint', title: 'إحداثيات المشروع (GPS)', type: 'geopoint', fieldset: 'locationSec' }),
    defineField({ name: 'locationContentAr', title: 'مقال الموقع (Ar)', type: 'array', of: richTextConfig, fieldset: 'locationSec' }),
    defineField({ name: 'locationContentEn', title: 'Location Content (En)', type: 'array', of: richTextConfig, fieldset: 'locationSec' }),
    defineField({ 
      name: 'nearbyPlaces', 
      title: 'أقرب الأماكن', 
      type: 'array', 
      fieldset: 'locationSec',
      of: [{ 
        name: 'nearbyPlace',
        type: 'object', 
        fields: [
          {name: 'placeAr', title:'المكان (Ar)', type: 'string'}, 
          {name: 'placeEn', title:'Place (En)', type: 'string'}, 
          {name: 'timeAr', title:'الوقت (Ar)', type: 'string'},
          {name: 'timeEn', title:'Time (En)', type: 'string'}
        ] 
      }] 
    }),

    // --- 5. DETAILS ---
    defineField({ name: 'detailsTitleAr', title: 'عنوان التفاصيل (Ar)', type: 'string', fieldset: 'projectDetails' }),
    defineField({ name: 'detailsTitleEn', title: 'Details Title (En)', type: 'string', fieldset: 'projectDetails' }),
    defineField({ name: 'detailsImage', title: 'صورة تفاصيل المشروع', type: 'image', options: { hotspot: true }, fields: imageFields, fieldset: 'projectDetails' }),
    defineField({ name: 'detailsContentAr', title: 'مقال التفاصيل (Ar)', type: 'array', of: richTextConfig, fieldset: 'projectDetails' }),
    defineField({ name: 'detailsContentEn', title: 'Details Content (En)', type: 'array', of: richTextConfig, fieldset: 'projectDetails' }),
    defineField({ name: 'videoUrl', title: 'YouTube URL', type: 'url', fieldset: 'projectDetails' }),

    // --- 6. AREA (MASTER PLAN) ---
    defineField({ name: 'areaTitleAr', title: 'عنوان المساحة (Ar)', type: 'string', fieldset: 'projectArea' }),
    defineField({ name: 'areaTitleEn', title: 'Area Title (En)', type: 'string', fieldset: 'projectArea' }),
    defineField({ name: 'areaImage', title: 'صورة المخطط (Master Plan)', type: 'image', options: { hotspot: true }, fields: imageFields, fieldset: 'projectArea' }),
    defineField({ name: 'areaContentAr', title: 'مقال المساحة (Ar)', type: 'array', of: richTextConfig, fieldset: 'projectArea' }),
    defineField({ name: 'areaContentEn', title: 'Area Content (En)', type: 'array', of: richTextConfig, fieldset: 'projectArea' }),

    // --- 7. FACILITIES ---
    defineField({ name: 'facilitiesTitleAr', title: 'عنوان المرافق (Ar)', type: 'string', fieldset: 'facilitiesArea' }),
    defineField({ name: 'facilitiesTitleEn', title: 'Facilities Title (En)', type: 'string', fieldset: 'facilitiesArea' }),
    defineField({ name: 'facilitiesImage', title: 'صورة المرافق', type: 'image', options: { hotspot: true }, fields: imageFields, fieldset: 'facilitiesArea' }),
    defineField({ name: 'facilitiesContentAr', title: 'مقال المرافق (Ar)', type: 'array', of: richTextConfig, fieldset: 'facilitiesArea' }),
    defineField({ name: 'facilitiesContentEn', title: 'Facilities Content (En)', type: 'array', of: richTextConfig, fieldset: 'facilitiesArea' }),
    defineField({ name: 'gallery', title: 'معرض صور المشروع', type: 'array', fieldset: 'facilitiesArea', of: [{ type: 'image', options: { hotspot: true }, fields: imageFields }] }),
    defineField({ name: 'amenities', title: 'أيقونات الخدمات', type: 'array', fieldset: 'facilitiesArea', of: [{ type: 'string' }], options: { list: [ { title: 'أمن وحراسة (Security)', value: 'security' }, { title: 'جراج خاص (Parking)', value: 'parking' }, { title: 'حمامات سباحة (Pools)', value: 'pools' }, { title: 'لاند سكيب (Landscape)', value: 'greenery' }, { title: 'منطقة أطفال (Kids Area)', value: 'kids_area' }, { title: 'كلوب هاوس (Clubhouse)', value: 'clubhouse' }, { title: 'مسجد (Mosque)', value: 'mosque' }, { title: 'منطقة شواء (BBQ)', value: 'bbq' }, { title: 'تراك جري (Track)', value: 'track' }, { title: 'بوابات ذكية (Smart Gates)', value: 'smart_gates' }, { title: 'منطقة تجارية (Commercial)', value: 'commercial' }, { title: 'مصاعد (Elevators)', value: 'elevators' }, { title: 'سلالم متحركة (Escalators)', value: 'escalators' }, { title: 'منطقة مطاعم (Food Court)', value: 'food_court' }, { title: 'تكييف مركزي (Central AC)', value: 'central_ac' }, { title: 'إنترنت فائق السرعة (Internet)', value: 'internet' }, { title: 'قاعات اجتماعات (Meeting Rooms)', value: 'meeting_rooms' }, { title: 'معمل تحاليل (Lab)', value: 'lab' }, { title: 'صيدلية (Pharmacy)', value: 'pharmacy' }, { title: 'منطقة انتظار (Waiting Area)', value: 'waiting_area' }, { title: 'سبا وجاكوزي (Spa)', value: 'spa' }, { title: 'جيم (Gym)', value: 'gym' }, { title: 'سينما (Cinema)', value: 'cinema' }, { title: 'خدمة فندقية (Hotel Service)', value: 'hotel_service' }, { title: 'شاطئ خاص (Private Beach)', value: 'beach' }, { title: 'أكوا بارك (Aqua Park)', value: 'aquapark' } ], layout: 'grid' } }),

    // --- 8. UNITS ---
    defineField({ name: 'unitsTitleAr', title: 'عنوان الوحدات (Ar)', type: 'string', fieldset: 'unitsSec' }),
    defineField({ name: 'unitsTitleEn', title: 'Units Title (En)', type: 'string', fieldset: 'unitsSec' }),
    defineField({ name: 'unitsImage', title: 'صورة الوحدات', type: 'image', options: { hotspot: true }, fields: imageFields, fieldset: 'unitsSec' }),
    defineField({ name: 'unitsContentAr', title: 'مقال الوحدات (Ar)', type: 'array', of: richTextConfig, fieldset: 'unitsSec' }),
    defineField({ name: 'unitsContentEn', title: 'Units Content (En)', type: 'array', of: richTextConfig, fieldset: 'unitsSec' }),
    defineField({ 
      name: 'inventory', 
      title: 'قائمة الوحدات (جدول)', 
      type: 'array', 
      fieldset: 'unitsSec',
      of: [{
        name: 'unitItem',
        type: 'object', 
        fields: [
          { name: 'unitType', title: 'نوع الوحدة', type: 'string' }, 
          { name: 'area', title: 'المساحة (م²)', type: 'string' }, 
          { name: 'bedrooms', title: 'عدد الغرف', type: 'number' },
          { name: 'price', title: 'السعر يبدأ من', type: 'number' },
          { name: 'status', title: 'الحالة', type: 'string', options: {list: ['Available', 'Sold Out']}}
        ]
      }] 
    }),

    // --- 9. PRICES ---
    defineField({ name: 'pricesTitleAr', title: 'عنوان الأسعار (Ar)', type: 'string', fieldset: 'pricesSec' }),
    defineField({ name: 'pricesTitleEn', title: 'Prices Title (En)', type: 'string', fieldset: 'pricesSec' }),
    defineField({ name: 'pricesImage', title: 'صورة الأسعار', type: 'image', options: { hotspot: true }, fields: imageFields, fieldset: 'pricesSec' }),
    defineField({ name: 'pricesContentAr', title: 'مقال الأسعار (Ar)', type: 'array', of: richTextConfig, fieldset: 'pricesSec' }),
    defineField({ name: 'pricesContentEn', title: 'Prices Content (En)', type: 'array', of: richTextConfig, fieldset: 'pricesSec' }),
    defineField({ name: 'currency', title: 'العملة', type: 'string', initialValue: 'EGP', options: { list: ['EGP', 'USD', 'AED'] }, fieldset: 'pricesSec' }),

    // --- 10. PAYMENT ---
    defineField({ name: 'paymentTitleAr', title: 'عنوان الدفع (Ar)', type: 'string', fieldset: 'paymentSec' }),
    defineField({ name: 'paymentTitleEn', title: 'Payment Title (En)', type: 'string', fieldset: 'paymentSec' }),
    defineField({ name: 'paymentImage', title: 'صورة الدفع', type: 'image', options: { hotspot: true }, fields: imageFields, fieldset: 'paymentSec' }),
    defineField({ name: 'paymentContentAr', title: 'مقال الدفع (Ar)', type: 'array', of: richTextConfig, fieldset: 'paymentSec' }),
    defineField({ name: 'paymentContentEn', title: 'Payment Content (En)', type: 'array', of: richTextConfig, fieldset: 'paymentSec' }),

    // --- 11. OPINION ---
    defineField({ name: 'opinionTitleAr', title: 'عنوان الرأي (Ar)', type: 'string', fieldset: 'opinionSec' }),
    defineField({ name: 'opinionTitleEn', title: 'Opinion Title (En)', type: 'string', fieldset: 'opinionSec' }),
    defineField({ name: 'opinionImage', title: 'صورة الرأي', type: 'image', options: { hotspot: true }, fields: imageFields, fieldset: 'opinionSec' }),
    defineField({ name: 'opinionContentAr', title: 'مقال الرأي (Ar)', type: 'array', of: richTextConfig, fieldset: 'opinionSec' }),
    defineField({ name: 'opinionContentEn', title: 'Opinion Content (En)', type: 'array', of: richTextConfig, fieldset: 'opinionSec' }),
    defineField({ name: 'editorRating', title: 'تقييم المحرر (من 10)', type: 'number', fieldset: 'opinionSec', validation: Rule => Rule.min(0).max(10).precision(1) }),

    // --- 12. ANALYSIS & FAQ ---
    defineField({ name: 'prosAr', title: 'المميزات (Ar)', type: 'array', of: [{type: 'string'}], fieldset: 'analysis' }),
    defineField({ name: 'prosEn', title: 'Pros (En)', type: 'array', of: [{type: 'string'}], fieldset: 'analysis' }),
    defineField({ name: 'consAr', title: 'العيوب (Ar)', type: 'array', of: [{type: 'string'}], fieldset: 'analysis' }),
    defineField({ name: 'consEn', title: 'Cons (En)', type: 'array', of: [{type: 'string'}], fieldset: 'analysis' }),
    defineField({ 
      name: 'faqs', 
      title: 'الأسئلة الشائعة للمحركات (AEO)', 
      type: 'array', 
      fieldset: 'aiFeatures',
      of: [{
        name: 'faqItem',
        type: 'object', 
        icon: HelpCircle,
        fields: [
          {name: 'questionAr', title:'سؤال (Ar)', type: 'string'}, 
          {name: 'answerAr', title:'جواب (Ar)', type: 'text'},
          {name: 'questionEn', title:'Question (En)', type: 'string'}, 
          {name: 'answerEn', title:'Answer (En)', type: 'text'}
        ]
      }],
      description: 'أضف الأسئلة التي يبحث عنها المستخدمون في جوجل لتظهر كإجابة مباشرة (Rich Snippets).'
    }),
    defineField({ name: 'author', title: 'كاتب الصفحة', type: 'reference', to: [{type: 'author'}], fieldset: 'analysis' }),
  ],

  preview: {
    select: {
      title: 'titleAr',
      subtitle: 'developer.nameAr',
      media: 'mainImage'
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title,
        subtitle: subtitle || 'مطور غير محدد',
        media: media
      }
    }
  }
})