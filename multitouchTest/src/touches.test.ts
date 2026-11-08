import { describe, expect, it } from 'vitest';
import {
  type TouchMap,
  coordinateLines,
  fadePoints,
  heldPoints,
  movePoint,
  pressPoint,
  releasePoint,
} from './touches.ts';

function twoFingers(): TouchMap {
  const points: TouchMap = new Map();
  pressPoint(points, 1, 10.7, 20.2, 'touch');
  pressPoint(points, 2, 300, 400, 'touch');
  return points;
}

describe('touch points', () => {
  it('tracks several pointers at once and lists their coordinates', () => {
    const points = twoFingers();
    movePoint(points, 2, 310.9, 405.5);
    expect(coordinateLines(points)).toEqual(['1. touch  X: 10  Y: 20', '2. touch  X: 310  Y: 405']);
  });

  it('ignores moves of pointers that are not pressed', () => {
    const points = twoFingers();
    movePoint(points, 9, 1, 1);
    releasePoint(points, 1, false);
    movePoint(points, 1, 99, 99);
    expect(points.get(1)?.x).toBe(10.7);
    expect(points.has(9)).toBe(false);
  });

  it('fades a released point out at the same speed at any frame rate', () => {
    const points = twoFingers();
    releasePoint(points, 1, false);
    expect(heldPoints(points).map((point) => point.id)).toEqual([2]);
    fadePoints(points, 15);
    expect(points.get(1)?.alpha).toBeCloseTo(0.5);
    fadePoints(points, 15);
    expect(points.has(1)).toBe(false);
    expect(points.get(2)?.alpha).toBe(1);
  });

  it('drops a released point at once with reduced motion', () => {
    const points = twoFingers();
    releasePoint(points, 1, true);
    expect(points.has(1)).toBe(false);
  });
});
