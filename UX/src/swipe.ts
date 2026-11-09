/**
 * Horizontal swipe recognition as a pure state machine over Pointer Events, so the gesture rules can
 * be unit-tested without a DOM. The component only forwards pointerdown/up/cancel to these functions.
 */

export type SwipeDirection = 'left' | 'right';

export interface SwipePointer {
  pointerId: number;
  x: number;
  y: number;
  /** `PointerEvent.pointerType`: 'mouse' | 'pen' | 'touch'. */
  pointerType: string;
  /** `PointerEvent.isPrimary`: false for every finger after the first one on screen. */
  isPrimary: boolean;
}

export interface SwipeState {
  /** Pointer being tracked; null while idle or after the gesture was aborted. */
  pointerId: number | null;
  startX: number;
  startY: number;
}

export const IDLE_SWIPE: SwipeState = Object.freeze({ pointerId: null, startX: 0, startY: 0 });

/** Long enough to rule out a shaky tap, short enough to work on a 320px screen. */
export const SWIPE_THRESHOLD_PX = 48;

/** A mouse drag is text selection or drag-and-drop, never a swipe. */
function canSwipe(pointerType: string): boolean {
  return pointerType === 'touch' || pointerType === 'pen';
}

export function swipeDirection(dx: number, dy: number): SwipeDirection | null {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return null;
  if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return null;
  // Equal travel on both axes is a scroll attempt, not a swipe.
  if (Math.abs(dx) <= Math.abs(dy)) return null;
  return dx < 0 ? 'left' : 'right';
}

export function beginSwipe(state: SwipeState, pointer: SwipePointer): SwipeState {
  if (!canSwipe(pointer.pointerType)) return state;
  // A second finger means pinch or two-thumb scrolling: abort instead of guessing.
  if (!pointer.isPrimary) return IDLE_SWIPE;
  // A primary pointer always starts a fresh gesture, even if the previous pointerup never arrived
  // (Chrome swallows it when a tap interrupts a fling).
  return { pointerId: pointer.pointerId, startX: pointer.x, startY: pointer.y };
}

export function endSwipe(
  state: SwipeState,
  pointer: SwipePointer,
): { state: SwipeState; direction: SwipeDirection | null } {
  if (state.pointerId === null || state.pointerId !== pointer.pointerId) return { state, direction: null };
  return { state: IDLE_SWIPE, direction: swipeDirection(pointer.x - state.startX, pointer.y - state.startY) };
}

/** `pointercancel` (browser took over for scrolling) always drops the gesture. */
export function cancelSwipe(): SwipeState {
  return IDLE_SWIPE;
}
