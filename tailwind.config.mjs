/** @type {import('tailwindcss').Config} */

// 1. تعريف الكائن في متغير ثابت (Named Assignment)
const tailwindConfig = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // إعدادات الخطوط لضمان تجربة مستخدم (UX) ممتازة في مصر 2026
      fontFamily: {
        // نستخدم المتغيرات القادمة من next/font لضمان السرعة
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        arabic: ['var(--font-cairo)', 'serif'],
      },
      colors: {
        // هوية براند "بلاتفورم" العقاري
        'brand-red': '#C02026',  // اللون الأساسي للوجو والأزرار (CTA)
        'brand-dark': '#1A1A1A', // رمادي غامق جداً للنصوص لتباين مريح للعين
        'brand-gray': {
          50: '#F8FAFC',  // لون الخلفية الموحد Slate-50 الذي اخترناه
          100: '#F1F5F9',
          400: '#94A3B8',
          900: '#0F172A',
        },
      },
      // إضافة تحسينات للحواف (Border Radius) لتناسب التصميم العقاري العصري
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

// 2. تصدير المتغير كـ Default
export default tailwindConfig;