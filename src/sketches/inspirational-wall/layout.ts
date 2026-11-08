export interface Point {
  x: number;
  y: number;
}

export const PIXEL_SIZE = 50;
const PIXEL_GAP = 7;
const SHAPE_BAR_GAP = 12;
const TOOLBAR_BUTTON_RADIUS = 29;

export type ToolbarButton =
  | 'trace'
  | 'pause'
  | 'cross'
  | 'rect'
  | 'line'
  | 'speedUp'
  | 'speedDown'
  | 'amountUp'
  | 'amountDown'
  | 'print';

/** Bottom toolbar of the generative-art screen, left to right, with the x of each circle. */
const TOOLBAR: readonly (readonly [ToolbarButton, number])[] = [
  ['trace', 50],
  ['pause', 120],
  ['cross', 190],
  ['rect', 260],
  ['line', 330],
  ['speedUp', 400],
  ['speedDown', 470],
  ['amountUp', 540],
  ['amountDown', 610],
  ['print', 680],
];

/** Same formula as p5's `dist()`. */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

/**
 * Pixel centres of the painting grid. The original starts the rows at `width / 25` (not height);
 * it stays that way so both pages keep their exact layout.
 */
export function pixelGridPositions(width: number, height: number, size = PIXEL_SIZE): Point[] {
  const maxX = Math.round(38 * (width / 40));
  const maxY = Math.round(36 * (height / 40));
  const step = size + PIXEL_GAP;
  const positions: Point[] = [];
  for (let x = width / 18; x < maxX; x = x + step) {
    for (let y = width / 25; y < maxY; y = y + step) {
      positions.push({ x, y });
    }
  }
  return positions;
}

/** X of the n-th slot of the colour/shape bar at the bottom of the painting screen. */
export function shapeBarX(slot: number, width: number, size = PIXEL_SIZE): number {
  return width / 25 + (size * slot + SHAPE_BAR_GAP * slot);
}

/** Bottom-right corner that returns to the menu from the painting and generative-art screens. */
export function isInHomeCorner(x: number, y: number, width: number, height: number): boolean {
  return x > width - height / 6 && x < width && y > (10 * height) / 12 && y < height;
}

export function toolbarButtonAt(x: number, y: number, height: number): ToolbarButton | undefined {
  const hit = TOOLBAR.find(([, cx]) => distance(cx, height - 50, x, y) < TOOLBAR_BUTTON_RADIUS);
  return hit?.[0];
}

/** A two-finger pinch on a pixel cycles its shape through 1→2→3→4→1. */
export function nextPinchedStatus(status: number): number {
  return status < 4 ? status + 1 : 1;
}
