import { client } from '@/sanity/client';
import DevelopersListClient from './DevelopersListClient';
import { Suspense } from 'react';

// ✅ 1. PERFORMANCE: ضبط الصفحة لتكون Static مع تحديث كل ساعة
export const dynamic = 'force-static';
export const revalidate = 3600; 

/**
 * 📡 جلب بيانات العمالقة (Titans)
 * قمنا بالتأكد من جلب nameAr و nameEn معاً لدعم البحث الثنائي
 */
async function fetchDevelopersData() {
  const query = `*[_type == "developer" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    nameAr,
    nameEn,
    "slug": slug.current,
    logo,
    "projectsCount": count(*[_type == "project" && references(^._id) && !(_id in path("drafts.**"))])
  }`;
  
  try {
    const data = await client.fetch(query);
    return data || [];
  } catch (error) {
    console.error("Critical error fetching developers:", error);
    return [];
  }
}

/**
 * 🏗️ المكون الرئيسي لصفحة المطورين (Server-Side)
 */
export default async function DevelopersPage({ params }) {
  // ✅ Next.js 15: يجب عمل await للـ params قبل استخدامها
  const resolvedParams = await params;
  const { lang } = resolvedParams;

  // جلب البيانات في السيرفر لضمان الـ SEO وسرعة التحميل
  const developers = await fetchDevelopersData();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#C02026] rounded-full animate-spin"></div>
      </div>
    }>
      {/* تمرير البيانات كاملة لمكون الكلينت الذكي */}
      <DevelopersListClient initialDevelopers={developers} lang={lang} />
    </Suspense>
  );
}