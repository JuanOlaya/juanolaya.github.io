import { describe, expect, it } from 'vitest';
import {
  CIRCLES,
  circleCenter,
  circleDiameter,
  easeInOutCubic,
  isShrinkTrigger,
  nextProgress,
  stepProgress,
  triggerCenter,
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

describe('on a 0×0 canvas (before the first layout)', () => {
  it('still yields finite geometry and the minimum diameter', () => {
    expect(circleDiameter(0, 0)).toBe(40);
    expect(circleCenter(CIRCLES[0], 0, 0)).toEqual({ x: 0, y: 0 });
    expect(triggerCenter(0, 0)).toEqual({ x: 0, y: 0 });
  });
});

describe('after a resize', () => {
  it('keeps circles and trigger at the same percentage of the new size', () => {
    expect(circleCenter(CIRCLES[1], 1000, 800)).toEqual({ x: 500, y: 200 });
    expect(circleCenter(CIRCLES[1], 500, 400)).toEqual({ x: 250, y: 100 });
    expect(triggerCenter(1000, 800)).toEqual({ x: 800, y: 344 });
    expect(triggerCenter(320, 568)).toEqual({ x: 256, y: 244.24 });
  });

  it('scales the diameter with the short side, whichever orientation', () => {
    expect(circleDiameter(390, 844)).toBe(circleDiameter(844, 390));
    expect(circleDiameter(640, 360)).toBe(40);
  });
});

describe('extreme sizes', () => {
  it('clamps the diameter between 40 and 120 px', () => {
    expect(circleDiameter(1, 1)).toBe(40);
    expect(circleDiameter(1e7, 1e7)).toBe(120);
    expect(circleDiameter(-100, -100)).toBe(40);
  });
});

describe('nextProgress', () => {
  const state = { progress: 0, target: 1, paused: false, reduced: false };

  it('eases toward the target at normal frame rates', () => {
    const next = nextProgress(state, 1 / 60);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(0.02);
  });

  it('clamps a huge frame after a background tab to one small step', () => {
    expect(nextProgress(state, 10)).toBe(nextProgress(state, 0.05));
    expect(nextProgress(state, 10)).toBeLessThan(0.04);
  });

  it('stays put while paused', () => {
    expect(nextProgress({ ...state, progress: 0.3, paused: true }, 1 / 60)).toBe(0.3);
  });

  it('jumps straight to the target when the user prefers reduced motion', () => {
    expect(nextProgress({ ...state, reduced: true }, 1 / 60)).toBe(1);
    expect(nextProgress({ ...state, progress: 1, target: 0, reduced: true }, 1 / 60)).toBe(0);
    expect(nextProgress({ ...state, reduced: true, paused: true }, 1 / 60)).toBe(1);
  });
});
