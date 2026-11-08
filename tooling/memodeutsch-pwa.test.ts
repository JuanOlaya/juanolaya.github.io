import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { isLegacyCacheName } from '../Deutsch_lernen/src/pwa/caches.ts';
import {
  MEMODEUTSCH_PRECACHE,
  filesReachableFrom,
  keepPrecached,
  type BundleFile,
} from './memodeutsch-pwa.ts';

const rootDir = path.resolve(import.meta.dirname, '..');

describe('MemoDeutsch precache list', () => {
  // A missing file would silently drop out of the glob and leave the page without an offline copy.
  it('only lists files that exist in the repository', () => {
    const missing = MEMODEUTSCH_PRECACHE.filter(
      (file) => !existsSync(path.join(rootDir, 'Deutsch_lernen', file)),
    );
    expect(missing).toEqual([]);
  });

  it('keeps the start page, the verb trainer with its scripts and the Vue app', () => {
    expect(MEMODEUTSCH_PRECACHE).toEqual(
      expect.arrayContaining([
        'index.html',
        'verben/A1_A2_B1/verben.html',
        'verben/A1_A2_B1/script/verben-helpers.js',
        'verben/A1_A2_B1/script/script.js',
        'verben/A1_A2_B1/script/app/state.js',
        'app/index.html',
      ]),
    );
  });
});

describe('filesReachableFrom', () => {
  const bundle: Record<string, BundleFile> = {
    'Deutsch_lernen/app/index.html': {
      type: 'asset',
      source: '<script src="/bundles/app.js"></script><link href="/bundles/app.css" rel="stylesheet">',
    },
    'bundles/app.js': { type: 'chunk', imports: ['bundles/vue.js'], dynamicImports: ['bundles/View.js'] },
    'bundles/vue.js': { type: 'chunk', imports: [], dynamicImports: [] },
    'bundles/View.js': {
      type: 'chunk',
      imports: ['bundles/vue.js'],
      dynamicImports: [],
      viteMetadata: { importedCss: new Set(['bundles/View.css']), importedAssets: new Set() },
    },
    'bundles/View.css': { type: 'asset', source: '.x{}' },
    'bundles/app.css': { type: 'asset', source: '@font-face{src:url(/bundles/font.woff2)}' },
    'bundles/font.woff2': { type: 'asset', source: new Uint8Array() },
    'bundles/home.js': { type: 'chunk', imports: ['bundles/vue.js'], dynamicImports: [] },
  };

  it('follows HTML references, static and dynamic imports, imported CSS and CSS urls', () => {
    expect([...filesReachableFrom(bundle, 'Deutsch_lernen/app/index.html')].sort()).toEqual([
      'bundles/View.css',
      'bundles/View.js',
      'bundles/app.css',
      'bundles/app.js',
      'bundles/font.woff2',
      'bundles/vue.js',
    ]);
  });

  it('returns nothing for an entry that is not in the bundle', () => {
    expect(filesReachableFrom(bundle, 'missing.html').size).toBe(0);
  });
});

describe('keepPrecached', () => {
  const entries = [
    { url: 'Deutsch_lernen/index.html', revision: 'a', size: 1 },
    { url: 'bundles/app.js', revision: null, size: 1 },
    { url: 'bundles/home.js', revision: null, size: 1 },
  ];

  it('keeps the app bundles only and makes URLs absolute, since the worker lives in /Deutsch_lernen/', () => {
    expect(keepPrecached(entries, new Set(['bundles/app.js']))).toEqual([
      { url: '/Deutsch_lernen/index.html', revision: 'a', size: 1 },
      { url: '/bundles/app.js', revision: null, size: 1 },
    ]);
  });
});

describe('isLegacyCacheName', () => {
  it('matches the caches of the hand-written worker only', () => {
    expect(isLegacyCacheName('deutsch-lernen-v2.8')).toBe(true);
    expect(isLegacyCacheName('workbox-precache-v2-http://x/')).toBe(false);
    expect(isLegacyCacheName('memodeutsch-runtime')).toBe(false);
  });
});
