import { describe, expect, it } from 'vitest';
import {
  TRAIL_LIFETIME,
  advanceWorld,
  createWorld,
  leadRadius,
  satellitesPerHue,
  setOrbitTarget,
} from './world.ts';

const desktop = { width: 1920, height: 1080 };
const phone = { width: 390, height: 844 };
const middle = (min: number, max: number) => (min + max) / 2;
const flatNoise = () => 0.5;

function run(seconds: number, fps: number, bounds = desktop) {
  const world = createWorld(bounds, middle);
  for (let i = 0; i < seconds * fps; i++) advanceWorld(world, 1 / fps, flatNoise);
  return world;
}

describe('createWorld', () => {
  it('puts the orange and blue leads first, then their satellites', () => {
    const world = createWorld(desktop, middle);
    expect(world.particles.map((p) => p.hue).slice(0, 2)).toEqual(['orange', 'blue']);
    expect(world.particles).toHaveLength(2 + 2 * satellitesPerHue(desktop.width));
    expect(world.particles.slice(2).every((p) => p.leader === (p.hue === 'orange' ? 0 : 1))).toBe(true);
  });

  it('uses fewer, smaller particles on phones', () => {
    expect(createWorld(phone, middle).particles.length).toBeLessThan(
      createWorld(desktop, middle).particles.length,
    );
    expect(leadRadius(phone)).toBeLessThan(leadRadius(desktop));
    expect(leadRadius(desktop)).toBe(86);
  });
});

describe('advanceWorld', () => {
  it('keeps every ring on screen', () => {
    const world = run(20, 60, phone);
    for (const { position, radius } of world.particles) {
      expect(position.x).toBeGreaterThanOrEqual(radius);
      expect(position.x).toBeLessThanOrEqual(phone.width - radius);
      expect(position.y).toBeGreaterThanOrEqual(radius);
      expect(position.y).toBeLessThanOrEqual(phone.height - radius);
    }
  });

  it('ends up in about the same place at 30 and 144 FPS', () => {
    const slow = run(3, 30).particles[0].position;
    const fast = run(3, 144).particles[0].position;
    expect(Math.hypot(slow.x - fast.x, slow.y - fast.y)).toBeLessThan(5);
  });

  it('lets trails fade out instead of growing forever', () => {
    const world = run(30, 60);
    for (const { trail } of world.particles) {
      expect(world.time - trail[0].bornAt).toBeLessThan(TRAIL_LIFETIME);
    }
  });
});

describe('setOrbitTarget', () => {
  const card = { x: 100, y: 100, width: 300, height: 140 };

  it('launches the hover rings from the leads', () => {
    const world = createWorld(desktop, middle);
    setOrbitTarget(world, card);
    expect(world.orbit?.orange).toEqual(world.particles[0].position);
    expect(world.orbit?.blue).toEqual(world.particles[1].position);
  });

  it('ignores a release before any hover', () => {
    const world = createWorld(desktop, middle);
    setOrbitTarget(world, null);
    expect(world.orbit).toBeNull();
  });

  it('circles the card while hovered and lets the rings fade once released', () => {
    const world = createWorld(desktop, middle);
    setOrbitTarget(world, card);
    for (let i = 0; i < 120; i++) advanceWorld(world, 1 / 60, flatNoise);
    const orange = world.orbit!.orange;
    expect(Math.abs(orange.x - 250)).toBeLessThanOrEqual(150 + 14 + 1);
    expect(world.orbit!.orangeTrail.length).toBeGreaterThan(0);
    setOrbitTarget(world, null);
    for (let i = 0; i < 240; i++) advanceWorld(world, 1 / 60, flatNoise);
    expect(world.orbit!.orangeTrail).toEqual([]);
  });
});
