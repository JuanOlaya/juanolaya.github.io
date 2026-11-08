import { mountSketch, type Unmount } from '@shared/p5/mount.ts';
import type p5 from 'p5';
import { drawProfile, drawWebcamWindow } from './artwork.ts';
import type { WallConfig } from './config.ts';
import { drawGenerativeArt } from './generative-art.ts';
import { handleDrag, handleKey, handlePress, handleRelease, touchesOf } from './input.ts';
import { artistSpots, pixelGridPositions, PIXEL_SIZE } from './layout.ts';
import { drawMenu } from './menu.ts';
import { drawPaintingPixels } from './painting-pixels.ts';
import { Pixel } from './pixel.ts';
import { GeneralMode, Screen } from './screens.ts';
import { BACKGROUND_COLOR, createWallState, type WallState } from './state.ts';

const CURSOR_IDLE_MS = 1000;
const ARTIST_DIAMETER = 140;
const CANVAS_Z_INDEX = '0';
const PLAIN_BACKGROUND = '#3F1801';

/** Mounts the "Inspirational Wall" sketch shared by /ParticleCanvas/ and /PixelGrid/. */
export function mountInspirationalWall(config: WallConfig, host: HTMLElement = document.body): Unmount {
  const state = createWallState(config);
  const buttons = addLegacyButtons(host, state);
  const unmountSketch = mountSketch((p: p5) => {
    let canvas: HTMLCanvasElement;
    p.setup = () => {
      const renderer = p.createCanvas(p.windowWidth, p.windowHeight);
      renderer.position(0, 0);
      renderer.style('z-index', CANVAS_Z_INDEX);
      canvas = canvasElement(renderer);
      setupState(p, state);
    };
    p.draw = () => drawFrame(p, state, canvas);
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      layoutWall(p, state);
    };
    p.mousePressed = () => handlePress(p, state, canvas);
    p.mouseDragged = () => handleDrag(p, state);
    p.mouseReleased = () => handleRelease(p, state);
    // p5 1.4 forwarded touch start/end to the mouse handlers; p5 1.11 only does so for touchmove.
    p.touchStarted = () => handlePress(p, state, canvas);
    p.touchEnded = () => handleRelease(p, state);
    p.keyPressed = () => handleKey(state, p.keyCode);
  }, host);
  return () => {
    unmountSketch();
    for (const button of buttons) button.remove();
  };
}

// p5 types `elt` as `any`; checking it keeps the rest of the sketch strictly typed.
function canvasElement(renderer: p5.Renderer): HTMLCanvasElement {
  const elt: unknown = renderer.elt;
  if (!(elt instanceof HTMLCanvasElement)) throw new Error('p5 did not create a 2D canvas');
  return elt;
}

function setupState(p: p5, state: WallState): void {
  state.cursorHideAt = p.millis() + CURSOR_IDLE_MS;
  p.textFont('Work Sans');
  state.pixels = pixelGridPositions(p.width, p.height).map(({ x, y }) => new Pixel(x, y, p));
  // The original drew two numbers here for unused variables; keeping the draws keeps the
  // random sequence (and so the generative-art agents) identical.
  p.random(100);
  p.random(0, 3);
  layoutWall(p, state);
}

/**
 * Everything placed relative to the canvas size, recomputed on resize. The painted pixel grid is
 * left alone so a resize does not wipe the painting.
 */
function layoutWall(p: p5, state: WallState): void {
  state.bottomBarY = p.height - (3 * PIXEL_SIZE) / 2;
  state.artists = artistSpots(p.width, p.height).map(({ x, y }) => ({ x, y, diameter: ARTIST_DIAMETER }));
  state.menuIcons = {
    first: [p.width / 4, p.height / 2],
    second: [p.width / 2, p.height / 2],
    third: [(3 * p.width) / 4, p.height / 2],
  };
}

function drawFrame(p: p5, state: WallState, canvas: HTMLCanvasElement): void {
  if (state.generalMode === GeneralMode.Wall) drawWall(p, state, canvas);
  if (state.generalMode === GeneralMode.Plain) p.background(PLAIN_BACKGROUND);
  p.fill(200, 200, 200);
}

/** Hides the cursor after a second without movement, as on the touch wall it was built for. */
function updateCursor(p: p5, state: WallState): void {
  const now = p.millis();
  if (p.mouseX !== p.pmouseX || p.mouseY !== p.pmouseY) {
    if (!state.showingCursor) {
      p.cursor('auto');
      state.showingCursor = true;
    }
    if (state.cursorHideAt < now + CURSOR_IDLE_MS) state.cursorHideAt = now + CURSOR_IDLE_MS;
    return;
  }
  if (state.showingCursor && now > state.cursorHideAt) {
    p.noCursor();
    state.showingCursor = false;
  }
}

function drawWall(p: p5, state: WallState, canvas: HTMLCanvasElement): void {
  updateCursor(p, state);
  const screen = state.screen;
  if (screen === Screen.Menu) {
    p.background(BACKGROUND_COLOR);
    canvas.style.display = 'block';
    drawMenu(p, state);
    p.fill(0);
  }
  if (screen === Screen.PixelGrid) drawPaintingPixels(p, state, touchesOf(p));
  if (screen === Screen.GenerativeArt) drawGenerativeArt(p, state, touchesOf(p));
  if (screen === Screen.Webcam) {
    p.background(255, 255, 255, 0);
    drawWebcamWindow(p, state);
  }
  if (screen === Screen.Profile) {
    p.background('#FFFFFF');
    drawProfile(p, state);
  }
  p.textSize(20);
  p.fill(255);
}

/** The original page appended these two buttons to <body>; they sit under the canvas but are kept as published. */
function addLegacyButtons(host: HTMLElement, state: WallState): HTMLButtonElement[] {
  const trace = document.createElement('button');
  trace.textContent = 'Trace';
  trace.addEventListener('click', () => (state.clearBackground = !state.clearBackground));
  const pause = document.createElement('button');
  pause.textContent = 'Pause';
  pause.addEventListener('click', () => (state.paused = !state.paused));
  host.append(trace, pause);
  return [trace, pause];
}
