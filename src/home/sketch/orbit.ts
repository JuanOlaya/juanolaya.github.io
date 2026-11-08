import type { Vec2 } from './ball.ts';

/** A card's box in viewport pixels, which are also canvas pixels because the canvas is fixed at 0,0. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Point on the ellipse that wraps `rect` with `padding` pixels of room, at `angle` radians. */
export function orbitPoint(rect: Rect, angle: number, padding: number): Vec2 {
  const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  return {
    x: center.x + (rect.width / 2 + padding) * Math.cos(angle),
    y: center.y + (rect.height / 2 + padding) * Math.sin(angle),
  };
}

/** Moves `from` a fraction `ease` (0..1) of the way to `to`, so the ring glides instead of jumping. */
export function steer(from: Vec2, to: Vec2, ease: number): Vec2 {
  return { x: from.x + (to.x - from.x) * ease, y: from.y + (to.y - from.y) * ease };
}

/** Ring radius that fits the card: never larger than the normal ball, never hiding a small card. */
export function ringRadius(rect: Rect, ballRadius: number): number {
  return Math.min(ballRadius, Math.min(rect.width, rect.height) / 2);
}
