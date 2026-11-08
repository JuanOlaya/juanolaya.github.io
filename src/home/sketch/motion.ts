export interface Vec2 {
  x: number;
  y: number;
}

export interface Bounds {
  width: number;
  height: number;
}

/** Anything that drifts across the background: a ring centre with a velocity in px/s. */
export interface Mover {
  position: Vec2;
  velocity: Vec2;
  /** Base direction (radians); noise only wobbles around it, and wall hits mirror it. */
  heading: number;
  radius: number;
  /** Cruise speed in px/s. */
  speed: number;
}

/**
 * Share of the remaining gap closed after `dt` seconds when easing at `rate` per second.
 * Exponential, so one 32 ms step lands where two 16 ms steps would: motion does not depend on FPS.
 */
export function easeFactor(rate: number, dt: number): number {
  return 1 - Math.exp(-rate * dt);
}

export function headingVelocity(angle: number, speed: number): Vec2 {
  return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
}

/** Spring-like pull toward `to`, as a velocity: stronger the further apart, capped at `max` px/s. */
export function pullToward(from: Vec2, to: Vec2, strength: number, max: number): Vec2 {
  const x = (to.x - from.x) * strength;
  const y = (to.y - from.y) * strength;
  const length = Math.hypot(x, y);
  if (length <= max) return { x, y };
  return { x: (x / length) * max, y: (y / length) * max };
}

// The ring stays fully on screen; the heading is mirrored too, or the noise would steer it back into the wall.
function bounce(mover: Mover, bounds: Bounds): void {
  const { position, velocity, radius } = mover;
  const right = Math.max(radius, bounds.width - radius);
  const bottom = Math.max(radius, bounds.height - radius);
  if ((position.x < radius && velocity.x < 0) || (position.x > right && velocity.x > 0)) {
    velocity.x = -velocity.x;
    mover.heading = Math.PI - mover.heading;
  }
  if ((position.y < radius && velocity.y < 0) || (position.y > bottom && velocity.y > 0)) {
    velocity.y = -velocity.y;
    mover.heading = -mover.heading;
  }
  position.x = Math.min(Math.max(position.x, radius), right);
  position.y = Math.min(Math.max(position.y, radius), bottom);
}

/** Eases the velocity toward `target` (px/s), moves `dt` seconds and bounces off the edges of `bounds`. */
export function stepMover(mover: Mover, target: Vec2, dt: number, steerRate: number, bounds: Bounds): void {
  const k = easeFactor(steerRate, dt);
  mover.velocity.x += (target.x - mover.velocity.x) * k;
  mover.velocity.y += (target.y - mover.velocity.y) * k;
  mover.position.x += mover.velocity.x * dt;
  mover.position.y += mover.velocity.y * dt;
  bounce(mover, bounds);
}

/** 0..1 bump that peaks once every `period` seconds and lasts `duration`: the old "pressed ball" fill. */
export function pulseLevel(time: number, period: number, duration: number, offset: number): number {
  const phase = (((time + offset) % period) + period) % period;
  if (phase > duration) return 0;
  return Math.sin((Math.PI * phase) / duration) ** 2;
}
