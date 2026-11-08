import { describe, expect, it } from 'vitest';
import { compactToLevel, lightweightVerbData } from './verb-cache.ts';

describe('lightweightVerbData (verb cache snapshot)', () => {
  it('drops the example and word-family payloads, which are fetched again on demand', () => {
    const snapshot = lightweightVerbData({
      sein: {
        es: 'ser',
        praesens_examples: [1],
        praeteritum_examples: [2],
        praesens_fragen: [3],
        wortfamilie: [4],
      },
    });
    expect(snapshot).toEqual({ sein: { es: 'ser' } });
  });

  it('skips entries that are not verb objects and copies the rest', () => {
    const source = { a: null, b: 'x', c: [1], d: { es: 'd' } };
    const snapshot = lightweightVerbData(source);
    expect(snapshot).toEqual({ d: { es: 'd' } });
    expect(snapshot.d).not.toBe(source.d);
  });

  it('accepts a missing source', () => {
    expect(lightweightVerbData(undefined)).toEqual({});
  });
});

describe('compactToLevel (fallback when the full cache exceeds the quota)', () => {
  const payload = {
    allVerbsData: { sein: { es: 'ser' }, haben: { es: 'tener' }, gehen: { es: 'ir' } },
    verbGroupsByLevel: {
      A1: [{ verbs: ['sein', 'haben', 'fehlt'] }, null, { title: 'no verbs' }],
      A2: [{ verbs: ['gehen'] }],
    },
    lastUpdated: 'v1',
  };

  it('keeps only the current level and the verbs of its groups', () => {
    expect(compactToLevel(payload, 'A1')).toEqual({
      allVerbsData: { sein: { es: 'ser' }, haben: { es: 'tener' } },
      verbGroupsByLevel: { A1: payload.verbGroupsByLevel.A1 },
      lastUpdated: 'v1',
    });
  });

  it('stores an empty group list for a level without groups', () => {
    expect(compactToLevel(payload, 'B1')).toMatchObject({ allVerbsData: {}, verbGroupsByLevel: { B1: [] } });
  });
});
