import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SITE_DIR = path.resolve(import.meta.dirname, '../..');

/** The URLs the hand-written service worker precaches on install. */
function precachedUrls(): string[] {
  const source = readFileSync(path.join(SITE_DIR, 'service-worker.js'), 'utf8');
  const list = /const ASSETS_TO_CACHE = \[([\s\S]*?)\];/.exec(source);
  if (!list) throw new Error('ASSETS_TO_CACHE not found in service-worker.js');
  return [...list[1].matchAll(/^\s*'([^']+)'/gm)].map((match) => match[1]);
}

describe('service worker precache list', () => {
  it('is parsed', () => {
    expect(precachedUrls().length).toBeGreaterThan(20);
  });

  // `cache.addAll` rejects as a whole on a single 404, which leaves the PWA without an offline copy.
  it('only lists files that exist in Deutsch_lernen/', () => {
    const missing = precachedUrls()
      .map((url) => (url === './' ? './index.html' : url))
      .filter((url) => !existsSync(path.join(SITE_DIR, url)));
    expect(missing).toEqual([]);
  });

  it('is registered from the home page with a scope-relative URL', () => {
    const home = readFileSync(path.join(SITE_DIR, 'index.html'), 'utf8');
    expect(home).toMatch(/serviceWorker\.register\(\s*['"](\.\/)?service-worker\.js['"]/);
  });
});
