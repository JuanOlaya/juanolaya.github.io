import {
  type Column,
  type PlatformSpec,
  columnIndexAt,
  columnTop,
  layoutColumns,
  stepColumn,
} from './columns.ts';
import { BALL_RADIUS, type Ball, type Direction, stepBall } from './player.ts';
import { type Rating, dueProbe, probeColumns } from './probes.ts';

export interface Game {
  columns: Column[];
  ball: Ball;
  /** Furthest column reached; each new one is a point. */
  reached: number;
  probes: number[];
  answers: Rating[];
  /** A thought probe is waiting for an answer; the game holds still meanwhile. */
  probing: boolean;
  finished: boolean;
  elapsedMs: number;
}

export function createGame(specs: readonly PlatformSpec[]): Game {
  const columns = layoutColumns(specs);
  const first = columns[0];
  const ball = first
    ? { x: first.x + first.width / 2, y: columnTop(first) - BALL_RADIUS, vy: 0 }
    : { x: 0, y: 0, vy: 0 };
  return {
    columns,
    ball,
    reached: 0,
    probes: probeColumns(columns.length),
    answers: [],
    probing: false,
    finished: columns.length === 0,
    elapsedMs: 0,
  };
}

/** Advances the game by `frames` 60 FPS frames (`ms` real time) unless it waits for a probe or has ended. */
export function stepGame(game: Game, direction: Direction, frames: number, ms: number): void {
  if (game.probing || game.finished) return;
  game.elapsedMs += ms;
  for (const column of game.columns) stepColumn(column, frames);
  stepBall(game.ball, game.columns, direction, frames);
  game.reached = Math.max(game.reached, columnIndexAt(game.columns, game.ball.x));
  if (game.reached >= game.columns.length - 1) game.finished = true;
  else if (dueProbe(game.probes, game.answers.length, game.reached) !== undefined) game.probing = true;
}

export function answerProbe(game: Game, rating: Rating): void {
  if (!game.probing) return;
  game.answers.push(rating);
  game.probing = false;
}

/** 0 at the start, 1 at the goal flag. */
export function progress(game: Game): number {
  return game.columns.length > 1 ? game.reached / (game.columns.length - 1) : 1;
}
