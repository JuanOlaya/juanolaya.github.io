import { describe, expect, it } from 'vitest';
import { pixelDensityFor } from './display.ts';

describe('pixelDensityFor', () => {
  it('follows the screen up to 2×', () => {
    expect(pixelDensityFor(1)).toBe(1);
    expect(pixelDensityFor(1.5)).toBe(1.5);
    expect(pixelDensityFor(3)).toBe(2);
  });

  it('falls back to 1× for odd values', () => {
    expect(pixelDensityFor(0)).toBe(1);
    expect(pixelDensityFor(Number.NaN)).toBe(1);
  });
});
