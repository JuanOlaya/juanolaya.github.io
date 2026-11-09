import { nextTabIndex } from '@shared/components/tab-navigation';
import type { SwipeDirection } from './swipe';

/**
 * Swipe stops at the ends: wrapping would make a swipe past the last tab jump back to the first,
 * which feels like a mistake on touch. Arrow keys keep the tablist convention of wrapping.
 */
export function tabIndexAfterSwipe(
  direction: SwipeDirection | null,
  current: number,
  count: number,
): number | null {
  if (direction === null || count <= 0 || current < 0 || current >= count) return null;
  const next = direction === 'left' ? current + 1 : current - 1;
  return next >= 0 && next < count ? next : null;
}

export function tabIndexAfterKey(key: string, current: number, count: number): number | null {
  return nextTabIndex(key, current, count);
}
