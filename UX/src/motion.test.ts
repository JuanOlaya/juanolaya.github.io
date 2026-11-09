import { describe, expect, it } from 'vitest';
import { REDUCED_MOTION_QUERY, animationClass, scrollBehaviorFor, watchReducedMotion } from './motion';

type Listener = (event: { matches: boolean }) => void;

/** Minimal matchMedia double: records the query and lets the test flip the preference. */
function fakeMatchMedia(initial: boolean) {
  const listeners = new Set<Listener>();
  const queries: string[] = [];
  const list = {
    matches: initial,
    addEventListener: (_type: 'change', listener: Listener) => listeners.add(listener),
    removeEventListener: (_type: 'change', listener: Listener) => listeners.delete(listener),
  };
  const matchMedia = (query: string) => {
    queries.push(query);
    return list;
  };
  const flip = (matches: boolean) => {
    list.matches = matches;
    for (const listener of listeners) listener({ matches });
  };
  return { matchMedia, flip, queries, listeners };
}

describe('animationClass', () => {
  it('drops the animation class when the visitor prefers reduced motion', () => {
    expect(animationClass(true, 'fade-in')).toBe('');
    expect(animationClass(false, 'fade-in')).toBe('fade-in');
  });
});

describe('scrollBehaviorFor', () => {
  it('scrolls instantly under reduced motion and smoothly otherwise', () => {
    expect(scrollBehaviorFor(true)).toBe('auto');
    expect(scrollBehaviorFor(false)).toBe('smooth');
  });
});

describe('watchReducedMotion', () => {
  it('reads the preference at start and follows later changes', () => {
    const media = fakeMatchMedia(false);
    const seen: boolean[] = [];
    watchReducedMotion((reduced) => seen.push(reduced), media.matchMedia);
    expect(media.queries).toEqual([REDUCED_MOTION_QUERY]);
    media.flip(true);
    media.flip(false);
    expect(seen).toEqual([false, true, false]);
  });

  it('stops listening once disposed', () => {
    const media = fakeMatchMedia(true);
    const seen: boolean[] = [];
    const stop = watchReducedMotion((reduced) => seen.push(reduced), media.matchMedia);
    stop();
    media.flip(false);
    expect(seen).toEqual([true]);
    expect(media.listeners.size).toBe(0);
  });

  it('assumes no reduction when matchMedia is missing (old browsers, tests)', () => {
    const seen: boolean[] = [];
    const stop = watchReducedMotion((reduced) => seen.push(reduced), undefined);
    expect(seen).toEqual([false]);
    expect(() => stop()).not.toThrow();
  });
});
