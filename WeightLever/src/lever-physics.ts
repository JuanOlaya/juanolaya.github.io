export type ServoMode = 'fixed' | 'shifting';

export interface Vector2 {
  x: number;
  y: number;
}

export interface LeverState {
  inputs: { dtheta_hDeg: number; betaSDeg: number; servoMode: ServoMode };
  angles: { theta_h: number; betaS: number; psi: number; alpha: number; gamma: number | null };
  forces: {
    mass_global: Vector2;
    mass_handle: Vector2;
    reaction_global: Vector2;
    reaction_handle: Vector2;
  };
  torque: number;
}

export type ForceKey = keyof LeverState['forces'];

export interface LeverOptions {
  mass?: number;
  gravity?: number;
  leverLength?: number;
  initialThetaH?: number;
  servoRatio?: number;
  servoLimit?: number;
}

export function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Maps any angle in degrees to [0, 360). */
export function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Weight lever: a handle at θh carries a servo-driven lever (angle βs relative to the handle) with a mass at its tip.
 * Angles are in degrees; the world frame has 0° on +X and grows counter-clockwise.
 */
export class HapticLeverSystem {
  readonly m: number;
  readonly g: number;
  readonly L: number;
  readonly theta_h0: number;
  readonly ratio: number;
  readonly servoLimit: number;
  readonly mg: number;
  /** Moment of inertia of a point mass at the lever tip. */
  readonly I: number;
  private state: LeverState;

  constructor(options: LeverOptions = {}) {
    // `||` (not `??`) keeps the original behaviour: a 0 option falls back to the default too.
    this.m = options.mass || 0.242;
    this.g = options.gravity || 9.81;
    this.L = options.leverLength || 0.2;
    this.theta_h0 = options.initialThetaH || 90;
    this.ratio = options.servoRatio || 0.73;
    this.servoLimit = options.servoLimit || 81;
    this.mg = this.m * this.g;
    this.I = this.m * this.L * this.L;
    this.state = this.updateResistance(0, 'shifting');
  }

  /** Servo angle that follows the handle by `ratio` (or against it with `direction` -1), within the servo limit. */
  servoFollowing(dtheta_hDeg: number, direction: 1 | -1 = 1): number {
    return clamp(direction * this.ratio * dtheta_hDeg, -this.servoLimit, this.servoLimit);
  }

  updateResistance(dtheta_hDeg: number, servoMode: ServoMode): LeverState {
    const theta_h = this.theta_h0 + dtheta_hDeg;
    const betaS = servoMode === 'shifting' ? this.servoFollowing(dtheta_hDeg) : 0;
    return this.calculateState(theta_h, betaS, dtheta_hDeg, servoMode);
  }

  updateResistanceTorque(dtheta_hDeg: number): LeverState {
    const theta_h = this.theta_h0 + dtheta_hDeg;
    return this.calculateState(theta_h, this.servoFollowing(dtheta_hDeg, -1), dtheta_hDeg, 'shifting');
  }

  updateMotion(betaSDeg: number): LeverState {
    return this.calculateState(this.theta_h0, betaSDeg, 0, 'shifting');
  }

  updateImpact(gammaDeg: number): LeverState {
    return this.calculateState(this.theta_h0, 0, 0, 'shifting', gammaDeg);
  }

  getState(): LeverState {
    return this.state;
  }

  private calculateState(
    theta_h: number,
    betaS: number,
    dtheta_hDeg: number,
    servoMode: ServoMode,
    gammaDeg: number | null = null,
  ): LeverState {
    const psi = normalizeAngle(gammaDeg !== null ? gammaDeg : theta_h + 180 + betaS);
    const alpha = normalizeAngle(psi - theta_h + 180) - 180;
    const psiRad = deg2rad(psi);
    const alphaRad = deg2rad(alpha);
    const global = { x: this.mg * Math.cos(psiRad), y: this.mg * Math.sin(psiRad) };
    const handle = { x: this.mg * Math.sin(alphaRad), y: this.mg * Math.cos(alphaRad) };

    this.state = {
      inputs: { dtheta_hDeg, betaSDeg: betaS, servoMode },
      angles: { theta_h, betaS, psi, alpha, gamma: gammaDeg },
      forces: {
        mass_global: global,
        mass_handle: handle,
        reaction_global: { x: -global.x, y: -global.y },
        reaction_handle: { x: -handle.x, y: -handle.y },
      },
      torque: this.mg * this.L * Math.sin(psiRad),
    };
    return this.state;
  }
}
