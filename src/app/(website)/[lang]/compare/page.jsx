import CompareClient from './CompareClient';

// ✅ تحويل الصفحة لـ Static عن طريق توليد اللغات مسبقاً
export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

// ✅ إضافة الميتا داتا للأرشفة
export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: lang === 'ar' ? 'مقارنة العقارات والمشاريع' : 'Compare Properties & Projects',
    description: lang === 'ar' ? 'قارن بين أفضل المشاريع العقارية في مصر من حيث السعر، المقدم، والتقسيط.' : 'Compare top real estate projects in Egypt by price, down payment, and installments.',
  };
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <CompareClient lang={lang} />;
}