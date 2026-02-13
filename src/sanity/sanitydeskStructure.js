import { Newspaper, Layout, Settings, Users, Building2, Globe, FileText, Map } from 'lucide-react';

export const structure = (S) =>
  S.list()
    .title('لوحة تحكم بلاتفورم')
    .items([
      // ✍️ 1. مركز إدارة المحتوى الإخباري (Posts + Authors + Blog SEO)
      S.listItem()
        .title('المدونة ومركز الأخبار')
        .icon(Newspaper)
        .child(
          S.list()
            .title('إدارة المحتوى الإخباري')
            .items([
              S.documentTypeListItem('post').title('جميع المقالات').icon(Newspaper),
              S.documentTypeListItem('author').title('فريق التحرير والمؤلفين').icon(Users),
              S.divider(),
              S.documentListItem()
                .schemaType('blogPage')
                .id('blogPage')
                .title('أرشفة صفحة المدونة (SEO)')
                .icon(Globe),
            ])
        ),
      
      S.divider(),

      // 🏗️ 2. المحفظة العقارية (النشاط الأساسي)
      S.listItem()
        .title('إدارة العقارات')
        .icon(Building2)
        .child(
          S.list()
            .title('المحتوى العقاري')
            .items([
              S.documentTypeListItem('project').title('🏢 المشاريع والوحدات'),
              S.documentTypeListItem('developer').title('🤝 المطورين العقاريين'),
              S.documentTypeListItem('location').title('📍 المناطق والمدن'),
              S.documentTypeListItem('district').title('🏘️ الأحياء السكنية'),
            ])
        ),

      S.divider(),

      // 📄 3. بناء الهيكل والصفحات (Singletons + Settings)
      S.listItem()
        .title('إدارة صفحات الموقع')
        .icon(Layout)
        .child(
          S.list()
            .title('محتوى الصفحات والإعدادات')
            .items([
              // إعدادات الموقع العامة بقت في أول القائمة هنا لأهميتها
              S.documentListItem()
                .schemaType('siteSettings')
                .id('siteSettings')
                .title('🌐 إعدادات الموقع و SEO العام')
                .icon(Settings),
              S.divider(),
              
              S.listItem()
                .title('ℹ️ صفحة من نحن')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.listItem()
                .title('📞 صفحة اتصل بنا')
                .child(S.document().schemaType('contactPage').documentId('contactPage')),
              S.listItem()
                .title('👥 صفحة المطورين')
                .child(S.document().schemaType('developersPage').documentId('developersPage')),

              S.divider(),
              
              S.listItem()
                .title('⚖️ سياسة الخصوصية')
                .child(S.document().schemaType('privacyPage').documentId('privacyPage')),
              S.listItem()
                .title('📜 الشروط والأحكام')
                .icon(FileText)
                .child(S.document().schemaType('termsPage').documentId('termsPage')),
              S.listItem()
                .title('🗺️ خريطة الموقع (SEO)')
                .icon(Map)
                .child(S.document().schemaType('sitemapPage').documentId('sitemapPage')),
            ])
        ),
    ]);