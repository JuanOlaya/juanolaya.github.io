import { describe, expect, it } from 'vitest';
import { isPressed, layoutFor, shiftTimings, startPositions } from './scene.ts';

const lowest = (min: number) => min;

describe('layoutFor', () => {
  it('uses the full window and slow timings on landscape screens', () => {
    const layout = layoutFor(1440, 900);
    expect(layout.mobile).toBe(false);
    expect(layout.canvas).toEqual({ width: 1440, height: 900 });
    expect(layout.timings).toEqual({
      pressHorizontal: 3000,
      releaseHorizontal: 3250,
      pressDiagonal: 4500,
      releaseDiagonal: 5000,
    });
    expect(layout.diagonalStopAfter).toBe(4);
  });

  it('uses a viewport-sized canvas and fast timings on portrait screens', () => {
    const layout = layoutFor(390, 844);
    expect(layout.mobile).toBe(true);
    expect(layout.canvas).toEqual({ width: 390, height: 844 });
    expect(layout.timings).toEqual({
      pressHorizontal: 750,
      releaseHorizontal: 1000,
      pressDiagonal: 500,
      releaseDiagonal: 1000,
    });
    expect(layout.diagonalStopAfter).toBe(3);
  });

  it('treats a square window as landscape', () => {
    expect(layoutFor(800, 800).mobile).toBe(false);
  });
});

describe('isPressed', () => {
  it('is filled only after press and up to release', () => {
    expect(isPressed(100, 200, 300)).toBe(false);
    expect(isPressed(200, 200, 300)).toBe(false);
    expect(isPressed(250, 200, 300)).toBe(true);
    expect(isPressed(300, 200, 300)).toBe(true);
    expect(isPressed(301, 200, 300)).toBe(false);
  });
});

describe('shiftTimings', () => {
  it('moves every timing by the elapsed time', () => {
    expect(shiftTimings(layoutFor(390, 844).timings, 10_000)).toEqual({
      pressHorizontal: 10_750,
      releaseHorizontal: 11_000,
      pressDiagonal: 10_500,
      releaseDiagonal: 11_000,
    });
  });
});

describe('startPositions', () => {
  it('desktop start: orange in the upper-left third, blue in the lower-right third', () => {
    const layout = layoutFor(1200, 900);
    expect(startPositions(layout, 'initial', lowest)).toEqual({
      diagonal: { x: 100, y: 86 },
      horizontal: { x: 800, y: 600 },
    });
  });

  it('desktop refresh lets the blue ball start anywhere vertically', () => {
    const layout = layoutFor(1200, 900);
    expect(startPositions(layout, 'refresh', lowest).horizontal).toEqual({ x: 800, y: 100 });
  });

  it('mobile places the blue ball near the top-right corner', () => {
    const layout = layoutFor(390, 844);
    expect(startPositions(layout, 'initial', lowest)).toEqual({
      diagonal: { x: 100, y: 86 },
      horizontal: { x: 300, y: 100 },
    });
  });

  it('passes the original ranges to the random source', () => {
    const calls: Array<[number, number]> = [];
    const record = (min: number, max: number) => {
      calls.push([min, max]);
      return min;
    };
    startPositions(layoutFor(1200, 900), 'initial', record);
    expect(calls).toEqual([
      [100, 600],
      [86, 300],
      [800, 1105],
      [600, 800],
    ]);
  });
});
