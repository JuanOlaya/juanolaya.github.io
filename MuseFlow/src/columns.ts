/** The game is laid out in a fixed world 768 units tall (the original 1366×768 study screen), scaled to fit. */
export const WORLD_HEIGHT = 768;
/** Gap between neighbouring columns, narrower than the ball so it never falls between them. */
export const COLUMN_GAP = 15;
/** Columns rise and sink between 15% and 75% of the world height, as in the study. */
export const MIN_COLUMN_HEIGHT = 0.15 * WORLD_HEIGHT;
export const MAX_COLUMN_HEIGHT = 0.75 * WORLD_HEIGHT;
const START_HEIGHT = 0.4 * WORLD_HEIGHT;

export interface PlatformSpec {
  width: number;
  /** World units per 60 FPS frame; the sign picks the first direction, 0 keeps the column still. */
  speed: number;
}

export interface Column {
  x: number;
  width: number;
  height: number;
  speed: number;
}

function isPlatformSpec(value: unknown): value is PlatformSpec {
  if (typeof value !== 'object' || value === null) return false;
  const { width, speed } = value as Record<string, unknown>;
  return typeof width === 'number' && width > 0 && typeof speed === 'number' && Number.isFinite(speed);
}

/** Reads a level file (`{ platforms: [{ width, speed }] }`), dropping malformed entries. */
export function parseLevel(data: unknown): PlatformSpec[] {
  const platforms = (data as { platforms?: unknown } | null)?.platforms;
  if (!Array.isArray(platforms)) return [];
  return platforms.filter(isPlatformSpec);
}

/** Places the columns left to right, each starting at 40% of the world height. */
export function layoutColumns(specs: readonly PlatformSpec[]): Column[] {
  let x = 0;
  return specs.map(({ width, speed }) => {
    const column = { x, width, height: START_HEIGHT, speed };
    x += width + COLUMN_GAP;
    return column;
  });
}

/** Moves a column by `frames` 60 FPS frames, bouncing off the lowest and highest heights. */
export function stepColumn(column: Column, frames: number): void {
  column.height += column.speed * frames;
  if (column.height < MIN_COLUMN_HEIGHT) {
    column.height = MIN_COLUMN_HEIGHT;
    column.speed = Math.abs(column.speed);
  } else if (column.height > MAX_COLUMN_HEIGHT) {
    column.height = MAX_COLUMN_HEIGHT;
    column.speed = -Math.abs(column.speed);
  }
}

export function columnTop(column: Column): number {
  return WORLD_HEIGHT - column.height;
}

/** Index of the column under `x` (gaps count as the column to their left), or -1 before the first. */
export function columnIndexAt(columns: readonly Column[], x: number): number {
  let index = -1;
  for (let i = 0; i < columns.length && columns[i].x <= x; i++) index = i;
  return index;
}
