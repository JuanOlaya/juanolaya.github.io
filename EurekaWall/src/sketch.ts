import { pixelDensityFor, prefersReducedMotion } from '@shared/p5/display.ts';
import { frameScale } from '@shared/p5/frame-scale.ts';
import { mountSketch, type Unmount } from '@shared/p5/mount.ts';
import { mountSketchUi, type SketchControl } from '@shared/p5/sketch-ui.ts';
import type p5 from 'p5';
import balconyIcon from '../assets/balconity.svg';
import introIcon from '../assets/brainIntro.svg';
import gridIcon from '../assets/grid.svg';
import museFlowIcon from '../assets/museFlow4.svg';
import swarmIcon from '../assets/particleCanvas.svg';
import { advanceCycle, selectApp, stepSelection, WALL_APPS, type WallApp } from './apps.ts';
import { approach, buttonAt, isOnStart, wheelLayout, type WheelLayout } from './layout.ts';

const BACKGROUND = '#292929';
const BAND = '#333333';
const BUTTON_FACE = 240;
const ICON_URLS = [introIcon, museFlowIcon, swarmIcon, balconyIcon, gridIcon];
const FRAME_MS = 1000 / 60;
const COUNT = WALL_APPS.length;

interface WallState {
  selected: number;
  elapsedMs: number;
  autoCycle: boolean;
  /** 0..1 per button: how far its selection rings have grown. */
  highlight: number[];
  icons: (p5.Image | undefined)[];
  layout: WheelLayout;
}

function createState(reduced: boolean): WallState {
  return {
    selected: 0,
    elapsedMs: 0,
    // Reduced motion: nothing changes on its own until the visitor asks for it.
    autoCycle: !reduced,
    highlight: WALL_APPS.map((_, i) => (i === 0 ? 1 : 0)),
    icons: [],
    layout: wheelLayout(1, 1, COUNT),
  };
}

function launch(app: WallApp): void {
  const url = new URL(app.href, window.location.href).href;
  if (app.external) window.open(url, '_blank', 'noopener');
  else window.location.assign(url);
}

function choose(state: WallState, index: number): void {
  const next = selectApp(index, COUNT);
  state.selected = next.selected;
  state.elapsedMs = next.elapsedMs;
}

function updateState(state: WallState, frames: number, reduced: boolean): void {
  if (state.autoCycle) {
    const next = advanceCycle(state, frames * FRAME_MS, COUNT);
    state.selected = next.selected;
    state.elapsedMs = next.elapsedMs;
  }
  // Reduced motion: the rings jump to their new size instead of growing.
  const step = reduced ? Number.POSITIVE_INFINITY : frames;
  state.highlight = state.highlight.map((h, i) => approach(h, i === state.selected ? 1 : 0, step));
}

/** The ring and the two arcs the original drew around the highlighted tool. */
function drawSelectionRings(
  p: p5,
  center: { x: number; y: number },
  d: number,
  color: string,
  grow: number,
): void {
  const c = p.color(color);
  c.setAlpha(255 * grow);
  p.stroke(c);
  p.strokeWeight(d * 0.09);
  p.strokeCap(p.SQUARE);
  p.circle(center.x, center.y, d * (1 + 0.09 * grow));
  const outer = d * (1 + 0.42 * grow);
  p.arc(center.x, center.y, outer, outer, (-25 * p.PI) / 100, (10 * p.PI) / 100);
  p.arc(center.x, center.y, outer, outer, (70 * p.PI) / 100, (105 * p.PI) / 100);
}

function drawButton(p: p5, state: WallState, index: number): void {
  const center = state.layout.buttons[index];
  const d = state.layout.buttonDiameter;
  const app = WALL_APPS[index];
  p.noStroke();
  p.fill(BUTTON_FACE);
  p.circle(center.x, center.y, d);
  p.noFill();
  p.stroke(app.color);
  p.strokeWeight(d * 0.09);
  p.circle(center.x, center.y, d);
  if (state.highlight[index] > 0.01) drawSelectionRings(p, center, d, app.color, state.highlight[index]);
  const icon = state.icons[index];
  if (icon) p.image(icon, center.x - d * 0.27, center.y - d * 0.27, d * 0.54, d * 0.54);
}

function drawStart(p: p5, state: WallState): void {
  const { start } = state.layout;
  p.noStroke();
  p.rectMode(p.CENTER);
  p.fill(WALL_APPS[state.selected].color);
  p.rect(start.x, start.y, start.width, start.height, 10);
  p.rectMode(p.CORNER);
  p.fill(BAND);
  p.textAlign(p.CENTER, p.CENTER);
  p.textStyle(p.BOLD);
  p.textSize(start.height * 0.5);
  p.text('Start', start.x, start.y);
}

function drawTitlePill(p: p5, app: WallApp, x: number, y: number, size: number): void {
  p.textSize(size);
  p.textStyle(p.BOLD);
  const pillWidth = p.fontWidth(app.title) + size * 1.6;
  p.rectMode(p.CENTER);
  p.noFill();
  p.stroke(app.color);
  p.strokeWeight(4);
  p.rect(x, y, pillWidth, size * 1.5, 9);
  p.rectMode(p.CORNER);
  p.noStroke();
  p.fill(255);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(app.title, x, y);
}

