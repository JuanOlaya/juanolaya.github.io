import { describe, expect, it } from 'vitest';
import { dueProbe, probeColumns, summarize } from './probes.ts';

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

describe('summarize', () => {
  it('counts on-task and off-task answers', () => {
    expect(summarize(['on-task', 'off-task', 'on-task'])).toEqual({ onTask: 2, offTask: 1 });
  });
});
