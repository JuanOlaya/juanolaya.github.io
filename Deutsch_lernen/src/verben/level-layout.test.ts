import { describe, expect, it } from 'vitest';
import {
  globalGroupIndex,
  levelsFromGroups,
  pageSizeForWidth,
  physicalGroupData,
  themeColorForVerb,
  type PhysicalLevelMap,
} from './level-layout.ts';
import { standardColors } from './verben-data.ts';

/** Characterization tests: they pin what these functions did inside `verben/A1_A2_B1/script/script.js`. */
const map: PhysicalLevelMap = {
  A1: [
    { key: 'A1_1', count: 2, fileNumbers: [1, 2] },
    { key: 'A1_2', count: 3, fileNumbers: [2, 3, 4] },
  ],
};

describe('physicalGroupData', () => {
  it('finds the layer and file of a group across layers', () => {
    expect(physicalGroupData(map, 'A1', 0)).toEqual({ physicalKey: 'A1_1', localIndex: 0, fileNumber: 1 });
    expect(physicalGroupData(map, 'A1', 3)).toEqual({ physicalKey: 'A1_2', localIndex: 1, fileNumber: 3 });
  });

  it('returns null past the last group or for an unknown level', () => {
    expect(physicalGroupData(map, 'A1', 5)).toBeNull();
    expect(physicalGroupData(map, 'C1', 0)).toBeNull();
  });

  it('falls back to the global position when a layer has no file numbers', () => {
    const loose = { A1: [{ key: 'A1_1', count: 2 }] } as unknown as PhysicalLevelMap;
    expect(physicalGroupData(loose, 'A1', 1)?.fileNumber).toBe(2);
  });
});

describe('globalGroupIndex', () => {
  it('adds the groups of the layers before the named one', () => {
    expect(globalGroupIndex(map, 'A1.2', 2)).toBe(3);
    // A key that names no layer counts every layer: kept as script.js had it.
    expect(globalGroupIndex(map, 'A1', 2)).toBe(6);
  });

  it('is 0 for missing input and never negative', () => {
    expect(globalGroupIndex(map, '', 2)).toBe(0);
    expect(globalGroupIndex(map, 'A1.1', null)).toBe(0);
    expect(globalGroupIndex(map, 'A1.1', 0)).toBe(0);
  });
});

describe('themeColorForVerb', () => {
  it('uses the colour of the global group index, wrapping around the palette', () => {
    expect(themeColorForVerb(map, { level: 'A1.2', group: 2 })).toBe(standardColors[3]);
    expect(themeColorForVerb(map, { level: 'A1.1', group: 9 })).toBe(standardColors[0]);
  });

  it('is steel blue without a level or group', () => {
    expect(themeColorForVerb(map, null)).toBe('#4682B4');
    expect(themeColorForVerb(map, { level: 'A1' })).toBe('#4682B4');
  });
});

describe('levelsFromGroups', () => {
  it('counts groups per level and layer, keeping and extending known file numbers', () => {
    const groups = [{ level: 'A1.1' }, { level: 'A1.1' }, { level: 'A1.2' }, { level: 'B1' }, null, {}];
    const previous: PhysicalLevelMap = { A1: [{ key: 'A1_1', count: 1, fileNumbers: [7] }] };
    expect(levelsFromGroups(groups, previous)).toEqual({
      physicalLevelMap: {
        A1: [
          { key: 'A1_1', count: 2, fileNumbers: [7, 8] },
          { key: 'A1_2', count: 1, fileNumbers: [1] },
        ],
        B1: [{ key: 'B1', count: 1, fileNumbers: [1] }],
      },
      levelConfig: { A1: { groupCount: 3, displayName: 'A1' }, B1: { groupCount: 1, displayName: 'B1' } },
    });
  });

  it('trims known file numbers when a layer shrinks', () => {
    const result = levelsFromGroups([{ level: 'A1.2' }], map);
    expect(result?.physicalLevelMap.A1).toEqual([{ key: 'A1_2', count: 1, fileNumbers: [2] }]);
  });

  it('returns null for an empty or invalid index, so the caller keeps its layout', () => {
    expect(levelsFromGroups([], map)).toBeNull();
    expect(levelsFromGroups(undefined, map)).toBeNull();
  });
});

describe('pageSizeForWidth', () => {
  it.each([
    [599, 1, 'phone'],
    [600, 2, 'phone'],
    [768, 3, 'tablet'],
    [1024, 3, 'tablet'],
    [1025, 4, 'desktop'],
  ] as const)('width %i shows %i cards (%s)', (width, pageSize, device) => {
    const result = pageSizeForWidth(width);
    expect(result.pageSize).toBe(pageSize);
    expect({ phone: result.isPhone, tablet: result.isTablet, desktop: result.isDesktop }[device]).toBe(true);
  });
});
