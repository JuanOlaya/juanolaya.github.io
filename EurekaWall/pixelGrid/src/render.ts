import type p5 from 'p5';
import { backgroundHex, cellCenter, colorHex, type Grid } from './grid.ts';
import { PALETTE } from './palette.ts';

const HEAVY_STROKE = 0.1;
const LIGHT_STROKE = 0.04;
const TICK_HALF = 30;

type Corner = readonly [number, number];
/** Corners of a cell of diameter `d` around (0, 0). */
function corners(d: number): Record<'tl' | 'tr' | 'bl' | 'br', Corner> {
  const r = d / 2;
  return { tl: [-r, -r], tr: [r, -r], bl: [-r, r], br: [r, r] };
}

function quarter(p: p5, corner: Corner, from: number, d: number): void {
  p.arc(corner[0], corner[1], d * 2, d * 2, from, from + p.HALF_PI, p.PIE);
}

function triangle(p: p5, a: Corner, b: Corner, c: Corner): void {
  p.triangle(a[0], a[1], b[0], b[1], c[0], c[1]);
}

/** Two quarter chords whose circles sit on opposite corners meet in a leaf. */
function leaf(p: p5, first: Corner, firstFrom: number, second: Corner, secondFrom: number, d: number): void {
  p.arc(first[0], first[1], d * 2, d * 2, firstFrom, firstFrom + p.HALF_PI, p.CHORD);
  p.arc(second[0], second[1], d * 2, d * 2, secondFrom, secondFrom + p.HALF_PI, p.CHORD);
}

type Corners = ReturnType<typeof corners>;

/** The twelve shapes of the original, centred on (0, 0): circle, square, four quarters, four triangles, two leaves. */
const SHAPES: readonly ((p: p5, c: Corners, d: number) => void)[] = [
  (p, _c, d) => p.circle(0, 0, d),
  (p, _c, d) => p.square(-d / 2, -d / 2, d),
  (p, c, d) => quarter(p, c.tl, 0, d),
  (p, c, d) => quarter(p, c.tr, p.HALF_PI, d),
  (p, c, d) => quarter(p, c.bl, p.PI + p.HALF_PI, d),
  (p, c, d) => quarter(p, c.br, p.PI, d),
  (p, c) => triangle(p, c.tl, c.bl, c.tr),
  (p, c) => triangle(p, c.tl, c.br, c.tr),
  (p, c) => triangle(p, c.tl, c.br, c.bl),
  (p, c) => triangle(p, c.tr, c.br, c.bl),
  (p, c, d) => leaf(p, c.tl, 0, c.br, p.PI, d),
  (p, c, d) => leaf(p, c.tr, p.HALF_PI, c.bl, p.PI + p.HALF_PI, d),
];
const FIRST_LIGHT_SHAPE = 7;

function drawShape(p: p5, shape: number, d: number): void {
  const draw = SHAPES[shape - 1];
  if (!draw) return;
  p.strokeWeight(d * (shape >= FIRST_LIGHT_SHAPE ? LIGHT_STROKE : HEAVY_STROKE));
  draw(p, corners(d), d);
}

/** Every shape is filled and outlined in the cell's colour (the outline keeps thin shapes visible). */
export function drawGrid(p: p5, grid: Grid, background: number, scaleOf: (index: number) => number): void {
  const { layout } = grid;
  grid.cells.forEach((cell, index) => {
    const hex = colorHex(cell.color, background);
    const { x, y } = cellCenter(layout, index);
    p.push();
    p.translate(x, y);
    p.scale(scaleOf(index));
    p.fill(hex);
    p.stroke(hex);
    drawShape(p, cell.shape, layout.cellSize);
    p.pop();
  });
}

/** The eraser handle: a strip on the left edge with three grip ticks; while dragged, a bar follows the pointer. */
export function drawEraser(p: p5, stripWidth: number, dragX: number | null): void {
  p.noStroke();
  p.fill(PALETTE.surface);
  p.rect(0, 0, stripWidth, p.height);
  p.stroke(PALETTE.accent);
  p.strokeWeight(3);
  const x = stripWidth / 2;
  for (const fraction of [0.25, 0.5, 0.75]) {
    const y = p.height * fraction;
    p.line(x, y - TICK_HALF, x, y + TICK_HALF);
  }
  if (dragX === null) return;
  p.strokeWeight(6);
  p.line(dragX, 0, dragX, p.height);
}

export function clearCanvas(p: p5, background: number): void {
  p.background(backgroundHex(background));
}
