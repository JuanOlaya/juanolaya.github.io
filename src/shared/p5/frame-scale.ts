/** The sketches were tuned frame by frame at 60 FPS; their per-frame steps are scaled from that. */
const REFERENCE_FRAME_MS = 1000 / 60;
/** A long pause (tab switch, debugger) counts as at most this many frames, so nothing jumps. */
const MAX_FRAMES = 4;

/**
 * How many 60 FPS frames `deltaMs` (p5's `deltaTime`) is worth: 1 at 60 FPS, 0.5 at 120 FPS, 2 at 30 FPS.
 * Multiplying a per-frame step by it keeps the speed the same on any display.
 */
export function frameScale(deltaMs: number): number {
  if (!Number.isFinite(deltaMs) || deltaMs <= 0) return 0;
  return Math.min(deltaMs / REFERENCE_FRAME_MS, MAX_FRAMES);
}
