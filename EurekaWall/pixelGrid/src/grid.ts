import { BACKGROUNDS, PAINT_COLORS } from './palette.ts';

export const SHAPE_COUNT = 12;
/** Colour index that means "painted with the background": the cell looks empty on any background. */
export const BACKGROUND_COLOR = PAINT_COLORS.length;
/** Cells are touch targets, so they stay at least 44 CSS px on any screen: fewer columns, never smaller cells. */
export const CELL_PX = 48;
export const GAP_PX = 8;
const MARGIN_PX = 12;
/** A painted cell bulges briefly so a tap gets visible feedback. */
export const POP_MS = 200;
const POP_SCALE = 0.18;

export interface Cell {
  shape: number;
  color: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface GridLayout {
  cols: number;
  rows: number;
  cellSize: number;
  gap: number;
  /** Centre of the first cell. */
  originX: number;
  originY: number;
}

export interface Grid {
  layout: GridLayout;
  cells: Cell[];
}

/** Tracks the last cell a pointer touched, so holding still over a cell changes it only once. */
export interface Stroke {
  lastCell: number;
}

const EMPTY_LAYOUT: GridLayout = { cols: 0, rows: 0, cellSize: CELL_PX, gap: GAP_PX, originX: 0, originY: 0 };

function countAlong(length: number): number {
  if (!Number.isFinite(length)) return 0;
  return Math.max(0, Math.floor((length - 2 * MARGIN_PX + GAP_PX) / (CELL_PX + GAP_PX)));
}

/** As many 48 px cells as fit, centred; `leftInset` reserves the eraser strip along the left edge. */
export function layoutGrid(width: number, height: number, leftInset = 0): GridLayout {
  const cols = countAlong(width - leftInset);
  const rows = countAlong(height);
  if (cols === 0 || rows === 0) return EMPTY_LAYOUT;
  const pitch = CELL_PX + GAP_PX;
  const usedWidth = cols * pitch - GAP_PX;
  const usedHeight = rows * pitch - GAP_PX;
  return {
    cols,
    rows,
    cellSize: CELL_PX,
    gap: GAP_PX,
    originX: leftInset + (width - leftInset - usedWidth) / 2 + CELL_PX / 2,
    originY: (height - usedHeight) / 2 + CELL_PX / 2,
  };
}

const BLANK_RATIO = 0.4;

/** The original seeded two cells in five as blank and the rest in a random paint. */
function randomCell(random: () => number): Cell {
  if (random() < BLANK_RATIO) return { shape: 1, color: BACKGROUND_COLOR };
  return { shape: 1, color: Math.min(Math.floor(random() * PAINT_COLORS.length), PAINT_COLORS.length - 1) };
}

export function createGrid(layout: GridLayout, random: () => number): Grid {
  const cells = Array.from({ length: layout.cols * layout.rows }, () => randomCell(random));
  return { layout, cells };
}

function isCellIndex(grid: Grid, index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < grid.cells.length;
}

export function cellCenter(layout: GridLayout, index: number): Point {
  const pitch = layout.cellSize + layout.gap;
  return {
    x: layout.originX + (index % layout.cols) * pitch,
    y: layout.originY + Math.floor(index / layout.cols) * pitch,
  };
}

function nearestIndex(layout: GridLayout, x: number, y: number): number {
  const pitch = layout.cellSize + layout.gap;
  const col = Math.round((x - layout.originX) / pitch);
  const row = Math.round((y - layout.originY) / pitch);
  if (col < 0 || col >= layout.cols || row < 0 || row >= layout.rows) return -1;
  return row * layout.cols + col;
}

/** Index of the cell whose disc (plus half a gap) contains the point, or -1. */
export function cellIndexAt(layout: GridLayout, x: number, y: number): number {
  if (!Number.isFinite(x) || !Number.isFinite(y) || layout.cols === 0) return -1;
  const index = nearestIndex(layout, x, y);
  if (index < 0) return -1;
  const centre = cellCenter(layout, index);
  return Math.hypot(x - centre.x, y - centre.y) <= layout.cellSize / 2 + layout.gap / 2 ? index : -1;
}

function isShape(shape: number): boolean {
  return Number.isInteger(shape) && shape >= 1 && shape <= SHAPE_COUNT;
}

function isColor(color: number): boolean {
  return Number.isInteger(color) && color >= 0 && color <= BACKGROUND_COLOR;
}

export function paintCell(grid: Grid, index: number, shape: number, color: number): boolean {
  if (!isCellIndex(grid, index) || !isShape(shape) || !isColor(color)) return false;
  grid.cells[index] = { shape, color };
  return true;
}

export function nextShape(shape: number): number {
  return isShape(shape) && shape < SHAPE_COUNT ? shape + 1 : 1;
}

export function cycleShape(grid: Grid, index: number): boolean {
  if (!isCellIndex(grid, index)) return false;
  grid.cells[index] = { ...grid.cells[index], shape: nextShape(grid.cells[index].shape) };
  return true;
}

export function clearCell(grid: Grid, index: number): boolean {
  return paintCell(grid, index, 1, BACKGROUND_COLOR);
}

/** The eraser handle is dragged from the left edge and wipes everything it has passed. */
export function eraseLeftOf(grid: Grid, x: number): number {
  if (!Number.isFinite(x)) return 0;
  let wiped = 0;
  for (let index = 0; index < grid.cells.length; index += 1) {
    if (cellCenter(grid.layout, index).x < x && clearCell(grid, index)) wiped += 1;
  }
  return wiped;
}

export function clearGrid(grid: Grid): void {
  for (let index = 0; index < grid.cells.length; index += 1) clearCell(grid, index);
}

export function strokePaint(grid: Grid, stroke: Stroke, x: number, y: number, shape: number, color: number): boolean {
  const index = cellIndexAt(grid.layout, x, y);
  const revisit = index === stroke.lastCell;
  stroke.lastCell = index;
  return !revisit && paintCell(grid, index, shape, color);
}

function isInsideCell(layout: GridLayout, index: number, point: Point): boolean {
  const centre = cellCenter(layout, index);
  return Math.hypot(point.x - centre.x, point.y - centre.y) <= layout.cellSize / 2;
}

/** Two fingers pinched on the same cell step its shape; the pinch must leave the cell before it counts again. */
export function strokeCycle(grid: Grid, stroke: Stroke, a: Point, b: Point): boolean {
  const index = cellIndexAt(grid.layout, a.x, a.y);
  const pinched = index >= 0 && isInsideCell(grid.layout, index, a) && isInsideCell(grid.layout, index, b);
  if (!pinched) {
    stroke.lastCell = -1;
    return false;
  }
  if (index === stroke.lastCell) return false;
  stroke.lastCell = index;
  return cycleShape(grid, index);
}

/** Cells keep their column and row; room that did not exist before starts blank. */
export function resizeGrid(grid: Grid, layout: GridLayout): Grid {
  const cells = Array.from({ length: layout.cols * layout.rows }, (_, index) => {
    const col = index % layout.cols;
    const row = Math.floor(index / layout.cols);
    const old = col < grid.layout.cols && row < grid.layout.rows ? grid.cells[row * grid.layout.cols + col] : undefined;
    return old ?? { shape: 1, color: BACKGROUND_COLOR };
  });
  return { layout, cells };
}

export function backgroundHex(background: number): string {
  return BACKGROUNDS[background] ?? BACKGROUNDS[0];
}

/** Anything that is not a paint (including the blank index and garbage) renders as the background. */
export function colorHex(color: number, background: number): string {
  return PAINT_COLORS[color] ?? backgroundHex(background);
}

export function nextBackground(background: number): number {
  return Number.isInteger(background) && background >= 0 ? (background + 1) % BACKGROUNDS.length : 0;
}

/** Scale of a cell `ageMs` after it was painted; always 1 under reduced motion. */
export function popScale(ageMs: number, reduced: boolean): number {
  if (reduced || !Number.isFinite(ageMs) || ageMs < 0 || ageMs >= POP_MS) return 1;
  const remaining = 1 - ageMs / POP_MS;
  return 1 + POP_SCALE * remaining * remaining;
}
