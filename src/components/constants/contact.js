/**
 * 🏢 CONTACT_INFO - العمود الفقري لبيانات منصة بلاتفورم 2026
 * يتم استدعاء هذا الملف في جميع مكونات الموقع لضمان وحدة البيانات (SSOT)
 */

export const CONTACT_INFO = {
  // ✅ الدومين الرسمي الموحد للسيو (Canonical Domain)
  domain: "https://platformrealestate.co", 
  
  siteNameEn: "Platform Real Estate",
  siteNameAr: "بلاتفورم للتسويق العقاري",

  // ✅ أرقام التواصل (برمجياً وعرضاً)
  // الخام للروابط البرمجية (tel:)
  phone: "+201004011040", 
  // المنسق للعرض الجمالي في الموقع (UX)
  phoneDisplay: "+20 100 401 1040", 
  
  // رقم الواتساب (يجب أن يكون أرقام فقط بدون + لروابط wa.me)
  whatsapp: "201004011040", 
  
  email: "info@platformrealestate.co",
  
  // ✅ العناوين الجغرافية
  addressAr: "43 المنطقة 10 اللوتس الجنوبية - التجمع الخامس، القاهرة الجديدة",
  addressEn: "43/10 South Lotus, 5th Settlement, New Cairo, Egypt",
  
  // ✅ روابط الخرائط (تأكد من صحة اللينك الفعلي لاحقاً)
  googleMapsUrl: "https://maps.google.com/?q=Platform+Real+Estate+Lotus", 
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=...", // ضع هنا رابط الـ iframe إذا وجد

  // ✅ حسابات السوشيال ميديا الرسمية
  social: {
    facebook: "https://www.facebook.com/PlatformRealEstate.eg",
    instagram: "https://www.instagram.com/platform.realestate/",
    tiktok: "https://www.tiktok.com/@platformrealestate.eg",
    linkedin: "https://www.linkedin.com/company/platform-real-estate-eg",
    youtube: "https://www.youtube.com/@Platform.RealEstate-EG",
  },

  // ✅ إعدادات السيو الافتراضية (Fallback SEO)
  defaultSeo: {
    titleAr: "عقارات مصر 2026 | بلاتفورم للتسويق العقاري",
    titleEn: "Egypt Real Estate 2026 | Platform Real Estate",
    descAr: "استشارك العقاري الأول في مصر. خبرة 15 عاماً في اختيار أفضل المشاريع الاستثمارية في التجمع، زايد، والعاصمة الإدارية.",
    descEn: "Your premier real estate consultant in Egypt. 15 years of expertise in the best projects in New Cairo, Zayed, and NAC.",
  }
};