function drawDescription(p: p5, state: WallState): void {
  const { pivot, radius } = state.layout;
  const app = WALL_APPS[state.selected];
  p.noStroke();
  p.fill(BAND);
  p.rect(0, pivot.y, p.width, p.height - pivot.y);
  const size = Math.min(Math.max(radius * 0.06, 18), 25);
  drawTitlePill(p, app, pivot.x, pivot.y + size * 2, size);
  const boxWidth = Math.min(p.width - 32, 640);
  p.textSize(size * 0.75);
  p.textStyle(p.NORMAL);
  p.textAlign(p.CENTER, p.TOP);
  p.text(app.description, (p.width - boxWidth) / 2, pivot.y + size * 3.4, boxWidth);
}

function drawWall(p: p5, state: WallState): void {
  p.background(BACKGROUND);
  drawDescription(p, state);
  for (let i = 0; i < COUNT; i += 1) drawButton(p, state, i);
  drawStart(p, state);
}

function pointerTarget(state: WallState, event: MouseEvent): number | 'start' | undefined {
  if (isOnStart(state.layout, event.offsetX, event.offsetY)) return 'start';
  const index = buttonAt(state.layout, event.offsetX, event.offsetY);
  return index < 0 ? undefined : index;
}

function listenToCanvas(canvas: HTMLCanvasElement, state: WallState): void {
  canvas.addEventListener('click', (event) => {
    const target = pointerTarget(state, event);
    if (target === 'start') launch(WALL_APPS[state.selected]);
    else if (target !== undefined) choose(state, target);
  });
  canvas.addEventListener('pointermove', (event) => {
    canvas.style.cursor = pointerTarget(state, event) === undefined ? 'default' : 'pointer';
  });
}

function loadIcons(p: p5, state: WallState): void {
  ICON_URLS.forEach((url, i) => {
    // p5 2 returns a promise; an icon that fails to load simply stays undrawn.
    p.loadImage(url).then(
      (image) => (state.icons[i] = image),
      () => undefined,
    );
  });
}

function createSketch(state: WallState, reduced: boolean): (p: p5) => void {
  return (p: p5) => {
    p.setup = () => {
      const renderer = p.createCanvas(p.windowWidth, p.windowHeight);
      p.pixelDensity(pixelDensityFor(window.devicePixelRatio));
      p.textFont('Work Sans');
      state.layout = wheelLayout(p.width, p.height, COUNT);
      listenToCanvas(renderer.elt, state);
      loadIcons(p, state);
    };
    p.draw = () => {
      updateState(state, frameScale(p.deltaTime), reduced);
      drawWall(p, state);
    };
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      state.layout = wheelLayout(p.width, p.height, COUNT);
    };
  };
}

function panelControls(state: WallState): SketchControl[] {
  const toggleCycle = () => {
    state.autoCycle = !state.autoCycle;
    state.elapsedMs = 0;
  };
  return [
    { label: 'Previous', key: 'p', action: () => choose(state, stepSelection(state.selected, -1, COUNT)) },
    { label: 'Next', key: 'n', action: () => choose(state, stepSelection(state.selected, 1, COUNT)) },
    { label: 'Start', key: 's', action: () => launch(WALL_APPS[state.selected]) },
    { label: 'Auto-cycle', key: ' ', action: toggleCycle, pressed: () => state.autoCycle },
  ];
}

/** Stops drawing while the tab is hidden, so the loop does not run in the background. */
function pauseWhileHidden(sketch: () => p5 | undefined): () => void {
  const sync = () => {
    const p = sketch();
    if (!p) return;
    if (document.hidden) p.noLoop();
    else p.loop();
  };
  const stop = () => {
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pagehide', stop);
  };
  document.addEventListener('visibilitychange', sync);
  // `mountSketch` removes the sketch on pagehide; a later `loop()` would restart the removed
  // instance's draw loop on a detached canvas, e.g. when a bfcache restore turns the tab visible.
  window.addEventListener('pagehide', stop);
  return stop;
}

/** The EurekaWall home: a half wheel of the toolkit's five tools and a Start button. */
export function mountEurekaWall(host: HTMLElement): Unmount {
  const reduced = prefersReducedMotion();
  const state = createState(reduced);
  let instance: p5 | undefined;
  const sketch = createSketch(state, reduced);
  const unmountSketch = mountSketch((p) => {
    instance = p;
    sketch(p);
  }, host);
  const stopPausing = pauseWhileHidden(() => instance);
  const unmountUi = mountSketchUi(host, {
    title: 'EurekaWall',
    caption: 'The inspirational toolkit for creatives. Pick a tool on the wheel, then press Start.',
    controls: panelControls(state),
    placement: 'top',
  });
  return () => {
    stopPausing();
    unmountUi();
    unmountSketch();
  };
}
