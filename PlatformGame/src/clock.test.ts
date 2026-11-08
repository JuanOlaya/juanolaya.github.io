import { describe, expect, it } from 'vitest';
import { approach, fitAspect, planSteps } from './clock.ts';
import { STEP_SECONDS } from './physics.ts';

describe('planSteps', () => {
  it('runs one step per 1/30 s whatever the frame rate', () => {
    let carry = 0;
    let steps = 0;
    for (let frame = 0; frame < 120; frame++) {
      const plan = planSteps(carry, 1 / 120);
      carry = plan.carry;
      steps += plan.steps;
    }
    expect(steps).toBeGreaterThanOrEqual(29);
    expect(steps).toBeLessThanOrEqual(30);
    expect(planSteps(0, STEP_SECONDS * 2.5).steps).toBe(2);
  });

  it('interpolates between steps and caps catch-up after a stall', () => {
    expect(planSteps(0, STEP_SECONDS / 2).alpha).toBeCloseTo(0.5);
    expect(planSteps(0, 10).steps).toBe(7);
    expect(planSteps(0, Number.NaN).steps).toBe(0);
  });
});

describe('approach', () => {
  it('moves toward the target and stops there', () => {
    expect(approach(0, 1, 0.1, 0.5)).toBeCloseTo(0.2);
    expect(approach(0.9, 1, 0.5, 0.5)).toBe(1);
    expect(approach(1, 0, 0.1, 0.5)).toBeCloseTo(0.8);
    expect(approach(0, 1, 0.01, 0)).toBe(1);
  });
});

describe('fitAspect', () => {
  it('letterboxes inside the box', () => {
    expect(fitAspect(1920, 1080, 1366 / 768)).toEqual({ width: 1920, height: 1079 });
    expect(fitAspect(390, 600, 1366 / 768)).toEqual({ width: 390, height: 219 });
    expect(fitAspect(2000, 400, 2)).toEqual({ width: 800, height: 400 });
  });
});
