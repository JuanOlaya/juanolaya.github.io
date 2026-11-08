import { describe, expect, it } from 'vitest';
import { CIRCLES, circleCenter, isShrinkTrigger, shrink } from './circles.ts';

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

  it('shrinks by the same amount per second at any frame rate', () => {
    let at30 = 80;
    let at120 = 80;
    for (let i = 0; i < 30; i++) at30 = shrink(at30, 2);
    for (let i = 0; i < 120; i++) at120 = shrink(at120, 0.5);
    expect(at30).toBeCloseTo(20);
    expect(at120).toBeCloseTo(20);
  });

  it('never goes below zero on a long frame', () => {
    expect(shrink(0.5, 4)).toBe(0);
  });
});

describe('circleCenter', () => {
  it('maps the percentages onto the canvas', () => {
    expect(circleCenter(CIRCLES[0], 1000, 800)).toEqual({ x: 200, y: 200 });
  });
});
