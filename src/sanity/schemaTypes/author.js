import { defineField, defineType } from 'sanity'
import { User } from 'lucide-react'

export default defineType({
  name: 'author',
  title: 'المؤلف / المحرر (Author)',
  type: 'document',
  icon: User,
  fields: [
    defineField({
      name: 'name',
      title: 'الاسم',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'jobTitle',
      title: 'المسمى الوظيفي',
      type: 'string',
      description: 'مثال: Senior Real Estate Consultant',
      initialValue: 'Real Estate Consultant'
    }),
    defineField({
      name: 'image',
      title: 'صورة المؤلف',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'نبذة مختصرة',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})