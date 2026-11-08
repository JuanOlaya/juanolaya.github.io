import type p5 from 'p5';
import { distance, nextPinchedStatus, PIXEL_SIZE, type Point } from './layout.ts';
import { PAINT_COLORS } from './state.ts';

export interface PixelRandom {
  random(min: number, max: number): number;
}

export interface Brush {
  shape: number;
  color: number;
}

/** A cell of the painting grid. `status` is the shape drawn: 1 circle, 2 square, 3–6 quarter arcs, 7–10 triangles, 11–12 leaves. */
export class Pixel {
  status = 1;
  colorIndex: number;
  diameter = PIXEL_SIZE;
  hasChangedColor = false;
  hasChangedStatus = false;

  constructor(
    readonly x: number,
    readonly y: number,
    rng: PixelRandom,
  ) {
    const colorRand = Math.round(rng.random(0, 4));
    this.colorIndex = colorRand <= 1 ? PAINT_COLORS.length - 1 : Math.round(rng.random(0, 4));
    // The original drew three more numbers for an opacity animation it never rendered;
    // drawing them keeps the random sequence, and so the colours, identical.
    rng.random(51, 254);
    rng.random(50, 87);
    rng.random(0, 2);
  }

  /** One finger (or the mouse) paints the pixel with the selected brush once per press. */
  press(pointer: Point, touchCount: number, eraserDragging: boolean, brush: Brush): void {
    if (touchCount > 1 || eraserDragging) return;
    if (distance(pointer.x, pointer.y, this.x, this.y) >= this.diameter / 2 + 7) {
      this.hasChangedColor = false;
      return;
    }
    if (this.hasChangedColor || this.hasChangedStatus) return;
    this.status = brush.shape;
    this.hasChangedColor = true;
    this.colorIndex = brush.color;
  }

  /** Two fingers inside the pixel cycle its shape once per pinch. */
  pinch(touches: readonly Point[], eraserDragging: boolean): void {
    if (touches.length !== 2 || eraserDragging) return;
    const radius = this.diameter / 2;
    const bothInside = touches.every((t) => distance(t.x, t.y, this.x, this.y) < radius);
    if (!bothInside) {
      this.hasChangedStatus = false;
      return;
    }
    if (this.hasChangedStatus || this.hasChangedColor) return;
    this.status = nextPinchedStatus(this.status);
    this.hasChangedStatus = true;
  }

  /** The eraser sweeps from the left edge: every pixel left of the pointer is reset. */
  erase(pointerX: number, eraserDragging: boolean): void {
    if (!eraserDragging || pointerX <= this.x) return;
    this.status = 1;
    this.colorIndex = 0;
    this.diameter = PIXEL_SIZE;
  }

  release(): void {
    this.hasChangedColor = false;
    this.hasChangedStatus = false;
  }

  draw(p: p5): void {
    const color = PAINT_COLORS[this.colorIndex];
    p.fill(color);
    if (this.status === 1) this.drawCircle(p, color);
    else if (this.status === 2) this.drawSquare(p, color);
    else if (this.status >= 3 && this.status <= 6) this.drawQuarter(p, color);
    else if (this.status >= 7 && this.status <= 10) this.drawTriangle(p, color);
    else if (this.status === 11 || this.status === 12) this.drawLeaf(p, color);
  }

  private drawCircle(p: p5, color: string): void {
    p.ellipse(this.x, this.y, this.diameter);
    p.noFill();
    p.strokeWeight(5);
    p.stroke(color);
    p.ellipse(this.x, this.y, PIXEL_SIZE);
    p.noStroke();
  }

  private drawSquare(p: p5, color: string): void {
    p.rectMode(p.CENTER);
    p.stroke(color);
    p.rect(this.x, this.y, 50, 50);
    p.rectMode(p.CORNER);
    p.noStroke();
  }

  private drawQuarter(p: p5, color: string): void {
    const { x, y, diameter: d } = this;
    p.strokeWeight(5);
    p.stroke(color);
    if (this.status === 3) p.arc(x - d / 2 - 0, y - d / 2 - 0, d * 2 + 0, d * 2 + 0, 0, p.PI / 2, p.PIE);
    if (this.status === 4) p.arc(x + d / 2 + 2, y - d / 2 - 2, d * 2 + 3, d * 2 + 3, p.PI / 2, p.PI);
    if (this.status === 5)
      p.arc(x - d / 2 - 2, y + d / 2 + 2, d * 2 + 3, d * 2 + 3, (3 * p.PI) / 2, 2 * p.PI);
    if (this.status === 6) p.arc(x + d / 2 + 2, y + d / 2 + 2, d * 2 + 2, d * 2 + 0, p.PI, (3 * p.PI) / 2);
  }

  private drawTriangle(p: p5, color: string): void {
    const { x, y } = this;
    const h = this.diameter / 2;
    p.strokeWeight(2);
    p.stroke(color);
    if (this.status === 7) p.triangle(x - h, y - h, x - h, y + h, x + h, y - h);
    if (this.status === 8) p.triangle(x - h, y - h, x + h, y + h, x + h, y - h);
    if (this.status === 9) p.triangle(x - h, y - h, x + h, y + h, x - h, y + h);
    if (this.status === 10) p.triangle(x + h, y - h, x + h, y + h, x - h, y + h);
  }

  private drawLeaf(p: p5, color: string): void {
    const d = this.diameter;
    const size = d * 2 + 2;
    const flip = this.status === 12 ? -1 : 1;
    const firstStart = this.status === 12 ? p.PI / 2 : 0;
    p.push();
    p.translate(this.x, this.y);
    p.stroke(color);
    p.strokeWeight(1.7);
    p.push();
    p.translate((flip * -d) / 2, -d / 2);
    p.arc(0, 0, size, size, firstStart, firstStart + p.PI / 2, p.CHORD);
    p.pop();
    p.push();
    p.translate((flip * d) / 2, d / 2);
    p.arc(0, 0, size, size, firstStart + p.PI, firstStart + (3 * p.PI) / 2, p.CHORD);
    p.pop();
    p.pop();
  }
}
