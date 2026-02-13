import { notFound } from "next/navigation";

export default function NotFoundCatchAll() {
  // هذه الدالة تجبر Next.js على تشغيل ملف not-found.jsx الموجود في نفس الفولدر
  notFound();
}