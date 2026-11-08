import { type Column, columnTop } from './columns.ts';

export const BALL_RADIUS = 40;
/** World units per 60 FPS frame, both ways. */
const ROLL_SPEED = 7;
const GRAVITY = 1.2;
const MAX_FALL_SPEED = 30;
/** The ball rolls onto a column that is at most this much higher than its bottom, like a small step. */
const STEP_UP = 6;
/** Part of the ball's width that rests on columns; the rounded edges hang over. */
const FOOT_RATIO = 0.6;

export interface Ball {
  x: number;
  y: number;
  vy: number;
}

/** -1 left, 0 still, 1 right. */
export type Direction = -1 | 0 | 1;

function overlaps(column: Column, left: number, right: number): boolean {
  return column.x < right && column.x + column.width > left;
}

/** Highest column top under the ball's footprint at `x` (smaller y is higher). */
export function groundAt(columns: readonly Column[], x: number, halfWidth: number): number {
  let ground = Infinity;
  for (const column of columns) {
    if (overlaps(column, x - halfWidth, x + halfWidth)) ground = Math.min(ground, columnTop(column));
  }
  return ground;
}

/** Where the ball can roll to: a column taller than the ball's bottom stops it like a wall. */
export function blockedX(columns: readonly Column[], ball: Ball, targetX: number): number {
  const bottom = ball.y + BALL_RADIUS;
  const reach = BALL_RADIUS * FOOT_RATIO;
  let x = targetX;
  for (const column of columns) {
    const wasTouching = overlaps(column, ball.x - reach, ball.x + reach);
    if (wasTouching || !overlaps(column, x - reach, x + reach)) continue;
    if (columnTop(column) >= bottom - STEP_UP) continue;
    x = targetX > ball.x ? Math.min(x, column.x - reach) : Math.max(x, column.x + column.width + reach);
  }
  return x;
}

/** Rolls and drops the ball by `frames` 60 FPS frames; it never leaves the level's first or last column. */
export function stepBall(ball: Ball, columns: readonly Column[], direction: Direction, frames: number): void {
  if (columns.length === 0) return;
  const last = columns[columns.length - 1];
  const target = ball.x + direction * ROLL_SPEED * frames;
  const clamped = Math.min(Math.max(target, columns[0].x + BALL_RADIUS), last.x + last.width - BALL_RADIUS);
  ball.x = blockedX(columns, ball, clamped);

  ball.vy = Math.min(ball.vy + GRAVITY * frames, MAX_FALL_SPEED);
  ball.y += ball.vy * frames;
  const ground = groundAt(columns, ball.x, BALL_RADIUS * FOOT_RATIO);
  if (ball.y + BALL_RADIUS >= ground) {
    ball.y = ground - BALL_RADIUS;
    ball.vy = 0;
  }
}
