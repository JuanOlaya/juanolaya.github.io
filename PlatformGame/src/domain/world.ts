import { type CollisionResult, resolveCollisions } from './collision.ts';
import type { Platform } from './platform.ts';
import { type InputState, Player } from './player.ts';
import { planSteps } from './timestep.ts';
import type { Vector } from './vector.ts';

export type { InputState } from './player.ts';

/** Everything one `World.step` did, merged over its fixed steps; the renderer and panels read it. */
export interface StepReport extends CollisionResult {
  /** Fixed physics steps run in this call (0 when the frame was too short). */
  steps: number;
  /** Interpolation factor between the previous and current position, 0..1. */
  alpha: number;
  respawned: boolean;
}

export const IDLE_STEP: StepReport = {
  steps: 0,
  alpha: 0,
  landingSpeed: 0,
  wallHit: false,
  respawned: false,
  side: 0,
  normal: null,
};

function merge(total: StepReport, step: StepReport): StepReport {
  return {
    ...total,
    landingSpeed: Math.max(total.landingSpeed, step.landingSpeed),
    wallHit: total.wallHit || step.wallHit,
    respawned: total.respawned || step.respawned,
    side: step.side || total.side,
    normal: step.normal ?? total.normal,
  };
}

/**
 * Aggregate root: the ball, the platforms and the end walls, advanced in fixed 1/30 s steps so the
 * feel is identical on every display. Real time goes in; what happened comes out as `lastStep`.
 */
export class World {
  readonly player: Player;
  /** Position before the most recent fixed step, for interpolated drawing. */
  previousPosition: Vector;
  lastStep: StepReport = IDLE_STEP;
  private carry = 0;

  constructor(
    readonly platforms: readonly Platform[],
    /** Playable width: from 0 to the right edge of the last platform. */
    readonly width: number,
    player = new Player(),
  ) {
    this.player = player;
    this.previousPosition = player.position;
  }

  step(dt: number, input: InputState): void {
    const plan = planSteps(this.carry, dt);
    this.carry = plan.carry;
    let report: StepReport = { ...IDLE_STEP, steps: plan.steps, alpha: plan.alpha };
    for (let i = 0; i < plan.steps; i++) report = merge(report, this.fixedStep(input));
    this.lastStep = report;
  }

  /** One original frame: gravity, view edges, walls, input, then every platform. */
  private fixedStep(input: InputState): StepReport {
    const { player } = this;
    const from = player.position;
    this.previousPosition = from;
    player.fall();
    const respawned = player.keepInsideView();
    const wall = player.bounceOffWalls(this.width);
    player.steer(input, this.width);
    const hits = resolveCollisions(player, this.platforms, from);
    return {
      ...IDLE_STEP,
      ...hits,
      respawned,
      wallHit: hits.wallHit || wall !== null,
      normal: hits.normal ?? wall,
    };
  }
}
