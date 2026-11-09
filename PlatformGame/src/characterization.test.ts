import { describe, expect, it } from 'vitest';
import { fitAspect } from './clock.ts';
import { VIEW_HEIGHT } from './level.ts';
import { RADIUS, createPlayer, stepPlayer, type Input } from './physics.ts';

/**
 * Pins the feel of the game before the domain refactor: every number below was recorded from the
 * code as shipped in v0.10.0 (PRs #87 and #89 included). Only the harness may change when the
 * architecture does; the assertions must not.
 */

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  minSpeed: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Scenario {
  ball: Partial<Ball>;
  input?: Partial<Input>;
  platforms?: Box[];
  width?: number;
}

interface Frame {
  ball: Ball;
  landingSpeed: number;
  wallHit: boolean;
  respawned: boolean;
}

const NO_INPUT: Input = { left: false, right: false, up: false };
const BLOCK: Box = { x: 100, y: 500, w: 200, h: 268 };

// --- harness: the only part tied to the module layout ------------------------------------------

function simulate(scenario: Scenario, steps: number): Frame[] {
  const player = { ...createPlayer(), ...scenario.ball };
  const input = { ...NO_INPUT, ...scenario.input };
  const level = { platforms: scenario.platforms ?? [BLOCK], width: scenario.width ?? 2000 };
  const frames: Frame[] = [];
  for (let i = 0; i < steps; i++) {
    const events = stepPlayer(player, input, level);
    const { x, y, vx, vy, minSpeed } = player;
    frames.push({ ball: { x, y, vx, vy, minSpeed }, ...events });
  }
  return frames;
}

// --- behaviour ---------------------------------------------------------------------------------

function last(frames: Frame[]): Frame {
  return frames[frames.length - 1] as Frame;
}

describe('characterization: jumping', () => {
  it('a ball dropped from the top lands after 39 steps and bounces 21 units/step up', () => {
    const frames = simulate({ ball: { x: 200, y: 0 } }, 40);
    const landing = frames.findIndex((frame) => frame.landingSpeed > 0);
    expect(landing).toBe(39);
    expect(frames[landing]?.landingSpeed).toBeCloseTo(24);
    expect(frames[landing]?.ball).toMatchObject({ y: BLOCK.y - RADIUS, vx: 0, minSpeed: 0 });
    expect(frames[landing]?.ball.vy).toBeCloseTo(-21);
  });

  it('that bounce peaks at y=113 on step 73 and reaches y=-58.6 when up is held', () => {
    const peakOf = (input: Partial<Input>) => {
      const frames = simulate({ ball: { x: 200, y: 0 }, input }, 120).slice(39);
      const peak = Math.min(...frames.map((frame) => frame.ball.y));
      return { peak, step: 39 + frames.findIndex((frame) => frame.ball.y === peak) };
    };
    expect(peakOf({}).peak).toBeCloseTo(113);
    expect(peakOf({}).step).toBe(73);
    expect(peakOf({ up: true }).peak).toBeCloseTo(-58.6);
  });

  it('holding up only helps while rising, snapping speeds past -9 to -16', () => {
    expect(last(simulate({ ball: { x: 500, y: 300, vy: -5 }, input: { up: true } }, 1)).ball.vy).toBeCloseTo(
      -5,
    );
    expect(last(simulate({ ball: { x: 500, y: 300, vy: -12 }, input: { up: true } }, 1)).ball.vy).toBe(-16);
    expect(last(simulate({ ball: { x: 500, y: 300, vy: 3 }, input: { up: true } }, 1)).ball.vy).toBeCloseTo(
      3.6,
    );
  });

  it('bounces down off the ceiling', () => {
    expect(last(simulate({ ball: { x: 200, y: -60, vy: -12 } }, 1)).ball).toMatchObject({
      y: RADIUS,
      vy: 11.4,
    });
  });
});

