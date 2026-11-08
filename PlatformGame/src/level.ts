/** One block rising from the floor; the original drew them as plain rectangles. */
export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Level {
  platforms: Platform[];
  /** Playable width: from 0 to the right edge of the last platform. */
  width: number;
}

/** The original canvas size; the whole game is laid out in these units and scaled to fit. */
export const VIEW_WIDTH = 1366;
export const VIEW_HEIGHT = 768;

const PLATFORM_COUNT = 14;
const PLATFORM_GAP = 130;
const MIN_WIDTH = 100;
const MAX_WIDTH = 500;
const MIN_HEIGHT = 30;
const MAX_HEIGHT = 270;

/** `random()` returns [0, 1), like Math.random; injected so tests can make levels deterministic. */
function between(random: () => number, min: number, max: number): number {
  return min + random() * (max - min);
}

/** Fourteen random platforms in a row with a 130-unit gap, exactly as the original generated them. */
export function generateLevel(random: () => number = Math.random): Level {
  const platforms: Platform[] = [];
  let x = 0;
  for (let i = 0; i < PLATFORM_COUNT; i++) {
    const w = between(random, MIN_WIDTH, MAX_WIDTH);
    const h = between(random, MIN_HEIGHT, MAX_HEIGHT);
    platforms.push({ x, y: VIEW_HEIGHT - h, w, h });
    x += w + PLATFORM_GAP;
  }
  return { platforms, width: x - PLATFORM_GAP };
}
