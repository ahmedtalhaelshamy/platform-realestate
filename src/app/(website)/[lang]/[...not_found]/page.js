// امسح 'use client' من هنا تماماً
import { notFound } from "next/navigation";
import NotFoundUI from "@/components/NotFoundUI"; // هنكريت المكون ده حالا

// 🚀 السيطرة اليدوية على SEO صفحة الخطأ - هنا مسموح بالـ metadata لأننا في Server Component
export const metadata = {
  title: {
    absolute: "404 - الصفحة غير موجودة | بلاتفورم العقارية",
  },
  description: "عذراً، الصفحة التي تبحث عنها غير موجودة في منصة بلاتفورم العقارية.",
  robots: { index: false, follow: true }, // بنقول لجوجل متأرشف الصفحة دي بس اتبع روابطها
};

export default async function NotFoundPage({ params }) {
  const { lang } = await params;
  
  // بنعرض واجهة الـ 404 اللي إنت صممتها
  return <NotFoundUI lang={lang} />;
}