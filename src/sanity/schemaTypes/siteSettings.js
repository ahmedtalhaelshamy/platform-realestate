import { defineField, defineType } from 'sanity'
import { Cog } from 'lucide-react'

export default defineType({
  name: 'siteSettings',
  title: '⚙️ إعدادات الموقع (Site Settings)',
  type: 'document',
  icon: Cog,
  
  // 1️⃣ تنظيم لوحة التحكم لمجموعات واضحة (تم حذف مجموعة contact)
  groups: [
    { name: 'hero', title: 'واجهة الصفحة الرئيسية', default: true },
    { name: 'social', title: 'السوشيال ميديا' },
    { name: 'seo', title: 'SEO & Google' },
  ],

  fields: [
    // --- 🏆 1. HERO SECTION (البيانات المرئية للرئيسية) ---
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
    defineField({
      name: 'seo', // السيو العام للموقع
      title: 'SEO الإعدادات العامة (الرئيسية)',
      type: 'seo', 
      group: 'seo',
    }),
    defineField({
      name: 'projectsSeo',
      title: 'SEO صفحة المشاريع',
      type: 'seo',
      group: 'seo',
    }),
    // ✅ تم حذف contactSeo من هنا
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