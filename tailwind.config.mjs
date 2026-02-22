/** @type {import('tailwindcss').Config} */

// 1. تعريف الكائن في متغير ثابت (Named Assignment)
const tailwindConfig = {
  // يفضل تفعيل الوضع الليلي بناءً على الكلاس إذا قررت إضافته مستقبلاً
  darkMode: 'class', 
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // إعداد حاوية رئيسية (Container) لضمان توسيط المحتوى وتجاوبه في كل الشاشات
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      // إعدادات الخطوط لضمان تجربة مستخدم (UX) ممتازة في مصر 2026
      fontFamily: {
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
      // إضافة تحسينات للحواف لتناسب التصميم العقاري العصري
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2.5rem', // مفيد جداً للبطاقات الكبيرة (Hero Sections)
      },
      // إضافة الظلال الفاخرة للبطاقات العقارية (Premium Real Estate Feel)
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0,0,0,0.08)',
      },
      // تأثيرات الحركة البصرية المريحة للعين (Micro-interactions)
      animation: {
        'slow-zoom': 'slow-zoom 10s ease-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    // لا حاجة لـ RTL Plugin هنا، سنعتمد على Logical Properties الأصلية في Tailwind (ps, pe, ms, me)
  ],
};

// 2. تصدير المتغير كـ Default
export default tailwindConfig;