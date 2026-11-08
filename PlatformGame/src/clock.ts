import { STEP_SECONDS } from './physics.ts';

/** After a stall (tab switch, debugger) only this much time is caught up, so the ball never teleports. */
const MAX_CATCH_UP_SECONDS = 0.25;

export interface StepPlan {
  /** Whole physics steps to run now. */
  steps: number;
  /** Time left over, carried to the next frame. */
  carry: number;
  /** How far between the last two steps to draw, 0..1, for smooth motion on fast displays. */
  alpha: number;
}

/** Splits frame time into fixed 1/30 s steps, the rate the original physics were tuned at. */
export function planSteps(carry: number, deltaSeconds: number): StepPlan {
  const safeDelta = Number.isFinite(deltaSeconds) && deltaSeconds > 0 ? deltaSeconds : 0;
  const available = Math.min(carry + safeDelta, MAX_CATCH_UP_SECONDS);
  const steps = Math.floor(available / STEP_SECONDS);
  const left = available - steps * STEP_SECONDS;
  return { steps, carry: left, alpha: left / STEP_SECONDS };
}

/** Eases `value` toward `target` in about `seconds`; instant when `seconds` is 0 (reduced motion). */
export function approach(value: number, target: number, deltaSeconds: number, seconds: number): number {
  if (seconds <= 0) return target;
  const step = deltaSeconds / seconds;
  return value < target ? Math.min(value + step, target) : Math.max(value - step, target);
}

/** Largest size with the given aspect that fits inside the box. */
export function fitAspect(
  boxWidth: number,
  boxHeight: number,
  aspect: number,
): { width: number; height: number } {
  const width = Math.max(0, Math.min(boxWidth, boxHeight * aspect));
  return { width: Math.floor(width), height: Math.floor(width / aspect) };
}
