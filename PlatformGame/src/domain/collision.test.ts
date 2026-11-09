import { describe, expect, it } from 'vitest';
import { collide, normalOf, resolveCollisions, sideOf } from './collision.ts';
import { Platform } from './platform.ts';
import { Player, RADIUS } from './player.ts';
import { Vector } from './vector.ts';

const BLOCK = new Platform(100, 500, 200, 268);

function ball(x: number, y: number, vx = 0, vy = 0): Player {
  const player = new Player(new Vector(x, y));
  player.velocity = new Vector(vx, vy);
  return player;
}

describe('sideOf', () => {
  it('numbers the regions around a platform like a clock face', () => {
    expect(sideOf(new Vector(50, 600), BLOCK)).toBe(12);
    expect(sideOf(new Vector(200, 400), BLOCK)).toBe(3);
    expect(sideOf(new Vector(350, 600), BLOCK)).toBe(6);
    expect(sideOf(new Vector(200, 800), BLOCK)).toBe(9);
    expect(sideOf(new Vector(200, 600), BLOCK)).toBe(0);
  });

  it('splits each corner by the nearer face', () => {
    expect(sideOf(new Vector(90, 450), BLOCK)).toBe(2);
    expect(sideOf(new Vector(50, 495), BLOCK)).toBe(1);
    // The original compares the (negative) overshoots on the right corners, hence 4 and 5 swap.
    expect(sideOf(new Vector(310, 450), BLOCK)).toBe(4);
    expect(sideOf(new Vector(350, 495), BLOCK)).toBe(5);
    expect(sideOf(new Vector(350, 775), BLOCK)).toBe(7);
    expect(sideOf(new Vector(310, 800), BLOCK)).toBe(8);
    expect(sideOf(new Vector(50, 775), BLOCK)).toBe(11);
    expect(sideOf(new Vector(90, 800), BLOCK)).toBe(10);
  });
});

describe('collide', () => {
  it('ignores a ball that does not touch, but still records which region it is in', () => {
    const player = ball(50, 100);
    expect(collide(player, BLOCK)).toBe(0);
    expect(player.side).toBe(2);
  });

  it('counts a ball exactly one radius away as touching', () => {
    const top = ball(200, BLOCK.y - RADIUS, 0, 0);
    expect(collide(top, BLOCK)).toBe(3);
    const left = ball(BLOCK.x - RADIUS, 600, 0, 0);
    expect(collide(left, BLOCK)).toBe(12);
    expect(left.velocity).toEqual(new Vector(-0, 0));
    const corner = ball(BLOCK.x - RADIUS * Math.SQRT1_2 - 0.01, BLOCK.y - RADIUS * Math.SQRT1_2 - 0.01);
    expect(collide(corner, BLOCK)).toBe(0);
  });

  it('bounces off the top 5% faster, capping hard falls at 20', () => {
    const soft = ball(200, 480, 4, 8);
    soft.minSpeed = -3;
    expect(collide(soft, BLOCK)).toBe(3);
    expect(soft.position).toEqual(new Vector(200, 470));
    expect(soft.velocity.x).toBe(0);
    expect(soft.velocity.y).toBeCloseTo(-8.4);
    expect(soft.minSpeed).toBe(0);
    const hard = ball(200, 480, 0, 15);
    collide(hard, BLOCK);
    expect(hard.velocity.y).toBeCloseTo(-21);
  });

  it('reflects horizontal speed on the faces and pushes the ball out', () => {
    const left = ball(80, 600, 12);
    expect(collide(left, BLOCK)).toBe(12);
    expect(left.velocity).toEqual(new Vector(-12, 0));
    expect(left.position.x).toBe(BLOCK.x - RADIUS);
    const right = ball(320, 600, -5);
    expect(collide(right, BLOCK)).toBe(6);
    expect(right.velocity).toEqual(new Vector(5, 0));
    expect(right.position.x).toBe(BLOCK.right + RADIUS);
    const below = ball(200, 790, 2, -5);
    expect(collide(below, BLOCK)).toBe(9);
    expect(below.velocity).toEqual(new Vector(2, 5));
    expect(below.position.y).toBe(BLOCK.bottom + RADIUS);
  });

  it('turns one speed into the other on the corners', () => {
    const topLeft = ball(80, 490, 0, 7);
    expect(collide(topLeft, BLOCK)).toBe(1);
    expect(topLeft.velocity).toEqual(new Vector(-7, 7));
    expect(topLeft.position.x).toBe(BLOCK.x - RADIUS);
    const topRight = ball(320, 490, 0, 7);
    expect(collide(topRight, BLOCK)).toBe(5);
    expect(topRight.velocity).toEqual(new Vector(7, 7));
    const bottomRight = ball(320, 780, -3, 0);
    expect(collide(bottomRight, BLOCK)).toBe(7);
    expect(bottomRight.velocity).toEqual(new Vector(-3, 3));
    const bottomLeft = ball(80, 780, 3, 0);
    expect(collide(bottomLeft, BLOCK)).toBe(11);
    expect(bottomLeft.velocity).toEqual(new Vector(3, 3));
  });

  it('throws a ball that ended inside out of the face it came from, or the top when unknown', () => {
    const fromLeft = ball(150, 650, 30);
    expect(collide(fromLeft, BLOCK, new Vector(60, 650))).toBe(12);
    expect(fromLeft.position.x).toBe(BLOCK.x - RADIUS);
    expect(fromLeft.velocity.x).toBe(-30);
    const unknown = ball(200, 600, 0, 60);
    expect(collide(unknown, BLOCK)).toBe(3);
    expect(unknown.position.y).toBe(BLOCK.y - RADIUS);
  });
});

describe('resolveCollisions', () => {
  it('does nothing with no platforms', () => {
    const player = ball(200, 600, 3, 4);
    expect(resolveCollisions(player, [])).toEqual({ landingSpeed: 0, wallHit: false, side: 0, normal: null });
    expect(player.position).toEqual(new Vector(200, 600));
    expect(player.velocity).toEqual(new Vector(3, 4));
  });

  it('reports the landing speed and an upward normal for a top hit', () => {
    const result = resolveCollisions(ball(200, 480, 0, 8), [BLOCK]);
    expect(result).toMatchObject({ landingSpeed: 8, wallHit: false, side: 3 });
    expect(result.normal).toEqual(new Vector(0, -1));
  });

  it('flags faces and corners as wall hits with their normal', () => {
    const result = resolveCollisions(ball(80, 600, 12), [new Platform(500, 500, 10, 10), BLOCK]);
    expect(result).toMatchObject({ landingSpeed: 0, wallHit: true, side: 12 });
    expect(result.normal).toEqual(new Vector(-1, 0));
    expect(normalOf(1)?.length()).toBeCloseTo(1);
    expect(normalOf(0)).toBeNull();
  });
});