describe('characterization: landing', () => {
  it('bounces 5% faster off a top, capping hard falls at 20 and killing sideways speed', () => {
    const soft = last(simulate({ ball: { x: 200, y: 480, vy: 8, vx: 4, minSpeed: -3 } }, 1));
    expect(soft.ball).toMatchObject({ vx: 0, y: 470, minSpeed: 0 });
    expect(soft.ball.vy).toBeCloseTo(-(8 + 0.6) * 1.05);
    const hard = last(simulate({ ball: { x: 200, y: 480, vy: 15 } }, 1));
    expect(hard.ball.vy).toBeCloseTo(-21);
  });

  it('a ball at rest on a top stays on it with a tiny bounce', () => {
    const frame = last(simulate({ ball: { x: 200, y: BLOCK.y - RADIUS, vy: 0 } }, 1));
    expect(frame.ball.y).toBe(BLOCK.y - RADIUS);
    expect(frame.ball.vy).toBeCloseTo(-0.63);
    expect(frame.landingSpeed).toBeCloseTo(0.6);
  });

  it('a ball fast enough to end inside a platform is placed on top, not through it', () => {
    const frame = last(simulate({ ball: { x: 200, y: 460, vy: 60 } }, 1));
    expect(frame.ball).toMatchObject({ y: BLOCK.y - RADIUS, vx: 0 });
    expect(frame.ball.vy).toBeCloseTo(-21);
    expect(frame.landingSpeed).toBeCloseTo(60.6);
  });

  it('turns falling speed into sideways speed on a top-left corner', () => {
    const frame = last(simulate({ ball: { x: 80, y: 490, vy: 7 } }, 1));
    expect(frame.ball).toMatchObject({ vx: -7.6, x: BLOCK.x - RADIUS });
    expect(frame.wallHit).toBe(true);
  });
});

describe('characterization: falling off', () => {
  it('drops the ball back in from the top, keeping x and zeroing speed', () => {
    const frame = last(simulate({ ball: { x: 600, y: 720, vx: 4, vy: 30 } }, 1));
    expect(frame.respawned).toBe(true);
    expect(frame.ball).toMatchObject({ x: 604, y: 0, vx: 0, vy: 0 });
  });

  it('with no platforms the ball falls and respawns forever without leaving the view', () => {
    const frames = simulate({ ball: { x: 200, y: 100 }, platforms: [] }, 200);
    expect(frames.filter((frame) => frame.respawned).length).toBeGreaterThanOrEqual(3);
    for (const frame of frames) {
      expect(frame.ball.y).toBeGreaterThanOrEqual(0);
      expect(frame.ball.y).toBeLessThanOrEqual(VIEW_HEIGHT);
    }
  });
});

describe('characterization: world bounds (#87)', () => {
  const FIRST: Box = { x: 0, y: 500, w: 200, h: 268 };
  const LAST: Box = { x: 330, y: 500, w: 200, h: 268 };
  const WORLD = { platforms: [FIRST, LAST], width: 530 };

  function stays(scenario: Scenario, steps: number): boolean {
    const frames = simulate({ ...WORLD, ...scenario }, steps);
    for (const frame of frames) {
      expect(frame.ball.x).toBeGreaterThanOrEqual(RADIUS);
      expect(frame.ball.x).toBeLessThanOrEqual(WORLD.width - RADIUS);
    }
    return frames.some((frame) => frame.landingSpeed > 0);
  }

  it('keeps a ball flying left or right inside the end walls, and it still lands', () => {
    expect(stays({ ball: { x: 100, y: 100, vx: -15 } }, 300)).toBe(true);
    expect(stays({ ball: { x: 430, y: 100, vx: 15 } }, 300)).toBe(true);
  });

  it('keeps a ball pushed into a wall by the player inside too', () => {
    expect(stays({ ball: { x: 100, y: 100 }, input: { left: true } }, 300)).toBe(true);
    expect(stays({ ball: { x: 430, y: 100 }, input: { right: true } }, 300)).toBe(true);
  });

  it('bounces off an end wall like a platform face', () => {
    const frame = last(simulate({ ...WORLD, ball: { x: 40, y: 100, vx: -15 } }, 1));
    expect(frame.ball).toMatchObject({ x: RADIUS, vx: 15 });
    expect(frame.wallHit).toBe(true);
  });

  it('throws a ball that tunnels into the last platform back out of the face it came from', () => {
    const frame = last(simulate({ ...WORLD, ball: { x: 290, y: 650, vx: 30 }, input: { right: true } }, 1));
    expect(frame.ball).toMatchObject({ x: LAST.x - RADIUS, vx: -30 });
    expect(frame.wallHit).toBe(true);
  });

  it('moves 12 units per step on the arrows, clamped to the walls', () => {
    expect(last(simulate({ ball: { x: RADIUS + 5, y: 100 }, input: { left: true } }, 1)).ball.x).toBe(RADIUS);
    expect(last(simulate({ ball: { x: 500, y: 100 }, input: { right: true } }, 1)).ball.x).toBe(512);
  });
});

describe('characterization: canvas room (#89)', () => {
  it('letterboxes the 1366x768 view into a landscape phone stage beside a 260px column', () => {
    expect(fitAspect(640 - 260 - 24, 360 - 24, 1366 / 768)).toEqual({ width: 356, height: 200 });
    expect(fitAspect(390, 600, 1366 / 768)).toEqual({ width: 390, height: 219 });
  });
});
