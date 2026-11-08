import type { WallConfig } from './config.ts';
import type { Agent } from './flocking.ts';
import type { Pixel } from './pixel.ts';

export const BACKGROUND_COLOR = '#1E1E1E';
export const BUTTON_COLOR = '#EFD8B9';
export const PAINT_COLORS = [
  '#484B78',
  '#E4AA2D',
  '#C62F40',
  '#58875D',
  '#D0692E',
  BACKGROUND_COLOR,
] as const;
export const MENU_BUTTON_DIAMETER = 160;

export interface Artist {
  x: number;
  y: number;
  diameter: number;
}

/** Everything the original sketch kept in globals shared across its 15 scripts. */
export interface WallState {
  config: WallConfig;
  /** 0 menu, 10–12 pixel grid, 20 generative art, 30 webcam window, 31 artist profile. */
  screen: number;
  /** Keys 1/2 switch between the wall (1) and a plain brown screen (2). */
  generalMode: number;
  showingCursor: boolean;
  cursorHideAt: number;

  pixels: Pixel[];
  eraserDragging: boolean;
  shapeSelected: number;
  colorSelected: number;
  shapeBarOpen: boolean;
  bottomBarY: number;

  menuIcons: { first: [number, number]; second: [number, number]; third: [number, number] };
  artists: Artist[];
  webcamStatus: number;
  noiseStep: number;

  paused: boolean;
  /** When false the background is not cleared, so shapes leave trails. */
  clearBackground: boolean;
  /** 1 lines, 2 crosses, 3 rectangles. */
  shape: number;
  amountShapes: number;
  speedFactor: number;
  groupA: Agent[];
  groupB: Agent[];
}

export function createWallState(config: WallConfig): WallState {
  return {
    config,
    screen: config.screen,
    generalMode: 1,
    showingCursor: true,
    cursorHideAt: 0,
    pixels: [],
    eraserDragging: false,
    shapeSelected: 0,
    colorSelected: 0,
    shapeBarOpen: false,
    bottomBarY: 0,
    menuIcons: { first: [0, 0], second: [0, 0], third: [0, 0] },
    artists: [],
    webcamStatus: 3,
    noiseStep: 0,
    paused: false,
    clearBackground: true,
    shape: 2,
    amountShapes: 1,
    speedFactor: 1,
    groupA: [],
    groupB: [],
  };
}
