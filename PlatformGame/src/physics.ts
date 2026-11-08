import { RADIUS, collideCircleRect } from './collision.ts';
import { VIEW_HEIGHT, VIEW_WIDTH, type Level } from './level.ts';

/**
 * Player physics ported 1:1 from the original sketch, which ran at 30 FPS: every constant is
 * "per original frame". The game advances in fixed 1/30 s steps, so the feel is unchanged on any display.
 */
export const STEP_SECONDS = 1 / 30;
export const GRAVITY = 0.6;
const SPEED_X = 12;
const CEILING = RADIUS - 100;

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Most negative vertical speed reached since the last landing (shown in the HUD). */
  minSpeed: number;
  /** Side of the last collision tested, 1..12 like a clock face around the platform. */
  side: number;
}

export interface Input {
  left: boolean;
  right: boolean;
  up: boolean;
}

/** What happened during a step, so the renderer can add dust, flashes and shake. */
export interface StepEvents {
  /** Downward speed when bouncing off a platform top, 0 if there was none. */
  landingSpeed: number;
  wallHit: boolean;
  respawned: boolean;
}

export function createPlayer(): Player {
  return { x: VIEW_WIDTH / 2, y: 0, vx: 0, vy: 0, minSpeed: 0, side: 0 };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Falling off the bottom drops the ball back in from the top; the top edge bounces it down. */
function bounceEdges(player: Player): boolean {
  if (player.y > VIEW_HEIGHT - RADIUS) {
    player.vx = 0;
    player.vy = 0;
    player.y = 0;
    return true;
  }
  if (player.y < CEILING) {
    player.vy = -player.vy;
    player.y = RADIUS;
  }
  return false;
}

/**
 * The end walls are solid: the original only clamped arrow-key moves, so sideways speed from a
 * corner bounce could carry the ball past a wall into a void with nothing to land on, forever.
 * Hitting a wall reflects the ball like a platform face does.
 */
function bounceWalls(player: Player, worldWidth: number): boolean {
  const x = clamp(player.x, RADIUS, worldWidth - RADIUS);
  if (x === player.x) return false;
  player.x = x;
  player.vx = -player.vx;
  return true;
}

function applyInput(player: Player, input: Input, worldWidth: number): void {
  if (input.left) player.x = clamp(player.x - SPEED_X, RADIUS, worldWidth - RADIUS);
  if (input.right) player.x = clamp(player.x + SPEED_X, RADIUS, worldWidth - RADIUS);
  // Holding up while rising stretches the jump, capped by snapping to -16 once past -9.
  if (input.up && player.vy < 0) {
    player.vy -= GRAVITY;
    if (player.vy < -9) player.vy = -16;
  }
}

/** One original frame: gravity, edges, input, then every platform; mutates and reports events. */
export function stepPlayer(player: Player, input: Input, level: Level): StepEvents {
  const events: StepEvents = { landingSpeed: 0, wallHit: false, respawned: false };
  const from = { x: player.x, y: player.y };
  player.minSpeed = Math.min(player.minSpeed, player.vy);
  player.vy += GRAVITY;
  player.x += player.vx;
  player.y += player.vy;
  events.respawned = bounceEdges(player);
  events.wallHit = bounceWalls(player, level.width);
  applyInput(player, input, level.width);
  for (const platform of level.platforms) {
    const before = player.vy;
    const side = collideCircleRect(player, platform, from);
    if (side === 3) events.landingSpeed = Math.max(events.landingSpeed, before);
    else if (side !== 0) events.wallHit = true;
  }
  return events;
}

export { RADIUS };
