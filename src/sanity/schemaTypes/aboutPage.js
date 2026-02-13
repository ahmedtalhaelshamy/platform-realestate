import { defineField, defineType } from 'sanity'
import { Users } from 'lucide-react'

export default defineType({
  name: 'aboutPage',
  title: '📄 صفحة من نحن (About Page)',
  type: 'document',
  icon: Users,
  groups: [
    { name: 'content', title: 'المحتوى الرئيسي', default: true },
    { name: 'stats', title: 'الأرقام والإحصائيات' },
    { name: 'seo', title: 'SEO & Google' },
  ],
  fields: [
    // --- 1. Hero Section ---
    defineField({
      name: 'heroTitleAr',
      title: 'عنوان الهيرو (Ar)',
      type: 'string',
      group: 'content',
      initialValue: 'من نحن'
    }),
    defineField({
      name: 'heroTitleEn',
      title: 'Hero Title (En)',
      type: 'string',
      group: 'content',
      initialValue: 'About Us'
    }),
    defineField({
      name: 'heroImage',
      title: 'صورة الهيرو العريضة',
      type: 'image',
      group: 'content',
      options: { hotspot: true }
    }),

    // --- 2. Our Story ---
    defineField({
      name: 'storyTitleAr',
      title: 'عنوان القصة (Ar)',
      type: 'string',
      group: 'content',
      initialValue: 'قصتنا'
    }),
    defineField({
      name: 'storyTitleEn',
      title: 'Story Title (En)',
      type: 'string',
      group: 'content',
      initialValue: 'Our Story'
    }),
    defineField({
      name: 'storyContentAr',
      title: 'نص القصة (Ar)',
      type: 'array',
      of: [{type: 'block'}],
      group: 'content'
    }),
    defineField({
      name: 'storyContentEn',
      title: 'Story Content (En)',
      type: 'array',
      of: [{type: 'block'}],
      group: 'content'
    }),
    defineField({
      name: 'storyImage',
      title: 'صورة بجانب القصة',
      type: 'image',
      group: 'content',
      options: { hotspot: true }
    }),

    // --- 3. Stats (الأرقام) ---
    defineField({
      name: 'stats',
      title: 'الإحصائيات (Numbers)',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', title: 'الرقم (مثال: +10)', type: 'string' },
            { name: 'labelAr', title: 'الوصف (Ar)', type: 'string' },
            { name: 'labelEn', title: 'Label (En)', type: 'string' },
          ]
        }
      ]
    }),

    // --- 4. Vision & Mission ---
    defineField({
      name: 'visionAr',
      title: 'رؤيتنا (Vision Ar)',
      type: 'text',
      rows: 3,
      group: 'content'
    }),
    defineField({
      name: 'visionEn',
      title: 'Our Vision (En)',
      type: 'text',
      rows: 3,
      group: 'content'
    }),
    defineField({
      name: 'missionAr',
      title: 'مهمتنا (Mission Ar)',
      type: 'text',
      rows: 3,
      group: 'content'
    }),
    defineField({
      name: 'missionEn',
      title: 'Our Mission (En)',
      type: 'text',
      rows: 3,
      group: 'content'
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      group: 'seo'
    })
  ],
  preview: {
    prepare() {
      return { title: 'إعدادات صفحة من نحن' }
    }
  }
})