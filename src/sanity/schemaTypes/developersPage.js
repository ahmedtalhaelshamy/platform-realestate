import { Users } from 'lucide-react'

export default {
  name: 'developersPage',
  title: 'صفحة المطورين (الرئيسية)',
  type: 'document',
  icon: Users,
  fields: [
    { 
      name: 'titleAr', 
      title: 'عنوان الصفحة - عربي', 
      type: 'string',
      initialValue: 'شركاء النجاح'
    },
    // ... الحقول القديمة ...
    
    // أضف هذا الحقل لرفع المطورين داخل الصفحة
    {
      name: 'developersList',
      title: 'قائمة المطورين',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'اسم المطور', type: 'string' },
            { 
              name: 'logo', 
              title: 'اللوجو', 
              type: 'image',
              options: { 
                hotspot: true // ✅ هذا السطر يسمح لك بضبط مكان اللوجو لو اتقص
              } 
            }
          ]
        }
      ]
    }
  ],
  // ... الباقي كما هو
}