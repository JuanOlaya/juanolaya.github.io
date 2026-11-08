import { pixelDensityFor, prefersReducedMotion } from '@shared/p5/display.ts';
import { mountSketch, type Unmount } from '@shared/p5/mount.ts';
import { mountSketchUi } from '@shared/p5/sketch-ui.ts';
import type p5 from 'p5';
import {
  CIRCLES,
  TRIGGER_RADIUS,
  circleCenter,
  circleDiameter,
  easeInOutCubic,
  isShrinkTrigger,
  stepProgress,
  triggerCenter,
} from './circles.ts';

const BACKGROUND = '#1C3147';
// Behind the HCI logo, which is positioned over the canvas.
const CANVAS_Z_INDEX = '-1';
// The original lost 1 px of an 80 px circle per frame: about 1.3 s at 60 FPS.
const SHRINK_SECONDS = 1.4;
const MAX_STEP_SECONDS = 0.05;
const HINT_DASH = [4, 6];
const HINT_ALPHA = 0.22;
const HINT_HOVER_ALPHA = 0.6;

interface HciState {
  /** 0 = full circles, 1 = gone; eased on the way. */
  progress: number;
  target: number;
  paused: boolean;
}

/** The empty sixth spot, drawn as a dashed ring so the hidden interaction can be found. */
function drawTriggerHint(p: p5, state: HciState, hovered: boolean): void {
  const { x, y } = triggerCenter(p.width, p.height);
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  const alpha = state.target === 1 ? HINT_ALPHA / 2 : hovered ? HINT_HOVER_ALPHA : HINT_ALPHA;
  ctx.save();
  ctx.setLineDash(HINT_DASH);
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, TRIGGER_RADIUS - 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawCircles(p: p5, state: HciState): void {
  const diameter = circleDiameter(p.width, p.height) * (1 - easeInOutCubic(state.progress));
  if (diameter <= 0) return;
  for (const circle of CIRCLES) {
    const { x, y } = circleCenter(circle, p.width, p.height);
    p.fill(circle.color);
    p.circle(x, y, diameter);
  }
}

function createSketch(state: HciState, reduced: boolean): (p: p5) => void {
  return (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      p.pixelDensity(pixelDensityFor(window.devicePixelRatio));
      canvas.position(0, 0);
      canvas.style('z-index', CANVAS_Z_INDEX);
      p.noStroke();
    };
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.mousePressed = () => {
      if (isShrinkTrigger(p.mouseX, p.mouseY, p.width, p.height)) state.target = 1;
    };
    p.draw = () => {
      if (reduced) state.progress = state.target;
      else if (!state.paused) {
        const seconds = Math.min(p.deltaTime / 1000, MAX_STEP_SECONDS);
        state.progress = stepProgress(state.progress, state.target, seconds, SHRINK_SECONDS);
      }
      const hovered = isShrinkTrigger(p.mouseX, p.mouseY, p.width, p.height);
      p.cursor(hovered ? p.HAND : p.ARROW);
      p.background(BACKGROUND);
      drawTriggerHint(p, state, hovered);
      drawCircles(p, state);
    };
  };
}

/** Five coloured circles; pressing the empty sixth spot makes them all shrink away. */
export function mountHciSketch(host: HTMLElement): Unmount {
  const state: HciState = { progress: 0, target: 0, paused: false };
  const unmountSketch = mountSketch(createSketch(state, prefersReducedMotion()), host);
  const unmountUi = mountSketchUi(host, {
    title: 'HCI · BHT Berlin',
    caption: 'Press the dashed spot to make the circles shrink away.',
    controls: [
      { label: 'Shrink', key: 's', action: () => (state.target = 1) },
      { label: 'Reset', key: 'r', action: () => (state.target = 0) },
      { label: 'Pause', key: ' ', action: () => (state.paused = !state.paused), pressed: () => state.paused },
    ],
  });
  return () => {
    unmountUi();
    unmountSketch();
  };
}
