import { WORLD_HEIGHT } from './columns.ts';
import type { Direction } from './player.ts';

/** Enough world width to see the next column ahead, even on a narrow phone. */
const MIN_VISIBLE_WIDTH = 450;
/** The ball sits a quarter of the way in from the left, as in the study, so what is ahead is visible. */
const BALL_SCREEN_FRACTION = 0.25;
/** Share of the gap the camera closes per 60 FPS frame. */
const CAMERA_EASE = 0.15;

/** Pixels per world unit: the full world height fits, and a narrow screen still shows enough columns. */
export function worldScale(width: number, height: number): number {
  return Math.min(height / WORLD_HEIGHT, width / MIN_VISIBLE_WIDTH);
}

/** World x shown at the left edge so the ball sits at a quarter of the visible width. */
export function cameraTarget(ballX: number, visibleWidth: number): number {
  return Math.max(0, ballX - visibleWidth * BALL_SCREEN_FRACTION);
}

/** Eases the camera towards its target, or snaps when motion should be reduced. */
export function stepCamera(current: number, target: number, frames: number, reduced: boolean): number {
  if (reduced) return target;
  const share = 1 - Math.pow(1 - CAMERA_EASE, frames);
  return current + (target - current) * share;
}

export interface HeldInput {
  left: boolean;
  right: boolean;
  /** Direction of a finger or mouse held on the canvas, 0 when none. */
  pointer: Direction;
}

/** Arrow keys win over a held pointer; holding both arrows cancels out. */
export function directionOf(input: HeldInput): Direction {
  if (input.left !== input.right) return input.left ? -1 : 1;
  if (input.left) return 0;
  return input.pointer;
}

/** Holding the left half of the canvas rolls left, the right half rolls right. */
export function pointerDirection(x: number, width: number): Direction {
  return x < width / 2 ? -1 : 1;
}
