import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [tailwindcss()],
  root: resolve(__dirname),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, '../dist-website'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // Keep extension imports stable when bundling the marketing site
      '@sidepanel': resolve(__dirname, '../entrypoints/sidepanel'),
    },
  },
});
