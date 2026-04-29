/**
 * 🏢 CONTACT_INFO - العمود الفقري لبيانات منصة بلاتفورم 2026
 * يتم استدعاء هذا الملف في جميع مكونات الموقع لضمان وحدة البيانات (SSOT).
 * تم التحسين ليكون متوافقاً مع معايير الـ SEO والـ Absolute URLs.
 */

export const CONTACT_INFO = {
  // ✅ الدومين الرسمي الموحد (المسار الكامل للأرشفة)
  domain: "https://platformrealestate.co", 
  
  siteNameEn: "Platform Real Estate",
  siteNameAr: "بلاتفورم للتسويق العقاري",

  // ✅ أرقام التواصل
  // phone: يستخدم في روابط tel: ليكون قابلاً للضغط
  phone: "+201004011040", 
  phoneDisplay: "+20 100 401 1040", 
  
  // whatsapp: أرقام فقط (بدون + أو مسافات) ليعمل رابط wa.me/201004011040 بسلاسة
  whatsapp: "201004011040", 
  
  email: "info@platformrealestate.co",
  
  // ✅ العناوين الجغرافية (NAP: Name, Address, Phone لـ Google Maps)
  addressAr: "43 المنطقة 10، اللوتس الجنوبية - التجمع الخامس، القاهرة الجديدة",
  addressEn: "43 Area 10, South Lotus, 5th Settlement, New Cairo, Egypt",
  
  // ✅ الروابط الجغرافية
  // تم تصحيح الرابط ليكون الرابط المباشر للوكيشن
googleMapsUrl: "https://maps.app.goo.gl/jQGXfPKTeJq2zCJq9", 
googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.871144026363!2d31.373977!3d30.112189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145817c18c1d305d%3A0xc3f8e65870000!2sStoda%20Sheraton!5e0!3m2!1sen!2seg!4v1714407000000!5m2!1sen!2seg",
  // ✅ التواجد الرقمي (Social Signals)
  social: {
    facebook: "https://www.facebook.com/PlatformRealEstate.eg",
    instagram: "https://www.instagram.com/platform.realestate/",
    tiktok: "https://www.tiktok.com/@platformrealestate.eg",
    linkedin: "https://www.linkedin.com/company/platform-real-estate-eg",
    youtube: "https://www.youtube.com/@Platform.RealEstate-EG",
  },

  // ✅ إعدادات السيو الاحتياطية (Safety Net SEO)
  // تظهر فقط في حالة نسيان إدخال البيانات في Sanity
  defaultSeo: {
    titleAr: "عقارات مصر 2026 | استشارك العقاري المعتمد", 
    titleEn: "Egypt Real Estate 2026 | Verified Property Consultant",
    descAr: "دليلك الأول للاستثمار العقاري في مصر. استشارات مجانية لأفضل مشاريع التجمع الخامس، العاصمة الإدارية، والشيخ زايد.",
    descEn: "Egypt's premier investment hub. Expert advisory for top compounds in New Cairo, NAC, and Sheikh Zayed.",
    ogImage: "/og-main.webp" // صورة افتراضية للمشاركة
  }
};