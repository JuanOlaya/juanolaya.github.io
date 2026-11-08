import { describe, expect, it } from 'vitest';
import { cameraTarget, directionOf, pointerDirection, stepCamera, worldScale } from './view.ts';

describe('worldScale', () => {
  it('fits the world height on wide screens and enough width on phones', () => {
    expect(worldScale(1920, 768)).toBe(1);
    expect(worldScale(390, 844)).toBeCloseTo(390 / 450);
  });
});

describe('cameraTarget', () => {
  it('keeps the ball a quarter in and never scrolls before the start', () => {
    expect(cameraTarget(1000, 800)).toBe(800);
    expect(cameraTarget(100, 800)).toBe(0);
  });
});

describe('stepCamera', () => {
  it('snaps with reduced motion and eases otherwise', () => {
    expect(stepCamera(0, 100, 1, true)).toBe(100);
    const eased = stepCamera(0, 100, 1, false);
    expect(eased).toBeGreaterThan(0);
    expect(eased).toBeLessThan(100);
  });

  it('eases the same amount at any frame rate', () => {
    const twoHalves = stepCamera(stepCamera(0, 100, 0.5, false), 100, 0.5, false);
    expect(twoHalves).toBeCloseTo(stepCamera(0, 100, 1, false));
  });
});

describe('directionOf', () => {
  it('prefers keys, cancels opposing keys and falls back to the pointer', () => {
    expect(directionOf({ left: true, right: false, pointer: 1 })).toBe(-1);
    expect(directionOf({ left: false, right: true, pointer: 0 })).toBe(1);
    expect(directionOf({ left: true, right: true, pointer: 1 })).toBe(0);
    expect(directionOf({ left: false, right: false, pointer: -1 })).toBe(-1);
  });
});

describe('pointerDirection', () => {
  it('splits the canvas in halves', () => {
    expect(pointerDirection(10, 400)).toBe(-1);
    expect(pointerDirection(300, 400)).toBe(1);
  });
});
