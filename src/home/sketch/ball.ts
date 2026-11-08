export interface Vec2 {
  x: number;
  y: number;
}

export interface CollisionArea {
  right: number;
  bottom: number;
}

/** How much each wall hit adds to the two counters that stop the balls. */
export interface CollisionHits {
  horizontal: number;
  diagonal: number;
}

export const BALL_RADIUS = 86;
/** After a hit the ball is pushed this far inside the wall so it does not stick to it. */
export const WALL_GAP = 7;

/**
 * Physics of one background ball, free of p5 so it can be unit tested.
 * Only the left wall counts as a "horizontal" collision: that is the hit that stops the blue ball.
 */
export class Ball {
  readonly radius = BALL_RADIUS;
  position: Vec2;
  velocity: Vec2;

  constructor(position: Vec2, velocity: Vec2) {
    this.position = { ...position };
    this.velocity = { ...velocity };
  }

  placeAt(position: Vec2): void {
    this.position = { ...position };
  }

  step(): void {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  moveLeft(): void {
    this.position.x -= this.velocity.x;
  }

  moveDown(): void {
    this.position.y += this.velocity.y;
  }

  bounce(area: CollisionArea): CollisionHits {
    const hits: CollisionHits = { horizontal: 0, diagonal: 0 };
    const { radius } = this;
    if (this.position.x > area.right - radius) {
      hits.diagonal++;
      this.velocity.x = -this.velocity.x;
      this.position.x = area.right - radius - WALL_GAP;
    }
    if (this.position.x < radius) {
      hits.horizontal++;
      hits.diagonal++;
      this.velocity.x = -this.velocity.x;
      this.position.x = radius + WALL_GAP;
    }
    if (this.position.y > area.bottom - radius) {
      hits.diagonal++;
      this.velocity.y = -this.velocity.y;
      this.position.y = area.bottom - radius - WALL_GAP;
    }
    if (this.position.y < radius) {
      hits.diagonal++;
      this.velocity.y = -this.velocity.y;
      this.position.y = radius + WALL_GAP;
    }
    return hits;
  }
}
