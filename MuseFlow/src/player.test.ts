import { describe, expect, it } from 'vitest';
import { WORLD_HEIGHT, layoutColumns } from './columns.ts';
import { BALL_RADIUS, blockedX, groundAt, stepBall } from './player.ts';

function twoColumns(firstHeight: number, secondHeight: number) {
  const columns = layoutColumns([
    { width: 300, speed: 0 },
    { width: 300, speed: 0 },
  ]);
  columns[0].height = firstHeight;
  columns[1].height = secondHeight;
  return columns;
}

describe('groundAt', () => {
  it('is the highest top under the footprint', () => {
    const columns = twoColumns(200, 400);
    expect(groundAt(columns, 150, 20)).toBe(WORLD_HEIGHT - 200);
    expect(groundAt(columns, 305, 20)).toBe(WORLD_HEIGHT - 400);
    expect(groundAt(columns, 2000, 20)).toBe(Infinity);
  });
});

describe('blockedX', () => {
  it('stops at a taller column', () => {
    const columns = twoColumns(200, 400);
    const ball = { x: 200, y: WORLD_HEIGHT - 200 - BALL_RADIUS, vy: 0 };
    expect(blockedX(columns, ball, 330)).toBeLessThan(columns[1].x);
  });

  it('lets the ball roll onto a lower column', () => {
    const columns = twoColumns(400, 200);
    const ball = { x: 200, y: WORLD_HEIGHT - 400 - BALL_RADIUS, vy: 0 };
    expect(blockedX(columns, ball, 330)).toBe(330);
  });
});

describe('stepBall', () => {
  it('falls onto the column below and rests there', () => {
    const columns = twoColumns(200, 200);
    const ball = { x: 150, y: 0, vy: 0 };
    for (let i = 0; i < 120; i++) stepBall(ball, columns, 0, 1);
    expect(ball.y).toBe(WORLD_HEIGHT - 200 - BALL_RADIUS);
    expect(ball.vy).toBe(0);
  });

  it('moves the same distance at any frame rate', () => {
    const columns = twoColumns(200, 200);
    const fast = { x: 100, y: WORLD_HEIGHT - 200 - BALL_RADIUS, vy: 0 };
    const slow = { ...fast };
    for (let i = 0; i < 4; i++) stepBall(fast, columns, 1, 0.5);
    stepBall(slow, columns, 1, 2);
    expect(fast.x).toBeCloseTo(slow.x);
  });

  it('stays inside the level', () => {
    const columns = twoColumns(200, 200);
    const ball = { x: 100, y: WORLD_HEIGHT - 200 - BALL_RADIUS, vy: 0 };
    for (let i = 0; i < 10; i++) stepBall(ball, columns, -1, 4);
    expect(ball.x).toBe(BALL_RADIUS);
  });
});
