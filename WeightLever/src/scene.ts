import {
  drawArrow,
  drawHandleRangeArc,
  drawLeverRangeArc,
  drawOrientationDial,
  drawWorldAxes,
  fillSector,
  polarLabel,
  strokeArc,
} from './draw-primitives.ts';
import { HapticLeverSystem, deg2rad, type LeverState } from './lever-physics.ts';
import type { ViewOptions } from './view-options.ts';

type Ctx = CanvasRenderingContext2D;

const LEVER_PX = 140;
const HANDLE_PX = 60;
const HANDLE_AXIS_PX = 160;
const RANGE_FILL = 'rgba(59, 130, 246, 0.15)';

function drawTaskRange(ctx: Ctx, system: HapticLeverSystem, options: ViewOptions, range: number) {
  if (options.task === 'resistance' || options.task === 'resistance_torque') {
    drawLeverRangeArc(ctx, system, LEVER_PX, range);
    drawHandleRangeArc(ctx, HANDLE_PX, range, true);
    drawHandleRangeArc(ctx, HANDLE_PX, range, false);
  } else if (options.task === 'motion') {
    fillSector(ctx, LEVER_PX, 189, 351, RANGE_FILL);
  } else {
    fillSector(ctx, LEVER_PX, 270, 360, RANGE_FILL);
  }
}

function handleAxes(thetaHRad: number) {
  return {
    x: { x: Math.cos(thetaHRad - Math.PI / 2), y: Math.sin(thetaHRad - Math.PI / 2) },
    y: { x: Math.cos(thetaHRad), y: Math.sin(thetaHRad) },
  };
}

function drawBodies(ctx: Ctx, psiRad: number, thetaHRad: number, frame: ViewOptions['forceFrame']) {
  const axes = handleAxes(thetaHRad);
  if (frame === 'handle') {
    drawArrow(ctx, 0, 0, HANDLE_AXIS_PX * axes.x.x, HANDLE_AXIS_PX * axes.x.y, '#16a34a', 2.5);
    drawArrow(ctx, 0, 0, HANDLE_AXIS_PX * axes.y.x, HANDLE_AXIS_PX * axes.y.y, '#16a34a', 2.5);
  }
  const leverEnd = { x: LEVER_PX * Math.cos(psiRad), y: LEVER_PX * Math.sin(psiRad) };
  drawArrow(ctx, 0, 0, leverEnd.x, leverEnd.y, '#3b82f6', 8);
  ctx.beginPath();
  ctx.arc(leverEnd.x, leverEnd.y, 14, 0, 2 * Math.PI);
  ctx.fillStyle = '#64748b';
  ctx.fill();

  drawArrow(ctx, 0, 0, HANDLE_PX * axes.y.x, HANDLE_PX * axes.y.y, '#f59e0b', 8);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2 * Math.PI);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
}

function drawHandleFrameLabels(ctx: Ctx, state: LeverState, showIndexes: boolean) {
  const thetaHRad = deg2rad(state.angles.theta_h);
  const alphaRad = deg2rad(state.angles.alpha);
  const axes = handleAxes(thetaHRad);
  const r = HANDLE_AXIS_PX + 12;
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 16px system-ui';
  ctx.fillText(showIndexes ? 'X_h' : 'X', r * axes.x.x, -r * axes.x.y);
  ctx.fillText(showIndexes ? 'Y_h' : 'Y', r * axes.y.x, -r * axes.y.y);
  polarLabel(ctx, 'α', 65, thetaHRad + alphaRad / 2, '#ec4899');
}

function drawWorldFrameLabel(ctx: Ctx, state: LeverState, task: ViewOptions['task']) {
  const offset = deg2rad(10); // nudged so the symbol does not sit on the lever
  if (task === 'impact') {
    polarLabel(ctx, 'γ', 85, deg2rad(state.angles.gamma ?? 0) - offset, '#14b8a6');
  } else {
    polarLabel(ctx, 'ψ', 65, deg2rad(state.angles.psi) - offset, '#3b82f6');
  }
}

/** Main scene: handle, lever and mass around the joint, in a Y-up frame centred on the canvas. */
export function drawScene(
  ctx: Ctx,
  system: HapticLeverSystem,
  state: LeverState,
  options: ViewOptions,
  range: number,
) {
  const { width, height } = ctx.canvas;
  const thetaHRad = deg2rad(state.angles.theta_h);
  const psiRad = deg2rad(state.angles.psi);
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(1, -1);

  if (options.forceFrame === 'global' && options.showAxes) drawWorldAxes(ctx);
  drawTaskRange(ctx, system, options, range);
  drawOrientationDial(ctx);
  if (options.forceFrame === 'handle') {
    const alphaRad = deg2rad(state.angles.alpha);
    strokeArc(ctx, 45, thetaHRad, thetaHRad + alphaRad, '#ec4899', state.angles.alpha < 0);
  } else {
    strokeArc(ctx, 45, 0, psiRad, '#3b82f6');
  }
  drawBodies(ctx, psiRad, thetaHRad, options.forceFrame);

  ctx.save();
  ctx.scale(1, -1);
  if (options.forceFrame === 'handle') drawHandleFrameLabels(ctx, state, options.showIndexes);
  else drawWorldFrameLabel(ctx, state, options.task);
  ctx.restore();
  ctx.restore();
}
