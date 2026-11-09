/**
 * The original sketch ran at 30 FPS and every physics constant is "per original frame", so the
 * world advances in fixed 1/30 s steps whatever the display refresh rate.
 */
export const STEP_SECONDS = 1 / 30;

/** After a stall (tab switch, debugger) only this much time is caught up, so the ball never teleports. */
export const MAX_CATCH_UP_SECONDS = 0.25;

export interface StepPlan {
  /** Whole physics steps to run now. */
  steps: number;
  /** Time left over, carried to the next frame. */
  carry: number;
  /** How far between the last two steps to draw, 0..1, for smooth motion on fast displays. */
  alpha: number;
}

/** Splits frame time into fixed steps; NaN, negative and huge deltas are tamed here, once. */
export function planSteps(carry: number, deltaSeconds: number): StepPlan {
  const safeDelta = Number.isFinite(deltaSeconds) && deltaSeconds > 0 ? deltaSeconds : 0;
  const available = Math.min(carry + safeDelta, MAX_CATCH_UP_SECONDS);
  const steps = Math.floor(available / STEP_SECONDS);
  const left = available - steps * STEP_SECONDS;
  return { steps, carry: left, alpha: left / STEP_SECONDS };
}
