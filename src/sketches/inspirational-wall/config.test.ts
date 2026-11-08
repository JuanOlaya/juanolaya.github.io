import { describe, expect, it } from 'vitest';
import { PARTICLE_CANVAS, PIXEL_GRID, resolveConfig } from './config.ts';

describe('resolveConfig', () => {
  it('keeps the page default without a query', () => {
    expect(resolveConfig(PARTICLE_CANVAS, '')).toEqual(PARTICLE_CANVAS);
    expect(resolveConfig(PIXEL_GRID, '')).toEqual(PIXEL_GRID);
  });

  it('overrides only the start screen', () => {
    expect(resolveConfig(PARTICLE_CANVAS, '?screen=10')).toEqual({ ...PARTICLE_CANVAS, screen: 10 });
    expect(resolveConfig(PIXEL_GRID, '?screen=20')).toEqual({ ...PIXEL_GRID, screen: 20 });
  });

  it('ignores unknown or empty values', () => {
    for (const search of ['?screen=0', '?screen=30', '?screen=abc', '?screen=', '?other=10']) {
      expect(resolveConfig(PIXEL_GRID, search)).toEqual(PIXEL_GRID);
    }
  });
});
