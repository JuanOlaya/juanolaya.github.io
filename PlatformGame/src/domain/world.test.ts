import { describe, expect, it } from 'vitest';
import { Platform } from './platform.ts';
import { Player, RADIUS } from './player.ts';
import { MAX_CATCH_UP_SECONDS, STEP_SECONDS } from './timestep.ts';
import { Vector } from './vector.ts';
import { VIEW_HEIGHT } from './view.ts';
import { type InputState, World } from './world.ts';

const NO_INPUT: InputState = { left: false, right: false, up: false };
const BLOCK = new Platform(100, 500, 200, 268);

function world(x: number, y: number, platforms: readonly Platform[] = [BLOCK], width = 2000): World {
  return new World(platforms, width, new Player(new Vector(x, y)));
}

describe('World.step', () => {
  it('runs one fixed step per 1/30 s and reports how many it ran', () => {
    const w = world(500, 100);
    w.step(STEP_SECONDS / 2, NO_INPUT);
    expect(w.lastStep.steps).toBe(0);
    expect(w.lastStep.alpha).toBeCloseTo(0.5);
    expect(w.player.position).toEqual(new Vector(500, 100));
    w.step(STEP_SECONDS, NO_INPUT);
    expect(w.lastStep.steps).toBe(1);
    expect(w.lastStep.alpha).toBeCloseTo(0.5);
    expect(w.player.velocity.y).toBeCloseTo(0.6);
    expect(w.previousPosition).toEqual(new Vector(500, 100));
  });

  it('starts idle, with the spawn point as the previous position', () => {
    const w = new World([BLOCK], 2000);
    expect(w.lastStep).toMatchObject({ steps: 0, side: 0, normal: null });
    expect(w.previousPosition).toEqual(w.player.position);
    expect(w.player.position).toEqual(new Vector(683, 0));
  });

  it('a ball with zero velocity on a top stays there, trembling less than a pixel', () => {
    const w = world(200, BLOCK.y - RADIUS);
    for (let i = 0; i < 30; i++) {
      w.step(STEP_SECONDS, NO_INPUT);
      expect(w.player.position.y).toBeCloseTo(BLOCK.y - RADIUS, 0);
      expect(Math.abs(w.player.velocity.y)).toBeLessThan(1);
    }
  });

  it('catches up at most 0.25 s after a huge dt and never tunnels into a platform', () => {
    const w = world(200, 0);
    w.step(10, NO_INPUT);
    expect(w.lastStep.steps).toBe(Math.floor(MAX_CATCH_UP_SECONDS / STEP_SECONDS));
    let landed = false;
    for (let i = 0; i < 40; i++) {
      w.step(10, NO_INPUT);
      landed ||= w.lastStep.landingSpeed > 0;
      expect(w.player.position.y).toBeLessThanOrEqual(BLOCK.y - RADIUS);
    }
    expect(landed).toBe(true);
  });

  it('ignores NaN, negative and zero deltas', () => {
    const w = world(500, 100);
    w.step(Number.NaN, NO_INPUT);
    w.step(-1, NO_INPUT);
    w.step(0, NO_INPUT);
    expect(w.lastStep.steps).toBe(0);
    expect(w.player.position).toEqual(new Vector(500, 100));
  });

  it('with no platforms the ball falls, respawns and keeps falling', () => {
    const w = world(200, 737, []);
    w.step(STEP_SECONDS, NO_INPUT);
    expect(w.lastStep.respawned).toBe(false);
    w.step(STEP_SECONDS, NO_INPUT);
    expect(w.lastStep.respawned).toBe(true);
    expect(w.player.position.y).toBeLessThan(VIEW_HEIGHT);
    expect(w.player.position.x).toBe(200);
  });

  it('merges the events of several fixed steps: strongest landing, any wall, last normal', () => {
    const w = world(200, 469, [BLOCK]);
    // 0.07 s is a touch over two steps, so float rounding cannot turn it into one.
    w.step(0.07, NO_INPUT);
    expect(w.lastStep.steps).toBe(2);
    expect(w.lastStep.landingSpeed).toBeCloseTo(1.2);
    expect(w.lastStep.normal).toEqual(new Vector(0, -1));
    expect(w.lastStep.side).toBe(3);
  });

  it('reports end-wall bounces with the wall normal', () => {
    const w = world(40, 100, [], 530);
    w.player.velocity = new Vector(-15, 0);
    w.step(STEP_SECONDS, NO_INPUT);
    expect(w.lastStep.wallHit).toBe(true);
    expect(w.lastStep.normal).toEqual(new Vector(1, 0));
    expect(w.player.position.x).toBe(RADIUS);
    expect(w.player.velocity.x).toBe(15);
  });

  it('exposes its platforms read-only', () => {
    const w = world(200, 0);
    expect(w.platforms).toHaveLength(1);
    expect(w.width).toBe(2000);
  });
});
