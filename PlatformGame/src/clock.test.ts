import { describe, expect, it } from 'vitest';
import { approach, fitAspect } from './clock.ts';

describe('approach', () => {
  it('moves toward the target and stops there', () => {
    expect(approach(0, 1, 0.1, 0.5)).toBeCloseTo(0.2);
    expect(approach(0.9, 1, 0.5, 0.5)).toBe(1);
    expect(approach(1, 0, 0.1, 0.5)).toBeCloseTo(0.8);
    expect(approach(0, 1, 0.01, 0)).toBe(1);
  });
});

describe('fitAspect', () => {
  it('letterboxes inside the box', () => {
    expect(fitAspect(1920, 1080, 1366 / 768)).toEqual({ width: 1920, height: 1079 });
    expect(fitAspect(390, 600, 1366 / 768)).toEqual({ width: 390, height: 219 });
    expect(fitAspect(2000, 400, 2)).toEqual({ width: 800, height: 400 });
  });
});
