import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: '/MindersMall/',
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      exclude: ['@braze/web-sdk'],
    },
    build: {
      rollupOptions: {
        treeshake: {
          moduleSideEffects: (id, external) => {
            if (id.includes('@braze/web-sdk')) return true;
            return external;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
