import { Vector } from './vector.ts';
import { VIEW_HEIGHT, VIEW_WIDTH } from './view.ts';

export const RADIUS = 30;
/** Downward acceleration per fixed step, as in the original 30 FPS sketch. */
export const GRAVITY = new Vector(0, 0.6);
const SPEED_X = 12;
const CEILING = RADIUS - 100;
const JUMP_BOOST_LIMIT = -9;
const JUMP_BOOST_SPEED = -16;

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Entity: the ball. It owns its kinematics; collisions with platforms are a domain service
 * (`collision.ts`) because they involve two entities.
 */
export class Player {
  position: Vector;
  velocity = Vector.ZERO;
  /** Most negative vertical speed reached since the last landing (shown in the physics panel). */
  minSpeed = 0;
  /** Side of the last platform tested, 1..12 like a clock face around it; 0 when clear. */
  side = 0;

  constructor(position = new Vector(VIEW_WIDTH / 2, 0)) {
    this.position = position;
  }

  /** One fixed step of free fall: gravity, then movement. */
  fall(): void {
    this.minSpeed = Math.min(this.minSpeed, this.velocity.y);
    this.velocity = this.velocity.add(GRAVITY);
    this.position = this.position.add(this.velocity);
  }

  /** Falling off the bottom drops the ball back in from the top; the top edge bounces it down. */
  keepInsideView(): boolean {
    if (this.position.y > VIEW_HEIGHT - RADIUS) {
      this.velocity = Vector.ZERO;
      this.position = this.position.withY(0);
      return true;
    }
    if (this.position.y < CEILING) {
      this.velocity = this.velocity.withY(-this.velocity.y);
      this.position = this.position.withY(RADIUS);
    }
    return false;
  }

  /**
   * The end walls are solid: the original only clamped arrow-key moves, so sideways speed from a
   * corner bounce could carry the ball past a wall into a void with nothing to land on, forever.
   * Returns the wall's normal when it reflected the ball, like a platform face does.
   */
  bounceOffWalls(worldWidth: number): Vector | null {
    const x = clamp(this.position.x, RADIUS, worldWidth - RADIUS);
    if (x === this.position.x) return null;
    this.position = this.position.withX(x);
    this.velocity = this.velocity.withX(-this.velocity.x);
    return new Vector(x === RADIUS ? 1 : -1, 0);
  }

  /** Arrow moves are applied one after the other and clamped to the walls, exactly as the original did. */
  steer(input: InputState, worldWidth: number): void {
    if (input.left) this.nudge(-SPEED_X, worldWidth);
    if (input.right) this.nudge(SPEED_X, worldWidth);
    if (input.up && this.velocity.y < 0) this.boostJump();
  }

  private nudge(dx: number, worldWidth: number): void {
    this.position = this.position.withX(clamp(this.position.x + dx, RADIUS, worldWidth - RADIUS));
  }

  /** Holding up while rising cancels gravity; past the limit the rise snaps to one fixed speed. */
  private boostJump(): void {
    const vy = this.velocity.y - GRAVITY.y;
    this.velocity = this.velocity.withY(vy < JUMP_BOOST_LIMIT ? JUMP_BOOST_SPEED : vy);
  }
}
