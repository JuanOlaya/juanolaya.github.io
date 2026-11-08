import { describe, expect, it } from 'vitest';
import {
  activeFamilyId,
  devicesOf,
  goToPage,
  initialState,
  next,
  pageCount,
  pageDevices,
  patternAt,
  previous,
  selectFamily,
  selectPattern,
  type CatalogState,
} from './catalog';
import { patternNames } from './data/patterns';
import type { PatternName } from './data/types';

const indexOf = (name: PatternName) => patternNames.indexOf(name);
const at = (name: PatternName, page = 0, allFamilies = true): CatalogState => ({
  patternIndex: indexOf(name),
  page,
  allFamilies,
});

describe('catalog paging', () => {
  it('opens on Solid mass shifting, page 1, all families', () => {
    expect(patternAt(initialState.patternIndex)).toBe('Solid mass shifting');
    expect(initialState).toMatchObject({ page: 0, allFamilies: true });
  });

  it('shows four cards per page', () => {
    expect(devicesOf('Solid mass shifting')).toHaveLength(8);
    expect(pageCount('Solid mass shifting')).toBe(2);
    expect(pageCount('Vibration')).toBe(2);
    expect(pageCount('Aerodynamic resistance')).toBe(1);
    const secondPage = devicesOf('Solid mass shifting').slice(4);
    expect(pageDevices(at('Solid mass shifting', 1))).toEqual(secondPage);
    expect(pageDevices(at('Vibration', 1))).toHaveLength(3);
  });

  it('next moves through pages, then to the next pattern', () => {
    expect(next(at('Solid mass shifting'))).toEqual(at('Solid mass shifting', 1));
    expect(next(at('Solid mass shifting', 1))).toEqual(at('Grip morphing'));
  });

  it('previous goes back a page, then to the last page of the previous pattern', () => {
    expect(previous(at('Solid mass shifting', 1))).toEqual(at('Solid mass shifting'));
    expect(previous(at('Grip morphing'))).toEqual(at('Solid mass shifting', 1));
  });

  it('wraps around both ends of the pattern list', () => {
    expect(next(at('Vibration', 1))).toEqual(at('Aerodynamic resistance'));
    expect(previous(at('Aerodynamic resistance'))).toEqual(at('Vibration', 1));
  });

  it('goToPage stays inside the active pattern', () => {
    expect(goToPage(at('Solid mass shifting'), 1)).toEqual(at('Solid mass shifting', 1));
    expect(goToPage(at('Solid mass shifting', 1), 2)).toEqual(at('Solid mass shifting', 1));
    expect(goToPage(at('Solid mass shifting'), -1)).toEqual(at('Solid mass shifting'));
  });

  it('selecting a pattern resets the page and keeps the family mode', () => {
    expect(selectPattern(at('Solid mass shifting', 1, false), indexOf('Vibration'))).toEqual(
      at('Vibration', 0, false),
    );
  });
});

describe('mechanism families', () => {
  it('"all" is active until a family is chosen', () => {
    expect(activeFamilyId(initialState)).toBe('all');
  });

  it('choosing the family of the active pattern keeps the pattern', () => {
    const state = selectFamily(at('Solid mass shifting', 1), 'mass-inertia');
    expect(state).toEqual(at('Solid mass shifting', 1, false));
    expect(activeFamilyId(state)).toBe('mass-inertia');
  });

  it('choosing another family jumps to its first pattern', () => {
    expect(selectFamily(at('Solid mass shifting', 1), 'sensory-thermal')).toEqual(at('Vibration', 0, false));
  });

  it('the focused family follows the pattern when navigating', () => {
    const state = next(at('Mass striking', 1, false));
    expect(patternAt(state.patternIndex)).toBe('Plate tilting');
    expect(activeFamilyId(state)).toBe('surface-deformation');
  });

  it('"all" or an unknown id shows every family', () => {
    expect(selectFamily(at('Vibration', 0, false), 'all')).toEqual(at('Vibration'));
    expect(selectFamily(at('Vibration', 0, false), 'nope')).toEqual(at('Vibration'));
  });
});
