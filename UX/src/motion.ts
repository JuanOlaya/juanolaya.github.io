/**
 * Reduced-motion decisions for the TypeScript side. CSS animations are already switched off by the
 * `prefers-reduced-motion` block in style.css; these helpers cover what CSS cannot see.
 */

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type MatchMedia = (query: string) => {
  matches: boolean;
  addEventListener(type: 'change', listener: (event: { matches: boolean }) => void): void;
  removeEventListener(type: 'change', listener: (event: { matches: boolean }) => void): void;
};

export function animationClass(reduced: boolean, className: string): string {
  return reduced ? '' : className;
}

export function scrollBehaviorFor(reduced: boolean): ScrollBehavior {
  return reduced ? 'auto' : 'smooth';
}

/**
 * Calls `onChange` with the current preference and again on every change; returns a disposer.
 * Without `matchMedia` (very old browsers, unit tests) motion is assumed allowed, as CSS would.
 */
export function watchReducedMotion(
  onChange: (reduced: boolean) => void,
  matchMedia: MatchMedia | undefined = globalThis.matchMedia?.bind(globalThis),
): () => void {
  if (!matchMedia) {
    onChange(false);
    return () => {};
  }
  const media = matchMedia(REDUCED_MOTION_QUERY);
  const listener = (event: { matches: boolean }) => onChange(event.matches);
  onChange(media.matches);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}
