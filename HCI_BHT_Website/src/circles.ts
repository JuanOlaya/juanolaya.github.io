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
  const dx = x - (TRIGGER.xPercent * width) / 100;
  const dy = y - (TRIGGER.yPercent * height) / 100;
  return Math.hypot(dx, dy) < TRIGGER.radius;
}

/** Diameter lost per 60 FPS frame once the circles start shrinking. */
export const SHRINK_PER_FRAME = 1;

/** One shrink step worth `frames` 60 FPS frames (see `frameScale`); never below zero. */
export function shrink(diameter: number, frames = 1): number {
  return Math.max(0, diameter - SHRINK_PER_FRAME * frames);
}

/** Canvas position of a circle given as percentages of the canvas size. */
export function circleCenter(circle: Circle, width: number, height: number): { x: number; y: number } {
  return { x: (circle.xPercent * width) / 100, y: (circle.yPercent * height) / 100 };
}
