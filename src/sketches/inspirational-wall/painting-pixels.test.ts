import { describe, expect, it } from 'vitest';
import { PIXEL_GRID } from './config.ts';
import { clearPixels, pixelGridPanel } from './painting-pixels.ts';
import { Pixel } from './pixel.ts';
import { PAINT_COLORS, createWallState } from './state.ts';

const rng = { random: (min: number) => min + 3 };

describe('clearPixels', () => {
  it('turns painted pixels back into blank circles', () => {
    const pixel = new Pixel(10, 10, rng);
    pixel.colorIndex = 1;
    pixel.status = 7;
    clearPixels([pixel]);
    expect(pixel.colorIndex).toBe(PAINT_COLORS.length - 1);
    expect(pixel.status).toBe(1);
  });
});

describe('pixelGridPanel', () => {
  it('toggles the palette and asks for a new grid', () => {
    const state = createWallState(PIXEL_GRID);
    let rebuilt = 0;
    const controls = pixelGridPanel(state, () => rebuilt++).controls;
    const control = (key: string) => controls.find((c) => c.key === key)!;
    control('p').action();
    control('r').action();
    expect(control('p').pressed?.()).toBe(true);
    expect(rebuilt).toBe(1);
  });
});
