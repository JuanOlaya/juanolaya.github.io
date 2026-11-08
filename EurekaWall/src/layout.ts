export interface Point {
  x: number;
  y: number;
}

export interface WheelLayout {
  /** Centre of the half wheel; the description band starts here. */
  pivot: Point;
  radius: number;
  buttons: readonly Point[];
  buttonDiameter: number;
  start: { x: number; y: number; width: number; height: number };
}

const PIVOT_Y_RATIO = 0.74;
// Leaves room on both sides for the outer buttons and their selection ring.
const RADIUS_WIDTH_RATIO = 0.36;
const RADIUS_HEIGHT_RATIO = 0.5;
const MAX_RADIUS = 520;
const MIN_BUTTON = 52;
const MAX_BUTTON = 120;
// Spread of the buttons over the upper half circle, in radians from the left horizontal.
const ARC_MARGIN = Math.PI / 12;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** The original fixed 1920×1080 wheel, scaled to any window. */
export function wheelLayout(width: number, height: number, count: number): WheelLayout {
  const pivot = { x: width / 2, y: height * PIVOT_Y_RATIO };
  const radius = Math.min(width * RADIUS_WIDTH_RATIO, height * RADIUS_HEIGHT_RATIO, MAX_RADIUS);
  const buttonDiameter = clamp(radius * 0.32, MIN_BUTTON, MAX_BUTTON);
  const span = Math.PI - 2 * ARC_MARGIN;
  const buttons = Array.from({ length: count }, (_, i) => {
    const angle = Math.PI + ARC_MARGIN + (count === 1 ? span / 2 : (span * i) / (count - 1));
    return { x: pivot.x + radius * Math.cos(angle), y: pivot.y + radius * Math.sin(angle) };
  });
  const startWidth = clamp(radius * 0.55, 110, 150);
  const start = { x: pivot.x, y: pivot.y - radius * 0.3, width: startWidth, height: startWidth * 0.4 };
  return { pivot, radius, buttons, buttonDiameter, start };
}

/** Index of the button under (x, y), or -1. */
export function buttonAt(layout: WheelLayout, x: number, y: number): number {
  const reach = layout.buttonDiameter / 2;
  return layout.buttons.findIndex((b) => Math.hypot(b.x - x, b.y - y) <= reach);
}

export function isOnStart(layout: WheelLayout, x: number, y: number): boolean {
  const { start } = layout;
  return Math.abs(x - start.x) <= start.width / 2 && Math.abs(y - start.y) <= start.height / 2;
}

/** Eases `current` toward `target`; `frames` is the delta-time frame scale (1 at 60 FPS). */
export function approach(current: number, target: number, frames: number, rate = 0.18): number {
  const keep = Math.pow(1 - rate, Math.max(0, frames));
  return target + (current - target) * keep;
}
