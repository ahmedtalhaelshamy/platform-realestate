import CompareClient from './CompareClient';
import { CONTACT_INFO } from '@/components/constants/contact';

// 🏁 الدومين الموحد المعتمد للسيو
const BASE_URL = 'https://platformrealestate.co';

/**
 * ✅ 1. التوليد الثابت (SSG)
 * ضمان توفر النسخة العربية والإنجليزية وقت الـ Build لسرعة خارقة
 */
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

/**
 * ✅ 2. الـ SEO Metadata (الأرشفة المتبادلة)
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  const title = isAr ? 'مقارنة المشاريع العقارية' : 'Compare Real Estate Projects';
  const description = isAr 
    ? 'أداة ذكية للمقارنة بين أفضل المشاريع والكمبوندات في مصر من حيث الأسعار، أنظمة السداد، ومواعيد الاستلام لضمان أفضل استثمار.' 
    : 'Smart tool to compare top Egyptian compounds and projects by price, payment plans, and delivery dates for the best investment.';

  const arPath = `${BASE_URL}/ar/compare/`;
  const enPath = `${BASE_URL}/en/compare/`;
  const currentPath = isAr ? arPath : enPath;

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: currentPath,
      languages: {
        'ar': arPath,
        'en': enPath,
        'x-default': arPath,
      },
    },
    openGraph: {
      title,
      description,
      url: currentPath,
      locale: isAr ? 'ar_EG' : 'en_US',
      type: 'website',
    },
    // منع أرشفة نتائج المقارنة الفارغة أو المتغيرة (اختياري، لكن يفضل بقاؤها للفائدة)
    robots: {
      index: true,
      follow: true,
    }
  };
}

/**
 * 🏗️ المكون الرئيسي لصفحة المقارنة
 */
export default async function ComparePage({ params }) {
  const { lang } = await params;
  const isAr = lang === 'ar';

  return (
    <main 
      className="min-h-screen bg-white" 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* تم تمرير اللغة للـ Client Component 
          لضمان عرض النصوص (مثل "لا يوجد عقارات للمقارنة") باللغة الصحيحة
      */}
      <CompareClient lang={lang} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #ffffff; }
        /* تحسين مظهر التمرير العرضي في جدول المقارنة */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}