import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createMemoryHistory } from 'vue-router';
import { describe, expect, it } from 'vitest';
import { createMemoRouter, titleFor } from './router.ts';

async function landOn(target: string) {
  const router = createMemoRouter(createMemoryHistory());
  await router.push(target);
  return router.currentRoute.value;
}

describe('MemoDeutsch router', () => {
  it('shows one case per parameter', async () => {
    const route = await landOn('/demonstrativ/akkusativ');
    expect(route.name).toBe('demonstrative');
    expect(route.params.fall).toBe('akkusativ');
  });

  it('sends an unknown case to the all-cases table', async () => {
    expect((await landOn('/demonstrativ/genitiv')).name).toBe('demonstratives');
  });

  it('sends an unknown path home', async () => {
    expect((await landOn('/nope/nothing')).name).toBe('home');
  });

  it('titles a case page like the page it replaces', () => {
    expect(titleFor({ fall: 'dativ' }, undefined)).toBe('German Demonstratives - Dativ Case (A1–A2)');
    expect(titleFor({}, 'German Demonstratives - All Cases (A1–A2)')).toBe(
      'German Demonstratives - All Cases (A1–A2)',
    );
  });
});

const DEUTSCH_LERNEN = path.resolve(import.meta.dirname, '../..');
const REDIRECTS = {
  'faelle/demonstratives/index.html': '/demonstrativ',
  'faelle/demonstratives/nominativ.html': '/demonstrativ/nominativ',
  'faelle/demonstratives/akkusativ.html': '/demonstrativ/akkusativ',
  'faelle/demonstratives/dativ.html': '/demonstrativ/dativ',
};

describe.each(Object.entries(REDIRECTS))('old URL %s', (file, route) => {
  const html = readFileSync(path.join(DEUTSCH_LERNEN, file), 'utf8');
  const target = `/Deutsch_lernen/app/#${route}`;

  it('redirects to its view in the app', () => {
    expect(html).toContain(`url=${target}"`);
    expect(html).toContain(`location.replace('${target}')`);
  });

  it('points at a route that renders without a redirect', async () => {
    expect((await landOn(route)).fullPath).toBe(route);
  });
});
