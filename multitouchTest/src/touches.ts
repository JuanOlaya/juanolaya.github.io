/** A released point fades out over about half a second (30 frames at 60 FPS). */
const FADE_PER_FRAME = 1 / 30;

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  /** `touch`, `pen` or `mouse`, from `PointerEvent.pointerType`. */
  kind: string;
  /** 1 while held; drops to 0 after release, then the point is removed. */
  alpha: number;
  held: boolean;
}

export type TouchMap = Map<number, TouchPoint>;

export function pressPoint(points: TouchMap, id: number, x: number, y: number, kind: string): void {
  points.set(id, { id, x, y, kind, alpha: 1, held: true });
}

/** Moves a held point; hover moves of a mouse that is not pressed are ignored. */
export function movePoint(points: TouchMap, id: number, x: number, y: number): void {
  const point = points.get(id);
  if (!point?.held) return;
  point.x = x;
  point.y = y;
}

/** Lets a point fade out, or drops it at once when motion should be reduced. */
export function releasePoint(points: TouchMap, id: number, reduced: boolean): void {
  const point = points.get(id);
  if (!point) return;
  if (reduced) points.delete(id);
  else point.held = false;
}

/** Fades released points by `frames` 60 FPS frames and removes the ones that are gone. */
export function fadePoints(points: TouchMap, frames: number): void {
  for (const point of points.values()) {
    if (point.held) continue;
    point.alpha -= FADE_PER_FRAME * frames;
    if (point.alpha <= 0) points.delete(point.id);
  }
}

export function heldPoints(points: TouchMap): TouchPoint[] {
  return [...points.values()].filter((point) => point.held);
}

/** One line per held point, numbered in press order like the original test. */
export function coordinateLines(points: TouchMap): string[] {
  return heldPoints(points).map(
    (point, index) => `${index + 1}. ${point.kind}  X: ${Math.floor(point.x)}  Y: ${Math.floor(point.y)}`,
  );
}
