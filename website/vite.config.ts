import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [tailwindcss()],
  root: resolve(__dirname),
  build: {
    outDir: resolve(__dirname, '../dist-website'),
    emptyOutDir: true,
  },
});
