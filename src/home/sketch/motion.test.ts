import { describe, expect, it } from 'vitest';
import { easeFactor, headingVelocity, pullToward, pulseLevel, stepMover, type Mover } from './motion.ts';

const bounds = { width: 800, height: 600 };

function mover(overrides: Partial<Mover> = {}): Mover {
  return {
    position: { x: 400, y: 300 },
    velocity: { x: 0, y: 0 },
    heading: 0,
    radius: 50,
    speed: 100,
    ...overrides,
  };
}

describe('easeFactor', () => {
  it('is 0 without time and approaches 1 with a lot of it', () => {
    expect(easeFactor(5, 0)).toBe(0);
    expect(easeFactor(5, 10)).toBeCloseTo(1, 9);
  });

  it('compounds: two half steps equal one full step', () => {
    const half = easeFactor(4, 0.02);
    expect(1 - (1 - half) ** 2).toBeCloseTo(easeFactor(4, 0.04), 12);
  });
});

describe('headingVelocity', () => {
  it('points along the angle with the given speed', () => {
    const v = headingVelocity(Math.PI / 2, 120);
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(120);
  });
});

describe('pullToward', () => {
  it('grows with distance', () => {
    expect(pullToward({ x: 0, y: 0 }, { x: 100, y: 0 }, 0.5, 1000)).toEqual({ x: 50, y: 0 });
  });

  it('is capped', () => {
    const pull = pullToward({ x: 0, y: 0 }, { x: 0, y: 1000 }, 1, 40);
    expect(pull.x).toBeCloseTo(0);
    expect(pull.y).toBeCloseTo(40);
  });
});

describe('stepMover', () => {
  it('covers the same distance at 30 and 120 FPS', () => {
    const slow = mover({ velocity: { x: 100, y: 0 } });
    const fast = mover({ velocity: { x: 100, y: 0 } });
    for (let i = 0; i < 30; i++) stepMover(slow, { x: 100, y: 0 }, 1 / 30, 3, bounds);
    for (let i = 0; i < 120; i++) stepMover(fast, { x: 100, y: 0 }, 1 / 120, 3, bounds);
    expect(fast.position.x).toBeCloseTo(slow.position.x, 6);
  });

  it('eases toward the target velocity instead of jumping to it', () => {
    const m = mover();
    stepMover(m, { x: 100, y: 0 }, 1 / 60, 3, bounds);
    expect(m.velocity.x).toBeGreaterThan(0);
    expect(m.velocity.x).toBeLessThan(10);
  });

  it('bounces off a wall, keeps the ring on screen and mirrors the heading', () => {
    const m = mover({ position: { x: 745, y: 300 }, velocity: { x: 300, y: 0 }, heading: 0 });
    stepMover(m, { x: 300, y: 0 }, 0.1, 3, bounds);
    expect(m.position.x).toBeLessThanOrEqual(bounds.width - m.radius);
    expect(m.velocity.x).toBeLessThan(0);
    expect(Math.cos(m.heading)).toBeCloseTo(-1);
  });

  it('pulls a ring left outside a shrunken window back inside', () => {
    const m = mover({ position: { x: 2000, y: 2000 } });
    stepMover(m, { x: 0, y: 0 }, 1 / 60, 3, bounds);
    expect(m.position).toEqual({ x: 750, y: 550 });
  });
});

describe('pulseLevel', () => {
  it('is 0 outside the pulse and peaks in its middle', () => {
    expect(pulseLevel(0, 8, 1, 0)).toBe(0);
    expect(pulseLevel(0.5, 8, 1, 0)).toBeCloseTo(1);
    expect(pulseLevel(2, 8, 1, 0)).toBe(0);
  });

  it('repeats every period, also for negative offsets', () => {
    expect(pulseLevel(8.25, 8, 1, 0)).toBeCloseTo(pulseLevel(0.25, 8, 1, 0));
    expect(pulseLevel(0.75, 8, 1, -0.5)).toBeCloseTo(pulseLevel(0.25, 8, 1, 0));
  });
});
