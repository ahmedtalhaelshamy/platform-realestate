// 1. استيراد القوالب الأساسية
import siteSettings from './siteSettings'
import aboutPage from './aboutPage'
import privacyPage from './privacyPage'
import contactPage from './contactPage'
import developersPage from './developersPage'
import blogPage from './blogPage' 
import project from './project'
import location from './location'
import district from './district'
import developer from './developer'
import author from './author'

// ✅ استيراد ملف الشروط والخريطة
import termsPage from './termsPage' 

// ✅ استيراد موديل المقالات
import { post } from './post' 

// 2. استيراد الكائنات المساعدة
import seo from './objects/seo'

// 💡 تجميع الأنواع في مصفوفة واحدة
const types = [
  siteSettings,
  aboutPage,
  blogPage,
  privacyPage,
  contactPage,
  developersPage,
  
  // فك مصفوفة الشروط والروابط
  ...termsPage, 

  post,
  project,
  location,
  district,
  developer,
  author,
  seo, 
]

export const schemaTypes = types;