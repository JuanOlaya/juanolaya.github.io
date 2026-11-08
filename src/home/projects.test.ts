import { describe, expect, it } from 'vitest';
import { projects, publishedProjects, type Project } from './projects.ts';

// Pages that stay live after the legacy archive (issue #7); everything else moved to /legacy/.
const LIVE_PAGES = [
  '/Antonella/',
  '/Balconity/',
  '/CV/',
  '/Deutsch_lernen/',
  '/EurekaWall/',
  '/HCI_BHT_Website/',
  '/Haptic_Cards/',
  '/MuseFlow/',
  '/ParticleCanvas/',
  '/PixelGrid/',
  '/PlatformGame/',
  '/Project_Management/',
  '/UX/',
  '/multitouchTest/',
];

const allUrls = projects.flatMap((project) => project.links.map((link) => link.url));

describe('projects data', () => {
  it('keeps the seven research projects of the original page', () => {
    expect(projects).toHaveLength(7);
  });

  it('gives every project a title, a description and at least one link', () => {
    for (const project of projects) {
      expect(project.title.trim()).not.toBe('');
      expect(project.description.trim()).not.toBe('');
      expect(project.links.length).toBeGreaterThan(0);
    }
  });

  it('has unique titles', () => {
    expect(new Set(projects.map((project) => project.title)).size).toBe(projects.length);
  });

  it('uses only https or site-relative links', () => {
    for (const url of allUrls) expect(url).toMatch(/^(https:\/\/|\/)/);
  });

  it('points internal links at live pages only', () => {
    const internal = allUrls.filter((url) => url.startsWith('/'));
    expect(internal.length).toBeGreaterThan(0);
    for (const url of internal) expect(LIVE_PAGES.some((page) => url.startsWith(page))).toBe(true);
  });

  it('only allows the known statuses', () => {
    for (const project of projects) expect(['published', 'hidden']).toContain(project.status);
  });
});

describe('publishedProjects', () => {
  const sample = (title: string, status: Project['status']): Project => ({
    title,
    description: 'd',
    links: [{ label: 'l', url: '/MuseFlow/' }],
    status,
  });

  it('keeps published projects in their original order', () => {
    const list = [sample('a', 'published'), sample('b', 'hidden'), sample('c', 'published')];
    expect(publishedProjects(list).map((project) => project.title)).toEqual(['a', 'c']);
  });

  it('hides every project today, matching the page before the migration', () => {
    expect(publishedProjects(projects)).toEqual([]);
  });
});
