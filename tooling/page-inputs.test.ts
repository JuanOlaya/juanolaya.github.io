import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { assertValidEntries, pageInputFrom, verbatimPathsFrom, type SiteEntry } from './page-inputs.ts';
import { siteEntries } from './site-pages.ts';

const root = path.resolve('/repo');
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

describe('pageInputFrom', () => {
  it('keys each Vite page by its folder so dist keeps the public URL', () => {
    const entries: SiteEntry[] = [
      { kind: 'vite', dir: 'Balconity' },
      { kind: 'vite', dir: 'Haptic_Cards' },
      { kind: 'vite', dir: 'Antonella/Lenguajes' },
    ];

    expect(pageInputFrom(entries, root)).toEqual({
      Balconity: path.resolve(root, 'Balconity/index.html'),
      Haptic_Cards: path.resolve(root, 'Haptic_Cards/index.html'),
      'Antonella/Lenguajes': path.resolve(root, 'Antonella/Lenguajes/index.html'),
    });
  });

  it('maps the site root to the root index.html', () => {
    expect(pageInputFrom([{ kind: 'vite', dir: '' }], root)).toEqual({
      home: path.resolve(root, 'index.html'),
    });
  });

  it('never hands legacy paths to the bundler', () => {
    const entries: SiteEntry[] = [
      { kind: 'legacy', path: 'MuseFlow' },
      { kind: 'vite', dir: 'Tropical' },
    ];

    expect(Object.keys(pageInputFrom(entries, root))).toEqual(['Tropical']);
    expect(verbatimPathsFrom(entries)).toEqual(['MuseFlow']);
  });
});

describe('assertValidEntries', () => {
  it.each([
    ['/Balconity', 'absolute'],
    ['Balconity/', 'trailing slash'],
    ['../outside', 'parent segment'],
    ['./Balconity', 'dot segment'],
    ['Sockets\\public', 'backslash'],
  ])('rejects %s (%s)', (dir) => {
    expect(() => assertValidEntries([{ kind: 'vite', dir }])).toThrow(/relative POSIX path/);
  });

  it('rejects the same location listed twice', () => {
    const entries: SiteEntry[] = [
      { kind: 'legacy', path: 'UX' },
      { kind: 'vite', dir: 'UX' },
    ];
    expect(() => assertValidEntries(entries)).toThrow(/Duplicate site entry "UX"/);
  });

  it('rejects a legacy copy that would overwrite a Vite page', () => {
    const migratedHome: SiteEntry[] = [
      { kind: 'vite', dir: '' },
      { kind: 'legacy', path: 'index.html' },
    ];
    const nestedPage: SiteEntry[] = [
      { kind: 'vite', dir: 'Antonella/Lenguajes' },
      { kind: 'legacy', path: 'Antonella' },
    ];

    expect(() => assertValidEntries(migratedHome)).toThrow(/would overwrite Vite page/);
    expect(() => assertValidEntries(nestedPage)).toThrow(/would overwrite Vite page/);
  });

  it('allows a legacy subfolder inside a migrated page', () => {
    const entries: SiteEntry[] = [
      { kind: 'vite', dir: 'Deutsch_lernen' },
      { kind: 'legacy', path: 'Deutsch_lernen/legacy' },
    ];
    expect(() => assertValidEntries(entries)).not.toThrow();
  });
});

describe('siteEntries', () => {
  it('is valid and every listed location exists in the repository', () => {
    expect(() => assertValidEntries(siteEntries)).not.toThrow();
    const missing = siteEntries
      .map((entry) => (entry.kind === 'vite' ? path.join(entry.dir, 'index.html') : entry.path))
      .filter((location) => !existsSync(path.join(repoRoot, location)));
    expect(missing).toEqual([]);
  });
});
