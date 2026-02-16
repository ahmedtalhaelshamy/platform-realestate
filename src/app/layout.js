// src/app/layout.js

export const metadata = {
  title: 'Platform Real Estate',
  description: 'Your Trusted Real Estate Advisor in Egypt',
  verification: {
    google: 'googleafb8df9395692258', // الكود اللي في اسم الملف بتاعك
  },
}

export default function RootLayout({ children }) {
  // ✅ الحل الصحيح لمنع تكرار الوسوم: 
  // نرجع الأطفال (children) مباشرة بدون أي تغليف بـ html أو body
  // لأن الـ [lang]/layout.js هو اللي بيقوم بالمهمة دي حالياً
  return children;
}