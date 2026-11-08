import type { Platform } from './level.ts';

export const RADIUS = 30;

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  minSpeed: number;
  side: number;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Which of the 12 regions around the platform the point is in (clock-face numbering of the original),
 * and the closest point on the platform to test against; side 0 when the point is inside the platform.
 * Based on Jeff Thompson's circle/rectangle test, extended by Juan Olaya: https://www.openprocessing.org/sketch/627378
 */
export function closestSide({ x, y }: Point, rect: Platform): { side: number; testX: number; testY: number } {
  const right = rect.x + rect.w;
  const bottom = rect.y + rect.h;
  let side = 0;
  let testX = x;
  let testY = y;
  if (x < rect.x) [testX, side] = [rect.x, 12];
  else if (x > right) [testX, side] = [right, 6];
  if (y < rect.y) [testY, side] = [rect.y, 3];
  else if (y > bottom) [testY, side] = [bottom, 9];

  if (x < rect.x && y < rect.y) {
    if (rect.y - y < rect.x - x) [side, testX] = [1, rect.x];
    else [side, testY] = [2, rect.y];
  }
  if (x > right && y < rect.y) {
    if (y - rect.y < right - x) [side, testY] = [4, rect.y];
    else [side, testX] = [5, right];
  }
  if (x > right && y > bottom) {
    if (y - bottom < x - right) [side, testX] = [7, right];
    else [side, testY] = [8, bottom];
  }
  if (x < rect.x && y > bottom) {
    if (y - bottom < rect.x - x) [side, testX] = [11, rect.x];
    else [side, testY] = [10, bottom];
  }
  return { side, testX, testY };
}

/** The original's response for each side: corners turn one speed into the other, faces reflect. */
function respond(body: Body, rect: Platform, side: number): void {
  const right = rect.x + rect.w;
  const bottom = rect.y + rect.h;
  switch (side) {
    case 1:
    case 2:
      body.vx = -body.vy;
      body.x = rect.x - RADIUS;
      return;
    case 3:
      body.minSpeed = 0;
      if (body.vy > 10) body.vy = 20;
      body.vy *= -1.05;
      body.y = rect.y - RADIUS;
      body.vx = 0;
      return;
    case 4:
    case 5:
      body.vx = body.vy;
      body.x = right + RADIUS;
      return;
    case 6:
      body.vx = -body.vx;
      body.x = right + RADIUS;
      return;
    case 7:
      body.vy = -body.vx;
      body.x = right + RADIUS;
      return;
    case 8:
      body.vx = -body.vy;
      body.y = bottom + RADIUS;
      return;
    case 9:
      body.vy = -body.vy;
      body.y = bottom + RADIUS;
      return;
    case 10:
      body.vx = body.vy;
      body.y = bottom + RADIUS;
      return;
    case 11:
      body.vy = body.vx;
      body.x = rect.x - RADIUS;
      return;
    case 12:
      body.vx = -body.vx;
      body.x = rect.x - RADIUS;
  }
}

/**
 * Resolves a ball/platform hit in place; returns the side hit, or 0 when they do not touch.
 * A fast ball can end a step with its centre inside the platform. The original then reused the
 * side found for the previously tested platform, which threw the ball out through the wrong face,
 * even past the end walls; instead it leaves through the face it came from (`from`, its position
 * before the step), or the top when that is unknown.
 */
export function collideCircleRect(body: Body, rect: Platform, from: Point = body): number {
  const hit = closestSide(body, rect);
  const side = hit.side || closestSide(from, rect).side || 3;
  body.side = side;
  if (Math.hypot(body.x - hit.testX, body.y - hit.testY) > RADIUS) return 0;
  respond(body, rect, side);
  return side;
}
