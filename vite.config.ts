import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import { copyVerbatim } from './tooling/copy-verbatim.ts';
import { assertValidEntries, pageInputFrom, verbatimCopiesFrom } from './tooling/page-inputs.ts';
import { siteEntries } from './tooling/site-pages.ts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

assertValidEntries(siteEntries);
const input = pageInputFrom(siteEntries, rootDir);

export default defineConfig({
  // User site (juanolaya.github.io): served from the domain root.
  base: '/',
  publicDir: 'public',
  plugins: [vue(), tailwindcss(), copyVerbatim(verbatimCopiesFrom(siteEntries), rootDir)],
  resolve: {
    alias: { '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)) },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // The home page already publishes a legacy `assets/` folder; keep hashed bundles apart from it.
    assetsDir: 'bundles',
    // p5 alone is about 1 MB minified, so sketch pages always exceed Vite's 500 kB default.
    chunkSizeWarningLimit: 1200,
    rolldownOptions: { input },
  },
  // Without this the dev server crawls every legacy HTML file looking for dependencies.
  optimizeDeps: { entries: Object.values(input) },
  test: {
    include: ['tooling/**/*.test.ts', 'src/**/*.test.ts', '*/src/**/*.test.ts', '*/*/src/**/*.test.ts'],
  },
});
