/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── هوية Mauve Elegance ──
        mauve: {
          DEFAULT: '#B78A9B',
          50: '#FBF6F8',
          100: '#F5EAEF',
          200: '#EBD6DF',
          300: '#DDBBC9',
          400: '#CBA1B3',
          500: '#B78A9B',
          600: '#9E6F81',
          700: '#7F5867',
          800: '#5F424E',
          900: '#412D36',
        },
        softpink: {
          DEFAULT: '#E8C9D4',
          light: '#F4E4EA',
          dark: '#D9AFBF',
        },
        cream: {
          DEFAULT: '#FAF7F4',
          dark: '#F2EBE5',
        },
        ink: {
          DEFAULT: '#3B2B2F',
          soft: '#6B565B',
          muted: '#9B8A8E',
        },
        gold: {
          DEFAULT: '#C9A86A',
          light: '#E0C894',
          dark: '#A88948',
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
        soft: '0 2px 12px -4px rgba(59, 43, 47, 0.10)',
        card: '0 8px 28px -12px rgba(59, 43, 47, 0.16)',
        lift: '0 18px 44px -18px rgba(59, 43, 47, 0.28)',
        gold: '0 8px 24px -12px rgba(201, 168, 106, 0.55)',
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
