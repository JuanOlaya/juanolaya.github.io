import type { HapticLeverSystem, LeverState } from './lever-physics.ts';
import { forceKeyOf, type ViewOptions } from './view-options.ts';

export interface ReadoutElements {
  thetaH: HTMLElement;
  betaS: HTMLElement;
  psi: HTMLElement;
  alpha: HTMLElement;
  gamma: HTMLElement;
  gammaDef: HTMLElement;
  forceFx: HTMLElement;
  forceFy: HTMLElement;
  torque: HTMLElement;
  angularMomentum: HTMLElement;
}

const sym = (color: string, text: string) => `<b style="color: ${color}; font-weight: 600;">${text}</b>`;
const THETA = sym('#f59e0b', 'θh');
const DTHETA = sym('#f59e0b', 'Δθh');
const BETA = sym('#1e293b', 'βs');
const PSI = sym('#3b82f6', 'ψ');
const ALPHA = sym('#ec4899', 'α');

const breakdown = (formula: string, value: string) =>
  `<div class="text-slate-500 text-xs">${formula}</div>\n<div>${value}</div>`;

function betaSFormula(state: LeverState, options: ViewOptions): string {
  if (options.task === 'resistance_torque') return `clamp(-0.73·${DTHETA}, ±81°)`;
  const followsHandle = options.task === 'resistance' || options.task === 'motion';
  // ±54° is the label the original page showed, even though the servo limit is 81°.
  if (state.inputs.servoMode === 'shifting' && followsHandle) return `clamp(0.73·${DTHETA}, ±54°)`;
  return '0';
}

function setAngleVisibility(el: ReadoutElements, isImpact: boolean) {
  for (const item of [el.thetaH, el.betaS, el.psi, el.alpha]) item.classList.toggle('hidden', isImpact);
  for (const item of [el.gamma, el.gammaDef, el.gammaDef.nextElementSibling]) {
    item?.classList.toggle('hidden', !isImpact);
  }
}

export function renderAngleReadouts(el: ReadoutElements, state: LeverState, options: ViewOptions) {
  const { dtheta_hDeg } = state.inputs;
  const { theta_h, betaS, psi, alpha, gamma } = state.angles;
  const f = (value: number) => value.toFixed(1);
  setAngleVisibility(el, options.task === 'impact');
  if (options.task === 'impact') {
    el.gamma.innerHTML = breakdown(`${sym('#14b8a6', 'γ')} = slider value`, `<b>${f(gamma ?? 0)}°</b>`);
  }
  el.thetaH.innerHTML = breakdown(
    `${THETA} = 90° + ${DTHETA}`,
    `90° + ${f(dtheta_hDeg)}° = <b>${f(theta_h)}°</b>`,
  );
  el.betaS.innerHTML = breakdown(`${BETA} = ${betaSFormula(state, options)}`, `<b>${f(betaS)}°</b>`);
  el.psi.innerHTML = breakdown(
    `${PSI} = ${THETA} + 180° + ${BETA}`,
    `${f(theta_h)}°+180°+${f(betaS)}° = <b>${f(psi)}°</b>`,
  );
  el.alpha.innerHTML = breakdown(
    `${ALPHA} = ${PSI} − ${THETA}`,
    `${f(psi)}° - ${f(theta_h)}° = <b>${f(alpha)}°</b>`,
  );
}

function forceLine(
  axis: string,
  sign: string,
  mg: number,
  fn: string,
  angle: string,
  deg: number,
  value: number,
) {
  return `${axis} = ${sign}(m·g·${fn}(${angle}))<br>
                  = ${sign}(${mg.toFixed(1)})·${fn}(${deg.toFixed(1)}°)<br>
                  = <b>${value.toFixed(1)} N</b>`;
}

export function renderForceReadouts(
  el: ReadoutElements,
  system: HapticLeverSystem,
  state: LeverState,
  options: ViewOptions,
) {
  const { mg, L } = system;
  const { psi, alpha } = state.angles;
  const sign = options.forceType === 'mass' ? '' : '-';
  const force = state.forces[forceKeyOf(options)];
  if (options.forceFrame === 'global') {
    el.forceFx.innerHTML = forceLine('Fx', sign, mg, 'cos', PSI, psi, force.x);
    el.forceFy.innerHTML = forceLine('Fy', sign, mg, 'sin', PSI, psi, force.y);
  } else {
    el.forceFx.innerHTML = forceLine('Fx', sign, mg, 'sin', ALPHA, alpha, force.x);
    el.forceFy.innerHTML = forceLine('Fy', sign, mg, 'cos', ALPHA, alpha, force.y);
  }
  el.torque.innerHTML = `τ = m·g·L·sin(${PSI})<br>
                                        = (${mg.toFixed(1)})·(${L.toFixed(1)})·sin(${psi.toFixed(1)}°)<br>
                                        = <b>${state.torque.toFixed(1)} N·m</b>`;
}

export function renderAngularMomentum(el: ReadoutElements, system: HapticLeverSystem) {
  el.angularMomentum.innerHTML = `L = I · ω<br>
        I = m · L² = <b>${system.I.toFixed(3)} kg·m²</b><br>
        <span class="text-xs text-slate-500">ω is the angular velocity (not calculated in this static simulation)</span>`;
}
