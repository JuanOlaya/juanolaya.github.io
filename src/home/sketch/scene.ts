import type { Vec2 } from './ball.ts';

/** Moments (ms) when each ball switches from outline to filled and back. */
export interface Timings {
  pressHorizontal: number;
  releaseHorizontal: number;
  pressDiagonal: number;
  releaseDiagonal: number;
}

export interface Layout {
  mobile: boolean;
  canvas: { width: number; height: number };
  timings: Timings;
  /** The orange ball stops being drawn after this many wall hits. */
  diagonalStopAfter: number;
}

export interface StartPositions {
  diagonal: Vec2;
  horizontal: Vec2;
}

export type RandomRange = (min: number, max: number) => number;

/** The canvas always matches the viewport; portrait screens only change the motion and timings. */
export function layoutFor(windowWidth: number, windowHeight: number): Layout {
  const canvas = { width: windowWidth, height: windowHeight };
  if (windowWidth < windowHeight) {
    return {
      mobile: true,
      canvas,
      timings: { pressHorizontal: 750, releaseHorizontal: 1000, pressDiagonal: 500, releaseDiagonal: 1000 },
      diagonalStopAfter: 3,
    };
  }
  return {
    mobile: false,
    canvas,
    timings: { pressHorizontal: 3000, releaseHorizontal: 3250, pressDiagonal: 4500, releaseDiagonal: 5000 },
    diagonalStopAfter: 4,
  };
}

export function isPressed(now: number, pressAt: number, releaseAt: number): boolean {
  return now > pressAt && now <= releaseAt;
}

export function shiftTimings(timings: Timings, offset: number): Timings {
  return {
    pressHorizontal: timings.pressHorizontal + offset,
    releaseHorizontal: timings.releaseHorizontal + offset,
    pressDiagonal: timings.pressDiagonal + offset,
    releaseDiagonal: timings.releaseDiagonal + offset,
  };
}

/** On desktop a refresh lets the blue ball start at any height; the first start keeps it in the lower third. */
export function startPositions(
  layout: Layout,
  phase: 'initial' | 'refresh',
  random: RandomRange,
): StartPositions {
  const { width, height } = layout.canvas;
  const diagonal = {
    x: random(100, width / 2),
    y: random(86, layout.mobile ? height / 2 : height / 3),
  };
  if (layout.mobile) return { diagonal, horizontal: { x: width - 90, y: 100 } };
  const x = random((2 * width) / 3, width - 95);
  const y = phase === 'initial' ? random((2 * height) / 3, height - 100) : random(100, height - 100);
  return { diagonal, horizontal: { x, y } };
}
