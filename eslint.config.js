import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Legacy pages are plain scripts sharing globals and would flood the report, so only migrated
// and new code is linted: shared code, each page's `src/` folder and the build tooling.
const lintedSources = ['src/**', '*/src/**', '*/*/src/**', 'tooling/**', '*.config.{js,ts}'];

export default defineConfig([
  globalIgnores([
    '**/*',
    '!**/',
    ...lintedSources.map((pattern) => `!${pattern}`),
    '**/node_modules/',
    'dist/',
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['tooling/**', '*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    // Issue #11 names these components; none of them collides with an HTML element.
    files: ['Haptic_Cards/src/components/**'],
    rules: { 'vue/multi-word-component-names': ['error', { ignores: ['Carousel', 'Pills', 'Tabs'] }] },
  },
  prettier,
]);
