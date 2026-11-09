import { describe, expect, it } from 'vitest';
import {
  IDLE_SWIPE,
  SWIPE_THRESHOLD_PX,
  beginSwipe,
  cancelSwipe,
  endSwipe,
  swipeDirection,
  type SwipePointer,
} from './swipe';

function touch(pointerId: number, x: number, y: number, pointerType = 'touch'): SwipePointer {
  return { pointerId, x, y, pointerType, isPrimary: true };
}

function secondFinger(pointerId: number, x: number, y: number): SwipePointer {
  return { ...touch(pointerId, x, y), isPrimary: false };
}

describe('swipeDirection', () => {
  it('recognises a swipe exactly at the threshold and rejects one pixel less', () => {
    expect(swipeDirection(-SWIPE_THRESHOLD_PX, 0)).toBe('left');
    expect(swipeDirection(SWIPE_THRESHOLD_PX, 0)).toBe('right');
    expect(swipeDirection(SWIPE_THRESHOLD_PX - 1, 0)).toBeNull();
    expect(swipeDirection(-(SWIPE_THRESHOLD_PX - 1), 0)).toBeNull();
  });

  it('ignores gestures that are more vertical than horizontal', () => {
    expect(swipeDirection(60, 60)).toBeNull();
    expect(swipeDirection(60, 61)).toBeNull();
    expect(swipeDirection(60, 59)).toBe('right');
    expect(swipeDirection(-80, 300)).toBeNull();
  });

  it('returns null for zero movement and corrupt coordinates', () => {
    expect(swipeDirection(0, 0)).toBeNull();
    expect(swipeDirection(Number.NaN, 0)).toBeNull();
    expect(swipeDirection(100, Number.NaN)).toBeNull();
    expect(swipeDirection(Number.POSITIVE_INFINITY, 0)).toBeNull();
  });
});

describe('swipe state machine', () => {
  it('tracks one touch pointer from down to up and reports the direction', () => {
    const tracking = beginSwipe(IDLE_SWIPE, touch(1, 200, 100));
    expect(tracking.pointerId).toBe(1);
    const { state, direction } = endSwipe(tracking, touch(1, 100, 110));
    expect(direction).toBe('left');
    expect(state).toEqual(IDLE_SWIPE);
  });

  it('ignores mouse pointers so text selection and drag-and-drop keep working', () => {
    expect(beginSwipe(IDLE_SWIPE, touch(1, 0, 0, 'mouse'))).toEqual(IDLE_SWIPE);
    expect(beginSwipe(IDLE_SWIPE, touch(1, 0, 0, 'pen')).pointerId).toBe(1);
  });

  it('aborts the gesture when a second pointer goes down (pinch, two thumbs)', () => {
    const first = beginSwipe(IDLE_SWIPE, touch(1, 200, 100));
    const aborted = beginSwipe(first, secondFinger(2, 50, 100));
    expect(aborted).toEqual(IDLE_SWIPE);
    expect(endSwipe(aborted, touch(1, 0, 100)).direction).toBeNull();
    expect(endSwipe(aborted, secondFinger(2, 400, 100)).direction).toBeNull();
  });

  it('lets a new primary pointer replace a stale gesture whose pointerup never arrived', () => {
    const stale = beginSwipe(IDLE_SWIPE, touch(1, 900, 100));
    const fresh = beginSwipe(stale, touch(2, 200, 100));
    expect(fresh.pointerId).toBe(2);
    expect(endSwipe(fresh, touch(2, 100, 100)).direction).toBe('left');
  });

  it('only ends on the pointer it is tracking', () => {
    const tracking = beginSwipe(IDLE_SWIPE, touch(7, 200, 100));
    const other = endSwipe(tracking, touch(8, 0, 100));
    expect(other.direction).toBeNull();
    expect(other.state).toBe(tracking);
    expect(endSwipe(tracking, touch(7, 300, 100)).direction).toBe('right');
  });

  it('pointercancel clears the state so the next gesture starts clean', () => {
    beginSwipe(IDLE_SWIPE, touch(1, 200, 100));
    const cleared = cancelSwipe();
    expect(cleared).toEqual(IDLE_SWIPE);
    expect(endSwipe(cleared, touch(1, 0, 100)).direction).toBeNull();
    expect(beginSwipe(cleared, touch(1, 10, 10)).pointerId).toBe(1);
  });

  it('ending while idle changes nothing', () => {
    expect(endSwipe(IDLE_SWIPE, touch(1, 500, 0))).toEqual({ state: IDLE_SWIPE, direction: null });
  });
});
