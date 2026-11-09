/**
 * Value object: an immutable 2D vector. Every operation returns a new instance, so a position or
 * velocity can be handed to renderers and panels without anyone being able to move the ball by accident.
 */
export class Vector {
  static readonly ZERO = new Vector(0, 0);

  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    Object.freeze(this);
  }

  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  scale(k: number): Vector {
    return new Vector(this.x * k, this.y * k);
  }

  withX(x: number): Vector {
    return new Vector(x, this.y);
  }

  withY(y: number): Vector {
    return new Vector(this.x, y);
  }

  distanceTo(v: Vector): number {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }

  length(): number {
    return Math.hypot(this.x, this.y);
  }

  equals(v: Vector): boolean {
    return this.x === v.x && this.y === v.y;
  }
}
