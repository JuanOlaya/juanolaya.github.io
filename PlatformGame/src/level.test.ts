import { describe, expect, it } from 'vitest';
import { VIEW_HEIGHT, generateLevel } from './level.ts';

describe('generateLevel', () => {
  it('lays 14 platforms on the floor with a 130-unit gap', () => {
    const level = generateLevel(() => 0);
    expect(level.platforms).toHaveLength(14);
    expect(level.platforms[0]).toEqual({ x: 0, y: VIEW_HEIGHT - 30, w: 100, h: 30 });
    expect(level.platforms[1]?.x).toBe(230);
    expect(level.width).toBe(14 * 100 + 13 * 130);
  });

  it('keeps sizes inside the original ranges', () => {
    const level = generateLevel(() => 0.999);
    for (const platform of level.platforms) {
      expect(platform.w).toBeGreaterThanOrEqual(100);
      expect(platform.w).toBeLessThan(500);
      expect(platform.h).toBeLessThan(270);
      expect(platform.y + platform.h).toBe(VIEW_HEIGHT);
    }
  });
});
