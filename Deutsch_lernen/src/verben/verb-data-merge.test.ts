import { describe, expect, it } from 'vitest';
import {
  getExampleLoadKey,
  mergeVerbData,
  normalizeModalTabId,
  parseJsonUtf8,
  tabNeedsLazyExamples,
} from './verb-data-merge.ts';

/** Characterization tests: they pin what these functions did inside `verben/A1_A2_B1/script/script.js`. */
describe('mergeVerbData (the safeMerge of the loaders in script.js)', () => {
  it('copies new keys and overwrites non-protected ones', () => {
    const target: Record<string, unknown> = { a: 1 };
    mergeVerbData(target, { a: 2, b: [3] });
    expect(target).toEqual({ a: 2, b: [3] });
  });

  it('keeps core strings the target already has, but fills empty ones', () => {
    const target: Record<string, unknown> = { es: 'ser', level: '', theme: 5 };
    mergeVerbData(target, { es: 'estar', level: 'A1', theme: 'Existenz', en_verb: 'to be' });
    expect(target).toEqual({ es: 'ser', level: 'A1', theme: 'Existenz', en_verb: 'to be' });
  });

  it('skips pronoun objects at the root, and the extra keys the Präsens loader passes', () => {
    const target: Record<string, unknown> = {};
    mergeVerbData(target, { wir: { x: 1 }, sie: null, ihr: 'ok', es_example: { y: 1 } });
    expect(target).toEqual({ ihr: 'ok', es_example: { y: 1 } });
    const praesens: Record<string, unknown> = {};
    mergeVerbData(praesens, { es_example: { y: 1 }, en_example: [], du: {} }, [
      'es',
      'es_example',
      'en_example',
    ]);
    expect(praesens).toEqual({ du: {} });
  });

  it('ignores a missing or non-object source', () => {
    const target = { a: 1 };
    mergeVerbData(target, null);
    mergeVerbData(target, 'x');
    expect(target).toEqual({ a: 1 });
  });
});

describe('parseJsonUtf8', () => {
  it('decodes the body as UTF-8 JSON', async () => {
    const response = new Response(new TextEncoder().encode('{"verb":"müssen"}'));
    expect(await parseJsonUtf8(response)).toEqual({ verb: 'müssen' });
  });
});

describe('modal example tabs', () => {
  it('names the Präsens tab infinitiv and keys loads per verb and tab', () => {
    expect(normalizeModalTabId('praesens')).toBe('infinitiv');
    expect(normalizeModalTabId(undefined)).toBe('infinitiv');
    expect(normalizeModalTabId('perfekt')).toBe('perfekt');
    expect(getExampleLoadKey('sein', 'perfekt')).toBe('sein::perfekt');
  });

  it('needs a fetch while the data a tab shows is missing', () => {
    expect(tabNeedsLazyExamples('sein', {}, 'praesens')).toBe(true);
    expect(tabNeedsLazyExamples('sein', { praesens_examples: [1], praesens_fragen: [1] }, 'infinitiv')).toBe(
      false,
    );
    expect(tabNeedsLazyExamples('sein', {}, 'perfekt')).toBe(true);
    expect(tabNeedsLazyExamples('sein', { praeteritum_conjugations: {} }, 'praeteritum')).toBe(true);
    expect(tabNeedsLazyExamples('sein', null, 'perfekt')).toBe(false);
    expect(tabNeedsLazyExamples('sein', {}, 'wortschatz')).toBe(false);
  });

  it('only fetches Konjunktiv II for the verbs that have that tab', () => {
    expect(tabNeedsLazyExamples('sein', {}, 'konjunktiv')).toBe(true);
    expect(tabNeedsLazyExamples('laufen', {}, 'konjunktiv')).toBe(false);
  });
});
