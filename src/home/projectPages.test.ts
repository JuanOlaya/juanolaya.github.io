import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { SiteEntry } from '../../tooling/page-inputs.ts';
import { siteEntries } from '../../tooling/site-pages.ts';
import { projectCategories, projectPages } from './projectPages.ts';

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

  // Explicit permanent exclusion rule: MemoDeutsch, UX Infographic, Project Management, ShapyPresence, and HCI BHT
  it('never links permanently excluded projects', () => {
    const hrefs = projectPages.map((page) => page.href);
    expect(hrefs).not.toContain('/Deutsch_lernen/');
    expect(hrefs).not.toContain('/UX/');
    expect(hrefs).not.toContain('/Project_Management/');
    expect(hrefs).not.toContain('/EurekaWall/pixelGrid/');
    expect(hrefs).not.toContain('/PixelGrid/');
    expect(hrefs).not.toContain('/HCI_BHT_Website/');

    const titles = projectPages.map((page) => page.title);
    expect(titles).not.toContain('MemoDeutsch');
    expect(titles).not.toContain('UX Infographic');
    expect(titles).not.toContain('Project Management');
    expect(titles).not.toContain('ShapyPresence');
    expect(titles).not.toContain('HCI BHT');
  });

  it('has unique links', () => {
    expect(new Set(projectPages.map((page) => page.href)).size).toBe(projectPages.length);
  });
});

describe('projectCategories', () => {
  it('groups projects into Teaching, Research and Interaction', () => {
    expect(projectCategories.map((c) => c.name)).toEqual(['Teaching', 'Research', 'Interaction']);
  });

  it('contains expected projects per category', () => {
    const teaching = projectCategories.find((c) => c.name === 'Teaching');
    expect(teaching?.projects.map((p) => p.title)).toEqual(['Haptic Cards', 'Platform Game']);

    const research = projectCategories.find((c) => c.name === 'Research');
    expect(research?.projects.map((p) => p.title)).toEqual(['MuseFlow']);
    expect(research?.projects[0]?.links).toEqual([
      {
        label: 'DOI',
        href: 'https://doi.org/10.1007/978-3-030-85613-7_9',
      },
    ]);

    const interaction = projectCategories.find((c) => c.name === 'Interaction');
    expect(interaction?.projects.map((p) => p.title)).toEqual([
      'Balcondipity',
      'Particle Canvas',
    ]);
    expect(interaction?.projects.map((p) => p.title)).not.toContain('MuseFlow');
  });
});
