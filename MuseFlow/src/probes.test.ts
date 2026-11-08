import { describe, expect, it } from 'vitest';
import { dueProbe, isRating, probeColumns, summarize } from './probes.ts';

describe('probeColumns', () => {
  it('spreads five probes over a full level', () => {
    expect(probeColumns(156)).toEqual([31, 62, 93, 124, 147]);
  });

  it('asks once halfway through a short level', () => {
    expect(probeColumns(32)).toEqual([16]);
  });

  it('never probes on the goal column or in tiny levels', () => {
    expect(probeColumns(2)).toEqual([]);
    expect(probeColumns(3)).toEqual([1]);
  });
});

describe('dueProbe', () => {
  it('returns the next unanswered probe once its column is reached', () => {
    expect(dueProbe([10, 20], 0, 9)).toBeUndefined();
    expect(dueProbe([10, 20], 0, 10)).toBe(10);
    expect(dueProbe([10, 20], 1, 15)).toBeUndefined();
    expect(dueProbe([10, 20], 2, 50)).toBeUndefined();
  });
});

describe('isRating', () => {
  it('accepts the five points of the scale only', () => {
    expect([1, 2, 3, 4, 5].every(isRating)).toBe(true);
    expect([0, 6, 2.5, Number.NaN].some(isRating)).toBe(false);
  });
});

describe('summarize', () => {
  it('counts 1-2 as on-task, 4-5 as off-task and averages the ratings', () => {
    expect(summarize([1, 2, 3, 4, 5, 5])).toEqual({ onTask: 2, offTask: 3, mean: 20 / 6 });
  });

  it('has no average before the first answer', () => {
    expect(summarize([])).toEqual({ onTask: 0, offTask: 0, mean: undefined });
  });
});
