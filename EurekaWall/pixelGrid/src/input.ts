import type { Point } from './grid.ts';

/** Width of the eraser handle along the left edge of the canvas, in CSS px. */
export const ERASER_STRIP_PX = 28;

export interface PointerAction {
  type: 'down' | 'move' | 'up' | 'cancel';
  id: number;
  x: number;
  y: number;
}

export interface PointerState {
  pointers: ReadonlyMap<number, Point>;
  /** Set once a single pointer touches the strip; cleared when every pointer is gone. */
  erasing: boolean;
}

export type PointerIntent =
  | { kind: 'paint'; x: number; y: number }
  | { kind: 'pinch'; a: Point; b: Point }
  | { kind: 'erase'; x: number }
  | { kind: 'release' };

export interface PointerResult {
  state: PointerState;
  intent: PointerIntent | null;
}

export function createPointerState(): PointerState {
  return { pointers: new Map(), erasing: false };
}

function unchanged(state: PointerState): PointerResult {
  return { state, intent: null };
}

function withPointer(state: PointerState, action: PointerAction): ReadonlyMap<number, Point> {
  const pointers = new Map(state.pointers);
  pointers.set(action.id, { x: action.x, y: action.y });
  return pointers;
}

/** What the pointers mean now: one paints (or erases from the strip), two pinch, more do nothing. */
function intentFor(pointers: ReadonlyMap<number, Point>, erasing: boolean, moved: Point): PointerResult {
  const state = { pointers, erasing };
  if (pointers.size === 1) {
    return { state, intent: erasing ? { kind: 'erase', x: moved.x } : { kind: 'paint', x: moved.x, y: moved.y } };
  }
  if (pointers.size === 2 && !erasing) {
    const [a, b] = pointers.values();
    return { state, intent: { kind: 'pinch', a, b } };
  }
  return unchanged(state);
}

function press(state: PointerState, action: PointerAction, stripWidth: number): PointerResult {
  const pointers = withPointer(state, action);
  const erasing = state.erasing || (pointers.size === 1 && action.x < stripWidth);
  return intentFor(pointers, erasing, action);
}

function lift(state: PointerState, action: PointerAction): PointerResult {
  const pointers = new Map(state.pointers);
  pointers.delete(action.id);
  if (pointers.size > 0) return unchanged({ pointers, erasing: state.erasing });
  return { state: createPointerState(), intent: { kind: 'release' } };
}

/**
 * Folds one pointer event into the state. Pointers that never pressed (hover) are ignored, and `cancel`
 * behaves exactly like `up`, so an interrupted touch never leaves a finger or the eraser "stuck".
 */
export function reducePointer(
  state: PointerState,
  action: PointerAction,
  stripWidth = ERASER_STRIP_PX,
): PointerResult {
  if (!Number.isFinite(action.x) || !Number.isFinite(action.y)) return unchanged(state);
  if (action.type === 'down') return press(state, action, stripWidth);
  if (!state.pointers.has(action.id)) return unchanged(state);
  if (action.type !== 'move') return lift(state, action);
  return press(state, action, stripWidth);
}
