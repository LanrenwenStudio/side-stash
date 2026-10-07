import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { localizedPages } from './seo';

export default defineConfig({
  plugins: [tailwindcss(), localizedPages()],
  root: resolve(__dirname),
  cacheDir: resolve(__dirname, '../node_modules/.vite-side-stash-website'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, '../dist-website'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        zh: resolve(__dirname, 'zh/index.html'),
        traditional: resolve(__dirname, 'zh-TW/index.html'),
        ja: resolve(__dirname, 'ja/index.html'),
        ko: resolve(__dirname, 'ko/index.html'),
        es: resolve(__dirname, 'es/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      // Keep extension imports stable when bundling the marketing site
      '@sidepanel': resolve(__dirname, '../entrypoints/sidepanel'),
    },
  },
});
