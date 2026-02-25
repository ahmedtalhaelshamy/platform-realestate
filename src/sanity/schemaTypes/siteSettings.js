import { defineField, defineType } from 'sanity'
import { Cog } from 'lucide-react'

export default defineType({
  name: 'siteSettings',
  title: '⚙️ إعدادات الموقع (Site Settings)',
  type: 'document',
  icon: Cog,
  
  groups: [
    { name: 'hero', title: 'واجهة الصفحة الرئيسية', default: true },
    { name: 'social', title: 'السوشيال ميديا' },
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

    // --- 🌐 2. SOCIAL MEDIA ---
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

    // --- 🔍 3. SEO SETTINGS ---
    // ✅ إضافة الحقول الفردية لضمان عدم تكرار العناوين وحل مشاكل Semrush
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