import { Vector } from './vector.ts';

/** Entity: one solid block rising from the floor. Platforms never move, so their geometry is read-only. */
export class Platform {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly w: number,
    readonly h: number,
  ) {}

  get right(): number {
    return this.x + this.w;
  }

  get bottom(): number {
    return this.y + this.h;
  }

  /** The point of the block nearest to `point`; the point itself when it lies inside. */
  closestPoint(point: Vector): Vector {
    const x = Math.min(Math.max(point.x, this.x), this.right);
    const y = Math.min(Math.max(point.y, this.y), this.bottom);
    return new Vector(x, y);
  }
}
