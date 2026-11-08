import type p5 from 'p5';
import { distance, PIXEL_SIZE, shapeBarX } from './layout.ts';
import { BACKGROUND_COLOR, BUTTON_COLOR, PAINT_COLORS, type WallState } from './state.ts';

const ERASER_COLOR = '#de5a04';
const COLOR_SLOTS = [1, 2, 3, 4, 5, 6] as const;

/** Screen 10: the paintable pixel grid with its colour and shape bars. */
export function drawPaintingPixels(
  p: p5,
  state: WallState,
  touches: readonly { x: number; y: number }[],
): void {
  p.background(BACKGROUND_COLOR);
  p.rectMode(p.CORNER);
  for (const pixel of state.pixels) {
    pixel.draw(p);
    pixel.pinch(touches, state.eraserDragging);
  }
  if (state.shapeBarOpen) drawColorBar(p, state);
  drawBarToggle(p, state);
  if (state.shapeBarOpen) drawShapeBar(p, state);
  drawEraser(p, state);
}

function isHovered(p: p5, x: number, y: number): boolean {
  return distance(p.mouseX, p.mouseY, x, y) < PIXEL_SIZE / 2;
}

function drawColorBar(p: p5, state: WallState): void {
  const y = state.bottomBarY;
  p.fill(50);
  p.rect(p.width / 25 + 26, y - 35, 382, 100, 10);
  for (const slot of COLOR_SLOTS) {
    const x = shapeBarX(slot, p.width);
    p.fill(PAINT_COLORS[slot - 1]);
    // The first two swatches set the stroke; the rest reuse it, as in the original.
    if (slot <= 2) p.stroke(0);
    p.strokeWeight(4);
    p.ellipse(x, y, PIXEL_SIZE, PIXEL_SIZE);
    if (slot === 6) p.noStroke();
    if (isHovered(p, x, y)) state.colorSelected = slot - 1;
  }
}

function drawBarToggle(p: p5, state: WallState): void {
  const y = state.bottomBarY;
  p.fill(BUTTON_COLOR);
  const knobX = state.shapeBarOpen ? (365 * p.width) / 1000 : (350 * p.width) / 1000;
  p.ellipse(knobX, y, PIXEL_SIZE / 2, PIXEL_SIZE / 2);
  p.noFill();
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(2);
  p.rect((342 * p.width) / 1000, y - PIXEL_SIZE / 4 - 2, 60, PIXEL_SIZE / 2 + 4, 20);
  p.noStroke();
}

function selectShapeOnHover(p: p5, state: WallState, slot: number, shape: number): void {
  if (isHovered(p, shapeBarX(slot, p.width), state.bottomBarY)) state.shapeSelected = shape;
}

function drawShapeBar(p: p5, state: WallState): void {
  const y = state.bottomBarY;
  const s = PIXEL_SIZE;
  const color = PAINT_COLORS[state.colorSelected];
  const x = (slot: number): number => shapeBarX(slot, p.width);
  p.fill(50);
  p.rect(-state.config.shapeBarOffsetX + (441 * p.width) / 1000, y - 35, 750, 100, 10);

  selectShapeOnHover(p, state, 13, 1);
  p.fill(color);
  p.ellipse(x(13), y, s, s);
  p.rectMode(p.CENTER);
  p.rect(x(14), y, s, s);
  p.rectMode(p.CORNER);
  selectShapeOnHover(p, state, 14, 2);

  drawQuarterSwatch(p, state, color, [x(15) - s / 2, y - s / 2, 0, p.PI / 2], 15, 3);
  drawQuarterSwatch(p, state, color, [x(16) + s / 2, y - s / 2, p.PI / 2, p.PI], 16, 4);
  drawQuarterSwatch(p, state, color, [x(17) - s / 2, y + s / 2, (3 * p.PI) / 2, 2 * p.PI], 17, 5);
  drawQuarterSwatch(p, state, color, [x(18) + s / 2, y + s / 2, p.PI, (3 * p.PI) / 2], 18, 6);

  const h = s / 2;
  drawTriangleSwatch(p, state, color, 19, [-h, -h, -h, h, h, -h], 7);
  drawTriangleSwatch(p, state, color, 20, [-h, -h, h, h, h, -h], 8);
  drawTriangleSwatch(p, state, color, 21, [-h, -h, h, h, -h, h], 9);
  drawTriangleSwatch(p, state, color, 22, [h, -h, h, h, -h, h], 10);

  drawLeafSwatch(p, state, color, 23, 11);
  drawLeafSwatch(p, state, color, 24, 12);
}

function drawQuarterSwatch(
  p: p5,
  state: WallState,
  color: string,
  [cx, cy, start, stop]: [number, number, number, number],
  slot: number,
  shape: number,
): void {
  p.fill(color);
  p.noStroke();
  // PixelGrid sets square caps before every quarter swatch except the first.
  if (state.config.squareShapeCaps && slot > 15) p.strokeCap(p.SQUARE);
  p.arc(cx, cy, PIXEL_SIZE * 2, PIXEL_SIZE * 2, start, stop);
  selectShapeOnHover(p, state, slot, shape);
}

function drawTriangleSwatch(
  p: p5,
  state: WallState,
  color: string,
  slot: number,
  [x1, y1, x2, y2, x3, y3]: number[],
  shape: number,
): void {
  const cx = shapeBarX(slot, p.width);
  const cy = state.bottomBarY;
  p.fill(color);
  p.noStroke();
  p.triangle(cx + x1, cy + y1, cx + x2, cy + y2, cx + x3, cy + y3);
  selectShapeOnHover(p, state, slot, shape);
}

function drawLeafSwatch(p: p5, state: WallState, color: string, slot: number, shape: number): void {
  const s = PIXEL_SIZE;
  const flip = shape === 12 ? -1 : 1;
  const firstStart = shape === 12 ? p.PI / 2 : 0;
  p.fill(color);
  p.noStroke();
  p.push();
  p.translate(shapeBarX(slot, p.width), state.bottomBarY);
  p.fill(color);
  p.stroke(color);
  p.strokeWeight(0.5);
  p.push();
  p.translate((flip * -s) / 2, -s / 2);
  p.arc(0, 0, s * 2, s * 2, firstStart, firstStart + p.PI / 2, p.CHORD);
  p.pop();
  p.push();
  p.translate((flip * s) / 2, s / 2);
  p.arc(0, 0, s * 2, s * 2, firstStart + p.PI, firstStart + (3 * p.PI) / 2, p.CHORD);
  p.pop();
  p.pop();
  selectShapeOnHover(p, state, slot, shape);
}

function drawEraser(p: p5, state: WallState): void {
  if (state.eraserDragging) {
    p.noStroke();
    p.fill('#000000');
    p.strokeWeight(30);
    p.stroke(ERASER_COLOR);
    p.strokeCap(p.ROUND);
    p.line(p.mouseX, 0, p.mouseX - 10, p.height);
    p.strokeWeight(8);
    p.stroke('#000000');
    p.line(p.mouseX, 0, p.mouseX - 10, p.height);
    return;
  }
  p.fill('#000000');
  // The original passes the width as the height of this strip; kept for identical rendering.
  p.rect(0, 0, 12, p.width);
  p.strokeWeight(3);
  p.stroke(ERASER_COLOR);
  p.line(5, p.height / 2 - 30, 5, p.height / 2 + 30);
  p.line(5, p.height / 4 - 30, 5, p.height / 4 + 30);
  p.line(5, (3 * p.height) / 4 - 30, 5, (3 * p.height) / 4 + 30);
}
