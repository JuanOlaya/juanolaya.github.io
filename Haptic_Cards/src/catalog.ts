import { devices } from './data/devices';
import { mechanismFamilies } from './data/families';
import { DEFAULT_PATTERN, patternNames } from './data/patterns';
import type { Device, MechanismFamily, PatternName } from './data/types';

export const CARDS_PER_PAGE = 4;
export const ALL_FAMILIES = 'all';

/** What the visitor is looking at; `page` is 0-based. */
export interface CatalogState {
  patternIndex: number;
  page: number;
  /** True shows every family's pills; false focuses on the active pattern's family. */
  allFamilies: boolean;
}

export const initialState: CatalogState = {
  patternIndex: patternNames.indexOf(DEFAULT_PATTERN),
  page: 0,
  allFamilies: true,
};

export function devicesOf(pattern: PatternName): Device[] {
  return devices.filter((device) => device.category === pattern);
}

export function pageCount(pattern: PatternName): number {
  return Math.max(1, Math.ceil(devicesOf(pattern).length / CARDS_PER_PAGE));
}

export function patternAt(index: number): PatternName {
  const count = patternNames.length;
  return patternNames[((index % count) + count) % count];
}

export function pageDevices(state: CatalogState): Device[] {
  const start = state.page * CARDS_PER_PAGE;
  return devicesOf(patternAt(state.patternIndex)).slice(start, start + CARDS_PER_PAGE);
}

export function familyOf(pattern: PatternName): MechanismFamily {
  return mechanismFamilies.find((family) => family.patterns.includes(pattern)) ?? mechanismFamilies[0];
}

/** The family tab shown as active: `all`, or the family that holds the active pattern. */
export function activeFamilyId(state: CatalogState): string {
  return state.allFamilies ? ALL_FAMILIES : familyOf(patternAt(state.patternIndex)).id;
}

function wrapIndex(index: number): number {
  return patternNames.indexOf(patternAt(index));
}

export function selectPattern(state: CatalogState, index: number, page = 0): CatalogState {
  return { ...state, patternIndex: wrapIndex(index), page };
}

/** Header ▶: next page of cards, or the first page of the next pattern. */
export function next(state: CatalogState): CatalogState {
  if (state.page < pageCount(patternAt(state.patternIndex)) - 1) return { ...state, page: state.page + 1 };
  return selectPattern(state, state.patternIndex + 1);
}

/** Header ◀: previous page of cards, or the last page of the previous pattern. */
export function previous(state: CatalogState): CatalogState {
  if (state.page > 0) return { ...state, page: state.page - 1 };
  const target = state.patternIndex - 1;
  return selectPattern(state, target, pageCount(patternAt(target)) - 1);
}

/** Arrow keys and page dots stay inside the active pattern. */
export function goToPage(state: CatalogState, page: number): CatalogState {
  const inRange = page >= 0 && page < pageCount(patternAt(state.patternIndex));
  return inRange ? { ...state, page } : state;
}

/** A family tab: focus that family and jump to its first pattern unless the active one already belongs to it. */
export function selectFamily(state: CatalogState, familyId: string): CatalogState {
  const family = mechanismFamilies.find((candidate) => candidate.id === familyId);
  if (!family) return { ...state, allFamilies: true };
  const focused = { ...state, allFamilies: false };
  if (family.patterns.includes(patternAt(state.patternIndex))) return focused;
  return selectPattern(focused, patternNames.indexOf(family.patterns[0]));
}
