import { describe, expect, it } from 'vitest';
import { frameScale } from './frame-scale.ts';

describe('frameScale', () => {
  it('is one frame at 60 FPS and scales with the frame time', () => {
    expect(frameScale(1000 / 60)).toBeCloseTo(1);
    expect(frameScale(1000 / 120)).toBeCloseTo(0.5);
    expect(frameScale(1000 / 30)).toBeCloseTo(2);
  });

  it('caps long pauses and ignores invalid times', () => {
    expect(frameScale(5000)).toBe(4);
    expect(frameScale(0)).toBe(0);
    expect(frameScale(-3)).toBe(0);
    expect(frameScale(Number.NaN)).toBe(0);
  });
});
