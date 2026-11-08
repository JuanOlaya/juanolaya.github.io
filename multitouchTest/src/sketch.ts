import { pixelDensityFor, prefersReducedMotion } from '@shared/p5/display.ts';
import { frameScale } from '@shared/p5/frame-scale.ts';
import { mountSketch, type Unmount } from '@shared/p5/mount.ts';
import { mountSketchUi } from '@shared/p5/sketch-ui.ts';
import type p5 from 'p5';
import {
  type TouchMap,
  coordinateLines,
  fadePoints,
  movePoint,
  pressPoint,
  releasePoint,
} from './touches.ts';

const INNER_DIAMETER = 70;
const HALO_DIAMETER = 125;
const LINE_HEIGHT = 18;

interface MultitouchState {
  points: TouchMap;
  showCoordinates: boolean;
  reduced: boolean;
}

/** Every pointer (finger, pen or mouse) is tracked by id, so any number of touches show at once. */
function bindPointers(canvas: HTMLCanvasElement, state: MultitouchState): void {
  const position = (event: PointerEvent) => [event.offsetX, event.offsetY] as const;
  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    pressPoint(state.points, event.pointerId, ...position(event), event.pointerType);
  });
  canvas.addEventListener('pointermove', (event) =>
    movePoint(state.points, event.pointerId, ...position(event)),
  );
  const release = (event: PointerEvent) => releasePoint(state.points, event.pointerId, state.reduced);
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
}

function drawPoints(p: p5, state: MultitouchState): void {
  p.noStroke();
  for (const point of state.points.values()) {
    p.fill(200, 0, 0, 255 * point.alpha);
    p.circle(point.x, point.y, INNER_DIAMETER);
    p.fill(200, 0, 0, 70 * point.alpha);
    p.circle(point.x, point.y, HALO_DIAMETER);
  }
}

function drawCoordinates(p: p5, state: MultitouchState): void {
  const lines = coordinateLines(state.points);
  p.fill(230, 120, 120);
  p.textSize(14);
  p.textAlign(p.LEFT, p.TOP);
  const text = lines.length ? lines : ['Touch the screen with one or more fingers'];
  text.forEach((line, index) => p.text(line, 12, 12 + index * LINE_HEIGHT));
}

function createSketch(state: MultitouchState): (p: p5) => void {
  return (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      p.pixelDensity(pixelDensityFor(window.devicePixelRatio));
      canvas.elt.setAttribute('aria-label', 'Multitouch test: each touch draws a red circle');
      bindPointers(canvas.elt, state);
    };
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.draw = () => {
      fadePoints(state.points, frameScale(p.deltaTime));
      p.background(0);
      drawPoints(p, state);
      if (state.showCoordinates) drawCoordinates(p, state);
    };
  };
}

/** Holds the loop while the tab is hidden; nothing changes that nobody can see. */
function bindVisibility(getSketch: () => p5 | undefined): () => void {
  const onChange = () => (document.hidden ? getSketch()?.noLoop() : getSketch()?.loop());
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

/** Multitouch test: a red circle under every finger, with its coordinates listed in the corner. */
export function mountMultitouch(host: HTMLElement): Unmount {
  const state: MultitouchState = {
    points: new Map(),
    showCoordinates: true,
    reduced: prefersReducedMotion(),
  };
  let sketch: p5 | undefined;
  const unmountSketch = mountSketch((p) => {
    sketch = p;
    createSketch(state)(p);
  }, host);
  const unbindVisibility = bindVisibility(() => sketch);
  const unmountUi = mountSketchUi(host, {
    title: 'Multitouch Test',
    caption: 'Touch with several fingers (or click and drag): each pointer gets its own circle.',
    controls: [
      {
        label: 'Coordinates',
        key: 'c',
        action: () => (state.showCoordinates = !state.showCoordinates),
        pressed: () => state.showCoordinates,
      },
      { label: 'Clear', key: 'x', action: () => state.points.clear() },
    ],
  });
  let mounted = true;
  return () => {
    if (!mounted) return;
    mounted = false;
    unmountUi();
    unbindVisibility();
    unmountSketch();
  };
}
