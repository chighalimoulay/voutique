/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── هوية Olive & Blush (زيتوني ووردي) ──
        // مفاتيح التوكِن (mauve/softpink/...) أُبقيت كما هي حتى تنعكس القيم
        // الجديدة تلقائيًا على كل مكوّن في الموقع دون تعديل أي ملف آخر.
        mauve: {
          DEFAULT: '#A3A847', // اللون الأساسي — أخضر زيتوني فاتح
          50: '#F7F8EC',
          100: '#EEF0D3',
          200: '#DCE1AC',
          300: '#C7CE83',
          400: '#B3BB61',
          500: '#A3A847',
          600: '#888C3B',
          700: '#6C6F2F',
          800: '#515322',
          900: '#383A17',
        },
        softpink: {
          DEFAULT: '#F5C6D6', // اللون الثانوي — وردي فاتح
          light: '#FCE6EE',
          dark: '#E7A3BE',
        },
        cream: {
          DEFAULT: '#FAFAF1', // خلفية عامة بلمسة زيتونية دافئة تحافظ على وضوح القراءة
          dark: '#F1F1DF',
        },
        ink: {
          DEFAULT: '#4A1F35', // العناوين والنصوص البارزة — وردي غامق
          soft: '#7A4A5E',
          muted: '#A9808F',
        },
        gold: {
          DEFAULT: '#D9C48C', // لمسة ذهبية فاتحة مساعدة
          light: '#ECE0BA',
          dark: '#B99D5E',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Segoe UI', 'Tahoma', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'Segoe UI', 'Tahoma', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        // مبنية على ink (#4A1F35) و gold (#D9C48C) — حدّثيها إن غيّرتِ هذين التوكِنين
        soft: '0 2px 12px -4px rgba(74, 31, 53, 0.10)',
        card: '0 8px 28px -12px rgba(74, 31, 53, 0.16)',
        lift: '0 18px 44px -18px rgba(74, 31, 53, 0.28)',
        gold: '0 8px 24px -12px rgba(217, 196, 140, 0.55)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
