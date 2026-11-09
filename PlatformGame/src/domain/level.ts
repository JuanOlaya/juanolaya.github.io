import { Platform } from './platform.ts';
import { VIEW_HEIGHT } from './view.ts';
import { World } from './world.ts';

const PLATFORM_COUNT = 14;
const PLATFORM_GAP = 130;
const MIN_WIDTH = 100;
const MAX_WIDTH = 500;
const MIN_HEIGHT = 30;
const MAX_HEIGHT = 270;

/** `random()` returns [0, 1), like Math.random; injected so tests can make worlds deterministic. */
function between(random: () => number, min: number, max: number): number {
  return min + random() * (max - min);
}

/** Fourteen random platforms in a row with a 130-unit gap, exactly as the original generated them. */
export function generateWorld(random: () => number = Math.random): World {
  const platforms: Platform[] = [];
  let x = 0;
  for (let i = 0; i < PLATFORM_COUNT; i++) {
    const w = between(random, MIN_WIDTH, MAX_WIDTH);
    const h = between(random, MIN_HEIGHT, MAX_HEIGHT);
    platforms.push(new Platform(x, VIEW_HEIGHT - h, w, h));
    x += w + PLATFORM_GAP;
  }
  return new World(platforms, x - PLATFORM_GAP);
}
