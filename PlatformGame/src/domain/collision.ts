import type { Platform } from './platform.ts';
import { RADIUS, type Player } from './player.ts';
import { Vector } from './vector.ts';

/** Domain service: what a batch of platform tests did to the ball, for feedback and the panels. */
export interface CollisionResult {
  /** Downward speed when bouncing off a platform top, 0 if there was none. */
  landingSpeed: number;
  /** A face or corner other than a top was hit. */
  wallHit: boolean;
  /** Side of the last platform hit, 1..12 clock-face; 0 when nothing was touched. */
  side: number;
  /** Unit normal of the last surface hit, pointing away from it; null when nothing was touched. */
  normal: Vector | null;
}

const NO_COLLISION: CollisionResult = { landingSpeed: 0, wallHit: false, side: 0, normal: null };
const DIAGONAL = Math.SQRT1_2;

/** -1 before `min`, 1 past `max`, 0 in between. */
function axisSide(value: number, min: number, max: number): number {
  if (value < min) return -1;
  return value > max ? 1 : 0;
}

/** Side for a point beside exactly one face, keyed by `${dx},${dy}`. */
const FACE_SIDES: Record<string, number> = { '0,0': 0, '-1,0': 12, '1,0': 6, '0,-1': 3, '0,1': 9 };

/** Corner rule of the original: the smaller overshoot picks the face; listed as [vertical smaller, otherwise]. */
const CORNER_SIDES: Record<string, readonly [number, number]> = {
  '-1,-1': [1, 2],
  '1,1': [7, 8],
  '-1,1': [11, 10],
};

function cornerSide(vertical: number, horizontal: number, dx: number, dy: number): number {
  // Top-right is the odd one out: the original compared the raw (negative) differences there, so the test flips.
  if (dx > 0 && dy < 0) return vertical > horizontal ? 4 : 5;
  const [nearVertical, nearHorizontal] = CORNER_SIDES[`${dx},${dy}`] as readonly [number, number];
  return vertical < horizontal ? nearVertical : nearHorizontal;
}

/**
 * Clock-face region of `point` around the platform: 12 left, 3 top, 6 right, 9 bottom, and the
 * corners split between the two faces by whichever is nearer; 0 when the point is inside.
 * Based on Jeff Thompson's circle/rectangle test, extended by Juan Olaya: https://www.openprocessing.org/sketch/627378
 */
export function sideOf(point: Vector, platform: Platform): number {
  const dx = axisSide(point.x, platform.x, platform.right);
  const dy = axisSide(point.y, platform.y, platform.bottom);
  if (dx === 0 || dy === 0) return FACE_SIDES[`${dx},${dy}`] as number;
  const vertical = dy < 0 ? platform.y - point.y : point.y - platform.bottom;
  const horizontal = dx < 0 ? platform.x - point.x : point.x - platform.right;
  return cornerSide(vertical, horizontal, dx, dy);
}

const NORMALS: Record<number, Vector> = {
  1: new Vector(-DIAGONAL, -DIAGONAL),
  2: new Vector(-DIAGONAL, -DIAGONAL),
  3: new Vector(0, -1),
  4: new Vector(DIAGONAL, -DIAGONAL),
  5: new Vector(DIAGONAL, -DIAGONAL),
  6: new Vector(1, 0),
  7: new Vector(DIAGONAL, DIAGONAL),
  8: new Vector(DIAGONAL, DIAGONAL),
  9: new Vector(0, 1),
  10: new Vector(-DIAGONAL, DIAGONAL),
  11: new Vector(-DIAGONAL, DIAGONAL),
  12: new Vector(-1, 0),
};

/** Outward unit normal of each side; corners point diagonally. */
export function normalOf(side: number): Vector | null {
  return NORMALS[side] ?? null;
}

/** The original's response per side: corners turn one speed into the other, faces reflect one. */
const DEFLECTIONS: Record<number, (v: Vector) => Vector> = {
  1: (v) => new Vector(-v.y, v.y),
  2: (v) => new Vector(-v.y, v.y),
  4: (v) => new Vector(v.y, v.y),
  5: (v) => new Vector(v.y, v.y),
  6: (v) => new Vector(-v.x, v.y),
  7: (v) => new Vector(v.x, -v.x),
  8: (v) => new Vector(-v.y, v.y),
  9: (v) => new Vector(v.x, -v.y),
  10: (v) => new Vector(v.y, v.y),
  11: (v) => new Vector(v.x, v.x),
  12: (v) => new Vector(-v.x, v.y),
};

function pushOut(position: Vector, platform: Platform, side: number): Vector {
  if (side <= 2 || side >= 11) return position.withX(platform.x - RADIUS);
  if (side <= 7) return position.withX(platform.right + RADIUS);
  return position.withY(platform.bottom + RADIUS);
}

/** Landing: bounce 5% faster, hard falls capped at 20, sideways speed lost; this is the game's "jump". */
function land(player: Player, platform: Platform): void {
  const vy = player.velocity.y > 10 ? 20 : player.velocity.y;
  player.minSpeed = 0;
  player.velocity = new Vector(0, vy * -1.05);
  player.position = player.position.withY(platform.y - RADIUS);
}

/**
 * Resolves one ball/platform contact in place and returns the side hit, or 0 when they do not touch.
 * A fast ball can end a step with its centre inside the platform; it then leaves through the face
 * it came from (`from`, its position before the step), or the top when even that is unknown.
 */
export function collide(player: Player, platform: Platform, from: Vector = player.position): number {
  const side = sideOf(player.position, platform) || sideOf(from, platform) || 3;
  player.side = side;
  if (player.position.distanceTo(platform.closestPoint(player.position)) > RADIUS) return 0;
  if (side === 3) {
    land(player, platform);
    return side;
  }
  player.velocity = (DEFLECTIONS[side] as (v: Vector) => Vector)(player.velocity);
  player.position = pushOut(player.position, platform, side);
  return side;
}

/** Tests the ball against every platform in order, as the original did, and sums up what happened. */
export function resolveCollisions(
  player: Player,
  platforms: readonly Platform[],
  from: Vector = player.position,
): CollisionResult {
  const result = { ...NO_COLLISION };
  for (const platform of platforms) {
    const before = player.velocity.y;
    const side = collide(player, platform, from);
    if (side === 0) continue;
    if (side === 3) result.landingSpeed = Math.max(result.landingSpeed, before);
    else result.wallHit = true;
    result.side = side;
    result.normal = normalOf(side);
  }
  return result;
}
