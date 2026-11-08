import { describe, expect, it } from 'vitest';
import { initialState, patternAt, type CatalogState } from './catalog';
import { patternNames } from './data/patterns';
import { queryFromState, stateFromQuery } from './query';
import { useCatalog, type QueryStore } from './useCatalog';

const vibration = patternNames.indexOf('Vibration');

describe('query params', () => {
  it('default view has an empty query', () => {
    expect(queryFromState(initialState)).toBe('');
    expect(stateFromQuery('')).toEqual(initialState);
  });

  it('writes pattern, focused family and 1-based page', () => {
    const state: CatalogState = { patternIndex: vibration, page: 1, allFamilies: false };
    expect(queryFromState(state)).toBe('?pattern=Vibration&family=sensory-thermal&page=2');
  });

  it('round-trips every pattern, page and family mode', () => {
    for (const [patternIndex] of patternNames.entries()) {
      for (const allFamilies of [true, false]) {
        const state: CatalogState = { patternIndex, page: 0, allFamilies };
        expect(stateFromQuery(queryFromState(state))).toEqual(state);
      }
    }
    const lastPage: CatalogState = { patternIndex: vibration, page: 1, allFamilies: true };
    expect(stateFromQuery(queryFromState(lastPage))).toEqual(lastPage);
  });

  it('reads encoded pattern names', () => {
    expect(patternAt(stateFromQuery('?pattern=Plate+tilting').patternIndex)).toBe('Plate tilting');
    expect(patternAt(stateFromQuery('?pattern=Plate%20tilting').patternIndex)).toBe('Plate tilting');
  });

  it('a family without a pattern opens the family on its first pattern', () => {
    const state = stateFromQuery('?family=fluids-pneumatics');
    expect(patternAt(state.patternIndex)).toBe('Aerodynamic resistance');
    expect(state.allFamilies).toBe(false);
  });

  it('falls back to defaults on invalid values', () => {
    expect(stateFromQuery('?pattern=foo&page=99&family=bar')).toEqual(initialState);
    expect(stateFromQuery('?page=abc')).toEqual(initialState);
    expect(stateFromQuery('?pattern=Vibration&page=0')).toEqual({ ...initialState, patternIndex: vibration });
  });
});

describe('useCatalog keeps the URL in sync', () => {
  function fakeStore(initial: string): QueryStore & { writes: string[] } {
    const writes: string[] = [];
    return { writes, read: () => initial, write: (query) => writes.push(query) };
  }

  it('restores the view from the URL', () => {
    const catalog = useCatalog(fakeStore('?pattern=Vibration&page=2'));
    expect(catalog.pattern.value).toBe('Vibration');
    expect(catalog.state.value.page).toBe(1);
    expect(catalog.pageDevices.value).toHaveLength(3);
    expect(catalog.activeFamilyId.value).toBe('all');
  });

  it('writes the query on every change', () => {
    const store = fakeStore('');
    const catalog = useCatalog(store);
    catalog.next();
    catalog.selectFamily('sensory-thermal');
    catalog.selectPattern(patternNames.indexOf('Peltier cell actuation'));
    catalog.goToPage(5);
    catalog.selectFamily('all');
    expect(store.writes).toEqual([
      '?page=2',
      '?pattern=Vibration&family=sensory-thermal',
      '?pattern=Peltier+cell+actuation&family=sensory-thermal',
      '?pattern=Peltier+cell+actuation',
    ]);
  });
});
