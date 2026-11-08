import { describe, expect, it } from 'vitest';
import { Ball, BALL_RADIUS, WALL_GAP } from './ball.ts';

const AREA = { right: 1000, bottom: 800 };

describe('Ball movement', () => {
  it('step adds the velocity to the position', () => {
    const ball = new Ball({ x: 200, y: 300 }, { x: 3, y: 4 });
    ball.step();
    expect(ball.position).toEqual({ x: 203, y: 304 });
  });

  it('moveLeft subtracts the horizontal speed only', () => {
    const ball = new Ball({ x: 500, y: 300 }, { x: 4, y: 4 });
    ball.moveLeft();
    expect(ball.position).toEqual({ x: 496, y: 300 });
  });

  it('moveDown adds the vertical speed only', () => {
    const ball = new Ball({ x: 500, y: 300 }, { x: 4, y: 4 });
    ball.moveDown();
    expect(ball.position).toEqual({ x: 500, y: 304 });
  });

  it('uses the original 86px radius', () => {
    expect(new Ball({ x: 0, y: 0 }, { x: 0, y: 0 }).radius).toBe(86);
  });
});

describe('Ball.bounce', () => {
  it('reports no hits inside the area', () => {
    const ball = new Ball({ x: 500, y: 400 }, { x: 3, y: 3 });
    expect(ball.bounce(AREA)).toEqual({ horizontal: 0, diagonal: 0 });
    expect(ball.velocity).toEqual({ x: 3, y: 3 });
  });

  it('left wall counts for both counters, flips x and pushes the ball inside', () => {
    const ball = new Ball({ x: BALL_RADIUS - 1, y: 400 }, { x: -3, y: 3 });
    expect(ball.bounce(AREA)).toEqual({ horizontal: 1, diagonal: 1 });
    expect(ball.velocity.x).toBe(3);
    expect(ball.position.x).toBe(BALL_RADIUS + WALL_GAP);
  });

  it('right wall counts only as diagonal and uses the given right limit', () => {
    const ball = new Ball({ x: 800 - BALL_RADIUS + 1, y: 400 }, { x: 3, y: 3 });
    expect(ball.bounce({ right: 800, bottom: 800 })).toEqual({ horizontal: 0, diagonal: 1 });
    expect(ball.velocity.x).toBe(-3);
    expect(ball.position.x).toBe(800 - BALL_RADIUS - WALL_GAP);
  });

  it('bottom wall counts only as diagonal and flips y', () => {
    const ball = new Ball({ x: 500, y: 800 - BALL_RADIUS + 1 }, { x: 3, y: 3 });
    expect(ball.bounce(AREA)).toEqual({ horizontal: 0, diagonal: 1 });
    expect(ball.velocity.y).toBe(-3);
    expect(ball.position.y).toBe(800 - BALL_RADIUS - WALL_GAP);
  });

  it('top wall counts only as diagonal and flips y', () => {
    const ball = new Ball({ x: 500, y: BALL_RADIUS - 1 }, { x: 3, y: -3 });
    expect(ball.bounce(AREA)).toEqual({ horizontal: 0, diagonal: 1 });
    expect(ball.velocity.y).toBe(3);
    expect(ball.position.y).toBe(BALL_RADIUS + WALL_GAP);
  });

  it('a corner hit adds one diagonal per wall', () => {
    const ball = new Ball({ x: BALL_RADIUS - 1, y: BALL_RADIUS - 1 }, { x: -3, y: -3 });
    expect(ball.bounce(AREA)).toEqual({ horizontal: 1, diagonal: 2 });
  });

  it('placeAt moves the ball without touching its velocity', () => {
    const ball = new Ball({ x: 1, y: 2 }, { x: 3, y: 4 });
    ball.placeAt({ x: 10, y: 20 });
    expect(ball.position).toEqual({ x: 10, y: 20 });
    expect(ball.velocity).toEqual({ x: 3, y: 4 });
  });
});
