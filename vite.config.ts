import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // base: '/your-repo-name/', // Uncomment and change this for GitHub Pages deploy
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
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
