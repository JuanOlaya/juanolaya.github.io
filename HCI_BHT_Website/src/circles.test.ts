import { describe, expect, it } from 'vitest';
import { isShrinkTrigger, shrink } from './circles.ts';

describe('isShrinkTrigger', () => {
  it('accepts presses within 50px of (80%, 43%)', () => {
    expect(isShrinkTrigger(800, 430, 1000, 1000)).toBe(true);
    expect(isShrinkTrigger(849, 430, 1000, 1000)).toBe(true);
    expect(isShrinkTrigger(850, 430, 1000, 1000)).toBe(false);
    expect(isShrinkTrigger(200, 250, 1000, 1000)).toBe(false);
  });
});

describe('shrink', () => {
  it('decreases by one per frame and stops at zero', () => {
    expect(shrink(80)).toBe(79);
    expect(shrink(0)).toBe(0);
  });
});
