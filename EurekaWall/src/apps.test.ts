import { describe, expect, it } from 'vitest';
import { advanceCycle, CYCLE_MS, selectApp, stepSelection, WALL_APPS } from './apps.ts';

describe('stepSelection', () => {
  it('wraps forwards and backwards', () => {
    expect(stepSelection(4, 1, 5)).toBe(0);
    expect(stepSelection(0, -1, 5)).toBe(4);
    expect(stepSelection(2, 1, 5)).toBe(3);
  });

  it('returns 0 for an empty list', () => {
    expect(stepSelection(3, 1, 0)).toBe(0);
  });
});

describe('advanceCycle', () => {
  it('keeps the selection until the interval is over', () => {
    expect(advanceCycle({ selected: 1, elapsedMs: 0 }, CYCLE_MS - 1, 5)).toEqual({
      selected: 1,
      elapsedMs: CYCLE_MS - 1,
    });
  });

  it('moves one step and restarts the timer', () => {
    expect(advanceCycle({ selected: 4, elapsedMs: CYCLE_MS - 10 }, 20, 5)).toEqual({
      selected: 0,
      elapsedMs: 0,
    });
  });

  it('never skips more than one tool after a long pause', () => {
    expect(advanceCycle({ selected: 0, elapsedMs: 0 }, CYCLE_MS * 5, 5).selected).toBe(1);
  });

  it('ignores negative deltas', () => {
    expect(advanceCycle({ selected: 0, elapsedMs: 100 }, -50, 5).elapsedMs).toBe(100);
  });
});

describe('selectApp', () => {
  it('restarts the timer on the chosen tool', () => {
    expect(selectApp(7, 5)).toEqual({ selected: 2, elapsedMs: 0 });
  });
});

describe('WALL_APPS', () => {
  it('keeps the five tools and only links YouTube externally', () => {
    expect(WALL_APPS.map((app) => app.title)).toEqual([
      'Introduction',
      'MuseFlow',
      'SwarmCanvas',
      'Balcondipity',
      'ShapyPresence',
    ]);
    expect(WALL_APPS.filter((app) => app.external).map((app) => new URL(app.href).hostname)).toEqual([
      'www.youtube.com',
    ]);
  });
});
