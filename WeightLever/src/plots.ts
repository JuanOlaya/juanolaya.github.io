import { drawArrow } from './draw-primitives.ts';
import { HapticLeverSystem, deg2rad, type LeverState, type Vector2 } from './lever-physics.ts';
import type { ForceFrame } from './view-options.ts';

type Ctx = CanvasRenderingContext2D;

const CURVE_PAD = { x: 50, y: 30 };

function drawForceGrid(ctx: Ctx, w: number, h: number, pad: number, step: number) {
  ctx.save();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 4]);
  for (let i = -2; i <= 2; i++) {
    if (i === 0) continue;
    const offset = i * step;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + pad, offset);
    ctx.lineTo(w / 2 - pad, offset);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offset, -h / 2 + pad);
    ctx.lineTo(offset, h / 2 - pad);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-w / 2 + pad, 0);
  ctx.lineTo(w / 2 - pad, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -h / 2 + pad);
  ctx.lineTo(0, h / 2 - pad);
  ctx.stroke();
  ctx.restore();
}

function forceAxisLabels(frame: ForceFrame, showIndexes: boolean): [string, string] {
  if (frame === 'global') return showIndexes ? ['Zg (N)', 'Yg (N)'] : ['Z (N)', 'Y (N)'];
  return showIndexes ? ['X_h (N)', 'Y_h (N)'] : ['X (N)', 'Y (N)'];
}

function drawForceLabels(ctx: Ctx, force: Vector2, scale: number, labels: [string, string], pad: number) {
  const { width: w, height: h } = ctx.canvas;
  ctx.save();
  ctx.scale(1, -1);
  ctx.fillStyle = '#475569';
  ctx.font = '18px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labels[0], 0, h / 2 - pad / 2);
  ctx.save();
  ctx.rotate(Math.PI / 2);
  ctx.fillText(labels[1], 0, w / 2 - pad / 2);
  ctx.restore();

  ctx.fillStyle = '#16a34a';
  ctx.font = '14px ui-monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`${force.x.toFixed(1)} N`, (force.x * scale) / 2, -8);
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${force.y.toFixed(1)} N`, 8, -(force.y * scale) / 2);
  ctx.restore();
}

/** Force at the joint and its two components, in a Y-up frame centred on the canvas. */
export function drawForcePlot(ctx: Ctx, mg: number, force: Vector2, frame: ForceFrame, showIndexes: boolean) {
  const { width: w, height: h } = ctx.canvas;
  const pad = 40;
  const maxN = Math.max(2.5, Math.ceil(mg * 1.1));
  const scale = (h - pad * 2) / 2 / maxN;
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(1, -1);
  drawForceGrid(ctx, w, h, pad, (maxN / 2) * scale);
  const fx = force.x * scale;
  const fy = force.y * scale;
  drawArrow(ctx, 0, 0, fx, fy, '#3b82f6', 5);
  drawArrow(ctx, 0, 0, fx, 0, '#16a34a', 4);
  drawArrow(ctx, 0, 0, 0, fy, '#f59e0b', 4);
  drawForceLabels(ctx, force, scale, forceAxisLabels(frame, showIndexes), pad);
  ctx.restore();
}

function strokeCurve(ctx: Ctx, points: Vector2[]) {
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(ctx.canvas.width - CURVE_PAD.x * 1.5, 0);
  ctx.stroke();

  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, i) => (i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)));
  ctx.stroke();
}

function curveFrame(ctx: Ctx) {
  const { width: w, height: h } = ctx.canvas;
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(CURVE_PAD.x, h / 2);
  ctx.scale(1, -1);
  return { plotW: w - CURVE_PAD.x * 1.5, plotH: h - CURVE_PAD.y * 2 };
}

function drawTorqueAxisLabels(ctx: Ctx, plotW: number) {
  ctx.save();
  ctx.scale(1, -1);
  ctx.fillStyle = '#475569';
  ctx.font = '16px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ψ (degrees)', plotW / 2, ctx.canvas.height / 2 - CURVE_PAD.y / 2);
  ctx.save();
  ctx.rotate(Math.PI / 2);
  ctx.fillText('τ (N·m)', 0, -CURVE_PAD.x + 10);
  ctx.restore();
  ctx.restore();
}

/** τ(ψ) over a full turn, with the current state as a red dot. */
export function drawTorquePlot(ctx: Ctx, system: HapticLeverSystem, state: LeverState) {
  const { plotW, plotH } = curveFrame(ctx);
  const tauMax = system.mg * system.L;
  const toX = (deg: number) => (deg / 360) * plotW;
  const toY = (tau: number) => (tau / tauMax) * (plotH / 2);
  const points: Vector2[] = [];
  for (let deg = 0; deg <= 360; deg++) points.push({ x: toX(deg), y: toY(tauMax * Math.sin(deg2rad(deg))) });
  strokeCurve(ctx, points);

  ctx.beginPath();
  ctx.arc(toX(state.angles.psi), toY(state.torque), 5, 0, 2 * Math.PI);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  drawTorqueAxisLabels(ctx, plotW);
  ctx.restore();
}

/**
 * τ(Δθh) for the max-torque servo law across the handle range. The original never filled the
 * current-point dot nor drew labels here, so neither does this port.
 */
export function drawHandleTorquePlot(ctx: Ctx, system: HapticLeverSystem, range: number) {
  const { plotW, plotH } = curveFrame(ctx);
  const tauMax = system.mg * system.L;
  const toX = (dtheta: number) => ((dtheta + range) / (range * 2)) * plotW;
  const toY = (tau: number) => (tau / tauMax) * (plotH / 2);
  const points: Vector2[] = [];
  for (let dtheta = -range; dtheta <= range; dtheta += 0.5) {
    points.push({ x: toX(dtheta), y: toY(system.updateResistanceTorque(dtheta).torque) });
  }
  strokeCurve(ctx, points);
  ctx.restore();
}
