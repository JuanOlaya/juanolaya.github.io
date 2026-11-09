import { describe, expect, it } from 'vitest';
import {
  ERASER_STRIP_PX,
  createPointerState,
  reducePointer,
  type PointerAction,
  type PointerState,
} from './input.ts';

function run(actions: PointerAction[], start: PointerState = createPointerState()) {
  const intents = [];
  let state = start;
  for (const action of actions) {
    const result = reducePointer(state, action);
    state = result.state;
    intents.push(result.intent);
  }
  return { state, intents };
}

const down = (id: number, x: number, y: number): PointerAction => ({ type: 'down', id, x, y });
const move = (id: number, x: number, y: number): PointerAction => ({ type: 'move', id, x, y });
const up = (id: number, x = 0, y = 0): PointerAction => ({ type: 'up', id, x, y });
const cancel = (id: number, x = 0, y = 0): PointerAction => ({ type: 'cancel', id, x, y });

describe('single pointer', () => {
  it('paints on press and while dragging, then releases', () => {
    const { state, intents } = run([down(1, 100, 100), move(1, 110, 100), up(1)]);
    expect(intents).toEqual([
      { kind: 'paint', x: 100, y: 100 },
      { kind: 'paint', x: 110, y: 100 },
      { kind: 'release' },
    ]);
    expect(state.pointers.size).toBe(0);
    expect(state.erasing).toBe(false);
  });

  it('ignores moves, ups and cancels of pointers that never pressed (hover)', () => {
    const start = createPointerState();
    for (const action of [move(7, 10, 10), up(7), cancel(7)]) {
      const result = reducePointer(start, action);
      expect(result.intent).toBeNull();
      expect(result.state).toBe(start);
    }
  });

  it('does not mutate the previous state', () => {
    const start = createPointerState();
    reducePointer(start, down(1, 100, 100));
    expect(start.pointers.size).toBe(0);
  });
});

describe('two or more pointers', () => {
  it('turns a second pointer into a pinch and stops painting', () => {
    const { intents } = run([down(1, 100, 100), down(2, 104, 102), move(2, 106, 103)]);
    expect(intents[1]).toEqual({ kind: 'pinch', a: { x: 100, y: 100 }, b: { x: 104, y: 102 } });
    expect(intents[2]).toEqual({ kind: 'pinch', a: { x: 100, y: 100 }, b: { x: 106, y: 103 } });
  });

  it('does nothing with three pointers, and resumes pinching when one lifts', () => {
    const { intents } = run([down(1, 100, 100), down(2, 101, 101), down(3, 102, 102), move(3, 103, 103), up(3), move(1, 105, 105)]);
    expect(intents[2]).toBeNull();
    expect(intents[3]).toBeNull();
    expect(intents[4]).toBeNull();
    expect(intents[5]).toEqual({ kind: 'pinch', a: { x: 105, y: 105 }, b: { x: 101, y: 101 } });
  });

  it('goes back to painting with the pointer that stays down', () => {
    const { state, intents } = run([down(1, 100, 100), down(2, 101, 101), up(2), move(1, 109, 109)]);
    expect(intents[2]).toBeNull();
    expect(intents[3]).toEqual({ kind: 'paint', x: 109, y: 109 });
    expect(state.pointers.size).toBe(1);
  });

  it('releases only when the last pointer lifts', () => {
    const { intents } = run([down(1, 100, 100), down(2, 101, 101), up(1), up(2)]);
    expect(intents[2]).toBeNull();
    expect(intents[3]).toEqual({ kind: 'release' });
  });
});

describe('eraser strip', () => {
  const inStrip = ERASER_STRIP_PX - 1;

  it('starts erasing from a press inside the strip and keeps erasing outside it', () => {
    const { state, intents } = run([down(1, inStrip, 50), move(1, 300, 60)]);
    expect(intents).toEqual([
      { kind: 'erase', x: inStrip },
      { kind: 'erase', x: 300 },
    ]);
    expect(state.erasing).toBe(true);
  });

  it('starts erasing when a drag enters the strip', () => {
    const { intents } = run([down(1, 200, 50), move(1, inStrip, 50), move(1, 400, 50)]);
    expect(intents[0]).toEqual({ kind: 'paint', x: 200, y: 50 });
    expect(intents[1]).toEqual({ kind: 'erase', x: inStrip });
    expect(intents[2]).toEqual({ kind: 'erase', x: 400 });
  });

  it('stops erasing on release', () => {
    const { state, intents } = run([down(1, inStrip, 50), up(1), down(1, 200, 50)]);
    expect(intents[1]).toEqual({ kind: 'release' });
    expect(intents[2]).toEqual({ kind: 'paint', x: 200, y: 50 });
    expect(state.erasing).toBe(false);
  });

  it('never pinches while erasing', () => {
    const { intents } = run([down(1, inStrip, 50), down(2, 100, 100), move(2, 101, 101)]);
    expect(intents[1]).toBeNull();
    expect(intents[2]).toBeNull();
  });

  it('respects a custom strip width', () => {
    const { intent } = reducePointer(createPointerState(), down(1, 40, 10), 60);
    expect(intent).toEqual({ kind: 'erase', x: 40 });
  });
});

describe('pointercancel', () => {
  it('clears a cancelled drag so nothing stays pressed', () => {
    const { state, intents } = run([down(1, 100, 100), move(1, 120, 100), cancel(1)]);
    expect(intents[2]).toEqual({ kind: 'release' });
    expect(state.pointers.size).toBe(0);
  });

  it('clears a cancelled eraser drag', () => {
    const { state } = run([down(1, 1, 1), cancel(1)]);
    expect(state.erasing).toBe(false);
  });

  it('keeps the other pointer when one of two is cancelled', () => {
    const { state, intents } = run([down(1, 100, 100), down(2, 101, 101), cancel(2), move(1, 103, 103)]);
    expect(state.pointers.size).toBe(1);
    expect(intents[3]).toEqual({ kind: 'paint', x: 103, y: 103 });
  });

  it('ignores a cancel for a pointer that was already lifted', () => {
    const after = run([down(1, 100, 100), up(1)]).state;
    const result = reducePointer(after, cancel(1));
    expect(result.intent).toBeNull();
    expect(result.state).toBe(after);
  });
});

describe('bad coordinates', () => {
  it('drops presses with non-finite coordinates', () => {
    const start = createPointerState();
    const result = reducePointer(start, down(1, Number.NaN, 10));
    expect(result.intent).toBeNull();
    expect(result.state).toBe(start);
  });
});
