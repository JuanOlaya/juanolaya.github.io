import { describe, expect, it } from 'vitest';
import { Pixel, type PixelRandom } from './pixel.ts';

function sequence(...values: number[]): PixelRandom & { calls: number } {
  const rng = {
    calls: 0,
    random: (min: number, max: number) => min + (max - min) * (values[rng.calls++] ?? 0),
  };
  return rng;
}

const brush = { shape: 7, color: 2 };

describe('Pixel colour', () => {
  it('uses the background colour when the first draw rounds to 0 or 1, and draws five numbers in total', () => {
    const rng = sequence(0.1, 0.5, 0.5, 0.5);
    expect(new Pixel(0, 0, rng).colorIndex).toBe(5);
    expect(rng.calls).toBe(4);
  });

  it('draws a palette colour otherwise', () => {
    const rng = sequence(0.9, 0.75, 0.5, 0.5, 0.5);
    expect(new Pixel(0, 0, rng).colorIndex).toBe(3);
    expect(rng.calls).toBe(5);
  });
});

describe('Pixel.press', () => {
  it('paints once per press with the selected brush', () => {
    const pixel = new Pixel(100, 100, sequence());
    pixel.press({ x: 120, y: 100 }, 0, false, brush);
    expect([pixel.status, pixel.colorIndex]).toEqual([7, 2]);
    pixel.press({ x: 120, y: 100 }, 1, false, { shape: 1, color: 0 });
    expect(pixel.status).toBe(7);
  });

  it('ignores multi-touch, the eraser and far pointers', () => {
    const pixel = new Pixel(100, 100, sequence());
    pixel.press({ x: 100, y: 100 }, 2, false, brush);
    pixel.press({ x: 100, y: 100 }, 0, true, brush);
    pixel.press({ x: 133, y: 100 }, 0, false, brush);
    expect(pixel.status).toBe(1);
  });
});

describe('Pixel.pinch', () => {
  it('cycles the shape when both touches are inside, once per pinch', () => {
    const pixel = new Pixel(100, 100, sequence());
    const inside = [
      { x: 95, y: 100 },
      { x: 105, y: 100 },
    ];
    pixel.pinch(inside, false);
    pixel.pinch(inside, false);
    expect(pixel.status).toBe(2);
    pixel.pinch([inside[0], { x: 200, y: 100 }], false);
    pixel.pinch(inside, false);
    expect(pixel.status).toBe(3);
  });

  it('needs exactly two touches', () => {
    const pixel = new Pixel(100, 100, sequence());
    pixel.pinch([{ x: 100, y: 100 }], false);
    expect(pixel.status).toBe(1);
  });
});

describe('Pixel.erase', () => {
  it('resets pixels left of the eraser only while dragging it', () => {
    const pixel = new Pixel(100, 100, sequence(0.9, 0.9));
    pixel.status = 9;
    pixel.erase(150, false);
    expect(pixel.status).toBe(9);
    pixel.erase(90, true);
    expect(pixel.status).toBe(9);
    pixel.erase(150, true);
    expect([pixel.status, pixel.colorIndex]).toEqual([1, 0]);
  });
});
