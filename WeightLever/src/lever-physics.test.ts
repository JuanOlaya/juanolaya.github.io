import { describe, expect, it } from 'vitest';
import {
  HapticLeverSystem,
  clamp,
  normalizeAngle,
  type LeverState,
  type ServoMode,
} from './lever-physics.ts';

type Call =
  | ['updateResistance', number, ServoMode]
  | ['updateResistanceTorque', number]
  | ['updateMotion', number]
  | ['updateImpact', number];

interface Golden {
  call: Call;
  psi: number;
  alpha: number;
  betaS: number;
  thetaH: number;
  fx: number;
  fy: number;
  hx: number;
  hy: number;
  torque: number;
}

// Reference values produced by running the original inline HapticLeverSystem class of
// weightLever_simulation_Gemini_v4.html (before the TypeScript port) with the same calls.
const golden: Golden[] = [
  {
    call: ['updateResistance', 0, 'shifting'],
    psi: 270,
    alpha: -180,
    betaS: 0,
    thetaH: 90,
    fx: 0,
    fy: -2.37402,
    hx: 0,
    hy: -2.37402,
    torque: -0.474804,
  },
  {
    call: ['updateResistance', 30, 'shifting'],
    psi: 321.9,
    alpha: -158.1,
    betaS: 21.9,
    thetaH: 120,
    fx: 1.868199481,
    fy: -1.464855508,
    hx: -0.885480456,
    hy: -2.202701823,
    torque: -0.292971102,
  },
  {
    call: ['updateResistance', -45, 'shifting'],
    psi: 192.15,
    alpha: 147.15,
    betaS: -32.85,
    thetaH: 45,
    fx: -2.320841804,
    fy: -0.499664167,
    hx: 1.287767057,
    hy: -1.994398899,
    torque: -0.099932833,
  },
  {
    call: ['updateResistance', 74, 'shifting'],
    psi: 38.02,
    alpha: -125.98,
    betaS: 54.02,
    thetaH: 164,
    fx: 1.870242983,
    fy: 1.462245583,
    hx: -1.921109499,
    hy: -1.394743436,
    torque: 0.292449117,
  },
  {
    call: ['updateResistance', 30, 'fixed'],
    psi: 300,
    alpha: -180,
    betaS: 0,
    thetaH: 120,
    fx: 1.18701,
    fy: -2.055961629,
    hx: 0,
    hy: -2.37402,
    torque: -0.411192326,
  },
  {
    call: ['updateResistance', -60, 'fixed'],
    psi: 210,
    alpha: -180,
    betaS: 0,
    thetaH: 30,
    fx: -2.055961629,
    fy: -1.18701,
    hx: 0,
    hy: -2.37402,
    torque: -0.237402,
  },
  {
    call: ['updateResistanceTorque', 45],
    psi: 282.15,
    alpha: 147.15,
    betaS: -32.85,
    thetaH: 135,
    fx: 0.499664167,
    fy: -2.320841804,
    hx: 1.287767057,
    hy: -1.994398899,
    torque: -0.464168361,
  },
  {
    call: ['updateResistanceTorque', -74],
    psi: 250.02,
    alpha: -125.98,
    betaS: 54.02,
    thetaH: 16,
    fx: -0.811183898,
    fy: -2.231132368,
    hx: -1.921109499,
    hy: -1.394743436,
    torque: -0.446226474,
  },
  {
    call: ['updateResistanceTorque', 120],
    psi: 309,
    alpha: 99,
    betaS: -81,
    thetaH: 210,
    fx: 1.494019195,
    fy: -1.844960055,
    hx: 2.344791874,
    hy: -0.371378549,
    torque: -0.368992011,
  },
  {
    call: ['updateMotion', 81],
    psi: 351,
    alpha: -99,
    betaS: 81,
    thetaH: 90,
    fx: 2.344791874,
    fy: -0.371378549,
    hx: -2.344791874,
    hy: -0.371378549,
    torque: -0.07427571,
  },
  {
    call: ['updateMotion', -40.5],
    psi: 229.5,
    alpha: 139.5,
    betaS: -40.5,
    thetaH: 90,
    fx: -1.541802656,
    fy: -1.80521897,
    hx: 1.541802656,
    hy: -1.80521897,
    torque: -0.361043794,
  },
  {
    call: ['updateImpact', 270],
    psi: 270,
    alpha: -180,
    betaS: 0,
    thetaH: 90,
    fx: 0,
    fy: -2.37402,
    hx: 0,
    hy: -2.37402,
    torque: -0.474804,
  },
  {
    call: ['updateImpact', 315],
    psi: 315,
    alpha: -135,
    betaS: 0,
    thetaH: 90,
    fx: 1.678685641,
    fy: -1.678685641,
    hx: -1.678685641,
    hy: -1.678685641,
    torque: -0.335737128,
  },
  {
    call: ['updateImpact', 360],
    psi: 0,
    alpha: -90,
    betaS: 0,
    thetaH: 90,
    fx: 2.37402,
    fy: 0,
    hx: -2.37402,
    hy: 0,
    torque: 0,
  },
];

