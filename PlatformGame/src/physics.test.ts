import { describe, expect, it } from 'vitest';
import { collideCircleRect } from './collision.ts';
import type { Level } from './level.ts';
import { GRAVITY, RADIUS, createPlayer, stepPlayer, type Input } from './physics.ts';

const NO_INPUT: Input = { left: false, right: false, up: false };
const EMPTY: Level = { platforms: [], width: 2000 };
const BLOCK = { x: 100, y: 500, w: 200, h: 268 };

function player(overrides: Partial<ReturnType<typeof createPlayer>>) {
  return { ...createPlayer(), ...overrides };
}

describe('stepPlayer', () => {
  it('applies gravity then moves, one original frame at a time', () => {
    const ball = player({ x: 500, y: 100, vy: 2 });
    stepPlayer(ball, NO_INPUT, EMPTY);
    expect(ball.vy).toBeCloseTo(2 + GRAVITY);
    expect(ball.y).toBeCloseTo(102.6);
  });

  it('drops the ball back in from the top after it falls out', () => {
    const ball = player({ x: 500, y: 760, vx: 3, vy: 5 });
    const events = stepPlayer(ball, NO_INPUT, EMPTY);
    expect(events.respawned).toBe(true);
    expect(ball).toMatchObject({ x: 503, y: 0, vx: 0, vy: 0 });
  });

  it('moves 12 units sideways but never past the world edges', () => {
    const ball = player({ x: RADIUS + 5, y: 100 });
    stepPlayer(ball, { ...NO_INPUT, left: true }, EMPTY);
    expect(ball.x).toBe(RADIUS);
    const right = player({ x: 500, y: 100 });
    stepPlayer(right, { ...NO_INPUT, right: true }, EMPTY);
    expect(right.x).toBe(512);
  });

  it('cancels gravity while up is held on the way up, snapping fast rises to -16', () => {
    const slow = player({ x: 500, y: 300, vy: -5 });
    stepPlayer(slow, { ...NO_INPUT, up: true }, EMPTY);
    expect(slow.vy).toBeCloseTo(-5);
    const fast = player({ x: 500, y: 300, vy: -12 });
    stepPlayer(fast, { ...NO_INPUT, up: true }, EMPTY);
    expect(fast.vy).toBe(-16);
  });

  it('reports the landing speed when it bounces on a platform top', () => {
    const ball = player({ x: 200, y: 465, vy: 6 });
    const events = stepPlayer(ball, NO_INPUT, { platforms: [BLOCK], width: 2000 });
    expect(events.landingSpeed).toBeCloseTo(6.6);
    expect(ball.y).toBe(BLOCK.y - RADIUS);
  });
});

describe('collideCircleRect', () => {
  it('ignores a ball that does not touch', () => {
    const ball = player({ x: 50, y: 100 });
    expect(collideCircleRect(ball, BLOCK)).toBe(0);
  });

  it('bounces off the top 5% faster, capping hard falls at 20', () => {
    const soft = player({ x: 200, y: 480, vy: 8, vx: 4, minSpeed: -3 });
    expect(collideCircleRect(soft, BLOCK)).toBe(3);
    expect(soft).toMatchObject({ vx: 0, y: 470, minSpeed: 0 });
    expect(soft.vy).toBeCloseTo(-8.4);
    const hard = player({ x: 200, y: 480, vy: 15 });
    collideCircleRect(hard, BLOCK);
    expect(hard.vy).toBeCloseTo(-21);
  });

  it('reflects horizontal speed on the left face', () => {
    const ball = player({ x: 80, y: 600, vx: 12 });
    expect(collideCircleRect(ball, BLOCK)).toBe(12);
    expect(ball).toMatchObject({ vx: -12, x: 100 - RADIUS });
  });

  it('pushes off the right face', () => {
    const ball = player({ x: 320, y: 600, vx: -5 });
    expect(collideCircleRect(ball, BLOCK)).toBe(6);
    expect(ball).toMatchObject({ vx: 5, x: 300 + RADIUS });
  });

  it('turns falling speed into sideways speed on the top-left corner', () => {
    const ball = player({ x: 80, y: 490, vy: 7 });
    expect(collideCircleRect(ball, BLOCK)).toBe(1);
    expect(ball).toMatchObject({ vx: -7, x: 100 - RADIUS });
  });
});

describe('world edges', () => {
  // Owner's report: sideways speed from a corner bounce carried the ball past the full-height end
  // wall, where it fell and respawned forever beside the wall with nothing to land on.
  const FIRST = { x: 0, y: 500, w: 200, h: 268 };
  const LAST = { x: 330, y: 500, w: 200, h: 268 };
  const WORLD: Level = { platforms: [FIRST, LAST], width: 530 };

  function play(ball: ReturnType<typeof createPlayer>, steps: number) {
    let landed = false;
    for (let i = 0; i < steps; i++) {
      landed ||= stepPlayer(ball, NO_INPUT, WORLD).landingSpeed > 0;
      expect(ball.x).toBeGreaterThanOrEqual(RADIUS);
      expect(ball.x).toBeLessThanOrEqual(WORLD.width - RADIUS);
    }
    return landed;
  }

  it('keeps a ball flying left inside the left wall', () => {
    const ball = player({ x: 100, y: 100, vx: -15 });
    expect(play(ball, 300)).toBe(true);
  });

  it('keeps a ball flying right inside the right wall', () => {
    const ball = player({ x: 430, y: 100, vx: 15 });
    expect(play(ball, 300)).toBe(true);
  });

  it('throws a ball that tunnels into the last platform back out of the face it came from', () => {
    // Fast enough to end the step inside the platform; the stale side of the previously tested
    // platform used to push it out through the right face, into the end wall.
    const ball = player({ x: 290, y: 650, vx: 30 });
    const events = stepPlayer(ball, { ...NO_INPUT, right: true }, WORLD);
    expect(ball).toMatchObject({ x: LAST.x - RADIUS, vx: -30, side: 12 });
    expect(events.wallHit).toBe(true);
  });

  it('bounces off an end wall like a platform face', () => {
    const ball = player({ x: 40, y: 100, vx: -15 });
    const events = stepPlayer(ball, NO_INPUT, WORLD);
    expect(ball).toMatchObject({ x: RADIUS, vx: 15 });
    expect(events.wallHit).toBe(true);
  });
});
