import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { assertValidEntries, pageInputFrom, verbatimCopiesFrom, type SiteEntry } from './page-inputs.ts';
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
    expect(verbatimCopiesFrom(entries)).toEqual([{ path: 'MuseFlow', exclude: [] }]);
  });

  it('keeps a named HTML page at its file URL', () => {
    const entries: SiteEntry[] = [
      { kind: 'vite', dir: 'WeightLever', html: 'weightLever_simulation_Gemini_v4.html' },
    ];

    expect(pageInputFrom(entries, root)).toEqual({
      'WeightLever/weightLever_simulation_Gemini_v4': path.resolve(
        root,
        'WeightLever/weightLever_simulation_Gemini_v4.html',
      ),
    });
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

  it.each(['../evil.html', 'sub/page.html', 'page.htm'])('rejects html "%s"', (html) => {
    expect(() => assertValidEntries([{ kind: 'vite', dir: 'WeightLever', html }])).toThrow(/Invalid html/);
  });

  it('rejects an unsafe exclude sub-path', () => {
    const entries: SiteEntry[] = [{ kind: 'legacy', path: 'Deutsch_lernen', exclude: ['../src'] }];
    expect(() => assertValidEntries(entries)).toThrow(/relative POSIX path/);
  });

  it('rejects the same legacy path listed twice', () => {
    const entries: SiteEntry[] = [
      { kind: 'legacy', path: 'UX' },
      { kind: 'legacy', path: 'UX' },
    ];
    expect(() => assertValidEntries(entries)).toThrow(/Duplicate site entry "UX"/);
  });

  it('rejects the same Vite page listed twice, even when html is spelled out', () => {
    const entries: SiteEntry[] = [
      { kind: 'vite', dir: 'UX' },
      { kind: 'vite', dir: 'UX', html: 'index.html' },
    ];
    expect(() => assertValidEntries(entries)).toThrow(/Duplicate site entry "UX\/index.html"/);
  });

  it('rejects a page migrated while its legacy entry is still listed', () => {
    const migratedHome: SiteEntry[] = [
      { kind: 'vite', dir: '' },
      { kind: 'legacy', path: 'index.html' },
    ];
    const migratedFolder: SiteEntry[] = [
      { kind: 'legacy', path: 'UX' },
      { kind: 'vite', dir: 'UX' },
    ];

    expect(() => assertValidEntries(migratedHome)).toThrow(/Duplicate site entry "index.html"/);
    expect(() => assertValidEntries(migratedFolder)).toThrow(/Legacy path "UX" would overwrite Vite page/);
  });

  it('rejects a legacy parent folder that would overwrite a nested Vite page', () => {
    const nestedPage: SiteEntry[] = [
      { kind: 'vite', dir: 'Antonella/Lenguajes' },
      { kind: 'legacy', path: 'Antonella' },
    ];

    expect(() => assertValidEntries(nestedPage)).toThrow(/would overwrite Vite page/);
  });

  it('rejects a legacy folder that covers a named HTML page', () => {
    const entries: SiteEntry[] = [
      { kind: 'vite', dir: 'WeightLever', html: 'weightLever_simulation_Gemini_v4.html' },
      { kind: 'legacy', path: 'WeightLever' },
    ];
    expect(() => assertValidEntries(entries)).toThrow(/would overwrite Vite page/);
  });

  it('allows a legacy folder whose exclude leaves the Vite page out', () => {
    const entries: SiteEntry[] = [
      { kind: 'vite', dir: 'Deutsch_lernen/app' },
      { kind: 'legacy', path: 'Deutsch_lernen', exclude: ['app'] },
    ];
    expect(() => assertValidEntries(entries)).not.toThrow();
    expect(verbatimCopiesFrom(entries)).toEqual([{ path: 'Deutsch_lernen', exclude: ['app'] }]);
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
      .map((entry) => (entry.kind === 'vite' ? path.join(entry.dir, entry.html ?? 'index.html') : entry.path))
      .filter((location) => !existsSync(path.join(repoRoot, location)));
    expect(missing).toEqual([]);
  });
});
