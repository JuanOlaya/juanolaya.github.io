import { frameScale } from '@shared/p5/frame-scale.ts';
import type p5 from 'p5';
import { BACKGROUND_COLOR, BUTTON_COLOR, type WallState } from './state.ts';

// The original rotated by frameCount / 50 and stepped the noise twice per frame (60 FPS).
const PROFILE_SPIN_PER_FRAME = 1 / 50;
const NOISE_STEP_BEFORE = 0.009;
const NOISE_STEP_AFTER = 0.0009;
const PENTAGON_MAX_RADIUS = 200;
const PENTAGON_POINTS = 5;

const WEBCAMS: Record<number, { label: string; hourOffset: number }> = {
  1: { label: 'Brașov - Romania', hourOffset: 1 },
  2: { label: 'Hong Kong - China', hourOffset: 6 },
  3: { label: 'Tokyo - Japan', hourOffset: 7 },
};

function clockText(hour: number, minute: number): string {
  return minute < 10 ? `${hour}:0${minute}` : `${hour}:${minute}`;
}

/**
 * Screen 30: frame and caption of the "window to another world". The live YouTube webcams it framed
 * are commented out in the original HTML; the original crashed here trying to show them, so only the canvas part remains.
 */
export function drawWebcamWindow(p: p5, state: WallState): void {
  p.textStyle(p.BOLD);
  p.textAlign(p.LEFT);
  p.textSize(20);
  const webcam = WEBCAMS[state.webcamStatus];
  if (webcam) {
    p.text(webcam.label, 50, 25);
    p.text(clockText(p.hour() + webcam.hourOffset, p.minute()), 50, 50);
  }
  p.rectMode(p.CORNER);
  p.fill(BUTTON_COLOR);
  const buttonWidth = 120;
  const buttonHeight = 50;
  p.rect(p.width / 2 - buttonWidth / 2, 20, buttonWidth, buttonHeight);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(BACKGROUND_COLOR);
  p.text('Next', p.width / 2, 45);
  drawWindowFrame(p);
}

function drawWindowFrame(p: p5): void {
  const frames: [string, number, number][] = [
    [BUTTON_COLOR, 30, 0],
    ['#000000', 30, 56],
    ['#000000', 100, 170],
  ];
  for (const [color, weight, grow] of frames) {
    p.noFill();
    p.stroke(color);
    p.strokeWeight(weight);
    p.rectMode(p.CENTER);
    p.rect(p.width / 2, p.height / 2, 834 + grow, 468 + grow, 300);
  }
  p.noStroke();
}

/** Screen 31: placeholder artist profile with a pulsing pentagon. */
export function drawProfile(p: p5, state: WallState): void {
  p.fill('#8C8C8C');
  p.rect(0, 0, p.width, p.height / 12);
  p.fill('#B7B7B7');
  p.ellipse(p.width / 2, p.height / 24, p.height / 14, p.height / 14);
  p.noFill();
  p.stroke('#D1D1D1');
  p.strokeWeight(2);
  p.rect(p.width / 24, p.height / 2 - 75, 200, 150);
  p.noStroke();
  p.rectMode(p.CORNER);
  p.fill('#2D3235');
  p.textStyle(p.BOLD);
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(20);
  p.text('ANNA SCHMIDT', p.width / 24 + 15, p.height / 2 - 60);
  p.textStyle(p.NORMAL);
  p.textSize(20);
  p.fill('#98A5B1');
  p.text('Skulptur', p.width / 24 + 15, p.height / 2 - 40);
  // The original sampled noise twice per frame and discarded the first sample; only the steps matter.
  const frames = frameScale(p.deltaTime);
  state.noiseStep = state.noiseStep + NOISE_STEP_BEFORE * frames;
  const radius = p.noise(state.noiseStep) * PENTAGON_MAX_RADIUS;
  state.noiseStep = state.noiseStep + NOISE_STEP_AFTER * frames;
  state.profileAngle = state.profileAngle + PROFILE_SPIN_PER_FRAME * frames;
  p.push();
  p.translate(p.width / 2, p.height / 2);
  p.rotate(state.profileAngle);
  drawPolygon(p, radius, PENTAGON_POINTS);
  p.pop();
  drawHomeDots(p);
}

function drawPolygon(p: p5, radius: number, points: number): void {
  const angle = p.TWO_PI / points;
  p.fill(45);
  p.beginShape();
  for (let a = 0; a < p.TWO_PI; a += angle) {
    p.vertex(p.cos(a) * radius, p.sin(a) * radius);
  }
  p.endShape(p.CLOSE);
}

function drawHomeDots(p: p5): void {
  p.fill('#EB5278');
  p.noStroke();
  for (let i = 0, x = (375 * p.width) / 400; i < 4; i++, x = x + 20) {
    for (let j = 0, y = (358 * p.height) / 400; j < 3; j++, y = y + 20) {
      p.ellipse(x, y, 10, 10);
    }
  }
}
