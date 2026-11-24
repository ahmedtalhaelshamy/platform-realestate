/**
 * يتحقق أن مصدر الصورة القادم من Sanity له asset فعلي.
 * صورة فيها alt فقط بدون asset تجعل image-url يرمي
 * "Unable to resolve image URL from source" ويُسقط الصفحة/الـ build.
 */
export function hasImage(source) {
  if (!source || typeof source !== 'object') {
    return typeof source === 'string' && source.length > 0;
  }
  const asset = source.asset;
  return Boolean(
    asset &&
      (asset._ref || asset._id || asset.url || (typeof asset === 'string' && asset))
  );
}

/** يُرجع فقط الصور التي لها asset (يتعامل مع null/undefined). */
export function filterImages(list) {
  return Array.isArray(list) ? list.filter(hasImage) : [];
}

/**
 * builder وهمي آمن: كل الدوال المتسلسلة ترجع نفسه و url() ترجع ''.
 */
export const emptyImageBuilder = (() => {
  const stub = new Proxy(function () {}, {
    get: (_, prop) => (prop === 'url' ? () => '' : () => stub),
  });
  return stub;
})();
