import { HapticLeverSystem, deg2rad, normalizeAngle } from './lever-physics.ts';

type Ctx = CanvasRenderingContext2D;

export function drawArrow(
  ctx: Ctx,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lineWidth = 2,
) {
  const head = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Filled pie slice from the origin, between two angles in degrees. */
export function fillSector(
  ctx: Ctx,
  radius: number,
  fromDeg: number,
  toDeg: number,
  color: string,
  ccw = false,
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, deg2rad(fromDeg), deg2rad(toDeg), ccw);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawHandleRangeArc(ctx: Ctx, radius: number, range: number, isMask = false) {
  // The mask repaints the canvas background so the lever sector does not show through the handle sector.
  const color = isMask ? '#f8fafc' : 'rgba(251, 146, 60, 0.35)';
  fillSector(ctx, radius, 90 + range, 90 - range, color, true);
}

export function drawLeverRangeArc(ctx: Ctx, system: HapticLeverSystem, radius: number, range: number) {
  const psiPositive = normalizeAngle(90 + range + 180 + system.servoFollowing(range));
  const psiNegative = normalizeAngle(90 - range + 180 + system.servoFollowing(-range));
  fillSector(ctx, radius, psiNegative, psiPositive, 'rgba(59, 130, 246, 0.15)');
}

export function strokeArc(ctx: Ctx, radius: number, from: number, to: number, color: string, ccw = false) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, radius, from, to, ccw);
  ctx.stroke();
  ctx.restore();
}

export function drawWorldAxes(ctx: Ctx) {
  const axisLength = 160;
  ctx.save();
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-axisLength, 0);
  ctx.lineTo(axisLength, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -axisLength);
  ctx.lineTo(0, axisLength);
  ctx.stroke();
  ctx.restore();
}

function drawDialTicks(ctx: Ctx, dialRadius: number) {
  for (let d = 0; d < 360; d += 30) {
    const angleRad = deg2rad(d);
    const tickLength = d % 90 === 0 ? 10 : 5;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    ctx.beginPath();
    ctx.moveTo((dialRadius - tickLength) * cosA, (dialRadius - tickLength) * sinA);
    ctx.lineTo(dialRadius * cosA, dialRadius * sinA);
    ctx.stroke();
  }
}

export function drawOrientationDial(ctx: Ctx) {
  const dialRadius = 120;
  ctx.save();
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, dialRadius, 0, 2 * Math.PI);
  ctx.stroke();
  drawDialTicks(ctx, dialRadius);

  ctx.save();
  ctx.scale(1, -1); // text upright inside the Y-flipped frame
  ctx.fillStyle = '#475569';
  ctx.font = '14px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const labelRadius = dialRadius + 18;
  for (const d of [0, 90, 180, 270]) {
    const angleRad = deg2rad(d);
    ctx.fillText(`${d}°`, labelRadius * Math.cos(angleRad), -labelRadius * Math.sin(angleRad));
  }
  ctx.restore();
  ctx.restore();
}

/** Draws centred text at a polar position of the Y-flipped frame (call inside an un-flipped save). */
export function polarLabel(ctx: Ctx, text: string, radius: number, angleRad: number, color: string) {
  ctx.fillStyle = color;
  ctx.font = 'bold 20px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, radius * Math.cos(angleRad), -radius * Math.sin(angleRad));
}
