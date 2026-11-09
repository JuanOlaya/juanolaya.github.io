import { describe, expect, it } from 'vitest';
import { tabIndexAfterKey, tabIndexAfterSwipe } from './tab-gestures';

describe('tabIndexAfterSwipe', () => {
  it('moves to the neighbour tab: swipe left reveals the next one, swipe right the previous', () => {
    expect(tabIndexAfterSwipe('left', 1, 5)).toBe(2);
    expect(tabIndexAfterSwipe('right', 1, 5)).toBe(0);
  });

  it('stops at both ends instead of wrapping, unlike the keyboard', () => {
    expect(tabIndexAfterSwipe('left', 4, 5)).toBeNull();
    expect(tabIndexAfterSwipe('right', 0, 5)).toBeNull();
  });

  it('returns null without a direction, with no tabs or with a corrupt index', () => {
    expect(tabIndexAfterSwipe(null, 2, 5)).toBeNull();
    expect(tabIndexAfterSwipe('left', 0, 0)).toBeNull();
    expect(tabIndexAfterSwipe('left', -1, 5)).toBeNull();
    expect(tabIndexAfterSwipe('left', 9, 5)).toBeNull();
  });
});

describe('tabIndexAfterKey', () => {
  it('wraps with the arrow keys at both ends', () => {
    expect(tabIndexAfterKey('ArrowRight', 4, 5)).toBe(0);
    expect(tabIndexAfterKey('ArrowLeft', 0, 5)).toBe(4);
  });

  it('ignores keys that are not tablist navigation', () => {
    expect(tabIndexAfterKey('Tab', 0, 5)).toBeNull();
    expect(tabIndexAfterKey('Enter', 0, 5)).toBeNull();
  });
});
