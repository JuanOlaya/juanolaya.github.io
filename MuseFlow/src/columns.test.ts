import { describe, expect, it } from 'vitest';
import demanding from '../json/platforms-demanding.json';
import {
  COLUMN_GAP,
  MAX_COLUMN_HEIGHT,
  MIN_COLUMN_HEIGHT,
  columnIndexAt,
  layoutColumns,
  parseLevel,
  stepColumn,
} from './columns.ts';

describe('parseLevel', () => {
  it('reads the study level files', () => {
    expect(parseLevel(demanding)).toHaveLength(203);
  });

  it('drops malformed entries and tolerates bad input', () => {
    expect(parseLevel({ platforms: [{ width: 300, speed: 1 }, { width: 'x' }, null] })).toEqual([
      { width: 300, speed: 1 },
    ]);
    expect(parseLevel(null)).toEqual([]);
    expect(parseLevel({})).toEqual([]);
  });
});

describe('layoutColumns', () => {
  it('places columns side by side with a gap', () => {
    const columns = layoutColumns([
      { width: 300, speed: 1 },
      { width: 200, speed: 0 },
    ]);
    expect(columns.map((column) => column.x)).toEqual([0, 300 + COLUMN_GAP]);
  });
});

describe('stepColumn', () => {
  it('scales the step by the frame count', () => {
    const [column] = layoutColumns([{ width: 100, speed: 2 }]);
    const start = column.height;
    stepColumn(column, 0.5);
    expect(column.height).toBe(start + 1);
  });

  it('bounces between the lowest and highest heights', () => {
    const [column] = layoutColumns([{ width: 100, speed: 50 }]);
    stepColumn(column, 100);
    expect(column.height).toBe(MAX_COLUMN_HEIGHT);
    expect(column.speed).toBe(-50);
    stepColumn(column, 100);
    expect(column.height).toBe(MIN_COLUMN_HEIGHT);
    expect(column.speed).toBe(50);
  });
});

describe('columnIndexAt', () => {
  it('finds the column under x, counting gaps as the column before', () => {
    const columns = layoutColumns([
      { width: 100, speed: 0 },
      { width: 100, speed: 0 },
    ]);
    expect(columnIndexAt(columns, -1)).toBe(-1);
    expect(columnIndexAt(columns, 50)).toBe(0);
    expect(columnIndexAt(columns, 105)).toBe(0);
    expect(columnIndexAt(columns, 150)).toBe(1);
  });
});
