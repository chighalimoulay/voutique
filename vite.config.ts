import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  // GitHub Pages تُقدَّم من مسار فرعي (username.github.io/voutique/)، بينما
  // Netlify/Vercel تُقدَّم من الجذر. الوضع gh-pages (عبر npm run deploy)
  // هو الوحيد الذي يستخدم المسار الفرعي؛ npm run build العادي يبقى بالجذر.
  base: mode === 'gh-pages' ? '/voutique/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // تقسيم الحزم يبقي الحزمة الأساسية صغيرة وسريعة على الهاتف
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
  },
}));
