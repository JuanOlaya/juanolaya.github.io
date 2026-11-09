import { describe, expect, it } from 'vitest';
import { Vector } from './vector.ts';

describe('Vector', () => {
  it('adds, scales and replaces one component without touching the original', () => {
    const v = new Vector(1, 2);
    expect(v.add(new Vector(3, -5))).toEqual(new Vector(4, -3));
    expect(v.scale(2)).toEqual(new Vector(2, 4));
    expect(v.withX(9)).toEqual(new Vector(9, 2));
    expect(v.withY(9)).toEqual(new Vector(1, 9));
    expect(v).toEqual(new Vector(1, 2));
  });

  it('is frozen: writing a component throws instead of moving the ball', () => {
    const v = new Vector(1, 2);
    expect(() => {
      (v as { x: number }).x = 5;
    }).toThrow(TypeError);
    expect(Object.isFrozen(Vector.ZERO)).toBe(true);
    expect(v.x).toBe(1);
  });

  it('measures distance, length and equality by value', () => {
    expect(new Vector(0, 0).distanceTo(new Vector(3, 4))).toBe(5);
    expect(new Vector(3, 4).length()).toBe(5);
    expect(new Vector(1, 2).equals(new Vector(1, 2))).toBe(true);
    expect(new Vector(1, 2).equals(new Vector(2, 1))).toBe(false);
    expect(Vector.ZERO.scale(0)).toEqual(Vector.ZERO);
  });
});
