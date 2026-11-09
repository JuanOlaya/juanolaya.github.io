/** The subset of `MediaQueryList` the page needs, so tests can pass a fake. */
export interface MotionQuery {
  readonly matches: boolean;
  addEventListener(type: 'change', listener: (event: { matches: boolean }) => void): void;
  removeEventListener(type: 'change', listener: (event: { matches: boolean }) => void): void;
}

/** STYLE-CONTRACT §7: 200ms by default, no motion at all when the user asks for less. */
export function animationDurationMs(reduceMotion: boolean): number {
  return reduceMotion ? 0 : 200;
}

export function reducedMotionQuery(): MotionQuery {
  return window.matchMedia('(prefers-reduced-motion: reduce)');
}

/** Reports the preference now and whenever it changes; returns the unsubscribe function. */
export function watchReducedMotion(query: MotionQuery, onChange: (reduce: boolean) => void): () => void {
  const listener = (event: { matches: boolean }): void => onChange(event.matches);
  onChange(query.matches);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}
