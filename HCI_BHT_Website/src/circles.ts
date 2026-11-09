export interface Circle {
  color: string;
  /** Centre as a percentage of the canvas size. */
  xPercent: number;
  yPercent: number;
}

export const CIRCLES: readonly Circle[] = [
  { color: '#E23C12', xPercent: 20, yPercent: 25 },
  { color: '#D10B5B', xPercent: 50, yPercent: 25 },
  { color: '#189CD8', xPercent: 20, yPercent: 55 },
  { color: '#BD320F', xPercent: 50, yPercent: 55 },
  { color: '#DE2697', xPercent: 20, yPercent: 85 },
];

/** Pressing near (80%, 43%) — where a sixth circle used to be drawn — makes all circles shrink away. */
const TRIGGER = { xPercent: 80, yPercent: 43, radius: 50 } as const;

export function isShrinkTrigger(x: number, y: number, width: number, height: number): boolean {
  const center = triggerCenter(width, height);
  return Math.hypot(x - center.x, y - center.y) < TRIGGER.radius;
}

/** Where the empty sixth spot is drawn, as a percentage of the canvas size. */
export function triggerCenter(width: number, height: number): { x: number; y: number } {
  return { x: (TRIGGER.xPercent * width) / 100, y: (TRIGGER.yPercent * height) / 100 };
}

export const TRIGGER_RADIUS = TRIGGER.radius;

// The original 80 px circle on a 1080 px tall screen; scaled with the short side, within bounds.
const DIAMETER_RATIO = 80 / 1080;
const MIN_DIAMETER = 40;
const MAX_DIAMETER = 120;

export function circleDiameter(width: number, height: number): number {
  return Math.min(MAX_DIAMETER, Math.max(MIN_DIAMETER, Math.min(width, height) * DIAMETER_RATIO));
}

/** Moves `progress` (0 = full circles, 1 = gone) toward `target`, covering the whole way in `duration` s. */
export function stepProgress(progress: number, target: number, seconds: number, duration: number): number {
  const step = seconds / duration;
  if (progress < target) return Math.min(target, progress + step);
  return Math.max(target, progress - step);
}

/** Slow start, slow end: the circles ease out of and back into view instead of shrinking linearly. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Canvas position of a circle given as percentages of the canvas size. */
export function circleCenter(circle: Circle, width: number, height: number): { x: number; y: number } {
  return { x: (circle.xPercent * width) / 100, y: (circle.yPercent * height) / 100 };
}

export interface ShrinkState {
  /** 0 = full circles, 1 = gone; eased on the way. */
  progress: number;
  target: number;
  paused: boolean;
  /** `prefers-reduced-motion: reduce`: the user asked for no unsolicited movement. */
  reduced: boolean;
}

// The original lost 1 px of an 80 px circle per frame: about 1.3 s at 60 FPS.
const SHRINK_SECONDS = 1.4;
// A tab coming back from the background reports one huge frame; it must not jump the animation.
const MAX_STEP_SECONDS = 0.05;

/** Progress for the next frame: eased toward the target, frozen while paused, instant under reduced motion. */
export function nextProgress(state: ShrinkState, seconds: number): number {
  if (state.reduced) return state.target;
  if (state.paused) return state.progress;
  return stepProgress(state.progress, state.target, Math.min(seconds, MAX_STEP_SECONDS), SHRINK_SECONDS);
}
