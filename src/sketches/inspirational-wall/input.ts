import type p5 from 'p5';
import {
  distance,
  isInHomeCorner,
  PIXEL_SIZE,
  shapeBarX,
  toolbarButtonAt,
  type Point,
  type ToolbarButton,
} from './layout.ts';
import { GeneralMode, Screen } from './screens.ts';
import { BACKGROUND_COLOR, MENU_BUTTON_DIAMETER, type WallState } from './state.ts';

const MAX_SHAPES = 150;
const MIN_SHAPES = 6;
const SHAPES_STEP = 3;
const KEY_WALL = 49; // '1'
const KEY_PLAIN = 50; // '2'
const WEBCAM_COUNT = 3;

export function touchesOf(p: p5): Point[] {
  return p.touches as Point[];
}

function pointer(p: p5): Point {
  return { x: p.mouseX, y: p.mouseY };
}

function onMenuIcon(p: p5, [x, y]: [number, number]): boolean {
  return distance(x, y, p.mouseX, p.mouseY) <= MENU_BUTTON_DIAMETER / 2;
}

/**
 * Mirrors the original `mousePressed`, including its quirks: a click that opens a screen from the
 * menu is also handled by that screen in the same call (the `entered` guard only applies to some branches).
 */
export function handlePress(p: p5, state: WallState, canvas: HTMLCanvasElement): void {
  let entered = false;
  if (state.screen === Screen.Menu) {
    entered = true;
    pressMenu(p, state);
  }
  if (state.screen === Screen.PixelGrid && !entered) pressPixels(p, state);
  if (state.screen === Screen.GenerativeArt) pressGenerativeArt(p, state, canvas);
  if (state.screen === Screen.Webcam || state.screen === Screen.Profile) pressArtwork(p, state);
  if (state.screen === Screen.Webcam) state.webcamStatus = nextWebcam(state.webcamStatus);
}

/** The webcam window cycles 1 → 2 → 3 → 1 on every press. */
export function nextWebcam(status: number): number {
  return status < WEBCAM_COUNT ? status + 1 : 1;
}

function pressMenu(p: p5, state: WallState): void {
  const { first, second, third } = state.menuIcons;
  if (onMenuIcon(p, first)) state.screen = Screen.PixelGrid;
  if (onMenuIcon(p, second)) {
    state.screen = Screen.GenerativeArt;
    p.background(BACKGROUND_COLOR);
  }
  if (onMenuIcon(p, third)) state.screen = Screen.Webcam;
}

function pressPixels(p: p5, state: WallState): void {
  const touchCount = touchesOf(p).length;
  const brush = { shape: state.shapeSelected, color: state.colorSelected };
  for (const pixel of state.pixels) pixel.press(pointer(p), touchCount, state.eraserDragging, brush);
  if (isInHomeCorner(p.mouseX, p.mouseY, p.width, p.height)) state.screen = Screen.Menu;
}

function pressGenerativeArt(p: p5, state: WallState, canvas: HTMLCanvasElement): void {
  if (isInHomeCorner(p.mouseX, p.mouseY, p.width, p.height)) state.screen = Screen.Menu;
  const button = toolbarButtonAt(p.mouseX, p.mouseY, p.height);
  if (button) applyToolbarButton(state, button, canvas);
}

export function applyToolbarButton(state: WallState, button: ToolbarButton, canvas: HTMLCanvasElement): void {
  switch (button) {
    case 'trace':
      state.clearBackground = !state.clearBackground;
      break;
    case 'pause':
      state.paused = !state.paused;
      break;
    case 'cross':
      state.shape = 2;
      break;
    case 'rect':
      state.shape = 3;
      break;
    case 'line':
      state.shape = 1;
      break;
    case 'amountUp':
      if (state.amountShapes < MAX_SHAPES) state.amountShapes = state.amountShapes + SHAPES_STEP;
      break;
    case 'amountDown':
      if (state.amountShapes > MIN_SHAPES) state.amountShapes = state.amountShapes - SHAPES_STEP;
      break;
    case 'print':
      printCanvas(canvas);
      break;
    // speedUp/speedDown: the original passed a number as a force vector and threw a TypeError,
    // so the buttons never changed anything. They stay inert rather than inventing a behaviour.
  }
}

function pressArtwork(p: p5, state: WallState): void {
  const inCorner =
    p.mouseX > p.width - (3 * p.height) / 20 &&
    p.mouseX < p.width &&
    p.mouseY > (69 * p.height) / 80 &&
    p.mouseY < p.height;
  if (inCorner) state.screen = Screen.Menu;
  const onArtist = state.artists.some((a) => distance(a.x, a.y, p.mouseX, p.mouseY) < a.diameter / 2);
  if (onArtist) state.screen = Screen.Profile;
}

export function handleDrag(p: p5, state: WallState): void {
  if (p.mouseX < (1 * p.width) / 25) state.eraserDragging = true;
  if (state.screen !== Screen.PixelGrid) return;
  const touches = touchesOf(p);
  const brush = { shape: state.shapeSelected, color: state.colorSelected };
  for (const pixel of state.pixels) {
    pixel.erase(p.mouseX, state.eraserDragging);
    pixel.pinch(touches, state.eraserDragging);
    pixel.press(pointer(p), touches.length, state.eraserDragging, brush);
  }
}

export function handleRelease(p: p5, state: WallState): void {
  state.eraserDragging = false;
  if (state.screen === Screen.PixelGrid) {
    for (const pixel of state.pixels) pixel.release();
  }
  // Checked on every screen, as in the original.
  if (distance(p.mouseX, p.mouseY, shapeBarX(10, p.width), state.bottomBarY) < PIXEL_SIZE) {
    state.shapeBarOpen = !state.shapeBarOpen;
  }
}

export function handleKey(state: WallState, keyCode: number): void {
  if (keyCode === KEY_WALL) state.generalMode = GeneralMode.Wall;
  if (keyCode === KEY_PLAIN) state.generalMode = GeneralMode.Plain;
}

function printCanvas(canvas: HTMLCanvasElement): void {
  const dataUrl = canvas.toDataURL();
  const printWindow = window.open(
    '',
    '',
    `width=${window.screen.availWidth},height=${window.screen.availHeight}`,
  );
  if (!printWindow) return;
  const image = printWindow.document.createElement('img');
  image.src = dataUrl;
  printWindow.document.title = 'Print canvas';
  printWindow.document.body.append(image);
  image.addEventListener('load', () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  });
}
