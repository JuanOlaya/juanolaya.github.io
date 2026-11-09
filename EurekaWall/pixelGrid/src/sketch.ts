import { pixelDensityFor } from '@shared/p5/display.ts';
import { mountSketch, type Unmount } from '@shared/p5/mount.ts';
import { mountSketchUi } from '@shared/p5/sketch-ui.ts';
import type p5 from 'p5';
import {
  POP_MS,
  clearGrid,
  createGrid,
  eraseLeftOf,
  layoutGrid,
  nextBackground,
  popScale,
  resizeGrid,
  strokeCycle,
  strokePaint,
  type Grid,
  type Stroke,
} from './grid.ts';
import { ERASER_STRIP_PX, createPointerState, reducePointer, type PointerAction, type PointerIntent } from './input.ts';
import { clearCanvas, drawEraser, drawGrid } from './render.ts';
import { mountToolbar, type Tool } from './toolbar.ts';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const POINTER_TYPES = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'] as const;

interface ShapyState {
  grid: Grid;
  background: number;
  tool: Tool;
  pointer: ReturnType<typeof createPointerState>;
  paint: Stroke;
  pinch: Stroke;
  /** X of the eraser bar while it is being dragged. */
  eraserX: number | null;
  /** When each cell was last changed, for the pop feedback. */
  pops: Map<number, number>;
  reduced: boolean;
  /** Asks for a frame; a no-op while the sketch loops, a redraw once it does not. */
  invalidate: () => void;
}

function createState(reduced: boolean): ShapyState {
  return {
    grid: createGrid(layoutGrid(0, 0), Math.random),
    background: 0,
    tool: { shape: 1, color: 0 },
    pointer: createPointerState(),
    paint: { lastCell: -1 },
    pinch: { lastCell: -1 },
    eraserX: null,
    pops: new Map(),
    reduced,
    invalidate: () => {},
  };
}

function pop(state: ShapyState, index: number): void {
  if (index >= 0) state.pops.set(index, performance.now());
}

function apply(state: ShapyState, intent: PointerIntent): void {
  const { grid, tool } = state;
  if (intent.kind === 'paint') {
    if (strokePaint(grid, state.paint, intent.x, intent.y, tool.shape, tool.color)) pop(state, state.paint.lastCell);
  } else if (intent.kind === 'pinch') {
    if (strokeCycle(grid, state.pinch, intent.a, intent.b)) pop(state, state.pinch.lastCell);
  } else if (intent.kind === 'erase') {
    eraseLeftOf(grid, intent.x);
    state.eraserX = intent.x;
  } else {
    state.paint.lastCell = -1;
    state.pinch.lastCell = -1;
    state.eraserX = null;
  }
  state.invalidate();
}

function handlePointer(state: ShapyState, action: PointerAction): void {
  const result = reducePointer(state.pointer, action);
  state.pointer = result.state;
  if (result.intent) apply(state, result.intent);
}

/** Pointer Events on the canvas itself: mouse, touch and pen alike; capture keeps a drag that leaves the canvas. */
function attachPointers(canvas: HTMLElement, state: ShapyState): () => void {
  const onPointer = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const type = event.type.slice('pointer'.length) as PointerAction['type'];
    if (type === 'down') {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
    }
    handlePointer(state, { type, id: event.pointerId, x: event.clientX - rect.left, y: event.clientY - rect.top });
  };
  // Pointers lifted while the window is unfocused never send pointerup; drop them instead of sticking.
  const release = () => {
    state.pointer = createPointerState();
    apply(state, { kind: 'release' });
  };
  for (const type of POINTER_TYPES) canvas.addEventListener(type, onPointer);
  window.addEventListener('blur', release);
  return () => {
    for (const type of POINTER_TYPES) canvas.removeEventListener(type, onPointer);
    window.removeEventListener('blur', release);
  };
}

function scaleOf(state: ShapyState, now: number): (index: number) => number {
  for (const [index, at] of state.pops) if (now - at >= POP_MS) state.pops.delete(index);
  return (index) => popScale(now - (state.pops.get(index) ?? -POP_MS), state.reduced);
}

function createSketch(state: ShapyState, stage: HTMLElement, cleanups: (() => void)[]): (p: p5) => void {
  const fit = (p: p5) => {
    const { clientWidth: width, clientHeight: height } = stage;
    p.resizeCanvas(width, height);
    state.grid = resizeGrid(state.grid, layoutGrid(width, height, ERASER_STRIP_PX));
    state.invalidate();
  };
  return (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(stage.clientWidth, stage.clientHeight);
      p.pixelDensity(pixelDensityFor(window.devicePixelRatio));
      state.grid = createGrid(layoutGrid(p.width, p.height, ERASER_STRIP_PX), Math.random);
      // Under reduced motion nothing moves on its own, so frames are drawn only when something changes.
      state.invalidate = () => {
        if (state.reduced) p.redraw();
      };
      if (state.reduced) p.noLoop();
      const observer = new ResizeObserver(() => fit(p));
      observer.observe(stage);
      cleanups.push(() => observer.disconnect(), attachPointers(canvas.elt as HTMLElement, state));
    };
    p.draw = () => {
      clearCanvas(p, state.background);
      drawEraser(p, ERASER_STRIP_PX, state.eraserX);
      drawGrid(p, state.grid, state.background, scaleOf(state, performance.now()));
    };
  };
}

/** Reacts to the OS setting changing while the page is open, as the contract asks. */
function watchReducedMotion(state: ShapyState, onChange: (reduced: boolean) => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION);
  const listener = (event: MediaQueryListEvent) => {
    state.reduced = event.matches;
    onChange(event.matches);
  };
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

export interface ShapyHosts {
  stage: HTMLElement;
  panel: HTMLElement;
  tools: HTMLElement;
}

/** A grid of shapes to paint, pinch and wipe: the ShapyPresence tool of EurekaWall. */
export function mountShapyPresence(hosts: ShapyHosts): Unmount {
  const state = createState(window.matchMedia(REDUCED_MOTION).matches);
  const cleanups: (() => void)[] = [];
  let instance: p5 | undefined;
  const unmountSketch = mountSketch((p) => {
    instance = p;
    createSketch(state, hosts.stage, cleanups)(p);
  }, hosts.stage);
  cleanups.push(
    watchReducedMotion(state, (reduced) => (reduced ? instance?.noLoop() : instance?.loop())),
    mountToolbar(hosts.tools, state.tool),
    mountSketchUi(hosts.panel, {
      title: 'ShapyPresence',
      caption:
        'A shared board for remote presence. Tap a cell to paint it, pinch a cell with two fingers to change its shape, drag the handle on the left to wipe.',
      controls: [
        {
          label: 'Background',
          key: 'b',
          action: () => {
            state.background = nextBackground(state.background);
            state.invalidate();
          },
        },
        {
          label: 'Clear',
          key: 'c',
          action: () => {
            clearGrid(state.grid);
            state.invalidate();
          },
        },
      ],
    }),
  );
  return () => {
    for (const cleanup of cleanups.splice(0)) cleanup();
    unmountSketch();
  };
}
