import { describe, expect, it } from 'vitest';
import { LEVELS, formatDuration, levelIndexFromSearch } from './levels.ts';

describe('LEVELS', () => {
  it('loads every study level', () => {
    expect(LEVELS.map((level) => level.platforms.length)).toEqual([32, 156, 203]);
  });
});

describe('levelIndexFromSearch', () => {
  it('picks the level named in the query and falls back to training', () => {
    expect(levelIndexFromSearch('?level=demanding')).toBe(2);
    expect(levelIndexFromSearch('?level=nope')).toBe(0);
    expect(levelIndexFromSearch('')).toBe(0);
  });
});

describe('formatDuration', () => {
  it('formats minutes and seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65_400)).toBe('1:05');
    expect(formatDuration(-5)).toBe('0:00');
  });
});
