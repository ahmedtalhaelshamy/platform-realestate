import { notFound } from "next/navigation";

/**
 * أي مسار غير معروف تحت /[lang]/ يرجّع 404 حقيقي (بدل 200 soft-404).
 * صفحة الـ 404 نفسها ([lang]/not-found.jsx) تأخذ noindex تلقائياً من Next ولا ترث canonical.
 */
export default async function CatchAllNotFound() {
  notFound();
}
