/** Sharper than 1× on HiDPI screens, but never more than 2× pixels: 3× costs a lot for little gain. */
const MAX_PIXEL_DENSITY = 2;

export function pixelDensityFor(devicePixelRatio: number): number {
  if (!Number.isFinite(devicePixelRatio) || devicePixelRatio < 1) return 1;
  return Math.min(devicePixelRatio, MAX_PIXEL_DENSITY);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
