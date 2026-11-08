import p5 from 'p5';
import { drawProfile, drawWebcamWindow } from './artwork.ts';
import type { WallConfig } from './config.ts';
import { drawGenerativeArt } from './generative-art.ts';
import { handleDrag, handleKey, handlePress, handleRelease, touchesOf } from './input.ts';
import { pixelGridPositions, PIXEL_SIZE } from './layout.ts';
import { drawMenu } from './menu.ts';
import { drawPaintingPixels } from './painting-pixels.ts';
import { Pixel } from './pixel.ts';
import { BACKGROUND_COLOR, createWallState, type WallState } from './state.ts';

const CURSOR_IDLE_MS = 1000;
const ARTIST_DIAMETER = 140;

/** Mounts the "Inspirational Wall" sketch shared by /ParticleCanvas/ and /PixelGrid/. */
export function mountInspirationalWall(config: WallConfig, host: HTMLElement = document.body): p5 {
  const state = createWallState(config);
  addLegacyButtons(host, state);
  return new p5((p: p5) => {
    let canvas: HTMLCanvasElement;
    p.setup = () => {
      const renderer = p.createCanvas(p.windowWidth, p.windowHeight);
      renderer.position(0, 0);
      renderer.style('z-index', '0');
      canvas = renderer.elt as HTMLCanvasElement;
      setupState(p, state);
    };
    p.draw = () => drawFrame(p, state, canvas);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.mousePressed = () => handlePress(p, state, canvas);
    p.mouseDragged = () => handleDrag(p, state);
    p.mouseReleased = () => handleRelease(p, state);
    // p5 1.4 forwarded touch start/end to the mouse handlers; p5 1.11 only does so for touchmove.
    p.touchStarted = () => handlePress(p, state, canvas);
    p.touchEnded = () => handleRelease(p, state);
    p.keyPressed = () => handleKey(state, p.keyCode);
  }, host);
}

function setupState(p: p5, state: WallState): void {
  state.cursorHideAt = p.millis() + CURSOR_IDLE_MS;
  state.bottomBarY = p.height - (3 * PIXEL_SIZE) / 2;
  p.textFont('Work Sans');
  state.pixels = pixelGridPositions(p.width, p.height).map(({ x, y }) => new Pixel(x, y, p));
  // The original drew two numbers here for unused variables; keeping the draws keeps the
  // random sequence (and so the generative-art agents) identical.
  p.random(100);
  p.random(0, 3);
  state.artists = [
    { x: (9 * p.width) / 50, y: (13 * p.height) / 50, diameter: ARTIST_DIAMETER },
    { x: (9 * p.width) / 50, y: (37 * p.height) / 50, diameter: ARTIST_DIAMETER },
    { x: (30 * p.width) / 50, y: (13 * p.height) / 50, diameter: ARTIST_DIAMETER },
    { x: (30 * p.width) / 50, y: (37 * p.height) / 50, diameter: ARTIST_DIAMETER },
  ];
  state.menuIcons = {
    first: [p.width / 4, p.height / 2],
    second: [p.width / 2, p.height / 2],
    third: [(3 * p.width) / 4, p.height / 2],
  };
}

function drawFrame(p: p5, state: WallState, canvas: HTMLCanvasElement): void {
  if (state.generalMode === 1) drawWall(p, state, canvas);
  if (state.generalMode === 2) p.background('#3F1801');
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
  if (screen === 0) {
    p.background(BACKGROUND_COLOR);
    canvas.style.display = 'block';
    drawMenu(p, state);
    p.fill(0);
  }
  if (screen === 10 || screen === 11 || screen === 12) drawPaintingPixels(p, state, touchesOf(p));
  if (screen === 20) drawGenerativeArt(p, state, touchesOf(p));
  if (screen === 30) {
    p.background(255, 255, 255, 0);
    drawWebcamWindow(p, state);
  }
  if (screen === 31) {
    p.background('#FFFFFF');
    drawProfile(p, state);
  }
  p.textSize(20);
  p.fill(255);
}

/** The original page appended these two buttons to <body>; they sit under the canvas but are kept as published. */
function addLegacyButtons(host: HTMLElement, state: WallState): void {
  const trace = document.createElement('button');
  trace.textContent = 'Trace';
  trace.addEventListener('click', () => (state.clearBackground = !state.clearBackground));
  const pause = document.createElement('button');
  pause.textContent = 'Pause';
  pause.addEventListener('click', () => (state.paused = !state.paused));
  host.append(trace, pause);
}
