import { describe, expect, it } from 'vitest';
import {
  CIRCLES,
  circleCenter,
  circleDiameter,
  easeInOutCubic,
  isShrinkTrigger,
  stepProgress,
} from './circles.ts';

describe('isShrinkTrigger', () => {
  it('accepts presses within 50px of (80%, 43%)', () => {
    expect(isShrinkTrigger(800, 430, 1000, 1000)).toBe(true);
    expect(isShrinkTrigger(849, 430, 1000, 1000)).toBe(true);
    expect(isShrinkTrigger(850, 430, 1000, 1000)).toBe(false);
    expect(isShrinkTrigger(200, 250, 1000, 1000)).toBe(false);
  });
});

describe('circleDiameter', () => {
  it('keeps the original 80 px on a 1080 px tall screen and scales within bounds', () => {
    expect(circleDiameter(1920, 1080)).toBeCloseTo(80);
    expect(circleDiameter(390, 844)).toBe(40);
    expect(circleDiameter(5000, 4000)).toBe(120);
  });
});

describe('stepProgress', () => {
  it('advances toward the target and stops there, in both directions', () => {
    expect(stepProgress(0, 1, 0.5, 2)).toBe(0.25);
    expect(stepProgress(0.9, 1, 0.5, 2)).toBe(1);
    expect(stepProgress(0.1, 0, 0.5, 2)).toBe(0);
  });

  it('covers the same ground at 30 and 120 FPS', () => {
    let slow = 0;
    let fast = 0;
    for (let i = 0; i < 15; i++) slow = stepProgress(slow, 1, 1 / 30, 1);
    for (let i = 0; i < 60; i++) fast = stepProgress(fast, 1, 1 / 120, 1);
    expect(fast).toBeCloseTo(slow);
  });
});

describe('easeInOutCubic', () => {
  it('starts at 0, ends at 1 and passes the middle at 0.5', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.1)).toBeLessThan(0.1);
  });
});

describe('circleCenter', () => {
  it('maps the percentages onto the canvas', () => {
    expect(circleCenter(CIRCLES[0], 1000, 800)).toEqual({ x: 200, y: 200 });
  });
});
