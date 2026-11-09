import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { SiteEntry } from '../../tooling/page-inputs.ts';
import { siteEntries } from '../../tooling/site-pages.ts';
import { projectPages } from './projectPages.ts';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

/** `/Foo/` → `Foo/index.html`, `/Foo/page.html` → `Foo/page.html`. */
function sourceFileOf(href: string): string {
  const relative = href.replace(/^\//, '');
  return relative.endsWith('/') ? `${relative}index.html` : relative;
}

function publishes(entry: SiteEntry, file: string): boolean {
  if (entry.kind === 'vite') {
    const page = entry.dir ? `${entry.dir}/${entry.html ?? 'index.html'}` : (entry.html ?? 'index.html');
    return page === file;
  }
  if (!file.startsWith(`${entry.path}/`)) return false;
  const inside = file.slice(entry.path.length + 1);
  return !(entry.exclude ?? []).some((excluded) => inside === excluded || inside.startsWith(`${excluded}/`));
}

describe('projectPages', () => {
  it.each(projectPages.map((page) => [page.href]))('%s is a page published by site-pages.ts', (href) => {
    const file = sourceFileOf(href);
    expect(existsSync(`${repoRoot}${file}`)).toBe(true);
    expect(siteEntries.some((entry) => publishes(entry, file))).toBe(true);
  });

  it('never links archived pages', () => {
    expect(projectPages.filter((page) => page.href.startsWith('/legacy/'))).toEqual([]);
  });

  // Older copies of tools the owner now maintains under /EurekaWall/.
  it('links the EurekaWall copies instead of the older duplicates', () => {
    const hrefs = projectPages.map((page) => page.href);
    expect(hrefs).toContain('/EurekaWall/balconity/');
    expect(hrefs).not.toContain('/Balconity/');
    expect(hrefs).not.toContain('/PixelGrid/');
  });

  // TODO.md §2: republished once the AI Hub degraded gracefully and the page followed the style contract.
  it('lists the UX Infographic again', () => {
    expect(projectPages.map((page) => page.href)).toContain('/UX/');
  });

  it('has unique links', () => {
    expect(new Set(projectPages.map((page) => page.href)).size).toBe(projectPages.length);
  });
});
