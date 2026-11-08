/**
 * Mutable 2D vector with the exact arithmetic of p5.Vector (same operation order), so the
 * flocking math stays pixel-identical to the original sketch while being testable without p5.
 */
export class Vec2 {
  constructor(
    public x = 0,
    public y = 0,
  ) {}

  static sub(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x, a.y).sub(b);
  }

  copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  add(v: Vec2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vec2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mult(n: number): this {
    this.x *= n;
    this.y *= n;
    return this;
  }

  /** p5 ignores a division by zero (it only warns), so this does too. */
  div(n: number): this {
    if (n === 0) return this;
    this.x /= n;
    this.y /= n;
    return this;
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  mag(): number {
    return Math.sqrt(this.magSq());
  }

  normalize(): this {
    const len = this.mag();
    if (len !== 0) this.mult(1 / len);
    return this;
  }

  limit(max: number): this {
    const magSq = this.magSq();
    if (magSq > max * max) this.div(Math.sqrt(magSq)).mult(max);
    return this;
  }

  setMag(n: number): this {
    return this.normalize().mult(n);
  }

  dist(v: Vec2): number {
    return v.copy().sub(this).mag();
  }

  heading(): number {
    return Math.atan2(this.y, this.x);
  }
}
