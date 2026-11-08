import type { Vec2 } from './motion.ts';

export interface TrailRing {
  x: number;
  y: number;
  radius: number;
  /** Simulation time (s) when the ring was left behind. */
  bornAt: number;
}

/** Rings left behind by one mover, oldest first. */
export type Trail = TrailRing[];

/** Drops a ring once the centre has moved `spacing` px since the last one, so density ignores FPS. */
export function recordRing(trail: Trail, center: Vec2, radius: number, now: number, spacing: number): void {
  const last = trail.at(-1);
  if (last && Math.hypot(center.x - last.x, center.y - last.y) < spacing) return;
  trail.push({ x: center.x, y: center.y, radius, bornAt: now });
}

export function dropExpired(trail: Trail, now: number, lifetime: number): void {
  const firstAlive = trail.findIndex((ring) => now - ring.bornAt < lifetime);
  trail.splice(0, firstAlive === -1 ? trail.length : firstAlive);
}

/** Opacity of a ring `age` seconds old: `peak` when new, easing out to 0 at `lifetime`. */
export function ringAlpha(age: number, lifetime: number, peak: number): number {
  const remaining = 1 - Math.min(Math.max(age / lifetime, 0), 1);
  return peak * remaining * remaining;
}

/** Which of `buckets` opacity steps a ring falls in, so rings can be stroked in a few batched paths. */
export function fadeBucket(age: number, lifetime: number, buckets: number): number {
  const index = Math.floor((age / lifetime) * buckets);
  return Math.min(Math.max(index, 0), buckets - 1);
}
