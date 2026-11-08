import { describe, expect, it } from 'vitest';
import { answerProbe, createGame, progress, stepGame } from './game.ts';

const flat = Array.from({ length: 5 }, () => ({ width: 300, speed: 0 }));

describe('game', () => {
  it('pauses for a probe halfway and resumes after the answer', () => {
    const game = createGame(flat);
    expect(game.probes).toEqual([2]);
    for (let i = 0; i < 400 && !game.probing; i++) stepGame(game, 1, 1, 16);
    expect(game.probing).toBe(true);
    expect(game.reached).toBe(2);
    const x = game.ball.x;
    stepGame(game, 1, 1, 16);
    expect(game.ball.x).toBe(x);
    answerProbe(game, 4);
    expect(game.answers).toEqual([4]);
    for (let i = 0; i < 400 && !game.finished; i++) stepGame(game, 1, 1, 16);
    expect(game.finished).toBe(true);
    expect(progress(game)).toBe(1);
  });

  it('ends at once for an empty level', () => {
    expect(createGame([]).finished).toBe(true);
  });
});
