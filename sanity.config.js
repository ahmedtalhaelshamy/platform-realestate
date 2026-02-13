'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemaTypes'
import { Globe, Newspaper, Layout, Settings, Users, Building2, FileText, Map } from 'lucide-react'

// ✅ 1. تحديث قائمة الـ Singletons لمنع التكرار والحذف
const singletonTypes = new Set([
  'siteSettings', 
  'aboutPage', 
  'contactPage', 
  'blogPage', 
  'developersPage', 
  'privacyPage',
  'termsPage',
  'sitemapPage'
])

// ✅ 2. هيكلة لوحة التحكم المطورة (الأكثر تنظيماً)
const myStructure = (S) =>
  S.list()
    .title('لوحة تحكم بلاتفورم')
    .items([
      
      // ✍️ المجموعة الأولى: المحتوى الإخباري (Posts + Authors + SEO)
      S.listItem()
        .title('المدونة ومركز الأخبار')
        .icon(Newspaper)
        .child(
          S.list()
            .title('إدارة المحتوى الإخباري')
            .items([
              S.documentTypeListItem('post').title('جميع المقالات المنشورة').icon(Newspaper),
              S.documentTypeListItem('author').title('فريق التحرير والمؤلفين').icon(Users),
              S.divider(),
              S.listItem()
                .title('أرشفة صفحة المدونة (SEO)')
                .icon(Globe)
                .id('blogPage')
                .child(S.document().schemaType('blogPage').documentId('blogPage')),
            ])
        ),

      S.divider(),

      // 🏗️ المجموعة الثانية: المحفظة العقارية (Core Business)
      S.listItem()
        .title('إدارة المحتوى العقاري')
        .icon(Building2)
        .child(
          S.list()
            .title('المشاريع والشركاء العقاريين')
            .items([
              S.documentTypeListItem('project').title('🏢 المشاريع والوحدات'),
              S.documentTypeListItem('developer').title('🤝 المطورين العقاريين'),
              S.documentTypeListItem('location').title('📍 المناطق والمدن'),
              S.documentTypeListItem('district').title('🏘️ الأحياء السكنية'),
            ])
        ),

      S.divider(),

      // 📄 المجموعة الثالثة: إدارة الصفحات والإعدادات (Structure & Legal)
      S.listItem()
        .title('إدارة صفحات الموقع')
        .icon(Layout)
        .child(
          S.list()
            .title('بناء الهيكل والإعدادات')
            .items([
              // إعدادات الـ SEO العام في مقدمة القائمة
              S.listItem()
                .title('🌐 إعدادات الموقع والـ SEO العام')
                .id('siteSettings')
                .icon(Settings)
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              
              S.divider(),

              S.listItem()
                .title('ℹ️ صفحة من نحن')
                .id('aboutPage')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              
              S.listItem()
                .title('📞 صفحة اتصل بنا')
                .id('contactPage')
                .child(S.document().schemaType('contactPage').documentId('contactPage')),

              S.listItem()
                .title('👥 صفحة المطورين (الرئيسية)')
                .id('developersPage')
                .child(S.document().schemaType('developersPage').documentId('developersPage')),

              S.divider(),

              S.listItem()
                .title('⚖️ سياسة الخصوصية')
                .id('privacyPage')
                .child(S.document().schemaType('privacyPage').documentId('privacyPage')),

              S.listItem()
                .title('📜 الشروط والأحكام')
                .id('termsPage')
                .icon(FileText)
                .child(S.document().schemaType('termsPage').documentId('termsPage')),

              S.listItem()
                .title('🗺️ خريطة الموقع (SEO)')
                .id('sitemapPage')
                .icon(Map)
                .child(S.document().schemaType('sitemapPage').documentId('sitemapPage')),
            ])
        ),

      // تصفية أي أنواع أخرى متبقية تلقائياً (Backup)
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId()) && 
        !['project', 'developer', 'location', 'district', 'post', 'author', 'blogPage', 'termsPage', 'sitemapPage'].includes(listItem.getId())
      ),
    ])

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action !== 'duplicate' && action !== 'delete' && action !== 'unpublish')
        : input,
  },

  plugins: [
    structureTool({ structure: myStructure }),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})