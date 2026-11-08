import { describe, expect, it } from 'vitest';
import { dropExpired, fadeBucket, recordRing, ringAlpha, type Trail } from './trail.ts';

describe('recordRing', () => {
  it('adds a ring only after the centre moved `spacing` px', () => {
    const trail: Trail = [];
    recordRing(trail, { x: 0, y: 0 }, 10, 0, 5);
    recordRing(trail, { x: 3, y: 0 }, 10, 0.1, 5);
    recordRing(trail, { x: 6, y: 0 }, 10, 0.2, 5);
    expect(trail.map((ring) => ring.x)).toEqual([0, 6]);
  });
});

describe('dropExpired', () => {
  it('removes the rings older than the lifetime and keeps the rest in order', () => {
    const trail: Trail = [0, 1, 2, 3].map((bornAt) => ({ x: bornAt, y: 0, radius: 1, bornAt }));
    dropExpired(trail, 4, 2.5);
    expect(trail.map((ring) => ring.bornAt)).toEqual([2, 3]);
  });

  it('empties a trail whose rings all expired', () => {
    const trail: Trail = [{ x: 0, y: 0, radius: 1, bornAt: 0 }];
    dropExpired(trail, 10, 1);
    expect(trail).toEqual([]);
  });
});

describe('ringAlpha', () => {
  it('starts at the peak, fades and never goes negative', () => {
    expect(ringAlpha(0, 4, 0.2)).toBeCloseTo(0.2);
    expect(ringAlpha(2, 4, 0.2)).toBeCloseTo(0.05);
    expect(ringAlpha(9, 4, 0.2)).toBe(0);
  });
});

describe('fadeBucket', () => {
  it('maps ages onto the bucket range', () => {
    expect(fadeBucket(0, 4, 8)).toBe(0);
    expect(fadeBucket(2, 4, 8)).toBe(4);
    expect(fadeBucket(4, 4, 8)).toBe(7);
    expect(fadeBucket(-1, 4, 8)).toBe(0);
  });
});
