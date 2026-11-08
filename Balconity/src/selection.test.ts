import { describe, expect, it } from 'vitest';
import { stepIndex } from './selection.ts';

describe('stepIndex', () => {
  it('moves forward and backward inside the range', () => {
    expect(stepIndex(3, 1, 9)).toBe(4);
    expect(stepIndex(3, -1, 9)).toBe(2);
  });

  it('wraps from the last item to the first and back', () => {
    expect(stepIndex(8, 1, 9)).toBe(0);
    expect(stepIndex(0, -1, 9)).toBe(8);
  });

  it('rejects an empty range', () => {
    expect(() => stepIndex(0, 1, 0)).toThrow(RangeError);
  });
});