function run(system: HapticLeverSystem, call: Call): LeverState {
  switch (call[0]) {
    case 'updateResistance':
      return system.updateResistance(call[1], call[2]);
    case 'updateResistanceTorque':
      return system.updateResistanceTorque(call[1]);
    case 'updateMotion':
      return system.updateMotion(call[1]);
    case 'updateImpact':
      return system.updateImpact(call[1]);
  }
}

describe('HapticLeverSystem matches the original v4 simulator', () => {
  it.each(golden)('$call', (row) => {
    const state = run(new HapticLeverSystem(), row.call);
    expect(state.angles.psi).toBeCloseTo(row.psi, 8);
    expect(state.angles.alpha).toBeCloseTo(row.alpha, 8);
    expect(state.angles.betaS).toBeCloseTo(row.betaS, 8);
    expect(state.angles.theta_h).toBeCloseTo(row.thetaH, 8);
    expect(state.forces.mass_global.x).toBeCloseTo(row.fx, 8);
    expect(state.forces.mass_global.y).toBeCloseTo(row.fy, 8);
    expect(state.forces.mass_handle.x).toBeCloseTo(row.hx, 8);
    expect(state.forces.mass_handle.y).toBeCloseTo(row.hy, 8);
    expect(state.torque).toBeCloseTo(row.torque, 8);
  });

  it('starts at rest with the resistance state and the default constants', () => {
    const system = new HapticLeverSystem();
    expect(system.getState().angles).toEqual({ theta_h: 90, betaS: 0, psi: 270, alpha: -180, gamma: null });
    expect(system.mg).toBeCloseTo(2.37402, 10);
    expect(system.I).toBeCloseTo(0.00968, 10);
  });

  it('reaction forces are the opposite of the mass forces', () => {
    const { forces } = new HapticLeverSystem().updateResistance(30, 'shifting');
    expect(forces.reaction_global).toEqual({ x: -forces.mass_global.x, y: -forces.mass_global.y });
    expect(forces.reaction_handle).toEqual({ x: -forces.mass_handle.x, y: -forces.mass_handle.y });
  });

  it('keeps the servo angle within its limit', () => {
    const system = new HapticLeverSystem();
    expect(system.updateResistance(500, 'shifting').angles.betaS).toBe(81);
    expect(system.updateResistanceTorque(500).angles.betaS).toBe(-81);
  });

  it('treats 0 options like missing ones, as the original did', () => {
    expect(new HapticLeverSystem({ mass: 0 }).m).toBe(0.242);
  });
});

describe('angle helpers', () => {
  it.each([-720, -1, 0, 359.9, 360, 725])('normalizeAngle(%s) is within [0, 360)', (deg) => {
    const value = normalizeAngle(deg);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(360);
  });

  it('clamp bounds a value', () => {
    expect(clamp(5, -1, 1)).toBe(1);
    expect(clamp(-5, -1, 1)).toBe(-1);
    expect(clamp(0.5, -1, 1)).toBe(0.5);
  });
});
