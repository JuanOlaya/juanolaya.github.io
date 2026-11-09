import { describe, expect, it } from 'vitest';
import { generateWorld } from './level.ts';
import { Platform } from './platform.ts';
import { VIEW_HEIGHT } from './view.ts';

describe('generateWorld', () => {
  it('lays 14 platforms on the floor with a 130-unit gap', () => {
    const world = generateWorld(() => 0);
    expect(world.platforms).toHaveLength(14);
    expect(world.platforms[0]).toEqual(new Platform(0, VIEW_HEIGHT - 30, 100, 30));
    expect(world.platforms[1]?.x).toBe(230);
    expect(world.width).toBe(14 * 100 + 13 * 130);
  });

  it('keeps sizes inside the original ranges', () => {
    const world = generateWorld(() => 0.999);
    for (const platform of world.platforms) {
      expect(platform.w).toBeGreaterThanOrEqual(100);
      expect(platform.w).toBeLessThan(500);
      expect(platform.h).toBeLessThan(270);
      expect(platform.bottom).toBe(VIEW_HEIGHT);
    }
  });
});
