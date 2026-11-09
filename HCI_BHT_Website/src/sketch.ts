import { pixelDensityFor, prefersReducedMotion } from '@shared/p5/display.ts';
import { mountSketch, type Unmount } from '@shared/p5/mount.ts';
import { mountSketchUi } from '@shared/p5/sketch-ui.ts';
import type p5 from 'p5';
import {
  CIRCLES,
  type ShrinkState,
  TRIGGER_RADIUS,
  circleCenter,
  circleDiameter,
  easeInOutCubic,
  isShrinkTrigger,
  nextProgress,
  triggerCenter,
} from './circles.ts';
import { PANEL_CAPTION, PANEL_TITLE } from './copy.ts';

// The canvas is the piece: it keeps its own navy instead of the site's #282828.
const BACKGROUND = '#1C3147';
// Behind the HCI logo, which is positioned over the canvas.
const CANVAS_Z_INDEX = '-1';
const HINT_DASH = [4, 6];
const HINT_ALPHA = 0.22;
const HINT_HOVER_ALPHA = 0.6;

/** The empty sixth spot, drawn as a dashed ring so the hidden interaction can be found. */
function drawTriggerHint(p: p5, state: ShrinkState, hovered: boolean): void {
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

function drawCircles(p: p5, state: ShrinkState): void {
  const diameter = circleDiameter(p.width, p.height) * (1 - easeInOutCubic(state.progress));
  if (diameter <= 0) return;
  for (const circle of CIRCLES) {
    const { x, y } = circleCenter(circle, p.width, p.height);
    p.fill(circle.color);
    p.circle(x, y, diameter);
  }
}

function createSketch(state: ShrinkState): (p: p5) => void {
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
      state.progress = nextProgress(state, p.deltaTime / 1000);
      const hovered = isShrinkTrigger(p.mouseX, p.mouseY, p.width, p.height);
      p.cursor(hovered ? p.HAND : p.ARROW);
      p.background(BACKGROUND);
      drawTriggerHint(p, state, hovered);
      drawCircles(p, state);
    };
  };
}

/** Follows the OS motion setting while the page is open, not only at load. */
function followReducedMotion(state: ShrinkState): () => void {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onChange = (event: MediaQueryListEvent) => (state.reduced = event.matches);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/** Five coloured circles; pressing the empty sixth spot makes them all shrink away. */
export function mountHciSketch(host: HTMLElement): Unmount {
  const state: ShrinkState = { progress: 0, target: 0, paused: false, reduced: prefersReducedMotion() };
  const stopFollowing = followReducedMotion(state);
  const unmountSketch = mountSketch(createSketch(state), host);
  const unmountUi = mountSketchUi(host, {
    title: PANEL_TITLE,
    caption: PANEL_CAPTION,
    controls: [
      { label: 'Shrink', key: 's', action: () => (state.target = 1) },
      { label: 'Reset', key: 'r', action: () => (state.target = 0) },
      { label: 'Pause', key: ' ', action: () => (state.paused = !state.paused), pressed: () => state.paused },
    ],
  });
  return () => {
    stopFollowing();
    unmountUi();
    unmountSketch();
  };
}
