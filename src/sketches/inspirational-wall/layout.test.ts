import { describe, expect, it } from 'vitest';
import {
  distance,
  isInHomeCorner,
  nextPinchedStatus,
  pixelGridPositions,
  shapeBarX,
  toolbarButtonAt,
} from './layout.ts';

describe('pixelGridPositions', () => {
  it('matches the original loop for a 1920x1080 wall', () => {
    const positions = pixelGridPositions(1920, 1080);
    // x from 106.67 while < 1824, step 57 → 31 columns; y from 76.8 while < 972 → 16 rows
    expect(positions).toHaveLength(31 * 16);
    expect(positions[0]).toEqual({ x: 1920 / 18, y: 1920 / 25 });
    expect(positions[1].y).toBeCloseTo(1920 / 25 + 57);
    expect(positions[16].x).toBeCloseTo(1920 / 18 + 57);
  });

  it('keeps a single pixel on a tiny window and none on a zero-size one', () => {
    expect(pixelGridPositions(10, 10)).toEqual([{ x: 10 / 18, y: 10 / 25 }]);
    expect(pixelGridPositions(0, 0)).toEqual([]);
  });
});

describe('shapeBarX', () => {
  it('places slot n at width/25 + 62n', () => {
    expect(shapeBarX(0, 1000)).toBe(40);
    expect(shapeBarX(13, 1000)).toBe(40 + 13 * 62);
  });
});

describe('isInHomeCorner', () => {
  it('detects the bottom-right corner', () => {
    expect(isInHomeCorner(1900, 1000, 1920, 1080)).toBe(true);
    expect(isInHomeCorner(1700, 1000, 1920, 1080)).toBe(false);
    expect(isInHomeCorner(1900, 800, 1920, 1080)).toBe(false);
  });
});

describe('toolbarButtonAt', () => {
  it('maps each circle to its button', () => {
    expect(toolbarButtonAt(50, 1030, 1080)).toBe('trace');
    expect(toolbarButtonAt(120, 1030, 1080)).toBe('pause');
    expect(toolbarButtonAt(680, 1040, 1080)).toBe('print');
  });

  it('returns undefined between buttons or outside the radius', () => {
    expect(toolbarButtonAt(85, 1030, 1080)).toBeUndefined();
    expect(toolbarButtonAt(50, 1000, 1080)).toBeUndefined();
  });
});

describe('nextPinchedStatus', () => {
  it('cycles 1→2→3→4→1 and resets other shapes to 1', () => {
    expect([1, 2, 3, 4].map(nextPinchedStatus)).toEqual([2, 3, 4, 1]);
    expect(nextPinchedStatus(9)).toBe(1);
  });
});

describe('distance', () => {
  it('is euclidean', () => {
    expect(distance(0, 0, 3, 4)).toBe(5);
  });
});
