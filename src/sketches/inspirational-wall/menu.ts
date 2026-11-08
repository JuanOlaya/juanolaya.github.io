import type p5 from 'p5';
import { BACKGROUND_COLOR, BUTTON_COLOR, MENU_BUTTON_DIAMETER, type WallState } from './state.ts';

const D = MENU_BUTTON_DIAMETER;
const LETTER_STEPS = 20;

interface RoundedLabel {
  text: string;
  cx: number;
  cy: number;
  radius: number;
  initialGap: number;
  size: number;
}

/** Letters placed around a circle, each rotated to follow it. The labels are spelled backwards on purpose. */
function drawRoundedLabel(p: p5, label: RoundedLabel): void {
  for (let i = 0; i < label.text.length; i += 1) {
    const angle = (i * 2 * p.PI) / LETTER_STEPS + label.initialGap;
    const x = label.cx + label.radius * p.cos(angle);
    const y = label.cy + label.radius * p.sin(angle);
    p.push();
    p.translate(x, y);
    p.rotate(angle - p.PI / 2);
    p.fill(BUTTON_COLOR);
    p.stroke(BUTTON_COLOR);
    p.strokeWeight(1);
    p.textStyle(p.BOLD);
    p.textSize(label.size);
    p.text(label.text[i], 0, 0);
    p.pop();
  }
}

/** Screen 0: three round buttons leading to the pixel grid, the generative art and the artwork screens. */
export function drawMenu(p: p5, state: WallState): void {
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(BUTTON_COLOR);
  drawPixelsIcon(p, state.menuIcons.first);
  drawGenerativeIcon(p, state.menuIcons.second);
  drawBridgeIcon(p, state.menuIcons.third);
}

function drawPixelsIcon(p: p5, [x, y]: [number, number]): void {
  p.strokeWeight(20);
  p.fill(BUTTON_COLOR);
  p.noStroke();
  drawRoundedLabel(p, {
    text: 'SLEXIP',
    cx: x,
    cy: y,
    radius: D / 2,
    initialGap: 15 * (p.PI / 60),
    size: 25,
  });
  p.fill(BACKGROUND_COLOR);
  p.noStroke();
  p.arc(x, y, D - 25, D - 25, 9 * (p.PI / 50), 41 * (p.PI / 50));
  p.noFill();
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(12);
  p.strokeCap(p.SQUARE);
  p.arc(x, y, D, D, 41 * (p.PI / 50), 9 * (p.PI / 50));
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(1.4);
  for (let i = 0, r = 138; i < 11; i++, r = r - 11) {
    p.arc(x, y, r, r, 41 * (p.PI / 50), 9 * (p.PI / 50));
  }
}

function drawGenerativeIcon(p: p5, [x, y]: [number, number]): void {
  const start = p.PI - (100 * p.PI) / 550;
  const stop = 2 * p.PI + (100 * p.PI) / 550;
  p.strokeWeight(1.4);
  for (let i = 0; i < 120; i = i + 5.2) {
    p.line(x - D / 2 + 5, y - D / 2 + i, x + D / 2 - 5, y - D / 2 + i);
  }
  p.fill(BACKGROUND_COLOR);
  p.noStroke();
  p.ellipse(x, y, 22, 22);
  p.noFill();
  p.stroke(BACKGROUND_COLOR);
  p.strokeWeight(30);
  p.strokeCap(p.SQUARE);
  p.arc(x, y, D + 40, D + 40, start, stop);
  p.noFill();
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(12);
  p.strokeCap(p.SQUARE);
  p.arc(x, y, D, D, start, stop);
  p.fill(BACKGROUND_COLOR);
  p.noStroke();
  p.arc(x, y, D - 12, D - 12, stop, start);
  p.fill(BUTTON_COLOR);
  drawRoundedLabel(p, {
    text: 'TRANEG',
    cx: x,
    cy: y,
    radius: D / 2,
    initialGap: 12 * (p.PI / 50),
    size: 22,
  });
}

function drawBridgeIcon(p: p5, [x, y]: [number, number]): void {
  const start = p.PI - (100 * p.PI) / 550;
  const stop = 2 * p.PI + (100 * p.PI) / 550;
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(1.4);
  for (let i = 0; i < 145; i = i + 5.2) {
    p.line(x + i - 70, y + D / 4, x + i - 70, y - D / 2);
  }
  p.fill(BACKGROUND_COLOR);
  p.noStroke();
  p.ellipse(x, y, 22, 22);
  p.rect(x - 11, y, 22, 30);
  p.triangle(x, y - D / 2 - 1, x - D / 2 - 20, y - D / 2 - 1, x - D / 2 - 20, y - (23 * D) / 100);
  p.triangle(x, y - D / 2 - 1, x + D / 2 + 20, y - D / 2 - 1, x + D / 2 + 20, y - (23 * D) / 100);
  p.noFill();
  p.stroke(BUTTON_COLOR);
  p.strokeWeight(12);
  p.strokeCap(p.SQUARE);
  p.arc(x, y, D, D, start, stop);
  p.fill(BACKGROUND_COLOR);
  p.noStroke();
  p.arc(x, y, D, D, stop, start);
  p.strokeWeight(20);
  p.fill(BUTTON_COLOR);
  p.noStroke();
  drawRoundedLabel(p, { text: 'EGDIRB', cx: x, cy: y, radius: D / 2, initialGap: 7 * (p.PI / 29), size: 25 });
}
